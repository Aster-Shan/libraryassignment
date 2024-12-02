import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import BorrowedMedia from './components/BorrowedMedia';
import BranchManagerInventory from './components/BranchManagerInventory';
import ForgetPassword from './components/ForgetPassword';
import Home from './components/Home';
import Login from './components/Login';
import MediaSearch from './components/MediaSearch';
import MediaTransfer from './components/MediaTransfer';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import Register from './components/Register';

const App: React.FC = () => {
  const isAuthenticated = !!localStorage.getItem('user');
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const isBranchManager = user.role === 'BRANCH_MANAGER';

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />

          {/* Protected Routes for Authenticated Users */}
          {isAuthenticated && (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<MediaSearch />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/borrowed-media" element={<BorrowedMedia />} />
              {isBranchManager && (
                <>
                  <Route path="/branch-manager/inventory" element={<BranchManagerInventory />} />
                  <Route path="/branch-manager/transfer" element={<MediaTransfer />} />
                </>
              )}
            </>
          )}

          {/* Catch-all Route: Redirect any undefined route to login if not authenticated */}
          <Route path="*" element={!isAuthenticated ? <Navigate to="/login" replace /> : <Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
