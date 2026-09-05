import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import VehiclesPricing from './pages/VehiclesPricing';
import Captains from './pages/Captains';
import Customers from './pages/Customers';

const titles = {
  '/': 'Dashboard Overview',
  '/vehicles': 'Vehicle Types & Per-Km Pricing',
  '/captains': 'Captain Management & Onboarding',
  '/customers': 'Registered Customers Directory',
};

const App = () => {
  const location = useLocation();
  const title = titles[location.pathname] || 'Admin Dashboard';

  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      <main className="main-content">
        <Header title={title} onRefresh={handleRefresh} />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vehicles" element={<VehiclesPricing />} />
          <Route path="/captains" element={<Captains />} />
          <Route path="/customers" element={<Customers />} />
        </Routes>
      </main>
    </div>
  );
};

export default App;
