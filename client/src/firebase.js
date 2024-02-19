// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "state-market.firebaseapp.com",
  projectId: "state-market",
  storageBucket: "state-market.appspot.com",
  messagingSenderId: "904989950811",
  appId: "1:904989950811:web:86250fdc93aff0b69a507e"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);