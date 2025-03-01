// Import Firebase modules (this is if you're using a bundler like Webpack or a framework setup — skip if using vanilla HTML + script tags)
// import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
// import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ✅ Firebase Configuration
const firebaseConfig = {
    apiKey:"AIzaSyBZk0T4RrYYLraXOLXzAE3pCLoqMWYFpH4",
    authDomain: "nova-habit-tracker.firebaseapp.com",
    projectId: "nova-habit-tracker",
    storageBucket: "nova-habit-tracker.appspot.com",
    messagingSenderId: "175912352180",
    appId: "1:175912352180:web:a36c1a69f6e2b3feef",
    measurementId: "G-X4R271RZMK"
};

// ✅ Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

console.log("🔥 Firebase initialized!");

// ✅ Example function to add a habit to Firestore
function addHabitToFirestore(habitName) {
    return db.collection("habits").add({
        name: habitName,
        createdAt: new Date()
    }).then(() => {
        console.log(`Habit "${habitName}" added.`);
    }).catch(error => {
        console.error("Error adding habit:", error);
    });
}

// ✅ Example function to fetch all habits
function fetchHabitsFromFirestore() {
    return db.collection("habits").orderBy("createdAt", "asc").get()
        .then(snapshot => {
            const habits = [];
            snapshot.forEach(doc => {
                habits.push({ id: doc.id, ...doc.data() });
            });
            return habits;
        }).catch(error => {
            console.error("Error fetching habits:", error);
        });
}

// ✅ Example function to delete a habit
function deleteHabitFromFirestore(habitId) {
    return db.collection("habits").doc(habitId).delete()
        .then(() => {
            console.log(`Habit ${habitId} deleted.`);
        }).catch(error => {
            console.error("Error deleting habit:", error);
        });
}

// ✅ Make functions globally accessible (optional for debugging in browser console)
window.addHabitToFirestore = addHabitToFirestore;
window.fetchHabitsFromFirestore = fetchHabitsFromFirestore;
window.deleteHabitFromFirestore = deleteHabitFromFirestore;
