import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { COURSES } from "../data/courses";
import { BOOKS } from "../data/books";
import AiTutor from './AiTutor';

// ── STAT CARD ──
function StatCard({ emoji, value, label, color }) {
  return (
    <div style={{
      background: "#fff",
      border: "1.5px solid #e0f5ea",
      borderRadius: "16px",
      padding: "20px 24px",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      flex: 1,
      minWidth: "160px",
      boxShadow: "0 2px 12px rgba(10,110,63,.06)",
    }}>
      <div style={{
        width: "48px", height: "48px", borderRadius: "14px",
        background: color || "rgba(18,160,92,.1)",
        display: "grid", placeItems: "center", fontSize: "1.4rem", flexShrink: 0,
      }}>{emoji}</div>
      <div>
        <div style={{
          fontFamily: "'Syne',sans-serif", fontWeight: 800,
          fontSize: "1.6rem", color: "#0a1a12", lineHeight: 1,
        }}>{value}</div>
        <div style={{
          fontSize: ".78rem", color: "#5a7a68",
          fontFamily: "'DM Sans',sans-serif", marginTop: "4px",
        }}>{label}</div>
      </div>
    </div>
  );
}

// ── COURSE PROGRESS CARD ──
function CourseCard({ courseId, progress }) {
  const course = COURSES.find(c => String(c.id) === String(courseId));
  if (!course) return null;

  const pct = Math.min(100, Math.max(0, progress || 0));
  const isComplete = pct >= 100;

  return (
    <div style={{
      background: "#fff",
      border: "1.5px solid #e0f5ea",
      borderRadius: "14px",
      padding: "16px 20px",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      boxShadow: "0 2px 8px rgba(10,110,63,.05)",
    }}>
      <div style={{
        width: "44px", height: "44px", borderRadius: "12px",
        background: "linear-gradient(135deg,#0a6e3f22,#1ec97a22)",
        display: "grid", placeItems: "center",
        fontSize: "1.4rem", flexShrink: 0,
      }}>{course.emoji}</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "'DM Sans',sans-serif", fontWeight: 600,
          fontSize: ".88rem", color: "#0a1a12",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{course.title}</div>
        <div style={{
          fontSize: ".72rem", color: "#5a7a68",
          fontFamily: "'JetBrains Mono',monospace", marginTop: "2px",
        }}>{course.tag}</div>

        <div style={{
          marginTop: "8px", height: "6px",
          background: "#e8f5ef", borderRadius: "99px", overflow: "hidden",
        }}>
          <div style={{
            height: "100%", width: `${pct}%`,
            background: isComplete
              ? "linear-gradient(90deg,#12a05c,#1ec97a)"
              : "linear-gradient(90deg,#0a6e3f,#12a05c)",
            borderRadius: "99px",
            transition: "width .6s ease",
          }} />
        </div>
      </div>

      <div style={{ flexShrink: 0, textAlign: "center", minWidth: "48px" }}>
        {isComplete ? (
          <div style={{
            background: "#d6fae9", color: "#0a6e3f",
            fontSize: ".7rem", fontWeight: 700,
            padding: "4px 10px", borderRadius: "50px",
            fontFamily: "'JetBrains Mono',monospace",
          }}>✓ Done</div>
        ) : (
          <div style={{
            fontFamily: "'Syne',sans-serif", fontWeight: 800,
            fontSize: "1rem", color: "#0a6e3f",
          }}>{pct}%</div>
        )}
      </div>
    </div>
  );
}

