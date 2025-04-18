"use client"

import type React from "react"
import { createContext, useEffect, useState, type ReactNode } from "react"

interface User {
  id: number
  email: string
  name: string
  role: string
  mfaEnabled?: boolean
}

interface AuthContextType {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (user: User, token: string) => void
  logout: () => void
}

const defaultContext: AuthContextType = {
  user: null,
  token: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
}

const AuthContext = createContext<AuthContextType>(defaultContext)

interface AuthProviderProps {
  children: ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  // Load user and token from localStorage on initial render
  useEffect(() => {
    const storedToken = localStorage.getItem("token")
    const storedUser = localStorage.getItem("user")

    if (storedToken && storedUser) {
      try {
        setToken(storedToken)
        setUser(JSON.parse(storedUser))
        setIsAuthenticated(true)
      } catch (error) {
        console.error("Error parsing stored user:", error)
        // Clear invalid data
        localStorage.removeItem("token")
        localStorage.removeItem("user")
      }
    }

    setLoading(false)
  }, [])

  const login = (userData: User, authToken: string) => {
    setUser(userData)
    setToken(authToken)
    setIsAuthenticated(true)

    // Store in localStorage
    localStorage.setItem("token", authToken)
    localStorage.setItem("user", JSON.stringify(userData))
  }

  const logout = () => {
    setUser(null)
    setToken(null)
    setIsAuthenticated(false)

    // Clear localStorage
    localStorage.removeItem("token")
    localStorage.removeItem("user")
  }

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export default AuthContext
