import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { authAPI } from "./lib/api.js";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Services from "./pages/Services.jsx";
import Kingdom from "./pages/game/Kingdom.jsx";
import Navbar from "./components/Navbar.jsx";

function ProtectedRoute({ user, children }) {
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("sah_token");
    if (!token) { setLoading(false); return; }
    // Demo mode: use mock user if server is not available
    authAPI.me()
      .then(r => setUser(r.data))
      .catch(() => {
        // Demo fallback - remove in production
        const demoUser = localStorage.getItem('sah_demo');
        if (demoUser) {
          setUser(JSON.parse(demoUser));
        } else {
          const mockUser = { 
            username: 'MusicKing', 
            sah_balance: 1000, 
            role: 'producer',
            id: 'demo_1'
          };
          localStorage.setItem('sah_demo', JSON.stringify(mockUser));
          setUser(mockUser);
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = () => {
    localStorage.removeItem("sah_token");
    setUser(null);
  };

  if (loading) return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"center", height:"100vh", background:"var(--bg)" }}>
      <span style={{ color:"var(--gold)", fontSize:"18px" }}>Loading...</span>
    </div>
  );

  return (
    <>
      <Navbar user={user} onLogout={logout} />
      <Routes>
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />
        <Route path="/login"    element={<Login    setUser={setUser} />} />
        <Route path="/register" element={<Register setUser={setUser} />} />
        <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard user={user} /></ProtectedRoute>} />
        <Route path="/services"  element={<ProtectedRoute user={user}><Services  user={user} /></ProtectedRoute>} />
        <Route path="/kingdom"    element={<Kingdom      user={user} />} />
      </Routes>
    </>
  );
}
