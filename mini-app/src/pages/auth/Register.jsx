import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { authAPI } from "../../lib/api.js";

function validate(form) {
  if (!form.username || form.username.length < 3)
    return "Username must be at least 3 characters";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
    return "Please enter a valid email address";
  if (form.password.length < 6)
    return "Password must be at least 6 characters";
  return null;
}

export default function Register({ setUser }) {
  const [form, setForm] = useState({ username:"", email:"", password:"" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    const err = validate(form);
    if (err) return setError(err);
    setLoading(true); setError("");
    try {
      const { data } = await authAPI.register(form);
      localStorage.setItem("sah_token", data.token);
      setUser(data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div style={{ minHeight:"90vh", display:"flex", alignItems:"center", justifyContent:"center", flexDirection:"column", gap:"24px" }}>
      <img src="/banner.png" alt="SAH Banner" style={{ width:"100%", maxWidth:"600px", borderRadius:"12px", objectFit:"cover" }} />

      <div className="card" style={{ width:"100%", maxWidth:"400px" }}>
        <h2 style={{ color:"var(--gold)", marginBottom:"4px", fontSize:"24px" }}>Join SAH</h2>
        <p style={{ color:"var(--text2)", marginBottom:"24px", fontSize:"14px" }}>
          Create your account · get <span style={{color:"var(--gold)", fontWeight:"700"}}>100 SAH free</span>
        </p>

        {error && (
          <div style={{ background:"#2a0a0a", border:"1px solid #ff4444", borderRadius:"8px", padding:"12px", marginBottom:"16px", color:"#ff6b6b", fontSize:"13px" }}>
            {error}
          </div>
        )}

        <form onSubmit={submit} style={{ display:"flex", flexDirection:"column", gap:"14px" }}>
          <input placeholder="Username (min 3 chars)" value={form.username}
            onChange={e => setForm({...form, username: e.target.value})} required />
          <input type="email" placeholder="Email address" value={form.email}
            onChange={e => setForm({...form, email: e.target.value})} required />
          <input type="password" placeholder="Password (min 6 chars)" value={form.password}
            onChange={e => setForm({...form, password: e.target.value})} required />
          <button type="submit" className="btn-gold" style={{ width:"100%", padding:"12px", marginTop:"4px" }} disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p style={{ textAlign:"center", marginTop:"20px", fontSize:"13px", color:"var(--text2)" }}>
          Have account? <Link to="/login" style={{ color:"var(--gold)" }}>Sign In</Link>
        </p>
      </div>
    </div>
  );
}
