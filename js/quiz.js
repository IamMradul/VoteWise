/**
 * @fileoverview Logic for the VoteWise Election Quiz.
 * Generates questions using Gemini API, handles scoring, Leaderboard via Firebase,
 * and tracks events with Google Analytics 4.
 */

const CONSTANTS = {
    PROMPT: `Generate exactly 10 multiple-choice questions about the Indian election process (history, EVMs, rules, ECI, eligibility). Return ONLY a valid JSON array of objects. Do NOT wrap in markdown blocks like \`\`\`json.
Each object must match this schema:
{
  "question": "The question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": <integer 0-3>,
  "explanation": "A short, 1-sentence explanation of the correct answer."
}`,
    API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=',
    MAX_QUESTIONS: 10
};

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        const startQuizBtn = document.getElementById('start-quiz');
        const quizContent = document.getElementById('quiz-content');

        let currentQuestions = [];
        let currentIndex = 0;
        let score = 0;

        if (!startQuizBtn || !quizContent) return;

        startQuizBtn.addEventListener('click', async () => {
            await handleQuizStart(startQuizBtn, quizContent);
        });

        /**
         * Orchestrates the start of the quiz.
         * @param {HTMLElement} btn - The start button element
         * @param {HTMLElement} content - The quiz content container
         */
        async function handleQuizStart(btn, content) {
            btn.textContent = 'Generating questions... please wait.';
            btn.disabled = true;

            // GA4 Event
            if (typeof gtag === 'function') {
                gtag('event', 'quiz_start', { event_category: 'engagement' });
            }

            try {
                currentQuestions = await fetchQuizQuestions();
                if (!currentQuestions || currentQuestions.length === 0) {
                    throw new Error("No questions retrieved.");
                }
                currentIndex = 0;
                score = 0;
                content.hidden = false;
                btn.hidden = true;
                renderQuestion();
            } catch (error) {
                console.error('Quiz Generation Error:', error);
                showQuizError(btn, content, 'Failed to generate quiz. Please check API Key or network.');
            }
        }

        /**
         * Displays an error message to the user.
         * @param {HTMLElement} btn - The start button element
         * @param {HTMLElement} content - The quiz content container
         * @param {string} msg - The error message
         */
        function showQuizError(btn, content, msg) {
            content.innerHTML = `<p style="color:#D32F2F;">⚠️ ${msg}</p>`;
            content.hidden = false;
            btn.textContent = 'Retry Quiz Generation';
            btn.disabled = false;
        }

        /**
         * Renders the current question onto the DOM.
         */
        function renderQuestion() {
            if (currentIndex >= currentQuestions.length) {
                renderSummary();
                return;
            }

            const q = currentQuestions[currentIndex];
            quizContent.innerHTML = buildQuestionHTML(q, currentIndex, currentQuestions.length);

            attachQuestionListeners(q);
        }

        /**
         * Builds the HTML for a single question.
         * @param {Object} q - The question object
         * @param {number} index - Current question index
         * @param {number} total - Total questions count
         * @returns {string} The HTML string
         */
        function buildQuestionHTML(q, index, total) {
            let html = `
                <h3>Question ${index + 1} of ${total}</h3>
                <p style="font-size: 1.1rem; font-weight: bold;">${q.question}</p>
                <div id="options-container" style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom: 1rem;">
            `;

            q.options.forEach((opt, idx) => {
                html += `<button class="quiz-option" data-idx="${idx}">${opt}</button>`;
            });

            html += `</div>
                     <div id="explanation-box" hidden style="background: var(--color-bg-light); padding: 1rem; border-left: 4px solid var(--color-saffron); margin-bottom:1rem;"></div>
                     <button id="next-btn" hidden>Next Question</button>`;
            return html;
        }

        /**
         * Attaches event listeners to the generated question options.
         * @param {Object} q - The question object
         */
        function attachQuestionListeners(q) {
            const optionBtns = document.querySelectorAll('.quiz-option');
            const nextBtn = document.getElementById('next-btn');
            const expBox = document.getElementById('explanation-box');

            optionBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    handleOptionClick(e, q, optionBtns, expBox, nextBtn);
                });
            });

            nextBtn.addEventListener('click', () => {
                currentIndex++;
                renderQuestion();
            });
        }

        /**
         * Handles the click event on a quiz option.
         * @param {Event} e - The click event
         * @param {Object} q - The question object
         * @param {NodeList} optionBtns - List of option buttons
         * @param {HTMLElement} expBox - The explanation container
         * @param {HTMLElement} nextBtn - The next question button
         */
        function handleOptionClick(e, q, optionBtns, expBox, nextBtn) {
            optionBtns.forEach(b => b.disabled = true);
            const selectedIdx = parseInt(e.target.getAttribute('data-idx'), 10);
            
            const isCorrect = evaluateQuizAnswer(selectedIdx, q.correctIndex);
            if (isCorrect) {
                score++;
                e.target.style.backgroundColor = 'var(--color-green)';
                e.target.style.color = 'var(--color-white)';
            } else {
                e.target.style.backgroundColor = '#D32F2F';
                e.target.style.color = 'white';
                optionBtns[q.correctIndex].style.backgroundColor = 'var(--color-green)';
                optionBtns[q.correctIndex].style.color = 'var(--color-white)';
            }

            expBox.innerHTML = `<strong>${isCorrect ? 'Correct!' : 'Incorrect.'}</strong> ${q.explanation}`;
            expBox.hidden = false;
            nextBtn.hidden = false;
        }

        /**
         * Renders the end-of-quiz summary and handles Firebase Leaderboard integration.
         */
        async function renderSummary() {
            // GA4 Event
            if (typeof gtag === 'function') {
                gtag('event', 'quiz_complete', { event_category: 'engagement', value: score });
            }

            quizContent.innerHTML = `
                <h3>Quiz Completed!</h3>
                <p style="font-size: 1.2rem; font-weight: bold;">Your Score: ${score} / ${currentQuestions.length}</p>
                <div id="leaderboard-section" style="margin-top: 1.5rem; padding: 1rem; border: 1px solid #ccc; border-radius: 6px;">
                    <h4>Leaderboard</h4>
                    <p id="leaderboard-status">Saving score...</p>
                    <ul id="leaderboard-list" style="text-align: left;"></ul>
                </div>
                <button id="retake-btn" style="margin-top: 1rem;">Retake Quiz</button>
            `;

            document.getElementById('retake-btn').addEventListener('click', () => {
                quizContent.hidden = true;
                startQuizBtn.hidden = false;
                startQuizBtn.textContent = 'Generate & Start Quiz';
                startQuizBtn.disabled = false;
            });

            await handleFirebaseLeaderboard();
        }

        /**
         * Saves score and fetches leaderboard from Firebase Firestore.
         */
        async function handleFirebaseLeaderboard() {
            const statusEl = document.getElementById('leaderboard-status');
            const listEl = document.getElementById('leaderboard-list');

            if (!window.db) {
                statusEl.textContent = 'Leaderboard unavailable (Firebase not configured).';
                return;
            }

            try {
                // Save score
                await window.db.collection('leaderboard').add({
                    score: score,
                    total: currentQuestions.length,
                    date: new Date().toISOString()
                });

                // Fetch top 5
                const snapshot = await window.db.collection('leaderboard')
                    .orderBy('score', 'desc')
                    .limit(5)
                    .get();

                statusEl.textContent = 'Top Scores:';
                listEl.innerHTML = '';
                snapshot.forEach(doc => {
                    const data = doc.data();
                    const li = document.createElement('li');
                    li.textContent = `Score: ${data.score}/${data.total} - ${new Date(data.date).toLocaleDateString()}`;
                    listEl.appendChild(li);
                });
            } catch (error) {
                console.error("Firebase Leaderboard Error:", error);
                statusEl.textContent = 'Could not load leaderboard.';
            }
        }
    });
}

