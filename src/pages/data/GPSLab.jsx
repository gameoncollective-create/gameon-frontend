import { useEffect, useState } from 'react';
import { api } from '../../api.js';

export default function GPSLab() {
  const [status, setStatus] = useState(null);
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    api('/api/gps/status').then(setStatus).catch(() => {});
    api('/api/gps/sessions').then(setSessions).catch(() => {});
  }, []);

  const players = status?.players_ready || [];

  return (
    <>
      <div className="gps-hero">
        <div className="eyebrow">GPS Lab</div>
        <h2 style={{ fontSize: '2.2rem', margin: '14px 0' }}>{status?.message || 'A pilot in GPS performance tracking.'}</h2>
        <p style={{ color: 'var(--text-dim)', maxWidth: '60ch' }}>
          We're currently running GPS tracking with {status?.total_vests ?? 3} vests — enough for {status?.total_players ?? 3} players at a time.
          Distance covered, sprint counts, and work rate, made visible to scouts and coaches as the program grows.
        </p>
        <div style={{ display: 'flex', gap: 34, fontFamily: 'var(--mono)', marginTop: 24 }}>
          <div>
            <b style={{ display: 'block', fontSize: '1.4rem', color: 'var(--amber)' }}>{status?.total_vests ?? 3}</b>
            <span style={{ fontSize: '.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Vests deployed</span>
          </div>
          <div>
            <b style={{ display: 'block', fontSize: '1.4rem', color: 'var(--amber)' }}>{status?.total_players ?? 3}</b>
            <span style={{ fontSize: '.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Players tracked</span>
          </div>
        </div>
      </div>

      <div className="section-head"><h2 style={{ fontSize: '1.6rem' }}>Players currently tracked</h2></div>
      <div className="grid cols-3" style={{ marginBottom: 40 }}>
        {players.length ? players.map(p => (
          <div className="vest-card" key={p.vest_number}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <div className="vest-num">{p.vest_number}</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: '.9rem' }}>{p.player_name}</div>
                <div style={{ fontFamily: 'var(--mono)', fontSize: '.7rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>{p.position}</div>
              </div>
            </div>
            <span className="status-chip">{(p.status || 'pending').replace('_', ' ')}</span>
          </div>
        )) : <div className="empty-state">No queue data available.</div>}
      </div>

      <div className="section-head"><h2 style={{ fontSize: '1.6rem' }}>Sessions</h2></div>
      <div>
        {sessions.length ? sessions.map((s, i) => (
          <div className="panel" key={i} style={{ marginBottom: 14, display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div>
              <div style={{ fontWeight: 600 }}>{s.match}</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '.75rem', color: 'var(--text-dim)', marginTop: 4 }}>{s.date}</div>
            </div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '.8rem', textAlign: 'right' }}>
              <div>{s.players_tracked} players · {s.vests_used} vests</div>
              <span className="status-chip">{s.status}</span>
            </div>
          </div>
        )) : <div className="empty-state">No sessions scheduled yet.</div>}
      </div>
    </>
  );
}
