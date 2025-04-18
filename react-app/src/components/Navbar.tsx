"use client"

import type React from "react"
import { useContext, useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import AuthContext from "../contexts/AuthContext"

const Navbar: React.FC = () => {
  const navigate = useNavigate()
  const { user, isAuthenticated, logout } = useContext(AuthContext)
  const [showDebugMenu, setShowDebugMenu] = useState(false)

  // Check if we're in development mode
  const isDevelopment = process.env.NODE_ENV === "development"

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <nav className="bg-gray-900 text-white p-4 shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo and Brand */}
        <div className="text-xl font-bold">
          <Link to="/" className="hover:text-blue-400">
            Library System
          </Link>
        </div>

        {/* Navigation Links */}
        <ul className="flex space-x-6 items-center">
          {/* Show these links if the user is not authenticated */}
          {!isAuthenticated && (
            <>
              <li>
                <Link to="/login" className="hover:text-blue-400 transition duration-300">
                  Login
                </Link>
              </li>
              <li>
                <Link to="/register" className="hover:text-blue-400 transition duration-300">
                  Register
                </Link>
              </li>
            </>
          )}

          {/* Show these links if the user is authenticated */}
          {isAuthenticated && (
            <>
              {user?.role != "BRANCH_MANAGER" && (
                <>
                  <li>
                    <Link to="/" className="hover:text-blue-400 transition duration-300">
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link to="/search" className="hover:text-blue-400 transition duration-300">
                      Search Media
                    </Link>
                  </li>

                  <li>
                    <Link to="/borrowed-media" className="hover:text-blue-400 transition duration-300">
                      Borrowed Media
                    </Link>
                  </li>
                  <li>
                    <Link to="/notifications" className="hover:text-blue-400 transition duration-300">
                      Notifications
                    </Link>
                  </li>
                  <li>
                    <Link to="/profile" className="hover:text-blue-400 transition duration-300">
                      Profile
                    </Link>
                  </li>
                  <li>
                    <Link to="/change-password" className="hover:text-blue-400 transition duration-300">
                      Password
                    </Link>
                  </li>
                </>
              )}
              {user?.role === "BRANCH_MANAGER" && (
                <>
                  <li>
                    <Link to="/inventory" className="hover:text-blue-400 transition duration-300">
                      Inventory
                    </Link>
                  </li>
                  <li>
                    <Link to="/media-circulation" className="hover:text-blue-400 transition duration-300">
                      Media Circulation
                    </Link>
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

          {/* Debug Tools Dropdown - Only in development mode */}
          {isDevelopment && (
            <li className="relative">
              <button
                onClick={() => setShowDebugMenu(!showDebugMenu)}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full transition duration-300 flex items-center"
              >
                Debug Tools
                <svg
                  className={`ml-2 h-4 w-4 transition-transform ${showDebugMenu ? "rotate-180" : ""}`}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              {showDebugMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md shadow-lg py-1 z-10">
                  <Link
                    to="/debug/login"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                    onClick={() => setShowDebugMenu(false)}
                  >
                    Login Debug
                  </Link>
                  <Link
                    to="/debug/user-check"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                    onClick={() => setShowDebugMenu(false)}
                  >
                    User Database Check
                  </Link>
                  <Link
                    to="/debug/password-reset"
                    className="block px-4 py-2 text-sm text-white hover:bg-gray-700"
                    onClick={() => setShowDebugMenu(false)}
                  >
                    Password Reset Tool
                  </Link>
                </div>
              )}
            </li>
          )}
        </ul>
      </div>
    </nav>
  )
}

export default Navbar
