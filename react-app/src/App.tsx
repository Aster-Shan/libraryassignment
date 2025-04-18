"use client"

import type React from "react"
import { useContext } from "react"
import { Navigate, Route, BrowserRouter as Router, Routes } from "react-router-dom"
import BorrowedMedia from "./components/BorrowedMedia"
import BorrowMedia from "./components/BorrowMedia"
import ChangePassword from "./components/ChangePassword"
import EmailVerification from "./components/EmailVerification"
import ForgetPassword from "./components/ForgetPassword"
import Home from "./components/Home"
import InventoryManagement from "./components/InventoryManagement"
import Login from "./components/Login"
import MediaCirculationManagement from "./components/MediaCirculationManagement"
import MediaSearch from "./components/MediaSearch"
import MfaManagement from "./components/MfaManagement"
import MfaSetup from "./components/MfaSetup"
import Navbar from "./components/Navbar"
import Notifications from "./components/Notifications"
import Profile from "./components/Profile"
import ProtectedRoute from "./components/ProtectedRoute"
import Register from "./components/Register"
import AuthContext from "./contexts/AuthContext"

// Import debugging tools
import LoginDebug from "./components/LoginDebug"
import PasswordResetTool from "./utils/PasswordResetTool"
import UserDatabaseCheck from "./utils/UserDatabaseCheck"

const App: React.FC = () => {
  const { isAuthenticated, user } = useContext(AuthContext)
  const isBranchManager = user?.role === "BRANCH_MANAGER"

  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === "development"

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

          {/* Protected MFA & Password Routes */}
          <Route
            path="/mfa-setup"
            element={
              <ProtectedRoute>
                <MfaSetup />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mfa-management"
            element={
              <ProtectedRoute>
                <MfaManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />

          {/* Debug Tools - Only available in development mode */}
          {isDevelopment && (
            <>
              <Route path="/debug/login" element={<LoginDebug />} />
              <Route path="/debug/user-check" element={<UserDatabaseCheck />} />
              <Route path="/debug/password-reset" element={<PasswordResetTool />} />
            </>
          )}

          {/* Protected Main Routes */}
          {isAuthenticated && (
            <>
              {!isBranchManager ? (
                <>
                  <Route path="/" element={<Home />} />
                  <Route path="/search" element={<MediaSearch />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/borrowed-media" element={<BorrowedMedia />} />
                  <Route path="/borrow-media" element={<BorrowMedia />} />
                  <Route path="/notifications" element={<Notifications />} />
                </>
              ) : (
                <>
                  <Route path="/inventory" element={<InventoryManagement />} />
                  <Route path="/media-circulation" element={<MediaCirculationManagement />} />
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
  )
}

export default App
