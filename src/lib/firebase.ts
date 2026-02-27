import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
    apiKey: "AIzaSyD0oGwcqQVn0CVzSBKr0LeAT1_P2wMM7mc",
    authDomain: "projetoactive.firebaseapp.com",
    projectId: "projetoactive",
    storageBucket: "projetoactive.firebasestorage.app",
    messagingSenderId: "582234098478",
    appId: "1:582234098478:web:009f00842eefa258d748bf",
    measurementId: "G-JBSP7ZNVFB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

// Initialize Analytics if needed later
export const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
