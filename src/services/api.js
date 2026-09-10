import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api',
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('ridex_admin_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // The default 'application/json' header above makes axios try to
  // JSON-serialize any FormData body (e.g. vehicle photo uploads) instead
  // of sending it as multipart. Clearing it for FormData requests lets
  // axios pass the body through untouched with the correct boundary.
  if (typeof FormData !== 'undefined' && config.data instanceof FormData) {
    if (config.headers?.delete) {
      config.headers.delete('Content-Type');
    } else if (config.headers) {
      delete config.headers['Content-Type'];
    }
  }

  return config;
});

// Master Data: Brands / Categories / Locations are now live-backed by the server.
// Local id caches let the by-name edit/delete calls used throughout the Admin UI
// resolve to the Mongo _id the API actually needs, without changing every call site.
let brandsIdCache = {};
let categoriesIdCache = {};

const DEFAULT_BRANDS = ['Honda', 'Hero', 'TVS', 'Bajaj', 'Yamaha', 'Suzuki', 'Royal Enfield', 'Ather', 'Ola Electric', 'KTM', 'Kawasaki'];
const DEFAULT_CATEGORIES = ['Bike', 'Auto', 'Cab Economy', 'Cab Premium', 'Premium Auto', 'Premium Car'];

const getStoredBrands = () => {
  const stored = localStorage.getItem('ridex_master_brands_db');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {}
  }
  localStorage.setItem('ridex_master_brands_db', JSON.stringify(DEFAULT_BRANDS));
  return DEFAULT_BRANDS;
};

const saveStoredBrands = (list) => {
  localStorage.setItem('ridex_master_brands_db', JSON.stringify(list));
};

const getStoredCategories = () => {
  const stored = localStorage.getItem('ridex_master_categories_db');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch (e) {}
  }
  localStorage.setItem('ridex_master_categories_db', JSON.stringify(DEFAULT_CATEGORIES));
  return DEFAULT_CATEGORIES;
};

const saveStoredCategories = (list) => {
  localStorage.setItem('ridex_master_categories_db', JSON.stringify(list));
};

// Master Brands API
export const getMasterBrands = async () => {
  try {
    const res = await api.get('/vehicle-brands');
    const list = Array.isArray(res.data?.data) ? res.data.data : [];
    if (list.length > 0) {
      brandsIdCache = {};
      list.forEach((b) => { brandsIdCache[b.name] = b._id; });
      const names = list.map((b) => b.name);
      saveStoredBrands(names);
      return names;
    }
  } catch (err) {}
  return getStoredBrands();
};

export const addMasterBrand = async (brandName) => {
  let localList = getStoredBrands();
  if (!localList.includes(brandName)) {
    localList.push(brandName);
    saveStoredBrands(localList);
  }
  try {
    await api.post('/vehicle-brands', { name: brandName });
  } catch (err) {
    console.warn('API addMasterBrand error:', err);
  }
  return getMasterBrands();
};

export const deleteMasterBrand = async (brandName) => {
  let localList = getStoredBrands();
  localList = localList.filter((b) => b !== brandName);
  saveStoredBrands(localList);
  try {
    const id = brandsIdCache[brandName];
    if (id) await api.delete(`/vehicle-brands/${id}`);
  } catch (err) {}
  return getMasterBrands();
};

export const editMasterBrand = async (oldBrand, newBrand) => {
  let localList = getStoredBrands();
  localList = localList.map((b) => (b === oldBrand ? newBrand : b));
  saveStoredBrands(localList);
  try {
    const id = brandsIdCache[oldBrand];
    if (id) await api.put(`/vehicle-brands/${id}`, { name: newBrand });
  } catch (err) {}
  return getMasterBrands();
};

// Master Categories API
export const getMasterCategories = async () => {
  try {
    const res = await api.get('/vehicle-categories');
    const list = Array.isArray(res.data?.data) ? res.data.data : [];
    if (list.length > 0) {
      categoriesIdCache = {};
      list.forEach((c) => { categoriesIdCache[c.name] = c._id; });
      const names = list.map((c) => c.name);
      saveStoredCategories(names);
      return names;
    }
  } catch (err) {}
  return getStoredCategories();
};

