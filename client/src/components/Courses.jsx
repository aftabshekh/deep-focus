import { useState, useEffect } from "react";
import { COURSES, COURSE_FILTERS } from "../data/courses";
import { useAuth } from "../context/AuthContext";

export default function Courses({ onEnroll }) {
  const { user, enrollCourse, getMyCourses } = useAuth();
  const [activeFilter, setActiveFilter] = useState("all");
  const [enrolledIds, setEnrolledIds] = useState([]);
  const [loadingId, setLoadingId] = useState(null);

  // Load already-enrolled courses from DB when user logs in
  useEffect(() => {
    if (user) {
      getMyCourses()
        .then((courses) => {
          const ids = courses.map((c) => c.courseId);
          setEnrolledIds(ids);
        })
        .catch(() => {});
    } else {
      setEnrolledIds([]); // reset on logout
    }
  }, [user]);

  const filtered =
    activeFilter === "all"
      ? COURSES
      : COURSES.filter((c) => c.cat === activeFilter);

  const handleEnroll = async (course) => {
    if (enrolledIds.includes(course.id)) return;

    // If not logged in, open signin modal (handled by parent App.jsx)
    if (!user) {
      onEnroll(course);
      return;
    }

    setLoadingId(course.id);
    try {
      await enrollCourse(course.id); // save to MongoDB
      setEnrolledIds((prev) => [...prev, course.id]);
      onEnroll(course); // show success modal
    } catch (err) {
      // Already enrolled on server side — still mark locally
      if (err.response?.status === 400) {
        setEnrolledIds((prev) => [...prev, course.id]);
      }
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <section className="courses-section" id="courses-section">
      <div className="section-label">Popular Courses</div>
      <h2 className="section-title">
        Learn from the best.
        <br />
        At your own pace.
      </h2>
      <p className="section-sub">
        Hand-picked courses built for CS engineers — from DSA foundations to
        production-ready system design.
      </p>

      <div className="courses-filter">
        {COURSE_FILTERS.map((f) => (
          <button
            key={f.id}
            className={`cf-btn${activeFilter === f.id ? " active" : ""}`}
            onClick={() => setActiveFilter(f.id)}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="courses-grid">
        {filtered.map((course) => {
          const enrolled = enrolledIds.includes(course.id);
          const isLoading = loadingId === course.id;
          return (
            <div key={course.id} className="course-card">
              <div className={`course-thumb ${course.thumbClass}`}>
                {course.emoji}
              </div>
              <div className="course-body">
                <span className="course-tag">{course.tag}</span>
                <div className="course-title">{course.title}</div>
                <div className="course-desc">{course.desc}</div>
                <div className="course-meta">
                  <div className="course-rating">
                    <span className="star">★</span>
                    {course.rating}
                    <span className="course-students">
                      · {course.students} students
                    </span>
                  </div>
                  <button
                    className="course-enroll"
                    onClick={() => handleEnroll(course)}
                    disabled={enrolled || isLoading}
                    style={{
                      background: enrolled ? "#1ec97a" : isLoading ? "#a8f0cc" : "",
                      cursor: enrolled ? "default" : "pointer",
                    }}
                  >
                    {isLoading ? "Enrolling..." : enrolled ? "✓ Enrolled" : "Enroll →"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
