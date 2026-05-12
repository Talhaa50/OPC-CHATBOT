"use client";
import { useState, useEffect, useRef } from "react";

const NAVY = "#0f1b3a";
const GOLD = "#d4a017";

const css = `
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Segoe UI',sans-serif;background:#0a0f1e;color:#e0e6f0}
  ::-webkit-scrollbar{width:6px}
  ::-webkit-scrollbar-track{background:#0f1b3a}
  ::-webkit-scrollbar-thumb{background:#d4a017;border-radius:3px}

  .login-wrap{min-height:100vh;display:flex;align-items:center;justify-content:center;background:linear-gradient(135deg,#0a0f1e 0%,#0f1b3a 100%)}
  .login-box{background:#111827;border:1px solid #d4a01733;border-radius:16px;padding:48px 40px;width:100%;max-width:400px;text-align:center;box-shadow:0 20px 60px rgba(0,0,0,.5)}
  .login-box h1{font-size:24px;font-weight:700;color:#d4a017;margin-bottom:8px}
  .login-box p{font-size:13px;color:#6b7280;margin-bottom:28px}
  .login-input{width:100%;padding:12px 16px;background:#0f1b3a;border:1.5px solid #1e3a5f;border-radius:8px;color:#e0e6f0;font-size:14px;outline:none;margin-bottom:14px;transition:.2s}
  .login-input:focus{border-color:#d4a017}
  .login-btn{width:100%;padding:13px;background:#d4a017;color:#0f1b3a;border:none;border-radius:8px;font-size:15px;font-weight:700;cursor:pointer;transition:.2s}
  .login-btn:hover{background:#c8900a}
  .login-err{color:#ef4444;font-size:13px;margin-top:8px}

  .app{min-height:100vh;background:#0a0f1e}
  .topbar{background:#0f1b3a;border-bottom:1px solid #d4a01733;padding:0 28px;height:62px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;z-index:100}
  .topbar-left{display:flex;align-items:center;gap:12px}
  .topbar-icon{width:38px;height:38px;border-radius:50%;background:#d4a017;display:flex;align-items:center;justify-content:center;font-size:16px}
  .topbar-title{font-size:16px;font-weight:700;color:#fff}
  .topbar-sub{font-size:11px;color:#6b7280}
  .topbar-right{display:flex;align-items:center;gap:10px}
  .save-status{font-size:13px;color:#d4a017;font-weight:600}
  .save-status.err{color:#ef4444}
  .logout-btn{background:#1e3a5f;color:#d4a017;border:1px solid #d4a01733;padding:8px 16px;border-radius:7px;font-size:13px;cursor:pointer;transition:.2s}
  .logout-btn:hover{background:#d4a017;color:#0f1b3a}

  .layout{display:flex;min-height:calc(100vh - 62px)}
  .sidebar{width:210px;background:#0f1b3a;border-right:1px solid #d4a01722;padding:20px 0;flex-shrink:0}
  .sidebar-sec{font-size:10px;font-weight:700;letter-spacing:.12em;color:#4b5563;text-transform:uppercase;padding:14px 20px 6px}
  .nav-item{display:flex;align-items:center;gap:10px;padding:11px 20px;font-size:13.5px;color:#9ca3af;cursor:pointer;transition:.15s;border-left:3px solid transparent}
  .nav-item:hover{background:#1e3a5f33;color:#e0e6f0}
  .nav-item.active{background:#d4a01715;color:#d4a017;border-left-color:#d4a017;font-weight:600}
  .nav-item .icon{width:18px;text-align:center;font-size:14px}
  .nav-badge{margin-left:auto;background:#d4a017;color:#0f1b3a;border-radius:10px;padding:1px 7px;font-size:10px;font-weight:700}

  .main{flex:1;padding:28px;overflow-y:auto}
  .panel{display:none}
  .panel.active{display:block}
  .panel-hdr{margin-bottom:24px}
  .panel-hdr h2{font-size:22px;font-weight:700;color:#fff}
  .panel-hdr p{font-size:13px;color:#6b7280;margin-top:4px}

  .card{background:#111827;border:1px solid #1e3a5f;border-radius:12px;padding:24px;margin-bottom:18px}
  .card-title{font-size:14px;font-weight:700;color:#d4a017;margin-bottom:14px;display:flex;align-items:center;gap:8px}

  label{font-size:12px;font-weight:600;color:#9ca3af;display:block;margin-bottom:5px}
  input[type=text],input[type=password],textarea,select{width:100%;padding:10px 14px;background:#0f1b3a;border:1.5px solid #1e3a5f;border-radius:7px;color:#e0e6f0;font-size:14px;font-family:inherit;outline:none;transition:.2s}
  input[type=text]:focus,textarea:focus{border-color:#d4a017}
  textarea{resize:vertical;min-height:80px;line-height:1.6}
  .form-group{margin-bottom:16px}
  .form-row{display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-bottom:16px}

  .stats-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:14px;margin-bottom:24px}
  .stat-card{background:#111827;border:1px solid #1e3a5f;border-radius:10px;padding:18px}
  .stat-icon{width:36px;height:36px;border-radius:8px;background:#d4a01720;display:flex;align-items:center;justify-content:center;font-size:16px;margin-bottom:10px}
  .stat-num{font-size:26px;font-weight:700;color:#d4a017}
  .stat-label{font-size:11px;color:#6b7280;margin-top:3px}

  .kb-list{display:flex;flex-direction:column;gap:12px}
  .kb-item{background:#0f1b3a;border:1.5px solid #1e3a5f;border-radius:10px;padding:16px}
  .kb-item.editing{border-color:#d4a017}
  .kb-hdr{display:flex;align-items:center;justify-content:space-between;margin-bottom:10px}
  .kb-title{font-size:13.5px;font-weight:700;color:#e0e6f0;display:flex;align-items:center;gap:8px}
  .kb-tag{background:#d4a01720;color:#d4a017;border-radius:6px;padding:2px 8px;font-size:10px;font-weight:700}
  .kb-preview{font-size:12.5px;color:#6b7280;line-height:1.6;max-height:60px;overflow:hidden;cursor:pointer;border-top:1px solid #1e3a5f;padding-top:8px;white-space:pre-wrap}
  .kb-preview.exp{max-height:none}
  .kb-actions{display:flex;gap:8px}
  .kb-edit-form{display:none;margin-top:12px}
  .kb-edit-form.show{display:block}

  .btn{padding:8px 16px;border-radius:7px;border:none;font-size:12.5px;font-weight:700;cursor:pointer;transition:.2s;display:inline-flex;align-items:center;gap:6px}
  .btn-gold{background:#d4a017;color:#0f1b3a}
  .btn-gold:hover{background:#c8900a}
  .btn-navy{background:#1e3a5f;color:#d4a017}
  .btn-navy:hover{background:#2a4f7a}
  .btn-red{background:#7f1d1d;color:#fca5a5}
  .btn-red:hover{background:#991b1b}
  .btn-green{background:#14532d;color:#86efac}
  .btn-green:hover{background:#166534}
  .btn-gray{background:#374151;color:#9ca3af}
  .btn-gray:hover{background:#4b5563}
  .btn-lg{padding:11px 22px;font-size:14px}

  .qa-list{display:flex;flex-direction:column;gap:8px}
  .qa-item{display:flex;align-items:center;gap:10px;background:#0f1b3a;border:1px solid #1e3a5f;border-radius:7px;padding:10px 14px}
  .qa-item span{flex:1;font-size:13.5px;color:#e0e6f0}
  .qa-del{background:none;border:none;color:#4b5563;cursor:pointer;font-size:15px;padding:2px 6px;border-radius:4px;transition:.2s}
  .qa-del:hover{background:#7f1d1d33;color:#ef4444}
  .add-row{display:flex;gap:10px;margin-top:10px}
  .add-row input{flex:1}

  .test-box{border:1.5px solid #1e3a5f;border-radius:10px;overflow:hidden}
  .test-msgs{height:300px;overflow-y:auto;padding:16px;background:#0a0f1e;display:flex;flex-direction:column;gap:10px}
  .test-msg{max-width:80%;padding:10px 14px;border-radius:10px;font-size:13.5px;line-height:1.6;white-space:pre-wrap}
  .test-msg.user{background:#d4a017;color:#0f1b3a;align-self:flex-end;border-bottom-right-radius:3px;font-weight:600}
  .test-msg.bot{background:#111827;color:#e0e6f0;border:1px solid #1e3a5f;align-self:flex-start;border-bottom-left-radius:3px}
  .test-inp-row{display:flex;border-top:1px solid #1e3a5f}
  .test-inp-row input{flex:1;padding:14px;background:#0f1b3a;border:none;outline:none;font-size:14px;font-family:inherit;color:#e0e6f0}
  .test-send{padding:14px 20px;background:#d4a017;color:#0f1b3a;border:none;cursor:pointer;font-size:14px;font-weight:700;transition:.2s}
  .test-send:hover{background:#c8900a}

  .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.7);z-index:1000;display:none;align-items:center;justify-content:center}
  .modal-bg.show{display:flex}
  .modal{background:#111827;border:1px solid #1e3a5f;border-radius:14px;padding:32px;width:100%;max-width:600px;max-height:90vh;overflow-y:auto}
  .modal-title{font-size:18px;font-weight:700;color:#d4a017;margin-bottom:20px;display:flex;align-items:center;gap:10px}
  .modal-actions{display:flex;gap:10px;justify-content:flex-end;margin-top:20px}

  #toast{position:fixed;bottom:24px;right:24px;background:#111827;border:1px solid #d4a01733;color:#e0e6f0;padding:12px 20px;border-radius:8px;font-size:13px;font-weight:600;transform:translateY(80px);transition:.3s;z-index:9999;display:flex;align-items:center;gap:8px;box-shadow:0 4px 20px rgba(0,0,0,.5)}
  #toast.show{transform:translateY(0)}
  #toast.success{border-color:#d4a017;color:#d4a017}
  #toast.error{border-color:#ef4444;color:#ef4444}

  @media(max-width:768px){.stats-grid{grid-template-columns:repeat(2,1fr)}.form-row{grid-template-columns:1fr}.sidebar{display:none}}
`;

