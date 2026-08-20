import { Link } from 'react-router-dom';
import { posShort, tileClass } from '../api.js';
import { useGameOnData } from '../DataContext.jsx';

export default function TalentTile({ player, index, big = false, showcase = false }) {
  const { teamById } = useGameOnData();
  const team = teamById(player.team_id);
  const cls = tileClass(index);
  return (
    <Link to={`/data/player/${player.id}`} className={`tile ${cls} ${big ? 'big' : ''}`}>
      <span className="chip">{posShort(player.position)}</span>
      <div className="tname">{player.name}</div>
      <div className="tmeta">{team ? team.name : (player.league || 'Unattached')}</div>
      <div className="tstats">
        <span><b>{player.goals ?? 0}</b> G</span>
        <span><b>{player.assists ?? 0}</b> A</span>
        <span><b>{player.appearances ?? 0}</b> APP</span>
      </div>
    </Link>
  );
}
