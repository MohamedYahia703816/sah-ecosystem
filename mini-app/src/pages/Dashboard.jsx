import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const QUICK = [
  { id:"stem-splitter",   name:"Stem Splitter",    icon:"🎵", desc:"Isolate vocals from beat",  free:"3/day" },
  { id:"smart-mastering", name:"Smart Mastering",  icon:"🎚️", desc:"AI auto mastering",         free:"1/day" },
  { id:"bpm-detector",    name:"BPM & Key",        icon:"🎼", desc:"Detect tempo and key",      free:"10/day" },
  { id:"pitch-control",   name:"Pitch Control",    icon:"🎹", desc:"Adjust pitch range",        free:"5/day" },
  { id:"lyrics-gen",      name:"Lyrics Generator", icon:"✍️", desc:"AI lyrics writing",         free:"3/day" },
  { id:"speech-to-text",  name:"Speech to Text",   icon:"🎙️", desc:"Transcribe audio",          free:"5min/day" },
];

export default function Dashboard({ user }) {
  return (
    <div>
      {/* Banner Hero */}
      <div style={{
        width:"100%", height:"220px",
        backgroundImage:"url('/bk.png')",
        backgroundSize:"cover",
        backgroundPosition:"center top",
        display:"flex", alignItems:"center",
        padding:"0 40px",
        position:"relative",
      }}>
        <div style={{
          position:"absolute", inset:0,
          background:"linear-gradient(to right, rgba(10,10,15,0.85) 40%, rgba(10,10,15,0.2))"
        }}/>
        <div style={{ position:"relative", zIndex:1 }}>
          <h1 style={{ fontSize:"32px", fontWeight:"700", marginBottom:"6px" }}>
            Welcome back, <span style={{ color:"var(--gold)" }}>{user.username}</span>
          </h1>
          <p style={{ color:"var(--text2)", fontSize:"14px" }}>Account Active · Free Tier</p>
        </div>
      </div>

      <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"32px 24px" }}>
        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"16px", marginBottom:"40px" }}>
          <div className="card">
            <p style={{ color:"var(--text2)", fontSize:"13px", marginBottom:"8px" }}>Current Balance</p>
            <p style={{ fontSize:"32px", fontWeight:"700" }}>
              {user.sah_balance} <span style={{ color:"var(--gold)", fontSize:"18px" }}>SAH</span>
            </p>
          </div>
          <div className="card">
            <p style={{ color:"var(--text2)", fontSize:"13px", marginBottom:"8px" }}>Tracks Processed</p>
            <p style={{ fontSize:"32px", fontWeight:"700" }}>0</p>
          </div>
          <div className="card">
            <p style={{ color:"var(--text2)", fontSize:"13px", marginBottom:"8px" }}>Role</p>
            <p style={{ fontSize:"20px", fontWeight:"700", color:"var(--blue)", textTransform:"capitalize" }}>{user.role}</p>
          </div>
        </div>

        {/* Kingdom Game */}
        <h2 style={{ fontSize:"18px", fontWeight:"600", marginBottom:"16px" }}>🎮 Music Kingdom Game</h2>
        <div style={{ marginBottom:"40px" }}>
          <Link to="/kingdom" style={{ textDecoration:"none" }}>
            <div className="card" style={{ 
              cursor:"pointer", 
              padding:"24px",
              background:"linear-gradient(135deg, rgba(212,175,55,0.1) 0%, rgba(212,175,55,0.05) 100%)",
              border:"1px solid rgba(212,175,55,0.3)"
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:"20px" }}>
                <div style={{ fontSize:"56px" }}>🏰</div>
                <div style={{ flex:1 }}>
                  <h3 style={{ fontSize:"20px", fontWeight:"700", marginBottom:"4px", color:"#d4af37" }}>Enter Your Kingdom</h3>
                  <p style={{ color:"var(--text2)", fontSize:"14px", margin:"0 0 8px 0" }}>Collect instruments, trade with others, and build your musical empire!</p>
                  <span style={{ color:"var(--gold)", fontSize:"13px", fontWeight:"600" }}>Play Now →</span>
                </div>
                <div style={{ fontSize:"40px", animation:"float 3s ease-in-out infinite" }}>💎</div>
              </div>
            </div>
          </Link>
        </div>

        {/* Quick Actions */}
        <h2 style={{ fontSize:"18px", fontWeight:"600", marginBottom:"16px" }}>Quick Actions</h2>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"16px" }}>
          {QUICK.map(s => (
            <Link key={s.id} to="/services" style={{ textDecoration:"none" }}>
              <div className="card" style={{ cursor:"pointer", transition:"border 0.2s" }}
                onMouseEnter={e => e.currentTarget.style.borderColor="var(--gold)"}
                onMouseLeave={e => e.currentTarget.style.borderColor="var(--border)"}>
                <div style={{ fontSize:"28px", marginBottom:"12px" }}>{s.icon}</div>
                <p style={{ fontWeight:"600", marginBottom:"4px", color:"var(--text)" }}>{s.name}</p>
                <p style={{ color:"var(--text2)", fontSize:"13px", marginBottom:"12px" }}>{s.desc}</p>
                <span style={{ color:"var(--gold)", fontSize:"12px", fontWeight:"600" }}>Free: {s.free} →</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
