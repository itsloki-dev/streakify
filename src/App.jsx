import { useState, useMemo, useCallback } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Mono:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --bg: #050505;
    --surface: #0d0d0d;
    --surface-2: #141414;
    --surface-3: #1a1a1a;
    --border: rgba(255,255,255,0.07);
    --border-hover: rgba(255,255,255,0.14);
    --text: #ffffff;
    --text-secondary: rgba(255,255,255,0.6);
    --text-muted: rgba(255,255,255,0.3);
    --text-dim: rgba(255,255,255,0.15);
    --accent: #f97316;
    --accent-2: #fb923c;
    --accent-dim: rgba(249,115,22,0.1);
    --accent-glow: rgba(249,115,22,0.2);
    --red-dim: rgba(248,113,113,0.1);
  }

  body { background: var(--bg); }

  .app {
    min-height: 100vh;
    background: var(--bg);
    font-family: 'DM Mono', monospace;
    color: var(--text);
    position: relative;
    overflow-x: hidden;
  }

  /* ambient orb */
  .app::before {
    content: '';
    position: fixed;
    top: -200px;
    left: 50%;
    transform: translateX(-50%);
    width: 700px;
    height: 400px;
    background: radial-gradient(ellipse, rgba(249,115,22,0.07) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  /* dot grid */
  .app::after {
    content: '';
    position: fixed;
    inset: 0;
    background-image: radial-gradient(circle, rgba(255,255,255,0.06) 1px, transparent 1px);
    background-size: 28px 28px;
    pointer-events: none;
    z-index: 0;
    mask-image: radial-gradient(ellipse 80% 80% at 50% 0%, black 40%, transparent 100%);
  }

  .content { position: relative; z-index: 1; }

  /* ── Navbar ── */
  .navbar {
    position: sticky;
    top: 0;
    z-index: 100;
    border-bottom: 1px solid var(--border);
    background: rgba(5,5,5,0.8);
    backdrop-filter: blur(24px);
  }
  .navbar-inner {
    max-width: 580px;
    margin: 0 auto;
    padding: 0 24px;
    height: 60px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }
  .logo {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 20px;
    letter-spacing: -0.04em;
    color: var(--text);
    display: flex;
    align-items: center;
    gap: 7px;
  }
  .logo-fire {
    font-size: 18px;
    filter: drop-shadow(0 0 6px rgba(249,115,22,0.8));
    animation: flicker 2.4s ease-in-out infinite;
  }
  @keyframes flicker {
    0%, 100% { filter: drop-shadow(0 0 6px rgba(249,115,22,0.8)); transform: scale(1); }
    30%       { filter: drop-shadow(0 0 10px rgba(251,146,60,1));   transform: scale(1.05) rotate(-3deg); }
    60%       { filter: drop-shadow(0 0 4px rgba(249,115,22,0.6));  transform: scale(0.97) rotate(2deg); }
    80%       { filter: drop-shadow(0 0 12px rgba(251,146,60,0.9)); transform: scale(1.03); }
  }
  .logo-text { color: var(--text); }
  .logo-text span { color: var(--accent); }

  .nav-right {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .streak-pill {
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    font-weight: 500;
    color: var(--accent);
    background: var(--accent-dim);
    border: 1px solid rgba(249,115,22,0.2);
    padding: 4px 12px;
    border-radius: 100px;
    letter-spacing: 0.04em;
  }

  /* ── Main ── */
  .main {
    max-width: 580px;
    margin: 0 auto;
    padding: 32px 24px 80px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  /* ── Stats row ── */
  .stats-row {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    gap: 10px;
  }
  .stat-card {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 14px;
    padding: 14px 16px;
    display: flex;
    flex-direction: column;
    gap: 4px;
    transition: border-color 0.2s;
  }
  .stat-card:hover { border-color: var(--border-hover); }
  .stat-value {
    font-family: 'Syne', sans-serif;
    font-size: 22px;
    font-weight: 800;
    color: var(--text);
    letter-spacing: -0.03em;
    line-height: 1;
  }
  .stat-label {
    font-size: 10px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  /* ── Search ── */
  .search-wrap { position: relative; }
  .search-icon {
    position: absolute;
    left: 14px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
    pointer-events: none;
    width: 14px; height: 14px;
  }
  .search-input {
    width: 100%;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 13px;
    padding: 12px 14px 12px 40px;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s;
  }
  .search-input::placeholder { color: var(--text-dim); }
  .search-input:focus {
    border-color: rgba(249,115,22,0.35);
    box-shadow: 0 0 0 3px rgba(249,115,22,0.07), 0 0 16px rgba(249,115,22,0.05);
  }

  /* ── Section header ── */
  .section-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 4px 0;
  }
  .section-title {
    font-size: 10px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.12em;
    font-weight: 500;
  }
  .section-line {
    flex: 1;
    height: 1px;
    background: var(--border);
    margin-left: 12px;
  }

  /* ── Streak list ── */
  .streak-list { display: flex; flex-direction: column; gap: 7px; }

  .streak-item {
    display: flex;
    align-items: center;
    gap: 14px;
    padding: 15px 18px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    animation: fadeUp 0.3s ease both;
    position: relative;
    overflow: hidden;
  }
  .streak-item::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(105deg, rgba(249,115,22,0.03) 0%, transparent 60%);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .streak-item:hover {
    border-color: var(--border-hover);
    background: var(--surface-2);
    transform: translateY(-2px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px var(--border-hover), 0 4px 12px rgba(249,115,22,0.04);
  }
  .streak-item:hover::before { opacity: 1; }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .streak-accent-line {
    width: 2px;
    height: 36px;
    border-radius: 2px;
    background: linear-gradient(180deg, var(--accent), transparent);
    flex-shrink: 0;
  }

  .streak-info { flex: 1; min-width: 0; }
  .streak-name {
    font-family: 'Syne', sans-serif;
    font-size: 15px;
    font-weight: 700;
    color: var(--text);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    letter-spacing: -0.01em;
  }
  .streak-meta {
    font-size: 10px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.08em;
    margin-top: 3px;
  }

  .streak-right { display: flex; align-items: center; gap: 8px; }

  .streak-count-btn {
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    font-weight: 500;
    color: var(--accent);
    background: var(--accent-dim);
    border: 1px solid rgba(249,115,22,0.18);
    border-radius: 9px;
    padding: 6px 13px;
    cursor: pointer;
    transition: all 0.15s;
    letter-spacing: 0.01em;
    white-space: nowrap;
  }
  .streak-count-btn:hover {
    background: rgba(249,115,22,0.18);
    border-color: rgba(249,115,22,0.35);
    box-shadow: 0 0 12px rgba(249,115,22,0.15);
  }

  .streak-count-input {
    width: 68px;
    text-align: center;
    font-family: 'DM Mono', monospace;
    font-size: 13px;
    color: var(--accent);
    background: var(--accent-dim);
    border: 1px solid rgba(249,115,22,0.35);
    border-radius: 9px;
    padding: 6px 8px;
    outline: none;
    box-shadow: 0 0 10px rgba(249,115,22,0.1);
  }

  .delete-btn {
    width: 28px; height: 28px;
    display: flex; align-items: center; justify-content: center;
    background: none;
    border: 1px solid transparent;
    border-radius: 8px;
    color: var(--text-dim);
    cursor: pointer;
    font-size: 11px;
    opacity: 0;
    transition: all 0.15s;
  }
  .streak-item:hover .delete-btn { opacity: 1; }
  .delete-btn:hover {
    color: #f87171;
    background: var(--red-dim);
    border-color: rgba(248,113,113,0.2);
  }

  /* ── Connect Panel ── */
  .connect-panel {
    border: 1px solid var(--border);
    border-radius: 16px;
    overflow: hidden;
    background: var(--surface);
  }
  .connect-toggle {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 14px 18px;
    background: none;
    border: none;
    cursor: pointer;
    font-family: 'DM Mono', monospace;
    font-size: 11px;
    color: var(--text-secondary);
    letter-spacing: 0.07em;
    text-transform: uppercase;
    transition: all 0.15s;
  }
  .connect-toggle:hover { color: var(--text); background: var(--surface-2); }
  .connect-toggle-left { display: flex; align-items: center; gap: 8px; }
  .connect-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: var(--accent);
    box-shadow: 0 0 6px var(--accent);
    animation: pulse 2s ease-in-out infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; box-shadow: 0 0 6px var(--accent); }
    50%       { opacity: 0.5; box-shadow: 0 0 3px var(--accent); }
  }
  .chevron {
    width: 14px; height: 14px;
    transition: transform 0.2s;
    color: var(--text-muted);
  }
  .chevron.open { transform: rotate(180deg); }

  .connect-body {
    border-top: 1px solid var(--border);
    padding: 18px;
    display: flex;
    flex-direction: column;
    gap: 16px;
    animation: slideDown 0.2s ease;
    background: var(--surface);
  }
  @keyframes slideDown {
    from { opacity: 0; transform: translateY(-6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .connect-hint {
    font-size: 11px;
    color: var(--text-muted);
    letter-spacing: 0.02em;
    line-height: 1.7;
  }
  .integration-label {
    font-size: 10px;
    color: var(--text-secondary);
    letter-spacing: 0.1em;
    text-transform: uppercase;
    margin-bottom: 7px;
    display: block;
  }
  .integration-row { display: flex; gap: 8px; }

  /* ── Inputs ── */
  .text-input {
    flex: 1;
    background: var(--bg);
    border: 1px solid var(--border);
    border-radius: 11px;
    padding: 10px 13px;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: var(--text);
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
  }
  .text-input::placeholder { color: var(--text-dim); }
  .text-input:focus {
    border-color: rgba(249,115,22,0.35);
    box-shadow: 0 0 0 3px rgba(249,115,22,0.06);
  }

  .btn-accent {
    padding: 10px 18px;
    background: var(--accent);
    border: none;
    border-radius: 11px;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    font-weight: 500;
    color: #000;
    cursor: pointer;
    transition: all 0.15s;
    white-space: nowrap;
    letter-spacing: 0.03em;
  }
  .btn-accent:hover {
    background: var(--accent-2);
    box-shadow: 0 0 16px rgba(249,115,22,0.3);
  }
  .btn-accent:active { transform: scale(0.97); }
  .btn-accent:disabled { opacity: 0.3; cursor: not-allowed; }

  .error-msg {
    font-size: 11px;
    color: #f87171;
    margin-top: 5px;
    letter-spacing: 0.02em;
  }

  /* ── Empty State ── */
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 56px 0;
    gap: 8px;
  }
  .empty-icon {
    font-size: 32px;
    opacity: 0.2;
    margin-bottom: 4px;
    filter: grayscale(1);
  }
  .empty-text {
    font-family: 'Syne', sans-serif;
    font-size: 14px;
    font-weight: 600;
    color: var(--text-muted);
    letter-spacing: -0.01em;
  }
  .empty-sub {
    font-size: 11px;
    color: var(--text-dim);
    letter-spacing: 0.02em;
  }

  .add-trigger {
    width: 100%;
    padding: 12px;
    background: none;
    border: 1px dashed rgba(255,255,255,0.08);
    border-radius: 14px;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: var(--text-muted);
    cursor: pointer;
    letter-spacing: 0.05em;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }
  .add-trigger:hover {
    color: var(--text-secondary);
    border-color: rgba(249,115,22,0.25);
    background: var(--accent-dim);
    box-shadow: 0 0 20px rgba(249,115,22,0.04);
  }
  .add-plus {
    width: 18px; height: 18px;
    border: 1px solid currentColor;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px;
    line-height: 1;
  }

  .add-form {
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 18px;
    display: flex;
    flex-direction: column;
    gap: 13px;
    animation: slideDown 0.2s ease;
  }
  .add-form-label {
    font-size: 10px;
    color: var(--text-muted);
    text-transform: uppercase;
    letter-spacing: 0.12em;
  }
  .add-form-row { display: flex; gap: 8px; }
  .add-form-actions { display: flex; gap: 8px; align-items: center; }
  .btn-ghost {
    background: none;
    border: none;
    font-family: 'DM Mono', monospace;
    font-size: 12px;
    color: var(--text-dim);
    cursor: pointer;
    padding: 10px 14px;
    border-radius: 11px;
    transition: all 0.15s;
    letter-spacing: 0.03em;
  }
  .btn-ghost:hover { color: var(--text-muted); background: var(--surface-2); }

  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.08); border-radius: 4px; }

  @media (max-width: 600px) {
    .main { padding: 20px 16px 60px; }
    .navbar-inner { padding: 0 16px; }
    .stats-row { gap: 8px; }
    .stat-value { font-size: 18px; }
  }
`;

async function fetchLeetCodeStreak(username) {
  throw new Error("LeetCode API not connected yet");
}
async function fetchDuolingoStreak(username) {
  throw new Error("Duolingo API not connected yet");
}

const INTEGRATIONS = [
  { key: "leetcode", label: "LeetCode", fetchFn: fetchLeetCodeStreak, placeholder: "username" },
  { key: "duolingo", label: "Duolingo", fetchFn: fetchDuolingoStreak, placeholder: "username" },
];

function useStreaks() {
  const [streaks, setStreaks] = useState([]);
  const [loading, setLoading] = useState({});
  const [errors, setErrors] = useState({});

  const fetchStreak = useCallback(async (integration, username) => {
    if (!username.trim()) return;
    setLoading(p => ({ ...p, [integration.key]: true }));
    setErrors(p => ({ ...p, [integration.key]: null }));
    try {
      const data = await integration.fetchFn(username.trim());
      setStreaks(p => {
        const rest = p.filter(s => s.source !== integration.key);
        return [...rest, ...data.map(d => ({ ...d, source: integration.key, id: `${integration.key}-${d.name}` }))];
      });
    } catch (err) {
      setErrors(p => ({ ...p, [integration.key]: err.message }));
    } finally {
      setLoading(p => ({ ...p, [integration.key]: false }));
    }
  }, []);

  const addManual = useCallback((name, streak) => {
    setStreaks(p => [...p, { id: `manual-${Date.now()}`, name, streak, source: "manual" }]);
  }, []);

  const remove = useCallback((id) => setStreaks(p => p.filter(s => s.id !== id)), []);
  const update = useCallback((id, streak) => setStreaks(p => p.map(s => s.id === id ? { ...s, streak } : s)), []);

  return { streaks, loading, errors, fetchStreak, addManual, remove, update };
}

function Navbar({ count }) {
  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="logo">
          <span className="logo-fire">🔥</span>
          <span className="logo-text">streak<span>ify</span></span>
        </div>
        <div className="nav-right">
          <span className="streak-pill">{count} {count === 1 ? "streak" : "streaks"}</span>
        </div>
      </div>
    </header>
  );
}

function StatsRow({ streaks }) {
  const longest = streaks.length ? Math.max(...streaks.map(s => s.streak)) : 0;
  const avg = streaks.length ? Math.round(streaks.reduce((a, b) => a + b.streak, 0) / streaks.length) : 0;
  return (
    <div className="stats-row">
      {[
        { value: streaks.length, label: "active" },
        { value: `${longest}d`, label: "longest" },
        { value: `${avg}d`, label: "average" },
      ].map(({ value, label }) => (
        <div className="stat-card" key={label}>
          <span className="stat-value">{value}</span>
          <span className="stat-label">{label}</span>
        </div>
      ))}
    </div>
  );
}

function SearchBar({ value, onChange }) {
  return (
    <div className="search-wrap">
      <svg className="search-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
      <input className="search-input" type="text" placeholder="search streaks..."
        value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
}

function StreakItem({ item, onDelete, onUpdate, index }) {
  const [editing, setEditing] = useState(false);
  const [val, setVal] = useState(item.streak);

  const commit = () => {
    const n = parseInt(val);
    if (!isNaN(n) && n >= 0) onUpdate(item.id, n);
    else setVal(item.streak);
    setEditing(false);
  };

  return (
    <div className="streak-item" style={{ animationDelay: `${index * 0.055}s` }}>
      <div className="streak-accent-line" />
      <div className="streak-info">
        <div className="streak-name">{item.name}</div>
        {item.source !== "manual" && <div className="streak-meta">{item.source}</div>}
      </div>
      <div className="streak-right">
        {editing ? (
          <input className="streak-count-input" autoFocus type="number" value={val}
            onChange={e => setVal(e.target.value)} onBlur={commit}
            onKeyDown={e => { if (e.key === "Enter") commit(); if (e.key === "Escape") { setVal(item.streak); setEditing(false); } }} />
        ) : (
          <button className="streak-count-btn" onClick={() => { setEditing(true); setVal(item.streak); }}>
            {item.streak}d
          </button>
        )}
        <button className="delete-btn" onClick={() => onDelete(item.id)}>✕</button>
      </div>
    </div>
  );
}

function ConnectPanel({ integrations, loading, errors, onFetch }) {
  const [open, setOpen] = useState(false);
  const [usernames, setUsernames] = useState({});

  return (
    <div className="connect-panel">
      <button className="connect-toggle" onClick={() => setOpen(o => !o)}>
        <span className="connect-toggle-left">
          <span className="connect-dot" />
          connect accounts
        </span>
        <svg className={`chevron ${open ? "open" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="m6 9 6 6 6-6" />
        </svg>
      </button>
      {open && (
        <div className="connect-body">
          {integrations.map(ig => (
            <div key={ig.key}>
              <span className="integration-label">{ig.label}</span>
              <div className="integration-row">
                <input className="text-input" type="text" placeholder={ig.placeholder}
                  value={usernames[ig.key] || ""}
                  onChange={e => setUsernames(u => ({ ...u, [ig.key]: e.target.value }))}
                  onKeyDown={e => e.key === "Enter" && onFetch(ig, usernames[ig.key] || "")} />
                <button className="btn-accent" disabled={loading[ig.key]}
                  onClick={() => onFetch(ig, usernames[ig.key] || "")}>
                  {loading[ig.key] ? "..." : "fetch"}
                </button>
              </div>
              {errors[ig.key] && <p className="error-msg">{errors[ig.key]}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AddManualForm({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [days, setDays] = useState("");

  const submit = () => {
    if (!name.trim()) return;
    onAdd(name.trim(), parseInt(days) || 1);
    setName(""); setDays(""); setOpen(false);
  };

  if (!open) return (
    <button className="add-trigger" onClick={() => setOpen(true)}>
      <span className="add-plus">+</span>
      add streak manually
    </button>
  );

  return (
    <div className="add-form">
      <span className="add-form-label">new streak</span>
      <div className="add-form-row">
        <input className="text-input" autoFocus type="text" placeholder="habit or app name" value={name}
          onChange={e => setName(e.target.value)}
          onKeyDown={e => { if (e.key === "Enter") submit(); if (e.key === "Escape") setOpen(false); }} />
        <input className="text-input" type="number" placeholder="days" value={days}
          onChange={e => setDays(e.target.value)} style={{ width: 80, flex: "none" }}
          onKeyDown={e => { if (e.key === "Enter") submit(); if (e.key === "Escape") setOpen(false); }} />
      </div>
      <div className="add-form-actions">
        <button className="btn-accent" onClick={submit}>add streak</button>
        <button className="btn-ghost" onClick={() => setOpen(false)}>cancel</button>
      </div>
    </div>
  );
}

function EmptyState({ hasSearch }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">🔥</div>
      <p className="empty-text">{hasSearch ? "no results found" : "no streaks yet"}</p>
      <p className="empty-sub">{hasSearch ? "try a different search term" : "connect an account or add one manually"}</p>
    </div>
  );
}

export default function App() {
  const [search, setSearch] = useState("");
  const { streaks, loading, errors, fetchStreak, addManual, remove, update } = useStreaks();

  const filtered = useMemo(() =>
    streaks.filter(s => s.name.toLowerCase().includes(search.toLowerCase())),
    [streaks, search]
  );

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <div className="content">
          <Navbar count={streaks.length} />
          <main className="main">
            <StatsRow streaks={streaks} />
            <SearchBar value={search} onChange={setSearch} />
            <ConnectPanel integrations={INTEGRATIONS} loading={loading} errors={errors} onFetch={fetchStreak} />
            <div className="section-header">
              <span className="section-title">your streaks</span>
              <div className="section-line" />
            </div>
            <div className="streak-list">
              {filtered.length === 0
                ? <EmptyState hasSearch={search.length > 0} />
                : filtered.map((item, i) => (
                    <StreakItem key={item.id} item={item} index={i} onDelete={remove} onUpdate={update} />
                  ))}
            </div>
            <AddManualForm onAdd={addManual} />
          </main>
        </div>
      </div>
    </>
  );
}
