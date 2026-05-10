import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Clock, DollarSign, Calendar, Compass, Share2 } from 'lucide-react';

const SharedItinerary = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`http://localhost:3001/api/trips/${id}`)
      .then(res => res.json())
      .then(data => {
        setTrip(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, [id]);

  if (loading) return <div className="container">Loading itinerary...</div>;
  if (!trip) return <div className="container">Trip not found.</div>;

  return (
    <div style={{ background: 'var(--bg-color)', minHeight: '100vh' }}>
      {/* Public Header */}
      <nav style={{ background: 'var(--surface-color)', padding: '1rem 2rem', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Compass size={32} color="var(--secondary-color)" />
          <h2 style={{ margin: 0, background: 'linear-gradient(to right, var(--primary-color), var(--secondary-color))', WebkitBackgroundClip: 'text', color: 'transparent' }}>
            Traveloop
          </h2>
        </div>
        <Link to="/" className="btn-primary">Create Your Own Trip</Link>
      </nav>

      <div className="container">
        <div className="glass-panel" style={{ 
          marginBottom: '2rem',
          background: trip.cover_photo ? `linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.7)), url(${trip.cover_photo}) center/cover` : 'var(--glass-bg)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{trip.name}</h1>
              <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={18} /> {trip.start_date} to {trip.end_date}
              </p>
              <p style={{ marginTop: '1rem', maxWidth: '600px' }}>{trip.description}</p>
            </div>
            <button className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={() => { navigator.clipboard.writeText(window.location.href); alert('Link copied!'); }}>
              <Share2 size={16} /> Share
            </button>
          </div>
        </div>

        <h2 style={{ marginBottom: '1.5rem' }}>Itinerary Timeline</h2>

        {trip.stops && trip.stops.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
            <div style={{ position: 'absolute', left: '24px', top: '24px', bottom: '0', width: '2px', background: 'var(--border-color)', zIndex: 0 }}></div>
            
            {trip.stops.map((stop) => (
              <div key={stop.id} style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '1.5rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--surface-color)', border: '2px solid var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <MapPin size={24} color="var(--primary-color)" />
                </div>
                
                <div className="glass-panel" style={{ flex: 1 }}>
                  <div style={{ marginBottom: '1rem' }}>
                    <h3 style={{ marginBottom: '0.25rem', color: 'var(--secondary-color)' }}>{stop.city_name}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{stop.start_date} - {stop.end_date || 'Ongoing'}</p>
                  </div>

                  {stop.activities && stop.activities.length > 0 ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      {stop.activities.map(activity => (
                        <div key={activity.id} style={{ background: 'rgba(255,255,255,0.05)', padding: '0.75rem 1rem', borderRadius: '6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <h4 style={{ margin: 0, fontSize: '1rem' }}>{activity.name}</h4>
                            <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'var(--border-color)', padding: '2px 6px', borderRadius: '4px', display: 'inline-block', marginTop: '4px' }}>
                              {activity.type}
                            </span>
                          </div>
                          <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Clock size={14}/> {activity.duration}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#10b981' }}><DollarSign size={14}/> ${activity.estimated_cost}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: 'var(--text-secondary)', fontStyle: 'italic', fontSize: '0.875rem' }}>No activities planned for this stop yet.</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
            <p style={{ color: 'var(--text-secondary)' }}>No destinations added to this trip yet.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SharedItinerary;
