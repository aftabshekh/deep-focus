import { useState, useEffect, useRef } from "react";

export default function Navbar({ onSignIn, onGetStarted, user, onDashboard, onLogout }) {
  const [activeLink, setActiveLink] = useState("hero");
  const [showUserMenu, setShowUserMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ["hero","books-section","features","courses-section","how","roadmap"];
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 120) {
          setActiveLink(id); break;
        }
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setShowUserMenu(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const getInitials = (name) => {
    if (!name) return "U";
    return name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2);
  };

  return (
    <nav>
      <a href="#hero" className="logo">DeepFocus <span className="logo-dot" /></a>

      <ul className="nav-links">
        <li><a href="#hero" className={activeLink === "hero" ? "active" : ""} onClick={() => scrollTo("hero")}>Home</a></li>

        <li>
          <a href="#courses-section" className={activeLink === "courses-section" ? "active" : ""}>
            Courses
            <svg className="nav-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
          </a>
          <div className="dropdown">
            <div className="dropdown-header">Browse Courses</div>
            {[
              { icon: <polyline points="16 18 22 12 16 6" />, title: "DSA Masterclass", sub: "Arrays, Trees, Graphs & DP", badge: "Hot" },
              { icon: <rect x="2" y="3" width="20" height="14" rx="2" />, title: "Full-Stack Dev", sub: "MERN + Deployment", badge: "New" },
              { icon: <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />, title: "AI & ML Fundamentals", sub: "Python, NumPy, PyTorch" },
            ].map((item, i) => (
              <a key={i} className="dd-item" href="#courses-section" onClick={() => scrollTo("courses-section")}>
                <div className="dd-icon"><svg viewBox="0 0 24 24">{item.icon}</svg></div>
                <div>
                  <div className="dd-text-title">{item.title}</div>
                  <div className="dd-text-sub">{item.sub}</div>
                </div>
                {item.badge && <span className="dd-badge">{item.badge}</span>}
              </a>
            ))}
          </div>
        </li>

        <li>
          <a href="#books-section" className={activeLink === "books-section" ? "active" : ""}>
            Books
            <svg className="nav-chevron" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9" /></svg>
          </a>
          <div className="dropdown">
            <div className="dropdown-header">Reading List</div>
            {[
              { title: "Open Data Structures", sub: "Pat Morin — Open License", badge: "DSA" },
              { title: "You Don't Know JS", sub: "Kyle Simpson — CC License", badge: "JS" },
              { title: "System Design Primer", sub: "Donne Martin — MIT License", badge: "CS" },
              { title: "Pro Git", sub: "Chacon & Straub — CC License", badge: "Git" },
            ].map((item, i) => (
              <a key={i} className="dd-item" href="#books-section" onClick={() => scrollTo("books-section")}>
                <div className="dd-icon">
                  <svg viewBox="0 0 24 24">
                    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                  </svg>
                </div>
                <div>
                  <div className="dd-text-title">{item.title}</div>
                  <div className="dd-text-sub">{item.sub}</div>
                </div>
                <span className="dd-badge">{item.badge}</span>
              </a>
            ))}
          </div>
        </li>

        <li><a href="#how" className={activeLink === "how" ? "active" : ""} onClick={() => scrollTo("how")}>Workspace</a></li>
        <li><a href="#roadmap" className={activeLink === "roadmap" ? "active" : ""} onClick={() => scrollTo("roadmap")}>Roadmap</a></li>
      </ul>

      <div className="nav-actions">
        {user ? (
          <div ref={menuRef} style={{ position: "relative" }}>
            <button
              onClick={() => setShowUserMenu((p) => !p)}
              style={{ display:"flex", alignItems:"center", gap:"10px", background:"#f0fdf7", border:"1.5px solid #c6ead8", borderRadius:"50px", padding:"6px 16px 6px 6px", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", transition:"all .2s" }}
            >
              <div style={{ width:"32px", height:"32px", borderRadius:"50%", background:"linear-gradient(135deg,#0a6e3f,#1ec97a)", display:"flex", alignItems:"center", justifyContent:"center", color:"#fff", fontWeight:700, fontSize:".78rem", flexShrink:0 }}>
                {getInitials(user.name)}
              </div>
              <span style={{ fontSize:".88rem", fontWeight:600, color:"#0a1a12", maxWidth:"100px", overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>
                {user.name?.split(" ")[0]}
              </span>
              <svg viewBox="0 0 24 24" style={{ width:"14px", height:"14px", stroke:"#5a7a68", fill:"none", strokeWidth:2, transform:showUserMenu ? "rotate(180deg)" : "rotate(0deg)", transition:"transform .2s" }}>
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </button>

            {showUserMenu && (
              <div style={{ position:"absolute", top:"calc(100% + 10px)", right:0, background:"#fff", borderRadius:"16px", boxShadow:"0 16px 48px rgba(0,0,0,.12)", border:"1px solid #e8f5ee", minWidth:"200px", overflow:"hidden", zIndex:9999 }}>
                <div style={{ padding:"16px", borderBottom:"1px solid #f0fdf7", background:"#f8fffe" }}>
                  <div style={{ fontSize:".88rem", fontWeight:700, color:"#0a1a12" }}>{user.name}</div>
                  <div style={{ fontSize:".76rem", color:"#5a7a68", marginTop:"2px" }}>{user.email}</div>
                </div>

                {[
                  { emoji:"📚", label:"My Courses", onClick:() => scrollTo("courses-section") },
                  { emoji:"📖", label:"My Books",   onClick:() => scrollTo("books-section") },
                  { emoji:"⏱️", label:"Workspace",  onClick:() => scrollTo("how") },
                ].map((item) => (
                  <button key={item.label} onClick={() => { item.onClick(); setShowUserMenu(false); }}
                    style={{ width:"100%", padding:"11px 16px", background:"none", border:"none", textAlign:"left", cursor:"pointer", display:"flex", alignItems:"center", gap:"10px", fontSize:".86rem", color:"#0a1a12", fontFamily:"'DM Sans',sans-serif", transition:"background .15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f0fdf7")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                  >
                    <span>{item.emoji}</span>{item.label}
                  </button>
                ))}

                <div style={{ borderTop:"1px solid #f0fdf7" }}>
                  {/* Dashboard Button */}
                  <button onClick={() => { onDashboard(); setShowUserMenu(false); }}
                    style={{ width:"100%", padding:"11px 16px", background:"none", border:"none", textAlign:"left", cursor:"pointer", display:"flex", alignItems:"center", gap:"10px", fontSize:".86rem", color:"#0a6e3f", fontFamily:"'DM Sans',sans-serif", fontWeight:600, transition:"background .15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#f0fdf7")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                  >
                    <span>📊</span>My Dashboard
                  </button>
                  {/* Logout Button */}
                  <button onClick={() => { onLogout(); setShowUserMenu(false); }}
                    style={{ width:"100%", padding:"11px 16px", background:"none", border:"none", textAlign:"left", cursor:"pointer", display:"flex", alignItems:"center", gap:"10px", fontSize:".86rem", color:"#cc0000", fontFamily:"'DM Sans',sans-serif", transition:"background .15s" }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = "#fff0f0")}
                    onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
                  >
                    <span>🚪</span>Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <>
            <button className="btn-outline" onClick={onSignIn}>Sign In</button>
            <button className="btn-solid" onClick={onGetStarted}>Get Started</button>
          </>
        )}
      </div>
    </nav>
  );
}