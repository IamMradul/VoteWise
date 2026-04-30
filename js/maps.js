document.addEventListener('DOMContentLoaded', () => {
    const mapForm = document.getElementById('map-form');
    const locationInput = document.getElementById('location-input');
    const mapContainer = document.getElementById('map-container');

    if (!mapForm || !mapContainer) return;

    // Display a placeholder before search
    mapContainer.innerHTML = '<div style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: #555;">Enter your location above to find nearby polling booths.</div>';

    let map = null;
    let marker = null;
    let infoWindow = null;
    let geocoder = null;

    /**
     * Dynamically loads the Google Maps JavaScript API.
     * @param {string} apiKey - The Google Maps API Key
     * @returns {Promise<void>}
     */
    function loadGoogleMapsAPI(apiKey) {
        return new Promise((resolve, reject) => {
            if (window.google && window.google.maps) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
            script.async = true;
            script.defer = true;
            script.onload = resolve;
            script.onerror = () => reject(new Error('Failed to load Google Maps API'));
            document.head.appendChild(script);
        });
    }

    /**
     * Initializes the Google Map on the page.
     * @param {Object} location - The LatLng object
     */
    function initMap(location) {
        mapContainer.innerHTML = ''; // Clear placeholder
        map = new window.google.maps.Map(mapContainer, {
            center: location,
            zoom: 14,
            mapTypeId: 'roadmap'
        });
        geocoder = new window.google.maps.Geocoder();
        marker = new window.google.maps.Marker({
            map: map,
            position: location,
            animation: window.google.maps.Animation.DROP
        });
        infoWindow = new window.google.maps.InfoWindow();
    }

    /**
     * Resolves an address using the Geocoder and updates the map.
     * @param {string} address - The address to search
     */
    function geocodeAddress(address) {
        if (!geocoder) geocoder = new window.google.maps.Geocoder();
        
        geocoder.geocode({ address: address + ', India' }, (results, status) => {
            if (status === 'OK' && results[0]) {
                const location = results[0].geometry.location;
                if (!map) {
                    initMap(location);
                } else {
                    map.setCenter(location);
                    marker.setPosition(location);
                }
                
                infoWindow.setContent(`
                    <div style="padding: 10px; color: #333;">
                        <h4 style="margin: 0 0 5px 0;">Nearest Polling Booth Area</h4>
                        <p style="margin: 0; font-size: 0.9em;">${results[0].formatted_address}</p>
                    </div>
                `);
                infoWindow.open(map, marker);
            } else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    mapForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const loc = locationInput.value.trim();
        if (!loc) return;

        const apiKey = window.APP_CONFIG?.GOOGLE_MAPS_API_KEY;
        if (!apiKey || apiKey === 'YOUR_KEY_HERE') {
            mapContainer.innerHTML = '<div style="padding: 1rem; color: #D32F2F; border: 1px solid #D32F2F; border-radius: 4px; background: white; margin: 1rem;">Google Maps API Key is missing. Please add it to your configuration.</div>';
            return;
        }

        try {
            await loadGoogleMapsAPI(apiKey);
            geocodeAddress(loc);
        } catch (error) {
            console.error(error);
            mapContainer.innerHTML = '<div style="padding: 1rem; color: #D32F2F; border: 1px solid #D32F2F; border-radius: 4px; background: white; margin: 1rem;">Failed to load Google Maps. Please check your network connection.</div>';
        }
    });
});