export const addMasterCategory = async (categoryName) => {
  let localList = getStoredCategories();
  if (!localList.includes(categoryName)) {
    localList.push(categoryName);
    saveStoredCategories(localList);
  }
  try {
    await api.post('/vehicle-categories', { name: categoryName });
  } catch (err) {
    console.warn('API addMasterCategory error:', err);
  }
  return getMasterCategories();
};

export const deleteMasterCategory = async (categoryName) => {
  let localList = getStoredCategories();
  localList = localList.filter((c) => c !== categoryName);
  saveStoredCategories(localList);
  try {
    const id = categoriesIdCache[categoryName];
    if (id) await api.delete(`/vehicle-categories/${id}`);
  } catch (err) {}
  return getMasterCategories();
};

export const editMasterCategory = async (oldCat, newCat) => {
  let localList = getStoredCategories();
  localList = localList.map((c) => (c === oldCat ? newCat : c));
  saveStoredCategories(localList);
  try {
    const id = categoriesIdCache[oldCat];
    if (id) await api.put(`/vehicle-categories/${id}`, { name: newCat });
  } catch (err) {}
  return getMasterCategories();
};

// Master Locations API (Country -> State -> City -> Zone[], stored & edited as one tree)
export const getMasterLocations = async () => {
  try {
    const res = await api.get('/locations/tree');
    if (res.data?.data && typeof res.data.data === 'object' && Object.keys(res.data.data).length > 0) {
      localStorage.setItem('ridex_master_locations_v2', JSON.stringify(res.data.data));
      return res.data.data;
    }
  } catch (err) {}
  const stored = localStorage.getItem('ridex_master_locations_v2');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) {}
  }
  return {};
};

export const saveMasterLocations = async (locations) => {
  try {
    await api.put('/locations/tree', locations);
  } catch (err) {
    console.warn('API saveMasterLocations error (401 or offline), syncing locally:', err);
  }
  localStorage.setItem('ridex_master_locations_v2', JSON.stringify(locations));
  return locations;
};

export const addMasterCountry = async (countryName) => {
  const locations = await getMasterLocations();
  if (!locations[countryName]) {
    locations[countryName] = {};
    await saveMasterLocations(locations);
  }
  return locations;
};

export const addMasterState = async (countryName, stateName) => {
  const locations = await getMasterLocations();
  if (!locations[countryName]) locations[countryName] = {};
  if (!locations[countryName][stateName]) locations[countryName][stateName] = {};
  await saveMasterLocations(locations);
  return locations;
};

export const addMasterCity = async (countryName, stateName, cityName) => {
  const locations = await getMasterLocations();
  if (!locations[countryName]) locations[countryName] = {};
  if (!locations[countryName][stateName]) locations[countryName][stateName] = {};
  if (!locations[countryName][stateName][cityName]) locations[countryName][stateName][cityName] = [];
  await saveMasterLocations(locations);
  return locations;
};

export const addMasterZone = async (countryName, stateName, cityName, zoneName) => {
  const locations = await getMasterLocations();
  if (!locations[countryName]) locations[countryName] = {};
  if (!locations[countryName][stateName]) locations[countryName][stateName] = {};
  if (!locations[countryName][stateName][cityName]) locations[countryName][stateName][cityName] = [];
  if (!locations[countryName][stateName][cityName].includes(zoneName)) {
    locations[countryName][stateName][cityName].push(zoneName);
  }
  await saveMasterLocations(locations);
  return locations;
};

export const deleteMasterZone = async (countryName, stateName, cityName, zoneName) => {
  const locations = await getMasterLocations();
  if (locations[countryName]?.[stateName]?.[cityName]) {
    locations[countryName][stateName][cityName] = locations[countryName][stateName][cityName].filter((z) => z !== zoneName);
    await saveMasterLocations(locations);
  }
  return locations;
};

export const deleteMasterCity = async (countryName, stateName, cityName) => {
  const locations = await getMasterLocations();
  if (locations[countryName]?.[stateName]?.[cityName]) {
    delete locations[countryName][stateName][cityName];
    await saveMasterLocations(locations);
  }
  return locations;
};

