import React, { useEffect, useState } from 'react';
import { Check, X, Eye, Clock, CheckCircle, Shield, AlertTriangle, MoreHorizontal, Edit, User, Car, MapPin, Trash2 } from 'lucide-react';
import { getCaptains, verifyCaptainStatus, deleteCaptain } from '../../services/api';

const CaptainOnboardList = () => {
  const [captains, setCaptains] = useState([]);
  const [editingCaptain, setEditingCaptain] = useState(null);
  const [rejectingCaptain, setRejectingCaptain] = useState(null);
  const [deletingCaptain, setDeletingCaptain] = useState(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [viewingKYC, setViewingKYC] = useState(null);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 'auto', bottom: 'auto', right: '0px' });
  const [toastMessage, setToastMessage] = useState('');
  const [activeTab, setActiveTab] = useState('PENDING'); // 'PENDING' | 'APPROVED' | 'REJECTED' | 'ALL'

  useEffect(() => {
    loadData();
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

  const loadData = async () => {
    const res = await getCaptains();
    if (res?.data) {
      setCaptains([...res.data]);
    }
  };

  const handleApprove = async (captain) => {
    await verifyCaptainStatus(captain._id || captain.id, 'VERIFIED_APPROVED');
    showToast(`Captain ${captain.name} verified and approved successfully!`);
    setViewingKYC(null);
    setOpenDropdownId(null);
    loadData();
  };

  const handleRejectSubmit = async (e) => {
    e.preventDefault();
    if (!rejectingCaptain) return;

    await verifyCaptainStatus(
      rejectingCaptain._id || rejectingCaptain.id,
      'REJECTED',
      rejectionReason || 'KYC document verification failed'
    );

    showToast(`Captain ${rejectingCaptain.name} registration rejected.`);
    setRejectingCaptain(null);
    setViewingKYC(null);
    setOpenDropdownId(null);
    setRejectionReason('');
    loadData();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingCaptain) return;

    const stored = localStorage.getItem('ridex_captains_db');
    let db = stored ? JSON.parse(stored) : captains;
    db = db.map((c) => (c._id === editingCaptain._id || c.id === editingCaptain.id ? editingCaptain : c));
    localStorage.setItem('ridex_captains_db', JSON.stringify(db));

    showToast(`Captain ${editingCaptain.name} information updated!`);
    setEditingCaptain(null);
    loadData();
  };

  const filteredCaptains = captains.filter((c) => {
    if (activeTab === 'PENDING') return c.status === 'PENDING_VERIFICATION';
    if (activeTab === 'APPROVED') return c.status === 'VERIFIED_APPROVED';
    if (activeTab === 'REJECTED') return c.status === 'REJECTED';
    return true;
  });

  const pendingCount = captains.filter((c) => c.status === 'PENDING_VERIFICATION').length;

  return (
    <div>
      {/* Category Tab Buttons Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn btn-sm ${activeTab === 'PENDING' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('PENDING')}
          >
            <Clock size={13} /> Pending Queue ({pendingCount})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'APPROVED' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('APPROVED')}
          >
            Approved List
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'REJECTED' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('REJECTED')}
          >
            Rejected
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'ALL' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('ALL')}
          >
            All Candidates
          </button>
        </div>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Click <strong>...</strong> on any candidate to inspect full unmasked KYC or Edit application.
        </span>
      </div>

      {/* Compact Table */}
      <div className="table-card glass-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Candidate Name</th>
              <th>Mobile No</th>
              <th>Aadhar Card (Masked)</th>
              <th>Vehicle Model</th>
              <th>Transmission</th>
              <th>Source</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCaptains.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)' }}>
                  No applications in this category.
                </td>
              </tr>
            ) : (
              filteredCaptains.map((c, index) => {
                const captainId = c._id || c.id;
                const isDropdownOpen = openDropdownId === captainId;
                const isDropUp = index > 0 && (index >= filteredCaptains.length - 2 || (index >= 1 && filteredCaptains.length <= 3));

                return (
                  <tr key={captainId} style={{ position: 'relative', zIndex: isDropdownOpen ? 100 : 1 }}>
                    <td>
                      <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{c.name}</div>
                    </td>
                    <td style={{ fontSize: '12.5px' }}>{c.phone}</td>
                    <td>
                      <span style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--text-muted)', fontSize: '12px' }}>
                        {c.aadharNo ? `•••• •••• ${c.aadharNo.slice(-4)}` : '•••• •••• ••••'}
                      </span>
                    </td>
                    <td>
                      <div><strong>{c.vehicleBrand || 'Honda'} {c.vehicleModel || 'Vehicle'}</strong></div>
                    </td>
                    <td>
                      <span className={`badge ${c.isGear ? 'gear' : 'non-gear'}`}>
                        {c.isGear ? 'Gear' : 'Non-Gear'}
                      </span>
                    </td>
                    <td>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{c.source || 'App Registration'}</span>
                    </td>
                    <td>
                      <span
                        className={`badge ${
                          c.status === 'VERIFIED_APPROVED'
                            ? 'verified'
                            : c.status === 'REJECTED'
                            ? 'rejected'
                            : 'pending'
                        }`}
                      >
                        {c.status === 'VERIFIED_APPROVED'
                          ? 'Approved'
                          : c.status === 'REJECTED'
                          ? 'Rejected'
                          : 'Pending Review'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'center' }}>
                      {/* Three Horizontal Dots Menu */}
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
                              const isUpward = spaceBelow < 240;
                              setDropdownPos({
                                top: isUpward ? 'auto' : `${rect.bottom + 6}px`,
                                bottom: isUpward ? `${window.innerHeight - rect.top + 6}px` : 'auto',
                                right: `${window.innerWidth - rect.right}px`,
                              });
                              setOpenDropdownId(captainId);
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
                                setViewingKYC(c);
                                setOpenDropdownId(null);
                              }}
                            >
                              <Eye size={14} color="#FF6600" /> View Full KYC
                            </button>

                            <button
                              className="dots-dropdown-item"
                              onClick={() => {
                                setEditingCaptain({ ...c });
                                setOpenDropdownId(null);
                              }}
                            >
                              <Edit size={14} color="#FFB800" /> Edit Candidate Info
                            </button>

                            {c.status !== 'VERIFIED_APPROVED' && (
                              <button
                                className="dots-dropdown-item success"
                                onClick={() => handleApprove(c)}
                              >
                                <Check size={14} /> Verify & Approve
                              </button>
                            )}

                            {c.status !== 'REJECTED' && (
                              <button
                                className="dots-dropdown-item danger"
                                onClick={() => {
                                  setRejectingCaptain(c);
                                  setOpenDropdownId(null);
                                }}
                              >
                                <X size={14} /> Reject Application
                              </button>
                            )}

                            <button
                              className="dots-dropdown-item danger"
                              onClick={() => {
                                setDeletingCaptain(c);
                                setOpenDropdownId(null);
                              }}
                            >
                              <Trash2 size={14} color="#EF4444" /> Delete Application
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Candidate Modal */}
      {editingCaptain && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div className="modal-header-title">
                <div className="modal-header-icon"><Edit size={20} /></div>
                <h3>Edit Candidate Application</h3>
              </div>
              <button className="close-btn" onClick={() => setEditingCaptain(null)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleEditSubmit}>
              <div className="form-row">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    required
                    value={editingCaptain.name}
                    onChange={(e) => setEditingCaptain({ ...editingCaptain, name: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Mobile Number</label>
                  <input
                    type="tel"
                    required
                    value={editingCaptain.phone}
                    onChange={(e) => setEditingCaptain({ ...editingCaptain, phone: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    required
                    value={editingCaptain.email}
                    onChange={(e) => setEditingCaptain({ ...editingCaptain, email: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>12-Digit Aadhar No</label>
                  <input
                    type="text"
                    maxLength={12}
                    value={editingCaptain.aadharNo || ''}
                    onChange={(e) => setEditingCaptain({ ...editingCaptain, aadharNo: e.target.value.replace(/\D/g, '').slice(0, 12) })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Vehicle Brand</label>
                  <input
                    type="text"
                    value={editingCaptain.vehicleBrand || ''}
                    onChange={(e) => setEditingCaptain({ ...editingCaptain, vehicleBrand: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label>Vehicle Model</label>
                  <input
                    type="text"
                    value={editingCaptain.vehicleModel || ''}
                    onChange={(e) => setEditingCaptain({ ...editingCaptain, vehicleModel: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Vehicle Reg No</label>
                  <input
                    type="text"
                    value={editingCaptain.vehicleNo || ''}
                    onChange={(e) => setEditingCaptain({ ...editingCaptain, vehicleNo: e.target.value.toUpperCase() })}
                  />
                </div>
                <div className="form-group">
                  <label>Transmission</label>
                  <select
                    value={editingCaptain.isGear ? 'true' : 'false'}
                    onChange={(e) => setEditingCaptain({ ...editingCaptain, isGear: e.target.value === 'true' })}
                  >
                    <option value="false">Non-Gear (Scooter/Auto)</option>
                    <option value="true">Gear (Motorcycle/Car)</option>
                  </select>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setEditingCaptain(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Attractive Redesigned View Modal */}
      {viewingKYC && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div className="modal-header-title">
                <div className="modal-header-icon"><Shield size={20} /></div>
                <h3>Candidate KYC Application Summary</h3>
              </div>
              <button className="close-btn" onClick={() => setViewingKYC(null)}>
                <X size={18} />
              </button>
            </div>

            <div>
              <div className="info-card-block">
                <div className="info-card-title">
                  <User size={14} /> Personal & KYC Verification
                </div>
                <div className="info-grid-row">
                  <div>
                    <span className="info-label">Candidate Name</span>
                    <div className="info-value">{viewingKYC.name}</div>
                  </div>
                  <div>
                    <span className="info-label">Mobile Contact</span>
                    <div className="info-value">{viewingKYC.phone}</div>
                  </div>
                  <div>
                    <span className="info-label">Email Address</span>
                    <div className="info-value">{viewingKYC.email}</div>
                  </div>
                  <div>
                    <span className="info-label">Unmasked 12-Digit Aadhar</span>
                    <div className="info-value" style={{ color: '#FF6600', fontFamily: 'monospace', letterSpacing: '1px' }}>
                      {viewingKYC.aadharNo
                        ? `${viewingKYC.aadharNo.slice(0, 4)} ${viewingKYC.aadharNo.slice(4, 8)} ${viewingKYC.aadharNo.slice(8, 12)}`
                        : 'Not provided'}
                    </div>
                  </div>
                </div>
              </div>

              <div className="info-card-block">
                <div className="info-card-title">
                  <Car size={14} /> Vehicle & Transmission
                </div>
                <div className="info-grid-row">
                  <div>
                    <span className="info-label">Vehicle Registration No</span>
                    <div className="info-value">{viewingKYC.vehicleNo || 'TN 01 AB 1234'}</div>
                  </div>
                  <div>
                    <span className="info-label">Brand & Model</span>
                    <div className="info-value">{viewingKYC.vehicleBrand} {viewingKYC.vehicleModel}</div>
                  </div>
                  <div>
                    <span className="info-label">Transmission Type</span>
                    <div className="info-value">
                      <span className={`badge ${viewingKYC.isGear ? 'gear' : 'non-gear'}`}>
                        {viewingKYC.isGear ? 'Gear Motorcycle' : 'Non-Gear Scooter'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="info-label">Source</span>
                    <div className="info-value">{viewingKYC.source || 'App Self Registration'}</div>
                  </div>
                </div>
              </div>

              <div className="info-card-block">
                <div className="info-card-title">
                  <MapPin size={14} /> Application Status
                </div>
                <div className="info-grid-row">
                  <div>
                    <span className="info-label">Assigned Zone</span>
                    <div className="info-value">{viewingKYC.zone || 'Anna Nagar'}, {viewingKYC.city || 'Chennai'}</div>
                  </div>
                  <div>
                    <span className="info-label">Verification Status</span>
                    <div className="info-value">
                      <span className="badge pending">{viewingKYC.status}</span>
                    </div>
                  </div>
                </div>
                {viewingKYC.rejectionReason && (
                  <p style={{ color: '#EF4444', fontSize: '12.5px', marginTop: '8px' }}>
                    <strong>Rejection Reason:</strong> {viewingKYC.rejectionReason}
                  </p>
                )}
              </div>
            </div>

            <div className="modal-footer">
              {viewingKYC.status !== 'VERIFIED_APPROVED' && (
                <button className="btn btn-success" onClick={() => handleApprove(viewingKYC)}>
                  <Check size={14} /> Approve Application
                </button>
              )}
              {viewingKYC.status !== 'REJECTED' && (
                <button className="btn btn-danger" onClick={() => setRejectingCaptain(viewingKYC)}>
                  <X size={14} /> Reject Application
                </button>
              )}
              <button className="btn btn-secondary" onClick={() => setViewingKYC(null)}>
                Close Modal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {rejectingCaptain && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Reject Candidate: {rejectingCaptain.name}</h3>
              <button className="close-btn" onClick={() => setRejectingCaptain(null)}>
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleRejectSubmit}>
              <div className="form-group">
                <label>Rejection Reason</label>
                <textarea
                  required
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    borderRadius: '8px',
                    color: 'var(--text-primary)',
                  }}
                  placeholder="e.g. Invalid Aadhar document scan."
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setRejectingCaptain(null)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-danger">
                  Confirm Rejection
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Candidate Confirmation Popup Modal */}
      {deletingCaptain && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '420px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '14px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', marginBottom: '14px' }}>
              <Trash2 size={28} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Delete Onboarding Application</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 20px 0', lineHeight: '1.5' }}>
              Are you sure you want to permanently delete <strong>{deletingCaptain.name}</strong>'s onboarding application? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setDeletingCaptain(null)}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                style={{ flex: 1 }}
                onClick={async () => {
                  const targetId = String(deletingCaptain._id || deletingCaptain.id);
                  await deleteCaptain(targetId);
                  setCaptains((prev) => prev.filter((c) => String(c._id || c.id) !== targetId));
                  setDeletingCaptain(null);
                  showToast('Candidate application deleted permanently!');
                  await loadData();
                }}
              >
                Yes, Delete Application
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
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

export default CaptainOnboardList;
