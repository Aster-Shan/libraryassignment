import React, { useContext } from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import AuthContext from './contexts/AuthContext';
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
import EmailVerification from './components/EmailVerification';
import BorrowMedia from './components/BorrowMedia';

const App: React.FC = () => {
  const { isAuthenticated, user } = useContext(AuthContext);
  const isBranchManager = user?.role === 'BRANCH_MANAGER';

  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />
          <Route path="/register" element={!isAuthenticated ? <Register /> : <Navigate to="/" />} />
          <Route path="/forgot-password" element={<ForgetPassword />} />
          <Route path="/verify-email" element={<EmailVerification />} />

          {/* Protected Routes */}
          {isAuthenticated && (
            <>
              <Route path="/" element={<Home />} />
              <Route path="/search" element={<MediaSearch />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/borrowed-media" element={<BorrowedMedia />} />
              <Route path="/borrow-media" element={<BorrowMedia />} />
              {isBranchManager && (
                <>
                  <Route path="/branch-manager/inventory" element={<BranchManagerInventory />} />
                  <Route path="/branch-manager/transfer" element={<MediaTransfer />} />
                </>
              )}
            </>
          )}

          {/* Catch-all Route */}
          <Route path="*" element={!isAuthenticated ? <Navigate to="/login" replace /> : <Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
