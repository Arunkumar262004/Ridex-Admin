import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Key, ShieldCheck, CheckCircle, AlertTriangle, Eye, EyeOff, Lock, ArrowLeft } from 'lucide-react';

const ChangePassword = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const getPasswordStrength = (pass) => {
    if (!pass) return { label: '', percent: 0, color: '#E2E8F0' };
    if (pass.length < 6) return { label: 'Too Weak', percent: 25, color: '#EF4444' };
    if (pass.length < 8) return { label: 'Weak', percent: 50, color: '#F59E0B' };
    const hasUpper = /[A-Z]/.test(pass);
    const hasNumber = /[0-9]/.test(pass);
    const hasSpecial = /[^A-Za-z0-9]/.test(pass);
    if (hasUpper && hasNumber && hasSpecial) {
      return { label: 'Strong', percent: 100, color: '#22C55E' };
    }
    return { label: 'Fair', percent: 75, color: '#3B82F6' };
  };

  const strength = getPasswordStrength(newPassword);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!currentPassword) {
      setError('Please enter your current password');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    setError('');
    setToastMessage('Security Credentials Updated Successfully! Returning to Profile...');
    setTimeout(() => {
      navigate('/profile');
    }, 2500);
  };

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Top Header Card */}
      <div
        className="glass-card"
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderLeft: '4px solid #FF6600',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <button
            type="button"
            className="icon-btn"
            onClick={() => navigate('/profile')}
            title="Back to Profile"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>
              Change Account Password
            </h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Sensitive Security Credential Update • Ridex Admin Portal
            </p>
          </div>
        </div>

        <div style={{ padding: '10px', borderRadius: '12px', background: 'rgba(255, 102, 0, 0.12)', color: '#FF6600' }}>
          <Lock size={24} />
        </div>
      </div>

      {/* Main Sensitive Form Card */}
      <div className="glass-card" style={{ padding: '28px' }}>
        {error && (
          <div className="login-error-alert" style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: 'center' }}>
            <AlertTriangle size={16} /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Current Password Field */}
          <div className="form-group">
            <label style={{ fontSize: '13px', fontWeight: '700' }}>Current Password *</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showCurrent ? 'text' : 'password'}
                required
                placeholder="Enter current active password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                style={{ paddingRight: '42px', height: '44px', fontSize: '14px' }}
              />
              <button
                type="button"
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', margin: '4px 0' }} />

          {/* New Password Field */}
          <div className="form-group">
            <label style={{ fontSize: '13px', fontWeight: '700' }}>New Strong Password *</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showNew ? 'text' : 'password'}
                required
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                style={{ paddingRight: '42px', height: '44px', fontSize: '14px' }}
              />
              <button
                type="button"
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Live Password Strength Indicator */}
            {newPassword && (
              <div style={{ marginTop: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11.5px', marginBottom: '4px' }}>
                  <span style={{ color: 'var(--text-muted)' }}>Strength Rating:</span>
                  <strong style={{ color: strength.color }}>{strength.label}</strong>
                </div>
                <div style={{ height: '6px', width: '100%', background: 'var(--bg-input)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${strength.percent}%`, background: strength.color, transition: 'all 0.3s' }} />
                </div>
              </div>
            )}
          </div>

          {/* Confirm New Password Field */}
          <div className="form-group">
            <label style={{ fontSize: '13px', fontWeight: '700' }}>Confirm New Password *</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirm ? 'text' : 'password'}
                required
                placeholder="Re-type new password to confirm"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                style={{ paddingRight: '42px', height: '44px', fontSize: '14px' }}
              />
              <button
                type="button"
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-muted)',
                  cursor: 'pointer',
                }}
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Security Recommendations Guidelines Box */}
          <div
            style={{
              background: 'var(--bg-input)',
              border: '1px solid var(--border-color)',
              padding: '14px 16px',
              borderRadius: '12px',
              fontSize: '12.5px',
            }}
          >
            <div style={{ fontWeight: '700', color: 'var(--text-primary)', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck size={16} color="#FF6600" /> Password Security Guidelines:
            </div>
            <ul style={{ paddingLeft: '20px', color: 'var(--text-muted)', lineHeight: '1.6' }}>
              <li>Minimum 8 characters in length.</li>
              <li>Include uppercase (`A-Z`) and lowercase (`a-z`) letters.</li>
              <li>Include at least one numerical digit (`0-9`) and symbol (`@, #, $, %`).</li>
              <li>Do not reuse previous credentials or simple sequential terms.</li>
            </ul>
          </div>

          {/* Submit Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '10px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/profile')}
              style={{ padding: '10px 20px' }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ padding: '10px 24px', fontSize: '14px', fontWeight: '700' }}
            >
              <Key size={16} /> Update Password Now
            </button>
          </div>
        </form>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="toast-container">
          <div className="toast success">
            <CheckCircle size={18} /> {toastMessage}
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangePassword;
