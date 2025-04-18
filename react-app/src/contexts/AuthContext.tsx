"use client"

import { signOut as firebaseSignOut, onAuthStateChanged } from "firebase/auth"
import type React from "react"
import { createContext, useEffect, useState } from "react"
import { auth } from "../firebase/config"

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
  firebaseUser: any
  login: (user: User, token: string) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  firebaseUser: null,
  login: () => {},
  logout: () => {},
  isAuthenticated: false,
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [firebaseUser, setFirebaseUser] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)

  useEffect(() => {
    // Check if user is stored in localStorage
    const storedUser = localStorage.getItem("user")
    const storedToken = localStorage.getItem("authToken")

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser))
      setToken(storedToken)
      setIsAuthenticated(true)
    }

    // Listen for Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setFirebaseUser(firebaseUser)
    })

    return () => unsubscribe()
  }, [])

  const login = (userData: User, authToken: string) => {
    setUser(userData)
    setToken(authToken)
    setIsAuthenticated(true)
    localStorage.setItem("user", JSON.stringify(userData))
    localStorage.setItem("authToken", authToken)
  }

  const logout = async () => {
    // Sign out from Firebase
    try {
      await firebaseSignOut(auth)
    } catch (error) {
      console.error("Firebase sign out error:", error)
    }

    // Clear local state
    setUser(null)
    setToken(null)
    setIsAuthenticated(false)
    localStorage.removeItem("user")
    localStorage.removeItem("authToken")
  }

  return (
    <AuthContext.Provider value={{ user, token, firebaseUser, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
