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
  if (!user) return <Navigate to="/dashboard" replace />;
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
      // Fallback for demo mode
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
