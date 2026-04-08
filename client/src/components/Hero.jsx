import { useState } from "react";

export default function Hero({ onGetStarted }) {
  const [query, setQuery] = useState("");
  const [searched, setSearched] = useState(false);

  const handleSearch = () => {
    if (!query.trim()) return;
    setSearched(true);
    // scroll to courses/books
    document
      .getElementById("courses-section")
      ?.scrollIntoView({ behavior: "smooth" });
    setTimeout(() => setSearched(false), 2000);
  };

  return (
    <section className="hero" id="hero">
      <div className="hero-left">
        <div className="badge">
          <span className="badge-dot" />
          Get 30% off on first enroll — Limited Spots
        </div>
        <h1 className="hero-title">
          Enter Your
          <br />
          <span>Deep Work</span>
          <br />
          Zone.
        </h1>
        <p className="hero-sub">
          A unified split-view workspace for CS engineers. Study DSA &amp;
          Full-Stack without ever switching a tab.
        </p>

        <div className="search-bar">
          <input
            type="text"
            placeholder="search courses, topics, resources..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <button className="search-btn" onClick={handleSearch}>
            {searched ? (
              <svg viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            )}
          </button>
        </div>

        <div className="hero-tags">
          {[
            { label: "Flow State Timer", target: "how" },
            { label: "Split Workspace", target: "how" },
            { label: "Knowledge Graph", target: "features" },
          ].map(({ label, target }) => (
            <div
              key={label}
              className="htag"
              style={{ cursor: "pointer" }}
              onClick={() =>
                document
                  .getElementById(target)
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              <svg viewBox="0 0 24 24">
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {label}
            </div>
          ))}
        </div>

        <button
          className="btn-solid"
          style={{ marginTop: "24px", padding: "12px 32px", fontSize: "1rem" }}
          onClick={onGetStarted}
        >
          Start Learning Free →
        </button>
      </div>

      <div className="hero-right">
        <div className="hero-visual">
          <div className="split-mockup">
            <div className="mockup-bar">
              <div className="mock-dot" style={{ background: "#ff5f57" }} />
              <div className="mock-dot" style={{ background: "#febc2e" }} />
              <div className="mock-dot" style={{ background: "#28c840" }} />
            </div>
            <div className="mockup-body">
              <div className="mock-pane">
                <div
                  className="mock-line"
                  style={{ color: "#aac5b5", fontSize: ".58rem" }}
                >
                  📖 Binary Search Tree
                </div>
                <div className="mock-line">&nbsp;</div>
                <div className="mock-line">
                  <span className="mock-kw">BST</span> Operations
                </div>
                <div className="mock-line">Insert → O(log n)</div>
                <div className="mock-line">Delete → O(log n)</div>
                <div className="mock-line">Search → O(log n)</div>
                <div className="mock-line mock-comment">// worst case O(n)</div>
              </div>
              <div className="mock-pane">
                <div
                  className="mock-line"
                  style={{ color: "#aac5b5", fontSize: ".58rem" }}
                >
                  📝 My Notes
                </div>
                <div className="mock-line">&nbsp;</div>
                <div className="mock-line">
                  <span className="mock-kw">class</span> Node {"{"}
                </div>
                <div className="mock-line">&nbsp; int data;</div>
                <div className="mock-line">&nbsp; Node left, right;</div>
                <div className="mock-line">{"}"}</div>
                <div className="mock-line">
                  <span className="mock-kw">void</span> insert(int val)
                </div>
              </div>
            </div>
          </div>
          <div className="stats-card">
            <div className="stats-label">No. of Active Learners</div>
            <div className="bars">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bar" />
              ))}
            </div>
          </div>
          <div
            className="fcard fcard-bottom"
            style={{ cursor: "pointer" }}
            onClick={() =>
              document
                .getElementById("courses-section")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            <div className="fcard-icon">
              <svg viewBox="0 0 24 24">
                <rect x="2" y="3" width="20" height="14" rx="2" />
                <line x1="8" y1="21" x2="16" y2="21" />
                <line x1="12" y1="17" x2="12" y2="21" />
              </svg>
            </div>
            <div>
              <div className="fcard-title">50+ Available Courses</div>
              <div className="fcard-sub">DSA · Full-Stack · System Design</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
