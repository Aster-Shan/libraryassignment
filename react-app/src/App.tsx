import React, { useContext } from 'react';
import { Navigate, BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthContext from './contexts/AuthContext';
import BorrowedMedia from './components/BorrowedMedia';
import InventoryManagement from './components/InventoryManagement';
import ForgetPassword from './components/ForgetPassword';
import Home from './components/Home';
import Login from './components/Login';
import MediaSearch from './components/MediaSearch';
import MediaCirculationManagement from './components/MediaCirculationManagement';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import Register from './components/Register';
import EmailVerification from './components/EmailVerification';
import BorrowMedia from './components/BorrowMedia';
import Notifications from './components/Notifications';

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
                          {/* User-specific Routes */}
                          {!isBranchManager && (
                              <>
                                  <Route path="/" element={<Home />} />
                                  <Route path="/search" element={<MediaSearch />} />
                                  <Route path="/profile" element={<Profile />} />
                                  <Route path="/borrowed-media" element={<BorrowedMedia />} />
                                  <Route path="/borrow-media" element={<BorrowMedia />} />
                                  <Route path="/notifications" element={<Notifications />} />
                              </>
                          )}

                          {/* Manager-specific Routes */}
                          {isBranchManager && (
                              <>
                                  <Route path="/inventory" element={<InventoryManagement />} />
                                  <Route path="/media-circulation" element={<MediaCirculationManagement />} />
                                  {/* Default redirect for managers */}
                                  <Route path="/" element={<Navigate to="/inventory" replace />} />
                                  <Route path="/search" element={<Navigate to="/inventory" replace />} />
                                  <Route path="/profile" element={<Navigate to="/inventory" replace />} />
                                  <Route path="/borrowed-media" element={<Navigate to="/inventory" replace />} />
                                  <Route path="/borrow-media" element={<Navigate to="/inventory" replace />} />
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
