import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBQ5NHnEzbEhrD1rqYxOZJsUhfJntQTEXE",
  authDomain: "hospitalmanagement-8392f.firebaseapp.com",
  projectId: "hospitalmanagement-8392f",
  storageBucket: "hospitalmanagement-8392f.firebasestorage.app",
  messagingSenderId: "27475197689",
  appId: "1:27475197689:web:7237ee9c6c1e5bbb3c6c28"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);

// DEVELOPMENT ONLY
auth.settings.appVerificationDisabledForTesting = true;

console.log(
    "FIREBASE PROJECT:",
    firebaseConfig.projectId
);