import React, { useEffect, useState } from 'react';
import { Plus, MapPin, Eye, X } from 'lucide-react';
import { getCaptains, updateCaptainStatus, getCaptainHistory } from '../services/api';
import AddCaptainModal from '../components/AddCaptainModal';

const Captains = () => {
  const [captains, setCaptains] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCaptain, setSelectedCaptain] = useState(null);
  const [captainHistory, setCaptainHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  useEffect(() => {
    loadCaptainsData();
  }, []);

  const loadCaptainsData = async () => {
    const res = await getCaptains();
    if (res?.data) setCaptains(res.data);
  };

  const handleToggleStatus = async (captain) => {
    const newStatus = !captain.isActive;
    await updateCaptainStatus(captain._id || captain.id, newStatus);
    loadCaptainsData();
  };

  const handleViewHistory = async (captain) => {
    setSelectedCaptain(captain);
    setLoadingHistory(true);
    const res = await getCaptainHistory(captain._id || captain.id);
    if (res?.data) setCaptainHistory(res.data);
    setLoadingHistory(false);
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h2>Captain Management & Live Attendance</h2>
          <p className="subtitle">Track rides attended, earnings, and last known GPS location for each captain.</p>
        </div>
        <button className="btn btn-success" onClick={() => setIsAddModalOpen(true)}>
          <Plus size={18} /> Onboard New Captain
        </button>
      </div>

      <div className="table-card glass">
        <table className="data-table">
          <thead>
            <tr>
              <th>Captain</th>
              <th>Contact</th>
              <th>Rides Attended</th>
              <th>Total Revenue</th>
              <th>Last Active Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {captains.map((c) => (
              <tr key={c._id || c.id}>
                <td>
                  <strong>{c.name}</strong>
                  <div style={{ fontSize: '12px', color: '#94A3B8' }}>{c.email}</div>
                </td>
                <td>{c.phone}</td>
                <td>
                  <strong style={{ color: '#38BDF8' }}>{c.ridesAttended || 0} Rides</strong>
                </td>
                <td>
                  <strong style={{ color: '#22C55E' }}>₹{c.totalEarnings || 0}</strong>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: '#CBD5E1' }}>
                    <MapPin size={14} color="#FFB800" />
                    <span>{c.lastLocation?.address || 'Location active'}</span>
                  </div>
                </td>
                <td>
                  <span className={`badge ${c.isActive !== false ? 'active' : 'inactive'}`}>
                    {c.isActive !== false ? 'Approved' : 'Suspended'}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      className="btn btn-sm btn-primary"
                      onClick={() => handleViewHistory(c)}
                    >
                      <Eye size={14} /> History
                    </button>
                    <button
                      className={`btn btn-sm ${c.isActive !== false ? 'btn-danger' : 'btn-success'}`}
                      onClick={() => handleToggleStatus(c)}
                    >
                      {c.isActive !== false ? 'Suspend' : 'Approve'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* History Modal */}
      {selectedCaptain && (
        <div className="modal-overlay open">
          <div className="modal-card glass" style={{ maxWidth: '650px' }}>
            <div className="modal-header">
              <h3>Ride & Location History: {selectedCaptain.name}</h3>
              <button className="close-btn" onClick={() => setSelectedCaptain(null)}>
                <X size={20} />
              </button>
            </div>
            <div style={{ maxHeight: '350px', overflowY: 'auto' }}>
              {loadingHistory ? (
                <p style={{ padding: '20px', textAlign: 'center', color: '#94A3B8' }}>Loading trip logs...</p>
              ) : captainHistory.length === 0 ? (
                <p style={{ padding: '20px', textAlign: 'center', color: '#94A3B8' }}>No trips logged yet.</p>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Pickup Location</th>
                      <th>Dropoff Location</th>
                      <th>Fare</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {captainHistory.map((r) => (
                      <tr key={r._id || r.id}>
                        <td>{new Date(r.createdAt || Date.now()).toLocaleDateString()}</td>
                        <td>{r.pickupLocation?.address || 'Pickup'}</td>
                        <td>{r.dropoffLocation?.address || 'Destination'}</td>
                        <td>₹{r.fare}</td>
                        <td><span className="badge active">{r.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      )}

      <AddCaptainModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={loadCaptainsData}
      />
    </div>
  );
};

export default Captains;
