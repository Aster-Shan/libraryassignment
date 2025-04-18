// Utility functions to help debug authentication issues

/**
 * Logs detailed information about the authentication process
 * @param stage The current authentication stage
 * @param data Data to log (will be sanitized for sensitive info)
 */
export function logAuthDebug(stage: string, data: any) {
    console.log(`[Auth Debug] ${stage}:`, sanitizeAuthData(data))
  }
  
  /**
   * Sanitizes authentication data to avoid logging sensitive information
   */
  function sanitizeAuthData(data: any): any {
    if (!data) return data
  
    // Create a copy to avoid modifying the original
    const sanitized = { ...data }
  
    // Sanitize sensitive fields
    if (sanitized.password) sanitized.password = "********"
    if (sanitized.firebaseToken) sanitized.firebaseToken = sanitized.firebaseToken.substring(0, 20) + "..."
    if (sanitized.token) sanitized.token = sanitized.token.substring(0, 20) + "..."
  
    return sanitized
  }
  
  /**
   * Logs the complete request and response for debugging
   */
  export function logFullRequest(config: any, response?: any, error?: any) {
    console.group("Full Request/Response Debug")
  
    // Log request details
    console.log("Request URL:", config.url)
    console.log("Request Method:", config.method)
    console.log("Request Headers:", sanitizeHeaders(config.headers))
    console.log("Request Data:", sanitizeAuthData(config.data))
  
    // Log response if available
    if (response) {
      console.log("Response Status:", response.status)
      console.log("Response Headers:", response.headers)
      console.log("Response Data:", response.data)
    }
  
    // Log error if available
    if (error) {
      console.log("Error:", error.message)
      if (error.response) {
        console.log("Error Status:", error.response.status)
        console.log("Error Data:", error.response.data)
      }
    }
  
    console.groupEnd()
  }
  
  /**
   * Sanitizes headers to avoid logging sensitive information
   */
  function sanitizeHeaders(headers: any): any {
    if (!headers) return headers
  
    const sanitized = { ...headers }
  
    // Sanitize authorization header
    if (sanitized.Authorization) {
      sanitized.Authorization = sanitized.Authorization.substring(0, 15) + "..."
    }
  
    return sanitized
  }
  
  /**
   * Adds detailed debugging to an axios instance
   */
  export function addAxiosDebugInterceptors(axiosInstance: any) {
    // Request interceptor
    axiosInstance.interceptors.request.use(
      (config: any) => {
        logFullRequest(config)
        return config
      },
      (error: any) => {
        console.error("Request error:", error)
        return Promise.reject(error)
      },
    )
  
    // Response interceptor
    axiosInstance.interceptors.response.use(
      (response: any) => {
        logFullRequest(response.config, response)
        return response
      },
      (error: any) => {
        if (error.config) {
          logFullRequest(error.config, null, error)
        } else {
          console.error("Response error without config:", error)
        }
        return Promise.reject(error)
      },
    )
  
    return axiosInstance
  }
  