import React, { useState, useEffect } from 'react';
import { MapPin, Search, Phone, CheckCircle, Navigation, RefreshCw, X, Globe, Star } from 'lucide-react';
import { getMasterLocations } from '../../services/api';

const CAPTAIN_PINS = [
  { id: 'p1', name: 'Suresh Kumar', phone: '+91 9876543210', vehicle: 'Honda Activa (Non-Gear)', country: 'India', state: 'Tamil Nadu', city: 'Chennai', zone: 'Anna Nagar', status: 'Available', lat: 35, lng: 42, battery: '92%', rating: '4.9' },
  { id: 'p2', name: 'Ramesh Patel', phone: '+91 9876543211', vehicle: 'Hero Splendor (Gear)', country: 'India', state: 'Tamil Nadu', city: 'Chennai', zone: 'Anna Nagar', status: 'On Ride', lat: 55, lng: 60, battery: '85%', rating: '4.8' },
  { id: 'p3', name: 'Anand Sharma', phone: '+91 9876543212', vehicle: 'TVS Jupiter (Non-Gear)', country: 'India', state: 'Tamil Nadu', city: 'Chennai', zone: 'Anna Nagar', status: 'Available', lat: 25, lng: 70, battery: '78%', rating: '4.7' },
  { id: 'p4', name: 'Dinesh Kumar', phone: '+91 9876543213', vehicle: 'Bajaj Pulsar (Gear)', country: 'India', state: 'Tamil Nadu', city: 'Chennai', zone: 'Anna Nagar', status: 'Busy', lat: 70, lng: 30, battery: '95%', rating: '4.9' },
  { id: 'p5', name: 'Vikram Singh', phone: '+91 9123456780', vehicle: 'Honda Shine (Gear)', country: 'India', state: 'Maharashtra', city: 'Mumbai', zone: 'Bandra West', status: 'Available', lat: 40, lng: 50, battery: '88%', rating: '4.8' },
];

