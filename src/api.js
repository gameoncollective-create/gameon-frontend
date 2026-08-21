// CONFIG — points to the live FastAPI backend on Render.
export const API_BASE = 'https://gameon-fastapi.onrender.com';

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