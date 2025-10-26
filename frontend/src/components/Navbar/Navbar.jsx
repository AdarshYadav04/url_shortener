import { useEffect, useState, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import AuthModal from '../AuthModal/AuthModal.jsx';
import './Navbar.css';

const Navbar = () => {
  const { token,setToken } = useAuth(); 
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [showUserMenu, setShowUserMenu] = useState(false);
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
    </>
  );
};

export default Navbar;
