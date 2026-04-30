document.addEventListener('DOMContentLoaded', () => {
    const config = window.APP_CONFIG || {};
    
    // Check for Gemini API Key
    const key = config.GEMINI_API_KEY;
    if (!key || key === 'YOUR_KEY_HERE') {
        const banner = document.getElementById('setup-banner');
        if (banner) banner.style.display = 'block';
    }

    // Initialize GA4
    const gaId = config.GA_MEASUREMENT_ID;
    if (gaId && gaId !== 'G-XXXXXXXXXX') {
        gtag('config', gaId);
    }

    // Initialize Firebase
    const fbConfig = config.FIREBASE_CONFIG;
    if (fbConfig && fbConfig.apiKey && fbConfig.apiKey !== 'YOUR_FIREBASE_API_KEY') {
        try {
            firebase.initializeApp(fbConfig);
            window.db = firebase.firestore();
        } catch (e) {
            console.error('Firebase initialization error', e);
        }
    }
});
