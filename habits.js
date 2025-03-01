// ✅ Import Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
import { getFirestore, collection, addDoc, updateDoc, doc, deleteDoc, getDocs, getDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";

// ✅ Store API Key in a variable
const API_KEY = "AIzaSyBZk0T4RrYYLraXOLXzAE3pCLoqMWYFpH4";
const VISION_API_KEY = "AIzaSyB4zrnm4R-Plbo9ng0l9gG06Ntl9XYelKQ"; // ✅ Add Vision API Key
const MODEL_NAME = 'models/gemini-1.5-pro-001';

// ✅ Firebase Configuration
const firebaseConfig = {
    apiKey: API_KEY,
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
console.log("🔥 Firebase initialized!");

// ✅ DOM Elements
const habitsList = document.getElementById("habit-list");
const addHabitButton = document.getElementById("add-habit");
const habitInputs = document.getElementById("habit-inputs");
const saveHabitButton = document.getElementById("save-habit");
const chatbotContainer = document.getElementById("chatbot-container");
const chatbotMessages = document.getElementById("chatbot-messages");
const chatbotInput = document.getElementById("chatbot-input");
const chatbotSend = document.getElementById("chatbot-send");

// ✅ Show input form when 'Add Habit' is clicked
addHabitButton.addEventListener("click", () => {
    habitInputs.classList.toggle("hidden");
});

// ✅ Load Habits on Page Load
document.addEventListener("DOMContentLoaded", async function () {
    await loadHabits();
});

// ✅ Load habits from Firestore
async function loadHabits() {
    try {
        habitsList.innerHTML = "";
        const querySnapshot = await getDocs(collection(db, "habits"));

        querySnapshot.forEach((habitDoc) => {
            const habit = habitDoc.data();
            const li = document.createElement("li");

            li.innerHTML = `
                <span>${habit.name} (${habit.difficulty}) - ${habit.description}</span>
                <span>🔥 Streak: ${habit.streak || 0} days</span>
                <button onclick="markCompleted('${habitDoc.id}', ${habit.completedToday || false})">
                    ${habit.completedToday ? "Undo" : "Mark Complete"}
                </button>
                <button onclick="deleteHabit('${habitDoc.id}')">Delete</button>
            `;

            if (habit.completedToday) li.style.textDecoration = "line-through";
            habitsList.appendChild(li);
        });
    } catch (error) {
        console.error("❌ Error loading habits:", error);
    }
}

// ✅ Add New Habit
saveHabitButton.addEventListener("click", async () => {
    const name = document.getElementById("habit-name").value;
    const description = document.getElementById("habit-description").value;
    const difficulty = document.querySelector('input[name="habit-difficulty"]:checked').value;

    if (name && description && difficulty) {
        try {
            await addDoc(collection(db, "habits"), {
                name,
                description,
                difficulty: parseInt(difficulty),
                completedToday: false,
                streak: 0
            });

            document.getElementById("habit-name").value = "";
            document.getElementById("habit-description").value = "";
            habitInputs.classList.add("hidden");
            await loadHabits();
        } catch (error) {
            console.error("❌ Error adding habit:", error);
        }
    } else {
        alert("Please fill in all fields and select a difficulty.");
    }
});

// ✅ Mark Habit as Completed
window.markCompleted = async function (habitId, currentState) {
    try {
        const habitRef = doc(db, "habits", habitId);
        const habitSnap = await getDoc(habitRef);

        if (habitSnap.exists()) {
            let habit = habitSnap.data();
            const newStreak = currentState ? habit.streak : (habit.streak || 0) + 1;

            await updateDoc(habitRef, {
                completedToday: !currentState,
                streak: newStreak
            });
            await loadHabits();
        }
    } catch (error) {
        console.error("❌ Error updating habit:", error);
    }
};

// ✅ Delete Habit
window.deleteHabit = async function (habitId) {
    try {
        await deleteDoc(doc(db, "habits", habitId));
        await loadHabits();
    } catch (error) {
        console.error("❌ Error deleting habit:", error);
    }
};

// ✅ Chatbot API Integration
async function sendMessage() {  
    const userMessage = chatbotInput.value || "Hello, how are you?";
    const apiUrl = `https://generativelanguage.googleapis.com/v1/${MODEL_NAME}:generateContent?key=${API_KEY}`;

    const requestBody = { contents: [{ parts: [{ text: userMessage }] }] };

    try {
        const response = await fetch(apiUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody)
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`HTTP error! Status: ${response.status}, Message: ${errorText}`);
        }

        const data = await response.json();
        console.log("✅ API Response:", data);

        if (data.candidates && data.candidates.length > 0) {
            const messageText = data.candidates[0].content.parts[0].text;
            displayMessage(userMessage, "user");
            displayMessage(messageText, "bot");
        } else {
            displayMessage("I'm sorry, I couldn't generate a response.", "bot");
        }

        chatbotInput.value = "";
    } catch (error) {
        console.error("❌ API Request Failed:", error);
    }
}

