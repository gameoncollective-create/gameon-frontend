import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useGameOnData } from '../../DataContext.jsx';
import { api } from '../../api.js';

const STATS = [['Goals', 'goals'], ['Assists', 'assists'], ['Appearances', 'appearances'], ['Rating', 'rating']];

export default function Compare() {
  const { store, teamById } = useGameOnData();
  const [searchParams] = useSearchParams();
  const [id1, setId1] = useState(searchParams.get('player1') || '');
  const [id2, setId2] = useState('');
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setData(null);
    setError(false);
    if (!id1 || !id2) return;
    if (id1 === id2) return;
    setLoading(true);
    api(`/api/compare?player1=${id1}&player2=${id2}`)
      .then(d => setData(d))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id1, id2]);

  const options = store.players.map(p => (
    <option key={p.id} value={p.id}>{p.name} — {teamById(p.team_id)?.name || p.league || ''}</option>
  ));

  let resultBody = null;
  if (!id1 || !id2) resultBody = null;
  else if (id1 === id2) resultBody = <div className="empty-state">Choose two different players.</div>;
  else if (loading) resultBody = <div className="loading">Comparing…</div>;
  else if (error) resultBody = <div className="empty-state">Couldn't load comparison.</div>;
  else if (data) {
    const a = data.comparison.player1, b = data.comparison.player2;
    const maxes = {
      goals: Math.max(a.goals, b.goals, 1), assists: Math.max(a.assists, b.assists, 1),
      appearances: Math.max(a.appearances, b.appearances, 1), rating: Math.max(a.rating, b.rating, 1)
    };
    resultBody = (
      <>
        <div className="two-col" style={{ marginBottom: 24 }}>
          <div className="panel" style={{ textAlign: 'center' }}>
            <h3>{a.name}</h3>
            <p style={{ fontFamily: 'var(--mono)', fontSize: '.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>{a.position} · {a.team}</p>
          </div>
          <div className="panel" style={{ textAlign: 'center' }}>
            <h3>{b.name}</h3>
            <p style={{ fontFamily: 'var(--mono)', fontSize: '.8rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>{b.position} · {b.team}</p>
          </div>
        </div>
        <div className="panel">
          {STATS.map(([label, key]) => (
            <div className="compare-stat" key={key}>
              <div style={{ textAlign: 'right' }}>{a[key]}</div>
              <div>
                <div className="label">{label}</div>
                <div className="bar-pair">
                  <div className="bar-track"><div className="bar-fill" style={{ width: `${(a[key] / maxes[key]) * 100}%` }}></div></div>
                  <div className="bar-track"><div className="bar-fill right" style={{ width: `${(b[key] / maxes[key]) * 100}%` }}></div></div>
                </div>
              </div>
              <div>{b[key]}</div>
            </div>
          ))}
          <div className="compare-stat">
            <div style={{ textAlign: 'right' }}>{a.top_speed}</div>
            <div className="label" style={{ gridColumn: 2 }}>Top speed (km/h)</div>
            <div>{b.top_speed}</div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="compare-pickers">
        <select value={id1} onChange={e => setId1(e.target.value)}>
          <option value="">Select player one…</option>{options}
        </select>
        <div className="vs">VS</div>
        <select value={id2} onChange={e => setId2(e.target.value)}>
          <option value="">Select player two…</option>{options}
        </select>
      </div>
      <div>{resultBody}</div>
    </>
  );
}
