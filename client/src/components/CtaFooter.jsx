export function CTA({ onGetStarted, onWatchDemo }) {
  return (
    <section className="cta">
      <h2 className="cta-title">
        Stop switching tabs.
        <br />
        Start learning deeply.
      </h2>
      <p className="cta-sub">
        Join 12,000+ engineers who&apos;ve already entered their flow state with
        Deep Focus.
      </p>
      <div className="cta-actions">
        <button className="cta-btn-main" onClick={onGetStarted}>
          Start Free Today
        </button>
        <button className="cta-btn-ghost" onClick={onWatchDemo}>
          Watch Demo →
        </button>
      </div>
    </section>
  );
}

export function Footer() {
  return (
    <footer>
      <div className="foot-logo">DeepFocus •</div>
      <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
        <a
          href="#hero"
          style={{
            color: "rgba(255,255,255,.4)",
            fontSize: ".82rem",
            textDecoration: "none",
          }}
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById("hero")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Home
        </a>
        <a
          href="#courses-section"
          style={{
            color: "rgba(255,255,255,.4)",
            fontSize: ".82rem",
            textDecoration: "none",
          }}
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById("courses-section")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Courses
        </a>
        <a
          href="#books-section"
          style={{
            color: "rgba(255,255,255,.4)",
            fontSize: ".82rem",
            textDecoration: "none",
          }}
          onClick={(e) => {
            e.preventDefault();
            document
              .getElementById("books-section")
              ?.scrollIntoView({ behavior: "smooth" });
          }}
        >
          Books
        </a>
      </div>
      <div className="foot-copy">
        © 2025 Deep Focus. Built for engineers, by engineers.
      </div>
    </footer>
  );
}
