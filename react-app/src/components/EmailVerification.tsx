"use client"

import type React from "react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import apiClient from "../apiClient"; // Use the centralized API client

const EmailVerification: React.FC = () => {
  const [verificationState, setVerificationState] = useState<"loading" | "success" | "error">("loading")
  const [message, setMessage] = useState<string>("Verifying your email...")
  const [countdown, setCountdown] = useState<number>(5)
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(location.search)
      const token = params.get("token")

      if (!token) {
        setVerificationState("error")
        setMessage("Invalid verification link. Please check your email and try again.")
        return
      }

      try {
        const response = await apiClient.post("/api/auth/verify-email", "", {
          params: { token },
        })

        setVerificationState("success")
        setMessage(response.data?.message || "Email verified successfully!")

        // Start countdown for redirect
        const timer = setInterval(() => {
          setCountdown((prev) => {
            if (prev <= 1) {
              clearInterval(timer)
              navigate("/login")
              return 0
            }
            return prev - 1
          })
        }, 1000)

        return () => clearInterval(timer)
      } catch (error: any) {
        setVerificationState("error")
        if (error.response) {
          setMessage(error.response?.data?.message || "Email verification failed. Please try again.")
        } else {
          setMessage("An unexpected error occurred. Please try again later.")
        }
        console.error("Email verification error:", error)
      }
    }

    verifyEmail()
  }, [location, navigate])

  const handleResendVerification = () => {
    // You would need to implement this functionality in your backend
    // and then call it here
    alert("This feature is not yet implemented")
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Email Verification</h2>
        </div>

        {verificationState === "loading" && (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            <p className="mt-4 text-center text-gray-600">{message}</p>
          </div>
        )}

        {verificationState === "error" && (
          <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
            <p className="font-bold">Error</p>
            <p>{message}</p>
            <div className="mt-4 flex justify-between">
              <button
                onClick={() => navigate("/login")}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Go to Login
              </button>
              <button
                onClick={handleResendVerification}
                className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Resend Verification
              </button>
            </div>
          </div>
        )}

        {verificationState === "success" && (
          <div className="mt-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4">
            <p className="font-bold">Success</p>
            <p>{message}</p>
            <p className="mt-2">
              You will be redirected to the login page in {countdown} seconds. If not, please{" "}
              <button onClick={() => navigate("/login")} className="text-indigo-600 hover:text-indigo-500 underline">
                click here
              </button>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default EmailVerification
