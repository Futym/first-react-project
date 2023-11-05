// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6CDztJ3YX__l7TOzJBdpUa_jQqW53UOY",
  authDomain: "first-react-app-c998b.firebaseapp.com",
  projectId: "first-react-app-c998b",
  storageBucket: "first-react-app-c998b.appspot.com",
  messagingSenderId: "258409289469",
  appId: "1:258409289469:web:57bf4c75b5f92a38711094",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();
export const db = getFirestore(app);
