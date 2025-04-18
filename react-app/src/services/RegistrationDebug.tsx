"use client"

import axios from "axios"
import { createUserWithEmailAndPassword } from "firebase/auth"
import type React from "react"
import { useState } from "react"
import { auth } from "../firebase/config"

const RegistrationDebug: React.FC = () => {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [logs, setLogs] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const addLog = (message: string) => {
    setLogs((prevLogs) => [...prevLogs, `${new Date().toISOString()}: ${message}`])
  }

  const handleFirebaseOnlyRegistration = async () => {
    if (!email || !password) {
      addLog("Email and password are required")
      return
    }

    setIsLoading(true)
    addLog(`Starting Firebase-only registration for ${email}`)

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      addLog(`Firebase registration successful for ${email}`)
      addLog(`Firebase UID: ${user.uid}`)
      addLog(`Email verified: ${user.emailVerified}`)

      // Get the token
      const token = await user.getIdToken()
      addLog(`Firebase token obtained (first 20 chars): ${token.substring(0, 20)}...`)
    } catch (error: any) {
      addLog(`Firebase registration error: ${error.code} - ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const handleBackendOnlyRegistration = async () => {
    if (!email || !name) {
      addLog("Email and name are required")
      return
    }

    setIsLoading(true)
    addLog(`Starting backend-only registration for ${email}`)

    try {
      const API_URL = "https://localhost:8443"
      const userData = {
        name,
        email,
        password: password || "testpassword123",
        address: "Test Address",
        phone: "1234567890",
        verified: false,
        status: "active",
        firebaseUid: "test-firebase-uid-" + Date.now(), // Dummy UID for testing
      }

      addLog(`Sending request to ${API_URL}/api/auth/register`)
      addLog(`Request body: ${JSON.stringify({ ...userData, password: "********" })}`)

      const response = await axios.post(`${API_URL}/api/auth/register`, userData, {
        headers: { "Content-Type": "application/json" },
        // For development with self-signed certificates
        ...(process.env.NODE_ENV === "development" && { httpsAgent: { rejectUnauthorized: false } }),
      })

      addLog(`Backend registration successful: ${JSON.stringify(response.data)}`)
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        addLog(`Backend registration error: ${error.message}`)
        addLog(`Error status: ${error.response?.status}`)
        addLog(`Error data: ${JSON.stringify(error.response?.data)}`)
      } else {
        addLog(`Unexpected error: ${error.message}`)
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleFullRegistration = async () => {
    if (!email || !password || !name) {
      addLog("Email, password, and name are required")
      return
    }

    setIsLoading(true)
    addLog(`Starting full registration flow for ${email}`)

    try {
      // Step 1: Firebase registration
      addLog("Creating user in Firebase...")
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      addLog("Firebase registration successful")

      // Step 2: Get Firebase UID
      const firebaseUid = userCredential.user.uid
      addLog(`Firebase UID obtained: ${firebaseUid}`)

      // Step 3: Backend registration
      const API_URL = "https://localhost:8443"
      const userData = {
        name,
        email,
        password,
        address: "Test Address",
        phone: "1234567890",
        verified: false,
        status: "active",
        firebaseUid,
      }

      addLog(`Registering with backend at ${API_URL}/api/auth/register`)
      addLog(`Request body: ${JSON.stringify({ ...userData, password: "********" })}`)

      const response = await axios.post(`${API_URL}/api/auth/register`, userData, {
        headers: { "Content-Type": "application/json" },
        // For development with self-signed certificates
        ...(process.env.NODE_ENV === "development" && { httpsAgent: { rejectUnauthorized: false } }),
      })

      addLog(`Backend registration successful: ${JSON.stringify(response.data)}`)
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        addLog(`Backend registration error: ${error.message}`)
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
      <h1 className="text-2xl font-bold mb-6">Registration Debugging Tool</h1>

      <div className="mb-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Test Registration</h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="Enter email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="Enter password"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="Enter name"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <button
            onClick={handleFirebaseOnlyRegistration}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            Test Firebase Only
          </button>

          <button
            onClick={handleBackendOnlyRegistration}
            disabled={isLoading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:bg-gray-400"
          >
            Test Backend Only
          </button>

          <button
            onClick={handleFullRegistration}
            disabled={isLoading}
            className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:bg-gray-400"
          >
            Test Full Registration Flow
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
            <h3 className="font-medium text-gray-900">
              If Firebase registration works but backend registration fails:
            </h3>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Check if your backend API is running and accessible</li>
              <li>Verify that your CORS configuration is correct</li>
              <li>Check if your backend is properly handling the request</li>
              <li>Verify that your database connection is working</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">If both Firebase and backend registration fail:</h3>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>Check your network connection</li>
              <li>Verify that your Firebase project is properly configured</li>
              <li>Check if your backend is running and accessible</li>
            </ul>
          </div>

          <div>
            <h3 className="font-medium text-gray-900">Common backend errors:</h3>
            <ul className="list-disc pl-6 mt-2 space-y-1">
              <li>
                <strong>400 Bad Request</strong> - Invalid request data
              </li>
              <li>
                <strong>401 Unauthorized</strong> - Authentication issues
              </li>
              <li>
                <strong>403 Forbidden</strong> - Authorization issues
              </li>
              <li>
                <strong>500 Internal Server Error</strong> - Backend server error
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegistrationDebug
