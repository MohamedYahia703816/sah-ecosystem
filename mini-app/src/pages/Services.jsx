import { useState, useEffect } from "react";
import { servicesAPI } from "../lib/api.js";

const ICONS = {
  "stem-splitter":   "🎵",
  "smart-mastering": "🎚️",
  "bpm-detector":    "🎼",
  "pitch-control":   "🎹",
  "lyrics-gen":      "✍️",
  "speech-to-text":  "🎙️",
};

export default function Services({ user }) {
  const [services, setServices] = useState([]);
  const [status, setStatus] = useState({});

  useEffect(() => {
    servicesAPI.list().then(r => setServices(r.data));
  }, []);

  const useService = async (id) => {
    setStatus(s => ({ ...s, [id]: "loading" }));
    try {
      const { data } = await servicesAPI.use(id);
      setStatus(s => ({ ...s, [id]: data.status === "free" ? `free (${data.used}/${data.limit})` : `costs ${data.cost} SAH` }));
    } catch {
      setStatus(s => ({ ...s, [id]: "error" }));
    }
  };

  return (
    <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"40px 24px" }}>
      <h1 style={{ fontSize:"28px", fontWeight:"700", marginBottom:"8px" }}>
        Music <span style={{ color:"var(--gold)" }}>Services</span>
      </h1>
      <p style={{ color:"var(--text2)", marginBottom:"32px", fontSize:"14px" }}>
        Free tier daily · or spend SAH tokens for unlimited access
      </p>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"20px" }}>
        {services.map(s => (
          <div key={s.id} className="card" style={{ display:"flex", flexDirection:"column", gap:"12px" }}>
            <div style={{ fontSize:"32px" }}>{ICONS[s.id]}</div>
            <h3 style={{ fontWeight:"700", fontSize:"16px" }}>{s.name}</h3>

            <div style={{ display:"flex", justifyContent:"space-between", fontSize:"13px" }}>
              <span style={{ color:"var(--text2)" }}>Free limit</span>
              <span style={{ color:"var(--blue)", fontWeight:"600" }}>{s.free_limit}/day</span>
            </div>
            <div style={{ display:"flex", justifyContent:"space-between", fontSize:"13px" }}>
              <span style={{ color:"var(--text2)" }}>SAH cost</span>
              <span style={{ color:"var(--gold)", fontWeight:"600" }}>{s.cost} SAH</span>
            </div>

            {status[s.id] && (
              <div style={{
                background: status[s.id].includes("free") ? "#0a2a0a" : "#2a1a0a",
                border: `1px solid ${status[s.id].includes("free") ? "#2a7a2a" : "var(--gold)"}`,
                borderRadius:"8px", padding:"8px 12px",
                fontSize:"12px",
                color: status[s.id].includes("free") ? "#4caf50" : "var(--gold)"
              }}>
                {status[s.id]}
              </div>
            )}

            <button className="btn-gold" style={{ marginTop:"auto", width:"100%" }}
              onClick={() => useService(s.id)}
              disabled={status[s.id] === "loading"}>
              {status[s.id] === "loading" ? "Checking..." : "Use Service"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
