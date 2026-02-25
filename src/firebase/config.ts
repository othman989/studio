import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";

// 1) Export firebaseConfig so src/firebase/index.ts can import it
export const firebaseConfig = {
  apiKey: "AIzaSyAhGSlUYWGdjSwfCRnJu6HBEUXU-QUvjRE",
  authDomain: "studio-6069290181-9f198.firebaseapp.com",
  projectId: "studio-6069290181-9f198",
  storageBucket: "studio-6069290181-9f198.firebasestorage.app",
  messagingSenderId: "1046593006872",
  appId: "1:1046593006872:web:724c7a6beaff7d4c26026d",
};

// 2) Initialize app once
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// 3) Export commonly used instances

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app, "us-central1");
