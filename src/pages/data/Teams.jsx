import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useGameOnData } from '../../DataContext.jsx';

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
            <div className="player-card-top">
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