function displayMessage(message, sender) {
    const msgElement = document.createElement("div");
    msgElement.classList.add("chat-message", sender);
    msgElement.textContent = message;
    chatbotMessages.appendChild(msgElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

chatbotSend.addEventListener("click", sendMessage);
chatbotInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") sendMessage();
});

const toggleChatbot = document.getElementById("toggleChatbot");

document.getElementById("chatbot-toggle").addEventListener("click", function() {
    document.getElementById("chatbot-container").classList.toggle("visible");
});

// **Google Cloud Vision API Face Authentication**
async function detectFaceGoogleCloud(imageData) {
    const endpoint = `https://vision.googleapis.com/v1/images:annotate?key=${VISION_API_KEY}`;

    const requestBody = {
        requests: [
            {
                image: { content: imageData },
                features: [{ type: "FACE_DETECTION" }],
            },
        ],
    };

    try {
        const response = await fetch(endpoint, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        });

        const data = await response.json();
        const faceAnnotations = data.responses[0].faceAnnotations;
        return faceAnnotations && faceAnnotations.length > 0;
    } catch (error) {
        console.error("Error with Vision API:", error);
        return false;
    }
}

// Webcam Setup for Face Recognition with User Consent
async function setupFaceRecognition() {
    const video = document.getElementById("video");
    const consentMessage = document.getElementById("consentMessage");

    if (localStorage.getItem('hasGivenConsent') === 'true') {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        video.srcObject = stream;
        video.style.display = "block";

        video.onloadedmetadata = () => {
            video.play();
            captureImage(video);
        };
    } else {
        consentMessage.style.display = "block";

        document.getElementById("consentBtn").addEventListener("click", async () => {
            localStorage.setItem('hasGivenConsent', 'true');
            consentMessage.style.display = "none";

            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                video.srcObject = stream;
                video.style.display = "block";
                video.onloadedmetadata = () => {
                    video.play();
                    captureImage(video);
                };
            } catch (error) {
                console.error("Error accessing webcam:", error);
                alert("Failed to access camera.");
            }
        });
    }
}

// Capture Image & Send to Google Vision API
let detectionInterval;

async function captureImage(video) {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/jpeg").split(",")[1];
    const faceDetected = await detectFaceGoogleCloud(imageData);

    document.getElementById("face-status").textContent = faceDetected
        ? " Face detected!"
        : "❌ No face detected. Try again.";

    if (faceDetected) {
        clearInterval(detectionInterval);
        showLoginSuccess(); // Trigger login success
        stopVideoStream(video); // Hide the video stream and stop webcam
    } else {
        detectionInterval = setTimeout(() => captureImage(video), 2000);
    }
}

// Function to show login success and stop face recognition
function showLoginSuccess() {
    const successMessage = document.createElement("div");
    successMessage.id = "login-success";
    successMessage.innerHTML = "<h2>You are logged in!</h2>";
    document.body.appendChild(successMessage);
    console.log("User authenticated successfully!");
}

// Function to stop the video stream and hide the camera
function stopVideoStream(video) {
    const stream = video.srcObject;
    const tracks = stream.getTracks();
    tracks.forEach(track => track.stop());
    video.style.display = "none";
}

setupFaceRecognition();
