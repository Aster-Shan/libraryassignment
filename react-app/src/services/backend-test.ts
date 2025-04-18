import axios from "axios"

/**
 * Tests the backend connection and authentication endpoints
 */
export async function testBackendConnection() {
  try {
    // Test basic connection
    const response = await axios.get("https://localhost:8443/api/health", {
      // For development with self-signed certificates
      ...(process.env.NODE_ENV === "development" && { httpsAgent: { rejectUnauthorized: false } }),
    })

    console.log("Backend connection test successful:", response.data)
    return {
      success: true,
      status: response.status,
      data: response.data,
    }
  } catch (error) {
    console.error("Backend connection test failed:", error)
    return {
      success: false,
      error: axios.isAxiosError(error)
        ? {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
          }
        : "Unknown error",
    }
  }
}

/**
 * Tests the login endpoint with minimal data to check for specific errors
 */
export async function testLoginEndpoint(email: string) {
  try {
    // Intentionally send an invalid request to see the error format
    const response = await axios.post(
      "https://localhost:8443/api/auth/login",
      { email },
      {
        // For development with self-signed certificates
        ...(process.env.NODE_ENV === "development" && { httpsAgent: { rejectUnauthorized: false } }),
      },
    )

    // This should not succeed with just an email
    console.log("Login test unexpectedly successful:", response.data)
    return {
      success: true,
      status: response.status,
      data: response.data,
    }
  } catch (error) {
    // This is expected to fail, we're checking the error format
    console.log("Login test expected error:", error)
    return {
      success: false,
      error: axios.isAxiosError(error)
        ? {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
          }
        : "Unknown error",
    }
  }
}
