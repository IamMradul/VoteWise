if (typeof document !== 'undefined') {
document.addEventListener('DOMContentLoaded', () => {
    const chatToggle = document.getElementById('chat-toggle');
    const chatWidget = document.getElementById('chat-widget');
    const chatBody = document.getElementById('chat-body');
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const chatMessages = document.getElementById('chat-messages');

    if (!chatToggle || !chatWidget) return;

    chatToggle.addEventListener('click', () => {
        const isHidden = chatBody.hidden;
        chatBody.hidden = !isHidden;
        chatToggle.textContent = isHidden ? '_' : '^';
        if (isHidden) {
            chatInput.focus();
        }
    });

    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const message = chatInput.value.trim();
        if (!message) return;

        // Add user message
        addMessage(message, 'user');
        chatInput.value = '';
        chatInput.disabled = true;

        // Fetch from Gemini API
        try {
            addMessage('Typing...', 'system', 'loading-msg');
            const reply = await queryGeminiAPI(message);
            removeMessage('loading-msg');
            addMessage(reply, 'system');
        } catch (error) {
            removeMessage('loading-msg');
            console.error('Chat Error:', error);
            addMessage('Sorry, I encountered an error. Please try again later or verify your API key.', 'system');
        } finally {
            chatInput.disabled = false;
            chatInput.focus();
        }
    });

    function addMessage(text, sender, id = null) {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        // Basic markdown-to-html for bolding and line breaks
        msgDiv.innerHTML = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
        if (id) msgDiv.id = id;
        chatMessages.appendChild(msgDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    function removeMessage(id) {
        const el = document.getElementById(id);
        if (el) el.remove();
    }
});
}

async function queryGeminiAPI(userQuery) {
    // Determine the API key from config.local.js or config.example.js (fallback)
    const apiKey = window.APP_CONFIG?.GEMINI_API_KEY;
    if (!apiKey || apiKey === 'YOUR_KEY_HERE') {
        throw new Error('API Key is missing. Please setup config.local.js');
    }

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

    const systemPrompt = `You are the VoteWise AI Assistant, an expert on the Indian election process.
Strict Rules:
1. ONLY answer questions related to the Indian election topics such as: voter registration, EVM machines, Model Code of Conduct, election phases, Election Commission of India (ECI), NOTA, postal ballots, and constituency delimitation.
2. If the user asks about anything unrelated to Indian elections, politely decline and steer them back to electoral topics.
3. Detect the user's state or region context if mentioned, and provide region-relevant voting insights if applicable.
4. Keep answers concise, strictly factual, and easy to understand. Keep it under 100 words.`;

    const requestBody = {
        system_instruction: { 
            parts: [{ text: systemPrompt }]
        },
        contents: [
            { role: 'user', parts: [{ text: userQuery }] }
        ],
        generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 250
        }
    };

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Failed to communicate with Gemini API.');
    }

    const data = await response.json();
    return parseGeminiResponse(data);
}

// Extracted for testing
function parseGeminiResponse(apiData) {
    if (apiData && apiData.candidates && apiData.candidates.length > 0) {
        return apiData.candidates[0].content.parts[0].text;
    }
    return 'No response retrieved.';
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { queryGeminiAPI, parseGeminiResponse };
}
