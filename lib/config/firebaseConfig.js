import { initializeApp } from 'firebase/app';
import { getAnalytics } from "firebase/analytics";
import {getFirestore} from "@firebase/firestore";
import {getReactNativePersistence, initializeAuth} from "firebase/auth";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";

// Optionally import the services that you want to use
// import {...} from 'firebase/auth';
// import {...} from 'firebase/database';
// import {...} from 'firebase/firestore';
// import {...} from 'firebase/functions';
// import {...} from 'firebase/storage';

// Initialize Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCmaBuRmMCV3-YvZIb9hNjQAXee5khhIlo",
  authDomain: "task-management-591df.firebaseapp.com",
  databaseURL: 'https://task-management-591df.firebaseio.com',
  projectId: "task-management-591df",
  storageBucket: "task-management-591df.firebasestorage.app",
  messagingSenderId: "260159187606",
  appId: 'app-id',
  measurementId: "G-VEFH9TSZ3Q",
};

const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage)
})
export const db = getFirestore(app);

// const analytics = getAnalytics(app);
// For more information on how to access Firebase in your project,
// see the Firebase documentation: https://firebase.google.com/docs/web/setup#access-firebase

export default app; // Export the initialized app instance
