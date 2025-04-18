// src/firebase/config.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// Import analytics if you're using it
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC5RcbMzGZfOez1y5bk0IjYfQQV_x9ILbI",
    authDomain: "library-bfd22.firebaseapp.com",
    projectId: "library-bfd22",
    storageBucket: "library-bfd22.firebasestorage.app",
    messagingSenderId: "32607768289",
    appId: "1:32607768289:web:2704b01221b83ff436b1a0",
    measurementId: "G-WYFKQZZK4R"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication
const auth = getAuth(app);
// Initialize Analytics if needed
const analytics = getAnalytics(app);

export { analytics, auth };
export default app;