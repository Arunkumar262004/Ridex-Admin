import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, MapPin, UserCheck, UserPlus, Car, Users, ChevronDown, ChevronRight, Menu, Database, Globe, Layers } from 'lucide-react';
import ridexLogo from '../../assets/logo/Ridexadmin.png';

const Sidebar = ({ isCollapsed, onToggleSidebar }) => {
  const [isCaptainAccordionOpen, setIsCaptainAccordionOpen] = useState(true);
  const [isMasterAccordionOpen, setIsMasterAccordionOpen] = useState(true);

  return (
    <aside className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
      {/* Brand Header */}
      <div className="brand">
        <div className="brand-left">
          <div className="logo-box" style={{ background: '#FFFFFF', padding: '3px', border: '1px solid rgba(255, 102, 0, 0.3)', boxShadow: '0 4px 12px rgba(255, 102, 0, 0.25)' }}>
            <img src={ridexLogo} alt="Ridex Admin Logo" style={{ width: '100%', height: '100%', objectFit: 'contain', borderRadius: '6px' }} />
          </div>
          <h2 className="brand-text">
            Ride<span>x</span> <span style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px', opacity: 0.6, marginLeft: '3px' }}>Admin</span>
          </h2>
        </div>
        
        <button
          type="button"
          className="sidebar-toggle-btn"
          onClick={onToggleSidebar}
          title={isCollapsed ? 'Expand Menu' : 'Collapse Menu'}
        >
          <Menu size={18} />
        </button>
      </div>

      <nav className="nav-menu">
        <div className="nav-group-title">Main Menu</div>

        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div className="nav-item-content">
            <LayoutDashboard size={18} />
            <span className="nav-text">Dashboard</span>
          </div>
        </NavLink>

        <NavLink to="/captains/zone-map" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div className="nav-item-content">
            <MapPin size={18} />
            <span className="nav-text">Captain Map</span>
          </div>
        </NavLink>

        {/* Accordion Captains Sub-Menu */}
        <div>
          <button
            type="button"
            className="nav-item"
            onClick={() => !isCollapsed && setIsCaptainAccordionOpen(!isCaptainAccordionOpen)}
          >
            <div className="nav-item-content">
              <UserCheck size={18} />
              <span className="nav-text">Captains</span>
            </div>
            <span className="chevron-icon">
              {isCaptainAccordionOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
            </span>
          </button>

          {!isCollapsed && isCaptainAccordionOpen && (
            <div className="accordion-sub-container">
              <NavLink
                to="/captains/creation"
                className={({ isActive }) => `nav-item nav-sub-item ${isActive ? 'active' : ''}`}
              >
                <div className="nav-item-content">
                  <UserPlus size={15} />
                  <span className="nav-text">Create Captain</span>
                </div>
              </NavLink>

              <NavLink
                to="/captains/onboard-list"
                className={({ isActive }) => `nav-item nav-sub-item ${isActive ? 'active' : ''}`}
              >
                <div className="nav-item-content">
                  <UserCheck size={15} />
                  <span className="nav-text">Onboard Queue</span>
                </div>
                <span className="nav-badge">KYC</span>
              </NavLink>
            </div>
          )}
        </div>

        <div className="nav-group-title">Fleet & Riders</div>

        <NavLink to="/vehicles" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div className="nav-item-content">
            <Car size={18} />
            <span className="nav-text">Vehicles & Pricing</span>
          </div>
        </NavLink>

        <NavLink to="/customers" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <div className="nav-item-content">
            <Users size={18} />
            <span className="nav-text">Customers</span>
          </div>
        </NavLink>

        {/* SYSTEM & MASTERS */}
        <div className="nav-group-title">System & Masters</div>

        <div>
          <button
            type="button"
            className="nav-item"
            onClick={() => !isCollapsed && setIsMasterAccordionOpen(!isMasterAccordionOpen)}
          >
            <div className="nav-item-content">
              <Database size={18} />
              <span className="nav-text">Master Data</span>
            </div>
            <span className="chevron-icon">
              {isMasterAccordionOpen ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
            </span>
          </button>

          {!isCollapsed && isMasterAccordionOpen && (
            <div className="accordion-sub-container">
              <NavLink
                to="/master-data/locations"
                className={({ isActive }) => `nav-item nav-sub-item ${isActive ? 'active' : ''}`}
              >
                <div className="nav-item-content">
                  <Globe size={15} />
                  <span className="nav-text">Location Hierarchy</span>
                </div>
              </NavLink>

              <NavLink
                to="/master-data/brands"
                className={({ isActive }) => `nav-item nav-sub-item ${isActive ? 'active' : ''}`}
              >
                <div className="nav-item-content">
                  <Car size={15} />
                  <span className="nav-text">Vehicle Brands</span>
                </div>
              </NavLink>

              <NavLink
                to="/master-data/categories"
                className={({ isActive }) => `nav-item nav-sub-item ${isActive ? 'active' : ''}`}
              >
                <div className="nav-item-content">
                  <Layers size={15} />
                  <span className="nav-text">Vehicle Categories</span>
                </div>
              </NavLink>
            </div>
          )}
        </div>
      </nav>
    </aside>
  );
};

export default Sidebar;
