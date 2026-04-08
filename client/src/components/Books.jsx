import { useState, useEffect } from "react";
import { BOOKS, BOOK_CATS } from "../data/books";
import BookReader from "./BookReader";
import { useAuth } from "../context/AuthContext";

export default function Books() {
  const { user, startBook, getMyBooks } = useAuth();
  const [activeCat, setActiveCat] = useState("all");
  const [openBook, setOpenBook] = useState(null);
  const [startedIds, setStartedIds] = useState([]);

  // Load already-started books from DB when user logs in
  useEffect(() => {
    if (user) {
      getMyBooks()
        .then((books) => {
          const ids = books.map((b) => b.bookId);
          setStartedIds(ids);
        })
        .catch(() => {});
    } else {
      setStartedIds([]); // reset on logout
    }
  }, [user]);

  const filtered =
    activeCat === "all" ? BOOKS : BOOKS.filter((b) => b.cat === activeCat);

  const handleOpenBook = async (book) => {
    setOpenBook(book);
    // Save to DB only if user is logged in and hasn't started yet
    if (user && !startedIds.includes(book.id)) {
      try {
        await startBook(book.id);
        setStartedIds((prev) => [...prev, book.id]);
      } catch {
        // Already started or error — ignore silently
      }
    }
  };

  return (
    <>
      <section className="books-section" id="books-section">
        <div className="section-label">Free Reading Library</div>
        <h2 className="section-title">
          Open-Source Books —<br />
          Read Right Here, For Free
        </h2>
        <p className="section-sub">
          Freely licensed CS books (MIT / CC / open-source). Click{" "}
          <strong>📖 Read Now</strong> to open a detailed preview with chapters,
          or <strong>⚡ Study Mode</strong> to read alongside your notes.
        </p>

        <div className="books-tabs">
          {BOOK_CATS.map((cat) => (
            <button
              key={cat.id}
              className={`btab${activeCat === cat.id ? " active" : ""}`}
              onClick={() => setActiveCat(cat.id)}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <p
          style={{
            fontSize: ".85rem",
            color: "var(--muted)",
            marginBottom: "24px",
          }}
        >
          Showing{" "}
          <strong style={{ color: "var(--g1)" }}>{filtered.length}</strong>{" "}
          books
        </p>

        <div className="books-grid-new">
          {filtered.map((book) => {
            const started = startedIds.includes(book.id);
            return (
              <div key={book.id} className="bcard">
                <div className={`bcard-cover ${book.coverClass}`}>
                  <div className="bcard-spine" />
                  <div className="bcard-emoji">{book.emoji}</div>
                  <div className="bcard-label">{book.label}</div>
                  <div className="bcard-source-tag">{book.sourceTag}</div>
                  {started && (
                    <div
                      style={{
                        position: "absolute",
                        top: "8px",
                        right: "8px",
                        background: "#1ec97a",
                        color: "#fff",
                        fontSize: ".62rem",
                        fontWeight: 700,
                        padding: "3px 8px",
                        borderRadius: "50px",
                        fontFamily: "'JetBrains Mono', monospace",
                      }}
                    >
                      ✓ Reading
                    </div>
                  )}
                </div>
                <div className="bcard-body">
                  <div className="bcard-cat">{book.cat.toUpperCase()}</div>
                  <div className="bcard-title">{book.title}</div>
                  <div className="bcard-desc">{book.desc}</div>
                  <div
                    style={{
                      fontSize: ".72rem",
                      color: "var(--g2)",
                      fontFamily: "'JetBrains Mono', monospace",
                      marginBottom: "12px",
                    }}
                  >
                    📚 {book.chapters.length} chapters
                  </div>
                  <div className="bcard-actions">
                    <button
                      className="bcard-btn-primary"
                      onClick={() => handleOpenBook(book)}
                    >
                      📖 Read Now
                    </button>
                    <button
                      className="bcard-btn-secondary"
                      onClick={() => handleOpenBook(book)}
                    >
                      ⚡ Study Mode
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {openBook && (
        <BookReader book={openBook} onClose={() => setOpenBook(null)} />
      )}
    </>
  );
}
