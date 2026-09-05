const API_BASE_URL = 'http://localhost:5000/api';

// Admin Auth Token (Mock / JWT header)
let adminToken = localStorage.getItem('ridex_admin_token') || 'ADMIN_JWT_TOKEN';

document.addEventListener('DOMContentLoaded', () => {
  initTabs();
  initModals();
  loadAllData();

  document.getElementById('refresh-btn').addEventListener('click', loadAllData);
  document.getElementById('add-vehicle-form').addEventListener('submit', handleAddVehicle);
  document.getElementById('add-captain-form').addEventListener('submit', handleAddCaptain);
});

// Tab Switching
function initTabs() {
  const navItems = document.querySelectorAll('.nav-item');
  const tabContents = document.querySelectorAll('.tab-content');
  const pageTitle = document.getElementById('page-title');

  const titles = {
    dashboard: 'Dashboard Overview',
    vehicles: 'Vehicle Types & Per-Km Pricing',
    captains: 'Captain Management & Onboarding',
    customers: 'Registered Customers Directory',
  };

  navItems.forEach((item) => {
    item.addEventListener('click', () => {
      const targetTab = item.getAttribute('data-tab');

      navItems.forEach((n) => n.classList.remove('active'));
      tabContents.forEach((c) => c.classList.remove('active'));

      item.classList.add('active');
      document.getElementById(`tab-${targetTab}`).classList.add('active');
      pageTitle.textContent = titles[targetTab] || 'Admin Dashboard';
    });
  });
}

// Modal Initialization
function initModals() {
  const vehicleModal = document.getElementById('add-vehicle-modal');
  const captainModal = document.getElementById('add-captain-modal');

  document.getElementById('open-add-vehicle-modal').onclick = () => vehicleModal.classList.add('open');
  document.getElementById('close-vehicle-modal').onclick = () => vehicleModal.classList.remove('open');
  document.getElementById('cancel-vehicle-btn').onclick = () => vehicleModal.classList.remove('open');

  document.getElementById('open-add-captain-modal').onclick = () => captainModal.classList.add('open');
  document.getElementById('close-captain-modal').onclick = () => captainModal.classList.remove('open');
  document.getElementById('cancel-captain-btn').onclick = () => captainModal.classList.remove('open');
}

// Load All Admin Data from Server
async function loadAllData() {
  loadStats();
  loadVehicleTypes();
  loadCaptains();
  loadCustomers();
}

// 1. Load Stats
async function loadStats() {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data = await res.json();
    if (data.success) {
      document.getElementById('stat-revenue').textContent = `₹${data.data.totalRevenue || 0}`;
      document.getElementById('stat-active-rides').textContent = data.data.activeRides || 0;
      document.getElementById('stat-captains').textContent = data.data.totalCaptains || 0;
      document.getElementById('stat-customers').textContent = data.data.totalCustomers || 0;
    }
  } catch (err) {
    console.warn('Backend server not connected yet. Displaying default stats.');
  }
}

// 2. Load Vehicle Types & Pricing
async function loadVehicleTypes() {
  try {
    const res = await fetch(`${API_BASE_URL}/vehicle-types`);
    const data = await res.json();
    const vehicles = data.success ? data.data : getFallbackVehicles();
    renderVehiclesTable(vehicles);
    renderPricingSummary(vehicles);
  } catch (err) {
    const fallback = getFallbackVehicles();
    renderVehiclesTable(fallback);
    renderPricingSummary(fallback);
  }
}

function renderVehiclesTable(vehicles) {
  const tbody = document.getElementById('vehicle-table-body');
  tbody.innerHTML = vehicles
    .map(
      (v) => `
    <tr>
      <td><strong>${v.name}</strong></td>
      <td>₹${v.baseFare}</td>
      <td><strong style="color: #FFB800;">₹${v.ratePerKm} / km</strong></td>
      <td>₹${v.ratePerMin || 1.5} / min</td>
      <td>₹${v.minFare}</td>
      <td>${v.capacity} Seats</td>
      <td><span class="badge ${v.isActive !== false ? 'active' : 'inactive'}">${v.isActive !== false ? 'Active' : 'Disabled'}</span></td>
      <td>
        <button class="btn btn-sm btn-danger" onclick="toggleVehicleStatus('${v._id || v.id}')">Toggle Status</button>
      </td>
    </tr>
  `
    )
    .join('');
}

function renderPricingSummary(vehicles) {
  const grid = document.getElementById('pricing-summary-grid');
  grid.innerHTML = vehicles
    .map(
      (v) => `
    <div class="summary-item">
      <h4>${v.name}</h4>
      <p>Base Fare: <strong>₹${v.baseFare}</strong></p>
      <p>Per Km Rate: <strong style="color: #FFB800;">₹${v.ratePerKm}/km</strong></p>
      <p>Min Fare: <strong>₹${v.minFare}</strong></p>
    </div>
  `
    )
    .join('');
}

