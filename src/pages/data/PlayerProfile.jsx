import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGameOnData } from '../../DataContext.jsx';
import { api } from '../../api.js';
import ScoutDial from '../../components/ScoutDial.jsx';

export default function PlayerProfile() {
  const { id } = useParams();
  const { store, teamById, playerById } = useGameOnData();
  const [scout, setScout] = useState(null);
  const [gps, setGps] = useState(null);

  const player = playerById(id);

  useEffect(() => {
    let cancelled = false;
    setScout(null);
    setGps(null);
    api(`/api/scout-score/${id}`).then(d => { if (!cancelled) setScout(d); }).catch(() => {});
    api(`/api/player/${id}`).then(d => { if (!cancelled) setGps(d.gps); }).catch(() => {});
    return () => { cancelled = true; };
  }, [id]);

  if (store.loaded && !player) {
    return <div className="empty-state">Player not found.</div>;
  }
  if (!player) {
    return <div className="loading">Loading player profile…</div>;
  }

  const team = teamById(player.team_id);

  return (
    <>
      <Link className="back-link" to="/data/players">← Back to directory</Link>
      <div className="profile-hero">
        <div>
          <div className="eyebrow">{team ? team.name : (player.league || 'Unattached')}</div>
          <h1>{player.name}</h1>
          <div className="meta">{player.position || ''}</div>
        </div>
        {scout && <ScoutDial score={scout.scout_score} size={88} />}
      </div>
      <div className="stat-strip">
        <div className="box"><b>{player.goals ?? 0}</b><span>Goals</span></div>
        <div className="box"><b>{player.assists ?? 0}</b><span>Assists</span></div>
        <div className="box"><b>{player.appearances ?? 0}</b><span>Appearances</span></div>
        <div className="box"><b>{player.player_rating ?? '—'}</b><span>Rating</span></div>
      </div>
      <div className="two-col">
        <div className="panel">
          <h3>Scout assessment</h3>
          {scout ? (
            <>
              <p style={{ fontFamily: 'var(--mono)', fontSize: '.85rem', color: 'var(--amber)', textTransform: 'uppercase' }}>{scout.score_label}</p>
              <div className="rec-box">{scout.recommendation}</div>
            </>
          ) : <div className="empty-state">Scout score unavailable.</div>}
          <Link className="view-link" style={{ display: 'inline-block', marginTop: 16 }} to={`/data/compare?player1=${id}`}>Compare this player →</Link>
        </div>
        <div className="panel">
          <h3>GPS &amp; performance data</h3>
          {gps && gps.status !== 'pending_vest' ? (
            <>
              <div className="gps-row"><span>Total distance</span><b>{gps.total_distance_km} km</b></div>
              <div className="gps-row"><span>Max speed</span><b>{gps.max_speed_kmh} km/h</b></div>
              <div className="gps-row"><span>Sprints</span><b>{gps.sprints}</b></div>
              <div className="gps-row"><span>Work rate</span><b>{gps.work_rate_percent}%</b></div>
              <div className="gps-row"><span>Avg heart rate</span><b>{gps.avg_heart_rate}</b></div>
            </>
          ) : (
            <div className="pending-note">Not part of the current GPS pilot — GameOn Collective is tracking 3 players at a time with 3 vests, expanding as the program grows.</div>
          )}
        </div>
      </div>
    </>
  );
}
