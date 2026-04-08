import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../context/AuthContext";

export default function BookReader({ book, onClose }) {
  const { user, startBook, updateBookProgress } = useAuth();
  const [activeIdx, setActiveIdx] = useState(0);
  const [animKey, setAnimKey]     = useState(0);
  const [slideDir, setSlideDir]   = useState("right");
  const [saved, setSaved]         = useState(false);

  const chapters = book.chapters || [];

  // Book start karo DB mein jab open ho
  useEffect(() => {
    if (user) {
      startBook(book.id).catch(() => {});
    }
  }, [book.id, user]);

  // Chapter change hone pe progress save karo
  useEffect(() => {
    if (!user) return;
    const timer = setTimeout(() => {
      updateBookProgress(book.id, activeIdx)
        .then(() => {
          setSaved(true);
          setTimeout(() => setSaved(false), 1500);
        })
        .catch(() => {});
    }, 800);
    return () => clearTimeout(timer);
  }, [activeIdx, user]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goTo(activeIdx + 1);
      if (e.key === "ArrowLeft")  goTo(activeIdx - 1);
    };
    window.addEventListener("keydown", handleKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [activeIdx]);

  const current = chapters[activeIdx];
  const content = typeof current === "string" ? book.preview : current?.content || "";

  const goTo = useCallback((idx) => {
    if (idx < 0 || idx >= chapters.length) return;
    setSlideDir(idx > activeIdx ? "right" : "left");
    setActiveIdx(idx);
    setAnimKey((k) => k + 1);
  }, [activeIdx, chapters.length]);

  if (!book) return null;

  const parseContent = (text) => {
    if (!text) return [];
    const lines = text.split("\n");
    const blocks = [];
    let codeLines = [];
    let inCode = false;

    const flushCode = () => {
      if (codeLines.length > 0) {
        blocks.push({ type: "code", lines: [...codeLines] });
        codeLines = [];
      }
      inCode = false;
    };

    const isCodeLine = (line) => {
      if (!line.startsWith("  ")) return false;
      const t = line.trim();
      if (!t) return false;
      return (
        inCode ||
        /[{}()\[\]=><]/.test(t) ||
        /^(def |function |class |return |if |for |while |var |const |let |public |private |import |from |print|int |void |String )/.test(t) ||
        /→|←|O\(|#\s/.test(t) ||
        t.startsWith("git ") || t.startsWith("npm ") || t.startsWith("pip ")
      );
    };

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.startsWith("━━━") || line.startsWith("═══")) { flushCode(); blocks.push({ type: "divider" }); continue; }
      if (line.startsWith("───") || line.startsWith("----")) { flushCode(); continue; }
      if (line.trim().length > 3 && !line.startsWith(" ") && line.trim() === line.trim().toUpperCase() && /[A-Z]{3}/.test(line) && !line.includes("→") && !line.startsWith("git") && !line.startsWith("npm")) {
        flushCode(); blocks.push({ type: "heading", text: line.trim() }); continue;
      }
      if (isCodeLine(line)) { inCode = true; codeLines.push(line); continue; }
      if (inCode && line.trim() === "") { codeLines.push(line); continue; }
      if (inCode) flushCode();
      if (line.trim() === "") { blocks.push({ type: "space" }); continue; }
      if (/^\s*(→|•|✓|✗|⚠️|[-*])\s/.test(line)) {
        const trimmed = line.trim();
        const icon = trimmed.charAt(0);
        const text = trimmed.slice(1).trim();
        blocks.push({ type: "bullet", icon, text }); continue;
      }
      if (line.match(/^[A-Za-z ]+:\s/) && !line.startsWith(" ") && line.length < 100) {
        const colonIdx = line.indexOf(":");
        const key = line.slice(0, colonIdx).trim();
        const val = line.slice(colonIdx + 1).trim();
        if (val) { blocks.push({ type: "keyval", key, val }); continue; }
      }
      blocks.push({ type: "para", text: line.trim() });
    }
    flushCode();
    return blocks;
  };

  const renderBlocks = (text) => {
    const blocks = parseContent(text);
    return blocks.map((block, i) => {
      switch (block.type) {
        case "heading":
          return <div key={i} style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1rem", color:"#0a1a12", marginTop:"28px", marginBottom:"12px", paddingLeft:"14px", borderLeft:"3px solid #12a05c", lineHeight:1.3 }}>{block.text}</div>;
        case "divider":
          return <div key={i} style={{ margin:"20px 0", height:"1px", background:"linear-gradient(90deg,transparent,#c6ead8,transparent)" }} />;
        case "space":
          return <div key={i} style={{ height:"8px" }} />;
        case "bullet": {
          const iconMap = { "→":"#0a6e3f","✓":"#12a05c","✗":"#e05252","⚠️":"#d08c3a","•":"#12a05c","-":"#5a7a68","*":"#5a7a68" };
          const iconColor = iconMap[block.icon] || "#12a05c";
          const displayIcon = (block.icon==="-"||block.icon==="*") ? "▸" : block.icon;
          return <div key={i} style={{ display:"flex", gap:"10px", alignItems:"flex-start", marginBottom:"6px", paddingLeft:"4px" }}>
            <span style={{ color:iconColor, fontWeight:700, flexShrink:0, marginTop:"3px", fontSize:".85rem" }}>{displayIcon}</span>
            <span style={{ fontSize:".9rem", color:"#2d4a38", lineHeight:1.7, fontFamily:"'DM Sans',sans-serif" }}>{block.text}</span>
          </div>;
        }
        case "keyval":
          return <div key={i} style={{ display:"flex", gap:"12px", alignItems:"flex-start", marginBottom:"6px", padding:"6px 12px", background:"#f8fffc", borderRadius:"8px", border:"1px solid #e0f5ea" }}>
            <span style={{ fontFamily:"'JetBrains Mono',monospace", fontSize:".78rem", fontWeight:700, color:"#0a6e3f", flexShrink:0, background:"#d6fae9", padding:"2px 8px", borderRadius:"5px", marginTop:"1px" }}>{block.key}</span>
            <span style={{ fontSize:".88rem", color:"#2d4a38", lineHeight:1.6, fontFamily:"'DM Sans',sans-serif" }}>{block.val}</span>
          </div>;
        case "code":
          return <CleanCodeBlock key={i} lines={block.lines} />;
        default:
          return <p key={i} style={{ fontSize:".92rem", color:"#2d4a38", lineHeight:1.75, marginBottom:"6px", fontFamily:"'DM Sans',sans-serif" }}>{block.text}</p>;
      }
    });
  };

  return (
    <div
      onClick={(e) => e.target === e.currentTarget && onClose()}
      style={{ position:"fixed", inset:0, zIndex:999, background:"rgba(5,20,10,.75)", backdropFilter:"blur(8px)", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px" }}
    >
      <style>{`
        @keyframes rfadeIn  { from{opacity:0} to{opacity:1} }
        @keyframes slideInR { from{opacity:0;transform:translateX(36px)} to{opacity:1;transform:translateX(0)} }
        @keyframes slideInL { from{opacity:0;transform:translateX(-36px)} to{opacity:1;transform:translateX(0)} }
        @keyframes savedPop { 0%{opacity:0;transform:translateY(6px)} 20%{opacity:1;transform:translateY(0)} 80%{opacity:1} 100%{opacity:0} }
        .rscroll::-webkit-scrollbar{width:4px}
        .rscroll::-webkit-scrollbar-thumb{background:#c6ead8;border-radius:99px}
        .rscroll::-webkit-scrollbar-track{background:transparent}
        .toc-ch{transition:all .15s;cursor:pointer}
        .toc-ch:hover{background:rgba(18,160,92,.1) !important}
        .navbtn{transition:all .18s}
        .navbtn:not(:disabled):hover{transform:translateY(-2px)}
      `}</style>

      <div style={{ width:"100%", maxWidth:"980px", height:"90vh", background:"#fff", borderRadius:"20px", display:"flex", flexDirection:"column", boxShadow:"0 40px 100px rgba(0,0,0,.3)", overflow:"hidden", animation:"rfadeIn .3s cubic-bezier(.16,1,.3,1)" }}>

        {/* HEADER */}
        <div style={{ background:"linear-gradient(135deg,#0a6e3f,#12a05c)", padding:"16px 24px", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <div style={{ display:"flex", alignItems:"center", gap:"14px" }}>
            <div style={{ width:"44px", height:"44px", borderRadius:"12px", background:"rgba(255,255,255,.15)", display:"grid", placeItems:"center", fontSize:"1.5rem", border:"1.5px solid rgba(255,255,255,.2)", flexShrink:0 }}>{book.emoji}</div>
            <div>
              <div style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1.05rem", color:"#fff", lineHeight:1.2 }}>{book.title}</div>
              <div style={{ fontSize:".75rem", color:"rgba(255,255,255,.65)", marginTop:"3px" }}>{book.author}</div>
            </div>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
            {saved && (
              <span style={{ fontSize:".72rem", color:"rgba(255,255,255,.9)", fontFamily:"'JetBrains Mono',monospace", background:"rgba(255,255,255,.2)", padding:"3px 10px", borderRadius:"50px", animation:"savedPop 1.5s ease forwards" }}>
                ✓ saved
              </span>
            )}
            {!user && (
              <span style={{ fontSize:".72rem", color:"rgba(255,255,255,.6)", fontFamily:"'JetBrains Mono',monospace" }}>login to save progress</span>
            )}
            <span style={{ background:"rgba(255,255,255,.18)", color:"#fff", fontSize:".68rem", fontWeight:700, padding:"3px 10px", borderRadius:"50px", fontFamily:"'JetBrains Mono',monospace", border:"1px solid rgba(255,255,255,.25)" }}>{book.sourceTag}</span>
            <button onClick={onClose} style={{ width:"34px", height:"34px", borderRadius:"50%", background:"rgba(255,255,255,.15)", border:"1.5px solid rgba(255,255,255,.25)", color:"#fff", cursor:"pointer", fontSize:"1rem", display:"grid", placeItems:"center" }}>✕</button>
          </div>
        </div>

        {/* PROGRESS BAR */}
        <div style={{ height:"3px", background:"#e8f5ef", flexShrink:0 }}>
          <div style={{ height:"100%", width:`${((activeIdx+1)/chapters.length)*100}%`, background:"linear-gradient(90deg,#12a05c,#1ec97a)", transition:"width .4s ease" }} />
        </div>

        {/* BODY */}
        <div style={{ flex:1, display:"flex", overflow:"hidden" }}>
          {/* SIDEBAR */}
          <div style={{ width:"230px", flexShrink:0, borderRight:"1px solid #e8f5ef", background:"#fafffe", display:"flex", flexDirection:"column", overflow:"hidden" }}>
            <div style={{ padding:"14px 16px 10px", borderBottom:"1px solid #e8f5ef", flexShrink:0 }}>
              <div style={{ fontSize:".67rem", fontWeight:700, letterSpacing:".1em", textTransform:"uppercase", color:"#5a7a68", fontFamily:"'JetBrains Mono',monospace" }}>📋 Contents</div>
              <div style={{ fontSize:".7rem", color:"#a0bfad", marginTop:"3px", fontFamily:"'JetBrains Mono',monospace" }}>{activeIdx+1} / {chapters.length} chapters</div>
            </div>
            <div className="rscroll" style={{ flex:1, overflowY:"auto", padding:"8px" }}>
              {chapters.map((ch, i) => (
                <div key={i} className="toc-ch" onClick={() => goTo(i)} style={{ padding:"9px 10px", borderRadius:"10px", marginBottom:"2px", display:"flex", alignItems:"flex-start", gap:"8px", background:activeIdx===i ? "rgba(18,160,92,.12)" : "transparent", color:activeIdx===i ? "#0a6e3f" : "#5a7a68" }}>
                  <span style={{ flexShrink:0, width:"20px", height:"20px", borderRadius:"6px", marginTop:"1px", background:activeIdx===i ? "#0a6e3f" : "#e0f0e8", color:activeIdx===i ? "#fff" : "#5a7a68", fontSize:".6rem", fontWeight:700, display:"grid", placeItems:"center", fontFamily:"'JetBrains Mono',monospace" }}>{String(i+1).padStart(2,"0")}</span>
                  <span style={{ fontSize:".8rem", lineHeight:1.4, fontWeight:activeIdx===i ? 600 : 400 }}>{typeof ch==="string" ? ch : ch.title}</span>
                </div>
              ))}
            </div>
          </div>

          {/* MAIN CONTENT */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
            <div style={{ background:"linear-gradient(135deg,#f0fdf7,#e8faf2)", borderBottom:"1px solid #d6fae9", padding:"18px 32px 16px", flexShrink:0 }}>
              <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", marginBottom:"8px" }}>
                <span style={{ background:"#0a6e3f", color:"#fff", fontSize:".68rem", fontFamily:"'JetBrains Mono',monospace", fontWeight:700, padding:"3px 10px", borderRadius:"6px" }}>CH {String(activeIdx+1).padStart(2,"0")}</span>
                <span style={{ fontSize:".72rem", color:"#5a7a68", fontFamily:"'JetBrains Mono',monospace" }}>{activeIdx+1} of {chapters.length}</span>
              </div>
              <h2 style={{ fontFamily:"'Syne',sans-serif", fontWeight:800, fontSize:"1.2rem", color:"#0a1a12", margin:0, lineHeight:1.3 }}>{typeof current==="string" ? current : current?.title}</h2>
            </div>

            <div className="rscroll" key={animKey} style={{ flex:1, overflowY:"auto", padding:"28px 36px 40px", animation:slideDir==="right" ? "slideInR .28s ease" : "slideInL .28s ease" }}>
              {renderBlocks(content)}
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div style={{ padding:"12px 24px", borderTop:"1px solid #e8f5ef", background:"#fafffe", display:"flex", alignItems:"center", justifyContent:"space-between", flexShrink:0 }}>
          <button className="navbtn" onClick={() => goTo(activeIdx-1)} disabled={activeIdx===0} style={{ padding:"8px 22px", borderRadius:"50px", border:"1.5px solid #c6ead8", background:activeIdx===0 ? "#f0fdf7" : "#fff", color:activeIdx===0 ? "#c6ead8" : "#0a6e3f", cursor:activeIdx===0 ? "not-allowed" : "pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".85rem" }}>← Prev</button>

          <div style={{ display:"flex", gap:"5px", alignItems:"center", flexWrap:"wrap", justifyContent:"center", maxWidth:"420px" }}>
            {chapters.map((_,i) => (
              <div key={i} onClick={() => goTo(i)} style={{ width:i===activeIdx ? "22px" : "7px", height:"7px", borderRadius:"99px", background:i===activeIdx ? "#0a6e3f" : "#c6ead8", cursor:"pointer", transition:"all .25s ease" }} />
            ))}
          </div>

          <button className="navbtn" onClick={() => goTo(activeIdx+1)} disabled={activeIdx===chapters.length-1} style={{ padding:"8px 22px", borderRadius:"50px", border:"none", background:activeIdx===chapters.length-1 ? "#e8f5ef" : "#0a6e3f", color:activeIdx===chapters.length-1 ? "#c6ead8" : "#fff", cursor:activeIdx===chapters.length-1 ? "not-allowed" : "pointer", fontFamily:"'DM Sans',sans-serif", fontWeight:600, fontSize:".85rem", boxShadow:activeIdx===chapters.length-1 ? "none" : "0 4px 12px rgba(10,110,63,.25)" }}>Next →</button>
        </div>
      </div>
    </div>
  );
}

// ── CLEAN CODE BLOCK ──
function CleanCodeBlock({ lines }) {
  const tokenize = (line) => {
    const tokens = [];
    let remaining = line;
    const indent = remaining.match(/^(\s*)/)[1];
    if (indent) { tokens.push({ type:"indent", text:indent }); remaining = remaining.slice(indent.length); }
    while (remaining.length > 0) {
      let matched = false;
      const commentMatch = remaining.match(/^(\/\/.*|#.*)$/);
      if (commentMatch) { tokens.push({ type:"comment", text:commentMatch[1] }); remaining=""; matched=true; }
      if (!matched) { const m = remaining.match(/^("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/); if(m){ tokens.push({type:"string",text:m[1]}); remaining=remaining.slice(m[1].length); matched=true; } }
      if (!matched) { const m = remaining.match(/^(def |function |class |return |if |else |elif |for |while |import |from |var |const |let |new |public |private |protected |static |void |int |String |boolean |super |this |extends |implements |override |abstract |null |true |false |None |True |False |self )/); if(m){ tokens.push({type:"keyword",text:m[1]}); remaining=remaining.slice(m[1].length); matched=true; } }
      if (!matched) { const m = remaining.match(/^(\b\d+\.?\d*\b)/); if(m){ tokens.push({type:"number",text:m[1]}); remaining=remaining.slice(m[1].length); matched=true; } }
      if (!matched) { const m = remaining.match(/^(→|←|✓|✗|⚠️)/); if(m){ tokens.push({type:"symbol",text:m[1]}); remaining=remaining.slice(m[1].length); matched=true; } }
      if (!matched) { const last=tokens[tokens.length-1]; if(last&&last.type==="plain"){ last.text+=remaining[0]; } else { tokens.push({type:"plain",text:remaining[0]}); } remaining=remaining.slice(1); }
    }
    return tokens;
  };

  const tokenColors = {
    keyword:{color:"#0a6e3f",fontWeight:700}, string:{color:"#c97a0a"},
    number:{color:"#9b59b6"}, comment:{color:"#6a9c7f",fontStyle:"italic"},
    symbol:{color:"#12a05c",fontWeight:700}, indent:{color:"transparent"}, plain:{color:"#1a3525"}
  };

  const cleanLines = [...lines];
  while (cleanLines.length>0 && cleanLines[cleanLines.length-1].trim()==="") cleanLines.pop();

  return (
    <div style={{ background:"linear-gradient(135deg,#f0fdf7,#f8fffc)", border:"1.5px solid #c6ead8", borderRadius:"14px", margin:"14px 0", overflow:"hidden" }}>
      <div style={{ background:"#e8f5ef", padding:"8px 16px", display:"flex", alignItems:"center", gap:"6px", borderBottom:"1px solid #c6ead8" }}>
        {["#ff5f57","#febc2e","#28c840"].map((c,i)=>(<div key={i} style={{ width:"10px",height:"10px",borderRadius:"50%",background:c }} />))}
        <span style={{ marginLeft:"8px",fontSize:".65rem",color:"#5a7a68",fontFamily:"'JetBrains Mono',monospace",letterSpacing:".05em" }}>code</span>
      </div>
      <div style={{ padding:"12px 0" }}>
        {cleanLines.map((line,i) => {
          const tokens = tokenize(line);
          return (
            <div key={i} style={{ display:"flex",alignItems:"flex-start",padding:"1px 12px 1px 0" }}>
              <span style={{ minWidth:"32px",textAlign:"right",paddingRight:"14px",color:"#b0d4bf",fontSize:".7rem",fontFamily:"'JetBrains Mono',monospace",userSelect:"none",flexShrink:0,paddingTop:"2px" }}>{i+1}</span>
              <span style={{ fontFamily:"'JetBrains Mono',monospace",fontSize:".82rem",lineHeight:1.75,whiteSpace:"pre-wrap",wordBreak:"break-word",flex:1 }}>
                {tokens.map((tok,j)=>(<span key={j} style={tokenColors[tok.type]||{}}>{tok.text}</span>))}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}