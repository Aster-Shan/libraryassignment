import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isAuthenticated = !!user.id;
  const isBranchManager = user.role === 'BRANCH_MANAGER';

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <nav>
      <ul>

        {!isAuthenticated && (
          <>
           
          </>
        )}
        {isAuthenticated && (
          <>
           <li><Link to="/register">Register</Link></li>
           <li><Link to="/login">Login</Link></li>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/search">Search Media</Link></li>
            <li><Link to="/profile">Profile</Link></li>
            <li><Link to="/borrowed-media">Borrowed Media</Link></li>
            <li><Link to="/notifications">Notifications</Link></li>
            {isBranchManager && (
              <>
                <li><Link to="/branch-manager/inventory">Branch Inventory</Link></li>
                <li><Link to="/branch-manager/transfer">Transfer Media</Link></li>
              </>
            )}
            <li><button onClick={handleLogout}>Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;

