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

console.log(`\nTest Summary: ${passCount} Passed, ${failCount} Failed.`);
if (failCount > 0) process.exit(1);
