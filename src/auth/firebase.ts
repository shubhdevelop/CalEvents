// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyATLzBJe4ebpcgyeQCNkALtgw24Yar48Pw",

  authDomain: "calevent-2fc84.firebaseapp.com",

  projectId: "calevent-2fc84",

  storageBucket: "calevent-2fc84.appspot.com",

  messagingSenderId: "172149551903",

  appId: "1:172149551903:web:698ee75aa1d9ea29c6762a",

  measurementId: "G-5HQ10BMX3M",
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
export { app, auth };
