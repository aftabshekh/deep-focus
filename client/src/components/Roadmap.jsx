const ROADMAP = [
  {
    quarter: "Q3 2025",
    title: "🤖 AI Summary Engine",
    desc: "Gemini API integration to auto-summarize articles into concise bullet points on demand.",
  },
  {
    quarter: "Q4 2025",
    title: "🤝 Collaborative Study Rooms",
    desc: "Real-time socket-based shared workspaces for group study with live note-syncing.",
  },
  {
    quarter: "Q1 2026",
    title: "🃏 Flashcard Generator",
    desc: "Automated transformation of code snippets into spaced-repetition flashcards for long-term retention.",
  },
];

export default function Roadmap() {
  return (
    <section className="roadmap" id="roadmap">
      <div className="section-label">Roadmap</div>
      <h2 className="section-title">What&apos;s coming next.</h2>
      <p className="section-sub">
        We&apos;re building the future of focused learning — one sprint at a
        time.
      </p>
      <div className="road-grid">
        {ROADMAP.map(({ quarter, title, desc }) => (
          <div key={quarter} className="road-card">
            <div className="road-tag">{quarter}</div>
            <div className="road-title">{title}</div>
            <div className="road-desc">{desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
