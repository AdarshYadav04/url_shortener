import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';

const Protected = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true); // NEW

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('http://localhost:8080/api/user/profile', {
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
