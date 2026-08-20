import { Link } from 'react-router-dom';
import { EVENTS } from '../eventsData.js';
import { useGameOnData } from '../DataContext.jsx';
import StandingsTable from '../components/StandingsTable.jsx';

function EventRow({ ev }) {
  return (
    <div className="event-row">
      <div className="event-date"><div className="d">{ev.day}</div><div className="m">{ev.month}</div></div>
      <div className="event-info">
        <div className="type">{ev.type}</div>
        <h4>{ev.title}</h4>
        <div className="loc">{ev.location}</div>
      </div>
      <div className="event-status"><span className="status-chip">{ev.status}</span></div>
    </div>
  );
}

export default function Events() {
  const { store } = useGameOnData();
  const matches = EVENTS.filter(e => e.type === 'Match');
  const otherEvents = EVENTS.filter(e => e.type !== 'Match');

  return (
    <section style={{ paddingBottom: 96 }}>
      <div className="container">
        <div className="eyebrow">Events</div>
        <h1 style={{ fontSize: 'clamp(2.2rem,4.6vw,3.2rem)', margin: '16px 0 14px' }}>Matches, standings, and milestones.</h1>
        <p style={{ color: 'var(--text-dim)', maxWidth: '62ch', marginBottom: 56 }}>
          Upcoming fixtures first, then how the table looks, then everything else — workshops, community events, and GameOn Collective milestones.
        </p>

        {/* ===== 1. MATCHES — priority ===== */}
        <div className="section-head">
          <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.2rem)' }}>Upcoming Matches</h2>
        </div>
        <div style={{ marginBottom: 64 }}>
          {matches.length
            ? matches.map(ev => <EventRow key={ev.id} ev={ev} />)
            : <div className="empty-state">No fixtures confirmed yet.</div>}
        </div>

        {/* ===== 2. STANDINGS — live from the API ===== */}
        <div className="section-head">
          <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.2rem)' }}>League Standings</h2>
          <Link className="view-link" to="/data/standings">Full standings →</Link>
        </div>
        <div style={{ marginBottom: 64 }}>
          {store.loaded ? (
            <StandingsTable rows={store.premierStandings.slice(0, 8)} />
          ) : (
            <div className="loading">Loading standings…</div>
          )}
        </div>

        {/* ===== 3. EVERYTHING ELSE — workshops, community, milestones ===== */}
        <div className="section-head">
          <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.2rem)' }}>Workshops &amp; Community</h2>
        </div>
        <div>
          {otherEvents.length
            ? otherEvents.map(ev => <EventRow key={ev.id} ev={ev} />)
            : <div className="empty-state">Nothing else scheduled right now.</div>}
        </div>
      </div>
    </section>
  );
}