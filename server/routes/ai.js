import express from 'express';
import { GoogleGenAI } from '@google/genai';

const router = express.Router();

let aiClient = null;
function getAiClient() {
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

const MODEL_NAME = 'gemini-3.5-flash-lite';
const REQUEST_TIMEOUT_MS = 15000; // 15s — fail fast so we can see what's happening

const SYSTEM_INSTRUCTION = (subject) => `You are "Deep Focus AI Tutor" — an expert, friendly ${subject || 'Computer Science'} tutor for engineering students.
Rules:
- Keep answers focused, clear and student-friendly. Prefer short paragraphs, bullet points and small code blocks over long essays.
- Use examples wherever they help understanding (code, diagrams-in-text, analogies).
- If the student's question is ambiguous, make a reasonable assumption and answer directly instead of just asking for clarification.
- Remember the earlier turns in this conversation and answer follow-up questions ("explain more", "give an example", "why?") using that context.
- Never break character or mention that you are Gemini — you are the Deep Focus AI Tutor.`;

function toGeminiHistory(history = []) {
  return history
    .filter((m) => m && m.text && (m.role === 'user' || m.role === 'model'))
    .map((m) => ({ role: m.role, parts: [{ text: m.text }] }));
}

function withTimeout(promise, ms, label) {
  let timer;
  const timeout = new Promise((_, reject) => {
    timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms / 1000}s`)), ms);
  });
  return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
}

function friendlyErrorMessage(err) {
  const msg = err?.message || '';
  if (msg.includes('timed out')) return 'AI Tutor took too long to respond — your network might be blocking access to Gemini.';
  if (msg.includes('API key') || msg.includes('API_KEY_INVALID') || msg.includes('403')) return 'AI Tutor is misconfigured (invalid API key).';
  if (msg.includes('429') || msg.toLowerCase().includes('quota')) return 'AI Tutor is receiving too many requests right now. Please wait a moment.';
  if (msg.includes('UNAVAILABLE') || msg.includes('503')) return "Gemini's servers are experiencing high demand. Please try again in a few seconds.";
  return 'AI service failed. Please try again.';
}

router.post('/ask-stream', async (req, res) => {
  const { question, subject, history } = req.body || {};
  console.log('[ai] /ask-stream hit. question:', question);

  if (!question || !question.trim()) {
    return res.status(400).json({ error: 'Question required' });
  }

  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache, no-transform',
    Connection: 'keep-alive',
    'X-Accel-Buffering': 'no',
  });
  res.flushHeaders?.();
  console.log('[ai] SSE headers sent');

  const send = (event, data) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  let clientClosed = false;
  res.on('close', () => { clientClosed = true; console.log('[ai] response connection closed'); });

  try {
    console.log('[ai] creating chat...');
    const chat = getAiClient().chats.create({
      model: MODEL_NAME,
      config: { systemInstruction: SYSTEM_INSTRUCTION(subject) },
      history: toGeminiHistory(history),
    });
    console.log('[ai] chat created, calling sendMessageStream...');

    const streamResult = await withTimeout(
      chat.sendMessageStream({ message: question }),
      REQUEST_TIMEOUT_MS,
      'Gemini request'
    );
    console.log('[ai] got streamResult, starting to read chunks...');

    let fullText = '';
    let gotAnyChunk = false;
    let chunkCount = 0;

    const streamPromise = (async () => {
      for await (const chunk of streamResult) {
        chunkCount++;
        console.log('[ai] chunk #' + chunkCount, 'closed:', clientClosed);
        if (clientClosed) break;
        const chunkText = chunk.text;
        if (chunkText) {
          gotAnyChunk = true;
          fullText += chunkText;
          send('chunk', { text: chunkText });
        }
      }
      console.log('[ai] stream loop finished. total chunks:', chunkCount);
    })();

    await withTimeout(streamPromise, REQUEST_TIMEOUT_MS, 'Gemini stream');

    if (!clientClosed) {
      if (!gotAnyChunk) throw new Error('Gemini returned an empty response');
      console.log('[ai] sending done event, total length:', fullText.length);
      send('done', { text: fullText });
      res.end();
      console.log('[ai] response ended successfully');
    }
  } catch (err) {
    console.error('[ai] CAUGHT ERROR:', err.message);
    if (!clientClosed) {
      send('error', { message: friendlyErrorMessage(err) });
      res.end();
      console.log('[ai] error response ended');
    }
  }
});

router.post('/ask', async (req, res) => {
  try {
    const { question, subject, history } = req.body || {};
    if (!question || !question.trim()) return res.status(400).json({ error: 'Question required' });

    const chat = getAiClient().chats.create({
      model: MODEL_NAME,
      config: { systemInstruction: SYSTEM_INSTRUCTION(subject) },
      history: toGeminiHistory(history),
    });

    const result = await withTimeout(
      chat.sendMessage({ message: question }),
      REQUEST_TIMEOUT_MS,
      'Gemini request'
    );

    res.json({ answer: result.text });
  } catch (err) {
    console.error('[ai] /ask error:', err.message);
    res.status(500).json({ error: friendlyErrorMessage(err) });
  }
});

export default router;