import React, { useState } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/layout/Sidebar';
import Header from './components/layout/Header';
import Dashboard from './pages/dashboard/Dashboard';
import MasterData from './pages/master-data/MasterData';
import CaptainZoneMap from './pages/captains/CaptainZoneMap';
import CaptainCreation from './pages/captains/CaptainCreation';
import CaptainOnboardList from './pages/captains/CaptainOnboardList';
import VehiclesPricing from './pages/vehicles/VehiclesPricing';
import Customers from './pages/customers/Customers';
import AdminLogin from './pages/auth/AdminLogin';
import AdminProfile from './pages/auth/AdminProfile';
import ChangePassword from './pages/auth/ChangePassword';

const titles = {
  '/': 'Dashboard',
  '/master-data': 'Master Data Management',
  '/master-data/locations': 'Master Data — Location Hierarchy',
  '/master-data/brands': 'Master Data — Vehicle Brands',
  '/master-data/categories': 'Master Data — Vehicle Categories',
  '/captains/zone-map': 'Captain Map',
  '/captains/creation': 'Create Captain',
  '/captains/onboard-list': 'Onboard Queue',
  '/vehicles': 'Vehicles & Pricing',
  '/customers': 'Customers',
  '/profile': 'Admin Profile & Security',
  '/change-password': 'Change Account Password',
};

const ProtectedLayout = () => {
  const location = useLocation();
  const title = titles[location.pathname] || 'Dashboard';
  const token = localStorage.getItem('ridex_admin_token');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleToggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  return (
    <div className="admin-layout">
      <Sidebar isCollapsed={isSidebarCollapsed} onToggleSidebar={handleToggleSidebar} />
      <main className="main-content">
        <Header title={title} onRefresh={handleRefresh} />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/master-data" element={<MasterData />} />
          <Route path="/master-data/locations" element={<MasterData />} />
          <Route path="/master-data/brands" element={<MasterData />} />
          <Route path="/master-data/categories" element={<MasterData />} />
          <Route path="/captains/zone-map" element={<CaptainZoneMap />} />
          <Route path="/captains/creation" element={<CaptainCreation />} />
          <Route path="/captains/onboard-list" element={<CaptainOnboardList />} />
          <Route path="/captains" element={<Navigate to="/captains/creation" replace />} />
          <Route path="/vehicles" element={<VehiclesPricing />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/profile" element={<AdminProfile />} />
          <Route path="/change-password" element={<ChangePassword />} />
        </Routes>
      </main>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <Routes>
        <Route path="/login" element={<AdminLogin />} />
        <Route path="/*" element={<ProtectedLayout />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
