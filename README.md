# VoteWise - Election Process Education

VoteWise is a smart, dynamic, single-page web application designed to act as an Election Process Education Assistant for Indian citizens. It helps users understand the entire election lifecycle securely, effectively, and intelligently.

## Project Details

- **Vertical:** Election Process Education
- **Approach:** Context-aware Gemini AI assistant integrated with interactive educational modules (e.g., timeline, quiz, eligibility).
- **Assumptions:** 
  - The target user is an Indian citizen or resident checking their eligibility or seeking education about the Indian General Elections.
  - Internet access is required for the AI chat module and Maps features to function, but static UI and timeline components are available offline via the service worker caching.

## Google Services Used
- **Gemini API:** Powers the dynamic chat assistant and the auto-generating 10-question quiz module.
- **Google Maps Embed API:** Provides basic map framing to visually help users search for polling branches.
- **Google Translate Widget:** Empowers users to read the UI seamlessly in Hindi, Tamil, Bengali, Telugu, and other regional languages.
- **Google Fonts (Noto Sans):** Selected for its accessible and robust multi-lingual typefaces.

## File Structure Highlights
- `/index.html` - Base semantic HTML layout with ARIA labels
- `/style.css` - Custom styling without UI libraries (Indian tricolor derived)
- `/sw.js` - Service worker caching the core application
- `/js/config.example.js` - API Key configuration template
- `/js/chat.js` - Gemini integration logic
- `/js/quiz.js` - Dynamic quiz generation logic
- `/tests/test.js` - Simple assertion validation tests

## How to Run

1. **Clone or Navigate to the Repository**
   Make sure you are in the application root directory.

2. **Configure API Keys**
   - Rename `js/config.example.js` to `js/config.local.js` (you must do this or the app keys will default to invalid placeholders).
   - *Note: `js/config.local.js` is automatically hidden by `.gitignore`.*
   - Open `js/config.local.js` and add your real `GEMINI_API_KEY` and `GOOGLE_MAPS_API_KEY`.

3. **Serve the Application Localy**
   Since we use Service Workers and modules, you should serve this securely via localhost.
   ```bash
   npx serve .
   ```
   Or use any local web server. Open `http://localhost:3000` (or whichever port your server uses).

4. **Running Tests**
   You can validate the module logic directly using node:
   ```bash
   node tests/test.js
   ```

Enjoy exploring the democratic process!
