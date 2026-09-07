import React, { useEffect, useState } from 'react';
import { getCustomers, deleteCustomer } from '../../services/api';
import { Trash2 } from 'lucide-react';

const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [deletingCustomer, setDeletingCustomer] = useState(null);
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    loadCustomersData();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  const loadCustomersData = async () => {
    const res = await getCustomers();
    if (res?.data) setCustomers([...res.data]);
  };

  const handleDeleteConfirmed = async () => {
    if (!deletingCustomer) return;
    const targetId = String(deletingCustomer._id || deletingCustomer.id);
    await deleteCustomer(targetId);
    setCustomers((prev) => prev.filter((c) => String(c._id || c.id) !== targetId));
    setDeletingCustomer(null);
    showToast('Customer record deleted successfully!');
    await loadCustomersData();
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h2>Registered Customers Directory</h2>
          <p className="subtitle">View and manage all registered rider accounts on the platform.</p>
        </div>
      </div>

      <div className="table-card glass-card">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Joined Date</th>
              <th>Status</th>
              <th style={{ textAlign: 'center' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c._id || c.id}>
                <td><strong>{c.name}</strong></td>
                <td>{c.email}</td>
                <td>{c.phone}</td>
                <td>{new Date(c.createdAt || Date.now()).toLocaleDateString()}</td>
                <td><span className="badge active">Active Rider</span></td>
                <td style={{ textAlign: 'center' }}>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => setDeletingCustomer(c)}
                    style={{ padding: '4px 10px', fontSize: '11.5px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Styled Delete Modal Confirmation */}
      {deletingCustomer && (
        <div className="modal-overlay">
          <div className="modal-card" style={{ maxWidth: '420px', textAlign: 'center' }}>
            <div style={{ display: 'inline-flex', padding: '14px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.12)', color: '#EF4444', marginBottom: '14px' }}>
              <Trash2 size={28} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', margin: '0 0 8px 0', color: 'var(--text-primary)' }}>Delete Customer Record</h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '0 0 20px 0', lineHeight: '1.5' }}>
              Are you sure you want to delete customer <strong>{deletingCustomer.name}</strong>? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setDeletingCustomer(null)}>
                Cancel
              </button>
              <button className="btn btn-danger" style={{ flex: 1 }} onClick={handleDeleteConfirmed}>
                Yes, Delete Customer
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMessage && (
        <div className="toast-container">
          <div className="toast-message">{toastMessage}</div>
        </div>
      )}
    </div>
  );
};

export default Customers;