// ── BOOK PROGRESS CARD ──
function BookCard({ bookId, currentChapter }) {
  const book = BOOKS.find(b => String(b.id) === String(bookId));
  if (!book) return null;

  const total = book.chapters?.length || 1;
  const current = Math.min(currentChapter || 0, total - 1);
  const pct = Math.round(((current + 1) / total) * 100);

  return (
    <div style={{
      background: "#fff",
      border: "1.5px solid #e0f5ea",
      borderRadius: "14px",
      padding: "16px 20px",
      display: "flex",
      alignItems: "center",
      gap: "16px",
      boxShadow: "0 2px 8px rgba(10,110,63,.05)",
    }}>
      <div style={{
        width: "44px", height: "44px", borderRadius: "12px",
        background: "linear-gradient(135deg,#0a6e3f22,#1ec97a22)",
        display: "grid", placeItems: "center",
        fontSize: "1.4rem", flexShrink: 0,
      }}>{book.emoji}</div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontFamily: "'DM Sans',sans-serif", fontWeight: 600,
          fontSize: ".88rem", color: "#0a1a12",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
        }}>{book.title}</div>
        <div style={{
          fontSize: ".72rem", color: "#5a7a68",
          fontFamily: "'JetBrains Mono',monospace", marginTop: "2px",
        }}>Ch {current + 1} of {total}</div>

        <div style={{
          marginTop: "8px", height: "6px",
          background: "#e8f5ef", borderRadius: "99px", overflow: "hidden",
        }}>
          <div style={{
            height: "100%", width: `${pct}%`,
            background: "linear-gradient(90deg,#0a6e3f,#12a05c)",
            borderRadius: "99px",
            transition: "width .6s ease",
          }} />
        </div>
      </div>

      <div style={{
        flexShrink: 0, fontFamily: "'Syne',sans-serif",
        fontWeight: 800, fontSize: "1rem", color: "#0a6e3f",
        minWidth: "40px", textAlign: "center",
      }}>{pct}%</div>
    </div>
  );
}

// ── EMPTY STATE ──
function EmptyState({ emoji, text, sub }) {
  return (
    <div style={{
      textAlign: "center", padding: "32px 20px",
      background: "#fafffe", borderRadius: "14px",
      border: "1.5px dashed #c6ead8",
    }}>
      <div style={{ fontSize: "2rem", marginBottom: "10px" }}>{emoji}</div>
      <div style={{
        fontFamily: "'DM Sans',sans-serif", fontWeight: 600,
        fontSize: ".9rem", color: "#0a1a12", marginBottom: "6px",
      }}>{text}</div>
      <div style={{ fontSize: ".8rem", color: "#5a7a68" }}>{sub}</div>
    </div>
  );
}

