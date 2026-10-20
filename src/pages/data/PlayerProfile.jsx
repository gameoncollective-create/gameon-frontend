import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useGameOnData } from '../../DataContext.jsx';
import { api } from '../../api.js';

export default function PlayerProfile() {
  const { id } = useParams();
  const { store, teamById, playerById } = useGameOnData();
  const [gps, setGps] = useState(null);
  const [matches, setMatches] = useState([]);

  const player = playerById(id);

  useEffect(() => {
    let cancelled = false;

    setGps(null);
    setMatches([]);

    api(`/api/player/${id}`)
      .then(d => {
        if (!cancelled) {
          setGps(d.gps);
          setMatches(d.recent_matches || []);
        }
      })
      .catch(() => {});

    return () => {
      cancelled = true;
    };
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
      <Link className="back-link" to="/data/players">
        ← Back to directory
      </Link>

      {/* ---------- PLAYER HERO ---------- */}
      <div className="profile-hero">
        <div>
          <div className="eyebrow">
            {team ? team.name : (player.league || 'Unattached')}
          </div>

          <h1>{player.name}</h1>

          <div className="meta">
            {player.position || ''}
          </div>
        </div>
      </div>

      {/* ---------- PLAYER STATS ---------- */}
      <div className="stat-strip">
        <div className="box">
          <b>{player.goals ?? 0}</b>
          <span>Goals</span>
        </div>

        <div className="box">
          <b>{player.assists ?? 0}</b>
          <span>Assists</span>
        </div>

        <div className="box">
          <b>{player.appearances ?? 0}</b>
          <span>Appearances</span>
        </div>
      </div>

      {/* ---------- PLAYER ACTIONS ---------- */}
      <div style={{ margin: '18px 0 24px' }}>
        <Link
          className="view-link"
          to={`/data/compare?player1=${id}`}
        >
          Compare this player →
        </Link>
      </div>

      {/* ---------- RECENT MATCHES ---------- */}
      <div className="panel" style={{ marginBottom: 20 }}>
        <h3>Recent matches</h3>

        {matches.length > 0 ? (
          matches.map((m, i) => {
            const isHome = team ? m.home_team === team.name : true;
            const opponent = isHome ? m.away_team : m.home_team;
            const homeScore = m.home_score ?? '–';
            const awayScore = m.away_score ?? '–';
            const result =
              m.home_score == null || m.away_score == null
                ? null
                : isHome
                ? (m.home_score > m.away_score ? 'W' : m.home_score < m.away_score ? 'L' : 'D')
                : (m.away_score > m.home_score ? 'W' : m.away_score < m.home_score ? 'L' : 'D');

            const contrib = [];
            if (m.goals) contrib.push(`⚽ ${m.goals}`);
            if (m.assists) contrib.push(`🅰️ ${m.assists}`);

            return (
              <div className="match-row" key={`${m.date}-${m.home_team}-${m.away_team}-${i}`}>
                <div className="match-row-result" data-result={result || 'D'}>
                  {result || '–'}
                </div>
                <div className="match-row-info">
                  <div className="match-row-opponent">
                    {isHome ? 'vs' : '@'} {opponent}
                  </div>
                  <div className="match-row-date">{m.date}</div>
                </div>
                <div className="match-row-score">{homeScore}-{awayScore}</div>
                <div className="match-row-contrib">
                  {contrib.length ? contrib.join('  ') : '—'}
                </div>
              </div>
            );
          })
        ) : (
          <div className="pending-note">No match history recorded yet for this player.</div>
        )}
      </div>

      {/* ---------- GPS PERFORMANCE ---------- */}
      <div className="panel">
        <h3>GPS &amp; performance data</h3>

        {gps && gps.status !== 'pending_vest' ? (
          <>
            <div className="gps-row">
              <span>Total distance</span>
              <b>{gps.total_distance_km} km</b>
            </div>

            <div className="gps-row">
              <span>Max speed</span>
              <b>{gps.max_speed_kmh} km/h</b>
            </div>

            <div className="gps-row">
              <span>Sprints</span>
              <b>{gps.sprints}</b>
            </div>

            <div className="gps-row">
              <span>Accelerations</span>
              <b>{gps.accelerations}</b>
            </div>

            <div className="gps-row">
              <span>Decelerations</span>
              <b>{gps.decelerations}</b>
            </div>

            <div className="gps-row">
              <span>Work rate</span>
              <b>{gps.work_rate_percent}%</b>
            </div>
          </>
        ) : (
          <div className="pending-note">
            GPS performance data is not currently available for this player.
          </div>
        )}
      </div>
    </>
  );
}
