import React, { useState } from 'react';
import { X } from 'lucide-react';
import { createVehicleType } from '../services/api';

const AddVehicleModal = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    name: '',
    baseFare: 30,
    ratePerKm: 15,
    ratePerMin: 1.5,
    minFare: 40,
    capacity: 3,
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await createVehicleType(formData);
      onSuccess();
      onClose();
    } catch (err) {
      alert('Failed to save vehicle type');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card glass">
        <div className="modal-header">
          <h3>Add Vehicle Category & Per-Km Rate</h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Vehicle Category Name (e.g. Bike, Auto, Cab)</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Auto"
            />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Base Fare (₹)</label>
              <input
                type="number"
                required
                value={formData.baseFare}
                onChange={(e) => setFormData({ ...formData, baseFare: Number(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label>Rate Per Km (₹/km)</label>
              <input
                type="number"
                step="0.5"
                required
                value={formData.ratePerKm}
                onChange={(e) => setFormData({ ...formData, ratePerKm: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Rate Per Min (₹/min)</label>
              <input
                type="number"
                step="0.1"
                required
                value={formData.ratePerMin}
                onChange={(e) => setFormData({ ...formData, ratePerMin: Number(e.target.value) })}
              />
            </div>
            <div className="form-group">
              <label>Min Guaranteed Fare (₹)</label>
              <input
                type="number"
                required
                value={formData.minFare}
                onChange={(e) => setFormData({ ...formData, minFare: Number(e.target.value) })}
              />
            </div>
          </div>
          <div className="form-group">
            <label>Passenger Capacity</label>
            <input
              type="number"
              required
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
            />
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : 'Save Vehicle Type'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicleModal;
