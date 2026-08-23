import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import StatsRow from "./components/StatsRow";
import Books from "./components/Books";
import Features from "./components/Features";
import HowItWorks from "./components/HowItWorks";
import Courses from "./components/Courses";
import Roadmap from "./components/Roadmap";
import { CTA, Footer } from "./components/CtaFooter";
import Dashboard from "./components/Dashboard";
import useScrollReveal from "./hooks/useScrollReveal";

/* ── MODAL OVERLAY ── */
function Modal({ title, message, emoji, onClose, actions }) {
  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ position:"fixed", inset:0, zIndex:9999, background:"rgba(5,20,10,.7)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px", animation:"mfade .2s ease" }}
    >
      <style>{`@keyframes mfade{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}}`}</style>
      <div style={{ background:"#fff", borderRadius:"24px", padding:"40px", maxWidth:"440px", width:"100%", textAlign:"center", boxShadow:"0 32px 80px rgba(0,0,0,.25)" }}>
        <div style={{ fontSize:"3rem", marginBottom:"16px" }}>{emoji}</div>
        <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1.4rem", color:"#0a1a12", marginBottom:"10px" }}>{title}</h2>
        <p style={{ color:"#5a7a68", fontSize:".95rem", lineHeight:1.6, marginBottom:"28px" }}>{message}</p>
        <div style={{ display:"flex", gap:"12px", justifyContent:"center", flexWrap:"wrap" }}>
          {actions.map((action, i) => (
            <button key={i} onClick={action.onClick} style={{ padding:"11px 28px", borderRadius:"50px", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".92rem", border:i===0 ? "none" : "1.5px solid #c6ead8", background:i===0 ? "#0a6e3f" : "transparent", color:i===0 ? "#fff" : "#0a6e3f", transition:"all .2s" }}>
              {action.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── TOAST NOTIFICATION ── */
function Toast({ toasts }) {
  return (
    <div style={{ position:"fixed", bottom:"28px", right:"28px", zIndex:9998, display:"flex", flexDirection:"column", gap:"10px" }}>
      {toasts.map((t) => (
        <div key={t.id} style={{ background:"#0a6e3f", color:"#fff", padding:"12px 20px", borderRadius:"12px", fontFamily:"'DM Sans',sans-serif", fontSize:".88rem", fontWeight:500, boxShadow:"0 8px 24px rgba(10,110,63,.3)", display:"flex", alignItems:"center", gap:"10px", animation:"slideIn .3s ease", minWidth:"260px" }}>
          <span style={{ fontSize:"1.1rem" }}>{t.emoji}</span>
          {t.message}
        </div>
      ))}
      <style>{`@keyframes slideIn{from{opacity:0;transform:translateX(40px)}to{opacity:1;transform:translateX(0)}}`}</style>
    </div>
  );
}

/* ── AUTH ICONS ── */
const IconMail = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="4" width="20" height="16" rx="3" /><path d="m22 7-10 6L2 7" />
  </svg>
);
const IconLock = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="4" y="11" width="16" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" />
  </svg>
);
const IconUser = (props) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7" />
  </svg>
);
const IconEye = (props) => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7Z" /><circle cx="12" cy="12" r="3" />
  </svg>
);
const IconEyeOff = (props) => (
  <svg viewBox="0 0 24 24" width="17" height="17" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 7 11 7a13.16 13.16 0 0 1-1.67 2.68M6.61 6.61C3.35 8.36 1 12 1 12s4 7 11 7a9.26 9.26 0 0 0 5.39-1.61M14.12 14.12a3 3 0 1 1-4.24-4.24" />
    <path d="M1 1l22 22" />
  </svg>
);

