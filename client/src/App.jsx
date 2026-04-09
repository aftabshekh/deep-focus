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
import VerifyEmail from "./pages/VerifyEmail";

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

/* ── SIGN IN MODAL ── */
function SignInModal({ onClose, onSwitch, onLogin }) {
  const [email, setEmail] = useState("");
  const [pass, setPass]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  const handleSubmit = async () => {
    if (!email || !pass) { setError("Please fill all fields"); return; }
    setLoading(true); setError("");
    try {
      await onLogin(email, pass);
      onClose("signin");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed! Check your credentials.");
    } finally { setLoading(false); }
  };

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{ position:"fixed", inset:0, zIndex:9999, background:"rgba(5,20,10,.75)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px", animation:"mfade .2s ease" }}>
      <style>{`@keyframes mfade{from{opacity:0;transform:scale(.95)}to{opacity:1;transform:scale(1)}} input:focus{outline:2px solid #12a05c !important;border-color:transparent !important;}`}</style>
      <div style={{ background:"#fff", borderRadius:"24px", padding:"40px", maxWidth:"420px", width:"100%", boxShadow:"0 32px 80px rgba(0,0,0,.25)" }}>
        <div style={{ textAlign:"center", marginBottom:"28px" }}>
          <div style={{ fontSize:"2.5rem", marginBottom:"10px" }}>👋</div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1.5rem", color:"#0a1a12" }}>Welcome Back!</h2>
          <p style={{ color:"#5a7a68", fontSize:".88rem", marginTop:"6px" }}>Sign in to continue your deep work session</p>
        </div>
        {error && <div style={{ background:"#fff0f0", border:"1.5px solid #ffcccc", color:"#cc0000", borderRadius:"10px", padding:"10px 14px", fontSize:".84rem", marginBottom:"16px", textAlign:"center" }}>⚠️ {error}</div>}
        {[
          { label:"Email",    type:"email",    val:email, set:setEmail, placeholder:"you@email.com" },
          { label:"Password", type:"password", val:pass,  set:setPass,  placeholder:"••••••••" },
        ].map(({ label, type, val, set, placeholder }) => (
          <div key={label} style={{ marginBottom:"16px" }}>
            <label style={{ display:"block", fontSize:".82rem", fontWeight:600, color:"#0a1a12", marginBottom:"6px" }}>{label}</label>
            <input type={type} value={val} placeholder={placeholder} onChange={(e) => set(e.target.value)} onKeyDown={(e) => e.key==="Enter" && handleSubmit()} style={{ width:"100%", padding:"11px 16px", borderRadius:"10px", border:"1.5px solid #c6ead8", fontSize:".92rem", fontFamily:"'DM Sans',sans-serif", color:"#0a1a12", outline:"none", boxSizing:"border-box" }} />
          </div>
        ))}
        <button onClick={handleSubmit} disabled={loading} style={{ width:"100%", padding:"13px", borderRadius:"12px", border:"none", background:loading ? "#a8f0cc" : "#0a6e3f", color:"#fff", cursor:loading ? "not-allowed" : "pointer", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"1rem", marginTop:"8px", transition:"background .2s" }}>
          {loading ? "Signing in..." : "Sign In →"}
        </button>
        <p style={{ textAlign:"center", marginTop:"20px", fontSize:".85rem", color:"#5a7a68" }}>
          Don't have an account?{" "}
          <span onClick={onSwitch} style={{ color:"#0a6e3f", fontWeight:600, cursor:"pointer", textDecoration:"underline" }}>Sign Up</span>
        </p>
        <button onClick={onClose} style={{ display:"block", margin:"10px auto 0", background:"none", border:"none", color:"#aac5b5", cursor:"pointer", fontSize:".82rem" }}>Cancel</button>
      </div>
    </div>
  );
}

