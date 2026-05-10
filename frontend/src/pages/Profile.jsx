import React from 'react';
import { User, Settings, Mail, Bell, Shield, LogOut } from 'lucide-react';

const Profile = () => {
  return (
    <div className="container" style={{ maxWidth: '800px' }}>
      <h1 style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <User size={28} color="var(--primary-color)" /> User Profile & Settings
      </h1>
      
      <div className="grid grid-cols-3" style={{ gap: '2rem' }}>
        <div style={{ gridColumn: 'span 1' }}>
          <div className="glass-panel" style={{ textAlign: 'center' }}>
            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), var(--secondary-color))', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <User size={48} color="white" />
            </div>
            <h3>Test User</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>test@test.com</p>
            <button className="btn-secondary" style={{ width: '100%', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

        <div style={{ gridColumn: 'span 2', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div className="glass-panel">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><Settings size={18} /> General Settings</h3>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Display Name</label>
              <input type="text" defaultValue="Test User" style={{ marginBottom: 0 }} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem' }}>Email Address</label>
              <input type="email" defaultValue="test@test.com" style={{ marginBottom: 0 }} />
            </div>
            <button className="btn-primary">Save Changes</button>
          </div>

          <div className="glass-panel">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}><Bell size={18} /> Preferences</h3>
            <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', marginBottom: '1rem' }}>
              <input type="checkbox" defaultChecked style={{ width: 'auto', marginBottom: 0 }} />
              Email me updates about my upcoming trips
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer' }}>
              <input type="checkbox" defaultChecked style={{ width: 'auto', marginBottom: 0 }} />
              Publicly share my itineraries by default
            </label>
          </div>

          <div className="glass-panel" style={{ borderColor: 'rgba(239, 68, 68, 0.2)' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#ef4444' }}><Shield size={18} /> Danger Zone</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>Once you delete your account, there is no going back. Please be certain.</p>
            <button style={{ background: 'transparent', color: '#ef4444', border: '1px solid #ef4444', padding: '0.5rem 1rem', borderRadius: '6px', cursor: 'pointer' }}>Delete Account</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
