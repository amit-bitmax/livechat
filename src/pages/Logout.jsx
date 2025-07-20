// src/components/Logout.jsx
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  }, [navigate]);

  return null; // or a spinner
};

export default Logout;
