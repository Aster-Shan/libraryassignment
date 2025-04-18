"use client"

import React, { useState } from "react"
import { testBackendConnection, testLoginEndpoint } from "../services/backend-test"
import { getFirebaseUserDetails, monitorFirebaseAuth } from "../services/firebase-auth-debug"

const TroubleshootLogin: React.FC = () => {
  const [results, setResults] = useState<any>({})
  const [loading, setLoading] = useState<boolean>(false)
  const [email, setEmail] = useState<string>("")

  // Start monitoring Firebase auth state when component mounts
  React.useEffect(() => {
    monitorFirebaseAuth()
  }, [])

  const runConnectionTest = async () => {
    setLoading(true)
    setResults({ ...results, connection: "Testing..." })

    const connectionResult = await testBackendConnection()
    setResults({ ...results, connection: connectionResult })

    setLoading(false)
  }

  const runFirebaseTest = async () => {
    setLoading(true)
    setResults({ ...results, firebase: "Testing..." })

    const firebaseDetails = await getFirebaseUserDetails()
    setResults({ ...results, firebase: firebaseDetails || "Not signed in" })

    setLoading(false)
  }

  const runLoginTest = async () => {
    if (!email) {
      alert("Please enter an email address")
      return
    }

    setLoading(true)
    setResults({ ...results, login: "Testing..." })

    const loginResult = await testLoginEndpoint(email)
    setResults({ ...results, login: loginResult })

    setLoading(false)
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Login Troubleshooting</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Backend Connection Test</h2>
          <button
            onClick={runConnectionTest}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            Test Backend Connection
          </button>

          {results.connection && (
            <div className="mt-4 p-4 bg-gray-100 rounded overflow-auto max-h-60">
              <pre>{JSON.stringify(results.connection, null, 2)}</pre>
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">Firebase Authentication Test</h2>
          <button
            onClick={runFirebaseTest}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            Test Firebase Authentication
          </button>

          {results.firebase && (
            <div className="mt-4 p-4 bg-gray-100 rounded overflow-auto max-h-60">
              <pre>{JSON.stringify(results.firebase, null, 2)}</pre>
            </div>
          )}
        </div>

        <div className="bg-white p-4 rounded shadow md:col-span-2">
          <h2 className="text-lg font-semibold mb-4">Login Endpoint Test</h2>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="Enter your email"
            />
          </div>

          <button
            onClick={runLoginTest}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            Test Login Endpoint
          </button>

          {results.login && (
            <div className="mt-4 p-4 bg-gray-100 rounded overflow-auto max-h-60">
              <pre>{JSON.stringify(results.login, null, 2)}</pre>
            </div>
          )}
        </div>
      </div>

      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Troubleshooting Steps</h2>

        <ol className="list-decimal pl-6 space-y-2">
          <li>Check if your backend is running and accessible by testing the connection</li>
          <li>Verify that you're properly authenticated with Firebase</li>
          <li>Test the login endpoint to see the exact error format</li>
          <li>Check your browser console for detailed logs</li>
          <li>Verify that your backend's CORS settings allow requests from your frontend</li>
          <li>Make sure your SSL certificates are properly configured if using HTTPS</li>
          <li>Check if the Firebase UID in your database matches the one from Firebase</li>
          <li>Verify that the user is marked as verified in your database</li>
        </ol>
      </div>
    </div>
  )
}

export default TroubleshootLogin
