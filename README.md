<div align="center">

<img src="https://img.shields.io/badge/VoteWise-Election%20Education%20Assistant-FF6B35?style=for-the-badge&logo=data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZmlsbD0id2hpdGUiIGQ9Ik0xOCAzSDZjLTEuMSAwLTIgLjktMiAydjE0YzAgMS4xLjkgMiAyIDJoMTJjMS4xIDAgMi0uOSAyLTJWNWMwLTEuMS0uOS0yLTItMnptLTIgMTRINnYtMmgxMHYyem0wLTRINnYtMmgxMHYyem0wLTRINlY3aDEwdjJ6Ii8+PC9zdmc+" alt="VoteWise"/>

# 🗳️ VoteWise

### *Election Process Education Assistant for India*

> An AI-powered civic education platform empowering every Indian citizen to understand, participate in, and engage with the world's largest democratic election process.

<br>

[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Gemini API](https://img.shields.io/badge/Gemini%201.5%20Flash-4285F4?style=flat-square&logo=google&logoColor=white)](https://aistudio.google.com/)
[![Firebase](https://img.shields.io/badge/Firebase%20Firestore-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Google Maps](https://img.shields.io/badge/Maps%20JS%20API-34A853?style=flat-square&logo=googlemaps&logoColor=white)](https://developers.google.com/maps)
[![PWA](https://img.shields.io/badge/PWA-Enabled-5A0FC8?style=flat-square&logo=pwa&logoColor=white)](https://web.dev/progressive-web-apps/)
[![Jest](https://img.shields.io/badge/Jest-40%20Tests%20Passing-C21325?style=flat-square&logo=jest&logoColor=white)](https://jestjs.io/)
[![ESLint](https://img.shields.io/badge/ESLint-Configured-4B32C3?style=flat-square&logo=eslint&logoColor=white)](https://eslint.org/)
[![License](https://img.shields.io/badge/License-MIT-22c55e?style=flat-square)](./LICENSE)

<br>

**[🚀 Live Demo](https://votewise.vercel.app)** &nbsp;·&nbsp; **[🐛 Report Bug](https://github.com/IamMradul/VoteWise/issues)** &nbsp;·&nbsp; **[💡 Request Feature](https://github.com/IamMradul/VoteWise/issues)**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Chosen Vertical](#-chosen-vertical)
- [Features](#-features)
- [Google Services Used](#-google-services-used)
- [How It Works](#-how-it-works)
- [Architecture & Flow](#-architecture--flow)
- [Decision-Making Logic](#-decision-making-logic)
- [File Structure](#-file-structure)
- [Getting Started](#-getting-started)
- [Deploying to Vercel](#-deploying-to-vercel)
- [Running Tests](#-running-tests)
- [Code Quality & Linting](#-code-quality--linting)
- [Accessibility](#-accessibility)
- [Security](#-security)
- [Assumptions](#-assumptions)

---

## 🌟 Overview

VoteWise is a **zero-build, vanilla JavaScript Single Page Application** that removes confusion around India's multi-phase General Election process. It combines a **context-aware Gemini AI chat assistant** with interactive educational modules — all delivered as a lightweight, offline-capable **Progressive Web App**.

Designed for first-time voters, students, and civic educators — with support for **8 Indian regional languages** via Google Translate, a **Gemini-generated quiz** with a **live Firebase Firestore leaderboard**, a **Google Maps JavaScript API polling booth finder**, and a **Google Calendar reminder** so no voter ever misses election day.

| 🧠 | 📊 | 🌐 | 📶 |
|---|---|---|---|
| AI-powered conversation with topic gating | Real-time quiz leaderboard via Firebase | 8 regional language support | Works offline via Service Worker |

---

## 🎯 Chosen Vertical

**Election Process Education for Indian Citizens**

India conducts the world's largest democratic elections — yet millions of eligible voters remain uncertain about how to register, what the Election Commission of India (ECI) does, how Electronic Voting Machines (EVMs) work, or what NOTA means.

VoteWise bridges this knowledge gap through an intelligent, guided, multilingual experience — installable as a PWA, partially usable offline, and entirely open-source.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Chat Assistant** | Gemini-powered assistant with multi-turn memory, topic gating, and regional context awareness |
| 🧠 **Dynamic AI Quiz** | Gemini-generated 10-question MCQ quiz with per-question explanations and a live leaderboard |
| 🏆 **Firebase Leaderboard** | Top quiz scores saved anonymously to Firestore and displayed in real-time |
| 📅 **Election Timeline** | Interactive accordion covering all 6 phases of the Indian election lifecycle |
| ✅ **Voter Eligibility Checker** | Instant rule-based tool with specific, actionable failure explanations |
| 🗺️ **Polling Booth Finder** | Google Maps JavaScript API with Geocoder — search any city and get a pinned location + InfoWindow |
| 🌐 **Multi-language Support** | Google Translate Widget for 8 Indian regional languages (Hindi, Tamil, Bengali, Telugu, Marathi, Gujarati, Kannada, Malayalam) |
| 📆 **Election Day Reminder** | Google Calendar integration — add election day with one click, no OAuth required |
| 📝 **Citizen Feedback** | Google Forms integration for continuous improvement feedback |
| 📶 **Offline Support** | Service Worker + PWA manifest — Timeline and Eligibility work without internet |
| 📊 **GA4 Analytics** | Custom event tracking for quiz start, quiz complete, chat messages, and language changes |
| 🔒 **Content Security Policy** | CSP meta tag covering `script-src`, `connect-src`, and `frame-src` |
| ⚠️ **Setup Banner** | Detects missing API keys on load and guides users through configuration |

---

## 🔧 Google Services Used

VoteWise integrates **7 distinct Google services**, each serving a core function in the application:

---

### 1. 🤖 Gemini API — `gemini-1.5-flash`

The core AI intelligence, used in **two distinct flows**:

**Chat Assistant**
- System-prompted agent strictly restricted to Indian election topics
- Uses `temperature: 0.3` for factual precision
- Maintains rolling 10-exchange conversation history (`conversationHistory` array, capped at 20 entries)
- 500-character input cap to prevent prompt injection
- Graceful error handling with user-visible messages

**Quiz Generator**
- Dynamically generates a **fresh 10-question MCQ set** on every attempt
- JSON output enforced via prompt engineering; markdown code fences are stripped before `JSON.parse()`
- Error boundary catches malformed output and shows a user-friendly retry message

---

### 2. 🗺️ Google Maps JavaScript API

Replaces a basic iframe embed with a **fully interactive Maps integration**:
- Dynamically loads the Maps JS script with the user's API key
- On search, the **Geocoder API** resolves any Indian city or address to `LatLng` coordinates
- A **Marker** with a `DROP` animation is placed at the resolved location
- An **InfoWindow** displays the formatted address and "Nearest Polling Booth Area" label
- Graceful fallback UI if the Maps script fails to load

---

### 3. 🔥 Firebase Firestore (Compat SDK v10)

Powers the **Quiz Leaderboard** — no login required:
- After completing the quiz, the user's score is saved anonymously to a `leaderboard` Firestore collection
- The top 5 scores are fetched in real-time (ordered by score descending)
- Degrades gracefully if Firebase is not configured — shows a clear "unavailable" message instead of crashing
- Initialized via the Compat SDK (`<script>` tags) for compatibility with the no-bundler setup

---

### 4. 📊 Google Analytics 4 (GA4)

Custom `gtag` events track meaningful user engagement across the application:

| Event | Trigger |
|---|---|
| `quiz_start` | User clicks "Generate & Start Quiz" |
| `quiz_complete` | User reaches the summary screen (with score as `value`) |
| `chat_message_sent` | User sends a message to the AI assistant |
| `language_changed` | User selects a language from the Translate widget |

---

### 5. 🌐 Google Translate Widget

- Injects a language selector into the navigation bar
- Supports 8 Indian regional languages: **Hindi, Tamil, Bengali, Telugu, Marathi, Gujarati, Kannada, Malayalam**
- Uses an interval-based listener to detect the dynamically injected `<select>` element and fire GA4 events on language change

---

### 6. 🔤 Google Fonts — Noto Sans

Selected for its **broad Unicode coverage**, ensuring translated regional language text renders correctly without font-fallback failures across all 8 supported scripts.

---

### 7. 📆 Google Calendar + 📝 Google Forms

- **Google Calendar**: A pre-filled "Add to Calendar" link saves Indian Election Day directly — no OAuth required
- **Google Forms**: A citizen feedback form closes the improvement feedback loop

---

## ⚙️ How It Works

VoteWise is a **zero-build, vanilla JS SPA** — no bundlers, no frameworks, universally deployable on any static host.

**API Key Strategy**: A two-file pattern keeps secrets safe:
- `js/config.example.js` — committed to Git, contains only placeholder values
- `js/config.local.js` — gitignored, contains your real keys for local development
- On Vercel, keys live as environment variables accessed via serverless `/api/` proxy routes — never exposed in the browser

**Offline Capability**: A Service Worker (`sw.js`) caches all static assets on first load. The Timeline and Eligibility Checker work fully offline. AI features degrade gracefully with a clear error message.

---

## 🏗️ Architecture & Flow

```
User lands on page
      │
      ├─► js/init.js           → Detects missing API keys → Shows setup banner
      │
      ├─► About Section        → Project mission & Indian election context
      │
      ├─► Timeline Section     → Static accordion + Google Calendar CTA
      │
      ├─► Eligibility Checker  → Rule-based: age ≥ 18 + citizen + resident
      │
      ├─► Quiz Section         → Gemini API → JSON parse → MCQ UI
      │         │
      │         └─► Firebase Firestore → Save score → Fetch top 5 leaderboard
      │
      ├─► Polling Booth Finder → Maps JS API → Geocoder → Marker + InfoWindow
      │
      ├─► Feedback Section     → Google Forms link
      │
      └─► AI Chat Widget       → Gemini API (system prompt + rolling history)
                │
                └─► GA4 gtag events fired at every key user interaction
```

---

## 🧠 Decision-Making Logic

### Chat Assistant
The Gemini system prompt enforces three strict rules on every conversational turn:
1. **Topic gating** — Queries unrelated to Indian elections are declined and redirected politely
2. **Regional awareness** — If a state or region is mentioned (e.g., "I live in Tamil Nadu"), the assistant provides region-relevant electoral context
3. **Factual precision** — `temperature: 0.3` and `maxOutputTokens: 250` prioritize accuracy over verbosity

### Voter Eligibility Checker
Pure deterministic logic: `age >= 18 AND isCitizen === true AND isResident === true`. When a user is ineligible, the specific failing condition(s) are listed individually so users know exactly what disqualifies them.

### Quiz Generator
Gemini is prompted to return **only** a valid JSON array with the schema: `{ question, options[], correctIndex, explanation }`. A sanitizer strips markdown code fences before `JSON.parse()`. An error boundary catches malformed output and offers a retry instead of crashing the UI.

### Polling Booth Finder
Instead of a static embed iframe, the Maps JS API is loaded dynamically only when the user submits a search — keeping the initial page load fast. The Geocoder appends `, India` to every query to bias results toward Indian locations.

---

## 📁 File Structure

```
VoteWise/
├── index.html              # SPA layout — semantic HTML5, ARIA, CSP meta, GA4, Firebase scripts
├── style.css               # Indian tricolor design system, CSS variables, responsive layout
├── sw.js                   # Service Worker — caches static assets for offline use
├── manifest.json           # PWA manifest for installability
├── package.json            # Node config — Jest + ESLint dev deps, "test" and "lint" scripts
├── eslint.config.js        # ESLint flat config with recommended rules
├── vercel.json             # Vercel rewrite rules for API proxy routes
├── .env.example            # Environment variable reference (no real keys)
├── .gitignore              # Excludes config.local.js, node_modules, coverage/
├── LICENSE                 # MIT License
│
├── api/                    # Vercel serverless API routes (API key proxy)
│   ├── chat.js             # Proxies chat requests to Gemini API (server-side key)
│   └── quiz.js             # Proxies quiz requests to Gemini API (server-side key)
│
├── js/
│   ├── config.example.js   # API key template — commit this, NOT config.local.js
│   ├── config.local.js     # ⚠️ gitignored — add your real keys here
│   ├── init.js             # Detects missing keys, shows setup banner
│   ├── chat.js             # Gemini chat: history, isLoading guard, JSDoc, GA4 events
│   ├── quiz.js             # Quiz generation, JSON parsing, Firebase leaderboard, GA4 events
│   ├── eligibility.js      # Voter eligibility rule engine (pure function, fully testable)
│   ├── timeline.js         # Accordion interactions
│   ├── translate.js        # Google Translate widget init + GA4 language tracking
│   └── maps.js             # Maps JS API: dynamic load, Geocoder, Marker, InfoWindow
│
├── tests/
│   ├── setup.js            # Jest setup — mocks fetch, DOM, window.APP_CONFIG, gtag, firebase
│   └── test.spec.js        # 40 Jest tests: unit, integration, edge cases, DOM assertions
│
└── coverage/               # Auto-generated by jest --coverage (gitignored)
```

---

## 🚀 Getting Started

### Prerequisites

- Modern browser (Chrome, Firefox, Edge, Safari)
- Node.js v16+ (for tests and local server)
- [Gemini API Key](https://aistudio.google.com/) — free tier available
- [Google Maps API Key](https://console.cloud.google.com/) — enable **Maps JavaScript API** and **Geocoding API**
- [Firebase Project](https://console.firebase.google.com/) — free Spark plan, enable **Firestore Database**
- [GA4 Measurement ID](https://analytics.google.com/) — create a new Web stream

---

### 1. Clone the Repository

```bash
git clone https://github.com/IamMradul/VoteWise.git
cd VoteWise
```

---

### 2. Install Dependencies

```bash
npm install
```

---

### 3. Configure API Keys (Local Development)

```bash
cp js/config.example.js js/config.local.js
```

Open `js/config.local.js` and fill in your credentials:

```javascript
window.APP_CONFIG = {
    GEMINI_API_KEY:       "your-gemini-api-key-here",
    GOOGLE_MAPS_API_KEY:  "your-maps-api-key-here"
};
```

For **Firebase** and **GA4**, update `index.html`:

```html
<!-- Google Analytics 4 -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
    gtag('config', 'G-XXXXXXXXXX'); // ← replace with your Measurement ID
</script>

<!-- Firebase Compat SDK -->
<script>
    const firebaseConfig = {
        apiKey:            "your-firebase-api-key",
        authDomain:        "your-project.firebaseapp.com",
        projectId:         "your-project-id",
        storageBucket:     "your-project.appspot.com",
        messagingSenderId: "your-sender-id",
        appId:             "your-app-id"
    };
    firebase.initializeApp(firebaseConfig);
    window.db = firebase.firestore();
</script>
```

> ⚠️ `config.local.js` is listed in `.gitignore` — your keys will **never** be committed to GitHub.

---

### 4. Serve Locally

Service Workers require an HTTP context (`file://` will not work):

```bash
npx serve .
# → Open http://localhost:3000
```

Or use the Vercel CLI to emulate production including `/api/` serverless routes:

```bash
npm install -g vercel
vercel dev
```

---

## ☁️ Deploying to Vercel

VoteWise uses Vercel **serverless API routes** to proxy Gemini calls server-side — so your API keys are **never exposed in the browser**.

### Step 1 — Push to GitHub

```bash
git add .
git commit -m "ready for deployment"
git push origin main
```

### Step 2 — Import on Vercel

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your `VoteWise` GitHub repository
3. Leave all build settings as default → click **Deploy**

### Step 3 — Add Environment Variables

In your Vercel project: **Settings → Environment Variables**

| Variable Name | Value | Environment |
|---|---|---|
| `GEMINI_API_KEY` | your Gemini key | Production, Preview, Development |
| `GOOGLE_MAPS_API_KEY` | your Maps key | Production, Preview, Development |

> Firebase and GA4 are configured directly in `index.html` — no Vercel env vars needed for those.

### Step 4 — Redeploy

Go to **Deployments** → click **Redeploy** to apply the environment variables.

---

## 🧪 Running Tests

VoteWise uses **Jest** with `jest-environment-jsdom` for a full DOM simulation environment.

```bash
npm test
```

To run with coverage report:

```bash
npm test -- --coverage
```

### Test Suite — 40 Tests, All Passing

```
PASS  tests/test.spec.js
  VoteWise Application Tests
    ✓ Eligibility: under 18 should fail
    ✓ Eligibility: exactly 18 should pass
    ✓ Eligibility: non-citizen should fail
    ✓ Eligibility: valid inputs should pass
    ✓ Eligibility: age 0 should fail
    ✓ Eligibility: non-citizen non-resident should fail
    ✓ Eligibility: elderly citizen should pass
    ✓ Eligibility: negative age should fail
    ✓ Eligibility: non-resident should fail
    ✓ Eligibility: decimal age below 18 should fail
    ✓ Quiz: correct answer evaluation
    ✓ Quiz: wrong answer evaluation
    ✓ parseQuizJSON: valid Gemini JSON response
    ✓ parseQuizJSON: throws on empty response
    ✓ parseQuizJSON: throws on malformed JSON
    ✓ parseQuizJSON: throws on empty array
    ✓ fetchQuizQuestions: throws if API key missing
    ✓ fetchQuizQuestions: throws on network error
    ✓ fetchQuizQuestions: throws on non-ok response
    ✓ fetchQuizQuestions: fetches and parses successfully
    ✓ parseGeminiResponse: extracts text correctly
    ✓ parseGeminiResponse: returns fallback on empty object
    ✓ parseGeminiResponse: returns fallback on null input
    ✓ queryGeminiAPI: throws if API key missing
    ✓ queryGeminiAPI: throws on network error
    ✓ queryGeminiAPI: throws on non-ok API response
    ✓ queryGeminiAPI: resolves with correct response
    ✓ LanguageMapping: contains Hindi → hi
    ✓ LanguageMapping: contains Tamil → ta
    ✓ LanguageMapping: contains Bengali → bn
    ✓ LanguageMapping: contains Telugu → te
    ✓ LanguageMapping: contains 8 languages total
    ✓ Integration: quiz renders question from API
    ✓ Integration: wrong answer shows Incorrect message
    ✓ Integration: leaderboard shows unavailable when no Firebase
    ✓ Integration: Firebase error shows graceful message
    ✓ Integration: eligibility form valid submit shows eligible
    ✓ Integration: eligibility form invalid age shows validation error
    ✓ Integration: eligibility form missing answers shows error
    ✓ Integration: eligibility form under 18 shows not eligible

Test Suites: 1 passed, 1 total
Tests:       40 passed, 40 total
Coverage:    Statements 91% | Branches 72% | Functions 92% | Lines 91%
```

### Coverage Thresholds (enforced in `package.json`)

| Metric | Threshold | Actual |
|---|---|---|
| Statements | 90% | 91% ✅ |
| Functions | 90% | 92% ✅ |
| Lines | 90% | 91% ✅ |
| Branches | 70% | 72% ✅ |

---

## 🔍 Code Quality & Linting

VoteWise enforces consistent code style across all JavaScript files using **ESLint**.

```bash
# Run linter
npx eslint .
```

### ESLint Rules (`eslint.config.js`)

| Rule | Level | Purpose |
|---|---|---|
| `no-unused-vars` | warn | Catches dead code |
| `no-undef` | error | Prevents reference errors |
| `prefer-const` | warn | Encourages immutability |
| `eqeqeq` | warn | Prevents type coercion bugs |

### Code Quality Standards Applied

- **JSDoc comments** on every function — `@param`, `@returns`, `@throws` where applicable
- **Named constants** — all magic strings and numbers extracted into `CONSTANTS` / `CHAT_CONSTANTS` objects at the top of each file
- **Single-responsibility functions** — no function exceeds 30 lines
- **`try/catch/finally`** — every async API call is wrapped with user-visible error messages
- **`finally` blocks** — always restore UI state (re-enable inputs, reset loading flags) even on failure

---

## ♿ Accessibility

VoteWise targets **WCAG 2.1 AA compliance** with inclusive design as a first-class concern:

- All interactive elements carry descriptive `aria-label` attributes
- Timeline accordion uses `aria-expanded` + `aria-controls` with correct `hidden` state toggling
- **Chat messages**, **quiz content**, and **eligibility results** all use `aria-live="polite"` for screen reader announcements
- Setup banner uses `aria-live="assertive"` for critical configuration warnings
- Chat toggle button dynamically updates `aria-expanded` and `aria-label` on open/close
- Full keyboard navigation on all accordion buttons (`Enter` / `Space`)
- Focus indicators: 3px solid outline meeting WCAG contrast requirements
- Color is **never** the sole means of conveying information (icons and text always accompany color)
- `<noscript>` fallback message for non-JavaScript environments
- Google Translate supports **8 Indian regional languages** for non-English speakers
- Google Fonts **Noto Sans** ensures correct rendering for all regional scripts

---

## 🔒 Security

| Concern | Mitigation |
|---|---|
| **API key exposure** | On Vercel: keys live only in environment variables, accessed via serverless `/api/` proxy routes — never sent to the browser |
| **Local development** | Keys in `config.local.js`, which is `.gitignore`d and never committed |
| **Content Security Policy** | CSP meta tag covers `script-src`, `connect-src`, and `frame-src` — restricts resource loading to trusted domains only |
| **User input** | Chat capped at 500 characters client-side; Maps search processed by Geocoder API (no raw URL construction) |
| **Duplicate submissions** | `isLoading` boolean flag blocks concurrent API requests |
| **Response size** | `maxOutputTokens: 250` limits Gemini output, reducing API abuse surface |
| **External links** | All use `rel="noopener noreferrer"` to prevent tab-napping |
| **No data persistence** | Zero use of `localStorage`, `sessionStorage`, or cookies for user data |
| **Firebase Leaderboard** | Scores stored anonymously — no PII collected |

---

## 📌 Assumptions

1. **Target audience** is Indian citizens or residents interested in General Elections (Lok Sabha / Vidhan Sabha).
2. **Internet connectivity** is required for AI Chat, Quiz, Maps, Firebase, and GA4. Timeline and Eligibility work offline via Service Worker cache.
3. **On Vercel**, API keys are injected as environment variables — the serverless proxy handles all Gemini calls server-side, keeping keys off the client entirely.
4. **Locally**, the user supplies their own keys in `config.local.js` following the setup guide above. Firebase config is added directly in `index.html`.
5. **Gemini output** occasionally wraps JSON in markdown code fences — a sanitization step strips these before `JSON.parse()`.
6. The app targets **modern evergreen browsers** that support ES6+, Service Workers, and the Fetch API.
7. The Google Calendar link uses a placeholder election date — update it to the actual ECI-announced date when available.
8. **Firebase Leaderboard** requires Firestore to be enabled on the free Spark plan — no billing required.

---

## 📄 License

Distributed under the MIT License. See [`LICENSE`](./LICENSE) for details.

---

<div align="center">

**Built with ❤️ for democratic empowerment**

*Empowering every Indian voter — one conversation at a time.*

<br>

[![Gemini](https://img.shields.io/badge/Powered%20by-Gemini%20AI-4285F4?style=flat-square&logo=google&logoColor=white)](https://aistudio.google.com/)
[![Firebase](https://img.shields.io/badge/Powered%20by-Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black)](https://firebase.google.com/)
[![Google Maps](https://img.shields.io/badge/Powered%20by-Google%20Maps-34A853?style=flat-square&logo=googlemaps&logoColor=white)](https://developers.google.com/maps)
[![Google Translate](https://img.shields.io/badge/Powered%20by-Google%20Translate-4285F4?style=flat-square&logo=googletranslate&logoColor=white)](https://translate.google.com/)
[![Google Fonts](https://img.shields.io/badge/Powered%20by-Google%20Fonts-4285F4?style=flat-square&logo=google&logoColor=white)](https://fonts.google.com/)
[![Google Calendar](https://img.shields.io/badge/Powered%20by-Google%20Calendar-1A73E8?style=flat-square&logo=googlecalendar&logoColor=white)](https://calendar.google.com/)
[![Google Analytics](https://img.shields.io/badge/Powered%20by-GA4-E37400?style=flat-square&logo=googleanalytics&logoColor=white)](https://analytics.google.com/)

<br>

<sub>© 2025 VoteWise · Made in India 🇮🇳</sub>

</div>