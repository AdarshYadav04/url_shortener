import { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import AuthModal from '../AuthModal/AuthModal.jsx';
import axios from 'axios';
import './Navbar.css';

const ChangePasswordModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Validation
    if (!formData.oldPassword || !formData.newPassword || !formData.confirmNewPassword) {
      setError('All fields are required');
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmNewPassword) {
      setError('New password and confirm password do not match');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('New password must be at least 8 characters long');
      setLoading(false);
      return;
    }

    try {
      const config = {
        withCredentials: true,
        headers: {
          'Content-Type': 'application/json',
        },
      };

      const response = await axios.put(
        'http://localhost:8080/api/user/password',
        {
          oldPassword: formData.oldPassword,
          newPassword: formData.newPassword
        },
        config
      );

      if (response.data.success || response.status === 200) {
        setSuccess('Password changed successfully!');
        setFormData({
          oldPassword: '',
          newPassword: '',
          confirmNewPassword: ''
        });
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } catch (error) {
      const message = error?.response?.data?.message || error?.response?.data?.error || 'Failed to change password. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="auth-modal-backdrop" onClick={handleBackdropClick}>
      <div className="auth-modal">
        <div className="auth-modal-header">
          <h2>Change Password</h2>
          <button className="close-button" onClick={onClose}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>

        <div className="auth-modal-body">
          <form onSubmit={handleSubmit} className="auth-form">
            {error && (
              <div className="error-message">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <line x1="15" y1="9" x2="9" y2="15" stroke="currentColor" strokeWidth="2"/>
                  <line x1="9" y1="9" x2="15" y2="15" stroke="currentColor" strokeWidth="2"/>
                </svg>
                {error}
              </div>
            )}

            {success && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.75rem 1rem',
                background: 'rgba(34, 197, 94, 0.1)',
                color: '#22c55e',
                borderRadius: '0.5rem',
                fontSize: '0.875rem',
                border: '1px solid rgba(34, 197, 94, 0.2)'
              }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                {success}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="oldPassword">Old Password</label>
              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                value={formData.oldPassword}
                onChange={handleInputChange}
                required
                placeholder="Enter your current password"
              />
            </div>

            <div className="form-group">
              <label htmlFor="newPassword">New Password</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={formData.newPassword}
                onChange={handleInputChange}
                required
                placeholder="Enter your new password"
                minLength="8"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmNewPassword">Confirm New Password</label>
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                value={formData.confirmNewPassword}
                onChange={handleInputChange}
                required
                placeholder="Confirm your new password"
                minLength="8"
              />
            </div>

            <button 
              type="submit" 
              className="btn btn-primary auth-submit"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="loading"></span>
                  Changing Password...
                </>
              ) : (
                'Change Password'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

const Navbar = () => {
  const { token,setToken } = useAuth(); 
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const dropdownRef = useRef(null);
  const avatarRef = useRef(null);
  const navigate=useNavigate()


  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('https://short-ly-2njz.onrender.com/api/user/profile', {
          credentials: 'include'
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error('User fetch error:', error);
        setUser(null);
      }
    };
    fetchUser();
  }, [token]);

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target)
      ) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAuthClick = (mode) => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const handleLogout = async () => {
    try {
      await fetch('https://short-ly-2njz.onrender.com/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      setUser(null);
      setToken(false);
      setShowUserMenu(false);
      navigate("/")
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          <Link to="/" className="navbar-brand">
            <div className="brand-icon">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" stroke="currentColor" strokeWidth="2" />
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <span>ShortLink</span>
          </Link>

          <div className="navbar-menu">
            {user ? (
              <>
                <Link
                  to="/dashboard"
                  className={`navbar-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
                >
                  Dashboard
                </Link>
                <div className="user-menu-wrapper">
                  <button
                    className="user-menu-trigger"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    ref={avatarRef}
                  >
                    <div className="user-avatar">
                      {user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <span className="user-name">{user?.name || 'User'}</span>
                    <svg className={`chevron ${showUserMenu ? 'open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </button>

                  {showUserMenu && (
                    <div className="user-dropdown" ref={dropdownRef}>
                      <div className="user-info">
                        <p className="user-email">{user?.email}</p>
                      </div>
                      <hr />
                      <button 
                        onClick={() => {
                          setShowChangePasswordModal(true);
                          setShowUserMenu(false);
                        }} 
                        className="dropdown-item"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        Change Password
                      </button>
                      <button onClick={handleLogout} className="dropdown-item logout">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" />
                          <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" />
                          <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="auth-buttons">
                <button className="btn btn-secondary" onClick={() => handleAuthClick('login')}>
                  Login
                </button>
                <button className="btn btn-primary" onClick={() => handleAuthClick('signup')}>
                  Sign Up
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {showAuthModal && (
        <AuthModal
          mode={authMode}
          onClose={() => setShowAuthModal(false)}
          onSwitchMode={setAuthMode}
        />
      )}

      {showChangePasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowChangePasswordModal(false)}
        />
      )}
    </>
  );
};

export default Navbar;
