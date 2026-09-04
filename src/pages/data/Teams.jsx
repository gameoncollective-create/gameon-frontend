import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGameOnData } from '../../DataContext.jsx';
import { API_BASE, initials } from '../../api.js';

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
        {teams.length ? teams.map(t => (
                        <Link key={t.id} to={`/data/team/${t.id}`} className="card">
                <div className="player-card-top" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <img
                    src={t.logo ? `${API_BASE}${t.logo}` : ''}
                    alt={`${t.name} logo`}
                    onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
                    style={{ width: 48, height: 48, borderRadius: '50%', objectFit: 'cover', background: '#111', flexShrink: 0, display: t.logo ? 'block' : 'none' }}
                  />
                  <div style={{ width: 48, height: 48, borderRadius: '50%', background: '#1a1a1a', border: '1px solid #333', color: '#F5C518', fontWeight: 700, fontSize: 14, alignItems: 'center', justifyContent: 'center', flexShrink: 0, display: t.logo ? 'none' : 'flex' }}>
                    {initials(t.name)}
                  </div>
                  <div className="info"><h4>{t.name}</h4><p>{t.city || ''}</p></div>
                </div>
                <div className="card-stats-row">
                  <span>{store.players.filter(p => String(p.team_id) === String(t.id)).length} players tracked</span>
                </div>
              </Link> 
        )) : <div className="empty-state">No clubs loaded for this league.</div>}
      </div>
    </>
  );
}
