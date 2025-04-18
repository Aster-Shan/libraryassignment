"use client"

import axios from "axios"
import type React from "react"
import { useState } from "react"

const UserDatabaseCheck: React.FC = () => {
  const [email, setEmail] = useState("")
  const [adminEmail, setAdminEmail] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [userDetails, setUserDetails] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const checkUser = async () => {
    if (!email || !adminEmail || !adminPassword) {
      setError("Please fill in all fields")
      return
    }

    setLoading(true)
    setError(null)
    setUserDetails(null)

    try {
      // First authenticate as admin
      const authResponse = await axios.post(
        "https://localhost:8443/api/auth/admin-login",
        {
          email: adminEmail,
          password: adminPassword,
        },
        {
          headers: { "Content-Type": "application/json" },
          ...(process.env.NODE_ENV === "development" && { httpsAgent: { rejectUnauthorized: false } }),
        },
      )

      const adminToken = authResponse.data.token

      if (!adminToken) {
        setError("Admin authentication failed")
        setLoading(false)
        return
      }

      // Then fetch user details
      const userResponse = await axios.get(`https://localhost:8443/api/users/by-email/${email}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${adminToken}`,
        },
        ...(process.env.NODE_ENV === "development" && { httpsAgent: { rejectUnauthorized: false } }),
      })

      setUserDetails(userResponse.data)
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        setError(`Error: ${error.response?.data?.message || error.message}`)
      } else {
        setError(`Unexpected error: ${error.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">User Database Check</h1>

      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Check User in Database</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">User Email to Check</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="user@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Email</label>
            <input
              type="email"
              value={adminEmail}
              onChange={(e) => setAdminEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Admin Password</label>
            <input
              type="password"
              value={adminPassword}
              onChange={(e) => setAdminPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="Admin password"
            />
          </div>

          <button
            onClick={checkUser}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
          >
            {loading ? "Checking..." : "Check User"}
          </button>
        </div>

        {error && <div className="mt-4 p-3 bg-red-100 text-red-700 rounded">{error}</div>}
      </div>

      {userDetails && (
        <div className="bg-white p-4 rounded shadow">
          <h2 className="text-lg font-semibold mb-4">User Details</h2>

          <div className="bg-gray-100 p-4 rounded overflow-auto">
            <pre className="whitespace-pre-wrap">{JSON.stringify(userDetails, null, 2)}</pre>
          </div>

          <div className="mt-4 space-y-2">
            <div className="p-3 bg-yellow-100 text-yellow-800 rounded">
              <strong>Firebase UID:</strong> {userDetails.firebaseUid || "Not set"}
            </div>

            <div className="p-3 bg-green-100 text-green-800 rounded">
              <strong>Verified:</strong> {userDetails.verified ? "Yes" : "No"}
            </div>

            <div className="p-3 bg-blue-100 text-blue-800 rounded">
              <strong>MFA Enabled:</strong> {userDetails.mfaEnabled ? "Yes" : "No"}
            </div>
          </div>
        </div>
      )}

      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Common Issues</h2>

        <div className="space-y-4">
          <div className="p-3 border-l-4 border-red-500 bg-red-50">
            <h3 className="font-medium text-red-800">Missing Firebase UID</h3>
            <p className="text-red-700">
              If the Firebase UID is missing or doesn't match the one from Firebase, authentication will fail.
            </p>
          </div>

          <div className="p-3 border-l-4 border-yellow-500 bg-yellow-50">
            <h3 className="font-medium text-yellow-800">User Not Verified</h3>
            <p className="text-yellow-700">
              If the user is not marked as verified in the database, they won't be able to log in.
            </p>
          </div>

          <div className="p-3 border-l-4 border-blue-500 bg-blue-50">
            <h3 className="font-medium text-blue-800">Password Mismatch</h3>
            <p className="text-blue-700">
              The password in your database might not match the one you're using with Firebase.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UserDatabaseCheck
