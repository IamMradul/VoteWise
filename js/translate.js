// Translate initialization callback
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
      pageLanguage: 'en', 
      includedLanguages: 'hi,ta,bn,te,mr,gu,kn,ml', 
      layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element');
}

// Dynamically inject the Google Translate script
if (typeof document !== 'undefined') {
(function() {
    const translateScript = document.createElement('script');
    translateScript.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.head.appendChild(translateScript);
})();
}

// Extracted for testing language code mapping
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

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { LanguageMapping, googleTranslateElementInit };
}
