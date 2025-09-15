// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJgaUG5ki95aQ4SMEgz5ZyDeRZWAQ5VtE",
  authDomain: "recipix-83a2c.firebaseapp.com",
  projectId: "recipix-83a2c",
  storageBucket: "recipix-83a2c.firebasestorage.app",
  messagingSenderId: "816108897887",
  appId: "1:816108897887:web:208cdabf5eb42554b87dea",
  measurementId: "G-Z0F2JZX30L"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
