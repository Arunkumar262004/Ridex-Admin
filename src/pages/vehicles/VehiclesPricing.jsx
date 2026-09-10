import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, CheckCircle, XCircle, MoreHorizontal, Edit, Car, X, Layers, Trash2 } from 'lucide-react';
import { getVehicleTypes, updateVehicleType, deleteVehicleType } from '../../services/api';
import AddVehicleModal from '../../components/vehicles/AddVehicleModal';

const VehiclesPricing = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState(null);
  const [editImageFile, setEditImageFile] = useState(null);
  const [editImagePreview, setEditImagePreview] = useState(null);
  const [deletingVehicle, setDeletingVehicle] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 'auto', bottom: 'auto', right: '0px' });
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    loadVehicles();
    const handleClickOutside = (e) => {
      if (!e.target.closest('.dots-menu-container')) {
        setOpenDropdownId(null);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const loadVehicles = async () => {
    const res = await getVehicleTypes();
    const list = Array.isArray(res) ? res : (Array.isArray(res?.data) ? res.data : []);
    setVehicles([...list]);
  };

  const handleToggleStatus = async (vehicle) => {
    const newStatus = !vehicle.isActive;
    await updateVehicleType(vehicle._id || vehicle.id, { isActive: newStatus });
    showToast(`Vehicle ${vehicle.name} ${newStatus ? 'Activated' : 'Disabled'}`);
    setOpenDropdownId(null);
    loadVehicles();
  };

  const closeEditModal = () => {
    setEditingVehicle(null);
    setEditImageFile(null);
    setEditImagePreview(null);
  };

  const handleEditImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setEditImageFile(file);
    setEditImagePreview(URL.createObjectURL(file));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingVehicle) return;

    await updateVehicleType(editingVehicle._id || editingVehicle.id, { ...editingVehicle, imageFile: editImageFile });
    showToast(`Vehicle ${editingVehicle.name} details updated successfully!`);
    setEditingVehicle(null);
    setEditImageFile(null);
    setEditImagePreview(null);
    loadVehicles();
  };

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Configure base fares, minimum fare guarantees, and per-kilometer rates for all vehicle types.
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to="/master-data/brands" className="btn btn-secondary" style={{ fontSize: '12px', padding: '6px 12px' }}>
            <Car size={14} /> Master Brands
          </Link>
          <Link to="/master-data/categories" className="btn btn-secondary" style={{ fontSize: '12px', padding: '6px 12px' }}>
            <Layers size={14} /> Master Categories
          </Link>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={16} /> Add Vehicle Category
          </button>
        </div>
      </div>

      <div className="table-card glass-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Vehicle Category</th>
              <th>Base Fare (₹)</th>
              <th>Rate / Km (₹/km)</th>
              <th>Rate / Min (₹/min)</th>
              <th>Min Fare (₹)</th>
              <th>Capacity</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v, index) => {
              const vehicleId = v._id || v.id;
              const isDropdownOpen = openDropdownId === vehicleId;
              const isDropUp = index > 0 && (index >= vehicles.length - 2 || (index >= 1 && vehicles.length <= 3));

              return (
                <tr key={vehicleId} style={{ position: 'relative', zIndex: isDropdownOpen ? 100 : 1 }}>
                  <td>
                    {v.imageUrl ? (
                      <img
                        src={v.imageUrl}
                        alt={v.name}
                        style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '8px' }}
                      />
                    ) : (
                      <div style={{ width: '44px', height: '44px', borderRadius: '8px', background: 'var(--surface-2, #f0f0f0)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                        <Car size={18} />
                      </div>
                    )}
                  </td>
                  <td><strong>{v.name}</strong></td>
                  <td>₹{v.baseFare}</td>
                  <td><strong style={{ color: '#FF6600' }}>₹{v.ratePerKm} / km</strong></td>
                  <td>₹{v.ratePerMin || 1.5} / min</td>
                  <td>₹{v.minFare}</td>
                  <td>{v.capacity} Seats</td>
                  <td>
                    <span className={`badge ${v.isActive !== false ? 'verified' : 'rejected'}`}>
                      {v.isActive !== false ? 'Active Fleet' : 'Disabled'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
                    {/* Three Dots Menu */}
                    <div className="dots-menu-container">
                      <button
                        className="dots-btn"
                        onClick={(e) => {
                          e.stopPropagation();
                          if (isDropdownOpen) {
                            setOpenDropdownId(null);
                          } else {
                            const rect = e.currentTarget.getBoundingClientRect();
                            const spaceBelow = window.innerHeight - rect.bottom;
                            const isUpward = spaceBelow < 200;
                            setDropdownPos({
                              top: isUpward ? 'auto' : `${rect.bottom + 6}px`,
                              bottom: isUpward ? `${window.innerHeight - rect.top + 6}px` : 'auto',
                              right: `${window.innerWidth - rect.right}px`,
                            });
                            setOpenDropdownId(vehicleId);
                          }
                        }}
                        title="Actions"
                      >
                        <MoreHorizontal size={18} />
                      </button>

                      {isDropdownOpen && (
                        <div
                          className="dots-dropdown-fixed"
                          style={{
                            top: dropdownPos.top,
                            bottom: dropdownPos.bottom,
                            right: dropdownPos.right,
                          }}
                        >
                          <button
                            className="dots-dropdown-item"
                            onClick={() => {
                              setEditingVehicle({ ...v });
                              setEditImageFile(null);
                              setEditImagePreview(v.imageUrl || null);
                              setOpenDropdownId(null);
                            }}
                          >
                            <Edit size={14} color="#FFB800" /> Edit Category & Fares
                          </button>

                          <button
                            className={`dots-dropdown-item ${v.isActive !== false ? 'danger' : 'success'}`}
                            onClick={() => handleToggleStatus(v)}
                          >
                            {v.isActive !== false ? (
                              <><XCircle size={14} color="#EF4444" style={{ display: 'inline', marginRight: '6px' }} /> Disable Vehicle</>
                            ) : (
                              <><CheckCircle size={14} color="#22C55E" style={{ display: 'inline', marginRight: '6px' }} /> Enable Vehicle</>
                            )}
                          </button>

                          <button
                            className="dots-dropdown-item danger"
                            onClick={() => {
                              setDeletingVehicle(v);
                              setOpenDropdownId(null);
                            }}
                          >
                            <Trash2 size={14} color="#EF4444" /> Delete Category
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Edit Vehicle Category Modal */}
      {editingVehicle && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div className="modal-header-title">
                <div className="modal-header-icon"><Car size={20} /></div>
                <h3>Edit Vehicle Category & Rates</h3>
              </div>
              <button className="close-btn" onClick={closeEditModal}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="form-group">
                <label>Category Name</label>
                <input
                  type="text"
                  required
                  value={editingVehicle.name}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Vehicle Model Photo</label>
                <input type="file" accept="image/*" onChange={handleEditImageChange} />
                {editImagePreview && (
                  <img
                    src={editImagePreview}
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
                    value={editingVehicle.baseFare}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, baseFare: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Rate Per Km (₹/km)</label>
                  <input
                    type="number"
                    step="0.5"
                    required
                    value={editingVehicle.ratePerKm}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, ratePerKm: Number(e.target.value) })}
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
                    value={editingVehicle.ratePerMin || 1.5}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, ratePerMin: Number(e.target.value) })}
                  />
                </div>
                <div className="form-group">
                  <label>Min Guaranteed Fare (₹)</label>
                  <input
                    type="number"
                    required
                    value={editingVehicle.minFare}
                    onChange={(e) => setEditingVehicle({ ...editingVehicle, minFare: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Passenger Capacity</label>
                <input
                  type="number"
                  required
                  value={editingVehicle.capacity}
                  onChange={(e) => setEditingVehicle({ ...editingVehicle, capacity: Number(e.target.value) })}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    const target = editingVehicle;
                    closeEditModal();
                    setDeletingVehicle(target);
                  }}
                >
                  <Trash2 size={14} /> Delete Category
                </button>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button type="button" className="btn btn-secondary" onClick={closeEditModal}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Save Pricing Fares
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add New Vehicle Category Modal */}
      <AddVehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => {
          showToast('New Vehicle Category saved successfully!');
          loadVehicles();
        }}
      />

      {/* Delete Vehicle Category Confirmation Popup Modal */}
      {deletingVehicle && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '420px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '14px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', marginBottom: '14px' }}>
              <Trash2 size={28} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Delete Vehicle Category</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 20px 0', lineHeight: '1.5' }}>
              Are you sure you want to permanently delete <strong>{deletingVehicle.name}</strong> from the system? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setDeletingVehicle(null)}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                style={{ flex: 1 }}
                onClick={async () => {
                  const targetId = String(deletingVehicle._id || deletingVehicle.id);
                  await deleteVehicleType(targetId);
                  setVehicles((prev) => prev.filter((v) => String(v._id || v.id) !== targetId));
                  setDeletingVehicle(null);
                  showToast('Vehicle Category deleted permanently!');
                  await loadVehicles();
                }}
              >
                Yes, Delete Category
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="toast-container">
          <div className="toast success">
            <CheckCircle size={16} /> {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default VehiclesPricing;
