import React, { useEffect, useState } from 'react';
import { getCustomers } from '../services/api';

const Customers = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    loadCustomersData();
  }, []);

  const loadCustomersData = async () => {
    const res = await getCustomers();
    if (res?.data) setCustomers(res.data);
  };

  return (
    <div>
      <div className="section-header">
        <div>
          <h2>Registered Customers Directory</h2>
          <p className="subtitle">View all registered rider accounts on the platform.</p>
        </div>
      </div>

      <div className="table-card glass">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Joined Date</th>
              <th>Status</th>
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Customers;
