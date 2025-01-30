// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "estate-mern-d6be5.firebaseapp.com",
  projectId: "estate-mern-d6be5",
  storageBucket: "estate-mern-d6be5.firebasestorage.app",
  messagingSenderId: "577976051125",
  appId: "1:577976051125:web:9546ac18de5b9f6c53e5fc"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);