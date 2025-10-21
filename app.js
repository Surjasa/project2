// AI Assistant
class AiAssistant {
    constructor() {
        this.apiKey = 'GEMINI_API_KEY'; 
        this.messagesContainer = document.getElementById('messages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');

        this.init();
    }

    init() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        //initial message
        this.addMessage("Hello! I'm your AI assistant. How can I help you today?", 'ai');
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message) return;

        if (!this.apiKey) {
            this.addMessage('Please add your Gemini API key to the code first!', 'ai');
            return;
        }

        // Add user message
        this.addMessage(message, 'user');
        this.messageInput.value = '';

        // Show loading
        this.sendButton.disabled = true;
        this.sendButton.textContent = 'Thinking...';

        try {
            const response = await this.callGeminiAPI(message);
            this.addMessage(response, 'ai');
        } catch (error) {
            this.addMessage('Sorry, I encountered an error. Please try again.', 'ai');
            console.error('Error:', error);
        }

        // Reset button
        this.sendButton.disabled = false;
        this.sendButton.textContent = 'Send';
    }

    async callGeminiAPI(message) {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${this.apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: message
                    }]
                }]
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.textContent = text;

        this.messagesContainer.appendChild(messageDiv);
        this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
}

// Initialize the assistant when page loads
document.addEventListener('DOMContentLoaded', () => {
    new AiAssistant();
});
