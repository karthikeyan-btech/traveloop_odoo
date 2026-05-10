import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { DollarSign, ArrowLeft, PieChart, TrendingUp } from 'lucide-react';

const Budget = () => {
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

  if (loading) return <div className="container">Loading budget...</div>;
  if (!trip) return <div className="container">Trip not found.</div>;

  let totalCost = 0;
  const costByCategory = {
    'Accommodation': 0,
    'Transport': 0,
    'Food & Drink': 0,
    'Sightseeing': 0
  };

  const costByStop = {};

  if (trip.stops) {
    trip.stops.forEach(stop => {
      let stopTotal = 0;
      if (stop.activities) {
        stop.activities.forEach(activity => {
          const cost = parseFloat(activity.estimated_cost) || 0;
          totalCost += cost;
          stopTotal += cost;
          if (costByCategory[activity.type] !== undefined) {
            costByCategory[activity.type] += cost;
          }
        });
      }
      costByStop[stop.city_name] = stopTotal;
    });
  }

  return (
    <div className="container" style={{ maxWidth: '900px' }}>
      <Link to={`/trips/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
        <ArrowLeft size={16} /> Back to Itinerary
      </Link>
      
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <DollarSign size={28} color="#10b981" /> Budget Breakdown
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>For your trip: <strong>{trip.name}</strong></p>
      </div>

      <div className="grid grid-cols-3" style={{ marginBottom: '2rem', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(16, 185, 129, 0.05))', borderColor: 'rgba(16, 185, 129, 0.2)' }}>
          <h3 style={{ color: 'var(--text-secondary)', fontSize: '1rem', marginBottom: '0.5rem' }}>Total Estimated Cost</h3>
          <p style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#10b981', margin: 0 }}>${totalCost.toFixed(2)}</p>
        </div>
        
        <div className="glass-panel grid-cols-2" style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><PieChart size={18} /> Cost by Category</h3>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            {Object.entries(costByCategory).map(([category, cost]) => (
              <div key={category} style={{ flex: '1 1 40%', background: 'rgba(255,255,255,0.05)', padding: '0.75rem', borderRadius: '8px' }}>
                <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>{category}</p>
                <p style={{ fontWeight: '600', margin: 0 }}>${cost.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-panel">
        <h2 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><TrendingUp size={20} /> Spend per Destination</h2>
        {Object.keys(costByStop).length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {Object.entries(costByStop).map(([city, cost]) => {
              const percentage = totalCost > 0 ? (cost / totalCost) * 100 : 0;
              return (
                <div key={city}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: '500' }}>{city}</span>
                    <span>${cost.toFixed(2)}</span>
                  </div>
                  <div style={{ width: '100%', height: '8px', background: 'var(--surface-color)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${percentage}%`, height: '100%', background: 'var(--primary-color)', borderRadius: '4px' }}></div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p style={{ color: 'var(--text-secondary)' }}>No destinations with costs found.</p>
        )}
      </div>
    </div>
  );
};

export default Budget;
