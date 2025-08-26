// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLrwpGL3NJDp3AR6nRMngL6EH83MIyrd8",
  authDomain: "financely-4bc76.firebaseapp.com",
  projectId: "financely-4bc76",
  storageBucket: "financely-4bc76.firebasestorage.app",
  messagingSenderId: "289469794170",
  appId: "1:289469794170:web:9338d156a1ce6d297438c3",
  measurementId: "G-ZXLXNQ4TY3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
export { db, auth, provider, doc, setDoc, analytics };
