import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, Eye, X, CheckCircle, XCircle, Bike, AlertTriangle, MoreHorizontal, Edit, History, Shield, User, Car, ArrowRight, ArrowLeft, Globe, Trash2 } from 'lucide-react';
import {
  getCaptains,
  createCaptain,
  updateCaptainStatus,
  deleteCaptain,
  getCaptainHistory,
  getMasterBrands,
  getMasterCategories,
  getMasterLocations,
} from '../../services/api';

const CaptainCreation = () => {
  const [captains, setCaptains] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // Dynamic Master Data States
  const [masterBrands, setMasterBrands] = useState([]);
  const [masterCategories, setMasterCategories] = useState([]);
  const [masterLocations, setMasterLocations] = useState({});

  const [editingCaptain, setEditingCaptain] = useState(null);
  const [viewingKYC, setViewingKYC] = useState(null);
  const [historyCaptain, setHistoryCaptain] = useState(null);
  const [deletingCaptain, setDeletingCaptain] = useState(null);
  const [captainHistory, setCaptainHistory] = useState([]);
  const [openDropdownId, setOpenDropdownId] = useState(null);
  const [dropdownPos, setDropdownPos] = useState({ top: 'auto', bottom: 'auto', right: '0px' });
  const [toastMessage, setToastMessage] = useState('');

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    aadharNo: '',
    vehicleNo: '',
    vehicleBrand: '',
    vehicleModel: '',
    vehicleCategory: '',
    isGear: false,
    country: '',
    state: '',
    city: '',
    zone: '',
    status: 'VERIFIED_APPROVED',
  });
  const [stepError, setStepError] = useState('');

  useEffect(() => {
    loadCaptainsData();
    loadMasterData();
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

  const loadMasterData = async () => {
    const [brands, categories, locations] = await Promise.all([
      getMasterBrands(),
      getMasterCategories(),
      getMasterLocations(),
    ]);

    setMasterBrands(brands);
    setMasterCategories(categories);
    setMasterLocations(locations);

    const firstCountry = Object.keys(locations)[0] || 'India';
    const firstState = Object.keys(locations[firstCountry] || {})[0] || 'Tamil Nadu';
    const firstCity = Object.keys(locations[firstCountry]?.[firstState] || {})[0] || 'Chennai';
    const firstZone = locations[firstCountry]?.[firstState]?.[firstCity]?.[0] || 'Anna Nagar';

    setFormData((prev) => ({
      ...prev,
      vehicleBrand: brands[0] || 'Honda',
      vehicleCategory: categories[0] || 'Bike',
      country: firstCountry,
      state: firstState,
      city: firstCity,
      zone: firstZone,
    }));
  };

  const loadCaptainsData = async () => {
    const res = await getCaptains();
    if (res?.data) {
      setCaptains([...res.data]);
    }
  };

  // 4-Tier Location Selectors for Onboarding Form
  const availableCountries = Object.keys(masterLocations);
  const availableStates = Object.keys(masterLocations[formData.country] || {});
  const availableCities = Object.keys(masterLocations[formData.country]?.[formData.state] || {});
  const availableZones = masterLocations[formData.country]?.[formData.state]?.[formData.city] || [];

  const handleCountryChange = (countryVal) => {
    const states = Object.keys(masterLocations[countryVal] || {});
    const firstState = states[0] || '';
    const cities = Object.keys(masterLocations[countryVal]?.[firstState] || {});
    const firstCity = cities[0] || '';
    const zones = masterLocations[countryVal]?.[firstState]?.[firstCity] || [];
    const firstZone = zones[0] || '';

    setFormData({
      ...formData,
      country: countryVal,
      state: firstState,
      city: firstCity,
      zone: firstZone,
    });
  };

  const handleStateChange = (stateVal) => {
    const cities = Object.keys(masterLocations[formData.country]?.[stateVal] || {});
    const firstCity = cities[0] || '';
    const zones = masterLocations[formData.country]?.[stateVal]?.[firstCity] || [];
    const firstZone = zones[0] || '';

    setFormData({
      ...formData,
      state: stateVal,
      city: firstCity,
      zone: firstZone,
    });
  };

  const handleCityChange = (cityVal) => {
    const zones = masterLocations[formData.country]?.[formData.state]?.[cityVal] || [];
    const firstZone = zones[0] || '';

    setFormData({
      ...formData,
      city: cityVal,
      zone: firstZone,
    });
  };

  // Location Handlers for Editing Captain
  const handleEditCountryChange = (countryVal) => {
    if (!editingCaptain) return;
    const states = Object.keys(masterLocations[countryVal] || {});
    const firstState = states[0] || '';
    const cities = Object.keys(masterLocations[countryVal]?.[firstState] || {});
    const firstCity = cities[0] || '';
    const zones = masterLocations[countryVal]?.[firstState]?.[firstCity] || [];
    const firstZone = zones[0] || '';

    setEditingCaptain({
      ...editingCaptain,
      country: countryVal,
      state: firstState,
      city: firstCity,
      zone: firstZone,
    });
  };

  const handleEditStateChange = (stateVal) => {
    if (!editingCaptain) return;
    const currentCountry = editingCaptain.country || availableCountries[0];
    const cities = Object.keys(masterLocations[currentCountry]?.[stateVal] || {});
    const firstCity = cities[0] || '';
    const zones = masterLocations[currentCountry]?.[stateVal]?.[firstCity] || [];
    const firstZone = zones[0] || '';

    setEditingCaptain({
      ...editingCaptain,
      state: stateVal,
      city: firstCity,
      zone: firstZone,
    });
  };

  const handleEditCityChange = (cityVal) => {
    if (!editingCaptain) return;
    const currentCountry = editingCaptain.country || availableCountries[0];
    const currentState = editingCaptain.state;
    const zones = masterLocations[currentCountry]?.[currentState]?.[cityVal] || [];
    const firstZone = zones[0] || '';

    setEditingCaptain({
      ...editingCaptain,
      city: cityVal,
      zone: firstZone,
    });
  };

  const handleAadharChange = (text, isEdit = false) => {
    const val = text.replace(/\D/g, '').slice(0, 12);
    if (isEdit && editingCaptain) {
      setEditingCaptain({ ...editingCaptain, aadharNo: val });
    } else {
      setFormData({ ...formData, aadharNo: val });
    }
    if (val.length > 0 && val.length < 12) {
      setStepError('Aadhar number must be strictly 12 numeric digits');
    } else {
      setStepError('');
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      if (!formData.name.trim() || !formData.phone.trim() || !formData.email.trim()) {
        setStepError('Please complete all personal details');
        return;
      }
      if (formData.aadharNo.length !== 12) {
        setStepError('Aadhar number must be strictly 12 numeric digits');
        return;
      }
      setStepError('');
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!formData.vehicleNo.trim() || !formData.vehicleModel.trim()) {
        setStepError('Please enter vehicle registration number and model');
        return;
      }
      setStepError('');
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    setStepError('');
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createCaptain({
      ...formData,
      source: 'Admin Onboarded',
    });

    showToast(`Captain ${formData.name} onboarded successfully!`);
    setIsAddModalOpen(false);
    setCurrentStep(1);
    loadCaptainsData();
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (!editingCaptain) return;

    const stored = localStorage.getItem('ridex_captains_db');
    let db = stored ? JSON.parse(stored) : captains;
    db = db.map((c) => (c._id === editingCaptain._id || c.id === editingCaptain.id ? editingCaptain : c));
    localStorage.setItem('ridex_captains_db', JSON.stringify(db));

    showToast(`Captain ${editingCaptain.name} details updated!`);
    setEditingCaptain(null);
    loadCaptainsData();
  };

  const handleToggleActive = async (captain) => {
    const newStatus = !captain.isActive;
    await updateCaptainStatus(captain._id || captain.id, newStatus);
    showToast(`Captain ${captain.name} ${newStatus ? 'Activated' : 'Suspended'}`);
    setOpenDropdownId(null);
    loadCaptainsData();
  };

  const handleViewHistory = async (captain) => {
    setHistoryCaptain(captain);
    setOpenDropdownId(null);
    const res = await getCaptainHistory(captain._id || captain.id);
    if (res?.data) setCaptainHistory(res.data);
  };

  const activeVerifiedCaptains = captains.filter(
    (c) => c.status === 'VERIFIED_APPROVED' || c.status === undefined
  );

  return (
    <div>
      {/* Top Action Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
          Onboard new captains into the roster. All dropdown choices consume dynamic <strong>Master Data</strong> (4-Tier Country &rarr; State &rarr; City &rarr; Zone).
        </span>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Link to="/master-data/locations" className="btn btn-secondary" style={{ fontSize: '12px', padding: '6px 12px' }}>
            <Globe size={14} /> Master Locations
          </Link>
          <button
            className="btn btn-primary"
            onClick={() => {
              setCurrentStep(1);
              setStepError('');
              loadMasterData();
              setIsAddModalOpen(true);
            }}
          >
            <Plus size={16} /> Onboard New Captain
          </button>
        </div>
      </div>

      {/* Table Listing */}
      <div className="table-card glass-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Captain Details</th>
              <th>Aadhar KYC (Masked)</th>
              <th>Vehicle Information</th>
              <th>Transmission</th>
              <th>4-Tier Location</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {activeVerifiedCaptains.map((c, index) => {
              const captainId = c._id || c.id;
              const isDropdownOpen = openDropdownId === captainId;
              const isDropUp = index > 0 && (index >= activeVerifiedCaptains.length - 2 || (index >= 1 && activeVerifiedCaptains.length <= 3));

              return (
                <tr key={captainId} style={{ position: 'relative', zIndex: isDropdownOpen ? 100 : 1 }}>
                  <td>
                    <div style={{ fontWeight: '700', color: 'var(--text-primary)' }}>{c.name}</div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>{c.phone}</div>
                  </td>
                  <td>
                    <span style={{ fontFamily: 'monospace', fontWeight: '700', color: 'var(--text-muted)', fontSize: '12px' }}>
                      {c.aadharNo ? `•••• •••• ${c.aadharNo.slice(-4)}` : '•••• •••• ••••'}
                    </span>
                  </td>
                  <td>
                    <div><strong>{c.vehicleBrand || 'Honda'} {c.vehicleModel || 'Activa'}</strong></div>
                  </td>
                  <td>
                    <span className={`badge ${c.isGear ? 'gear' : 'non-gear'}`}>
                      {c.isGear ? 'Gear' : 'Non-Gear'}
                    </span>
                  </td>
                  <td>
                    <div style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={13} color="#FFB800" />
                      <span>{c.zone || 'Anna Nagar'}, {c.city || 'Chennai'}, {c.country || 'India'}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${c.isActive !== false ? 'verified' : 'rejected'}`}>
                      {c.isActive !== false ? 'Active' : 'Suspended'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'center' }}>
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
                            <Eye size={14} color="#FF6600" /> View Full KYC Details
                          </button>

                          <button
                            className="dots-dropdown-item"
                            onClick={() => {
                              setEditingCaptain({ ...c });
                              setOpenDropdownId(null);
                            }}
                          >
                            <Edit size={14} color="#FFB800" /> Edit Captain Details
                          </button>

                          <button
                            className="dots-dropdown-item"
                            onClick={() => handleViewHistory(c)}
                          >
                            <History size={14} color="#A855F7" /> View Trip History
                          </button>

                          <button
                            className={`dots-dropdown-item ${c.isActive !== false ? 'danger' : 'success'}`}
                            onClick={() => handleToggleActive(c)}
                          >
                            {c.isActive !== false ? (
                              <><XCircle size={14} color="#EF4444" style={{ display: 'inline', marginRight: '6px' }} /> Suspend Account</>
                            ) : (
                              <><CheckCircle size={14} color="#22C55E" style={{ display: 'inline', marginRight: '6px' }} /> Activate Account</>
                            )}
                          </button>

                          <button
                            className="dots-dropdown-item danger"
                            onClick={() => {
                              setDeletingCaptain(c);
                              setOpenDropdownId(null);
                            }}
                          >
                            <Trash2 size={14} color="#EF4444" /> Delete Captain Record
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

      {/* Multi-Step Stepper Wizard Onboard Captain Modal */}
      {isAddModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '620px' }}>
            <div className="modal-header">
              <div className="modal-header-title">
                <div className="modal-header-icon"><Plus size={20} /></div>
                <h3>Onboard New Captain Wizard</h3>
              </div>
              <button className="close-btn" onClick={() => setIsAddModalOpen(false)}>
                <X size={18} />
              </button>
            </div>

            {/* Visual Stepper Progress Bar */}
            <div className="stepper-header">
              <div
                className={`stepper-step ${currentStep === 1 ? 'active' : currentStep > 1 ? 'completed' : ''}`}
                onClick={() => currentStep > 1 && setCurrentStep(1)}
              >
                <div className="stepper-circle">{currentStep > 1 ? '✓' : '1'}</div>
                <span className="stepper-title">Personal KYC</span>
              </div>
              <div className={`stepper-line ${currentStep > 1 ? 'active' : ''}`} />
              <div
                className={`stepper-step ${currentStep === 2 ? 'active' : currentStep > 2 ? 'completed' : ''}`}
                onClick={() => currentStep > 2 && setCurrentStep(2)}
              >
                <div className="stepper-circle">{currentStep > 2 ? '✓' : '2'}</div>
                <span className="stepper-title">Vehicle Specs</span>
              </div>
              <div className={`stepper-line ${currentStep > 2 ? 'active' : ''}`} />
              <div className={`stepper-step ${currentStep === 3 ? 'active' : ''}`}>
                <div className="stepper-circle">3</div>
                <span className="stepper-title">Location Zone</span>
              </div>
            </div>

            {stepError && (
              <div style={{ background: 'rgba(239, 68, 68, 0.15)', color: '#EF4444', padding: '8px 12px', borderRadius: '8px', marginBottom: '14px', fontSize: '12px' }}>
                <AlertTriangle size={13} style={{ display: 'inline', marginRight: '4px' }} />
                {stepError}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal & 12-Digit Aadhar KYC */}
              {currentStep === 1 && (
                <div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Full Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Rajesh Sharma"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 9876543210"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email Address *</label>
                      <input
                        type="email"
                        required
                        placeholder="captain@ridex.com"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                    <div className="form-group">
                      <label>Account Password *</label>
                      <input
                        type="password"
                        required
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Aadhar Card Number (Strictly 12 Numeric Digits) *</label>
                    <input
                      type="text"
                      required
                      maxLength={12}
                      placeholder="12 digit numeric Aadhar card no"
                      value={formData.aadharNo}
                      onChange={(e) => handleAadharChange(e.target.value)}
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Dynamic Master Vehicle Brands & Categories */}
              {currentStep === 2 && (
                <div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Vehicle Registration Number *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. TN 01 AB 1234"
                        value={formData.vehicleNo}
                        onChange={(e) => setFormData({ ...formData, vehicleNo: e.target.value.toUpperCase() })}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Vehicle Brand (From Master Data) *</label>
                      <select
                        value={formData.vehicleBrand}
                        onChange={(e) => setFormData({ ...formData, vehicleBrand: e.target.value })}
                      >
                        {masterBrands.map((b) => (
                          <option key={b} value={b}>{b}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Vehicle Model *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Activa 6G / Pulsar 150"
                        value={formData.vehicleModel}
                        onChange={(e) => setFormData({ ...formData, vehicleModel: e.target.value })}
                      />
                    </div>

                    <div className="form-group">
                      <label>Vehicle Category (From Master Data) *</label>
                      <select
                        value={formData.vehicleCategory}
                        onChange={(e) => setFormData({ ...formData, vehicleCategory: e.target.value })}
                      >
                        {masterCategories.map((cat) => (
                          <option key={cat} value={cat}>{cat}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Vehicle Transmission Type *</label>
                    <div className="radio-group">
                      <div
                        className={`radio-card ${!formData.isGear ? 'selected' : ''}`}
                        onClick={() => setFormData({ ...formData, isGear: false })}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Bike size={16} color="#FF6600" /> Non-Gear (Scooter / Automatic)
                        </span>
                      </div>
                      <div
                        className={`radio-card ${formData.isGear ? 'selected' : ''}`}
                        onClick={() => setFormData({ ...formData, isGear: true })}
                      >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <Car size={16} color="#FF6600" /> Gear (Manual Motorcycle / Car)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Dynamic 4-Tier Master Location (Country -> State -> City -> Zone) */}
              {currentStep === 3 && (
                <div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Country (Master Data) *</label>
                      <select value={formData.country} onChange={(e) => handleCountryChange(e.target.value)}>
                        {availableCountries.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>State (Master Data) *</label>
                      <select value={formData.state} onChange={(e) => handleStateChange(e.target.value)}>
                        {availableStates.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City (Master Data) *</label>
                      <select value={formData.city} onChange={(e) => handleCityChange(e.target.value)}>
                        {availableCities.map((ct) => (
                          <option key={ct} value={ct}>{ct}</option>
                        ))}
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Assigned Zone Name (Master Data) *</label>
                      <select value={formData.zone} onChange={(e) => setFormData({ ...formData, zone: e.target.value })}>
                        {availableZones.map((zn) => (
                          <option key={zn} value={zn}>{zn}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* Stepper Navigation Footer */}
              <div className="modal-footer">
                {currentStep > 1 ? (
                  <button type="button" className="btn btn-secondary" onClick={handlePrevStep}>
                    <ArrowLeft size={14} /> Back
                  </button>
                ) : (
                  <button type="button" className="btn btn-secondary" onClick={() => setIsAddModalOpen(false)}>
                    Cancel
                  </button>
                )}

                {currentStep < 3 ? (
                  <button type="button" className="btn btn-primary" onClick={handleNextStep}>
                    Next Step <ArrowRight size={14} />
                  </button>
                ) : (
                  <button type="submit" className="btn btn-success">
                    <CheckCircle size={14} /> Complete & Onboard Captain
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Captain Modal with 4-Tier Master Data Location */}
      {editingCaptain && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '620px' }}>
            <div className="modal-header">
              <div className="modal-header-title">
                <div className="modal-header-icon"><Edit size={20} /></div>
                <h3>Edit Captain Information</h3>
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
                  <label>12-Digit Aadhar Card No</label>
                  <input
                    type="text"
                    maxLength={12}
                    value={editingCaptain.aadharNo || ''}
                    onChange={(e) => handleAadharChange(e.target.value, true)}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Vehicle Number</label>
                  <input
                    type="text"
                    value={editingCaptain.vehicleNo || ''}
                    onChange={(e) => setEditingCaptain({ ...editingCaptain, vehicleNo: e.target.value.toUpperCase() })}
                  />
                </div>
                <div className="form-group">
                  <label>Vehicle Brand (Master Data)</label>
                  <select
                    value={editingCaptain.vehicleBrand || masterBrands[0]}
                    onChange={(e) => setEditingCaptain({ ...editingCaptain, vehicleBrand: e.target.value })}
                  >
                    {masterBrands.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 4-Tier Location Selectors in Edit Modal */}
              <div className="form-row">
                <div className="form-group">
                  <label>Country (Master Data)</label>
                  <select
                    value={editingCaptain.country || availableCountries[0]}
                    onChange={(e) => handleEditCountryChange(e.target.value)}
                  >
                    {availableCountries.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>State (Master Data)</label>
                  <select
                    value={editingCaptain.state}
                    onChange={(e) => handleEditStateChange(e.target.value)}
                  >
                    {(Object.keys(masterLocations[editingCaptain.country || 'India'] || {})).map((st) => (
                      <option key={st} value={st}>{st}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>City (Master Data)</label>
                  <select
                    value={editingCaptain.city}
                    onChange={(e) => handleEditCityChange(e.target.value)}
                  >
                    {(Object.keys(masterLocations[editingCaptain.country || 'India']?.[editingCaptain.state] || {})).map((ct) => (
                      <option key={ct} value={ct}>{ct}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Assigned Zone (Master Data)</label>
                  <select
                    value={editingCaptain.zone}
                    onChange={(e) => setEditingCaptain({ ...editingCaptain, zone: e.target.value })}
                  >
                    {(masterLocations[editingCaptain.country || 'India']?.[editingCaptain.state]?.[editingCaptain.city] || []).map((zn) => (
                      <option key={zn} value={zn}>{zn}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="form-footer modal-footer">
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

      {/* Redesigned View Modal */}
      {viewingKYC && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div className="modal-header-title">
                <div className="modal-header-icon"><Shield size={20} /></div>
                <h3>Captain Full KYC Profile</h3>
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
                    <span className="info-label">Full Name</span>
                    <div className="info-value">{viewingKYC.name}</div>
                  </div>
                  <div>
                    <span className="info-label">Mobile Number</span>
                    <div className="info-value">{viewingKYC.phone}</div>
                  </div>
                  <div>
                    <span className="info-label">Email Address</span>
                    <div className="info-value">{viewingKYC.email}</div>
                  </div>
                  <div>
                    <span className="info-label">12-Digit Unmasked Aadhar</span>
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
                  <Car size={14} /> Registered Fleet Vehicle
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
                    <span className="info-label">Category</span>
                    <div className="info-value">{viewingKYC.vehicleCategory || 'Bike'}</div>
                  </div>
                </div>
              </div>

              <div className="info-card-block">
                <div className="info-card-title">
                  <MapPin size={14} /> 4-Tier Location & Performance
                </div>
                <div className="info-grid-row">
                  <div>
                    <span className="info-label">Assigned Zone</span>
                    <div className="info-value">{viewingKYC.zone}, {viewingKYC.city}</div>
                  </div>
                  <div>
                    <span className="info-label">State & Country</span>
                    <div className="info-value">{viewingKYC.state}, {viewingKYC.country || 'India'}</div>
                  </div>
                  <div>
                    <span className="info-label">Rides Attended</span>
                    <div className="info-value">{viewingKYC.ridesAttended || 0} Rides</div>
                  </div>
                  <div>
                    <span className="info-label">Total Earnings</span>
                    <div className="info-value" style={{ color: '#22C55E' }}>₹{viewingKYC.totalEarnings || 0}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setViewingKYC(null)}>
                Close Modal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dedicated Trip History Modal */}
      {historyCaptain && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <div className="modal-header-title">
                <div className="modal-header-icon"><History size={20} /></div>
                <h3>Trip Logs: {historyCaptain.name}</h3>
              </div>
              <button className="close-btn" onClick={() => setHistoryCaptain(null)}>
                <X size={18} />
              </button>
            </div>
            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
              {captainHistory.length === 0 ? (
                <p style={{ padding: '20px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  No past trips logged yet.
                </p>
              ) : (
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Pickup Address</th>
                      <th>Destination</th>
                      <th>Fare</th>
                    </tr>
                  </thead>
                  <tbody>
                    {captainHistory.map((r, i) => (
                      <tr key={i}>
                        <td>{new Date(r.createdAt || Date.now()).toLocaleDateString()}</td>
                        <td>{r.pickupLocation?.address || 'Pickup Point'}</td>
                        <td>{r.dropoffLocation?.address || 'Dropoff Point'}</td>
                        <td><strong style={{ color: '#22C55E' }}>₹{r.fare}</strong></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setHistoryCaptain(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Popup Modal */}
      {deletingCaptain && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '420px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '14px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', marginBottom: '14px' }}>
              <Trash2 size={28} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Delete Captain Record</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 20px 0', lineHeight: '1.5' }}>
              Are you sure you want to permanently delete <strong>{deletingCaptain.name}</strong> from the system? This action cannot be undone.
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
                  showToast('Captain record deleted permanently!');
                  await loadCaptainsData();
                }}
              >
                Yes, Delete Record
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

export default CaptainCreation;
