// ✅ Import Firebase Modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, orderBy, query, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

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

// ✅ Save a new journal entry
const saveJournalEntry = async (text) => {
    try {
        await addDoc(collection(db, "journalEntries"), {
            text,
            timestamp: serverTimestamp() // ✅ Uses Firestore's server timestamp
        });

        console.log("✅ Journal entry saved!");
        entryText.value = ""; // ✅ Clear textarea after saving
        await loadJournalEntries(); // ✅ Refresh entries after saving
    } catch (error) {
        console.error("❌ Error saving journal entry:", error);
        alert("Failed to save journal entry.");
    }
};

// ✅ Load journal entries
async function loadJournalEntries() {
    try {
        entriesList.innerHTML = ""; // ✅ Clear previous entries
        const q = query(collection(db, "journalEntries"), orderBy("timestamp", "desc"));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const entry = doc.data();
            const li = document.createElement("li");

            // ✅ Ensure timestamp exists and format it
            const timestamp = entry.timestamp ? new Date(entry.timestamp.seconds * 1000).toLocaleString() : "No Timestamp";

            li.textContent = `${entry.text} - ${timestamp}`;
            entriesList.appendChild(li);
        });

        console.log("✅ Journal entries loaded successfully!");
    } catch (error) {
        console.error("❌ Error loading journal entries:", error);
        alert("Failed to load journal entries.");
    }
}

// ✅ Form submission event listener
journalForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const text = entryText.value.trim();
    if (text) {
        await saveJournalEntry(text);
    } else {
        alert("Please enter some text before saving.");
    }
});

// ✅ Load entries when page loads
document.addEventListener("DOMContentLoaded", loadJournalEntries);