/**
 * Generates MCQ questions about Indian elections using Gemini API.
 * @returns {Promise<Array>} Array of question objects
 * @throws {Error} If API key is missing, network fails, or response is invalid
 */
async function fetchQuizQuestions() {
    const apiKey = window.APP_CONFIG?.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_KEY_HERE') throw new Error('API Key missing');

    const endpoint = `${CONSTANTS.API_URL}${apiKey}`;
    const reqBody = {
        contents: [{ role: 'user', parts: [{ text: CONSTANTS.PROMPT }] }],
        generationConfig: { temperature: 0.1 }
    };

    let response;
    try {
        response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reqBody)
        });
    } catch (e) {
        throw new Error('Network error when reaching Gemini API');
    }

    if (!response.ok) throw new Error('Failed to fetch from Gemini');
    
    const data = await response.json();
    return parseQuizJSON(data);
}

/**
 * Parses the Gemini API response into a valid JSON array.
 * @param {Object} data - The API response object
 * @returns {Array} Array of question objects
 * @throws {Error} If JSON parsing fails or format is invalid
 */
function parseQuizJSON(data) {
    if (!data?.candidates?.[0]?.content?.parts?.[0]?.text) {
        throw new Error('Invalid response structure from Gemini API');
    }
    const rawText = data.candidates[0].content.parts[0].text;
    const cleaned = rawText.replace(/```json|```/gi, '').trim();
    
    let questions;
    try {
        questions = JSON.parse(cleaned);
    } catch (parseError) {
        throw new Error('Failed to parse quiz JSON from AI response');
    }

    if (!Array.isArray(questions) || questions.length === 0) {
        throw new Error('Invalid quiz format returned (not an array)');
    }
    return questions;
}

/**
 * Evaluates whether the selected answer matches the correct index.
 * @param {number} selectedIndex - The option chosen by the user
 * @param {number} correctIndex - The actual correct option
 * @returns {boolean} True if correct, false otherwise
 */
function evaluateQuizAnswer(selectedIndex, correctIndex) {
    return selectedIndex === correctIndex;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { evaluateQuizAnswer, fetchQuizQuestions, parseQuizJSON };
}
