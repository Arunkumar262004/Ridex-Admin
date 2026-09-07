import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Sun,
  Moon,
  Bell,
  Maximize,
  LogOut,
  ChevronDown,
  Key,
  User,
  X,
  CheckCircle,
  LayoutDashboard,
  MapPin,
  UserPlus,
  UserCheck,
  Car,
  Users,
  Globe,
  Layers,
  ArrowRight,
} from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

const SEARCHABLE_ROUTES = [
  { title: 'Dashboard', path: '/', category: 'Main Menu', icon: LayoutDashboard },
  { title: 'Captain Live Map', path: '/captains/zone-map', category: 'Main Menu', icon: MapPin },
  { title: 'Create Captain', path: '/captains/creation', category: 'Captains', icon: UserPlus },
  { title: 'Onboard Queue (KYC)', path: '/captains/onboard-list', category: 'Captains', icon: UserCheck },
  { title: 'Vehicles & Pricing', path: '/vehicles', category: 'Fleet & Riders', icon: Car },
  { title: 'Customers', path: '/customers', category: 'Fleet & Riders', icon: Users },
  { title: 'Master Data — Location Hierarchy', path: '/master-data/locations', category: 'Master Data', icon: Globe },
  { title: 'Master Data — Vehicle Brands', path: '/master-data/brands', category: 'Master Data', icon: Car },
  { title: 'Master Data — Vehicle Categories', path: '/master-data/categories', category: 'Master Data', icon: Layers },
  { title: 'Admin Profile & Security', path: '/profile', category: 'Security & Account', icon: User },
  { title: 'Change Account Password', path: '/change-password', category: 'Security & Account', icon: Key },
];

