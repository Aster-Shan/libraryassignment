"use client"

import axios from "axios"
import { createUserWithEmailAndPassword } from "firebase/auth"
import { Loader2 } from "lucide-react"
import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { auth } from "../firebase/config"

interface RegisterData {
  name: string
  email: string
  password: string
  address: string
  phone: string
  verified: boolean
  status: string
}

const Register: React.FC = () => {
  const [userData, setUserData] = useState<RegisterData>({
    name: "",
    email: "",
    password: "",
    address: "",
    phone: "",
    verified: false,
    status: "active",
  })
  const [error, setError] = useState<string>("")
  const [success, setSuccess] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserData({ ...userData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    // Add these console logs at the beginning of handleSubmit
    console.log("Starting registration process...")
    console.log("User data being submitted:", { ...userData, password: "********" })

    try {
      // First, create the user in Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password)

      // After Firebase user creation, add:
      console.log("Firebase user created successfully with UID:", userCredential.user.uid)

      // Get the Firebase ID token
      const firebaseToken = await userCredential.user.getIdToken()

      // Before making the backend API call, add:
      console.log("Sending registration data to backend:", {
        ...userData,
        firebaseUid: userCredential.user.uid,
        password: "********",
      })

      // Then register with our backend using the API client
      // Replace the axios.post call with this:
      const API_URL = "https://localhost:8443"
      const response = await axios.post(
        `${API_URL}/api/auth/register`,
        {
          ...userData,
          firebaseUid: userCredential.user.uid,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          // Add this for development with self-signed certificates
          ...(process.env.NODE_ENV === "development" && {
            httpsAgent: {
              rejectUnauthorized: false,
            },
          }),
        },
      )

      // After the API call, add more detailed logging:
      console.log("Backend registration response:", {
        status: response.status,
        statusText: response.statusText,
        data: response.data,
      })

      console.log("Registration response:", response)
      if (response.status === 200) {
        console.log("Registration successful, setting success message")
        setSuccess("Registration successful! Please check your email for verification.")
        setTimeout(() => {
          console.log("Navigating to login page")
          navigate("/login")
        }, 5000)
      } else {
        console.log("Unexpected response status:", response.status)
        setError("Registration failed. Please try again.")
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      if (error.response) {
        // Axios error with response
        console.log("Error response:", error.response)
        setError(
          error.response?.data?.message || error.response?.data || "An unexpected error occurred during registration.",
        )
      } else if (error.code) {
        // Firebase error
        console.log("Firebase error:", error)
        if (error.code === "auth/email-already-in-use") {
          setError("Email is already in use. Please use a different email or try logging in.")
        } else if (error.code === "auth/weak-password") {
          setError("Password is too weak. Please use a stronger password.")
        } else {
          setError(`Firebase error: ${error.message}`)
        }
      } else {
        // Other error
        console.log("Unknown error:", error)
        setError("An unexpected error occurred during registration.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="w-full max-w-md space-y-8">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">Create an account</h2>
        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-900">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                value={userData.name}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-900">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={userData.email}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-900">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={userData.password}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-900">
                Address
              </label>
              <input
                id="address"
                name="address"
                type="text"
                required
                value={userData.address}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-900">
                Phone
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={userData.phone}
                onChange={handleChange}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {error && (
            <div className="mt-4 bg-red-100 border-l-4 border-red-500 text-red-700 p-4">
              <strong>Error:</strong> {error}
            </div>
          )}

          {success && (
            <div className="mt-4 bg-green-100 border-l-4 border-green-500 text-green-700 p-4">
              <strong>Success:</strong> {success}
            </div>
          )}

          <button
            type="submit"
            className={`w-full mt-6 py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? "opacity-50 cursor-not-allowed" : ""}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-5 w-5 mr-2 inline" />
                Registering...
              </>
            ) : (
              "Register"
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Register
