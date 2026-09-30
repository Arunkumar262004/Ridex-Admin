import React, { useState, useEffect } from 'react';
import { MapPin, Search, Phone, CheckCircle, Navigation, RefreshCw, X, Globe, Star } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { getMasterLocations, getCaptains } from '../../services/api';
import socketService from '../../services/socketService';

// Zone center coordinates (add more zones as needed)
const ZONE_COORDINATES = {
  // Chennai zones
  'Anna Nagar': [13.1666, 80.2166],
  'Thiruvanmiyur': [12.9843, 80.2521],
  'Velachery': [12.9689, 80.2213],
  'Tambaram': [12.9226, 80.1412],
  'OMR': [12.8397, 80.2263],
  'Adyar': [13.0064, 80.2447],
  'Chetpet': [13.0602, 80.2292],
  'Nungambakkam': [13.0462, 80.2393],

  // Bangalore zones
  'Koramangala': [12.9352, 77.6245],
  'Bangalore': [12.9716, 77.5946],
  'Indiranagar': [13.0012, 77.6399],
  'Whitefield': [12.9698, 77.7499],
  'MG Road': [12.9352, 77.5987],
  'Jayanagar': [12.9352, 77.5945],
  'Marathahalli': [12.9698, 77.7068],

  // Coimbatore zones
  'RS Puram': [11.0226, 76.9605],
  'Peelamedu': [11.0479, 76.9739],
  'Race Course': [11.0081, 76.9456],
  'Saibaba Colony': [10.9909, 76.9419],
  'Town Hall': [11.0081, 76.9364],

  // Hyderabad zones
  'Jubilee Hills': [17.3850, 78.4867],
  'Banjara Hills': [17.3842, 78.4644],
  'Madhapur': [17.3591, 78.5488],
  'Kondapur': [17.4520, 78.3625],
  'Gachibowli': [17.4409, 78.3494],

  // Delhi zones
  'Connaught Place': [28.6273, 77.1790],
  'South Delhi': [28.5244, 77.1855],
  'Dwarka': [28.5921, 77.0460],
  'Noida': [28.5355, 77.3910],

  // Mumbai zones
  'Bandra': [19.0760, 72.8295],
  'Andheri': [19.1136, 72.8697],
  'Thane': [19.2183, 72.9781],
  'Navi Mumbai': [19.0330, 73.0297],
};

// Create custom marker icon
const createCustomMarkerIcon = (status) => {
  const colors = {
    'Available': '#22C55E',
    'On Ride': '#FF6347',
    'Busy': '#FFB800',
    'Offline': '#94A3B8',
  };

  const color = colors[status] || colors['Offline'];

  return L.divIcon({
    html: `
      <div style="
        background: ${color};
        color: white;
        border-radius: 50%;
        width: 32px;
        height: 32px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 3px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
        font-weight: bold;
        font-size: 12px;
      ">
        📍
      </div>
    `,
    className: 'custom-marker',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Map update component
const MapUpdater = ({ zone, city, state, country }) => {
  const map = useMap();

  useEffect(() => {
    // Invalidate size to ensure map fills the container
    setTimeout(() => {
      map.invalidateSize();
    }, 100);

    const coords = ZONE_COORDINATES[zone];
    if (coords) {
      map.flyTo(coords, 14, { duration: 0.5 });
    }
  }, [zone, map]);

  useEffect(() => {
    // Also invalidate on window resize
    const handleResize = () => map.invalidateSize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [map]);

  return null;
};

const CaptainZoneMap = () => {
  const [masterLocations, setMasterLocations] = useState({});
  const [captainPins, setCaptainPins] = useState([]);
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
    loadCaptains();
    initializeSocket();
  }, []);

  const initializeSocket = async () => {
    try {
      await socketService.connect();
      console.log('🗺️ Socket connected for Captain Map');

      // Listen for real-time captain location updates
      socketService.on('captain:location_update', (data) => {
        console.log('📍 Captain location update:', data);
        setCaptainPins((prevPins) =>
          prevPins.map((pin) =>
            pin.id === data.captainId || pin.id === data.id
              ? { ...pin, lat: data.lat, lng: data.lng, status: data.status || pin.status }
              : pin
          )
        );
      });

      // Listen for captain status changes
      socketService.on('captain:status_changed', (data) => {
        console.log('🔄 Captain status changed:', data);
        setCaptainPins((prevPins) =>
          prevPins.map((pin) =>
            pin.id === data.captainId || pin.id === data.id
              ? { ...pin, status: data.status }
              : pin
          )
        );
      });

      // Cleanup on disconnect
      socketService.on('disconnected', () => {
        console.log('❌ Socket disconnected - will auto-reconnect');
      });
    } catch (error) {
      console.warn('Socket connection failed, using stored captain data:', error);
    }
  };

  const loadCaptains = async () => {
    const res = await getCaptains();
    if (res?.success && Array.isArray(res.data)) {
      const pins = res.data.map((c) => {
        // Use real location from captain data, or zone center as fallback
        const zoneCoords = ZONE_COORDINATES[c.zone] || ZONE_COORDINATES['Anna Nagar'];
        const lat = c.lastLocation?.lat || zoneCoords[0];
        const lng = c.lastLocation?.lng || zoneCoords[1];

        return {
          id: c._id || c.id,
          name: c.name || 'Captain',
          phone: c.phone || 'N/A',
          vehicle: `${c.vehicleBrand || 'Vehicle'} ${c.vehicleModel || ''} (${c.vehicleNo || 'Registered'})`,
          country: c.country || 'India',
          state: c.state || 'Tamil Nadu',
          city: c.city || 'Chennai',
          zone: c.zone || 'Anna Nagar',
          // Map actual status from backend, or infer from isActive
          status: c.status === 'ON_RIDE' ? 'On Ride' : c.status === 'BUSY' ? 'Busy' : c.isActive ? 'Available' : 'Offline',
          lat,
          lng,
          battery: c.battery || '95%',
          rating: c.rating || '4.8',
        };
      });
      setCaptainPins(pins);
    }
  };

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

  const filteredCaptains = captainPins.filter((c) => {
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
            <Globe size={16} color="#FF6347" />
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
        <div className="glass-card" style={{ padding: '0', overflow: 'hidden', position: 'relative', height: '500px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ flex: 1, position: 'relative', width: '100%', minHeight: 0 }}>
            <MapContainer
              center={ZONE_COORDINATES[selectedZone] || ZONE_COORDINATES['Anna Nagar']}
              zoom={14}
              className="map-container"
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapUpdater zone={selectedZone} city={selectedCity} state={selectedState} country={selectedCountry} />

              {filteredCaptains.map((c) => (
                <Marker
                  key={c.id}
                  position={[c.lat, c.lng]}
                  icon={createCustomMarkerIcon(c.status)}
                  eventHandlers={{
                    click: () => setSelectedPin(c),
                  }}
                >
                  <Popup>
                    <div style={{ fontSize: '12px' }}>
                      <strong>{c.name}</strong>
                      <p style={{ margin: '4px 0', color: c.status === 'Available' ? '#22C55E' : '#FF6347' }}>
                        {c.status}
                      </p>
                      <p style={{ margin: '4px 0', fontSize: '11px' }}>{c.vehicle}</p>
                      <p style={{ margin: '4px 0', fontSize: '11px' }}>{c.phone}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

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
                  zIndex: 1000,
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
                    <span style={{ color: c.status === 'Available' ? '#22C55E' : '#FF6347', fontWeight: '700' }}>{c.status}</span>
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
