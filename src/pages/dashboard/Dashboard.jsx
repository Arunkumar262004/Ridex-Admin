import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  CheckCircle,
  TrendingUp,
  ArrowRight,
  Plus,
  ChevronDown,
  Smile,
  Navigation,
  MapPin,
  Car,
  Users,
  IndianRupee,
  Eye,
  X,
} from 'lucide-react';
import { getStats } from '../../services/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [timeFilter, setTimeFilter] = useState('This month');
  const [selectedRideModal, setSelectedRideModal] = useState(null);

  const [stats, setStats] = useState({
    totalRevenue: 0,
    completedTrips: 0,
    activeRides: 0,
    pendingRequests: 0,
    totalCaptains: 0,
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async (filter = timeFilter) => {
    const res = await getStats(filter);
    if (res?.data) {
      setStats((prev) => ({ ...prev, ...res.data }));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header Action Bar (Taxi Operations Overview) */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', margin: '0 0 4px 0' }}>
            Ride Operations Dashboard
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
            Real-time monitoring for Ridex Captains, Active Rides, Bookings & Revenue.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'var(--bg-card-solid)',
              border: '1px solid var(--border-color)',
              padding: '6px 12px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '600',
              color: 'var(--text-primary)',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
            }}
          >
            <Calendar size={15} color="#FF6600" />
            <select
              value={timeFilter}
              onChange={(e) => {
                const selected = e.target.value;
                setTimeFilter(selected);
                loadStats(selected);
              }}
              style={{
                background: 'transparent',
                border: 'none',
                outline: 'none',
                color: 'var(--text-primary)',
                fontSize: '13px',
                fontWeight: '600',
                cursor: 'pointer',
                paddingRight: '4px',
              }}
            >
              <option value="This month" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)' }}>This month</option>
              <option value="Last month" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)' }}>Last month</option>
              <option value="Last 3 months" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)' }}>Last 3 months</option>
              <option value="Last Financial Year (FY 2025-26)" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)' }}>Last Financial Year (FY 2025-26)</option>
              <option value="Current Financial Year (FY 2026-27)" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)' }}>Current Financial Year (FY 2026-27)</option>
              <option value="This Year (Jan to Current Month)" style={{ background: 'var(--bg-input)', color: 'var(--text-primary)' }}>This Year (Jan to Current Month)</option>
            </select>
          </div>

          <button
            className="btn btn-primary"
            onClick={() => navigate('/captains/creation')}
            style={{
              padding: '9px 18px',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '700',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: '#FF6600',
              border: 'none',
              boxShadow: '0 4px 12px rgba(255, 102, 0, 0.3)',
            }}
          >
            <Plus size={16} /> Onboard New Captain
          </button>
        </div>
      </div>

      {/* Top 4 KPI Metric Cards (Fully Interactive Navigation to Respective Pages) */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '16px',
        }}
      >
        {/* Card 1: Active Ongoing Rides -> Navigates to Captain Live Map */}
        <div
          className="glass-card"
          onClick={() => navigate('/captains/zone-map')}
          style={{
            padding: '18px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          title="Click to view Live Captain Map"
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(239, 68, 68, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#EF4444',
                }}
              >
                <Navigation size={16} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                Active Ongoing Rides
              </span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
              {stats.activeRides || 0}
            </div>
          </div>
          <ArrowRight size={18} color="#FF6600" />
        </div>

        {/* Card 2: Pending Ride Requests -> Navigates to Onboard Queue */}
        <div
          className="glass-card"
          onClick={() => navigate('/captains/onboard-list')}
          style={{
            padding: '18px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          title="Click to view Onboard Verification Queue"
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(34, 197, 94, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#22C55E',
                }}
              >
                <Clock size={16} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                Pending Requests
              </span>
            </div>
            <div style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
              {stats.pendingRequests || 0}
            </div>
          </div>
          <ArrowRight size={18} color="#FF6600" />
        </div>

        {/* Card 3: Completed Rides Today -> Navigates to Captain List */}
        <div
          className="glass-card"
          onClick={() => navigate('/captains/creation')}
          style={{
            padding: '18px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          title="Click to view Captain Roster"
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(99, 102, 241, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6366F1',
                }}
              >
                <CheckCircle size={16} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                Completed Rides Today
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                {stats.completedTrips || 0}
              </span>
            </div>
          </div>
          <ArrowRight size={18} color="#FF6600" />
        </div>

        {/* Card 4: Fare Revenue Today -> Navigates to Vehicles & Pricing Fares */}
        <div
          className="glass-card"
          onClick={() => navigate('/vehicles')}
          style={{
            padding: '18px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer',
            transition: 'transform 0.2s, box-shadow 0.2s',
          }}
          title="Click to view Vehicles & Per-Km Fare Pricing"
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: 'rgba(34, 197, 94, 0.12)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#22C55E',
                }}
              >
                <IndianRupee size={16} />
              </div>
              <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>
                Today's Fare Revenue
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
              <span style={{ fontSize: '28px', fontWeight: '800', color: 'var(--text-primary)', letterSpacing: '-0.5px' }}>
                ₹{stats.totalRevenue ? stats.totalRevenue.toLocaleString() : '0'}
              </span>
            </div>
          </div>
          <ArrowRight size={18} color="#FF6600" />
        </div>
      </div>

      {/* Middle Grid Row: 3 Columns (Ride Volume Overview, Captain Duty Hours, Commission Revenue) */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1.2fr 1.2fr', gap: '18px' }}>
        {/* Column 1: Monthly Ride Volume Overview */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 16px 0' }}>
            Monthly Ride Volume & Captain Fulfillment
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '16px', alignItems: 'center' }}>
            {/* SVG Bar Chart with Ride Tooltip */}
            <div>
              <div style={{ position: 'relative', height: '150px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 8px' }}>
                <div
                  style={{
                    position: 'absolute',
                    top: '-6px',
                    right: '4px',
                    background: '#0F172A',
                    color: '#FFF',
                    fontSize: '11px',
                    fontWeight: '700',
                    padding: '4px 10px',
                    borderRadius: '6px',
                    whiteSpace: 'nowrap',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                  }}
                >
                  1,320 Rides Completed
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-5px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      width: 0,
                      height: 0,
                      borderLeft: '5px solid transparent',
                      borderRight: '5px solid transparent',
                      borderTop: '5px solid #0F172A',
                    }}
                  />
                </div>

                <div style={{ position: 'absolute', left: 0, right: 0, top: '10px', borderTop: '1px dashed var(--border-color)' }} />
                <div style={{ position: 'absolute', left: 0, right: 0, top: '50px', borderTop: '1px dashed var(--border-color)' }} />
                <div style={{ position: 'absolute', left: 0, right: 0, top: '90px', borderTop: '1px dashed var(--border-color)' }} />

                {[
                  { month: 'Jul', val: 35, bg: '#FED7AA' },
                  { month: 'Aug', val: 50, bg: '#FED7AA' },
                  { month: 'Sep', val: 40, bg: '#FED7AA' },
                  { month: 'Oct', val: 60, bg: '#FED7AA' },
                  { month: 'Nov', val: 45, bg: '#FED7AA' },
                  { month: 'Dec', val: 90, bg: '#FF6600' },
                ].map((item) => (
                  <div key={item.month} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 2, flex: 1 }}>
                    <div
                      style={{
                        width: '18px',
                        height: `${item.val}%`,
                        background: item.bg,
                        borderRadius: '4px 4px 0 0',
                        transition: 'height 0.3s',
                      }}
                    />
                  </div>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px 0 8px', fontSize: '11px', color: 'var(--text-muted)' }}>
                <span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
              </div>
            </div>

            {/* Gauge Semi-Circle Arc Meter */}
            <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '12px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
              <div style={{ position: 'relative', width: '110px', height: '60px', margin: '0 auto 8px auto' }}>
                <svg width="110" height="60" viewBox="0 0 100 50">
                  <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="var(--border-color)" strokeWidth="10" strokeLinecap="round" />
                  <path d="M 10 50 A 40 40 0 0 1 78 18" fill="none" stroke="#16A34A" strokeWidth="10" strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)', fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  70%
                </div>
              </div>
              <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: '0 0 12px 0', lineHeight: '1.4' }}>
                Captain fulfillment rate is 70% higher than last month.
              </p>
              <button
                className="btn btn-sm btn-secondary"
                onClick={() => navigate('/master-data/locations')}
                style={{ width: '100%', borderRadius: '8px', fontSize: '11.5px' }}
              >
                See Location Master
              </button>
            </div>
          </div>
        </div>

        {/* Column 2: Avg. Captain Duty Hours */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
            Avg. Captain Duty Hours
          </h3>

          <div style={{ textAlign: 'center', margin: '14px 0' }}>
            <div style={{ position: 'relative', width: '140px', height: '100px', margin: '0 auto' }}>
              <svg width="140" height="100" viewBox="0 0 120 80">
                <path d="M 15 75 A 45 45 0 1 1 105 75" fill="none" stroke="var(--border-color)" strokeWidth="12" strokeLinecap="round" />
                <path d="M 15 75 A 45 45 0 0 1 90 25" fill="none" stroke="#FF6600" strokeWidth="12" strokeLinecap="round" />
              </svg>
              <div style={{ position: 'absolute', top: '40px', left: '50%', transform: 'translateX(-50%)', textAlign: 'center' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(255, 102, 0, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 4px auto' }}>
                  <Smile size={18} color="#FF6600" />
                </div>
                <div style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>
                  10.5 hrs.
                </div>
              </div>
            </div>
            <p style={{ fontSize: '11.5px', color: 'var(--text-muted)', margin: '8px 0 0 0' }}>
              Avg. daily online hours per Captain
            </p>
          </div>
        </div>

        {/* Column 3: Daily Operational Commission Revenue */}
        <div className="glass-card" style={{ padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '22px', fontWeight: '800', color: '#FF6600', letterSpacing: '-0.5px' }}>
              ₹71,200
            </div>
            <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
              Today's Net Commission Revenue
            </span>
          </div>

          <div style={{ height: '110px', width: '100%', position: 'relative', marginTop: '10px' }}>
            <svg width="100%" height="100%" viewBox="0 0 200 80" preserveAspectRatio="none">
              <defs>
                <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#FF6600" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FF6600" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              <path
                d="M 0 60 Q 40 40 80 55 T 160 20 T 200 35 L 200 80 L 0 80 Z"
                fill="url(#costGrad)"
              />
              <path
                d="M 0 60 Q 40 40 80 55 T 160 20 T 200 35"
                fill="none"
                stroke="#FF6600"
                strokeWidth="2.5"
              />
              <circle cx="160" cy="20" r="4" fill="#FF6600" stroke="#FFF" strokeWidth="2" />
            </svg>
          </div>
        </div>
      </div>

      {/* Bottom Grid Row: Live Ride Requests Queue & Ride Completion Rates */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '18px' }}>
        {/* Column 1: Live Ride Requests Queue */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
              Live Ride Requests Queue
            </h3>
            <button
              onClick={() => navigate('/captains/onboard-list')}
              style={{ background: 'none', border: 'none', fontSize: '12px', fontWeight: '600', color: '#FF6600', cursor: 'pointer' }}
            >
              See all queue (52) &gt;
            </button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            {/* Ride Card 1: Kristin Watson */}
            <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#FDBA74', color: '#7C2D12', fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  KW
                </div>
                <div>
                  <strong style={{ fontSize: '13.5px', color: 'var(--text-primary)', display: 'block' }}>Kristin Watson</strong>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Bike Taxi (Honda Activa)</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={13} color="#FF6600" /> <strong>Pickup:</strong> Anna Nagar 2nd Avenue</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Navigation size={13} color="#22C55E" /> <strong>Drop:</strong> Chennai Central Railway Station</div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                <span className="badge" style={{ background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)', color: '#22C55E', fontWeight: '700' }}>₹180 Fare</span>
                <span className="badge" style={{ background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>5.2 km</span>
              </div>

              <button
                className="btn btn-sm btn-secondary"
                onClick={() => setSelectedRideModal({
                  riderName: 'Kristin Watson',
                  phone: '+91 9876543210',
                  pickup: 'Anna Nagar 2nd Avenue, Chennai',
                  drop: 'Chennai Central Railway Station',
                  fare: 180,
                  distance: '5.2 km',
                  vehicleType: 'Bike Taxi (Honda Activa)',
                  status: 'ASSIGNED_ONGOING',
                })}
                style={{ width: '100%', borderRadius: '8px', fontSize: '12px' }}
              >
                See ride details
              </button>
            </div>

            {/* Ride Card 2: Theresa Webb */}
            <div style={{ background: 'var(--bg-input)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#CBD5E1', color: '#334155', fontWeight: '700', fontSize: '13px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  TW
                </div>
                <div>
                  <strong style={{ fontSize: '13.5px', color: 'var(--text-primary)', display: 'block' }}>Theresa Webb</strong>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Cab Economy (Maruti Dzire)</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '11.5px', color: 'var(--text-muted)', marginBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={13} color="#FF6600" /> <strong>Pickup:</strong> OMR Tech Park, Perungudi</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Navigation size={13} color="#22C55E" /> <strong>Drop:</strong> Chennai International Airport</div>
              </div>

              <div style={{ display: 'flex', gap: '8px', marginBottom: '14px' }}>
                <span className="badge" style={{ background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)', color: '#22C55E', fontWeight: '700' }}>₹450 Fare</span>
                <span className="badge" style={{ background: 'var(--bg-card-solid)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}>14.8 km</span>
              </div>

              <button
                className="btn btn-sm btn-secondary"
                onClick={() => setSelectedRideModal({
                  riderName: 'Theresa Webb',
                  phone: '+91 9876543211',
                  pickup: 'OMR Tech Park, Perungudi',
                  drop: 'Chennai International Airport T1',
                  fare: 450,
                  distance: '14.8 km',
                  vehicleType: 'Cab Economy (Maruti Dzire)',
                  status: 'ASSIGNED_ONGOING',
                })}
                style={{ width: '100%', borderRadius: '8px', fontSize: '12px' }}
              >
                See ride details
              </button>
            </div>
          </div>
        </div>

        {/* Column 2: Ride Completion & Cancellation Rate */}
        <div className="glass-card" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <h3 style={{ fontSize: '15px', fontWeight: '700', color: 'var(--text-primary)', margin: 0 }}>
              Ride Completion & Cancellation Rate
            </h3>
            <button
              onClick={() => navigate('/vehicles')}
              style={{ background: 'none', border: 'none', fontSize: '12px', fontWeight: '600', color: '#FF6600', cursor: 'pointer' }}
            >
              See Vehicles & Pricing &gt;
            </button>
          </div>

          {/* Dual Semi-Circle Gauges */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            {/* Completion Gauge */}
            <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
              <div style={{ position: 'relative', width: '80px', height: '40px', margin: '0 auto 4px auto' }}>
                <svg width="80" height="40" viewBox="0 0 100 50">
                  <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="var(--border-color)" strokeWidth="10" strokeLinecap="round" />
                  <path d="M 10 50 A 40 40 0 0 1 80 20" fill="none" stroke="#FF6600" strokeWidth="10" strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', fontSize: '13px', fontWeight: '800', color: '#FF6600' }}>
                  75%
                </div>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.3', display: 'block' }}>
                Ride completion rate is 75% this month.
              </span>
            </div>

            {/* Cancellation Gauge */}
            <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: '10px', textAlign: 'center', border: '1px solid var(--border-color)' }}>
              <div style={{ position: 'relative', width: '80px', height: '40px', margin: '0 auto 4px auto' }}>
                <svg width="80" height="40" viewBox="0 0 100 50">
                  <path d="M 10 50 A 40 40 0 0 1 90 50" fill="none" stroke="var(--border-color)" strokeWidth="10" strokeLinecap="round" />
                  <path d="M 10 50 A 40 40 0 0 1 25 35" fill="none" stroke="#EF4444" strokeWidth="10" strokeLinecap="round" />
                </svg>
                <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', fontSize: '13px', fontWeight: '800', color: '#EF4444' }}>
                  10%
                </div>
              </div>
              <span style={{ fontSize: '11px', color: 'var(--text-muted)', lineHeight: '1.3', display: 'block' }}>
                Customer cancellation rate is below 10%.
              </span>
            </div>
          </div>

          {/* Dual Bar Comparison Chart */}
          <div style={{ position: 'relative', height: '110px', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', padding: '0 8px' }}>
            {[1, 4, 7, 10, 13, 16, 19, 22, 25, 28].map((day, idx) => {
              const compH = 30 + ((idx * 17) % 65);
              const cancH = 8 + ((idx * 7) % 20);
              return (
                <div key={day} style={{ display: 'flex', alignItems: 'flex-end', gap: '3px' }}>
                  <div style={{ width: '8px', height: `${compH}px`, background: '#E2E8F0', borderRadius: '2px 2px 0 0' }} />
                  <div style={{ width: '8px', height: `${cancH}px`, background: '#EF4444', borderRadius: '2px 2px 0 0' }} />
                </div>
              );
            })}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 8px 0 8px', fontSize: '10.5px', color: 'var(--text-muted)' }}>
            {[1, 4, 7, 10, 13, 16, 19, 22, 25, 28].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Ride Details Modal when clicking "See ride details" */}
      {selectedRideModal && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '440px' }}>
            <div className="modal-header">
              <div className="modal-header-title">
                <div className="modal-header-icon" style={{ background: 'rgba(255, 102, 0, 0.15)', color: '#FF6600' }}>
                  <Navigation size={18} />
                </div>
                <h3>Ride Request Details</h3>
              </div>
              <button className="close-btn" onClick={() => setSelectedRideModal(null)}>
                <X size={18} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', padding: '8px 0' }}>
              <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Rider / Customer</span>
                <strong style={{ fontSize: '14px', color: 'var(--text-primary)' }}>{selectedRideModal.riderName} ({selectedRideModal.phone})</strong>
              </div>

              <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Requested Vehicle Category</span>
                <strong style={{ fontSize: '13.5px', color: '#0284C7' }}>{selectedRideModal.vehicleType}</strong>
              </div>

              <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Pickup Location</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <MapPin size={16} color="#FF6600" />
                  <strong style={{ fontSize: '13.5px', color: 'var(--text-primary)' }}>{selectedRideModal.pickup}</strong>
                </div>
              </div>

              <div style={{ background: 'var(--bg-input)', padding: '12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Drop-off Location</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                  <Navigation size={16} color="#22C55E" />
                  <strong style={{ fontSize: '13.5px', color: 'var(--text-primary)' }}>{selectedRideModal.drop}</strong>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <div style={{ flex: 1, background: 'var(--bg-input)', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Estimated Fare</span>
                  <strong style={{ fontSize: '15px', color: '#22C55E' }}>₹{selectedRideModal.fare}</strong>
                </div>
                <div style={{ flex: 1, background: 'var(--bg-input)', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'block' }}>Distance</span>
                  <strong style={{ fontSize: '15px', color: 'var(--text-primary)' }}>{selectedRideModal.distance}</strong>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSelectedRideModal(null)}>
                Close
              </button>
              <button
                className="btn btn-primary"
                onClick={() => {
                  setSelectedRideModal(null);
                  navigate('/captains/zone-map');
                }}
              >
                View on Live Captain Map
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
