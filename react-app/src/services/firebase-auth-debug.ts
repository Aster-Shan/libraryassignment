import { getAuth, onAuthStateChanged } from "firebase/auth"

/**
 * Monitors and logs Firebase authentication state changes
 */
export function monitorFirebaseAuth() {
  const auth = getAuth()

  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.group("Firebase Auth State: Signed In")
      console.log("User UID:", user.uid)
      console.log("Email:", user.email)
      console.log("Email Verified:", user.emailVerified)
      console.log("Display Name:", user.displayName)
      console.log("Provider Data:", user.providerData)
      console.groupEnd()
    } else {
      console.log("Firebase Auth State: Signed Out")
    }
  })
}

/**
 * Gets detailed information about the current Firebase user
 * @returns Promise with user details or null
 */
export async function getFirebaseUserDetails() {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    return null
  }

  try {
    // Get the ID token with force refresh
    const token = await user.getIdToken(true)

    return {
      uid: user.uid,
      email: user.email,
      emailVerified: user.emailVerified,
      displayName: user.displayName,
      phoneNumber: user.phoneNumber,
      photoURL: user.photoURL,
      providerData: user.providerData,
      tokenFirstChars: token.substring(0, 20) + "...",
      metadata: {
        creationTime: user.metadata.creationTime,
        lastSignInTime: user.metadata.lastSignInTime,
      },
    }
  } catch (error) {
    console.error("Error getting Firebase user details:", error)
    return null
  }
}

/**
 * Verifies if the Firebase token is valid by making a test request
 * @param token Firebase ID token
 * @returns Promise with verification result
 */
export async function verifyFirebaseToken(token: string) {
  try {
    const response = await fetch("https://localhost:8443/api/auth/verify-token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),
    })

    const data = await response.json()
    return {
      valid: response.ok,
      status: response.status,
      data,
    }
  } catch (error) {
    console.error("Error verifying Firebase token:", error)
    return {
      valid: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}
