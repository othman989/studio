// studio/src/firebase/config.ts
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";

const firebaseConfig = {
  apiKey: "AIzaSyAhGSlUYWGdjSwfCRnJu6HBEUXU-QUvjRE",
  authDomain: "studio-6069290181-9f198.firebaseapp.com",
  projectId: "studio-6069290181-9f198",
  storageBucket: "studio-6069290181-9f198.firebasestorage.app",
  messagingSenderId: "1046593006872",
  appId: "1:1046593006872:web:724c7a6beaff7d4c26026d",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const functions = getFunctions(app, "us-central1"); // match your functions region

// Optional helpers for callables
export const callConnectGoogleBusiness = () =>
  httpsCallable(functions, "connectGoogleBusiness")();

export const callPublishReview = (data: {
  reviewId: string;
  finalResponse: string;
  wasEdited: boolean;
}) => httpsCallable(functions, "publishReview")(data);

// ...similarly for regenerateResponse, grantCredits, etc.