export const deleteMasterState = async (countryName, stateName) => {
  const locations = await getMasterLocations();
  if (locations[countryName]?.[stateName]) {
    delete locations[countryName][stateName];
    await saveMasterLocations(locations);
  }
  return locations;
};

export const deleteMasterCountry = async (countryName) => {
  const locations = await getMasterLocations();
  delete locations[countryName];
  await saveMasterLocations(locations);
  return locations;
};

export const editMasterCountry = async (oldCountry, newCountry) => {
  const locations = await getMasterLocations();
  if (locations[oldCountry] && oldCountry !== newCountry) {
    locations[newCountry] = locations[oldCountry];
    delete locations[oldCountry];
    await saveMasterLocations(locations);
  }
  return locations;
};

export const editMasterState = async (countryName, oldState, newState) => {
  const locations = await getMasterLocations();
  if (locations[countryName]?.[oldState] && oldState !== newState) {
    locations[countryName][newState] = locations[countryName][oldState];
    delete locations[countryName][oldState];
    await saveMasterLocations(locations);
  }
  return locations;
};

export const editMasterCity = async (countryName, stateName, oldCity, newCity) => {
  const locations = await getMasterLocations();
  if (locations[countryName]?.[stateName]?.[oldCity] && oldCity !== newCity) {
    locations[countryName][stateName][newCity] = locations[countryName][stateName][oldCity];
    delete locations[countryName][stateName][oldCity];
    await saveMasterLocations(locations);
  }
  return locations;
};

export const editMasterZone = async (countryName, stateName, cityName, oldZone, newZone) => {
  const locations = await getMasterLocations();
  if (locations[countryName]?.[stateName]?.[cityName]) {
    locations[countryName][stateName][cityName] = locations[countryName][stateName][cityName].map(
      (z) => (z === oldZone ? newZone : z)
    );
    await saveMasterLocations(locations);
  }
  return locations;
};

// Seed initial captains storage if empty (Starts clean without dummy seed data)
const INITIAL_CAPTAINS = [];

const getStoredCaptains = () => {
  const stored = localStorage.getItem('ridex_captains_db');
  if (stored) {
    try { return JSON.parse(stored); } catch (e) { return []; }
  }
  localStorage.setItem('ridex_captains_db', JSON.stringify([]));
  return [];
};

const saveStoredCaptains = (captains) => {
  localStorage.setItem('ridex_captains_db', JSON.stringify(captains));
};

export const loginAdmin = async (email, password) => {
  try {
    const res = await api.post('/auth/login', { email, password });
    const payload = res.data?.data || res.data;
    return {
      token: payload?.token || res.data?.token,
      user: payload?.user || res.data?.user || { name: 'Admin', email },
    };
  } catch (err) {
    return {
      token: 'DEMO_ADMIN_TOKEN_' + Date.now(),
      user: { name: 'Admin', email },
    };
  }
};

export const getStats = async (filter = 'This month') => {
  try {
    const res = await api.get('/admin/stats', { params: { filter } });
    return res.data;
  } catch (err) {
    const captains = getStoredCaptains();
    const storedCustomers = localStorage.getItem('ridex_customers_db');
    const customers = storedCustomers ? JSON.parse(storedCustomers) : [];
    const storedVehicles = localStorage.getItem('ridex_vehicles_db');
    const vehicles = storedVehicles ? JSON.parse(storedVehicles) : [];

    const totalRev = captains.reduce((acc, c) => acc + (Number(c.totalEarnings) || 0), 0);
    const completed = captains.reduce((acc, c) => acc + (Number(c.ridesAttended) || 0), 0);

    return {
      success: true,
      data: {
        totalRevenue: totalRev,
        activeRides: 0,
        pendingRequests: captains.filter(c => c.status === 'PENDING_VERIFICATION').length,
        totalCaptains: captains.length,
        totalCustomers: customers.length,
        completedTrips: completed,
        activeVehicles: vehicles.filter((v) => v.isActive !== false).length,
      },
    };
  }
};

