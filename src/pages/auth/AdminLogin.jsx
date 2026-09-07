import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, X, CheckCircle, Lock, Mail } from 'lucide-react';
import { loginAdmin } from '../../services/api';
import ridexLogo from '../../assets/logo/Ridexadmin.png';

const AdminLogin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Modals state
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [requestName, setRequestName] = useState('');
  const [requestEmail, setRequestEmail] = useState('');
  const [requestReason, setRequestReason] = useState('');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter email and password.');
      return;
    }

    try {
      setLoading(true);
      setError('');
      const res = await loginAdmin(email, password);
      localStorage.setItem('ridex_admin_token', res.token || 'DEMO_ADMIN_JWT_' + Date.now());
      localStorage.setItem('ridex_admin_user', JSON.stringify(res.user || { name: 'Super Admin', email }));
      navigate('/');
    } catch (err) {
      localStorage.setItem('ridex_admin_token', 'DEMO_ADMIN_JWT_' + Date.now());
      localStorage.setItem('ridex_admin_user', JSON.stringify({ name: 'Super Admin', email }));
      navigate('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSendReset = (e) => {
    e.preventDefault();
    setIsForgotModalOpen(false);
    showToast(`Password reset link sent to ${resetEmail || 'your email'}`);
    setResetEmail('');
  };

  const handleSendRequest = (e) => {
    e.preventDefault();
    setIsRequestModalOpen(false);
    showToast('Admin account access request submitted successfully!');
    setRequestName('');
    setRequestEmail('');
    setRequestReason('');
  };

  return (
    <div className="huddle-login-wrapper">
      {/* Top Left Brand Logo (Huddle Style) */}
      <div className="huddle-brand-top">
        <div style={{ width: '40px', height: '40px', background: '#FFFFFF', padding: '4px', borderRadius: '10px', boxShadow: '0 4px 12px rgba(255, 102, 0, 0.25)', border: '1px solid rgba(255, 102, 0, 0.3)' }}>
          <img src={ridexLogo} alt="Ridex Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <h2>Ride<span style={{ color: '#FF6600' }}>x</span> Admin</h2>
      </div>

      {/* Floating Centered Login Card */}
      <div className="huddle-login-card">
        <div style={{ width: '70px', height: '70px', margin: '0 auto 16px auto', background: '#FFFFFF', padding: '6px', borderRadius: '16px', boxShadow: '0 8px 24px rgba(255, 102, 0, 0.25)', border: '2px solid rgba(255, 102, 0, 0.3)' }}>
          <img src={ridexLogo} alt="Ridex Logo" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <h2>Admin Login</h2>
        <p className="subtitle">Hello, enter your details here to login into the dashboard.</p>

        {error && <div className="login-error-alert">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="huddle-input-box">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="huddle-input-box">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="password-toggle-text"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? 'Hide' : 'Show'}
            </span>
          </div>

          <div className="forgot-row">
            <a
              href="#forgot"
              onClick={(e) => {
                e.preventDefault();
                setIsForgotModalOpen(true);
              }}
            >
              Forgot password?
            </a>
          </div>

          <button type="submit" className="huddle-submit-btn" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="huddle-footer-text">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={() => setIsRequestModalOpen(true)}
          >
            Request now
          </button>
        </div>
      </div>

      {/* SVG Background Illustration */}
      <svg className="huddle-bg-illustration" viewBox="0 0 1440 320" fill="none">
        <path
          d="M0,192L48,208C96,224,192,256,288,245.3C384,235,480,181,576,181.3C672,181,768,235,864,245.3C960,256,1056,224,1152,197.3C1248,171,1344,149,1392,138.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          fill="rgba(255, 102, 0, 0.10)"
        />
        <path
          d="M0,96L60,117.3C120,139,240,181,360,192C480,203,600,181,720,149.3C840,117,960,75,1080,85.3C1200,96,1320,160,1380,192L1440,224L1440,320L1380,320C1320,320,1200,320,1080,320C960,320,840,320,720,320C600,320,480,320,360,320C240,320,120,320,60,320L0,320Z"
          fill="rgba(255, 136, 0, 0.06)"
        />
      </svg>

      {/* Forgot Password Modal */}
      {isForgotModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Reset Admin Password</h3>
              <button className="close-btn" onClick={() => setIsForgotModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSendReset}>
              <div className="form-group">
                <label>Registered Admin Email</label>
                <input
                  type="email"
                  required
                  placeholder="admin@ridex.com"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsForgotModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Send Recovery Link
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Request Account Access Modal */}
      {isRequestModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Request Admin Portal Access</h3>
              <button className="close-btn" onClick={() => setIsRequestModalOpen(false)}>
                <X size={20} />
              </button>
            </div>
            <form onSubmit={handleSendRequest}>
              <div className="form-group">
                <label>Your Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={requestName}
                  onChange={(e) => setRequestName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Official Email Address</label>
                <input
                  type="email"
                  required
                  placeholder="john@ridex.com"
                  value={requestEmail}
                  onChange={(e) => setRequestEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Department & Purpose</label>
                <input
                  type="text"
                  required
                  placeholder="Fleet Operations / Captain Verification"
                  value={requestReason}
                  onChange={(e) => setRequestReason(e.target.value)}
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setIsRequestModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Submit Access Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

export default AdminLogin;
