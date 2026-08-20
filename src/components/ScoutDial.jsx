export default function ScoutDial({ score = 0, size = 54, showLabel = true }) {
  const clamped = Math.max(0, Math.min(100, score || 0));
  const r = size / 2 - 5;
  const c = 2 * Math.PI * r;
  const offset = c - (clamped / 100) * c;
  const color = clamped >= 70 ? 'var(--amber)' : clamped >= 45 ? 'var(--teal)' : 'var(--text-dim)';
  return (
    <div className="dial-wrap">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle cx={size / 2} cy={size / 2} r={r} stroke="rgba(245,244,240,0.1)" strokeWidth="5" fill="none" />
        <circle
          cx={size / 2} cy={size / 2} r={r} stroke={color} strokeWidth="5" fill="none"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
        <text x="50%" y="53%" textAnchor="middle" dominantBaseline="middle"
          fontFamily="JetBrains Mono, monospace" fontWeight="700"
          fontSize={size * 0.3} fill="var(--text)">{clamped}</text>
      </svg>
      {showLabel && <div className="dial-label"><b>Scout score</b><span>out of 100</span></div>}
    </div>
  );
}
