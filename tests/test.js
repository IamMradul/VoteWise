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

console.log(`\nTest Summary: ${passCount} Passed, ${failCount} Failed.`);
if (failCount > 0) process.exit(1);
