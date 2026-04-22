document.addEventListener('DOMContentLoaded', () => {
    const startQuizBtn = document.getElementById('start-quiz');
    const quizContent = document.getElementById('quiz-content');

    let currentQuestions = [];
    let currentIndex = 0;
    let score = 0;

    if (!startQuizBtn || !quizContent) return;

    startQuizBtn.addEventListener('click', async () => {
        startQuizBtn.textContent = 'Generating questions... please wait.';
        startQuizBtn.disabled = true;

        try {
            currentQuestions = await fetchQuizQuestions();
            if(!currentQuestions || currentQuestions.length === 0) {
                throw new Error("No questions retrieved.");
            }
            currentIndex = 0;
            score = 0;
            quizContent.hidden = false;
            startQuizBtn.hidden = true;
            renderQuestion();
        } catch (error) {
            console.error('Quiz Generation Error:', error);
            startQuizBtn.textContent = 'Error: Check API Key and try again.';
            startQuizBtn.disabled = false;
        }
    });

    async function fetchQuizQuestions() {
        const apiKey = window.APP_CONFIG?.GEMINI_API_KEY;
        if (!apiKey || apiKey === 'YOUR_KEY_HERE') throw new Error('API Key missing');

        const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
        const prompt = `Generate exactly 10 multiple-choice questions about the Indian election process (history, EVMs, rules, ECI, eligibility). 
Return ONLY a valid JSON array of objects. Do NOT wrap in markdown blocks like \`\`\`json.
Each object must match this schema:
{
  "question": "The question text",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correctIndex": <integer 0-3>,
  "explanation": "A short, 1-sentence explanation of the correct answer."
}`;

        const reqBody = {
            contents: [{ role: 'user', parts: [{ text: prompt }] }],
            generationConfig: { temperature: 0.1 }
        };

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(reqBody)
        });

        if (!response.ok) throw new Error('Failed to fetch from Gemini');
        const data = await response.json();
        
        // Parse JSON output from text
        let rawText = data.candidates[0].content.parts[0].text;
        rawText = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
        return JSON.parse(rawText);
    }

    function renderQuestion() {
        if (currentIndex >= currentQuestions.length) {
            renderSummary();
            return;
        }

        const q = currentQuestions[currentIndex];
        
        let html = `
            <h3>Question ${currentIndex + 1} of ${currentQuestions.length}</h3>
            <p style="font-size: 1.1rem; font-weight: bold;">${q.question}</p>
            <div id="options-container" style="display:flex; flex-direction:column; gap:0.5rem; margin-bottom: 1rem;">
        `;

        q.options.forEach((opt, idx) => {
            html += `<button class="quiz-option" data-idx="${idx}">${opt}</button>`;
        });

        html += `</div>
                 <div id="explanation-box" hidden style="background: var(--color-bg-light); padding: 1rem; border-left: 4px solid var(--color-saffron); margin-bottom:1rem;"></div>
                 <button id="next-btn" hidden>Next Question</button>`;

        quizContent.innerHTML = html;

        // Attach listeners
        const optionsContainer = document.getElementById('options-container');
        const optionBtns = document.querySelectorAll('.quiz-option');
        const nextBtn = document.getElementById('next-btn');
        const expBox = document.getElementById('explanation-box');

        optionBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                // Disable all
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
            });
        });

        nextBtn.addEventListener('click', () => {
            currentIndex++;
            renderQuestion();
        });
    }

    function renderSummary() {
        quizContent.innerHTML = `
            <h3>Quiz Completed!</h3>
            <p style="font-size: 1.2rem; font-weight: bold;">Your Score: ${score} / ${currentQuestions.length}</p>
            <button id="retake-btn">Retake Quiz</button>
        `;

        document.getElementById('retake-btn').addEventListener('click', () => {
            quizContent.hidden = true;
            startQuizBtn.hidden = false;
            startQuizBtn.textContent = 'Generate & Start Quiz';
            startQuizBtn.disabled = false;
        });
    }
});

// Extracted for testing
function evaluateQuizAnswer(selectedIndex, correctIndex) {
    return selectedIndex === correctIndex;
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { evaluateQuizAnswer };
}