// Left branding panel shared by Sign In / Sign Up
function AuthBrandPanel({ emoji, title, tagline }) {
  const points = [
    "50+ hands-on courses across DSA, Full-Stack & System Design",
    "AI Tutor powered by Gemini — real-time, streamed answers",
    "Split-view workspace built for deep, focused study sessions",
  ];
  return (
    <div style={{
      background: "linear-gradient(160deg,#0a6e3f,#0d3d24 120%)",
      padding: "44px 36px", display: "flex", flexDirection: "column",
      justifyContent: "space-between", position: "relative", overflow: "hidden",
      minHeight: "100%",
    }}>
      <div style={{
        position: "absolute", top: "-60px", right: "-60px", width: "220px", height: "220px",
        borderRadius: "50%", background: "rgba(255,255,255,.06)",
      }} />
      <div style={{
        position: "absolute", bottom: "-40px", left: "-40px", width: "160px", height: "160px",
        borderRadius: "50%", background: "rgba(255,255,255,.05)",
      }} />
      <div style={{ position: "relative" }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16, background: "rgba(255,255,255,.12)",
          display: "grid", placeItems: "center", fontSize: "1.7rem", marginBottom: 24,
        }}>
          {emoji}
        </div>
        <h2 style={{ fontFamily: "'Syne',sans-serif", fontWeight: 800, fontSize: "1.6rem", color: "#fff", lineHeight: 1.25 }}>
          {title}
        </h2>
        <p style={{ color: "rgba(255,255,255,.75)", fontSize: ".92rem", marginTop: 10, lineHeight: 1.5 }}>
          {tagline}
        </p>
      </div>
      <div style={{ position: "relative", display: "flex", flexDirection: "column", gap: 14, marginTop: 32 }}>
        {points.map((p) => (
          <div key={p} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{
              width: 20, height: 20, borderRadius: "50%", background: "rgba(255,255,255,.15)",
              display: "grid", placeItems: "center", flexShrink: 0, marginTop: 1, fontSize: ".68rem", color: "#8ff0c0",
            }}>✓</span>
            <span style={{ color: "rgba(255,255,255,.85)", fontSize: ".82rem", lineHeight: 1.5 }}>{p}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Reusable icon-prefixed input field
function AuthField({ icon: Icon, label, type, value, onChange, placeholder, onKeyDown, showToggle, visible, onToggleVisible }) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: "block", fontSize: ".82rem", fontWeight: 600, color: "#0a1a12", marginBottom: 6 }}>{label}</label>
      <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
        <Icon style={{ position: "absolute", left: 14, color: "#8aab98", pointerEvents: "none" }} />
        <input
          type={showToggle ? (visible ? "text" : "password") : type}
          value={value}
          placeholder={placeholder}
          onChange={onChange}
          onKeyDown={onKeyDown}
          style={{
            width: "100%", padding: showToggle ? "12px 44px 12px 42px" : "12px 16px 12px 42px",
            borderRadius: 10, border: "1.5px solid #c6ead8", fontSize: ".92rem",
            fontFamily: "'DM Sans',sans-serif", color: "#0a1a12", outline: "none", boxSizing: "border-box",
          }}
        />
        {showToggle && (
          <button
            type="button"
            onClick={onToggleVisible}
            style={{ position: "absolute", right: 12, background: "none", border: "none", cursor: "pointer", color: "#8aab98", display: "flex" }}
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <IconEyeOff /> : <IconEye />}
          </button>
        )}
      </div>
    </div>
  );
}