export default function BotAdminPage() {
  const [auth, setAuth] = useState(false);
  const [pass, setPass] = useState("");
  const [passErr, setPassErr] = useState("");
  const [config, setConfig] = useState(null);
  const [tab, setTab] = useState("overview");
  const [saveStatus, setSaveStatus] = useState("");
  const [testMsgs, setTestMsgs] = useState([]);
  const [testInput, setTestInput] = useState("");
  const [testLoading, setTestLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newTopic, setNewTopic] = useState({ id: "", topic: "", content: "" });
  const [editingId, setEditingId] = useState(null);
  const [newQA, setNewQA] = useState("");
  const testBottomRef = useRef(null);

  useEffect(() => {
    testBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [testMsgs]);

  const login = async () => {
    setPassErr("");
    try {
      const res = await fetch("/api/bot-config", { headers: { "x-admin-password": pass } });
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
        setAuth(true);
        setTestMsgs([{ role: "bot", content: data.personality.greeting }]);
        toast("Logged in successfully!", "success");
      } else {
        setPassErr("Incorrect password. Please try again.");
      }
    } catch { setPassErr("Cannot connect to server."); }
  };

  const save = async (newConfig) => {
    setSaveStatus("Saving...");
    try {
      const res = await fetch("/api/bot-config", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-password": pass },
        body: JSON.stringify(newConfig),
      });
      if (res.ok) {
        setConfig(newConfig);
        setSaveStatus("✓ Saved");
        setTimeout(() => setSaveStatus(""), 2000);
        toast("Changes saved!", "success");
      } else { setSaveStatus("✗ Error"); toast("Save failed!", "error"); }
    } catch { setSaveStatus("✗ Error"); toast("Cannot connect!", "error"); }
  };

  const upPersonality = (field, value) => {
    const u = { ...config, personality: { ...config.personality, [field]: value } };
    setConfig(u);
  };

  const savePersonality = () => save(config);

  const addKnowledge = () => {
    if (!newTopic.topic || !newTopic.content) { toast("Fill all fields!", "error"); return; }
    const id = newTopic.id || `topic-${Date.now()}`;
    const u = { ...config, knowledge: [...config.knowledge, { ...newTopic, id }] };
    save(u);
    setNewTopic({ id: "", topic: "", content: "" });
    setShowModal(false);
    toast("Topic added!", "success");
  };

  const updateKnowledge = (id, field, value) => {
    const u = { ...config, knowledge: config.knowledge.map(k => k.id === id ? { ...k, [field]: value } : k) };
    setConfig(u);
  };

  const saveKnowledge = () => save(config);

  const deleteKnowledge = (id) => {
    if (!confirm("Delete this topic?")) return;
    const u = { ...config, knowledge: config.knowledge.filter(k => k.id !== id) };
    save(u);
  };

  const addQA = () => {
    if (!newQA.trim()) return;
    const u = { ...config, quickActions: [...config.quickActions, newQA.trim()] };
    save(u);
    setNewQA("");
  };

  const updateQA = (i, value) => {
    const u = { ...config, quickActions: config.quickActions.map((q, idx) => idx === i ? value : q) };
    setConfig(u);
  };

  const deleteQA = (i) => {
    const u = { ...config, quickActions: config.quickActions.filter((_, idx) => idx !== i) };
    save(u);
  };

  const sendTest = async () => {
    if (!testInput.trim() || testLoading) return;
    const msg = testInput.trim();
    setTestInput("");
    setTestMsgs(prev => [...prev, { role: "user", content: msg }]);
    setTestLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, history: testMsgs.map(m => ({ role: m.role === "bot" ? "assistant" : "user", content: m.content })) }),
      });
      const data = await res.json();
      setTestMsgs(prev => [...prev, { role: "bot", content: data.reply || "No response." }]);
    } catch {
      setTestMsgs(prev => [...prev, { role: "bot", content: "Error connecting to bot." }]);
    }
    setTestLoading(false);
  };

  const toast = (msg, type = "success") => {
    const t = document.getElementById("opc-toast");
    if (!t) return;
    t.querySelector("#toast-msg").textContent = msg;
    t.className = `show ${type}`;
    t.id = "opc-toast";
    setTimeout(() => { t.className = ""; }, 3000);
  };

  if (!auth) return (
    <>
      <style>{css}</style>
      <div className="login-wrap">
        <div className="login-box">
          <div style={{ fontSize: 40, marginBottom: 12 }}>🤖</div>
          <h1>OPC Chatbot Admin</h1>
          <p>Punjab Overseas Pakistanis Commission</p>
          <input className="login-input" type="password" placeholder="Enter admin password"
            value={pass} onChange={e => setPass(e.target.value)}
            onKeyDown={e => e.key === "Enter" && login()} />
          <button className="login-btn" onClick={login}>Login →</button>
          {passErr && <div className="login-err">{passErr}</div>}
        </div>
      </div>
    </>
  );

  const tabs = [
    { id: "overview", label: "Dashboard", icon: "🏠" },
    { id: "personality", label: "Bot Personality", icon: "🧠" },
    { id: "knowledge", label: "Knowledge Base", icon: "📚", badge: config?.knowledge?.length },
    { id: "quickactions", label: "Quick Actions", icon: "⚡", badge: config?.quickActions?.length },
    { id: "test", label: "Test Bot", icon: "💬" },
  ];

  return (
    <>
      <style>{css}</style>
      <div className="app">
        {/* TOPBAR */}
        <div className="topbar">
          <div className="topbar-left">
            <div className="topbar-icon">🤖</div>
            <div>
              <div className="topbar-title">OPC Chatbot Admin</div>
              <div className="topbar-sub">Punjab Overseas Pakistanis Commission</div>
            </div>
          </div>
          <div className="topbar-right">
            {saveStatus && <span className={`save-status${saveStatus.includes("✗") ? " err" : ""}`}>{saveStatus}</span>}
            <button className="logout-btn" onClick={() => { setAuth(false); setPass(""); }}>Logout</button>
          </div>
        </div>

        <div className="layout">
          {/* SIDEBAR */}
          <div className="sidebar">
            <div className="sidebar-sec">Menu</div>
            {tabs.map(t => (
              <div key={t.id} className={`nav-item${tab === t.id ? " active" : ""}`} onClick={() => setTab(t.id)}>
                <span className="icon">{t.icon}</span>
                {t.label}
                {t.badge !== undefined && <span className="nav-badge">{t.badge}</span>}
              </div>
            ))}
          </div>

          {/* MAIN */}
          <div className="main">

            {/* OVERVIEW */}
            {tab === "overview" && (
              <div className="panel active">
                <div className="panel-hdr">
                  <h2>Dashboard</h2>
                  <p>Manage your OPC Punjab chatbot training data and settings</p>
                </div>
                <div className="stats-grid">
                  <div className="stat-card"><div className="stat-icon">📚</div><div className="stat-num">{config.knowledge.length}</div><div className="stat-label">Knowledge Topics</div></div>
                  <div className="stat-card"><div className="stat-icon">⚡</div><div className="stat-num">{config.quickActions.length}</div><div className="stat-label">Quick Actions</div></div>
                  <div className="stat-card"><div className="stat-icon">🤖</div><div className="stat-num" style={{ fontSize: 16, marginTop: 4 }}>{config.personality.name}</div><div className="stat-label">Bot Name</div></div>
                  <div className="stat-card"><div className="stat-icon">🟢</div><div className="stat-num" style={{ fontSize: 14, color: "#4ade80", marginTop: 4 }}>Online</div><div className="stat-label">Bot Status</div></div>
                </div>
                <div className="card">
                  <div className="card-title">📖 How to use this dashboard</div>
                  <div style={{ fontSize: 13.5, color: "#9ca3af", lineHeight: 1.85 }}>
                    <strong style={{ color: "#d4a017" }}>📚 Knowledge Base</strong> — Add FAQs and topics the bot uses to answer questions<br />
                    <strong style={{ color: "#d4a017" }}>🧠 Bot Personality</strong> — Change bot name, greeting, tone, and fallback messages<br />
                    <strong style={{ color: "#d4a017" }}>⚡ Quick Actions</strong> — Manage clickable buttons shown to users when chat opens<br />
                    <strong style={{ color: "#d4a017" }}>💬 Test Bot</strong> — Talk to the bot live to verify it is working correctly<br /><br />
                    All changes save automatically when you click Save buttons.
                  </div>
                </div>
                <div className="card">
                  <div className="card-title">🔗 Quick Links</div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <a href="https://ospc.punjab.gov.pk" target="_blank" style={{ padding: "9px 16px", background: "#0f1b3a", color: "#d4a017", borderRadius: 7, fontSize: 13, fontWeight: 600, textDecoration: "none", border: "1px solid #d4a01733" }}>🌐 OPC Portal</a>
                    <a href="https://console.groq.com" target="_blank" style={{ padding: "9px 16px", background: "#0f1b3a", color: "#d4a017", borderRadius: 7, fontSize: 13, fontWeight: 600, textDecoration: "none", border: "1px solid #d4a01733" }}>🔑 Groq Console</a>
                  </div>
                </div>
              </div>
            )}

            {/* PERSONALITY */}
            {tab === "personality" && (
              <div className="panel active">
                <div className="panel-hdr"><h2>Bot Personality</h2><p>Configure how the bot presents itself and responds</p></div>
                <div className="card">
                  <div className="card-title">🪪 Identity</div>
                  <div className="form-row">
                    <div className="form-group"><label>Bot Name</label><input type="text" value={config.personality.name} onChange={e => upPersonality("name", e.target.value)} /></div>
                    <div className="form-group"><label>Role / Title</label><input type="text" value={config.personality.role} onChange={e => upPersonality("role", e.target.value)} /></div>
                  </div>
                  <div className="form-group"><label>Tone & Personality</label><textarea rows={3} value={config.personality.tone} onChange={e => upPersonality("tone", e.target.value)} /></div>
                </div>
                <div className="card">
                  <div className="card-title">💬 Messages</div>
                  <div className="form-group"><label>Greeting Message (shown when chat opens)</label><textarea rows={3} value={config.personality.greeting} onChange={e => upPersonality("greeting", e.target.value)} /></div>
                  <div className="form-group"><label>Fallback Message (when bot doesn't know the answer)</label><textarea rows={3} value={config.personality.fallback} onChange={e => upPersonality("fallback", e.target.value)} /></div>
                  <div className="form-group"><label>Off-Topic Message (when asked unrelated questions)</label><textarea rows={3} value={config.personality.offTopic} onChange={e => upPersonality("offTopic", e.target.value)} /></div>
                </div>
                <button className="btn btn-gold btn-lg" onClick={savePersonality}>💾 Save Personality</button>
              </div>
            )}

            {/* KNOWLEDGE BASE */}
            {tab === "knowledge" && (
              <div className="panel active">
                <div className="panel-hdr"><h2>Knowledge Base</h2><p>FAQ topics the bot uses to answer questions. Add, edit, or delete.</p></div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <span style={{ fontSize: 13, color: "#6b7280" }}>{config.knowledge.length} topics</span>
                  <div style={{ display: "flex", gap: 10 }}>
                    <button className="btn btn-green" onClick={saveKnowledge}>💾 Save All Changes</button>
                    <button className="btn btn-gold" onClick={() => setShowModal(true)}>+ Add New Topic</button>
                  </div>
                </div>
                <div className="kb-list">
                  {config.knowledge.map((k, idx) => (
                    <div key={k.id} className={`kb-item${editingId === k.id ? " editing" : ""}`}>
                      <div className="kb-hdr">
                        <div className="kb-title">📄 {k.topic} <span className="kb-tag">{k.id}</span></div>
                        <div className="kb-actions">
                          <button className="btn btn-navy" style={{ padding: "5px 12px", fontSize: 12 }} onClick={() => setEditingId(editingId === k.id ? null : k.id)}>✏️ Edit</button>
                          <button className="btn btn-red" style={{ padding: "5px 12px", fontSize: 12 }} onClick={() => deleteKnowledge(k.id)}>🗑️</button>
                        </div>
                      </div>
                      {editingId !== k.id && (
                        <div className={`kb-preview${false ? " exp" : ""}`} onClick={e => e.currentTarget.classList.toggle("exp")}>
                          {k.content.substring(0, 150)}{k.content.length > 150 ? "… (click to expand)" : ""}
                        </div>
                      )}
                      {editingId === k.id && (
                        <div style={{ marginTop: 12 }}>
                          <div className="form-row">
                            <div className="form-group"><label>Topic ID</label><input type="text" value={k.id} onChange={e => updateKnowledge(k.id, "id", e.target.value)} /></div>
                            <div className="form-group"><label>Topic Title</label><input type="text" value={k.topic} onChange={e => updateKnowledge(k.id, "topic", e.target.value)} /></div>
                          </div>
                          <div className="form-group"><label>Content</label><textarea rows={8} value={k.content} onChange={e => updateKnowledge(k.id, "content", e.target.value)} /></div>
                          <div style={{ display: "flex", gap: 8 }}>
                            <button className="btn btn-green" onClick={() => { saveKnowledge(); setEditingId(null); }}>✅ Save</button>
                            <button className="btn btn-gray" onClick={() => setEditingId(null)}>Cancel</button>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* QUICK ACTIONS */}
            {tab === "quickactions" && (
              <div className="panel active">
                <div className="panel-hdr"><h2>Quick Actions</h2><p>Clickable buttons shown to users when chat opens. Max 8 recommended.</p></div>
                <div className="card">
                  <div className="card-title">⚡ Quick Reply Buttons</div>
                  <div className="qa-list">
                    {config.quickActions.map((qa, i) => (
                      <div key={i} className="qa-item">
                        <input type="text" value={qa} onChange={e => updateQA(i, e.target.value)} style={{ background: "transparent", border: "none", color: "#e0e6f0", fontSize: 13.5, flex: 1, outline: "none" }} />
                        <button className="qa-del" onClick={() => deleteQA(i)}>✕</button>
                      </div>
                    ))}
                  </div>
                  <div className="add-row">
                    <input type="text" placeholder="e.g. How do I file a complaint?" value={newQA} onChange={e => setNewQA(e.target.value)} onKeyDown={e => e.key === "Enter" && addQA()} />
                    <button className="btn btn-gold" onClick={addQA}>+ Add</button>
                  </div>
                  <div style={{ marginTop: 16 }}>
                    <button className="btn btn-green btn-lg" onClick={() => save(config)}>💾 Save Quick Actions</button>
                  </div>
                </div>
              </div>
            )}

            {/* TEST BOT */}
            {tab === "test" && (
              <div className="panel active">
                <div className="panel-hdr"><h2>Test Bot</h2><p>Talk to the bot live. Changes must be saved first.</p></div>
                <div className="card">
                  <div className="card-title" style={{ justifyContent: "space-between" }}>
                    <span>💬 Live Chat Test</span>
                    <button className="btn btn-gray" style={{ fontSize: 12, padding: "5px 12px" }} onClick={() => setTestMsgs([{ role: "bot", content: config.personality.greeting }])}>🔄 Reset</button>
                  </div>
                  <div className="test-box">
                    <div className="test-msgs">
                      {testMsgs.map((m, i) => (
                        <div key={i} className={`test-msg ${m.role}`}>{m.content}</div>
                      ))}
                      {testLoading && <div className="test-msg bot" style={{ color: "#6b7280", fontStyle: "italic" }}>Typing…</div>}
                      <div ref={testBottomRef} />
                    </div>
                    <div className="test-inp-row">
                      <input placeholder="Ask the bot anything about OPC…" value={testInput} onChange={e => setTestInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendTest()} />
                      <button className="test-send" onClick={sendTest}>➤</button>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ADD TOPIC MODAL */}
      <div className={`modal-bg${showModal ? " show" : ""}`}>
        <div className="modal">
          <div className="modal-title">➕ Add New Knowledge Topic</div>
          <div className="form-group"><label>Topic ID (no spaces, use dashes)</label><input type="text" placeholder="e.g. how-to-file-complaint" value={newTopic.id} onChange={e => setNewTopic({ ...newTopic, id: e.target.value })} /></div>
          <div className="form-group"><label>Topic Title</label><input type="text" placeholder="e.g. How to File a Complaint" value={newTopic.topic} onChange={e => setNewTopic({ ...newTopic, topic: e.target.value })} /></div>
          <div className="form-group"><label>Content (detailed answer)</label><textarea rows={10} placeholder="Write the full FAQ answer here. Use line breaks and bullet points for clarity." value={newTopic.content} onChange={e => setNewTopic({ ...newTopic, content: e.target.value })} /></div>
          <div className="modal-actions">
            <button className="btn btn-gray" onClick={() => setShowModal(false)}>Cancel</button>
            <button className="btn btn-gold btn-lg" onClick={addKnowledge}>💾 Add Topic</button>
          </div>
        </div>
      </div>

      {/* TOAST */}
      <div id="opc-toast"><span id="toast-msg"></span></div>

      <style>{`#opc-toast{position:fixed;bottom:24px;right:24px;background:#111827;border:1px solid #d4a01733;color:#e0e6f0;padding:12px 20px;border-radius:8px;font-size:13px;font-weight:600;transform:translateY(80px);transition:.3s;z-index:9999;display:flex;align-items:center;gap:8px;box-shadow:0 4px 20px rgba(0,0,0,.5)}#opc-toast.show{transform:translateY(0)}#opc-toast.success{border-color:#d4a017;color:#d4a017}#opc-toast.error{border-color:#ef4444;color:#ef4444}`}</style>
    </>
  );
}
