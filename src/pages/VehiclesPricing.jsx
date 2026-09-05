import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { getVehicleTypes, updateVehicleType } from '../services/api';
import AddVehicleModal from '../components/AddVehicleModal';

const VehiclesPricing = () => {
  const [vehicles, setVehicles] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadVehicles();
  }, []);

  const loadVehicles = async () => {
    const res = await getVehicleTypes();
    if (res?.data) setVehicles(res.data);
  };

  const handleToggleStatus = async (vehicle) => {
    await updateVehicleType(vehicle._id || vehicle.id, { isActive: !vehicle.isActive });
    loadVehicles();
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h2>Vehicle Types & Per-Km Pricing</h2>
          <p className="subtitle">Set base fares, minimum fares, and per-kilometer rates for all ride options.</p>
        </div>
        <button className="btn btn-success" onClick={() => setIsModalOpen(true)}>
          <Plus size={18} /> Add New Vehicle Type
        </button>
      </div>

      <div className="table-card glass">
        <table className="data-table">
          <thead>
            <tr>
              <th>Vehicle Name</th>
              <th>Base Fare (₹)</th>
              <th>Rate / Km (₹/km)</th>
              <th>Rate / Min (₹/min)</th>
              <th>Min Guaranteed Fare (₹)</th>
              <th>Capacity</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v._id || v.id}>
                <td><strong>{v.name}</strong></td>
                <td>₹{v.baseFare}</td>
                <td><strong style={{ color: '#FFB800' }}>₹{v.ratePerKm} / km</strong></td>
                <td>₹{v.ratePerMin || 1.5} / min</td>
                <td>₹{v.minFare}</td>
                <td>{v.capacity} Seats</td>
                <td>
                  <span className={`badge ${v.isActive !== false ? 'active' : 'inactive'}`}>
                    {v.isActive !== false ? 'Active' : 'Disabled'}
                  </span>
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleToggleStatus(v)}
                  >
                    Toggle Status
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <AddVehicleModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={loadVehicles}
      />
    </div>
  );
};

export default VehiclesPricing;
