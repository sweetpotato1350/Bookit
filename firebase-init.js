import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.8.1/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/9.8.1/firebase-auth.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/9.8.1/firebase-database.js';

const firebaseConfig = {
    apiKey: "AIzaSyAVGl0pYNeCB9eJOd1p91e3149bH62H-6k",
    authDomain: "ughs-reservation2024.firebaseapp.com",
    databaseURL: "https://ughs-reservation2024-default-rtdb.firebaseio.com",
    projectId: "ughs-reservation2024",
    storageBucket: "ughs-reservation2024.appspot.com",
    messagingSenderId: "583392468686",
    appId: "1:583392468686:web:2856832b88ead0d8167a9f",
    measurementId: "G-D543RC3FNW"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);

export { auth, database };