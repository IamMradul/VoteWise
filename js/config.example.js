// js/config.example.js
// Rename this file to config.local.js and add your actual API keys.
// Make sure js/config.local.js is in your .gitignore file.

const CONFIG = {
    GEMINI_API_KEY: "YOUR_KEY_HERE",
    GOOGLE_MAPS_API_KEY: "YOUR_KEY_HERE",
    
    // Google Analytics 4
    GA_MEASUREMENT_ID: "G-XXXXXXXXXX",
    
    // Firebase Config for Leaderboard (v9/v10 Compat)
    FIREBASE_CONFIG: {
        apiKey: "YOUR_FIREBASE_API_KEY",
        authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
        projectId: "YOUR_PROJECT_ID",
        storageBucket: "YOUR_PROJECT_ID.appspot.com",
        messagingSenderId: "YOUR_SENDER_ID",
        appId: "YOUR_APP_ID"
    }
};

// If config.local.js is loaded later, it will override this.
if (typeof window !== 'undefined') {
    window.APP_CONFIG = CONFIG;
}
