import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Map, Calendar, Image as ImageIcon } from 'lucide-react';

const CreateTrip = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    start_date: '',
    end_date: '',
    description: '',
    cover_photo: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:3001/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (res.ok) {
        navigate(`/trips/${data.id}`);
      } else {
        alert('Failed to create trip: ' + data.error);
      }
    } catch (err) {
      console.error(err);
      alert('Error connecting to server.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <div className="glass-panel">
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
          <Map size={28} color="var(--primary-color)" /> Create a New Trip
        </h1>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1" style={{ gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Trip Name</label>
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange} 
                placeholder="e.g. Summer Eurotrip 2026" 
                required 
              />
            </div>
            
            <div className="grid grid-cols-2" style={{ gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}><Calendar size={16} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> Start Date</label>
                <input 
                  type="date" 
                  name="start_date" 
                  value={formData.start_date} 
                  onChange={handleChange} 
                  required 
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}><Calendar size={16} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> End Date</label>
                <input 
                  type="date" 
                  name="end_date" 
                  value={formData.end_date} 
                  onChange={handleChange} 
                  required 
                />
              </div>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>Description</label>
              <textarea 
                name="description" 
                value={formData.description} 
                onChange={handleChange} 
                placeholder="What is the purpose of this trip?" 
                rows={4}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}><ImageIcon size={16} style={{ display: 'inline', verticalAlign: 'text-bottom' }} /> Cover Photo URL (Optional)</label>
              <input 
                type="url" 
                name="cover_photo" 
                value={formData.cover_photo} 
                onChange={handleChange} 
                placeholder="https://example.com/image.jpg" 
              />
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" className="btn-secondary" onClick={() => navigate('/')}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Save & Plan Itinerary'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTrip;