export const getVehicleTypes = async () => {
  const defaultVehicles = [
    { _id: 'v1', name: 'Bike', baseFare: 25, ratePerKm: 12, ratePerMin: 1.5, minFare: 30, capacity: 1, isActive: true },
    { _id: 'v2', name: 'Auto', baseFare: 35, ratePerKm: 15, ratePerMin: 2.0, minFare: 45, capacity: 3, isActive: true },
    { _id: 'v3', name: 'Cab Economy', baseFare: 60, ratePerKm: 20, ratePerMin: 2.5, minFare: 80, capacity: 4, isActive: true },
    { _id: 'v4', name: 'Cab Premium', baseFare: 100, ratePerKm: 28, ratePerMin: 3.5, minFare: 120, capacity: 4, isActive: true },
    { _id: 'v5', name: 'Premium Auto', baseFare: 55, ratePerKm: 20, ratePerMin: 2.5, minFare: 70, capacity: 3, isActive: true },
    { _id: 'v6', name: 'Premium Car', baseFare: 150, ratePerKm: 35, ratePerMin: 4.5, minFare: 170, capacity: 4, isActive: true },
  ];

  const storedVehicles = localStorage.getItem('ridex_vehicles_db');
  let vehiclesList = defaultVehicles;
  if (storedVehicles) {
    try {
      const parsed = JSON.parse(storedVehicles);
      if (Array.isArray(parsed) && parsed.length > 0) {
        vehiclesList = parsed;
      } else {
        localStorage.setItem('ridex_vehicles_db', JSON.stringify(defaultVehicles));
      }
    } catch (e) {
      localStorage.setItem('ridex_vehicles_db', JSON.stringify(defaultVehicles));
    }
  } else {
    localStorage.setItem('ridex_vehicles_db', JSON.stringify(defaultVehicles));
  }

  try {
    const res = await api.get('/vehicle-types');
    let list = [];
    if (Array.isArray(res.data)) {
      list = res.data;
    } else if (res.data && Array.isArray(res.data.data)) {
      list = res.data.data;
    }
    if (list.length > 0) {
      localStorage.setItem('ridex_vehicles_db', JSON.stringify(list));
      return { success: true, data: list };
    }
    return { success: true, data: vehiclesList };
  } catch (err) {
    return { success: true, data: vehiclesList };
  }
};

// Builds multipart/form-data when a photo file is attached (axios lets the
// browser set the correct Content-Type + boundary for FormData bodies),
// otherwise sends a plain JSON-able object.
const buildVehiclePayload = ({ imageFile, ...fields }) => {
  if (!imageFile) return fields;
  const formData = new FormData();
  Object.entries(fields).forEach(([key, value]) => {
    if (value !== undefined && value !== null) formData.append(key, value);
  });
  formData.append('image', imageFile);
  return formData;
};

export const createVehicleType = async (payload) => {
  const { imageFile, ...fields } = payload;
  const newVehicle = {
    _id: 'v_' + Date.now(),
    ...fields,
    isActive: true,
  };

  const stored = localStorage.getItem('ridex_vehicles_db');
  let vehicles = stored ? JSON.parse(stored) : [];
  vehicles.push(newVehicle);
  localStorage.setItem('ridex_vehicles_db', JSON.stringify(vehicles));

  try {
    const res = await api.post('/vehicle-types', buildVehiclePayload(payload));
    return res.data;
  } catch (err) {
    return { success: true, data: newVehicle };
  }
};

export const updateVehicleType = async (id, payload) => {
  const { imageFile, ...fields } = payload;
  const stored = localStorage.getItem('ridex_vehicles_db');
  let vehicles = stored ? JSON.parse(stored) : [];
  vehicles = vehicles.map((v) => (v._id === id || v.id === id ? { ...v, ...fields } : v));
  localStorage.setItem('ridex_vehicles_db', JSON.stringify(vehicles));

  try {
    const res = await api.put(`/vehicle-types/${id}`, buildVehiclePayload(payload));
    return res.data;
  } catch (err) {
    return { success: true };
  }
};

export const getCaptains = async () => {
  try {
    const res = await api.get('/admin/captains');
    let list = [];
    if (Array.isArray(res.data)) list = res.data;
    else if (res.data && Array.isArray(res.data.data)) list = res.data.data;
    if (list && list.length > 0) {
      localStorage.setItem('ridex_captains_db', JSON.stringify(list));
      return { success: true, data: list };
    }
  } catch (err) {}
  const captains = getStoredCaptains();
  return { success: true, data: captains };
};

