// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';


// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCJT8mlQoMRP8IfNA3iM_PAhtBg85MWFWc",
  authDomain: "react-native-todo-list-joshdev.firebaseapp.com",
  projectId: "react-native-todo-list-joshdev",
  storageBucket: "react-native-todo-list-joshdev.appspot.com",
  messagingSenderId: "654248308716",
  appId: "1:654248308716:web:2dcbf98126af00f0639ac9",
  measurementId: "G-PZHPTN4EGS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };