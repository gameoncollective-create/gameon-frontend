import { useState } from 'react';

/** Renders an <img> if it loads successfully; renders nothing on error
 *  (so whatever background/gradient sits behind it in CSS shows through
 *  instead of a broken-image icon). */
export default function FallbackImage({ src, alt = '', className, style }) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    <img
      src={src}
      alt={alt}
      className={className}
      style={style}
      onError={() => setFailed(true)}
    />
  );
}
