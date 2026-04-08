const FEATURES = [
  {
    title: "Split-View Workspace",
    desc: "Embed articles or YouTube videos directly beside your Markdown editor. Zero context-switching, maximum focus.",
    icon: (
      <>
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
      </>
    ),
  },
  {
    title: "Technical Markdown Editor",
    desc: "Rich-text engine with syntax highlighting for Java, JavaScript & C++. Write notes that feel like real code documentation.",
    icon: (
      <>
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </>
    ),
  },
  {
    title: "Flow State Timer",
    desc: "Pomodoro-style 25-minute deep-learning sprints. Track your productive hours and build an unbreakable study streak.",
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <polyline points="12 6 12 12 16 14" />
      </>
    ),
  },
  {
    title: "Smart Resource Mapping",
    desc: "Auto-links external articles to your notes, creating a personal Knowledge Graph for future revision sessions.",
    icon: (
      <>
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </>
    ),
  },
  {
    title: "Collaborative Study",
    desc: "Real-time socket-based note sharing for group study sessions. Learn alongside peers without leaving your workspace.",
    icon: (
      <>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </>
    ),
  },
  {
    title: "AI Summary Engine",
    desc: "Gemini API integration to automatically summarize long articles into concise bullet points for rapid review.",
    icon: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />,
  },
];

export default function Features() {
  return (
    <section className="features" id="features">
      <div className="section-label">Key Features</div>
      <h2 className="section-title">
        Everything you need to
        <br />
        enter flow state.
      </h2>
      <p className="section-sub">
        Built specifically for CS engineers who want to learn deeply — not just
        scroll.
      </p>
      <div className="features-grid">
        {FEATURES.map(({ title, desc, icon }) => (
          <div key={title} className="feat-card">
            <div className="feat-icon">
              <svg viewBox="0 0 24 24">{icon}</svg>
            </div>
            <div className="feat-title">{title}</div>
            <div className="feat-desc">{desc}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
