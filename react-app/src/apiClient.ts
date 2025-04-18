import axios from "axios"

// Determine the API URL based on environment
const getApiUrl = () => {
  // If deployed to Firebase, use your deployed backend URL
  if (window.location.hostname === "library-bfd22.web.app") {
    return "https://your-backend-url.com" // Replace with your actual deployed backend URL
  }
  // For local development
  return "https://localhost:8443"
}

// Create a base API client with proper configuration
const apiClient = axios.create({
  baseURL: getApiUrl(),
  headers: {
    "Content-Type": "application/json",
  },
  // Handle self-signed certificates in development
  ...(process.env.NODE_ENV === "development" && { httpsAgent: { rejectUnauthorized: false } }),
})

// Add request interceptor to include auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    console.error("API Error:", error)

    // Handle specific error cases
    if (error.response) {
      console.log("Error status:", error.response.status)
      console.log("Error data:", error.response.data)
    } else if (error.request) {
      console.log("No response received:", error.request)
    } else {
      console.log("Error message:", error.message)
    }

    return Promise.reject(error)
  },
)

export default apiClient