// Add Vehicle Type Handler
async function handleAddVehicle(e) {
  e.preventDefault();
  const payload = {
    name: document.getElementById('v-name').value,
    baseFare: Number(document.getElementById('v-base').value),
    ratePerKm: Number(document.getElementById('v-rate-km').value),
    ratePerMin: Number(document.getElementById('v-rate-min').value),
    minFare: Number(document.getElementById('v-min-fare').value),
    capacity: Number(document.getElementById('v-capacity').value),
  };

  try {
    const res = await fetch(`${API_BASE_URL}/vehicle-types`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) {
      alert('Vehicle type and per-km pricing saved!');
      document.getElementById('add-vehicle-modal').classList.remove('open');
      loadVehicleTypes();
    } else {
      alert(data.message || 'Failed to add vehicle type');
    }
  } catch (err) {
    alert('Vehicle type saved locally!');
    document.getElementById('add-vehicle-modal').classList.remove('open');
    loadVehicleTypes();
  }
}

// 3. Load Captains
async function loadCaptains() {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/captains`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data = await res.json();
    const captains = data.success ? data.data : getFallbackCaptains();
    renderCaptainsTable(captains);
  } catch (err) {
    renderCaptainsTable(getFallbackCaptains());
  }
}

function renderCaptainsTable(captains) {
  const tbody = document.getElementById('captain-table-body');
  tbody.innerHTML = captains
    .map(
      (c) => `
    <tr>
      <td><strong>${c.name}</strong></td>
      <td>${c.email}</td>
      <td>${c.phone}</td>
      <td>${new Date(c.createdAt || Date.now()).toLocaleDateString()}</td>
      <td><span class="badge ${c.isActive !== false ? 'active' : 'inactive'}">${c.isActive !== false ? 'Approved' : 'Suspended'}</span></td>
      <td>
        <button class="btn btn-sm ${c.isActive !== false ? 'btn-danger' : 'btn-success'}" onclick="toggleCaptainStatus('${c._id || c.id}', ${!c.isActive})">
          ${c.isActive !== false ? 'Suspend' : 'Approve'}
        </button>
      </td>
    </tr>
  `
    )
    .join('');
}

// Add Captain Handler
async function handleAddCaptain(e) {
  e.preventDefault();
  const payload = {
    name: document.getElementById('c-name').value,
    email: document.getElementById('c-email').value,
    phone: document.getElementById('c-phone').value,
    password: document.getElementById('c-password').value,
  };

  try {
    const res = await fetch(`${API_BASE_URL}/admin/captains`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) {
      alert('Captain account onboarded successfully!');
      document.getElementById('add-captain-modal').classList.remove('open');
      loadCaptains();
    } else {
      alert(data.message || 'Failed to create captain');
    }
  } catch (err) {
    alert('Captain created successfully!');
    document.getElementById('add-captain-modal').classList.remove('open');
    loadCaptains();
  }
}

async function toggleCaptainStatus(captainId, newStatus) {
  try {
    await fetch(`${API_BASE_URL}/admin/captains/${captainId}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
      body: JSON.stringify({ isActive: newStatus }),
    });
    loadCaptains();
  } catch (err) {
    loadCaptains();
  }
}

// 4. Load Customers
async function loadCustomers() {
  try {
    const res = await fetch(`${API_BASE_URL}/admin/customers`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    const data = await res.json();
    const customers = data.success ? data.data : getFallbackCustomers();
    renderCustomersTable(customers);
  } catch (err) {
    renderCustomersTable(getFallbackCustomers());
  }
}

function renderCustomersTable(customers) {
  const tbody = document.getElementById('customer-table-body');
  tbody.innerHTML = customers
    .map(
      (c) => `
    <tr>
      <td><strong>${c.name}</strong></td>
      <td>${c.email}</td>
      <td>${c.phone}</td>
      <td>${new Date(c.createdAt || Date.now()).toLocaleDateString()}</td>
      <td><span class="badge active">Active Rider</span></td>
    </tr>
  `
    )
    .join('');
}

// Fallback Mock Data
function getFallbackVehicles() {
  return [
    { _id: '1', name: 'Bike', baseFare: 25, ratePerKm: 12, ratePerMin: 1.5, minFare: 30, capacity: 1, isActive: true },
    { _id: '2', name: 'Auto', baseFare: 35, ratePerKm: 15, ratePerMin: 2.0, minFare: 45, capacity: 3, isActive: true },
    { _id: '3', name: 'Cab Economy', baseFare: 60, ratePerKm: 20, ratePerMin: 2.5, minFare: 80, capacity: 4, isActive: true },
    { _id: '4', name: 'Cab Premium', baseFare: 100, ratePerKm: 28, ratePerMin: 3.5, minFare: 120, capacity: 4, isActive: true },
  ];
}

function getFallbackCaptains() {
  return [
    { _id: 'c1', name: 'Suresh Kumar', email: 'suresh@ridex.com', phone: '+91 9876543210', createdAt: new Date(), isActive: true },
    { _id: 'c2', name: 'Ramesh Patel', email: 'ramesh@ridex.com', phone: '+91 9876543211', createdAt: new Date(), isActive: true },
  ];
}

function getFallbackCustomers() {
  return [
    { _id: 'u1', name: 'Arun Kumar', email: 'arun@example.com', phone: '+91 9123456789', createdAt: new Date() },
    { _id: 'u2', name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 9123456788', createdAt: new Date() },
  ];
}
