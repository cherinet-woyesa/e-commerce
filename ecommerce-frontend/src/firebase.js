// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, 
         GoogleAuthProvider, 
         signInWithPopup, 
         signInWithEmailAndPassword, 
         createUserWithEmailAndPassword, 
         signOut, 
         onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBFsfZUmHcht912dEVg92m5rHX54YI1bTY",
  authDomain: "ecommerce-be8ed.firebaseapp.com",
  projectId: "ecommerce-be8ed",
  storageBucket: "ecommerce-be8ed.firebasestorage.app",
  messagingSenderId: "519393430270",
  appId: "1:519393430270:web:a5a07f957780e3076273af",
  measurementId: "G-D2X2WS6VN9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Initialize Google provider
export const googleProvider = new GoogleAuthProvider();

export { auth, db, storage, 
         GoogleAuthProvider, 
         signInWithPopup, 
         signInWithEmailAndPassword, 
         createUserWithEmailAndPassword, 
         signOut, 
         onAuthStateChanged };

export default app;