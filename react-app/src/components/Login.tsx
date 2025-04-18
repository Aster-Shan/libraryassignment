"use client"

import { signInWithEmailAndPassword } from "firebase/auth"
import type React from "react"
import { useContext, useState } from "react"
import { useNavigate } from "react-router-dom"
import apiClient from "../apiClient"; // Use the centralized API client
import AuthContext from "../contexts/AuthContext"
import { auth } from "../firebase/config"

const Login: React.FC = () => {
  const [credentials, setCredentials] = useState({ email: "", password: "" })
  const [mfaCode, setMfaCode] = useState("")
  const [error, setError] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [requiresMfa, setRequiresMfa] = useState(false)
  const { login } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // Step 1: Authenticate with Firebase first
      console.log("Authenticating with Firebase...")
      const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password)
      console.log("Firebase authentication successful")

      // Step 2: Get Firebase token
      const firebaseToken = await userCredential.user.getIdToken(true)
      console.log(`Firebase token obtained (first 20 chars): ${firebaseToken.substring(0, 20)}...`)

      // Step 3: Authenticate with backend
      console.log("Authenticating with backend...")

      const requestBody = {
        email: credentials.email,
        password: credentials.password,
        firebaseToken,
        mfaCode: mfaCode || null,
      }

      console.log("Request body (without showing full token):", {
        ...requestBody,
        firebaseToken: firebaseToken.substring(0, 20) + "...",
      })

      const response = await apiClient.post("/api/auth/login", requestBody)

      console.log("Auth endpoint response:", response.data)

      // Check for MFA requirement
      if (response.data.message === "2FA code required") {
        console.log("MFA required for login")
        setRequiresMfa(true)
        setIsLoading(false)
        return
      }

      const { token: authToken, user } = response.data

      if (authToken && user) {
        console.log("Login successful, storing token and user data")
        login(user, authToken)
        navigate("/")
      } else {
        console.error("Login failed: No token or user returned", response.data)
        setError(response.data.message || "Login failed: Invalid response from server")
      }
    } catch (error: any) {
      console.error("Login error:", error)

      if (error.response) {
        // Axios error with response
        console.log("Error status:", error.response.status)
        console.log("Error data:", error.response.data)
        console.log("Error headers:", error.response.headers)

        // Check if the error is related to MFA
        if (error.response.data?.message === "2FA code required") {
          setRequiresMfa(true)
          setIsLoading(false)
          return
        }

        setError(error.response.data?.message || "Login failed")
      } else if (error.code) {
        // Firebase error
        if (error.code === "auth/wrong-password" || error.code === "auth/user-not-found") {
          setError("Invalid email or password")
        } else if (error.code === "auth/too-many-requests") {
          setError("Too many failed login attempts. Please try again later.")
        } else {
          setError(`Firebase error: ${error.message}`)
        }
      } else {
        // Other error
        setError("An unexpected error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <h1 className="mt-10 text-center text-2xl font-bold tracking-tight text-gray-900">Sign in to your account</h1>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-900">
              Email address
            </label>
            <div className="mt-2">
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Password
              </label>
              <div className="text-sm">
                <a href="/forgot-password" className="font-semibold text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>
            </div>
            <div className="mt-2">
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          {requiresMfa && (
            <div>
              <label htmlFor="mfaCode" className="block text-sm font-medium text-gray-900">
                Authentication Code
              </label>
              <div className="mt-2">
                <input
                  type="text"
                  id="mfaCode"
                  value={mfaCode}
                  onChange={(e) => setMfaCode(e.target.value)}
                  required
                  placeholder="Enter 6-digit code from your authenticator app"
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          )}

          {error && (
            <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
              <strong>Error:</strong> {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              {isLoading ? "Signing in..." : requiresMfa ? "Verify Code" : "Sign in"}
            </button>
          </div>
        </form>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not a member?{" "}
          <a href="/register" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            Register
          </a>
        </p>
      </div>
    </main>
  )
}

export default Login
