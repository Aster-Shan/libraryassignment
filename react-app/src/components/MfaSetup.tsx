"use client"

import axios from "axios"
import type React from "react"
import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import AuthContext from "../contexts/AuthContext"

interface MfaSetupResponse {
  secret: string
  qrCodeImageUri: string
}

const MfaSetup: React.FC = () => {
  const [qrCode, setQrCode] = useState<string>("")
  const [secret, setSecret] = useState<string>("")
  const [verificationCode, setVerificationCode] = useState<string>("")
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<"setup" | "verify">("setup")
  const { user, token } = useContext(AuthContext)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user || !token) {
      navigate("/login")
      return
    }

    const fetchMfaSetup = async () => {
      try {
        setIsLoading(true)
        const response = await axios.post<MfaSetupResponse>(
          "/api/users/mfa/setup",
          { email: user.email },
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          },
        )

        setQrCode(response.data.qrCodeImageUri)
        setSecret(response.data.secret)
        setStep("setup")
      } catch (error) {
        if (axios.isAxiosError(error)) {
          setError(error.response?.data?.message || "Failed to set up 2FA")
        } else {
          setError("An unexpected error occurred")
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchMfaSetup()
  }, [user, token, navigate])

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await axios.post(
        "/api/users/mfa/verify",
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
        setSuccess("Two-factor authentication has been enabled successfully!")
        setTimeout(() => {
          navigate("/profile")
        }, 3000)
      } else {
        setError("Invalid verification code. Please try again.")
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "Failed to verify 2FA code")
      } else {
        setError("An unexpected error occurred")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Set Up Two-Factor Authentication</h1>

      {step === "setup" && (
        <div className="space-y-6">
          <p className="text-gray-700">
            Scan the QR code below with your authenticator app (like Google Authenticator, Authy, or Microsoft
            Authenticator).
          </p>

          {qrCode && (
            <div className="flex justify-center my-6">
              <img src={qrCode || "/placeholder.svg"} alt="QR Code for 2FA" className="border p-4" />
            </div>
          )}

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
            <p className="text-yellow-700">
              <strong>Important:</strong> If you can't scan the QR code, manually enter this secret key in your
              authenticator app:
            </p>
            <p className="font-mono bg-gray-100 p-2 mt-2 text-sm break-all">{secret}</p>
          </div>

          <button
            onClick={() => setStep("verify")}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Next
          </button>
        </div>
      )}

      {step === "verify" && (
        <form onSubmit={handleVerify} className="space-y-6">
          <p className="text-gray-700">
            Enter the 6-digit verification code from your authenticator app to verify and enable 2FA.
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

          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => setStep("setup")}
              className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {isLoading ? "Verifying..." : "Verify & Enable 2FA"}
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default MfaSetup
