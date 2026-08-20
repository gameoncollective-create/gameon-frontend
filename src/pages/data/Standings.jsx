import { useState } from 'react';
import { useGameOnData } from '../../DataContext.jsx';
import StandingsTable from '../../components/StandingsTable.jsx';

export default function Standings() {
  const { store } = useGameOnData();
  const [active, setActive] = useState('premier');
  const sets = { premier: store.premierStandings, a: store.nslStandings.zone_a, b: store.nslStandings.zone_b };

  return (
    <>
      <div className="tabs">
        <button className={active === 'premier' ? 'active' : ''} onClick={() => setActive('premier')}>Premier League</button>
        <button className={active === 'a' ? 'active' : ''} onClick={() => setActive('a')}>NSL — Zone A</button>
        <button className={active === 'b' ? 'active' : ''} onClick={() => setActive('b')}>NSL — Zone B</button>
      </div>
      <StandingsTable rows={sets[active]} />
    </>
  );
}
