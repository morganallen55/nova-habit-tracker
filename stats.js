// ✅ Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// ✅ Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDRh9emJQMfweFCnuOgekbRcGA8vYTmb",
    authDomain: "nova-habit-tracker.firebaseapp.com",
    projectId: "nova-habit-tracker",
    storageBucket: "nova-habit-tracker.appspot.com",
    messagingSenderId: "175912352180",
    appId: "1:175912352180:web:a36c1a69f6e2b3feef",
    measurementId: "G-X4R271RZMK"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("📊 Stats Module Initialized!");

// ✅ DOM Elements
const totalHabitsEl = document.getElementById("total-habits");
const completedTodayEl = document.getElementById("completed-today");
const highestStreakEl = document.getElementById("highest-streak");
const avgCompletionRateEl = document.getElementById("avg-completion-rate");

// ✅ Load and Display Stats
document.addEventListener("DOMContentLoaded", async function () {
    await loadStats();
});

// ✅ Fetch Habit Statistics
async function loadStats() {
    try {
        const querySnapshot = await getDocs(collection(db, "habits"));
        let totalHabits = 0;
        let completedToday = 0;
        let highestStreak = 0;
        let totalCompleted = 0;

        querySnapshot.forEach((habitDoc) => {
            const habit = habitDoc.data();
            totalHabits++;

            if (habit.completedToday) {
                completedToday++;
            }

            if (habit.streak > highestStreak) {
                highestStreak = habit.streak;
            }

            totalCompleted += habit.streak;
        });

        // ✅ Calculate average completion rate
        const avgCompletionRate = totalHabits > 0 ? ((completedToday / totalHabits) * 100).toFixed(2) : 0;

        // ✅ Update UI
        totalHabitsEl.textContent = totalHabits;
        completedTodayEl.textContent = completedToday;
        highestStreakEl.textContent = highestStreak;
        avgCompletionRateEl.textContent = `${avgCompletionRate}%`;
    } catch (error) {
        console.error("❌ Error loading stats:", error);
    }
}
