// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDRh9emJQMfweFCnuOgekbRcGA8vYTmbAA",
    authDomain: "nova-habit-tracker.firebaseapp.com",
    projectId: "nova-habit-tracker",
    storageBucket: "nova-habit-tracker.appspot.com",
    messagingSenderId: "175912352180",
    appId: "1:175912352180:web:a36c1a69f6e2b3feef9ae1",
    measurementId: "G-X4R271RZMK"
};

// Ensure Firebase SDK is loaded
if (typeof firebase === "undefined") {
    console.error("Firebase SDK not loaded. Check script order in HTML.");
} else {
    // Initialize Firebase
    firebase.initializeApp(firebaseConfig);
    console.log("🔥 Firebase initialized successfully!");

    // Initialize Firestore
    const db = firebase.firestore();
    console.log("🔥 Firestore initialized successfully!");

    // Make Firestore available globally
    window.db = db;
}


