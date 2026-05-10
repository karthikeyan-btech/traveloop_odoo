import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { Compass, Calendar, Map, CheckSquare, LogOut, User } from 'lucide-react';
import './index.css';

import Dashboard from './pages/Dashboard';
import CreateTrip from './pages/CreateTrip';
import ItineraryBuilder from './pages/ItineraryBuilder';
import Checklist from './pages/Checklist';
import Budget from './pages/Budget';
import Notes from './pages/Notes';
import SharedItinerary from './pages/SharedItinerary';
import Profile from './pages/Profile';

const App = () => {
  return (
    <Router>
      <nav style={{ background: 'var(--surface-color)', padding: '1rem 2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Compass size={32} color="var(--secondary-color)" />
          <h2 style={{ margin: 0, background: 'linear-gradient(to right, var(--primary-color), var(--secondary-color))', WebkitBackgroundClip: 'text', color: 'transparent' }}>
            Traveloop
          </h2>
        </div>
        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <Calendar size={20} /> Dashboard
          </Link>
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <Map size={20} /> My Trips
          </Link>
          <Link to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
            <User size={20} /> Profile
          </Link>
          <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem' }}>
            <LogOut size={16} /> Logout
          </button>
        </div>
      </nav>

      <main style={{ flex: 1 }}>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/create-trip" element={<CreateTrip />} />
          <Route path="/trips/:id" element={<ItineraryBuilder />} />
          <Route path="/trips/:id/checklist" element={<Checklist />} />
          <Route path="/trips/:id/budget" element={<Budget />} />
          <Route path="/trips/:id/notes" element={<Notes />} />
          <Route path="/shared/:id" element={<SharedItinerary />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </Router>
  );
};

export default App;
