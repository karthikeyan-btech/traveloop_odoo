import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckSquare, ArrowLeft, Trash2, Plus } from 'lucide-react';

const Checklist = () => {
  const { id } = useParams();
  const [items, setItems] = useState([]);
  const [trip, setTrip] = useState(null);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('Clothing');

  useEffect(() => {
    fetch(`http://localhost:3001/api/trips/${id}`)
      .then(res => res.json())
      .then(data => setTrip(data));

    fetchItems();
  }, [id]);

  const fetchItems = () => {
    fetch(`http://localhost:3001/api/trips/${id}/checklist`)
      .then(res => res.json())
      .then(data => setItems(data));
  };

  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemName) return;
    try {
      await fetch(`http://localhost:3001/api/trips/${id}/checklist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newItemName, category: newItemCategory })
      });
      setNewItemName('');
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggle = async (itemId, currentStatus) => {
    try {
      await fetch(`http://localhost:3001/api/checklist/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_packed: currentStatus ? 0 : 1 })
      });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (itemId) => {
    try {
      await fetch(`http://localhost:3001/api/checklist/${itemId}`, { method: 'DELETE' });
      fetchItems();
    } catch (err) {
      console.error(err);
    }
  };

  const categories = ['Clothing', 'Documents', 'Electronics', 'Toiletries', 'Other'];

  if (!trip) return <div className="container">Loading...</div>;

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <Link to={`/trips/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
        <ArrowLeft size={16} /> Back to Itinerary
      </Link>
      
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <CheckSquare size={28} color="var(--primary-color)" /> Packing Checklist
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>For your trip: <strong>{trip.name}</strong></p>
      </div>

      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleAddItem} style={{ display: 'flex', gap: '1rem', alignItems: 'end' }}>
          <div style={{ flex: 1 }}>
            <label>Item Name</label>
            <input type="text" value={newItemName} onChange={e => setNewItemName(e.target.value)} required style={{ marginBottom: 0 }} />
          </div>
          <div>
            <label>Category</label>
            <select value={newItemCategory} onChange={e => setNewItemCategory(e.target.value)} style={{ marginBottom: 0 }}>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button type="submit" className="btn-primary"><Plus size={16} /></button>
        </form>
      </div>

      <div className="glass-panel">
        {categories.map(category => {
          const categoryItems = items.filter(item => item.category === category);
          if (categoryItems.length === 0) return null;
          return (
            <div key={category} style={{ marginBottom: '1.5rem' }}>
              <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem', color: 'var(--secondary-color)' }}>{category}</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {categoryItems.map(item => (
                  <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                    <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', flex: 1, textDecoration: item.is_packed ? 'line-through' : 'none', color: item.is_packed ? 'var(--text-secondary)' : 'var(--text-primary)' }}>
                      <input 
                        type="checkbox" 
                        checked={item.is_packed === 1} 
                        onChange={() => handleToggle(item.id, item.is_packed)} 
                        style={{ width: 'auto', marginBottom: 0 }}
                      />
                      {item.name}
                    </label>
                    <button onClick={() => handleDelete(item.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer' }}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {items.length === 0 && <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>Your checklist is empty.</p>}
      </div>
    </div>
  );
};

export default Checklist;