/* ── SIGN IN MODAL ── */
function SignInModal({ onClose, onSwitch, onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass]   = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async () => {
    if (!email || !pass) { setError("Please fill all fields"); return; }
    setLoading(true); setError("");
    try {
      const data = await onLogin(email, pass);
      onClose("signin", data?.user?.name);
    } catch (err) {
      setError(err.response?.data?.message || "Login failed! Check your credentials.");
    } finally { setLoading(false); }
  };

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{ position:"fixed", inset:0, zIndex:9999, background:"rgba(5,20,10,.75)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px", animation:"mfade .2s ease" }}>
      <style>{`@keyframes mfade{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}} input:focus{outline:2px solid #12a05c !important;border-color:transparent !important;}`}</style>
      <div style={{
        background:"#fff", borderRadius:"24px", maxWidth:"780px", width:"100%",
        boxShadow:"0 32px 80px rgba(0,0,0,.3)", overflow:"hidden",
        display:"grid", gridTemplateColumns:"minmax(0,1fr) minmax(0,1.15fr)",
      }} className="auth-modal-grid">
        <AuthBrandPanel emoji="👋" title="Welcome back to Deep Focus" tagline="Sign in to pick up right where you left off." />

        <div style={{ padding:"44px 40px" }}>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1.35rem", color:"#0a1a12", marginBottom:4 }}>Sign In</h2>
          <p style={{ color:"#5a7a68", fontSize:".85rem", marginBottom:24 }}>Enter your details to continue</p>

          {error && <div style={{ background:"#fff0f0", border:"1.5px solid #ffcccc", color:"#cc0000", borderRadius:"10px", padding:"10px 14px", fontSize:".84rem", marginBottom:"16px", textAlign:"center" }}>⚠️ {error}</div>}

          <AuthField icon={IconMail} label="Email" type="email" value={email} placeholder="you@email.com"
            onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key==="Enter" && handleSubmit()} />
          <AuthField icon={IconLock} label="Password" value={pass} placeholder="••••••••" showToggle visible={showPass}
            onToggleVisible={() => setShowPass((p) => !p)}
            onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => e.key==="Enter" && handleSubmit()} />

          <button onClick={handleSubmit} disabled={loading} style={{ width:"100%", padding:"13px", borderRadius:"12px", border:"none", background:loading ? "#a8f0cc" : "#0a6e3f", color:"#fff", cursor:loading ? "not-allowed" : "pointer", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"1rem", marginTop:"8px", transition:"background .2s, transform .15s", boxShadow: loading ? "none" : "0 8px 20px rgba(10,110,63,.25)" }}>
            {loading ? "Signing in..." : "Sign In →"}
          </button>
          <p style={{ textAlign:"center", marginTop:"20px", fontSize:".85rem", color:"#5a7a68" }}>
            Don't have an account?{" "}
            <span onClick={onSwitch} style={{ color:"#0a6e3f", fontWeight:600, cursor:"pointer", textDecoration:"underline" }}>Sign Up</span>
          </p>
          <button onClick={onClose} style={{ display:"block", margin:"10px auto 0", background:"none", border:"none", color:"#aac5b5", cursor:"pointer", fontSize:".82rem" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ── SIGN UP MODAL ── */
function SignUpModal({ onClose, onSwitch, onRegister }) {
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass]   = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async () => {
    if (!name || !email || !pass) { setError("Please fill all fields"); return; }
    if (pass.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true); setError("");
    try {
      const data = await onRegister(name, email, pass);
      onClose("signup", data?.user?.name); // logged in immediately — no email verification step
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed! Try again.");
    } finally { setLoading(false); }
  };

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{ position:"fixed", inset:0, zIndex:9999, background:"rgba(5,20,10,.75)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px", animation:"mfade .2s ease" }}>
      <div style={{
        background:"#fff", borderRadius:"24px", maxWidth:"780px", width:"100%",
        boxShadow:"0 32px 80px rgba(0,0,0,.3)", overflow:"hidden",
        display:"grid", gridTemplateColumns:"minmax(0,1fr) minmax(0,1.15fr)",
      }} className="auth-modal-grid">
        <AuthBrandPanel emoji="🚀" title="Join 12,000+ engineers on Deep Focus" tagline="Create your free account and start learning in minutes." />

        <div style={{ padding:"44px 40px" }}>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1.35rem", color:"#0a1a12", marginBottom:4 }}>Create Account</h2>
          <p style={{ color:"#5a7a68", fontSize:".85rem", marginBottom:24 }}>It's free — no credit card needed</p>

          {error && <div style={{ background:"#fff0f0", border:"1.5px solid #ffcccc", color:"#cc0000", borderRadius:"10px", padding:"10px 14px", fontSize:".84rem", marginBottom:"16px", textAlign:"center" }}>⚠️ {error}</div>}

          <AuthField icon={IconUser} label="Full Name" type="text" value={name} placeholder="Alice Johnson"
            onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key==="Enter" && handleSubmit()} />
          <AuthField icon={IconMail} label="Email" type="email" value={email} placeholder="you@email.com"
            onChange={(e) => setEmail(e.target.value)} onKeyDown={(e) => e.key==="Enter" && handleSubmit()} />
          <AuthField icon={IconLock} label="Password" value={pass} placeholder="6+ characters" showToggle visible={showPass}
            onToggleVisible={() => setShowPass((p) => !p)}
            onChange={(e) => setPass(e.target.value)} onKeyDown={(e) => e.key==="Enter" && handleSubmit()} />

          <button onClick={handleSubmit} disabled={loading} style={{ width:"100%", padding:"13px", borderRadius:"12px", border:"none", background:loading ? "#a8f0cc" : "#0a6e3f", color:"#fff", cursor:loading ? "not-allowed" : "pointer", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"1rem", marginTop:"8px", transition:"background .2s, transform .15s", boxShadow: loading ? "none" : "0 8px 20px rgba(10,110,63,.25)" }}>
            {loading ? "Creating account..." : "Get Started Free →"}
          </button>
          <p style={{ textAlign:"center", marginTop:"20px", fontSize:".85rem", color:"#5a7a68" }}>
            Already have an account?{" "}
            <span onClick={onSwitch} style={{ color:"#0a6e3f", fontWeight:600, cursor:"pointer", textDecoration:"underline" }}>Sign In</span>
          </p>
          <button onClick={onClose} style={{ display:"block", margin:"10px auto 0", background:"none", border:"none", color:"#aac5b5", cursor:"pointer", fontSize:".82rem" }}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

