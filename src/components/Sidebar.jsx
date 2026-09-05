import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Car, UserCheck, Users, Shield } from 'lucide-react';

const Sidebar = () => {
  return (
    <aside className="sidebar">
      <div className="brand">
        <Shield className="logo-icon" size={32} />
        <h2>Ridex <span>Admin</span></h2>
      </div>

      <nav className="nav-menu">
        <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <LayoutDashboard size={20} /> Dashboard
        </NavLink>
        <NavLink to="/vehicles" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Car size={20} /> Vehicle & Pricing
        </NavLink>
        <NavLink to="/captains" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <UserCheck size={20} /> Captains Management
        </NavLink>
        <NavLink to="/customers" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
          <Users size={20} /> Customers List
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="admin-profile">
          <div className="avatar">A</div>
          <div className="info">
            <span className="name">Super Admin</span>
            <span className="role">System Administrator</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
