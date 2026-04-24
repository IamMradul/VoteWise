# 🗳️ VoteWise — Election Process Education Assistant

> A smart, dynamic, single-page web application empowering Indian citizens to understand the democratic election process through AI-driven conversations, interactive tools, and real-time Google service integrations.

<div align="center">

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Gemini API](https://img.shields.io/badge/Gemini%20API-4285F4?style=flat&logo=google&logoColor=white)
![Google Maps](https://img.shields.io/badge/Google%20Maps-34A853?style=flat&logo=googlemaps&logoColor=white)
![PWA](https://img.shields.io/badge/PWA-Enabled-5A0FC8?style=flat&logo=pwa&logoColor=white)
![Tests](https://img.shields.io/badge/Tests-40%20Passing-brightgreen?style=flat)
![License](https://img.shields.io/badge/License-MIT-green?style=flat)

**[Live Demo](https://votewise.vercel.app)** · **[Report Bug](https://github.com/IamMradul/VoteWise/issues)** · **[Request Feature](https://github.com/IamMradul/VoteWise/issues)**

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Chosen Vertical](#-chosen-vertical)
- [Features](#-features)
- [Google Services Used](#-google-services-used)
- [How It Works](#-how-it-works)
- [Decision-Making Logic](#-decision-making-logic)
- [File Structure](#-file-structure)
- [Getting Started](#-getting-started)
- [Deploying to Vercel](#-deploying-to-vercel)
- [Running Tests](#-running-tests)
- [Accessibility](#-accessibility)
- [Security](#-security)
- [Assumptions](#-assumptions)

---

## 🌟 Overview

VoteWise is an AI-powered civic education tool for Indian citizens. It removes confusion around India's multi-phase general election process by combining a **context-aware Gemini AI chat assistant** with interactive educational modules — all in a single, lightweight, offline-capable Progressive Web App.

Designed for first-time voters, students, and anyone curious about democracy — with support for **8 Indian regional languages** via Google Translate, a **dynamic AI-generated quiz**, a **live polling booth finder**, and a **Google Calendar reminder** so no one misses election day.

---

## 🎯 Chosen Vertical

**Election Process Education**

India conducts the world's largest democratic elections, yet millions of eligible voters are uncertain about how to register, what the Election Commission of India (ECI) does, how EVMs work, or what NOTA means. VoteWise bridges this knowledge gap through an intelligent, guided experience — available in multiple languages, installable as a PWA, and usable partially offline.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Chat Assistant** | Gemini-powered assistant with multi-turn memory, topic gating, and regional context awareness |
| 📅 **Election Timeline** | Interactive accordion covering all 6 phases of the election lifecycle |
| ✅ **Voter Eligibility Checker** | Instant rule-based tool with specific failure explanations |
| 🧠 **Dynamic Quiz** | Gemini-generated 10-question MCQ quiz with scoring and per-question explanations |
| 🗺️ **Polling Booth Finder** | Google Maps Embed to locate polling stations by city or PIN code |
| 🌐 **Multi-language Support** | Google Translate Widget for 8 Indian regional languages |
| 📆 **Election Day Reminder** | Google Calendar integration — add election day with one click |
| 📝 **Citizen Feedback** | Google Forms integration for user feedback collection |
| 📶 **Offline Support** | Service Worker + PWA manifest — Timeline and Eligibility work without internet |
| ⚠️ **Setup Banner** | Detects missing API keys and guides user to configure them |

---

## 🔧 Google Services Used

### 1. 🤖 Gemini API — `gemini-1.5-flash`
The core AI intelligence, used in two distinct flows:
- **Chat Assistant** — System-prompted agent restricted to Indian election topics. Uses `temperature: 0.3` for factual precision, maintains a rolling 10-exchange conversation history for context, and enforces a 500-character input limit.
- **Quiz Generator** — Dynamically generates a fresh 10-question MCQ set on every attempt. JSON output is enforced via prompt engineering and sanitized client-side before parsing.

### 2. 🗺️ Google Maps Embed API
Renders an interactive embedded map for polling booth discovery by city name or PIN code. Input is sanitized with `encodeURIComponent` before building the URL. No additional SDK required — keeps the bundle lightweight.

### 3. 🌐 Google Translate Widget
Injects a language selector into the navigation bar, enabling full UI translation into 8 Indian regional languages: Hindi, Tamil, Bengali, Telugu, Marathi, Gujarati, Kannada, and Malayalam.

### 4. 🔤 Google Fonts — Noto Sans
Selected for its broad Unicode coverage, ensuring translated regional language text renders correctly without font-fallback failures across all 8 supported languages.

### 5. 📆 Google Calendar
A one-click "Add to Google Calendar" button in the Timeline section lets users save Indian Election Day directly to their Google Calendar — with a pre-filled event title, description, and date/time. No OAuth required.

### 6. 📝 Google Forms
A citizen feedback section links to a Google Form, allowing users to share suggestions and report issues — closing the feedback loop for continuous improvement.

---

## ⚙️ How It Works

VoteWise is a **zero-build, vanilla JavaScript SPA** — no bundlers, no frameworks — making it universally deployable on any static host.

```
User lands on page
      │
      ├─► Setup Banner (js/init.js)   → Detects missing API keys, shows warning
      │
      ├─► Timeline Section            → Static accordion + Google Calendar CTA
      │
      ├─► Eligibility Checker         → Rule-based: age ≥ 18 + citizen + resident
      │
      ├─► Quiz Section                → Gemini API → JSON parse → MCQ UI render
      │
      ├─► Polling Booth Finder        → Google Maps Embed iframe on search
      │
      ├─► Feedback Section            → Google Forms link
      │
      └─► AI Chat Widget              → Gemini API with system prompt + history
```

**API Key Handling** uses a two-file pattern: `config.example.js` (committed, no keys) and `config.local.js` (gitignored, real keys). On Vercel, keys live as environment variables and are accessed via serverless API routes in `/api/` — never exposed to the browser.

**Offline Capability** is provided by a Service Worker (`sw.js`) that caches all static assets on first load. Timeline and Eligibility work fully offline. AI features degrade gracefully with a clear error message.

---

## 🧠 Decision-Making Logic

### Chat Assistant
The Gemini system prompt enforces three rules on every turn:
1. **Topic gating** — Queries unrelated to Indian elections are declined and redirected.
2. **Regional awareness** — If a state or region is mentioned (e.g., "I live in Kerala"), the assistant provides region-relevant electoral context.
3. **Factual precision** — `temperature: 0.3` and `maxOutputTokens: 250` prioritize accuracy over verbosity.

Multi-turn memory is maintained via a `conversationHistory` array (capped at 20 entries / 10 exchanges) passed as the `contents` field on each Gemini request.

### Eligibility Checker
Pure deterministic logic: `age >= 18 AND isCitizen === true AND isResident === true`. When ineligible, the specific failing condition(s) are listed so users know exactly what to address.

### Quiz Generator
Gemini is prompted to return **only** a valid JSON array with schema: `{ question, options[], correctIndex, explanation }`. The parser strips markdown code fences before `JSON.parse()`. An error boundary catches malformed output and shows a retry message instead of crashing.

---

## 📁 File Structure

```
VoteWise/
├── index.html              # SPA layout — semantic HTML, ARIA labels, meta tags
├── style.css               # Indian tricolor design system, responsive layout
├── sw.js                   # Service Worker for offline caching
├── manifest.json           # PWA manifest for installability
├── vercel.json             # Vercel rewrite rules for API proxy routes
├── .env.example            # Environment variable reference (no real keys)
├── .gitignore              # Excludes config.local.js and sensitive files
├── LICENSE                 # MIT License
│
├── api/                    # Vercel serverless API routes (key proxy)
│   ├── chat.js             # Proxies chat requests to Gemini API
│   └── quiz.js             # Proxies quiz requests to Gemini API
│
├── js/
│   ├── config.example.js   # API key template — commit this, not real keys
│   ├── init.js             # Detects missing keys, shows setup banner
│   ├── chat.js             # Gemini chat logic, history, isLoading guard
│   ├── quiz.js             # Quiz generation, JSON parsing, error boundary
│   ├── eligibility.js      # Voter eligibility rule engine
│   ├── timeline.js         # Accordion interactions
│   ├── translate.js        # Google Translate widget init + language mapping
│   └── maps.js             # Google Maps Embed integration
│
└── tests/
    └── test.js             # 40 Node.js assertion tests — no framework needed
```

---

## 🚀 Getting Started

### Prerequisites
- A modern web browser (Chrome, Firefox, Edge, Safari)
- Node.js v16+ (for tests and local server)
- A [Gemini API Key](https://aistudio.google.com/) — free
- A [Google Maps API Key](https://console.cloud.google.com/) with **Maps Embed API** enabled

### 1. Clone the Repository
```bash
git clone https://github.com/IamMradul/VoteWise.git
cd VoteWise
```

### 2. Configure API Keys (Local Development)
```bash
cp js/config.example.js js/config.local.js
```
Open `js/config.local.js` and fill in your keys:
```javascript
window.APP_CONFIG = {
    GEMINI_API_KEY: "your-gemini-key-here",
    GOOGLE_MAPS_API_KEY: "your-maps-key-here"
};
```
> ⚠️ `config.local.js` is in `.gitignore` — your keys will never be committed to GitHub.

### 3. Serve Locally
Service Workers require an HTTP context (not `file://`):
```bash
npx serve .
# Open http://localhost:3000
```
Or use the Vercel CLI to emulate production (including `/api/` routes):
```bash
npm install -g vercel
vercel dev
```

---

## ☁️ Deploying to Vercel

VoteWise uses Vercel **serverless API routes** to proxy Gemini API calls — keeping your API keys 100% server-side and never exposed in the browser.

### 1. Push to GitHub
```bash
git add .
git commit -m "ready for deployment"
git push origin main
```

### 2. Import on Vercel
1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your `VoteWise` GitHub repository
3. Leave all build settings as default → click **Deploy**

### 3. Add Environment Variables
In your Vercel project: **Settings → Environment Variables**

| Name | Value | Environment |
|---|---|---|
| `GEMINI_API_KEY` | your Gemini key | Production, Preview, Development |
| `GOOGLE_MAPS_API_KEY` | your Maps key | Production, Preview, Development |

### 4. Redeploy
Go to **Deployments** → click **Redeploy** to apply the environment variables.

---

## 🧪 Running Tests

Tests use Node.js built-in `assert` — no `npm install` needed.

```bash
node tests/test.js
```

**40 tests across 7 categories — all passing:**

```
--- Running VoteWise Tests ---

✅ Eligibility: under 18 (fail)           ✅ Eligibility: exactly 18 (pass)
✅ Eligibility: non-citizen (fail)         ✅ Eligibility: valid inputs (pass)
✅ Eligibility: age 0 (fail)              ✅ Eligibility: non-citizen non-resident (fail)
✅ Eligibility: elderly citizen (pass)    ✅ Eligibility: 17.9 (fail)
✅ Eligibility: negative age (fail)       ✅ Eligibility: not resident (fail)

✅ Quiz: correct answer                   ✅ Quiz: wrong answer
✅ Quiz: first option correct             ✅ Quiz: last vs first correct
✅ Quiz: first vs last correct            ✅ Score: perfect (100%)
✅ Score: zero (0%)                       ✅ Score: 70%
✅ Score: division by zero safe

✅ Language: Hindi → hi                   ✅ Language: Tamil → ta
✅ Language: Bengali → bn                 ✅ Language: Telugu → te
✅ Language: Marathi → mr                 ✅ Language: Gujarati → gu
✅ Language: Kannada → kn                 ✅ Language: Malayalam → ml

✅ Gemini Parser: extracts text           ✅ Gemini Parser: empty object
✅ Gemini Parser: empty candidates        ✅ Gemini Parser: null input
✅ Gemini Parser: undefined input         ✅ Gemini Parser: empty string response
✅ Gemini Parser: whitespace response

✅ Maps: valid city input                 ✅ Maps: trims whitespace
✅ Maps: strips HTML tags                 ✅ Maps: empty string
✅ Maps: null input                       ✅ Maps: non-string input

✅ Init: valid key detected               ✅ Init: placeholder detected
✅ Init: missing key                      ✅ Init: null config

Test Summary: 40 Passed, 0 Failed.
```

---

## ♿ Accessibility

VoteWise targets WCAG 2.1 AA compliance with inclusive design as a first-class concern:

- All interactive elements carry descriptive `aria-label` attributes
- Accordion timeline uses `aria-expanded` + `aria-controls` with correct `hidden` state toggling
- Chat messages and eligibility results use `aria-live="polite"` for screen reader announcements
- Chat toggle button dynamically updates `aria-expanded` and `aria-label` on open/close
- Full keyboard navigation on all accordion buttons (`Enter` / `Space`)
- Focus indicators: 3px solid green outline meeting WCAG contrast requirements
- Color is never the sole means of conveying information
- `<noscript>` fallback message for non-JavaScript environments
- Google Translate supports 8 Indian regional languages for non-English speakers
- Google Fonts Noto Sans ensures correct rendering for all regional scripts

---

## 🔒 Security

- **API keys are never in the browser** — on Vercel, all Gemini calls are proxied through `/api/chat` and `/api/quiz` serverless routes; keys live only in Vercel environment variables
- **Locally**, keys live in `config.local.js` which is `.gitignore`d and never committed
- **User input** in Maps search is sanitized with `encodeURIComponent` before URL construction
- **Chat input** is capped at 500 characters client-side to prevent prompt injection
- **Duplicate submissions** are blocked by an `isLoading` boolean flag
- **`maxOutputTokens: 250`** limits Gemini response size, reducing API abuse surface
- **All external links** use `rel="noopener noreferrer"` to prevent tab-napping
- **No user data** is stored in `localStorage`, `sessionStorage`, or cookies

---

## 📌 Assumptions

1. **Target audience** is Indian citizens or residents interested in General Elections (Lok Sabha / Vidhan Sabha).
2. **Internet connectivity** is required for AI Chat, Quiz, and Maps. Timeline and Eligibility work offline via Service Worker cache.
3. **On Vercel**, API keys are injected as environment variables — the serverless proxy handles all Gemini calls server-side.
4. **Locally**, the user supplies their own keys in `config.local.js` following the setup guide above.
5. **Gemini output** occasionally wraps JSON in markdown fences — a sanitization step handles this before `JSON.parse()`.
6. The app targets modern evergreen browsers that support ES6+, Service Workers, and the Fetch API.
7. The Google Calendar link uses a placeholder election date — update it to the actual ECI-announced date when available.

---


<div align="center">
  <strong>Built with ❤️ for democratic empowerment</strong><br><br>
  <sub>
    Powered by
    <a href="https://aistudio.google.com/">Google Gemini</a> ·
    <a href="https://developers.google.com/maps">Google Maps</a> ·
    <a href="https://translate.google.com/">Google Translate</a> ·
    <a href="https://fonts.google.com/">Google Fonts</a> ·
    <a href="https://calendar.google.com/">Google Calendar</a> ·
    <a href="https://forms.google.com/">Google Forms</a>
  </sub>
</div>