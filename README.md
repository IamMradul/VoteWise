# 🗳️ VoteWise — Election Process Education Assistant

> A smart, dynamic, single-page web application empowering Indian citizens to understand the democratic election process through AI-driven conversations, interactive tools, and real-time Google service integrations.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Gemini API](https://img.shields.io/badge/Gemini%20API-4285F4?style=flat&logo=google&logoColor=white)
![Google Maps](https://img.shields.io/badge/Google%20Maps-34A853?style=flat&logo=googlemaps&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Enabled-5A0FC8?style=flat&logo=pwa&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Chosen Vertical](#-chosen-vertical)
- [Features](#-features)
- [Google Services Used](#-google-services-used)
- [How It Works — Approach & Logic](#-how-it-works--approach--logic)
- [Decision-Making Logic](#-decision-making-logic)
- [File Structure](#-file-structure)
- [Getting Started](#-getting-started)
- [Running Tests](#-running-tests)
- [Accessibility](#-accessibility)
- [Security](#-security)
- [Assumptions](#-assumptions)

---

## 🌟 Overview

VoteWise is an AI-powered civic education tool targeted at Indian citizens. It removes the confusion around India's multi-phase general election process by combining a context-aware Gemini AI chat assistant with interactive educational modules — all in a single, lightweight, offline-capable web app.

The app is designed to be usable by first-time voters, students, and anyone curious about the democratic process, with support for 8 Indian regional languages via Google Translate.

---

## 🎯 Chosen Vertical

**Election Process Education**

India conducts the world's largest democratic elections, yet millions of eligible voters are uncertain about how to register, what the Election Commission of India (ECI) does, how EVMs work, or what NOTA means. VoteWise bridges this knowledge gap through an intelligent, guided experience.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Chat Assistant** | Gemini-powered assistant that answers questions strictly about Indian elections, with context-awareness |
| 📅 **Election Timeline** | Interactive accordion timeline covering all 6 phases of the election lifecycle |
| ✅ **Voter Eligibility Checker** | Instant rule-based tool to check if a citizen can register to vote |
| 🧠 **Dynamic Quiz** | Gemini-generated 10-question MCQ quiz on election knowledge, with scoring and explanations |
| 🗺️ **Polling Booth Finder** | Google Maps Embed integration to locate nearby polling stations by city or PIN code |
| 🌐 **Multi-language Support** | Google Translate Widget for Hindi, Tamil, Bengali, Telugu, Marathi, Gujarati, Kannada, and Malayalam |
| 📶 **Offline Support** | Service Worker caches core static assets for use without internet |

---

## 🔧 Google Services Used

### 1. Gemini API (`gemini-1.5-flash`)
The core intelligence of the application. Used in two distinct flows:
- **Chat Assistant** — A system-prompted, context-aware conversation agent that only answers Indian election-related queries, uses low temperature (0.3) for factual accuracy, and guides off-topic users back to electoral topics.
- **Quiz Generator** — Dynamically generates a fresh 10-question MCQ set on every quiz attempt, with structured JSON output enforced via prompt engineering.

### 2. Google Maps Embed API
Allows users to search for polling booths in their city or by PIN code. Renders an embedded, interactive map inside the page without requiring any additional SDK, keeping the bundle lightweight.

### 3. Google Translate Widget
Injects a language selector in the navigation bar that can translate the entire UI into 8 Indian regional languages, ensuring the app reaches non-English-speaking voters.

### 4. Google Fonts — Noto Sans
Chosen specifically for its multi-lingual Unicode support, ensuring that translated text renders correctly across all 8 regional languages without font-rendering failures.

---

## ⚙️ How It Works — Approach & Logic

The application is a **zero-build, vanilla JavaScript SPA** — no bundlers, no heavy frameworks — making it universally deployable.

```
User lands on page
      │
      ├─► Timeline Section      → Static accordion content (available offline)
      │
      ├─► Eligibility Checker   → Rule-based logic: age ≥ 18 + citizen + resident
      │
      ├─► Quiz Section          → Gemini API call → JSON parse → render MCQ UI
      │
      ├─► Polling Booth Finder  → Google Maps Embed iframe rendered on search
      │
      └─► AI Chat Widget        → Gemini API call with system prompt constraints
```

**Configuration** is handled via a two-file pattern: `config.example.js` is committed (no keys), and `config.local.js` (gitignored) holds real keys. The app loads both at runtime and the local file silently overrides the example.

**Offline capability** is provided by a Service Worker (`sw.js`) that caches all static assets on first load. The Timeline and Eligibility modules work fully offline; AI features gracefully degrade with error messages when offline.

---

## 🧠 Decision-Making Logic

### Chat Assistant
The Gemini system prompt enforces three decision rules:
1. **Topic gating** — If a query is unrelated to Indian elections, the assistant refuses and redirects to electoral topics.
2. **Regional awareness** — If the user mentions a state or region (e.g., "I live in Punjab"), the assistant tailors its response with region-specific voting context.
3. **Factual precision** — Temperature is set to `0.3` and responses are capped at 100 words to prioritize accuracy over verbosity.

### Eligibility Checker
Pure deterministic logic: `age >= 18 AND isCitizen === true AND isResident === true`. If ineligible, the specific failing condition(s) are listed in the output so users know exactly what they need to change.

### Quiz Generator
Gemini is prompted to return **only** a valid JSON array with a strict schema (`question`, `options[]`, `correctIndex`, `explanation`). The app strips any potential markdown code fences before parsing to handle edge cases in Gemini's output formatting.

---

## 📁 File Structure

```
VoteWise/
├── index.html              # Main SPA layout with semantic HTML & ARIA labels
├── style.css               # Custom CSS with Indian tricolor design system
├── sw.js                   # Service worker for offline caching
├── manifest.json           # PWA manifest for installability
├── .env.example            # Environment variable reference
├── .gitignore              # Excludes config.local.js and sensitive files
│
├── js/
│   ├── config.example.js   # API key template (commit this, not the real keys)
│   ├── init.js             # Initialization logic and module coordination
│   ├── chat.js             # Gemini chat assistant logic
│   ├── quiz.js             # Dynamic quiz generation & rendering
│   ├── eligibility.js      # Voter eligibility rule engine
│   ├── timeline.js         # Accordion timeline interactions
│   ├── translate.js        # Google Translate widget initialization
│   └── maps.js             # Google Maps Embed integration
│
└── tests/
    └── test.js             # Node.js assertion tests for core logic modules
```

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser
- Node.js (for running tests and a local server)
- A [Gemini API Key](https://aistudio.google.com/)
- A [Google Maps API Key](https://developers.google.com/maps) with the **Maps Embed API** enabled

### 1. Clone the Repository
```bash
git clone https://github.com/IamMradul/VoteWise.git
cd VoteWise
```

### 2. Configure API Keys
```bash
# Copy the example config
cp js/config.example.js js/config.local.js
```
Then open `js/config.local.js` and replace the placeholder values:
```javascript
const CONFIG = {
    GEMINI_API_KEY: "your-actual-gemini-key",
    GOOGLE_MAPS_API_KEY: "your-actual-maps-key"
};
```
> ⚠️ `config.local.js` is already listed in `.gitignore` — your keys will never be committed.

### 3. Start a Local Server
Service Workers require a server context (not `file://`):
```bash
npx serve .
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Running Tests

Tests use Node.js built-in `assert` — no test framework needed.

```bash
node tests/test.js
```

Expected output:
```
--- Running VoteWise Tests ---
✅ PASS: Eligibility: under 18 (fail)
✅ PASS: Eligibility: exactly 18 (pass)
✅ PASS: Eligibility: non-citizen (fail)
✅ PASS: Eligibility: valid inputs (pass)
✅ PASS: Quiz: correct answers increment score
✅ PASS: Quiz: wrong answers do not increment
✅ PASS: Language Mapping: Hindi -> hi
✅ PASS: Language Mapping: Tamil -> ta
✅ PASS: Language Mapping: Bengali -> bn
✅ PASS: Language Mapping: Telugu -> te
✅ PASS: Gemini Parser: Extracts text correctly
✅ PASS: Gemini Parser: Handles empty/invalid object

Test Summary: 12 Passed, 0 Failed.
```

---

## ♿ Accessibility

VoteWise was built with inclusive design as a first-class concern:
- All interactive elements have `aria-label` attributes
- Accordion timeline uses `aria-expanded` and `aria-controls` with proper hidden state management
- Chat messages use `aria-live="polite"` for screen reader announcements
- Eligibility result uses `aria-live="polite"` for dynamic updates
- Full keyboard navigation support on all accordion buttons (`Enter` / `Space`)
- Focus indicators meet WCAG contrast requirements (3px green outline)
- Color is never the sole means of conveying information
- Google Translate Widget supports 8 Indian regional languages

---

## 🔒 Security

- **API Keys** are never committed — they live in `config.local.js` which is gitignored
- User input in the Maps search is sanitized via `encodeURIComponent` before use in URLs
- Gemini API calls are rate-limited to `maxOutputTokens: 250` to prevent abuse
- Chat input is disabled during pending requests to prevent duplicate submissions
- The `.env.example` provides a reference without exposing credentials
- All external links use `rel="noopener noreferrer"` to prevent tab-napping attacks

---

## 📌 Assumptions

1. **Target audience** is Indian citizens or residents interested in General Elections (Lok Sabha / Vidhan Sabha).
2. **Internet connectivity** is required for the AI Chat, Quiz, and Maps features. Core UI (Timeline, Eligibility Checker) works offline via Service Worker cache.
3. **API keys** are supplied by the user running the app — this is a client-side educational tool, not a production service with a backend.
4. **Gemini output** is assumed to return valid JSON for quiz generation; a client-side sanitization step (stripping markdown fences) handles edge cases.
5. The app targets modern evergreen browsers (Chrome, Firefox, Edge, Safari) that support ES6+ and Service Workers.

---

<div align="center">
  <strong>Built with ❤️ for democratic empowerment</strong><br>
  <sub>Powered by Google Gemini · Google Maps · Google Translate · Google Fonts</sub>
</div>