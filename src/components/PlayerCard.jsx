import { Link } from 'react-router-dom';
import { posShort, posClass } from '../api.js';
import { useGameOnData } from '../DataContext.jsx';

export default function PlayerCard({ player }) {
  const { teamById } = useGameOnData();
  const team = teamById(player.team_id);
  const rating = Number(player.player_rating || 0);
  return (
    <Link to={`/data/player/${player.id}`} className="card">
      <div className="player-card-top">
        <div className="info">
          <h4>{player.name}</h4>
          <p>{team ? team.name : (player.league || 'Unattached')}</p>
        </div>
        <span className={`pos-badge ${posClass(player.position)}`}>{posShort(player.position)}</span>
      </div>
      <div className="card-stats-row">
        <span><b>{player.goals ?? 0}</b> G</span>
        <span><b>{player.assists ?? 0}</b> A</span>
        <span><b>{player.appearances ?? 0}</b> Apps</span>
        {rating ? <span><b>{rating}</b> Rtg</span> : null}
      </div>
    </Link>
  );
}
