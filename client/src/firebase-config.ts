// src/firebase-config.ts

// Import the core functions
import { initializeApp } from "firebase/app";

//IMPORT THE AUTHENTICATION SDK
import { getAuth } from "firebase/auth"; 
import { getAnalytics } from "firebase/analytics";

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCIv7B1kpPSb4nDkhwEvBVE4S3fX1YdmqU",
  authDomain: "biteme-e4144.firebaseapp.com",
  projectId: "biteme-e4144",
  storageBucket: "biteme-e4144.firebasestorage.app",
  messagingSenderId: "932724242033",
  appId: "1:932724242033:web:7ec5b5c72a39749dd58dd0",
  measurementId: "G-HES9DS3NZT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

//  INITIALIZE AND EXPORT THE AUTH SERVICE
export const auth = getAuth(app); // <--- Add this line!
// export const db = getFirestore(app); // (Add this if you need Firestore later)

// export the app instance itself if your components need it
export default app;
