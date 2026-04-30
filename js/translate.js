/**
 * @fileoverview Logic for Google Translate Integration.
 * Dynamically loads the translate script and tracks language changes.
 */

/**
 * Mapping of supported Indian languages.
 * @constant {Object}
 */
const LanguageMapping = {
    'Hindi': 'hi',
    'Tamil': 'ta',
    'Bengali': 'bn',
    'Telugu': 'te',
    'Marathi': 'mr',
    'Gujarati': 'gu',
    'Kannada': 'kn',
    'Malayalam': 'ml'
};

/**
 * Callback function initialized by the Google Translate API.
 * Sets up the translate widget and attaches event listeners for GA4 tracking.
 */
function googleTranslateElementInit() {
    new window.google.translate.TranslateElement({
      pageLanguage: 'en', 
      includedLanguages: Object.values(LanguageMapping).join(','), 
      layout: window.google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');

    // Add a listener to track language changes in GA4
    if (typeof document !== 'undefined') {
        const checkExist = setInterval(() => {
            const selectElement = document.querySelector('.goog-te-combo');
            if (selectElement) {
                clearInterval(checkExist);
                selectElement.addEventListener('change', (e) => {
                    const selectedLang = e.target.value;
                    if (selectedLang && typeof gtag === 'function') {
                        gtag('event', 'language_changed', {
                            event_category: 'engagement',
                            language: selectedLang
                        });
                    }
                });
            }
        }, 1000); // Check every second for the dynamically injected select element
    }
}

/**
 * Injects the Google Translate script into the document head.
 */
function injectTranslateScript() {
    if (typeof document !== 'undefined') {
        const translateScript = document.createElement('script');
        translateScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        document.head.appendChild(translateScript);
    }
}

// Dynamically inject the Google Translate script
injectTranslateScript();

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LanguageMapping, googleTranslateElementInit, injectTranslateScript };
}
