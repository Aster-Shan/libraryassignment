import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL || "https://localhost:8443/api"

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor with better error logging
api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`)

    const token = localStorage.getItem("token")
    if (token) {
      console.log("Adding authorization token to request")
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    console.error("Request interceptor error:", error)
    return Promise.reject(error)
  },
)

// Add response interceptor with better error logging
api.interceptors.response.use(
  (response) => {
    console.log(`Response from ${response.config.url}:`, response.status)
    return response
  },
  (error) => {
    console.error("API Error:", error)
    console.error("Error details:", {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      data: error.response?.data,
    })

    if (error.response && error.response.status === 401) {
      console.log("Authentication error detected, redirecting to login")
      localStorage.removeItem("token")
      window.location.href = "/login"
    }

    return Promise.reject(error)
  },
)

export default api