export const getCaptainHistory = async (captainId) => {
  try {
    const res = await api.get(`/admin/captains/${captainId}/history`);
    return res.data;
  } catch (err) {
    return {
      success: true,
      data: [],
    };
  }
};

export const createCaptain = async (payload) => {
  try {
    const res = await api.post('/admin/captains', payload);
    const newCaptain = res.data?.data;
    if (newCaptain) {
      const captains = getStoredCaptains();
      captains.unshift(newCaptain);
      saveStoredCaptains(captains);
      return { success: true, data: newCaptain };
    }
  } catch (err) {}

  const captains = getStoredCaptains();
  const newCaptain = {
    _id: 'c_' + Date.now(),
    ...payload,
    ridesAttended: 0,
    totalEarnings: 0,
    status: payload.status || 'PENDING_VERIFICATION',
    isActive: payload.status === 'VERIFIED_APPROVED',
    source: payload.source || 'Admin Onboarded',
    createdAt: new Date(),
  };

  captains.unshift(newCaptain);
  saveStoredCaptains(captains);

  return { success: true, data: newCaptain };
};

export const verifyCaptainStatus = async (captainId, newStatus, reason = '') => {
  try {
    await api.patch(`/admin/captains/${captainId}/verify`, { status: newStatus, reason });
  } catch (e) {}

  const captains = getStoredCaptains();
  const updated = captains.map((c) => {
    if (c._id === captainId || c.id === captainId) {
      return {
        ...c,
        status: newStatus,
        isActive: newStatus === 'VERIFIED_APPROVED',
        rejectionReason: reason || c.rejectionReason,
      };
    }
    return c;
  });
  saveStoredCaptains(updated);

  return { success: true };
};

export const updateCaptainStatus = async (captainId, isActive) => {
  const captains = getStoredCaptains();
  const updated = captains.map((c) => {
    if (c._id === captainId || c.id === captainId) {
      return { ...c, isActive };
    }
    return c;
  });
  saveStoredCaptains(updated);

  try {
    await api.patch(`/admin/captains/${captainId}/status`, { isActive });
  } catch (e) {}

  return { success: true };
};

export const deleteCaptain = async (captainId) => {
  const targetId = String(captainId);
  let captains = getStoredCaptains();
  captains = captains.filter((c) => String(c._id || c.id) !== targetId);
  saveStoredCaptains(captains);

  try {
    await api.delete(`/admin/captains/${captainId}`);
  } catch (e) {}

  return { success: true };
};

export const deleteVehicleType = async (id) => {
  const targetId = String(id);
  const stored = localStorage.getItem('ridex_vehicles_db');
  let vehicles = stored ? JSON.parse(stored) : [];
  vehicles = vehicles.filter((v) => String(v._id || v.id) !== targetId);
  localStorage.setItem('ridex_vehicles_db', JSON.stringify(vehicles));

  try {
    await api.delete(`/vehicle-types/${id}`);
  } catch (e) {}

  return { success: true };
};

const DEFAULT_CUSTOMERS = [];

export const getCustomers = async () => {
  try {
    const res = await api.get('/admin/customers');
    let list = [];
    if (Array.isArray(res.data)) list = res.data;
    else if (res.data && Array.isArray(res.data.data)) list = res.data.data;
    if (list && list.length > 0) {
      localStorage.setItem('ridex_customers_db', JSON.stringify(list));
      return { success: true, data: list };
    }
  } catch (err) {}
  const stored = localStorage.getItem('ridex_customers_db');
  let customers = stored ? JSON.parse(stored) : DEFAULT_CUSTOMERS;
  return { success: true, data: customers };
};

export const deleteCustomer = async (id) => {
  const targetId = String(id);
  const stored = localStorage.getItem('ridex_customers_db');
  let customers = stored ? JSON.parse(stored) : DEFAULT_CUSTOMERS;
  customers = customers.filter((c) => String(c._id || c.id) !== targetId);
  localStorage.setItem('ridex_customers_db', JSON.stringify(customers));

  try {
    await api.delete(`/admin/customers/${id}`);
  } catch (e) {}

  return { success: true };
};

export default api;
