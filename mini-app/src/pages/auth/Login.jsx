import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../lib/api.js";

export default function Login({ setUser }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true); setError("");
    try {
      const { data } = await authAPI.login(form);
      localStorage.setItem("sah_token", data.token);
      setUser(data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:"90vh", display:"flex", alignItems:"center", justifyContent:"center" }}>
      <div className="card" style={{ width:"100%", maxWidth:"400px" }}>
        <h2 style={{ color:"var(--gold)", marginBottom:"8px", fontSize:"24px" }}>Welcome back</h2>
        <p style={{ color:"var(--text2)", marginBottom:"28px", fontSize:"14px" }}>Sign in to your SAH account</p>

        {error && <div style={{ background:"#2a0a0a", border:"1px solid #ff4444", borderRadius:"8px", padding:"12px", marginBottom:"16px", color:"#ff6b6b", fontSize:"13px" }}>{error}</div>}

        <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
          <input type="email" placeholder="Email" value={form.email}
            onChange={e => setForm({...form, email: e.target.value})} required />
          <input type="password" placeholder="Password" value={form.password}
            onChange={e => setForm({...form, password: e.target.value})} required />
          <button type="submit" className="btn-gold" style={{ width:"100%", padding:"12px" }} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p style={{ textAlign:"center", marginTop:"20px", fontSize:"13px", color:"var(--text2)" }}>
          No account? <Link to="/register" style={{ color:"var(--gold)" }}>Sign Up</Link>
        </p>
      </div>
    </div>
  );
}
