// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBJc24ph_PyRo5wqvQ5I7H-qYcm3nEWNTc",
  authDomain: "fampicks-fa608.firebaseapp.com",
  projectId: "fampicks-fa608",
  storageBucket: "fampicks-fa608.appspot.com",
  messagingSenderId: "228718981453",
  appId: "1:228718981453:web:428119f594976ebdbd4704",
  measurementId: "G-V46ZWQ5Y8N"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
export default auth;