/* ── DEMO MODAL ── */
function DemoModal({ onClose }) {
  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{ position:"fixed", inset:0, zIndex:9999, background:"rgba(5,20,10,.8)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px", animation:"mfade .2s ease" }}>
      <div style={{ background:"#0a1a12", borderRadius:"24px", padding:"0", maxWidth:"640px", width:"100%", overflow:"hidden", boxShadow:"0 40px 100px rgba(0,0,0,.5)" }}>
        <div style={{ background:"linear-gradient(135deg,#0a6e3f,#12a05c)", padding:"20px 28px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, color:"#fff", fontSize:"1.1rem" }}>🎬 Deep Focus — Demo</div>
            <div style={{ color:"rgba(255,255,255,.65)", fontSize:".8rem", marginTop:"3px" }}>See how it works in 2 minutes</div>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,.15)", border:"none", color:"#fff", width:"34px", height:"34px", borderRadius:"50%", cursor:"pointer", fontSize:"1rem", display:"grid", placeItems:"center" }}>✕</button>
        </div>
        <div style={{ background:"#0d2318", aspectRatio:"16/9", display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", gap:"16px" }}>
          <div style={{ width:"72px", height:"72px", borderRadius:"50%", background:"#0a6e3f", display:"grid", placeItems:"center", cursor:"pointer", boxShadow:"0 0 0 12px rgba(18,160,92,.15)", fontSize:"1.8rem" }}>▶</div>
          <div style={{ color:"rgba(255,255,255,.5)", fontSize:".82rem", fontFamily:"'JetBrains Mono',monospace" }}>demo_video.mp4 • 2:14</div>
        </div>
        <div style={{ padding:"20px 28px", display:"flex", gap:"12px" }}>
          {["Split Workspace","Flow Timer","Book Reader","Knowledge Graph"].map((feat) => (
            <span key={feat} style={{ background:"rgba(18,160,92,.12)", color:"#1ec97a", padding:"5px 12px", borderRadius:"50px", fontSize:".72rem", fontWeight:600, fontFamily:"'JetBrains Mono',monospace", border:"1px solid rgba(18,160,92,.2)" }}>{feat}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ── ENROLL SUCCESS MODAL ── */
function EnrollModal({ course, onClose }) {
  return (
    <Modal
      emoji="🎉"
      title={`Enrolled in ${course?.tag}!`}
      message={`You've successfully enrolled in "${course?.title}". Start your first lesson now and enter flow state!`}
      onClose={onClose}
      actions={[
        { label:"Start Learning →", onClick:() => { onClose(); document.getElementById("how")?.scrollIntoView({ behavior:"smooth" }); } },
        { label:"Browse More", onClick:onClose },
      ]}
    />
  );
}

/* ── MAIN PAGE ── */
function MainPage() {
  const { user, login, register, logout } = useAuth();
  useScrollReveal();
  const [modal, setModal]                 = useState(null);
  const [dashboardTab, setDashboardTab]   = useState("overview");
  const [enrolledCourse, setEnrolledCourse] = useState(null);
  const [toasts, setToasts]               = useState([]);

  const addToast = (message, emoji = "✅") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, emoji }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
  };

  const handleSignInClose = (type, name) => {
    setModal(null);
    if (type === "signin") addToast(`Welcome back, ${name || ""}! 👋`, "👋");
    if (type === "signup") addToast(`Welcome to Deep Focus, ${name || ""}! 🎉`, "🎉");
  };

  const handleDashboard = () => { setDashboardTab("overview"); setModal("dashboard"); };

  const handleAiTutor = () => {
    if (!user) {
      setModal("signin");
      addToast("Please sign in to chat with the AI Tutor!", "🔒");
      return;
    }
    setDashboardTab("ai");
    setModal("dashboard");
  };

  const handleLogout = async () => {
    await logout();
    addToast("Logged out successfully!", "👋");
  };

  const handleEnroll = (course) => {
    if (!user) {
      setModal("signin");
      addToast("Please sign in to enroll in courses!", "🔒");
      return;
    }
    setEnrolledCourse(course);
    setModal("enroll");
    addToast(`Enrolled in ${course.title}! 🎉`, "🎉");
  };

  return (
    <>
      <Navbar
        onSignIn={() => setModal("signin")}
        onGetStarted={() => setModal("signup")}
        user={user}
        onDashboard={handleDashboard}
        onLogout={handleLogout}
        onAiTutor={handleAiTutor}
      />
      <Hero onGetStarted={() => setModal("signup")} />
      <StatsRow />
      <Books />
      <Features />
      <HowItWorks />
      <Courses onEnroll={handleEnroll} />
      <Roadmap />
      <CTA onGetStarted={() => setModal("signup")} onWatchDemo={() => setModal("demo")} />
      <Footer />

      {modal === "dashboard" && <Dashboard onClose={() => setModal(null)} initialTab={dashboardTab} />}
      {modal === "signin"    && <SignInModal onClose={handleSignInClose} onSwitch={() => setModal("signup")} onLogin={login} />}
      {modal === "signup"    && <SignUpModal onClose={handleSignInClose} onSwitch={() => setModal("signin")} onRegister={register} />}
      {modal === "demo"      && <DemoModal onClose={() => setModal(null)} />}
      {modal === "enroll"    && <EnrollModal course={enrolledCourse} onClose={() => setModal(null)} />}

      <Toast toasts={toasts} />
    </>
  );
}

/* ── MAIN APP with ROUTER ── */
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}