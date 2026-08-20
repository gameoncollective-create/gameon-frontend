import { Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { DataProvider } from './DataContext.jsx';
import Nav from './components/Nav.jsx';
import Footer from './components/Footer.jsx';

import Home from './pages/Home.jsx';
import Services from './pages/Services.jsx';
import News from './pages/News.jsx';
import Events from './pages/Events.jsx';
import Contact from './pages/Contact.jsx';
import AthleteProfile from './pages/AthleteProfile.jsx';

import DataHubLayout from './pages/data/DataHubLayout.jsx';
import Overview from './pages/data/Overview.jsx';
import Players from './pages/data/Players.jsx';
import PlayerProfile from './pages/data/PlayerProfile.jsx';
import Teams from './pages/data/Teams.jsx';
import TeamProfile from './pages/data/TeamProfile.jsx';
import Standings from './pages/data/Standings.jsx';
import Compare from './pages/data/Compare.jsx';
import GPSLab from './pages/data/GPSLab.jsx';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

export default function App() {
  return (
    <DataProvider>
      <ScrollToTop />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/athletes/:slug" element={<AthleteProfile />} />
          <Route path="/news" element={<News />} />
          <Route path="/events" element={<Events />} />
          <Route path="/contact" element={<Contact />} />

          <Route path="/data" element={<DataHubLayout />}>
            <Route index element={<Overview />} />
            <Route path="players" element={<Players />} />
            <Route path="player/:id" element={<PlayerProfile />} />
            <Route path="teams" element={<Teams />} />
            <Route path="team/:id" element={<TeamProfile />} />
            <Route path="standings" element={<Standings />} />
            <Route path="compare" element={<Compare />} />
            <Route path="gps" element={<GPSLab />} />
          </Route>

          <Route path="*" element={<Home />} />
        </Routes>
      </main>
      <Footer />
    </DataProvider>
  );
}
