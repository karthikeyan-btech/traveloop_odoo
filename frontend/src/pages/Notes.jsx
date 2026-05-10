import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { FileText, ArrowLeft, Trash2, Plus } from 'lucide-react';

const Notes = () => {
  const { id } = useParams();
  const [notes, setNotes] = useState([]);
  const [trip, setTrip] = useState(null);
  const [newNote, setNewNote] = useState('');

  useEffect(() => {
    fetch(`http://localhost:3001/api/trips/${id}`)
      .then(res => res.json())
      .then(data => setTrip(data));

    fetchNotes();
  }, [id]);

  const fetchNotes = () => {
    fetch(`http://localhost:3001/api/trips/${id}/notes`)
      .then(res => res.json())
      .then(data => setNotes(data));
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote) return;
    try {
      await fetch(`http://localhost:3001/api/trips/${id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newNote })
      });
      setNewNote('');
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (noteId) => {
    try {
      await fetch(`http://localhost:3001/api/notes/${noteId}`, { method: 'DELETE' });
      fetchNotes();
    } catch (err) {
      console.error(err);
    }
  };

  if (!trip) return <div className="container">Loading...</div>;

  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <Link to={`/trips/${id}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>
        <ArrowLeft size={16} /> Back to Itinerary
      </Link>
      
      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <FileText size={28} color="var(--primary-color)" /> Trip Notes
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>For your trip: <strong>{trip.name}</strong></p>
      </div>

      <div className="glass-panel" style={{ marginBottom: '2rem' }}>
        <form onSubmit={handleAddNote}>
          <label style={{ display: 'block', marginBottom: '0.5rem' }}>Add a new note</label>
          <textarea 
            rows="3"
            value={newNote} 
            onChange={e => setNewNote(e.target.value)} 
            required 
            placeholder="Write down reservation numbers, tips, or reminders..."
            style={{ width: '100%' }}
          />
          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
            <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Plus size={16} /> Save Note
            </button>
          </div>
        </form>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {notes.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)', textAlign: 'center' }}>No notes added yet.</p>
        ) : (
          notes.map(note => (
            <div key={note.id} className="glass-panel" style={{ position: 'relative' }}>
              <p style={{ whiteSpace: 'pre-wrap', marginBottom: '1rem' }}>{note.content}</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--text-secondary)', fontSize: '0.75rem' }}>
                <span>{new Date(note.timestamp).toLocaleString()}</span>
                <button onClick={() => handleDelete(note.id)} style={{ background: 'transparent', color: '#ef4444', border: 'none', cursor: 'pointer' }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Notes;
