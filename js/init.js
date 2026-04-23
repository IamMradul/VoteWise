document.addEventListener('DOMContentLoaded', () => {
const key = window.APP_CONFIG?.GEMINI_API_KEY;
if (!key || key === 'YOUR_KEY_HERE') {
const banner = document.getElementById('setup-banner');
if (banner) banner.style.display = 'block';
}
});
