export default function StandingsTable({ rows }) {
  if (!rows || !rows.length) {
    return <div className="empty-state">Standings not available yet.</div>;
  }
  return (
    <table className="standings">
      <thead>
        <tr>
          <th className="num">#</th><th>Team</th><th className="num">P</th><th className="num">W</th>
          <th className="num">D</th><th className="num">L</th><th className="num">GD</th><th className="num">Pts</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r, i) => (
          <tr key={r.team + i}>
            <td className="num"><span className={`rank-pill ${i < 3 ? 'top' : ''}`}>{r.position ?? i + 1}</span></td>
            <td className="team">{r.team}</td>
            <td className="num">{r.played ?? 0}</td>
            <td className="num">{r.won ?? 0}</td>
            <td className="num">{r.drawn ?? 0}</td>
            <td className="num">{r.lost ?? 0}</td>
            <td className="num">{r.gd ?? 0}</td>
            <td className="num"><b>{r.points ?? 0}</b></td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
