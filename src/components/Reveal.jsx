import { useEffect, useRef, useState } from 'react';

export default function Reveal({ children, className = '', style, as: Tag = 'div' }) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { setInView(true); observer.unobserve(el); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    observer.observe(el);
    // Safety net: never stay permanently invisible.
    const timeout = setTimeout(() => setInView(true), 1200);
    return () => { observer.disconnect(); clearTimeout(timeout); };
  }, []);

  return (
    <Tag ref={ref} className={`reveal ${inView ? 'in' : ''} ${className}`} style={style}>
      {children}
    </Tag>
  );
}
