import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Plus, Clock, DollarSign, Calendar, ArrowLeft, CheckSquare, FileText, Share2 } from 'lucide-react';

const ItineraryBuilder = () => {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);
  

  const [showStopForm, setShowStopForm] = useState(false);
  const [newStop, setNewStop] = useState({ city_name: '', start_date: '', end_date: '', order_index: 0 });
  
  const [showActivityForm, setShowActivityForm] = useState(null);
  const [newActivity, setNewActivity] = useState({ name: '', type: 'Sightseeing', estimated_cost: 0, duration: '2 hours' });

  const fetchTrip = () => {
    setLoading(true);
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
  };

  useEffect(() => {
    fetchTrip();
  }, [id]);

  const handleAddStop = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/stops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newStop, trip_id: id, order_index: trip.stops?.length || 0 })
      });
      if (res.ok) {
        setShowStopForm(false);
        setNewStop({ city_name: '', start_date: '', end_date: '', order_index: 0 });
        fetchTrip();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddActivity = async (e, stopId) => {
    e.preventDefault();
    try {
      const res = await fetch('http://localhost:3001/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newActivity, stop_id: stopId })
      });
      if (res.ok) {
        setShowActivityForm(null);
        setNewActivity({ name: '', type: 'Sightseeing', estimated_cost: 0, duration: '2 hours' });
        fetchTrip();
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="container">Loading itinerary...</div>;
  if (!trip) return <div className="container">Trip not found.</div>;

  return (
    <div className="container">
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
          <ArrowLeft size={16} /> Back to Dashboard
        </Link>
        <div className="glass-panel" style={{ 
          background: trip.cover_photo ? `linear-gradient(to right, rgba(15, 23, 42, 0.9), rgba(15, 23, 42, 0.7)), url(${trip.cover_photo}) center/cover` : 'var(--glass-bg)',
        }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{trip.name}</h1>
          <p style={{ color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} /> {trip.start_date} to {trip.end_date}
          </p>
          <p style={{ marginTop: '1rem', maxWidth: '600px' }}>{trip.description}</p>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <Link to={`/trips/${id}/budget`} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <DollarSign size={16} /> View Budget
        </Link>
        <Link to={`/trips/${id}/checklist`} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckSquare size={16} /> Packing List
        </Link>
        <Link to={`/trips/${id}/notes`} className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <FileText size={16} /> Trip Notes
        </Link>
        <Link to={`/shared/${id}`} target="_blank" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginLeft: 'auto' }}>
          <Share2 size={16} /> Public View
        </Link>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2>Itinerary Timeline</h2>
        <button className="btn-primary" onClick={() => setShowStopForm(!showStopForm)} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={16} /> Add Destination
        </button>
      </div>

      {showStopForm && (
        <div className="glass-panel" style={{ marginBottom: '2rem' }}>
          <h3>Add a New Stop</h3>
          <form onSubmit={handleAddStop} className="grid grid-cols-3" style={{ gap: '1rem', alignItems: 'end' }}>
            <div>
              <label>City / Location</label>
              <input type="text" value={newStop.city_name} onChange={e => setNewStop({...newStop, city_name: e.target.value})} required style={{ marginBottom: 0 }} />
            </div>
            <div>
              <label>Start Date</label>
              <input type="date" value={newStop.start_date} onChange={e => setNewStop({...newStop, start_date: e.target.value})} required style={{ marginBottom: 0 }} />
            </div>
            <div>
              <button type="submit" className="btn-primary" style={{ width: '100%' }}>Save Destination</button>
            </div>
          </form>
        </div>
      )}

      {trip.stops && trip.stops.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
          {/* Vertical line for timeline effect */}
          <div style={{ position: 'absolute', left: '24px', top: '24px', bottom: '0', width: '2px', background: 'var(--border-color)', zIndex: 0 }}></div>
          
          {trip.stops.map((stop, index) => (
            <div key={stop.id} style={{ position: 'relative', zIndex: 1, display: 'flex', gap: '1.5rem' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'var(--surface-color)', border: '2px solid var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <MapPin size={24} color="var(--primary-color)" />
              </div>
              
              <div className="glass-panel" style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <h3 style={{ marginBottom: '0.25rem', color: 'var(--secondary-color)' }}>{stop.city_name}</h3>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{stop.start_date} - {stop.end_date || 'Ongoing'}</p>
                  </div>
                  <button className="btn-secondary" onClick={() => setShowActivityForm(stop.id)} style={{ padding: '0.4rem 0.8rem', fontSize: '0.875rem' }}>
                    + Activity
                  </button>
                </div>

                {showActivityForm === stop.id && (
                  <form onSubmit={(e) => handleAddActivity(e, stop.id)} style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1rem' }}>
                    <div className="grid grid-cols-3" style={{ gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <input type="text" placeholder="Activity Name" value={newActivity.name} onChange={e => setNewActivity({...newActivity, name: e.target.value})} required style={{ marginBottom: 0 }} />
                      <select value={newActivity.type} onChange={e => setNewActivity({...newActivity, type: e.target.value})} style={{ marginBottom: 0 }}>
                        <option value="Sightseeing">Sightseeing</option>
                        <option value="Food & Drink">Food & Drink</option>
                        <option value="Transport">Transport</option>
                        <option value="Accommodation">Accommodation</option>
                      </select>
                      <input type="number" placeholder="Cost ($)" value={newActivity.estimated_cost} onChange={e => setNewActivity({...newActivity, estimated_cost: e.target.value})} required style={{ marginBottom: 0 }} />
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button type="submit" className="btn-primary" style={{ padding: '0.4rem 1rem' }}>Add</button>
                      <button type="button" className="btn-secondary" onClick={() => setShowActivityForm(null)} style={{ padding: '0.4rem 1rem' }}>Cancel</button>
                    </div>
                  </form>
                )}

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
          <p style={{ color: 'var(--text-secondary)' }}>You haven't added any destinations to this trip yet.</p>
        </div>
      )}
    </div>
  );
};

export default ItineraryBuilder;