// ── MAIN DASHBOARD ──
export default function Dashboard({ onClose }) {
  const { user, getMyCourses, getMyBooks } = useAuth();
  const [courses, setCourses]     = useState([]);
  const [books, setBooks]         = useState([]);
  const [loading, setLoading]     = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    if (!user) return;
    Promise.all([getMyCourses(), getMyBooks()])
      .then(([c, b]) => { setCourses(c || []); setBooks(b || []); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [user]);

  const completedCourses = courses.filter(c => c.completed).length;
  const avgProgress = courses.length
    ? Math.round(courses.reduce((s, c) => s + (c.progress || 0), 0) / courses.length)
    : 0;

  const firstName = user?.name?.split(" ")[0] || "Friend";
  const joinDate  = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
    : "";

  // ✅ "ai" tab added
  const tabs = ["overview", "courses", "books", "ai"];

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{
        position: "fixed", inset: 0, zIndex: 9999,
        background: "rgba(5,20,10,.75)",
        backdropFilter: "blur(8px)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
      }}
    >
      <style>{`
        @keyframes dfadeIn { from{opacity:0;transform:scale(.97)} to{opacity:1;transform:scale(1)} }
        .dscroll::-webkit-scrollbar { width: 4px; }
        .dscroll::-webkit-scrollbar-thumb { background: #c6ead8; border-radius: 99px; }
        .dscroll::-webkit-scrollbar-track { background: transparent; }
        .dtab { transition: all .18s; cursor: pointer; }
        .dtab:hover { color: #0a6e3f !important; }
      `}</style>

      <div style={{
        width: "100%", maxWidth: "760px", maxHeight: "90vh",
        background: "#f4fdf8", borderRadius: "24px",
        display: "flex", flexDirection: "column",
        boxShadow: "0 40px 100px rgba(0,0,0,.3)",
        overflow: "hidden",
        animation: "dfadeIn .3s cubic-bezier(.16,1,.3,1)",
      }}>

        {/* HEADER */}
        <div style={{
          background: "linear-gradient(135deg,#0a6e3f,#12a05c)",
          padding: "24px 28px 20px", flexShrink: 0,
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontSize: ".75rem", color: "rgba(255,255,255,.65)", marginBottom: "6px", fontFamily: "'JetBrains Mono',monospace" }}>
                👋 Welcome back
              </div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.5rem", color: "#fff", lineHeight: 1.2 }}>
                {firstName}'s Dashboard
              </div>
              {joinDate && (
                <div style={{ fontSize: ".75rem", color: "rgba(255,255,255,.55)", marginTop: "4px" }}>
                  Member since {joinDate}
                </div>
              )}
            </div>
            <button onClick={onClose} style={{
              width: "34px", height: "34px", borderRadius: "50%",
              background: "rgba(255,255,255,.15)",
              border: "1.5px solid rgba(255,255,255,.25)",
              color: "#fff", cursor: "pointer",
              fontSize: "1rem", display: "grid", placeItems: "center",
            }}>✕</button>
          </div>

          {/* ✅ TABS — AI Tutor label */}
          <div style={{ display: "flex", gap: "6px", marginTop: "20px" }}>
            {tabs.map(tab => (
              <button key={tab} className="dtab" onClick={() => setActiveTab(tab)} style={{
                padding: "7px 18px", borderRadius: "50px", border: "none", cursor: "pointer",
                fontFamily: "'DM Sans',sans-serif", fontWeight: 600, fontSize: ".82rem",
                textTransform: "capitalize",
                background: activeTab === tab ? "#fff" : "rgba(255,255,255,.15)",
                color: activeTab === tab ? "#0a6e3f" : "rgba(255,255,255,.8)",
                transition: "all .18s",
              }}>
                {tab === "ai" ? "🤖 AI Tutor" : tab}
              </button>
            ))}
          </div>
        </div>

        {/* BODY */}
        <div className="dscroll" style={{ flex: 1, overflowY: "auto", padding: "24px 28px 32px" }}>
          {loading ? (
            <div style={{ textAlign: "center", padding: "60px 0", color: "#5a7a68", fontFamily: "'DM Sans',sans-serif" }}>
              Loading your data...
            </div>
          ) : (
            <>
              {activeTab === "overview" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                  <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                    <StatCard emoji="🎓" value={courses.length} label="Courses Enrolled" color="rgba(10,110,63,.1)" />
                    <StatCard emoji="✅" value={completedCourses} label="Completed" color="rgba(18,160,92,.1)" />
                    <StatCard emoji="📚" value={books.length} label="Books Started" color="rgba(30,201,122,.1)" />
                    <StatCard emoji="📈" value={`${avgProgress}%`} label="Avg Progress" color="rgba(10,110,63,.08)" />
                  </div>

                  <div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: ".95rem", color: "#0a1a12", marginBottom: "12px" }}>📘 Recent Courses</div>
                    {courses.length === 0 ? (
                      <EmptyState emoji="🎓" text="No courses enrolled yet" sub="Go to Courses section and enroll!" />
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {courses.slice(0, 3).map((c, i) => <CourseCard key={i} courseId={c.courseId} progress={c.progress} />)}
                      </div>
                    )}
                  </div>

                  <div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: ".95rem", color: "#0a1a12", marginBottom: "12px" }}>📖 Currently Reading</div>
                    {books.length === 0 ? (
                      <EmptyState emoji="📚" text="No books started yet" sub="Go to Books section and start reading!" />
                    ) : (
                      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        {books.slice(0, 3).map((b, i) => <BookCard key={i} bookId={b.bookId} currentChapter={b.currentChapter} />)}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === "courses" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: ".95rem", color: "#0a1a12", marginBottom: "4px" }}>All Enrolled Courses ({courses.length})</div>
                  {courses.length === 0
                    ? <EmptyState emoji="🎓" text="No courses enrolled yet" sub="Go to Courses section and enroll!" />
                    : courses.map((c, i) => <CourseCard key={i} courseId={c.courseId} progress={c.progress} />)
                  }
                </div>
              )}

              {activeTab === "books" && (
                <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: 700, fontSize: ".95rem", color: "#0a1a12", marginBottom: "4px" }}>All Books ({books.length})</div>
                  {books.length === 0
                    ? <EmptyState emoji="📚" text="No books started yet" sub="Go to Books section and start reading!" />
                    : books.map((b, i) => <BookCard key={i} bookId={b.bookId} currentChapter={b.currentChapter} />)
                  }
                </div>
              )}

              {/* ✅ AI TUTOR TAB */}
              {activeTab === "ai" && <AiTutor />}
            </>
          )}
        </div>
      </div>
    </div>
  );
}