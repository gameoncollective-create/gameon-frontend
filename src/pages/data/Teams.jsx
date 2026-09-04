import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGameOnData } from '../../DataContext.jsx';
import { API_BASE, initials } from '../../api.js';

function findStanding(standings, teamName) {
  if (!standings || !teamName) return null;
  const norm = s => s.toLowerCase().replace(/[^a-z]/g, '');
  const target = norm(teamName);
  return standings.find(s => norm(s.team) === target)
    || standings.find(s => norm(s.team).includes(target) || target.includes(norm(s.team)))
    || null;
}

const LEAGUES = [
  { key: 'premier', label: 'Premier League' },
  { key: 'nsl', label: 'National Super League' },
  { key: 'zoneA', label: 'Division One — Zone A' },
  { key: 'zoneB', label: 'Division One — Zone B' }
];

export default function Teams() {
  const { store } = useGameOnData();
  const [active, setActive] = useState('premier');
  const sets = {
    premier: store.premierTeams, nsl: store.nslTeams,
    zoneA: store.zoneATeams, zoneB: store.zoneBTeams
  };
  const teams = sets[active];

  return (
    <>
      <div className="tabs">
        {LEAGUES.map(l => (
          <button key={l.key} className={active === l.key ? 'active' : ''} onClick={() => setActive(l.key)}>{l.label}</button>
        ))}
      </div>
      <div className="grid cols-3">
        {teams.length ? teams.map((t, i) => {
          const standing = findStanding(store.premierStandings, t.name);
          return (
            <Link key={t.id} to={`/data/team/${t.id}`} className="card" style={{
              display: 'block',
              background: '#141414',
              border: '1px solid #262626',
              borderTop: `3px solid ${['#E7A33E', '#4E8CA3', '#B24A38', '#6C8C4F'][i % 4]}`,
              borderRadius: 8,
              padding: '18px 20px',
              textDecoration: 'none'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <img
                  src={t.logo ? `${API_BASE}${t.logo}` : ''}
                  alt={`${t.name} logo`}
                  onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
                  style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', background: '#0a0a0a', border: '1px solid #2a2a2a', flexShrink: 0, display: t.logo ? 'block' : 'none' }}
                />
                <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#0a0a0a', border: '1px solid #2a2a2a', color: '#E7A33E', fontWeight: 700, fontSize: 16, alignItems: 'center', justifyContent: 'center', flexShrink: 0, display: t.logo ? 'none' : 'flex' }}>
                  {initials(t.name)}
                </div>
                <div style={{ flex: 1 }}>
                  <h4 style={{ margin: 0, fontSize: 18, letterSpacing: '0.02em' }}>{t.name}</h4>
                  <p style={{ margin: '4px 0 0', fontSize: 13, color: '#999', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{t.city || ''}</p>
                </div>
                {standing && (
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ fontSize: 22, fontWeight: 700, color: '#E7A33E', lineHeight: 1 }}>{standing.position}</div>
                    <div style={{ fontSize: 10, color: '#777', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 2 }}>Position</div>
                  </div>
                )}
              </div>
              <div style={{
                marginTop: 16,
                paddingTop: 12,
                borderTop: '1px solid #232323',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end'
              }}>
                <span style={{
                  fontSize: 12,
                  color: '#E7A33E',
                  fontWeight: 600,
                  letterSpacing: '0.05em'
                }}>
                  View Profile →
                </span>
              </div>
            </Link>
          );
        }) : <div className="empty-state">No clubs loaded for this league.</div>}
      </div>
    </>
  );
}
