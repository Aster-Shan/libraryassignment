import React from 'react';
import { Navigate, Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import BorrowedMedia from './components/BorrowedMedia';
import BranchManagerInventory from './components/BranchManagerInventory';
import Home from './components/Home';
import Login from './components/Login';
import MediaTransfer from './components/MediaTransfer';
import Navbar from './components/Navbar';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
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
          {!isAuthenticated && <Route path="*" element={<Navigate to="/login" replace />} />}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route 
            path="/" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Home />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/profile" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <Profile />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/borrowed-media" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated}>
                <BorrowedMedia />
              </ProtectedRoute>
            } 
          />

          <Route 
            path="/branch-manager/inventory" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated && isBranchManager}>
                <BranchManagerInventory />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/branch-manager/transfer" 
            element={
              <ProtectedRoute isAuthenticated={isAuthenticated && isBranchManager}>
                <MediaTransfer />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
