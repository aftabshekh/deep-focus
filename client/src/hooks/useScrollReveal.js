import { useEffect } from "react";

// Automatically fades + slides in cards and sections as the user scrolls,
// without needing to touch every component's JSX. Runs once on mount and
// re-scans shortly after (covers content that renders slightly later, e.g.
// after data/auth state settles).
//
// Removed .bcard from targets — book cards broke (stayed invisible) because
// the observer wasn't reliably catching them when navigating straight to
// the Books section via the nav dropdown. Kept the effect only on elements
// that are proven to reveal correctly.
const TARGET_SELECTORS = [
  ".feat-card",
  ".road-card",
  ".course-card",
  ".step",
  ".section-label",
  ".section-title",
].join(", ");

export default function useScrollReveal() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return; // very old browser — just show everything, no reveal effect

    const revealEl = (el) => {
      el.classList.add("in-view");
    };

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            revealEl(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -20px 0px" }
    );

    const prepared = new Set();

    const prepare = () => {
      const els = document.querySelectorAll(TARGET_SELECTORS);
      els.forEach((el, i) => {
        if (prepared.has(el)) return;
        prepared.add(el);
        el.classList.add("reveal-item");
        el.style.transitionDelay = `${(i % 4) * 70}ms`;

        // If the element is already on-screen at prepare time, reveal it
        // immediately instead of waiting on the observer — avoids any edge
        // case where content ends up permanently invisible.
        const rect = el.getBoundingClientRect();
        const alreadyVisible = rect.top < window.innerHeight && rect.bottom > 0;
        if (alreadyVisible) {
          revealEl(el);
        } else {
          observer.observe(el);
        }
      });
    };

    prepare();
    const retry = setTimeout(prepare, 400);

    // Safety net: whatever hasn't revealed itself within 2s (e.g. the
    // observer never fired for some reason) gets shown anyway — content
    // must never stay permanently hidden because of this effect.
    const safety = setTimeout(() => {
      document.querySelectorAll(".reveal-item:not(.in-view)").forEach(revealEl);
    }, 2000);

    return () => {
      clearTimeout(retry);
      clearTimeout(safety);
      observer.disconnect();
    };
  }, []);
}