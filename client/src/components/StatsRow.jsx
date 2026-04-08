const STATS = [
  { num: "12", suffix: "K+", desc: "Active Learners" },
  { num: "50", suffix: "+", desc: "Expert Courses" },
  { num: "40", suffix: "%", desc: "Less Tab Switching" },
  { num: "4.9", suffix: "★", desc: "Average Rating" },
];

export default function StatsRow() {
  return (
    <div className="stats-row">
      {STATS.map(({ num, suffix, desc }) => (
        <div key={desc} className="stat-item">
          <div className="stat-num">
            {num}
            <span>{suffix}</span>
          </div>
          <div className="stat-desc">{desc}</div>
        </div>
      ))}
    </div>
  );
}
