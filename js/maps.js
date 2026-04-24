document.addEventListener('DOMContentLoaded', () => {
    const mapForm = document.getElementById('map-form');
    const locationInput = document.getElementById('location-input');
    const mapContainer = document.getElementById('map-container');

    if (!mapForm || !mapContainer) return;

    // Display a placeholder before search
    mapContainer.innerHTML = '<div style="width: 100%; height: 450px; background: var(--color-grey); display: flex; align-items: center; justify-content: center;">Enter your location above to find nearby polling booths.</div>';

    /**
     * Renders a Google Maps Embed iframe for a given location query.
     * Sanitizes input with encodeURIComponent before building the URL.
     * @param {string} location - City name or PIN code to search
     * @param {string} apiKey - Google Maps Embed API key
     */
    mapForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const loc = encodeURIComponent(locationInput.value.trim());
        if (!loc) return;

        const apiKey = window.APP_CONFIG?.GOOGLE_MAPS_API_KEY;
        if (!apiKey || apiKey === 'YOUR_KEY_HERE') {
            mapContainer.innerHTML = '<div style="padding: 1rem; color: #D32F2F; border: 1px solid #D32F2F; border-radius: 4px;">Google Maps API Key is missing. Please add it to your configuration.</div>';
            return;
        }

        const iframeHtml = `
            <iframe
                width="100%"
                height="450"
                style="border:0;"
                loading="lazy"
                allowfullscreen
                referrerpolicy="no-referrer-when-downgrade"
                src="https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=Polling+Booth+${loc}">
            </iframe>
        `;
        mapContainer.innerHTML = iframeHtml;
    });
});
