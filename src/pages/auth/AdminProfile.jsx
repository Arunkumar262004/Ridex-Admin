import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Key, Mail, User, Phone, Lock, Calendar, Globe, Award, CheckCircle, FileText } from 'lucide-react';
import ridexLogo from '../../assets/logo/Ridexadmin.png';

const AdminProfile = () => {
  const navigate = useNavigate();
  const adminUser = JSON.parse(localStorage.getItem('ridex_admin_user') || '{}');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header Banner */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '24px 28px',
          background: 'linear-gradient(135deg, var(--bg-card-solid), rgba(255, 102, 0, 0.08))',
          borderLeft: '4px solid #FF6600',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              width: '72px',
              height: '72px',
              borderRadius: '20px',
              background: '#FFFFFF',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              boxShadow: '0 8px 24px rgba(255, 102, 0, 0.25)',
              border: '2px solid rgba(255, 102, 0, 0.3)',
            }}
          >
            <img src={ridexLogo} alt="Ridex Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <h2 style={{ fontSize: '22px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
                {adminUser.name || 'Ridex Super Admin'}
              </h2>
              <span className="badge verified" style={{ fontSize: '11px' }}>
                <CheckCircle size={12} /> Verified Administrator
              </span>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>
              Primary System Operator • Full Administrative Control
            </p>
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={() => navigate('/change-password')}
          style={{ padding: '10px 18px', fontSize: '13px', fontWeight: '700', borderRadius: '10px' }}
        >
          <Key size={16} /> Change Password
        </button>
      </div>

      {/* Sensitive Profile Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '20px' }}>
        {/* Left Column: Account & Sensitive Details */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card">
            <div className="info-card-title" style={{ marginBottom: '16px', fontSize: '13px' }}>
              <User size={16} /> Sensitive Account Information
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="info-card-block">
                <span className="info-label">Full Name</span>
                <div className="info-value" style={{ fontSize: '14.5px' }}>{adminUser.name || 'Ridex Super Admin'}</div>
              </div>

              <div className="info-card-block">
                <span className="info-label">Official Email Address</span>
                <div className="info-value" style={{ fontSize: '14px', color: '#FF6600' }}>
                  {adminUser.email || 'admin@ridex.com'}
                </div>
              </div>

              <div className="info-grid-row">
                <div className="info-card-block" style={{ margin: 0 }}>
                  <span className="info-label">Contact Phone</span>
                  <div className="info-value">+91 98765 43210</div>
                </div>
                <div className="info-card-block" style={{ margin: 0 }}>
                  <span className="info-label">Role Designation</span>
                  <div className="info-value" style={{ color: '#22C55E' }}>Super Admin</div>
                </div>
              </div>

              <div className="info-card-block">
                <span className="info-label">Admin ID Token</span>
                <div className="info-value" style={{ fontFamily: 'monospace', fontSize: '12px', letterSpacing: '0.5px' }}>
                  RX-ADM-994820-SYS-PROD
                </div>
              </div>
            </div>
          </div>

          {/* Operational Permissions */}
          <div className="glass-card">
            <div className="info-card-title" style={{ marginBottom: '16px', fontSize: '13px' }}>
              <Award size={16} /> Operational Privileges & Scopes
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {[
                { label: 'Master Data CRUD', status: 'Granted' },
                { label: 'Captain Onboarding KYC', status: 'Granted' },
                { label: 'Fare & Pricing Tariff', status: 'Granted' },
                { label: 'Zone & City Boundaries', status: 'Granted' },
                { label: 'Financial Reports', status: 'Granted' },
                { label: 'System Configuration', status: 'Granted' },
              ].map((item) => (
                <div
                  key={item.label}
                  style={{
                    background: 'var(--bg-input)',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: '12.5px',
                  }}
                >
                  <span style={{ color: 'var(--text-primary)', fontWeight: '500' }}>{item.label}</span>
                  <span className="badge completed" style={{ fontSize: '10px' }}>{item.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Security Logs & Session Info */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="glass-card">
            <div className="info-card-title" style={{ marginBottom: '16px', fontSize: '13px' }}>
              <ShieldCheck size={16} /> Security & Active Session
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="info-card-block">
                <span className="info-label">Last Login IP Address</span>
                <div className="info-value" style={{ fontFamily: 'monospace' }}>192.168.1.104 (Localhost Web)</div>
              </div>

              <div className="info-card-block">
                <span className="info-label">Authentication Mechanism</span>
                <div className="info-value">JWT Bearer Token + 2FA Enabled</div>
              </div>

              <div className="info-card-block">
                <span className="info-label">Current Session Started</span>
                <div className="info-value">Today at {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
              </div>
            </div>
          </div>

          {/* Recent Security Log Activity */}
          <div className="glass-card">
            <div className="info-card-title" style={{ marginBottom: '14px', fontSize: '13px' }}>
              <FileText size={16} /> Security Activity Audit Log
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {[
                { time: '10 mins ago', action: 'Logged in successfully', ip: '192.168.1.104' },
                { time: '2 hours ago', action: 'Updated Location Hierarchy Master', ip: '192.168.1.104' },
                { time: 'Yesterday', action: 'Approved Captain KYC Verification', ip: '192.168.1.104' },
                { time: '3 days ago', action: 'Modified Auto Tariff Rate', ip: '192.168.1.104' },
              ].map((log, index) => (
                <div
                  key={index}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '8px',
                    background: 'var(--bg-input)',
                    border: '1px solid var(--border-color)',
                    fontSize: '12px',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2px' }}>
                    <strong style={{ color: 'var(--text-primary)' }}>{log.action}</strong>
                    <span style={{ color: 'var(--text-muted)', fontSize: '11px' }}>{log.time}</span>
                  </div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '11px', fontFamily: 'monospace' }}>IP: {log.ip}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;
