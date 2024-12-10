import AuthContext from '../contexts/AuthContext';
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout(); 
    navigate('/login');
  };

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and Brand */}
        <div className="text-xl font-bold">
          <Link to="/" className="hover:text-blue-400">Library System</Link>
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-6">
          {/* Show these links if the user is not authenticated */}
          {!isAuthenticated && (
            <>
              <li>
                <Link to="/login" className="hover:text-blue-400 transition duration-300">Login</Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-blue-400 transition duration-300">Register</Link>
              </li>
            </>
          )}

          {/* Show these links if the user is authenticated */}
          {isAuthenticated && (
            <>
              <li>
                <Link to="/" className="hover:text-blue-400 transition duration-300">Home</Link>
              </li>
              <li>
                <Link to="/search" className="hover:text-blue-400 transition duration-300">Search Media</Link>
              </li>
             
              <li>
                <Link to="/borrowed-media" className="hover:text-blue-400 transition duration-300">Borrowed Media</Link>
              </li>
              <li>
                <Link to="/notifications" className="hover:text-blue-400 transition duration-300">Notifications</Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-blue-400 transition duration-300">Profile</Link>
              </li>
              {user?.role === 'BRANCH_MANAGER' && (
                <>
                  <li>
                    <Link to="/branch-manager/inventory" className="hover:text-blue-400 transition duration-300">Branch Inventory</Link>
                  </li>
                  <li>
                    <Link to="/branch-manager/transfer" className="hover:text-blue-400 transition duration-300">Transfer Media</Link>
                  </li>
                </>
              )}
              <li>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-700 text-white px-6 py-2 rounded-full transition duration-300"
                >
                  Logout
                </button>
              </li>
            </>
          )}
        </ul>
      </div>
    </nav>
  );
};

export default Navbar;
