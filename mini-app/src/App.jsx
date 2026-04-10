import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Dashboard from "./pages/Dashboard.jsx";
import Services from "./pages/Services.jsx";
import Kingdom from "./pages/game/Kingdom.jsx";
import Navbar from "./components/Navbar.jsx";

function getTelegramUser() {
  try {
    if (window.Telegram?.WebApp?.initDataUnsafe?.user) {
      return window.Telegram.WebApp.initDataUnsafe.user;
    }
    return null;
  } catch {
    return null;
  }
}

function ProtectedRoute({ user, children }) {
  // If no Telegram user, just redirect to dashboard (which will be empty but not show login)
  if (!user) {
    return (
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '100vh', 
        background: 'var(--bg)',
        color: 'var(--text)',
        flexDirection: 'column',
        padding: '20px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>📱</div>
        <p style={{ color: 'var(--text2)', fontSize: '14px' }}>
          Please open this app from Telegram<br/>
          <span style={{ fontSize: '12px', color: 'var(--text-dim)' }}>
            @SonicArchitectBot
          </span>
        </p>
      </div>
    );
  }
  return children;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Try to get user from Telegram WebApp
    const tgUser = getTelegramUser();
    
    if (tgUser) {
      // Use Telegram user
      setUser({
        id: String(tgUser.id),
        username: tgUser.username || tgUser.first_name,
        first_name: tgUser.first_name,
      });
      setLoading(false);
    } else {
      // No Telegram user - show error
      setUser(null);
      setLoading(false);
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("sah_token");
    localStorage.removeItem("sah_demo");
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
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<ProtectedRoute user={user}><Dashboard user={user} /></ProtectedRoute>} />
        <Route path="/services"  element={<ProtectedRoute user={user}><Services  user={user} /></ProtectedRoute>} />
        <Route path="/kingdom"    element={<Kingdom      user={user} />} />
      </Routes>
    </>
  );
}
