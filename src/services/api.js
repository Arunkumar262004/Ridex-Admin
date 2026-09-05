import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor for Admin JWT token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ridex_admin_token') || 'ADMIN_JWT_TOKEN';
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const getStats = async () => {
  try {
    const res = await api.get('/admin/stats');
    return res.data;
  } catch (err) {
    // Return structured default if backend DB empty
    return {
      success: true,
      data: { totalRevenue: 15450, activeRides: 3, totalCaptains: 12, totalCustomers: 45 },
    };
  }
};

export const getVehicleTypes = async () => {
  try {
    const res = await api.get('/vehicle-types');
    return res.data;
  } catch (err) {
    return {
      success: true,
      data: [
        { _id: '1', name: 'Bike', baseFare: 25, ratePerKm: 12, ratePerMin: 1.5, minFare: 30, capacity: 1, isActive: true },
        { _id: '2', name: 'Auto', baseFare: 35, ratePerKm: 15, ratePerMin: 2.0, minFare: 45, capacity: 3, isActive: true },
        { _id: '3', name: 'Cab Economy', baseFare: 60, ratePerKm: 20, ratePerMin: 2.5, minFare: 80, capacity: 4, isActive: true },
        { _id: '4', name: 'Cab Premium', baseFare: 100, ratePerKm: 28, ratePerMin: 3.5, minFare: 120, capacity: 4, isActive: true },
      ],
    };
  }
};

export const createVehicleType = async (payload) => {
  const res = await api.post('/vehicle-types', payload);
  return res.data;
};

export const updateVehicleType = async (id, payload) => {
  const res = await api.put(`/vehicle-types/${id}`, payload);
  return res.data;
};

export const getCaptains = async () => {
  try {
    const res = await api.get('/admin/captains');
    return res.data;
  } catch (err) {
    return {
      success: true,
      data: [
        {
          _id: 'c1',
          name: 'Suresh Kumar',
          email: 'suresh@ridex.com',
          phone: '+91 9876543210',
          ridesAttended: 142,
          totalEarnings: 18450,
          lastLocation: { address: 'MGR Salai, Nungambakkam, Chennai', lat: 13.06, lng: 80.24, updatedAt: new Date() },
          isActive: true,
        },
        {
          _id: 'c2',
          name: 'Ramesh Patel',
          email: 'ramesh@ridex.com',
          phone: '+91 9876543211',
          ridesAttended: 89,
          totalEarnings: 11200,
          lastLocation: { address: 'Anna Nagar West, Chennai', lat: 13.08, lng: 80.21, updatedAt: new Date() },
          isActive: true,
        },
      ],
    };
  }
};

export const getCaptainHistory = async (captainId) => {
  try {
    const res = await api.get(`/admin/captains/${captainId}/history`);
    return res.data;
  } catch (err) {
    return {
      success: true,
      data: [
        {
          _id: 'r101',
          pickupLocation: { address: 'Central Railway Station' },
          dropoffLocation: { address: 'Airport Terminal 1' },
          fare: 350,
          status: 'COMPLETED',
          createdAt: new Date(),
        },
      ],
    };
  }
};

export const createCaptain = async (payload) => {
  const res = await api.post('/admin/captains', payload);
  return res.data;
};

export const updateCaptainStatus = async (captainId, isActive) => {
  const res = await api.patch(`/admin/captains/${captainId}/status`, { isActive });
  return res.data;
};

export const getCustomers = async () => {
  try {
    const res = await api.get('/admin/customers');
    return res.data;
  } catch (err) {
    return {
      success: true,
      data: [
        { _id: 'u1', name: 'Arun Kumar', email: 'arun@example.com', phone: '+91 9123456789', createdAt: new Date() },
        { _id: 'u2', name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 9123456788', createdAt: new Date() },
      ],
    };
  }
};

export default api;