const Header = ({ title }) => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [confirmLogoutOpen, setConfirmLogoutOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Global Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchContainerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.header-profile-menu-container')) {
        setIsProfileMenuOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  const filteredRoutes = SEARCHABLE_ROUTES.filter((r) =>
    r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    r.path.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectRoute = (path) => {
    navigate(path);
    setSearchQuery('');
    setIsSearchOpen(false);
  };

  return (
    <header className="top-header">
      <div className="header-title-box">
        <h1>{title}</h1>
        <p>Welcome back, Admin! Here's what's happening today.</p>
      </div>

      {/* Global Interactive Route Search Bar */}
      <div className="header-search" ref={searchContainerRef} style={{ position: 'relative', width: '280px' }}>
        <Search size={15} className="header-search-icon" />
        <input
          type="text"
          placeholder="Search routes or features..."
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            setIsSearchOpen(true);
          }}
          onFocus={() => setIsSearchOpen(true)}
          style={{ width: '100%' }}
        />
        {searchQuery && (
          <X
            size={14}
            style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', color: 'var(--text-muted)' }}
            onClick={() => setSearchQuery('')}
          />
        )}

        {/* Global Search Results Dropdown Menu */}
        {isSearchOpen && (
          <div
            style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              left: 0,
              right: 0,
              width: '320px',
              maxHeight: '360px',
              overflowY: 'auto',
              background: 'var(--bg-card-solid)',
              border: '1px solid var(--border-color)',
              borderRadius: '12px',
              boxShadow: '0 12px 30px rgba(0, 0, 0, 0.35)',
              zIndex: 2000,
              padding: '6px',
            }}
          >
            <div style={{ padding: '6px 10px', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px' }}>
              Quick Navigation Menu ({filteredRoutes.length})
            </div>

            {filteredRoutes.length === 0 ? (
              <div style={{ padding: '12px', fontSize: '12.5px', color: 'var(--text-muted)', textAlign: 'center' }}>
                No routes matching "{searchQuery}"
              </div>
            ) : (
              filteredRoutes.map((route) => {
                const IconComponent = route.icon;
                return (
                  <button
                    key={route.path}
                    type="button"
                    onClick={() => handleSelectRoute(route.path)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      padding: '9px 10px',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-input)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '8px',
                          background: 'rgba(255, 102, 0, 0.12)',
                          color: '#FF6600',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <IconComponent size={15} />
                      </div>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-primary)' }}>
                          {route.title}
                        </div>
                        <span style={{ fontSize: '10.5px', color: 'var(--text-muted)' }}>
                          {route.category} • {route.path}
                        </span>
                      </div>
                    </div>
                    <ArrowRight size={14} color="#FF6600" />
                  </button>
                );
              })
            )}
          </div>
        )}
      </div>

      <div className="header-actions">
        {/* Dark / Light Theme Mode Toggle */}
        <button
          className="icon-btn"
          onClick={toggleTheme}
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? <Sun size={18} color="#FFB800" /> : <Moon size={18} color="#FF6600" />}
        </button>

        {/* Notifications Icon */}
        <button className="icon-btn" title="12 New Notifications">
          <Bell size={18} />
          <span className="badge-dot" />
        </button>

        {/* Fullscreen Toggle */}
        <button className="icon-btn" onClick={toggleFullscreen} title="Toggle Fullscreen">
          <Maximize size={18} />
        </button>

        {/* Admin Profile Dropdown Menu */}
        <div className="header-profile-menu-container" style={{ position: 'relative' }}>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsProfileMenuOpen(!isProfileMenuOpen);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'var(--bg-card-solid)',
              border: '1px solid var(--border-color)',
              padding: '4px 10px 4px 6px',
              borderRadius: '20px',
              cursor: 'pointer',
              color: 'var(--text-primary)',
            }}
          >
            <div
              style={{
                width: '28px',
                height: '28px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #FF6600, #FF8800)',
                color: '#FFF',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '12px',
                boxShadow: '0 2px 8px rgba(255, 102, 0, 0.35)',
              }}
            >
              A
            </div>
            <span style={{ fontSize: '13px', fontWeight: '600' }}>Admin</span>
            <ChevronDown size={14} color="var(--text-muted)" />
          </button>

          {isProfileMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                background: 'var(--bg-card-solid)',
                border: '1px solid var(--border-color)',
                borderRadius: '12px',
                boxShadow: 'var(--shadow-card)',
                width: '210px',
                padding: '6px 0',
                zIndex: 1000,
              }}
            >
              <div style={{ padding: '8px 16px 10px 16px', borderBottom: '1px solid var(--border-color)' }}>
                <strong style={{ fontSize: '13px', display: 'block', color: 'var(--text-primary)' }}>Ridex Super Admin</strong>
                <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>admin@ridex.com</span>
              </div>

              {/* Dedicated Page Link: Profile Info */}
              <button
                type="button"
                style={{
                  width: '100%',
                  padding: '9px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  navigate('/profile');
                }}
              >
                <User size={14} color="#FF6600" />
                <span>Profile Info</span>
              </button>

              {/* Dedicated Page Link: Change Password */}
              <button
                type="button"
                style={{
                  width: '100%',
                  padding: '9px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--text-primary)',
                  fontSize: '12.5px',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  navigate('/change-password');
                }}
              >
                <Key size={14} color="#FFB800" />
                <span>Change Password</span>
              </button>

              <div style={{ borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />

              <button
                type="button"
                style={{
                  width: '100%',
                  padding: '9px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'transparent',
                  border: 'none',
                  color: '#EF4444',
                  fontSize: '12.5px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
                onClick={() => {
                  setIsProfileMenuOpen(false);
                  setConfirmLogoutOpen(true);
                }}
              >
                <LogOut size={14} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Styled Logout Confirmation Popup Modal */}
      {confirmLogoutOpen && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '14px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', marginBottom: '14px' }}>
              <LogOut size={24} />
            </div>
            <h3 style={{ fontSize: '17px', fontWeight: '700', margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Logout Confirmation</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 20px 0' }}>
              Are you sure you want to log out of Ridex Admin Portal?
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setConfirmLogoutOpen(false)}>
                Cancel
              </button>
              <button
                className="btn btn-danger"
                style={{ flex: 1 }}
                onClick={() => {
                  localStorage.removeItem('ridex_admin_token');
                  window.location.href = '/login';
                }}
              >
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast success">
            <CheckCircle size={16} /> {toastMessage}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
