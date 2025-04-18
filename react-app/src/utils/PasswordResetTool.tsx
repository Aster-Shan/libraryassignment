"use client"

import axios from "axios"
import type React from "react"
import { useState } from "react"

const PasswordResetTool: React.FC = () => {
  const [email, setEmail] = useState("")
  const [resetToken, setResetToken] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<"request" | "reset">("request")

  const requestReset = async () => {
    if (!email) {
      setMessage({ type: "error", text: "Please enter your email" })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      await axios.post(
        "https://localhost:8443/api/auth/forgot-password",
        { email },
        {
          headers: { "Content-Type": "application/json" },
          ...(process.env.NODE_ENV === "development" && { httpsAgent: { rejectUnauthorized: false } }),
        },
      )

      setMessage({
        type: "success",
        text: "Password reset email sent. Check your inbox for the reset token.",
      })
      setStep("reset")
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        setMessage({
          type: "error",
          text: `Error: ${error.response?.data?.message || error.message}`,
        })
      } else {
        setMessage({ type: "error", text: `Unexpected error: ${error.message}` })
      }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async () => {
    if (!resetToken || !newPassword || !confirmPassword) {
      setMessage({ type: "error", text: "Please fill in all fields" })
      return
    }

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Passwords do not match" })
      return
    }

    setLoading(true)
    setMessage(null)

    try {
      await axios.put(
        `https://localhost:8443/api/auth/reset-password?token=${resetToken}`,
        { newPassword },
        {
          headers: { "Content-Type": "application/json" },
          ...(process.env.NODE_ENV === "development" && { httpsAgent: { rejectUnauthorized: false } }),
        },
      )

      setMessage({
        type: "success",
        text: "Password reset successful. You can now log in with your new password.",
      })

      // Clear form
      setResetToken("")
      setNewPassword("")
      setConfirmPassword("")
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        setMessage({
          type: "error",
          text: `Error: ${error.response?.data?.message || error.message}`,
        })
      } else {
        setMessage({ type: "error", text: `Unexpected error: ${error.message}` })
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Password Reset Tool</h1>

      <div className="bg-white p-4 rounded shadow">
        <div className="mb-4 border-b pb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setStep("request")}
              className={`px-4 py-2 rounded ${
                step === "request" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Step 1: Request Reset
            </button>

            <div className="text-gray-400">→</div>

            <button
              onClick={() => setStep("reset")}
              className={`px-4 py-2 rounded ${
                step === "reset" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Step 2: Reset Password
            </button>
          </div>
        </div>

        {message && (
          <div
            className={`mb-4 p-3 rounded ${
              message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
            }`}
          >
            {message.text}
          </div>
        )}

        {step === "request" ? (
          <div className="space-y-4">
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

            <button
              onClick={requestReset}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? "Sending..." : "Request Password Reset"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reset Token</label>
              <input
                type="text"
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="Enter the reset token from your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="Enter your new password"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded"
                placeholder="Confirm your new password"
              />
            </div>

            <button
              onClick={resetPassword}
              disabled={loading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </div>
        )}
      </div>

      <div className="mt-6 bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">How to Use This Tool</h2>

        <ol className="list-decimal pl-6 space-y-2">
          <li>
            <strong>Step 1:</strong> Enter your email address and click "Request Password Reset"
          </li>
          <li>
            <strong>Step 2:</strong> Check your email for a reset token (or check your backend logs if email sending is
            not configured)
          </li>
          <li>
            <strong>Step 3:</strong> Enter the reset token and your new password
          </li>
          <li>
            <strong>Step 4:</strong> Click "Reset Password" to update your password
          </li>
          <li>
            <strong>Step 5:</strong> Try logging in with your new password
          </li>
        </ol>

        <div className="mt-4 p-3 bg-yellow-100 text-yellow-800 rounded">
          <strong>Note:</strong> If you don't receive a reset token, check with your administrator or check the backend
          logs.
        </div>
      </div>
    </div>
  )
}

export default PasswordResetTool
