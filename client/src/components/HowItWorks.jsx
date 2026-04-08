import { useState, useEffect } from "react";

const STEPS = [
  {
    num: "01",
    title: "Pick a Course & Resource",
    desc: "Browse 50+ courses or paste any URL directly into your workspace panel.",
  },
  {
    num: "02",
    title: "Start the Flow Timer",
    desc: "Launch a 25-minute deep work sprint. The UI shifts to distraction-free Focus Mode.",
  },
  {
    num: "03",
    title: "Write Technical Notes",
    desc: "Use the split Markdown editor to capture notes with syntax-highlighted code blocks.",
  },
  {
    num: "04",
    title: "Review Your Knowledge Graph",
    desc: "Every note auto-links to its source. Revisit your mapped knowledge anytime.",
  },
];

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [secs, setSecs] = useState(24 * 60 + 38);

  useEffect(() => {
    const id = setInterval(() => setSecs((s) => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);

  const mm = String(Math.floor(secs / 60)).padStart(2, "0");
  const ss = String(secs % 60).padStart(2, "0");

  return (
    <section className="how" id="how">
      <div className="section-label">How It Works</div>
      <h2 className="section-title">
        Your Deep Work ritual,
        <br />
        in 4 steps.
      </h2>

      <div className="how-grid">
        <div className="steps">
          {STEPS.map((step, i) => (
            <div
              key={step.num}
              className={`step${activeStep === i ? " active" : ""}`}
              onClick={() => setActiveStep(i)}
            >
              <div className="step-num">{step.num}</div>
              <div>
                <div className="step-title">{step.title}</div>
                <div className="step-desc">{step.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="how-visual">
          <div className="timer-display">
            <div className="timer-label">⚡ Flow State Active</div>
            <div className="timer-clock">
              {mm}:{ss}
            </div>
            <div className="timer-progress">
              <div className="timer-fill" />
            </div>
          </div>
          <div className="note-preview">
            <div className="np-h"># Binary Search Tree Notes</div>
            <br />
            <div>## Insert Operation</div>
            <div>
              <span className="np-kw">function</span> insert(root, val) {"{"}
            </div>
            <div>
              &nbsp;&nbsp;<span className="np-kw">if</span> (!root){" "}
              <span className="np-kw">return new</span> Node(val);
            </div>
            <div>
              &nbsp;&nbsp;<span className="np-kw">if</span> (val &lt; root.val)
            </div>
            <div>
              &nbsp;&nbsp;&nbsp;&nbsp;root.left = insert(root.left, val);
            </div>
            <div>
              &nbsp;&nbsp;<span className="np-kw">else</span>
            </div>
            <div>
              &nbsp;&nbsp;&nbsp;&nbsp;root.right = insert(root.right, val);
            </div>
            <div>
              &nbsp;&nbsp;<span className="np-kw">return</span> root;
            </div>
            <div>{"}"}</div>
            <br />
            <div style={{ color: "#aac5b5" }}>
              // Time: O(log n) avg | O(n) worst
            </div>
            <div style={{ color: "#aac5b5" }}>
              // Source: Linked automatically ✓
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
