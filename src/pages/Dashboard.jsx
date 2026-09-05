import React, { useEffect, useState } from 'react';
import { IndianRupee, Navigation, UserCheck, Users } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import { getStats, getVehicleTypes } from '../services/api';

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalRevenue: 0,
    activeRides: 0,
    totalCaptains: 0,
    totalCustomers: 0,
  });
  const [vehicles, setVehicles] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    const statsRes = await getStats();
    if (statsRes?.data) setStats(statsRes.data);

    const vehicleRes = await getVehicleTypes();
    if (vehicleRes?.data) setVehicles(vehicleRes.data);
  };

  return (
    <div>
      <div className="metrics-grid">
        <MetricCard
          title="Total Platform Revenue"
          value={`₹${stats.totalRevenue || 0}`}
          icon={IndianRupee}
          colorClass="green"
        />
        <MetricCard
          title="Active Ongoing Rides"
          value={stats.activeRides || 0}
          icon={Navigation}
          colorClass="blue"
        />
        <MetricCard
          title="Registered Captains"
          value={stats.totalCaptains || 0}
          icon={UserCheck}
          colorClass="yellow"
        />
        <MetricCard
          title="Total Customers"
          value={stats.totalCustomers || 0}
          icon={Users}
          colorClass="purple"
        />
      </div>

      <div className="card-section glass">
        <h3>Quick Pricing Summary</h3>
        <p className="subtitle">Live per-kilometer rates configured for ride matching.</p>
        <div className="summary-grid">
          {vehicles.map((v) => (
            <div key={v._id || v.id} className="summary-item">
              <h4>{v.name}</h4>
              <p>Base Fare: <strong>₹{v.baseFare}</strong></p>
              <p>Per Km Rate: <strong style={{ color: '#FFB800' }}>₹{v.ratePerKm}/km</strong></p>
              <p>Min Fare: <strong>₹{v.minFare}</strong></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
