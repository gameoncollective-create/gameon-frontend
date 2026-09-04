import { Link, useParams } from 'react-router-dom';
import { useGameOnData } from '../../DataContext.jsx';
import { posShort, API_BASE, initials } from '../../api.js';
import PlayerCard from '../../components/PlayerCard.jsx';

const GROUP_LABELS = { GK: 'Goalkeeper', DEF: 'Defender', MID: 'Midfielder', FWD: 'Forward' };

function findStanding(standings, teamName) {
  if (!standings || !teamName) return null;
  const norm = s => s.toLowerCase().replace(/[^a-z]/g, '');
  const target = norm(teamName);
  return standings.find(s => norm(s.team) === target)
    || standings.find(s => norm(s.team).includes(target) || target.includes(norm(s.team)))
    || null;
}

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
  const standing = findStanding(store.premierStandings, team.name);

  return (
    <>
      <Link className="back-link" to="/data/teams">← Back to clubs</Link>

      <div className="profile-hero" style={{ display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
        <img
          src={team.logo ? `${API_BASE}${team.logo}` : ''}
          alt={`${team.name} logo`}
          onError={(e) => { e.currentTarget.style.display = 'none'; e.currentTarget.nextSibling.style.display = 'flex'; }}
          style={{ width: 96, height: 96, borderRadius: '50%', objectFit: 'cover', background: '#0a0a0a', border: '1px solid #2a2a2a', flexShrink: 0, display: team.logo ? 'block' : 'none' }}
        />
        <div style={{ width: 96, height: 96, borderRadius: '50%', background: '#0a0a0a', border: '1px solid #2a2a2a', color: '#E7A33E', fontWeight: 700, fontSize: 26, alignItems: 'center', justifyContent: 'center', flexShrink: 0, display: team.logo ? 'none' : 'flex' }}>
          {initials(team.name)}
        </div>

        <div style={{ flex: 1 }}>
          <div className="eyebrow">{team.city || 'Club profile'}</div>
          <h1 style={{ margin: 0 }}>{team.name}</h1>
        </div>

        {standing && (
          <div style={{ display: 'flex', gap: 24, flexShrink: 0 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#E7A33E', lineHeight: 1 }}>{standing.position}</div>
              <div style={{ fontSize: 11, color: '#777', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>Position</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 28, fontWeight: 700, color: '#fff', lineHeight: 1 }}>{standing.points}</div>
              <div style={{ fontSize: 11, color: '#777', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>Points</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: '#fff', lineHeight: 1, paddingTop: 6 }}>
                {standing.won}-{standing.drawn}-{standing.lost}
              </div>
              <div style={{ fontSize: 11, color: '#777', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: 4 }}>W-D-L</div>
            </div>
          </div>
        )}
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
      ) : null) : (
        <div className="empty-state" style={{ textAlign: 'center', padding: '48px 24px' }}>
          <p style={{ margin: 0, fontSize: 15 }}>No roster data linked for this club yet.</p>
          <p style={{ margin: '8px 0 0', fontSize: 13, color: '#777' }}>
            Player profiles are added as clubs come onto the platform.
          </p>
        </div>
      )}
    </>
  );
}
