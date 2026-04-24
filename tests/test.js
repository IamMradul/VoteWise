const assert = require('assert');
const { evaluateEligibility } = require('../js/eligibility.js');
const { evaluateQuizAnswer } = require('../js/quiz.js');
const { parseGeminiResponse } = require('../js/chat.js');
const { LanguageMapping } = require('../js/translate.js');

let passCount = 0;
let failCount = 0;

function assertEqual(actual, expected, testName) {
    if (actual === expected) {
        console.log(`\x1b[32m✅ PASS: ${testName}\x1b[0m`);
        passCount++;
    } else {
        console.error(`\x1b[31m❌ FAIL: ${testName} | Expected '${expected}', got '${actual}'\x1b[0m`);
        failCount++;
    }
}

console.log("--- Running VoteWise Tests ---");

// 1. Eligibility Checker
assertEqual(evaluateEligibility(17, true, true), false, "Eligibility: under 18 (fail)");
assertEqual(evaluateEligibility(18, true, true), true, "Eligibility: exactly 18 (pass)");
assertEqual(evaluateEligibility(25, false, true), false, "Eligibility: non-citizen (fail)");
assertEqual(evaluateEligibility(25, true, true), true, "Eligibility: valid inputs (pass)");

// 2. Quiz Scoring Function
assertEqual(evaluateQuizAnswer(2, 2), true, "Quiz: correct answers increment score");
assertEqual(evaluateQuizAnswer(1, 2), false, "Quiz: wrong answers do not increment");

// 3. Language Code Mapping
assertEqual(LanguageMapping['Hindi'], 'hi', "Language Mapping: Hindi -> hi");
assertEqual(LanguageMapping['Tamil'], 'ta', "Language Mapping: Tamil -> ta");
assertEqual(LanguageMapping['Bengali'], 'bn', "Language Mapping: Bengali -> bn");
assertEqual(LanguageMapping['Telugu'], 'te', "Language Mapping: Telugu -> te");

// 4. Gemini Response Parser
const mockGeminiResponse = {
    candidates: [
        {
            content: {
                parts: [{ text: "This is a mock response about EVMs." }]
            }
        }
    ]
};
assertEqual(parseGeminiResponse(mockGeminiResponse), "This is a mock response about EVMs.", "Gemini Parser: Extracts text correctly");
assertEqual(parseGeminiResponse({}), "No response retrieved.", "Gemini Parser: Handles empty/invalid object");

// Eligibility edge cases
assertEqual(evaluateEligibility(0, true, true), false, "Eligibility: age 0 (fail)");
assertEqual(evaluateEligibility(18, false, false), false, "Eligibility: non-citizen non-resident (fail)");
assertEqual(evaluateEligibility(100, true, true), true, "Eligibility: elderly citizen (pass)");

// Quiz edge cases
assertEqual(evaluateQuizAnswer(0, 0), true, "Quiz: first option correct");
assertEqual(evaluateQuizAnswer(3, 0), false, "Quiz: last option vs first correct");
assertEqual(evaluateQuizAnswer(0, 3), false, "Quiz: first option vs last correct");

// Language Mapping completeness
assertEqual(LanguageMapping['Marathi'], 'mr', "Language Mapping: Marathi -> mr");
assertEqual(LanguageMapping['Gujarati'], 'gu', "Language Mapping: Gujarati -> gu");
assertEqual(LanguageMapping['Kannada'], 'kn', "Language Mapping: Kannada -> kn");
assertEqual(LanguageMapping['Malayalam'], 'ml', "Language Mapping: Malayalam -> ml");

// Gemini Parser edge cases
assertEqual(parseGeminiResponse({ candidates: [] }), "No response retrieved.", "Gemini Parser: Empty candidates array");
assertEqual(parseGeminiResponse(null), "No response retrieved.", "Gemini Parser: Null input");

// ── Maps Input Sanitization ──────────────────────────────
function sanitizeMapInput(input) {
    if (!input || typeof input !== 'string') return '';
    return input.trim().replace(/<[^>]*>?/gm, '').replace(/[<>'"]/g, '');
}
assertEqual(sanitizeMapInput('New Delhi'), 'New Delhi', "Maps: valid city input");
assertEqual(sanitizeMapInput('  Mumbai  '), 'Mumbai', "Maps: trims whitespace");
assertEqual(sanitizeMapInput('<script>'), '', "Maps: strips HTML tags");
assertEqual(sanitizeMapInput(''), '', "Maps: empty string");
assertEqual(sanitizeMapInput(null), '', "Maps: null input");
assertEqual(sanitizeMapInput(110001), '', "Maps: non-string input");

// ── Init / Config Detection ──────────────────────────────
function isApiKeyConfigured(config) {
    return !!(config && config.GEMINI_API_KEY && config.GEMINI_API_KEY !== 'YOUR_KEY_HERE');
}
assertEqual(isApiKeyConfigured({ GEMINI_API_KEY: 'abc123' }), true, "Init: valid key detected");
assertEqual(isApiKeyConfigured({ GEMINI_API_KEY: 'YOUR_KEY_HERE' }), false, "Init: placeholder detected");
assertEqual(isApiKeyConfigured({}), false, "Init: missing key");
assertEqual(isApiKeyConfigured(null), false, "Init: null config");

// ── Eligibility Boundary Values ──────────────────────────
assertEqual(evaluateEligibility(17.9, true, true), false, "Eligibility: 17.9 (fail)");
assertEqual(evaluateEligibility(-1, true, true), false, "Eligibility: negative age (fail)");
assertEqual(evaluateEligibility(18, true, false), false, "Eligibility: not resident (fail)");

// ── Quiz Score Calculation ───────────────────────────────
function calculateScore(correct, total) {
    if (total === 0) return 0;
    return Math.round((correct / total) * 100);
}
assertEqual(calculateScore(10, 10), 100, "Score: perfect score");
assertEqual(calculateScore(0, 10), 0, "Score: zero score");
assertEqual(calculateScore(7, 10), 70, "Score: 70 percent");
assertEqual(calculateScore(0, 0), 0, "Score: division by zero safe");

// ── Gemini Response Edge Cases ───────────────────────────
assertEqual(parseGeminiResponse({ candidates: [{ content: { parts: [{ text: '' }] } }] }), '', "Gemini Parser: empty string response");
assertEqual(parseGeminiResponse({ candidates: [{ content: { parts: [{ text: '  ' }] } }] }), '  ', "Gemini Parser: whitespace response");
assertEqual(parseGeminiResponse(undefined), 'No response retrieved.', "Gemini Parser: undefined input");

console.log(`\nTest Summary: ${passCount} Passed, ${failCount} Failed.`);
if (failCount > 0) process.exit(1);
