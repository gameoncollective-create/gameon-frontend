import { useState } from 'react';
import { useGameOnData } from '../../DataContext.jsx';
import PlayerCard from '../../components/PlayerCard.jsx';

const POSITIONS = [
  { key: 'all', label: 'All positions' },
  { key: 'goalkeeper', label: 'Goalkeepers' },
  { key: 'defender', label: 'Defenders' },
  { key: 'midfielder', label: 'Midfielders' },
  { key: 'forward', label: 'Forwards' }
];

export default function Players() {
  const { store } = useGameOnData();
  const [activePos, setActivePos] = useState('all');
  const [q, setQ] = useState('');

  const filtered = store.players.filter(p => {
    const posOk = activePos === 'all' || (p.position || '').toLowerCase().includes(activePos);
    const qOk = !q.trim() || p.name.toLowerCase().includes(q.trim().toLowerCase());
    return posOk && qOk;
  });

  return (
    <>
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
