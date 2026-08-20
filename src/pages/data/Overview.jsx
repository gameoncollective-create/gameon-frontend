import { Link } from 'react-router-dom';
import { useGameOnData } from '../../DataContext.jsx';
import TalentTile from '../../components/TalentTile.jsx';
import StandingsTable from '../../components/StandingsTable.jsx';

export default function Overview() {
  const { store, allTeams } = useGameOnData();
  const wallPlayers = (store.featured.length ? store.featured : store.players).slice(0, 4);

  return (
    <>
      <div className="stat-strip">
        <div className="box"><b>{store.players.length}</b><span>Players tracked</span></div>
        <div className="box"><b>{allTeams.length}</b><span>Clubs profiled</span></div>
        <div className="box"><b>{store.premierStandings.length}</b><span>Premier League clubs</span></div>
        <div className="box"><b>4</b><span>Leagues covered</span></div>
      </div>
      <div className="section-head">
        <h2 style={{ fontSize: '1.6rem' }}>Players to watch</h2>
        <Link className="view-link" to="/data/players">Full directory →</Link>
      </div>
      <div className="talent-wall" style={{ gridTemplateColumns: 'repeat(4,1fr)', marginBottom: 48 }}>
        {wallPlayers.length
          ? wallPlayers.map((p, i) => <TalentTile key={p.id} player={p} index={i} />)
          : <div className="empty-state">No featured players yet.</div>}
      </div>
      <div className="section-head">
        <h2 style={{ fontSize: '1.6rem' }}>Premier League — top of the table</h2>
        <Link className="view-link" to="/data/standings">Full standings →</Link>
      </div>
      <StandingsTable rows={store.premierStandings.slice(0, 5)} />
    </>
  );
}
