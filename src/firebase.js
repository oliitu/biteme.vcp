// src/firebase.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";


// Configuración de Firebase (tuya está bien)
const firebaseConfig = {
  apiKey: "AIzaSyCPyq8CBVnMsg2YyzWxqwZ8tBbkDMludeY",
  authDomain: "biteme-page.firebaseapp.com",
  projectId: "biteme-page",
  storageBucket: "biteme-page.firebasestorage.app",
  messagingSenderId: "758449899049",
  appId: "1:758449899049:web:5fa422b6d64728c015be38",
  measurementId: "G-6FV0V88L7R"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Conectar a Firestore
export const db = getFirestore(app);
