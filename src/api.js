// CONFIG — same-origin by default. In dev, vite.config.js proxies /api to
// your local FastAPI backend. In production, deploy this alongside the API
// or set API_BASE to the full backend URL.
export const API_BASE = '';

export async function api(path) {
  const res = await fetch(API_BASE + path);
  if (!res.ok) throw new Error('Request failed: ' + path);
  return res.json();
}

export function initials(name) {
  return (name || '?').split(' ').filter(Boolean).slice(0, 2).map(w => w[0]).join('').toUpperCase();
}

export function posShort(pos) {
  pos = (pos || '').toLowerCase();
  if (pos.includes('goal') || pos.includes('gk')) return 'GK';
  if (pos.includes('def')) return 'DEF';
  if (pos.includes('mid')) return 'MID';
  return 'FWD';
}

export function posClass(pos) {
  return 'pos-' + posShort(pos);
}

const TILE_CLASSES = ['tile-a', 'tile-b', 'tile-c', 'tile-d'];
export function tileClass(i) {
  return TILE_CLASSES[i % TILE_CLASSES.length];
}
