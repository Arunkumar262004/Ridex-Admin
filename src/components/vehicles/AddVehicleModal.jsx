import React, { useState, useEffect } from 'react';
import { X, AlertTriangle } from 'lucide-react';
import { createVehicleType, getMasterCategories } from '../../services/api';

const AddVehicleModal = ({ isOpen, onClose, onSuccess }) => {
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    baseFare: 30,
    ratePerKm: 15,
    ratePerMin: 1.5,
    minFare: 40,
    capacity: 3,
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  useEffect(() => {
    if (isOpen) {
      setImageFile(null);
      setImagePreview(null);
      getMasterCategories().then((cats) => {
        setCategories(cats);
        if (cats.length > 0 && !formData.name) {
          setFormData((prev) => ({ ...prev, name: cats[0] }));
        }
      });
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Please select or enter vehicle category name');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await createVehicleType({ ...formData, imageFile });
      setImageFile(null);
      setImagePreview(null);
      onSuccess();
      onClose();
    } catch (err) {
      const stored = localStorage.getItem('ridex_vehicles_db');
      let vehicles = stored ? JSON.parse(stored) : [];
      vehicles.push({
        _id: 'v_' + Date.now(),
        ...formData,
        isActive: true,
      });
      localStorage.setItem('ridex_vehicles_db', JSON.stringify(vehicles));
      setImageFile(null);
      setImagePreview(null);
      onSuccess();
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-card glass-card">
        <div className="modal-header">
          <h3>Add Vehicle Category & Per-Km Rate</h3>
          <button className="close-btn" onClick={onClose}><X size={20} /></button>
        </div>

        {error && (
          <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', padding: '10px 14px', borderRadius: '8px', marginBottom: '14px', fontSize: '13px' }}>
            <AlertTriangle size={14} style={{ display: 'inline', marginRight: '6px' }} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Vehicle Category (From Master Data)</label>
            <select
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Vehicle Model Photo</label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Vehicle preview"
                style={{ marginTop: '8px', width: '100%', maxHeight: '140px', objectFit: 'cover', borderRadius: '8px' }}
              />
            )}
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
              {loading ? 'Saving...' : 'Save Vehicle Category'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddVehicleModal;