const CaptainZoneMap = () => {
  const [masterLocations, setMasterLocations] = useState({});
  const [selectedCountry, setSelectedCountry] = useState('India');
  const [selectedState, setSelectedState] = useState('Tamil Nadu');
  const [selectedCity, setSelectedCity] = useState('Chennai');
  const [selectedZone, setSelectedZone] = useState('Anna Nagar');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('Overview');
  const [selectedPin, setSelectedPin] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    loadMasterLocations();
  }, []);

  const loadMasterLocations = async () => {
    const locs = await getMasterLocations();
    setMasterLocations(locs);
    const firstCountry = Object.keys(locs)[0] || 'India';
    const firstState = Object.keys(locs[firstCountry] || {})[0] || 'Tamil Nadu';
    const firstCity = Object.keys(locs[firstCountry]?.[firstState] || {})[0] || 'Chennai';
    const firstZone = locs[firstCountry]?.[firstState]?.[firstCity]?.[0] || 'Anna Nagar';

    setSelectedCountry(firstCountry);
    setSelectedState(firstState);
    setSelectedCity(firstCity);
    setSelectedZone(firstZone);
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // 4-Tier Cascading Selectors for Map Filter Bar
  const availableCountries = Object.keys(masterLocations);
  const availableStates = Object.keys(masterLocations[selectedCountry] || {});
  const availableCities = Object.keys(masterLocations[selectedCountry]?.[selectedState] || {});
  const availableZones = masterLocations[selectedCountry]?.[selectedState]?.[selectedCity] || [];

  const handleCountryChange = (e) => {
    const newCountry = e.target.value;
    setSelectedCountry(newCountry);

    const states = Object.keys(masterLocations[newCountry] || {});
    const firstState = states[0] || '';
    setSelectedState(firstState);

    const cities = Object.keys(masterLocations[newCountry]?.[firstState] || {});
    const firstCity = cities[0] || '';
    setSelectedCity(firstCity);

    const zones = masterLocations[newCountry]?.[firstState]?.[firstCity] || [];
    setSelectedZone(zones[0] || '');
  };

  const handleStateChange = (e) => {
    const newState = e.target.value;
    setSelectedState(newState);

    const cities = Object.keys(masterLocations[selectedCountry]?.[newState] || {});
    const firstCity = cities[0] || '';
    setSelectedCity(firstCity);

    const zones = masterLocations[selectedCountry]?.[newState]?.[firstCity] || [];
    setSelectedZone(zones[0] || '');
  };

  const handleCityChange = (e) => {
    const newCity = e.target.value;
    setSelectedCity(newCity);

    const zones = masterLocations[selectedCountry]?.[selectedState]?.[newCity] || [];
    setSelectedZone(zones[0] || '');
  };

  const filteredCaptains = CAPTAIN_PINS.filter((c) => {
    const matchesLocation =
      (c.country === selectedCountry || !c.country) &&
      c.state === selectedState &&
      c.city === selectedCity &&
      c.zone === selectedZone;
    const matchesStatus = statusFilter === 'All' || c.status === statusFilter;
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.vehicle.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesLocation && matchesStatus && matchesSearch;
  });

  return (
    <div>
      {/* 4-Tier Dynamic Master Location Filter Bar (Country -> State -> City -> Zone) */}
      <div className="glass-card" style={{ padding: '14px 18px', marginBottom: '18px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginRight: '4px' }}>
            <Globe size={16} color="#FF6600" />
            <span style={{ fontSize: '11.5px', fontWeight: '700', color: 'var(--text-muted)' }}>4-TIER LOCATION FILTER:</span>
          </div>

          {/* Country Selector */}
          <div style={{ flex: '1 1 130px' }}>
            <select className="select-sm" style={{ width: '100%', padding: '7px 10px' }} value={selectedCountry} onChange={handleCountryChange}>
              {availableCountries.map((cnt) => (
                <option key={cnt} value={cnt}>{cnt}</option>
              ))}
            </select>
          </div>

          {/* State Selector */}
          <div style={{ flex: '1 1 130px' }}>
            <select className="select-sm" style={{ width: '100%', padding: '7px 10px' }} value={selectedState} onChange={handleStateChange}>
              {availableStates.map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* City Selector */}
          <div style={{ flex: '1 1 130px' }}>
            <select className="select-sm" style={{ width: '100%', padding: '7px 10px' }} value={selectedCity} onChange={handleCityChange}>
              {availableCities.map((ct) => (
                <option key={ct} value={ct}>{ct}</option>
              ))}
            </select>
          </div>

          {/* Zone Selector */}
          <div style={{ flex: '1 1 130px' }}>
            <select className="select-sm" style={{ width: '100%', padding: '7px 10px' }} value={selectedZone} onChange={(e) => setSelectedZone(e.target.value)}>
              {availableZones.map((zn) => (
                <option key={zn} value={zn}>{zn}</option>
              ))}
            </select>
          </div>

          <div style={{ position: 'relative', flex: '1 1 160px' }}>
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              placeholder="Search Captain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '7px 10px 7px 32px', background: 'var(--bg-input)', border: '1px solid var(--border-color)', borderRadius: '8px', color: 'var(--text-primary)', fontSize: '12.5px' }}
            />
          </div>

          <button className="btn btn-sm btn-secondary" onClick={() => showToast('Zone map refreshed')}>
            <RefreshCw size={13} /> Refresh Map
          </button>
        </div>

        {/* Status Filter Pills */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', paddingTop: '10px', borderTop: '1px solid var(--border-color)', flexWrap: 'wrap' }}>
          {['All', 'Available', 'On Ride', 'Busy', 'Offline'].map((st) => (
            <button
              key={st}
              className={`btn btn-sm ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
              style={{ borderRadius: '16px', padding: '4px 12px' }}
              onClick={() => setStatusFilter(st)}
            >
              {st === 'Available' && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#22C55E', display: 'inline-block', marginRight: '6px' }} />}
              {st === 'On Ride' && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#0284C7', display: 'inline-block', marginRight: '6px' }} />}
              {st === 'Busy' && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#EAB308', display: 'inline-block', marginRight: '6px' }} />}
              {st === 'Offline' && <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#94A3B8', display: 'inline-block', marginRight: '6px' }} />}
              {st}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Map & Right Panels */}
      <div style={{ display: 'grid', gridTemplateColumns: '2.4fr 1fr', gap: '18px' }}>
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden', position: 'relative', minHeight: '480px', display: 'flex', flexDirection: 'column' }}>
          
          <div style={{ flex: 1, position: 'relative', background: '#1E293B', minHeight: '360px' }}>
            <svg width="100%" height="100%" style={{ position: 'absolute', inset: 0 }}>
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              <path d="M 0 100 Q 250 150 500 80 T 1000 200" fill="none" stroke="rgba(2, 132, 199, 0.2)" strokeWidth="18" />
            </svg>

            {filteredCaptains.map((c) => (
              <div
                key={c.id}
                onClick={() => setSelectedPin(c)}
                style={{
                  position: 'absolute',
                  top: `${c.lat}%`,
                  left: `${c.lng}%`,
                  transform: 'translate(-50%, -50%)',
                  cursor: 'pointer',
                  zIndex: 10,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    background: c.status === 'Available' ? '#22C55E' : c.status === 'On Ride' ? '#FF6600' : '#FFB800',
                    color: '#FFF',
                    padding: '3px 8px',
                    borderRadius: '10px',
                    fontSize: '11px',
                    fontWeight: '800',
                    boxShadow: '0 4px 10px rgba(0,0,0,0.3)',
                    whiteSpace: 'nowrap',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <Navigation size={9} />
                  {c.name} ({c.status})
                </div>
                <div
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: c.status === 'Available' ? '#22C55E' : c.status === 'On Ride' ? '#FF6600' : '#FFB800',
                    border: '2px solid #FFF',
                    marginTop: '2px',
                  }}
                />
              </div>
            ))}

            {selectedPin && (
              <div
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: 'var(--bg-card-solid)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '12px',
                  padding: '14px',
                  boxShadow: 'var(--shadow-card)',
                  width: '240px',
                  zIndex: 20,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <strong style={{ fontSize: '14px' }}>{selectedPin.name}</strong>
                  <button className="close-btn" onClick={() => setSelectedPin(null)}><X size={15} /></button>
                </div>
                <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '4px' }}>{selectedPin.vehicle}</p>
                <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '10px' }}>Contact: {selectedPin.phone}</p>
                <button
                  className="btn btn-sm btn-primary"
                  style={{ width: '100%' }}
                  onClick={() => {
                    showToast(`Alert sent to ${selectedPin.name}`);
                    setSelectedPin(null);
                  }}
                >
                  <Phone size={12} /> Contact Captain
                </button>
              </div>
            )}
          </div>

          <div style={{ background: 'var(--bg-card-solid)', padding: '14px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
              <div style={{ display: 'flex', gap: '6px' }}>
                {['Overview', 'Routes', 'Alerts'].map((tab) => (
                  <button
                    key={tab}
                    className={`btn btn-sm ${activeTab === tab ? 'btn-primary' : 'btn-secondary'}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                  </button>
                ))}
              </div>
              <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                Location: <strong style={{ color: 'var(--text-primary)' }}>{selectedZone}, {selectedCity}, {selectedCountry}</strong> ({filteredCaptains.length} Active)
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
              {filteredCaptains.map((c) => (
                <div key={c.id} style={{ background: 'var(--bg-input)', padding: '8px 10px', borderRadius: '8px', fontSize: '11.5px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <strong>{c.name}</strong>
                    <span style={{ color: c.status === 'Available' ? '#22C55E' : '#FF6600', fontWeight: '700' }}>{c.status}</span>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '10.5px' }}>{c.vehicle}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Panel */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
          <div className="glass-card" style={{ padding: '16px' }}>
            <h4 style={{ fontSize: '13px', marginBottom: '10px' }}>Daily Ride Volume Grid</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '4px' }}>
              {Array.from({ length: 28 }).map((_, idx) => {
                const opacity = 0.2 + ((idx * 37) % 100 / 100) * 0.8;
                return (
                  <div
                    key={idx}
                    style={{ height: '20px', borderRadius: '3px', background: `rgba(2, 132, 199, ${opacity})` }}
                  />
                );
              })}
            </div>
          </div>

          <div className="glass-card" style={{ padding: '16px' }}>
            <h4 style={{ fontSize: '13px', marginBottom: '12px' }}>Zone Issue Management</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                <span>Unassigned Requests</span><strong style={{ color: '#EF4444' }}>12</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                <span>High Pickup Delays</span><strong style={{ color: '#FFB800' }}>8</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                <span>Cancelled Rides</span><strong style={{ color: '#EF4444' }}>15</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12.5px' }}>
                <span>Customer Complaints</span><strong style={{ color: '#A855F7' }}>4</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

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

export default CaptainZoneMap;
