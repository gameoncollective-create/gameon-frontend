import { useState } from 'react';

export default function Logo({ size = 20 }) {
  const [imgFailed, setImgFailed] = useState(false);

  if (!imgFailed) {
    return (
      <img
        src="/images/logo.png"
        alt="GameOn Collective"
        className="mark"
        style={{ width: size, height: size, objectFit: 'contain' }}
        onError={() => setImgFailed(true)}
      />
    );
  }

  // Fallback: original SVG diamond mark, used until a real logo file exists.
  return (
    <svg className="mark" viewBox="0 0 24 24" width={size} height={size}>
      <defs>
        <linearGradient id="mg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#F5B942" />
          <stop offset="1" stopColor="#9B7BFF" />
        </linearGradient>
      </defs>
      <path d="M12 1 L15 9 L23 12 L15 15 L12 23 L9 15 L1 12 L9 9 Z" fill="url(#mg)" />
    </svg>
  );
}
