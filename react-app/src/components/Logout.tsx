import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.removeItem('user');
    navigate('/');
  }, [navigate]);

  return <div>Logging out...</div>;
};

export default Logout;