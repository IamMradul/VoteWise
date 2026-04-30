const { evaluateEligibility } = require('../js/eligibility.js');
const { evaluateQuizAnswer, fetchQuizQuestions, parseQuizJSON } = require('../js/quiz.js');
const { queryGeminiAPI, parseGeminiResponse } = require('../js/chat.js');
const { LanguageMapping } = require('../js/translate.js');

describe('VoteWise Application Tests', () => {

    describe('1. Eligibility Checker', () => {
        it('should fail if under 18', () => {
            expect(evaluateEligibility(17, true, true)).toBe(false);
        });
        it('should pass if exactly 18', () => {
            expect(evaluateEligibility(18, true, true)).toBe(true);
        });
        it('should fail if non-citizen', () => {
            expect(evaluateEligibility(25, false, true)).toBe(false);
        });
        it('should pass if valid inputs', () => {
            expect(evaluateEligibility(25, true, true)).toBe(true);
        });
        
        // Edge cases
        it('should fail for age 0', () => {
            expect(evaluateEligibility(0, true, true)).toBe(false);
        });
        it('should fail for non-citizen non-resident', () => {
            expect(evaluateEligibility(18, false, false)).toBe(false);
        });
        it('should pass for elderly citizen', () => {
            expect(evaluateEligibility(100, true, true)).toBe(true);
        });
        it('should fail for negative age', () => {
            expect(evaluateEligibility(-1, true, true)).toBe(false);
        });
        it('should fail for non-resident', () => {
            expect(evaluateEligibility(18, true, false)).toBe(false);
        });
        it('should handle decimal ages below 18', () => {
            expect(evaluateEligibility(17.9, true, true)).toBe(false);
        });
    });

    describe('2. Quiz Logic', () => {
        it('should evaluate correct answers properly', () => {
            expect(evaluateQuizAnswer(2, 2)).toBe(true);
            expect(evaluateQuizAnswer(0, 0)).toBe(true);
        });
        it('should evaluate wrong answers properly', () => {
            expect(evaluateQuizAnswer(1, 2)).toBe(false);
            expect(evaluateQuizAnswer(3, 0)).toBe(false);
            expect(evaluateQuizAnswer(0, 3)).toBe(false);
        });
        
        describe('parseQuizJSON', () => {
            it('should parse valid Gemini JSON string', () => {
                const mockAPI = {
                    candidates: [{
                        content: {
                            parts: [{ text: '```json\n[{"question": "Q1", "options": ["A", "B", "C", "D"], "correctIndex": 0, "explanation": "Expl"}]\n```' }]
                        }
                    }]
                };
                const result = parseQuizJSON(mockAPI);
                expect(result).toHaveLength(1);
                expect(result[0].question).toBe('Q1');
            });
            it('should throw error on empty response', () => {
                expect(() => parseQuizJSON({})).toThrow('Invalid response structure');
            });
            it('should throw error on invalid JSON', () => {
                const mockAPI = {
                    candidates: [{ content: { parts: [{ text: '{ invalid json }' }] } }]
                };
                expect(() => parseQuizJSON(mockAPI)).toThrow('Failed to parse quiz JSON');
            });
            it('should throw error on empty array', () => {
                const mockAPI = {
                    candidates: [{ content: { parts: [{ text: '[]' }] } }]
                };
                expect(() => parseQuizJSON(mockAPI)).toThrow('Invalid quiz format');
            });
        });

        describe('fetchQuizQuestions', () => {
            beforeEach(() => {
                global.fetch.mockClear();
            });

            it('should throw if API key is missing', async () => {
                window.APP_CONFIG.GEMINI_API_KEY = 'YOUR_KEY_HERE';
                await expect(fetchQuizQuestions()).rejects.toThrow('API Key missing');
            });

            it('should fetch and parse questions successfully', async () => {
                window.APP_CONFIG.GEMINI_API_KEY = 'valid_key';
                global.fetch.mockImplementationOnce(() => Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        candidates: [{
                            content: { parts: [{ text: '[{"question": "Test", "options": ["A","B","C","D"], "correctIndex": 0, "explanation": "Exp"}]' }] }
                        }]
                    })
                }));
                const res = await fetchQuizQuestions();
                expect(res).toHaveLength(1);
                expect(res[0].question).toBe('Test');
            });

            it('should throw on network failure', async () => {
                window.APP_CONFIG.GEMINI_API_KEY = 'valid_key';
                global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Network Down')));
                await expect(fetchQuizQuestions()).rejects.toThrow('Network error');
            });
            
            it('should throw if response is not ok', async () => {
                window.APP_CONFIG.GEMINI_API_KEY = 'valid_key';
                global.fetch.mockImplementationOnce(() => Promise.resolve({
                    ok: false
                }));
                await expect(fetchQuizQuestions()).rejects.toThrow('Failed to fetch from Gemini');
            });
        });
    });

    describe('3. Chat Logic', () => {
        describe('parseGeminiResponse', () => {
            it('extracts text correctly', () => {
                const mockResponse = {
                    candidates: [{ content: { parts: [{ text: "This is a mock response." }] } }]
                };
                expect(parseGeminiResponse(mockResponse)).toBe("This is a mock response.");
            });
            it('handles empty object', () => {
                expect(parseGeminiResponse({})).toBe("No response retrieved.");
            });
            it('handles null input', () => {
                expect(parseGeminiResponse(null)).toBe("No response retrieved.");
            });
            it('handles missing parts', () => {
                expect(parseGeminiResponse({ candidates: [{ content: {} }] })).toBe("No response retrieved.");
            });
        });

        describe('queryGeminiAPI', () => {
            beforeEach(() => {
                global.fetch.mockClear();
            });

            it('should throw if API key is missing', async () => {
                window.APP_CONFIG.GEMINI_API_KEY = null;
                await expect(queryGeminiAPI('hello')).rejects.toThrow('API Key is missing');
            });

            it('should fetch and return reply successfully', async () => {
                window.APP_CONFIG.GEMINI_API_KEY = 'valid_key';
                global.fetch.mockImplementationOnce(() => Promise.resolve({
                    ok: true,
                    json: () => Promise.resolve({
                        candidates: [{ content: { parts: [{ text: 'Hello from AI' }] } }]
                    })
                }));
                const reply = await queryGeminiAPI('hi');
                expect(reply).toBe('Hello from AI');
            });

            it('should throw on network failure', async () => {
                window.APP_CONFIG.GEMINI_API_KEY = 'valid_key';
                global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Network Down')));
                await expect(queryGeminiAPI('hi')).rejects.toThrow('Network error');
            });

            it('should throw with API error message if not ok', async () => {
                window.APP_CONFIG.GEMINI_API_KEY = 'valid_key';
                global.fetch.mockImplementationOnce(() => Promise.resolve({
                    ok: false,
                    json: () => Promise.resolve({ error: { message: 'Quota exceeded' } })
                }));
                await expect(queryGeminiAPI('hi')).rejects.toThrow('Quota exceeded');
            });
        });
    });

    describe('4. Translation Logic', () => {
        it('should map languages correctly', () => {
            expect(LanguageMapping['Hindi']).toBe('hi');
            expect(LanguageMapping['Tamil']).toBe('ta');
            expect(LanguageMapping['Bengali']).toBe('bn');
            expect(LanguageMapping['Telugu']).toBe('te');
            expect(LanguageMapping['Marathi']).toBe('mr');
            expect(LanguageMapping['Gujarati']).toBe('gu');
            expect(LanguageMapping['Kannada']).toBe('kn');
            expect(LanguageMapping['Malayalam']).toBe('ml');
        });

        it('should initialize Google Translate widget', () => {
            document.body.innerHTML = '<div id="google_translate_element"></div>';
            window.google = {
                translate: {
                    TranslateElement: jest.fn().mockImplementation(function(options, id) {
                        this.options = options;
                    })
                }
            };
            window.google.translate.TranslateElement.InlineLayout = { SIMPLE: 'SIMPLE' };
            const { googleTranslateElementInit } = require('../js/translate.js');
            googleTranslateElementInit();
            expect(window.google.translate.TranslateElement).toHaveBeenCalled();
        });

        it('should inject translation script', () => {
            document.head.innerHTML = '';
            const { injectTranslateScript } = require('../js/translate.js');
            injectTranslateScript();
            const script = document.head.querySelector('script');
            expect(script).not.toBeNull();
            expect(script.src).toContain('translate_a/element.js');
        });
    });

    describe('5. DOM Interactions', () => {
        beforeAll(() => {
            document.body.innerHTML = `
                <div id="chat-toggle"></div>
                <div id="chat-widget"></div>
                <div id="chat-body" hidden></div>
                <form id="chat-form">
                    <input id="chat-input" value="" />
                    <button id="chat-submit" type="submit"></button>
                </form>
                <div id="chat-messages"></div>
                
                <button id="start-quiz"></button>
                <div id="quiz-content" hidden></div>
                
                <form id="eligibility-form">
                    <input type="number" id="age" value="" />
                    <input type="radio" name="citizenship" value="yes" />
                    <input type="radio" name="resident" value="yes" />
                    <button id="eligibility-submit" type="submit"></button>
                </form>
                <div id="eligibility-result"></div>
            `;
            
            const event = document.createEvent('Event');
            event.initEvent('DOMContentLoaded', true, true);
            document.dispatchEvent(event);
        });

        beforeEach(() => {
            global.fetch.mockClear();
            document.getElementById('chat-input').value = '';
            document.getElementById('chat-messages').innerHTML = '';
            document.getElementById('chat-body').hidden = true;
            document.getElementById('quiz-content').innerHTML = '';
            document.getElementById('quiz-content').hidden = true;
            document.getElementById('start-quiz').disabled = false;
            document.getElementById('start-quiz').hidden = false;
            document.getElementById('start-quiz').textContent = 'Generate & Start Quiz';
            
            document.getElementById('age').value = '';
            document.querySelectorAll('input[type="radio"]').forEach(r => r.checked = false);
            document.getElementById('eligibility-result').innerHTML = '';
        });

        it('should toggle chat window', () => {
            const toggle = document.getElementById('chat-toggle');
            const body = document.getElementById('chat-body');
            
            expect(body.hidden).toBe(true);
            toggle.click();
            expect(body.hidden).toBe(false);
            
            toggle.click();
            expect(body.hidden).toBe(true);
        });

        it('should handle chat submit with too long message', () => {
            const form = document.getElementById('chat-form');
            const input = document.getElementById('chat-input');
            const msgs = document.getElementById('chat-messages');
            input.value = 'a'.repeat(501);
            form.dispatchEvent(new Event('submit'));
            expect(msgs.innerHTML).toContain('Please keep your question under 500 characters.');
        });
        
        it('should handle successful chat submit', async () => {
            window.APP_CONFIG.GEMINI_API_KEY = 'valid_key';
            global.fetch.mockImplementationOnce(() => Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    candidates: [{ content: { parts: [{ text: 'Hello from AI' }] } }]
                })
            }));
            
            const form = document.getElementById('chat-form');
            const input = document.getElementById('chat-input');
            input.value = 'hi';
            form.dispatchEvent(new Event('submit'));
            
            // wait for async ops
            await new Promise(r => setTimeout(r, 10));
            const msgs = document.getElementById('chat-messages');
            expect(msgs.innerHTML).toContain('Hello from AI');
        });

        it('should start quiz and show loading state', async () => {
            const btn = document.getElementById('start-quiz');
            global.fetch.mockImplementationOnce(() => Promise.reject(new Error('Network Down')));
            btn.click();
            expect(btn.textContent).toBe('Generating questions... please wait.');
            expect(btn.disabled).toBe(true);
            
            await new Promise(r => setTimeout(r, 10));
            const content = document.getElementById('quiz-content');
            expect(content.innerHTML).toContain('Failed to generate quiz');
        });

        it('should handle full quiz flow', async () => {
            window.APP_CONFIG.GEMINI_API_KEY = 'valid_key';
            
            // Mock window.db for Firebase coverage
            const mockDoc = { data: () => ({ score: 10, total: 10, date: '2024-01-01' }) };
            window.db = {
                collection: jest.fn(() => ({
                    add: jest.fn(() => Promise.resolve()),
                    orderBy: jest.fn(() => ({
                        limit: jest.fn(() => ({
                            get: jest.fn(() => Promise.resolve([mockDoc]))
                        }))
                    }))
                }))
            };

            // Mock Gemini Response
            global.fetch.mockImplementationOnce(() => Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    candidates: [{
                        content: { parts: [{ text: '[{"question": "Q1", "options": ["A","B","C","D"], "correctIndex": 0, "explanation": "Exp"}]' }] }
                    }]
                })
            }));

            const btn = document.getElementById('start-quiz');
            btn.click();

            // Wait for fetch to resolve
            await new Promise(r => setTimeout(r, 10));
            
            const content = document.getElementById('quiz-content');
            expect(content.innerHTML).toContain('Q1');
            
            // Click an option
            const opt = document.querySelector('.quiz-option');
            opt.click();
            
            expect(content.innerHTML).toContain('Correct!');
            
            // Click next
            const next = document.getElementById('next-btn');
            next.click();
            
            // Verify summary
            await new Promise(r => setTimeout(r, 10));
            expect(content.innerHTML).toContain('Quiz Completed!');
            
            // Retake quiz
            const retakeBtn = document.getElementById('retake-btn');
            if (retakeBtn) {
                retakeBtn.click();
                expect(content.hidden).toBe(true);
            }
        });

        it('should handle full quiz flow with wrong answer and missing firebase', async () => {
            window.APP_CONFIG.GEMINI_API_KEY = 'valid_key';
            window.db = null; // Missing firebase

            // Mock Gemini Response
            global.fetch.mockImplementationOnce(() => Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    candidates: [{
                        content: { parts: [{ text: '[{"question": "Q1", "options": ["A","B","C","D"], "correctIndex": 0, "explanation": "Exp"}]' }] }
                    }]
                })
            }));

            const btn = document.getElementById('start-quiz');
            btn.click();
            await new Promise(r => setTimeout(r, 10));
            
            const content = document.getElementById('quiz-content');
            expect(content.innerHTML).toContain('Q1');
            
            // Click WRONG option (index 1)
            const options = document.querySelectorAll('.quiz-option');
            options[1].click();
            
            expect(content.innerHTML).toContain('Incorrect.');
            
            // Click next
            const next = document.getElementById('next-btn');
            next.click();
            
            // Verify summary
            await new Promise(r => setTimeout(r, 10));
            expect(content.innerHTML).toContain('Leaderboard unavailable');
        });

        it('should handle firebase error during leaderboard save', async () => {
            window.APP_CONFIG.GEMINI_API_KEY = 'valid_key';
            
            window.db = {
                collection: jest.fn(() => ({
                    add: jest.fn(() => Promise.reject(new Error('Firebase down'))),
                    orderBy: jest.fn(() => ({
                        limit: jest.fn(() => ({
                            get: jest.fn(() => Promise.resolve([]))
                        }))
                    }))
                }))
            };

            global.fetch.mockImplementationOnce(() => Promise.resolve({
                ok: true,
                json: () => Promise.resolve({
                    candidates: [{
                        content: { parts: [{ text: '[{"question": "Q1", "options": ["A","B","C","D"], "correctIndex": 0, "explanation": "Exp"}]' }] }
                    }]
                })
            }));

            document.getElementById('start-quiz').click();
            await new Promise(r => setTimeout(r, 10));
            document.querySelector('.quiz-option').click();
            document.getElementById('next-btn').click();
            await new Promise(r => setTimeout(r, 10));
            
            const content = document.getElementById('quiz-content');
            expect(content.innerHTML).toContain('Could not load leaderboard.');
        });

        it('should handle eligibility form valid submit', () => {
            const form = document.getElementById('eligibility-form');
            const result = document.getElementById('eligibility-result');
            document.getElementById('age').value = '25';
            document.querySelector('input[name="citizenship"]').checked = true;
            document.querySelector('input[name="resident"]').checked = true;
            form.dispatchEvent(new Event('submit'));
            expect(result.innerHTML).toContain('You are eligible to vote!');
        });
        
        it('should handle eligibility form invalid age', () => {
            const form = document.getElementById('eligibility-form');
            const result = document.getElementById('eligibility-result');
            document.getElementById('age').value = '-5';
            form.dispatchEvent(new Event('submit'));
            expect(result.innerHTML).toContain('Please enter a valid age.');
        });
        
        it('should handle eligibility form missing answers', () => {
            const form = document.getElementById('eligibility-form');
            const result = document.getElementById('eligibility-result');
            document.getElementById('age').value = '20';
            form.dispatchEvent(new Event('submit'));
            expect(result.innerHTML).toContain('Please answer all questions.');
        });
        
        it('should handle eligibility form not eligible', () => {
            const form = document.getElementById('eligibility-form');
            const result = document.getElementById('eligibility-result');
            document.getElementById('age').value = '17';
            document.querySelector('input[name="citizenship"]').checked = true;
            document.querySelector('input[name="resident"]').checked = true;
            form.dispatchEvent(new Event('submit'));
            expect(result.innerHTML).toContain('You are not eligible yet.');
        });
    });
});