/* ── SIGN UP MODAL ── */
function SignUpModal({ onClose, onSwitch, onRegister }) {
  const [name, setName]   = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass]   = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !pass) { setError("Please fill all fields"); return; }
    if (pass.length < 6) { setError("Password must be at least 6 characters"); return; }
    setLoading(true); setError("");
    try {
      await onRegister(name, email, pass);
      setSuccess(true); // ✅ email verify message dikhao
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed! Try again.");
    } finally { setLoading(false); }
  };

  // ✅ Success state — email verify karo message
  if (success) {
    return (
      <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{ position:"fixed", inset:0, zIndex:9999, background:"rgba(5,20,10,.75)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}>
        <div style={{ background:"#fff", borderRadius:"24px", padding:"40px", maxWidth:"420px", width:"100%", textAlign:"center", boxShadow:"0 32px 80px rgba(0,0,0,.25)" }}>
          <div style={{ fontSize:"3rem", marginBottom:"16px" }}>📧</div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1.4rem", color:"#0a1a12", marginBottom:"10px" }}>Check Your Email!</h2>
          <p style={{ color:"#5a7a68", fontSize:".95rem", lineHeight:1.6, marginBottom:"28px" }}>
            We've sent a verification link to <strong>{email}</strong>.<br/>
            Please click the link to activate your account.
          </p>
          <button onClick={onClose} style={{ padding:"11px 28px", borderRadius:"50px", cursor:"pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".92rem", border:"none", background:"#0a6e3f", color:"#fff" }}>
            Got it! ✅
          </button>
        </div>
      </div>
    );
  }

  return (
    <div onClick={(e) => e.target === e.currentTarget && onClose()} style={{ position:"fixed", inset:0, zIndex:9999, background:"rgba(5,20,10,.75)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px", animation:"mfade .2s ease" }}>
      <div style={{ background:"#fff", borderRadius:"24px", padding:"40px", maxWidth:"420px", width:"100%", boxShadow:"0 32px 80px rgba(0,0,0,.25)" }}>
        <div style={{ textAlign:"center", marginBottom:"28px" }}>
          <div style={{ fontSize:"2.5rem", marginBottom:"10px" }}>🚀</div>
          <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1.5rem", color:"#0a1a12" }}>Create Account</h2>
          <p style={{ color:"#5a7a68", fontSize:".88rem", marginTop:"6px" }}>Join 12,000+ engineers on Deep Focus</p>
        </div>
        {error && <div style={{ background:"#fff0f0", border:"1.5px solid #ffcccc", color:"#cc0000", borderRadius:"10px", padding:"10px 14px", fontSize:".84rem", marginBottom:"16px", textAlign:"center" }}>⚠️ {error}</div>}
        {[
          { label:"Full Name", type:"text",     val:name,  set:setName,  placeholder:"Alice Johnson" },
          { label:"Email",     type:"email",    val:email, set:setEmail, placeholder:"you@email.com" },
          { label:"Password",  type:"password", val:pass,  set:setPass,  placeholder:"6+ characters" },
        ].map(({ label, type, val, set, placeholder }) => (
          <div key={label} style={{ marginBottom:"14px" }}>
            <label style={{ display:"block", fontSize:".82rem", fontWeight:600, color:"#0a1a12", marginBottom:"6px" }}>{label}</label>
            <input type={type} value={val} placeholder={placeholder} onChange={(e) => set(e.target.value)} onKeyDown={(e) => e.key==="Enter" && handleSubmit()} style={{ width:"100%", padding:"11px 16px", borderRadius:"10px", border:"1.5px solid #c6ead8", fontSize:".92rem", fontFamily:"'DM Sans',sans-serif", color:"#0a1a12", outline:"none", boxSizing:"border-box" }} />
          </div>
        ))}
        <button onClick={handleSubmit} disabled={loading} style={{ width:"100%", padding:"13px", borderRadius:"12px", border:"none", background:loading ? "#a8f0cc" : "#0a6e3f", color:"#fff", cursor:loading ? "not-allowed" : "pointer", fontFamily:"'Syne',sans-serif", fontWeight:700, fontSize:"1rem", marginTop:"8px", transition:"background .2s" }}>
          {loading ? "Creating account..." : "Get Started Free →"}
        </button>
        <p style={{ textAlign:"center", marginTop:"20px", fontSize:".85rem", color:"#5a7a68" }}>
          Already have an account?{" "}
          <span onClick={onSwitch} style={{ color:"#0a6e3f", fontWeight:600, cursor:"pointer", textDecoration:"underline" }}>Sign In</span>
        </p>
        <button onClick={onClose} style={{ display:"block", margin:"10px auto 0", background:"none", border:"none", color:"#aac5b5", cursor:"pointer", fontSize:".82rem" }}>Cancel</button>
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
  const [modal, setModal]                 = useState(null);
  const [enrolledCourse, setEnrolledCourse] = useState(null);
  const [toasts, setToasts]               = useState([]);

  const addToast = (message, emoji = "✅") => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, emoji }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
  };

  const handleSignInClose = (type) => {
    setModal(null);
    if (type === "signin") addToast(`Welcome back, ${user?.name || ""}! 👋`, "👋");
  };

  const handleDashboard = () => setModal("dashboard");

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

      {modal === "dashboard" && <Dashboard onClose={() => setModal(null)} />}
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
        <Route path="/verify-email/:token" element={<VerifyEmail />} />
      </Routes>
    </BrowserRouter>
  );
}