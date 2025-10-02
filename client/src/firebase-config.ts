// src/firebase-config.ts

// Import the core functions
import { initializeApp } from "firebase/app";

//IMPORT THE AUTHENTICATION SDK
import { getAuth } from "firebase/auth"; 
import { getAnalytics } from "firebase/analytics";

// web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDYincEs3zt2h9Z-cl-STAhPCPfHmm9FJU",
  authDomain: "lastbite-food-rescue.firebaseapp.com",
  projectId: "lastbite-food-rescue",
  storageBucket: "lastbite-food-rescue.firebasestorage.app",
  messagingSenderId: "223064637589",
  appId: "1:223064637589:web:5352c667434c7922675b9c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//  INITIALIZE AND EXPORT THE AUTH SERVICE
export const auth = getAuth(app); // <--- Add this line!
// export const db = getFirestore(app); // (Add this if you need Firestore later)

// export the app instance itself if your components need it
export default app;
