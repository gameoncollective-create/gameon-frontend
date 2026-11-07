import { useEffect, useState } from 'react';
import { trackEvent } from '../../analytics.js';
import { useGameOnData } from '../../DataContext.jsx';
import PlayerCard from '../../components/PlayerCard.jsx';

const LEAGUES = [
  { key: 'all', label: 'All leagues' },
  { key: 'premier', label: 'Premier League' },
  { key: 'nsl', label: 'NSL' }
];

const POSITIONS = [
  { key: 'all', label: 'All positions' },
  { key: 'goalkeeper', label: 'Goalkeepers' },
  { key: 'defender', label: 'Defenders' },
  { key: 'midfielder', label: 'Midfielders' },
  { key: 'forward', label: 'Forwards' }
];

export default function Players() {
  const { store } = useGameOnData();
  const [activeLeague, setActiveLeague] = useState('premier');
  const [activePos, setActivePos] = useState('all');
  const [q, setQ] = useState('');

  // Log what people search for, once they stop typing.
  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) return;
    const t = setTimeout(() => trackEvent('search', { search_term: term, area: 'players' }), 1200);
    return () => clearTimeout(t);
  }, [q]);

  const filtered = store.players.filter(p => {
    const leagueOk = activeLeague === 'all' || (p.league || '').toLowerCase() === activeLeague;
    const posOk = activePos === 'all' || (p.position || '').toLowerCase().includes(activePos);
    const qOk = !q.trim() || p.name.toLowerCase().includes(q.trim().toLowerCase());
    return leagueOk && posOk && qOk;
  });

  return (
    <>
      <div className="tabs">
        {LEAGUES.map(lg => (
          <button key={lg.key} className={activeLeague === lg.key ? 'active' : ''} onClick={() => setActiveLeague(lg.key)}>
            {lg.label}
          </button>
        ))}
      </div>
      <div className="tabs">
        {POSITIONS.map(pos => (
          <button key={pos.key} className={activePos === pos.key ? 'active' : ''} onClick={() => setActivePos(pos.key)}>
            {pos.label}
          </button>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 10, background: 'var(--bg-raised)', border: '1px solid var(--line)', borderRadius: 8, padding: 6, maxWidth: 420, marginBottom: 28 }}>
        <input
          placeholder="Filter by name…"
          value={q}
          onChange={e => setQ(e.target.value)}
          style={{ flex: 1, border: 'none', outline: 'none', padding: '9px 10px', background: 'none', color: 'var(--text)' }}
        />
      </div>
      <div className="grid cols-4">
        {filtered.length
          ? filtered.map(p => <PlayerCard key={p.id} player={p} />)
          : <div className="empty-state">No players match that search.</div>}
      </div>
    </>
  );
}
