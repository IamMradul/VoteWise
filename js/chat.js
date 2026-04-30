/**
 * @fileoverview Logic for the VoteWise AI Chat Assistant.
 * Handles user input, API communication, multi-turn conversation history,
 * error handling, and event tracking.
 */

const CHAT_CONSTANTS = {
    API_URL: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=',
    MAX_HISTORY: 20,
    MAX_INPUT_LENGTH: 500,
    SYSTEM_PROMPT: `You are the VoteWise AI Assistant, an expert on the Indian election process.
Strict Rules:
1. ONLY answer questions related to the Indian election topics such as: voter registration, EVM machines, Model Code of Conduct, election phases, Election Commission of India (ECI), NOTA, postal ballots, and constituency delimitation.
2. If the user asks about anything unrelated to Indian elections, politely decline and steer them back to electoral topics.
3. Detect the user's state or region context if mentioned, and provide region-relevant voting insights if applicable.
4. Keep answers concise, strictly factual, and easy to understand. Keep it under 100 words.`
};

let conversationHistory = [];

if (typeof document !== 'undefined') {
    document.addEventListener('DOMContentLoaded', () => {
        let isLoading = false;
        const chatToggle = document.getElementById('chat-toggle');
        const chatWidget = document.getElementById('chat-widget');
        const chatBody = document.getElementById('chat-body');
        const chatForm = document.getElementById('chat-form');
        const chatInput = document.getElementById('chat-input');
        const chatMessages = document.getElementById('chat-messages');

        if (!chatToggle || !chatWidget) return;

        chatToggle.addEventListener('click', toggleChatWindow);

        chatForm.addEventListener('submit', handleChatSubmit);

        /**
         * Toggles the visibility of the chat window.
         */
        function toggleChatWindow() {
            const isHidden = chatBody.hidden;
            chatBody.hidden = !isHidden;
            chatToggle.textContent = isHidden ? '▼' : '▲';
            chatToggle.setAttribute('aria-label', isHidden ? 'Close chat assistant' : 'Open chat assistant');
            chatToggle.setAttribute('aria-expanded', String(isHidden));
            if (isHidden) chatInput.focus();
        }

        /**
         * Handles the chat form submission.
         * @param {Event} e - The submit event
         */
        async function handleChatSubmit(e) {
            e.preventDefault();
            if (isLoading) return;
            
            const message = chatInput.value.trim();
            if (!message) return;

            if (message.length > CHAT_CONSTANTS.MAX_INPUT_LENGTH) {
                addMessage('Please keep your question under 500 characters.', 'system');
                return;
            }

            isLoading = true;
            processUserMessage(message);

            try {
                addMessage('Typing...', 'system', 'loading-msg');
                const reply = await queryGeminiAPI(message);
                removeMessage('loading-msg');
                processSystemMessage(reply);
                
                // Track GA4 event
                if (typeof gtag === 'function') {
                    gtag('event', 'chat_message_sent', { event_category: 'engagement' });
                }
            } catch (error) {
                handleChatError(error);
            } finally {
                cleanupChatState();
            }
        }

        /**
         * Adds user message to UI and history.
         * @param {string} msg - The user's message
         */
        function processUserMessage(msg) {
            addMessage(msg, 'user');
            conversationHistory.push({ role: "user", parts: [{ text: msg }] });
            trimHistory();
            chatInput.value = '';
            chatInput.disabled = true;
        }

        /**
         * Adds system reply to UI and history.
         * @param {string} reply - The AI's response
         */
        function processSystemMessage(reply) {
            addMessage(reply, 'system');
            conversationHistory.push({ role: "model", parts: [{ text: reply }] });
            trimHistory();
        }

        /**
         * Handles errors during chat API calls.
         * @param {Error} error - The caught error
         */
        function handleChatError(error) {
            removeMessage('loading-msg');
            console.error('Chat Error:', error);
            addMessage(`Sorry, I encountered an error: ${error.message}. Please try again later.`, 'system');
        }

        /**
         * Cleans up state after message is processed or errors out.
         */
        function cleanupChatState() {
            isLoading = false;
            chatInput.disabled = false;
            chatInput.focus();
        }

        /**
         * Appends a message to the chat UI.
         * @param {string} text - The text to display
         * @param {string} sender - 'user' or 'system'
         * @param {string|null} id - Optional element ID
         */
        function addMessage(text, sender, id = null) {
            const msgDiv = document.createElement('div');
            msgDiv.className = `message ${sender}`;
            msgDiv.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
            if (id) msgDiv.id = id;
            chatMessages.appendChild(msgDiv);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        /**
         * Removes a specific message element from the chat UI by ID.
         * @param {string} id - The ID of the element to remove
         */
        function removeMessage(id) {
            const el = document.getElementById(id);
            if (el) el.remove();
        }

        /**
         * Ensures conversation history does not exceed the maximum allowed length.
         */
        function trimHistory() {
            if (conversationHistory.length > CHAT_CONSTANTS.MAX_HISTORY) {
                conversationHistory.splice(0, 2);
            }
        }
    });
}

/**
 * Sends a message to the Gemini API via the VoteWise configuration.
 * Maintains conversationHistory for multi-turn context.
 * @param {string} userQuery - The user's input message
 * @returns {Promise<string>} The assistant's text response
 * @throws {Error} When API key is missing or network/API error occurs
 */
async function queryGeminiAPI(userQuery) {
    const apiKey = window.APP_CONFIG?.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_KEY_HERE') {
        throw new Error('API Key is missing');
    }

    const endpoint = `${CHAT_CONSTANTS.API_URL}${apiKey}`;
    const requestBody = {
        system_instruction: { 
            parts: [{ text: CHAT_CONSTANTS.SYSTEM_PROMPT }]
        },
        contents: conversationHistory,
        generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 250
        }
    };

    let response;
    try {
        response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(requestBody)
        });
    } catch (e) {
        throw new Error('Network error when contacting Gemini API');
    }

    if (!response.ok) {
        let errorData = {};
        try {
            errorData = await response.json();
        } catch (e) {} // ignore json parse errors on error responses
        throw new Error(errorData.error?.message || 'Failed to communicate with Gemini API');
    }

    const data = await response.json();
    return parseGeminiResponse(data);
}

/**
 * Parses the structured Gemini JSON response to extract the assistant's reply.
 * @param {Object} apiData - The JSON payload from Gemini
 * @returns {string} The text response
 */
function parseGeminiResponse(apiData) {
    if (apiData?.candidates?.[0]?.content?.parts?.[0]?.text) {
        return apiData.candidates[0].content.parts[0].text;
    }
    return 'No response retrieved.';
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { queryGeminiAPI, parseGeminiResponse, CHAT_CONSTANTS };
}
