"use client"

import axios from "axios"
import type React from "react"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AuthContext from "../contexts/AuthContext"

const MfaManagement: React.FC = () => {
  const [mfaEnabled, setMfaEnabled] = useState<boolean>(false)
  const [verificationCode, setVerificationCode] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const { user, token } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || !token) {
      navigate("/login")
      return
    }

    const checkMfaStatus = async () => {
      try {
        const response = await axios.get(`/api/users/mfa/status?email=${user.email}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setMfaEnabled(response.data.enabled)
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || "Failed to check 2FA status")
        } else {
          setError("An unexpected error occurred")
        }
      }
    }

    checkMfaStatus()
  }, [user, token, navigate])

  const handleDisableMfa = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    try {
      const response = await axios.post(
        "/api/users/mfa/disable",
        {
          email: user?.email,
          code: verificationCode,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      )

      if (response.data.success) {
        setSuccess("Two-factor authentication has been disabled successfully!")
        setMfaEnabled(false)
        setVerificationCode("")
      } else {
        setError("Invalid verification code. Please try again.")
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Failed to disable 2FA")
      } else {
        setError("An unexpected error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSetupMfa = () => {
    navigate("/mfa-setup")
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Two-Factor Authentication</h1>

      {mfaEnabled ? (
        <div className="space-y-6">
          <div className="bg-green-100 border-l-4 border-green-500 p-4 mb-4">
            <p className="text-green-700">
              <strong>Enabled:</strong> Your account is protected with two-factor authentication.
            </p>
          </div>

          <form onSubmit={handleDisableMfa} className="space-y-4">
            <p className="text-gray-700">
              To disable two-factor authentication, please enter the verification code from your authenticator app.
            </p>

            <div>
              <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <input
                type="text"
                id="verificationCode"
                name="verificationCode"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code"
                required
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>

            {error && (
              <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
                <strong>Error:</strong> {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4">
                <strong>Success:</strong> {success}
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              {isLoading ? "Disabling..." : "Disable 2FA"}
            </button>
          </form>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
            <p className="text-yellow-700">
              <strong>Not Enabled:</strong> Your account is not protected with two-factor authentication.
            </p>
          </div>

          <p className="text-gray-700">
            Two-factor authentication adds an extra layer of security to your account. When enabled, you'll need to
            provide both your password and a verification code from your authenticator app when signing in.
          </p>

          <button
            onClick={handleSetupMfa}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Set Up Two-Factor Authentication
          </button>
        </div>
      )}
    </div>
  )
}

export default MfaManagement
