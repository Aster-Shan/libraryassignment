"use client"

import axios from "axios"
import { getAuth, signInWithEmailAndPassword } from "firebase/auth"
import type React from "react"
import { useState } from "react"

const LoginDebug: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [logs, setLogs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addLog = (message: string) => {
    setLogs((prevLogs) => [...prevLogs, `${new Date().toISOString()}: ${message}`])
  }

  const handleFirebaseOnlyLogin = async () => {
    setIsLoading(true)
    addLog(`Starting Firebase-only login for ${email}`)

    try {
      const auth = getAuth()
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      addLog(`Firebase login successful for ${email}`)
      addLog(`Firebase UID: ${user.uid}`)
      addLog(`Email verified: ${user.emailVerified}`)

      // Get the token
      const token = await user.getIdToken()
      addLog(`Firebase token obtained (first 20 chars): ${token.substring(0, 20)}...`)

      // Decode the token to see its contents (for debugging)
      try {
        // This is a simple way to decode the JWT without a library
        const tokenParts = token.split(".")
        const payload = JSON.parse(atob(tokenParts[1]))
        addLog(`Token payload: ${JSON.stringify(payload, null, 2)}`)
      } catch (e) {
        addLog(`Error decoding token: ${e}`)
      }
    } catch (error: any) {
      addLog(`Firebase login error: ${error.code} - ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackendOnlyLogin = async () => {
    setIsLoading(true)
    addLog(`Starting backend-only login for ${email}`)

    try {
      const apiUrl = "https://localhost:8443"

      // Try login without Firebase token
      addLog(`Sending request to ${apiUrl}/api/auth/login`)
      addLog(`Request body: ${JSON.stringify({ email, password })}`)

      const response = await axios.post(
        `${apiUrl}/api/auth/login`,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          // For development with self-signed certificates
          ...(process.env.NODE_ENV === "development" && { httpsAgent: { rejectUnauthorized: false } }),
        },
      )

      addLog(`Backend login successful: ${JSON.stringify(response.data)}`)
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        addLog(`Backend login error: ${error.message}`)
        addLog(`Error status: ${error.response?.status}`)
        addLog(`Error data: ${JSON.stringify(error.response?.data)}`)
      } else {
        addLog(`Unexpected error: ${error.message}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleFullLogin = async () => {
    setIsLoading(true)
    addLog(`Starting full login flow for ${email}`)

    try {
      // Step 1: Firebase authentication
      addLog("Authenticating with Firebase...")
      const auth = getAuth()
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      addLog("Firebase authentication successful")

      // Step 2: Get Firebase token
      const firebaseToken = await userCredential.user.getIdToken(true)
      addLog(`Firebase token obtained (first 20 chars): ${firebaseToken.substring(0, 20)}...`)

      // Step 3: Backend authentication
      const apiUrl = "https://localhost:8443"
      addLog(`Authenticating with backend at ${apiUrl}/api/auth/login`)

      const requestBody = {
        email,
        password,
        firebaseToken,
        mfaCode: null,
      }

      addLog(
        `Request body (without full token): ${JSON.stringify({
          ...requestBody,
          firebaseToken: firebaseToken.substring(0, 20) + "...",
        })}`,
      )

      const response = await axios.post(`${apiUrl}/api/auth/login`, requestBody, {
        headers: { "Content-Type": "application/json" },
        // For development with self-signed certificates
        ...(process.env.NODE_ENV === "development" && { httpsAgent: { rejectUnauthorized: false } }),
      })

      addLog(`Backend login successful: ${JSON.stringify(response.data)}`)
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        addLog(`Backend login error: ${error.message}`)
        addLog(`Error status: ${error.response?.status}`)
        addLog(`Error data: ${JSON.stringify(error.response?.data)}`)
      } else {
        addLog(`Unexpected error: ${error.message}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const clearLogs = () => {
    setLogs([])
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Login Debugging Tool</h1>

      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Test Credentials</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="Enter your password"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={handleFirebaseOnlyLogin}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            Test Firebase Only
          </button>

          <button
            onClick={handleBackendOnlyLogin}
            disabled={isLoading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            Test Backend Only
          </button>

          <button
            onClick={handleFullLogin}
            disabled={isLoading}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400"
          >
            Test Full Login Flow
          </button>

          <button onClick={clearLogs} className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600">
            Clear Logs
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold">Debug Logs</h2>
          {isLoading && <div className="text-blue-500">Loading...</div>}
        </div>

        <div className="bg-gray-100 p-4 rounded h-96 overflow-auto font-mono text-sm">
          {logs.length === 0 ? (
            <div className="text-gray-500">No logs yet. Run a test to see results.</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="mb-1">
                {log}
              </div>
            ))
          )}
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Troubleshooting Guide</h2>

        <div className="space-y-4">
          <div>
            <h3 className="font-medium text-gray-900">If Firebase login works but backend login fails:</h3>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Check if the user exists in your backend database</li>
              <li>Verify that the Firebase UID in your database matches the one from Firebase</li>
              <li>Check if the password in your database matches the one you're using</li>
              <li>Verify that the user is marked as verified in your database</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">If both Firebase and backend login fail:</h3>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Check your credentials</li>
              <li>Verify that your Firebase project is properly configured</li>
              <li>Check if your backend is running and accessible</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">Common backend errors:</h3>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong>"Invalid credentials"</strong> - User not found or password mismatch
              </li>
              <li>
                <strong>"Firebase authentication failed: UID mismatch"</strong> - Firebase UID doesn't match database
              </li>
              <li>
                <strong>"User inactive, please verify via e-mail"</strong> - User not verified
              </li>
              <li>
                <strong>"Firebase authentication required"</strong> - Missing or invalid Firebase token
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginDebug
