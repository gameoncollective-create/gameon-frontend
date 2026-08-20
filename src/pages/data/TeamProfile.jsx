import { Link, useParams } from 'react-router-dom';
import { useGameOnData } from '../../DataContext.jsx';
import { posShort } from '../../api.js';
import PlayerCard from '../../components/PlayerCard.jsx';

const GROUP_LABELS = { GK: 'Goalkeeper', DEF: 'Defender', MID: 'Midfielder', FWD: 'Forward' };

export default function TeamProfile() {
  const { id } = useParams();
  const { store, teamById } = useGameOnData();
  const team = teamById(id);

  if (store.loaded && !team) {
    return <div className="empty-state">Club not found.</div>;
  }
  if (!team) {
    return <div className="loading">Loading club…</div>;
  }

  const roster = store.players.filter(p => String(p.team_id) === String(id));
  const groups = { GK: [], DEF: [], MID: [], FWD: [] };
  roster.forEach(p => groups[posShort(p.position)].push(p));

  const hasAny = Object.values(groups).some(g => g.length);

  return (
    <>
      <Link className="back-link" to="/data/teams">← Back to clubs</Link>
      <div className="profile-hero">
        <div>
          <div className="eyebrow">{team.city || 'Club profile'}</div>
          <h1>{team.name}</h1>
        </div>
      </div>
      {hasAny ? Object.entries(groups).map(([key, list]) => list.length ? (
        <div key={key} style={{ marginBottom: 32 }}>
          <h3 style={{ fontFamily: 'var(--display)', fontWeight: 400, fontSize: '1.3rem', marginBottom: 16, textTransform: 'uppercase' }}>
            {GROUP_LABELS[key]}s
          </h3>
          <div className="grid cols-4">
            {list.map(p => <PlayerCard key={p.id} player={p} />)}
          </div>
        </div>
      ) : null) : <div className="empty-state">No roster data linked for this club yet.</div>}
    </>
  );
}
