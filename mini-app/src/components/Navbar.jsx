import { Link, useLocation } from "react-router-dom";

export default function Navbar({ user, onLogout }) {
  const { pathname } = useLocation();

  return (
    <nav style={{
      background: "#0d0d15",
      borderBottom: "1px solid #2a2a3e",
      padding: "0 32px",
      height: "64px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <Link to="/" style={{ textDecoration:"none", display:"flex", alignItems:"center", gap:"10px" }}>
        <img src="/logo.png" alt="SAH" style={{ width:"38px", height:"38px", borderRadius:"50%", objectFit:"cover" }} />
        <div>
          <span style={{ fontSize:"16px", fontWeight:"700", color:"var(--gold)", display:"block", lineHeight:"1.1" }}>SAH</span>
          <span style={{ fontSize:"10px", color:"var(--text2)", letterSpacing:"0.5px" }}>Sonic Architect Hub</span>
        </div>
      </Link>

      <div style={{ display:"flex", alignItems:"center", gap:"24px" }}>
        {user && <>
          <Link to="/dashboard" style={{ color: pathname==="/dashboard" ? "var(--gold)" : "var(--text2)", textDecoration:"none", fontSize:"14px" }}>Dashboard</Link>
          <Link to="/services"  style={{ color: pathname==="/services"  ? "var(--gold)" : "var(--text2)", textDecoration:"none", fontSize:"14px" }}>Services</Link>
          <div style={{ display:"flex", alignItems:"center", gap:"8px" }}>
            <span style={{ background:"var(--bg3)", border:"1px solid var(--gold)", borderRadius:"20px", padding:"4px 14px", fontSize:"13px", color:"var(--gold)", fontWeight:"700" }}>
              ◎ {user.sah_balance} SAH
            </span>
            <span style={{ color:"var(--text2)", fontSize:"13px" }}>{user.username}</span>
            <button onClick={onLogout} style={{ background:"transparent", color:"var(--text2)", border:"1px solid var(--border)", borderRadius:"8px", padding:"6px 12px", fontSize:"12px" }}>
              Logout
            </button>
          </div>
        </>}
        {!user && (
          <div style={{ color: 'var(--text2)', fontSize: '13px', fontStyle: 'italic' }}>
            Open from Telegram
          </div>
        )}
      </div>
    </nav>
  );
}
