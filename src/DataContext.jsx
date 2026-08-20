import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { api } from './api.js';

const DataContext = createContext(null);

const EMPTY_STORE = {
  players: [],
  featured: [],
  premierTeams: [],
  nslTeams: [],
  zoneATeams: [],
  zoneBTeams: [],
  premierStandings: [],
  nslStandings: { zone_a: [], zone_b: [] },
  loaded: false
};

export function DataProvider({ children }) {
  const [store, setStore] = useState(EMPTY_STORE);

  useEffect(() => {
    let cancelled = false;
    async function loadAll() {
      const [players, featured, premierTeams, nslTeams, zoneA, zoneB, premierStandings, nslStandings] =
        await Promise.all([
          api('/api/players').catch(() => []),
          api('/api/featured-players').catch(() => []),
          api('/api/premier/teams').catch(() => []),
          api('/api/nsl/teams').catch(() => []),
          api('/api/division-one/zone-a/teams').catch(() => []),
          api('/api/division-one/zone-b/teams').catch(() => []),
          api('/api/premier/standings').catch(() => []),
          api('/api/nsl/standings').catch(() => ({ zone_a: [], zone_b: [] }))
        ]);
      if (cancelled) return;
      setStore({
        players, featured,
        premierTeams, nslTeams, zoneATeams: zoneA, zoneBTeams: zoneB,
        premierStandings, nslStandings,
        loaded: true
      });
    }
    loadAll();
    return () => { cancelled = true; };
  }, []);

  const allTeams = useMemo(
    () => [...store.premierTeams, ...store.nslTeams, ...store.zoneATeams, ...store.zoneBTeams],
    [store]
  );
  const teamById = (id) => allTeams.find(t => String(t.id) === String(id));
  const playerById = (id) =>
    store.players.find(p => String(p.id) === String(id)) ||
    store.featured.find(p => String(p.id) === String(id));

  const value = { store, allTeams, teamById, playerById };
  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useGameOnData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useGameOnData must be used within DataProvider');
  return ctx;
}
