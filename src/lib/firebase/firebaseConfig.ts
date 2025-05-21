import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
const firebaseConfig = {
  apiKey: "AIzaSyDOKr1mVi5W3ggc7wD0597cp_UY9qaNQqE",
  authDomain: "tripify-84f04.firebaseapp.com",
  projectId: "tripify-84f04",
  storageBucket: "tripify-84f04.firebasestorage.app",
  messagingSenderId: "1055924777303",
  appId: "1:1055924777303:web:939554729d42817a6a0e12",
  measurementId: "G-25EFN9WM22",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
