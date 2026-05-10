import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock, Plus, Trash2 } from 'lucide-react';

const Dashboard = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost:3001/api/trips')
      .then(res => res.json())
      .then(data => {
        setTrips(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch trips:', err);
        setLoading(false);
      });
  }, []);

  const handleDeleteTrip = async (tripId) => {
    if (!window.confirm('Are you sure you want to delete this trip? All related destinations and activities will be lost.')) return;
    try {
      const res = await fetch(`http://localhost:3001/api/trips/${tripId}`, { method: 'DELETE' });
      if (res.ok) {
        setTrips(trips.filter(t => t.id !== tripId));
      } else {
        alert('Failed to delete trip.');
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <div className="glass-panel" style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ marginBottom: '0.5rem' }}>Welcome back, Traveler!</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Ready to plan your next adventure?</p>
        </div>
        <button className="btn-primary" onClick={() => navigate('/create-trip')} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={20} /> Plan New Trip
        </button>
      </div>

      <h2 style={{ marginBottom: '1.5rem' }}>Your Upcoming Trips</h2>
      
      {loading ? (
        <p>Loading your adventures...</p>
      ) : trips.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <MapPin size={48} color="var(--border-color)" style={{ marginBottom: '1rem' }} />
          <h3>No trips planned yet</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>It's a big world out there. Start exploring!</p>
          <button className="btn-primary" onClick={() => navigate('/create-trip')}>Create Your First Trip</button>
        </div>
      ) : (
        <div className="grid grid-cols-3">
          {trips.map(trip => (
            <div key={trip.id} className="glass-panel" style={{ padding: '0', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ 
                height: '150px', 
                background: trip.cover_photo ? `url(${trip.cover_photo}) center/cover` : 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))',
                position: 'relative'
              }} />
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ marginBottom: '0.5rem' }}>{trip.name}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Calendar size={16} /> {trip.start_date || 'TBD'} - {trip.end_date || 'TBD'}
                </p>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem', flex: 1 }}>
                  {trip.description || 'No description provided.'}
                </p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <Link to={`/trips/${trip.id}`} className="btn-secondary" style={{ flex: 1, textAlign: 'center' }}>
                    View Itinerary
                  </Link>
                  <button onClick={() => handleDeleteTrip(trip.id)} className="btn-secondary" style={{ padding: '0.5rem', color: '#ef4444', borderColor: 'rgba(239, 68, 68, 0.2)' }} title="Delete Trip">
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
