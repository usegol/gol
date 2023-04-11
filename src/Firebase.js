import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDRPxqaxFENphq6i3yfKDBzj7FxTYKxzKM",
  authDomain: "use-gol.firebaseapp.com",
  projectId: "use-gol",
  storageBucket: "use-gol.appspot.com",
  messagingSenderId: "130570097756",
  appId: "1:130570097756:web:85f79e01d110bf7fc20299",
  measurementId: "G-VZMCRQT53W"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);


export { app as default, analytics, auth, db };
