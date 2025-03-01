// ✅ Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, orderBy, query } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// ✅ Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDRh9emJ-QMfweFCnuOgekbRcGA8vYTmbAA",
    authDomain: "nova-habit-tracker.firebaseapp.com",
    projectId: "nova-habit-tracker",
    storageBucket: "nova-habit-tracker.appspot.com",
    messagingSenderId: "175912352180",
    appId: "1:175912352180:web:a36c1a69f6e2b3feef9ae1",
    measurementId: "G-X4R271RZMK"
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
console.log("🔥 Firebase & Firestore initialized successfully!");

// ✅ DOM Elements
const journalForm = document.getElementById("journal-form");
const entryText = document.getElementById("entry-text");
const entriesList = document.getElementById("entries-list");

// ✅ Save a new journal entry (No authentication required)
const saveJournalEntry = async (text) => {
    try {
        await addDoc(collection(db, "journalEntries"), {
            text,
            timestamp: new Date()
        });

        console.log("✅ Journal entry saved!");
        await loadJournalEntries(); // Refresh entries after saving
    } catch (error) {
        console.error("❌ Error saving journal entry:", error);
    }
};

// ✅ Load journal entries (No authentication required)
async function loadJournalEntries() {
    try {
        entriesList.innerHTML = ""; // Clear list
        const q = query(collection(db, "journalEntries"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const entry = doc.data();
            const li = document.createElement("li");
            const timestamp = entry.timestamp?.toDate
                ? new Date(entry.timestamp.toDate()).toLocaleString()
                : "No Timestamp";

            li.textContent = `${entry.text} - ${timestamp}`;
            entriesList.appendChild(li);
        });

        console.log("✅ Journal entries loaded successfully!");
    } catch (error) {
        console.error("❌ Error loading journal entries:", error);
        alert("Failed to load journal entries.");
    }
}

// ✅ Load entries when page loads
document.addEventListener("DOMContentLoaded", loadJournalEntries);
