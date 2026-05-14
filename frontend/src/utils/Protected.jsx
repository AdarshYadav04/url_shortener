import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { API_BASE } from '../config/apiBase.js';

const Protected = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // NEW

  useEffect(() => {
    const fetchUser = async () => {
      if (!API_BASE) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(`${API_BASE}/api/user/profile`, {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false); 
      }
    };

    fetchUser();
  }, []);

  if (loading) return <div></div>;

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default Protected;
