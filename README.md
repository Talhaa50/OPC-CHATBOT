# OPC Chatbot 

AI-powered customer support chatbot for the (OPC). Built with Next.js, React, and Groq AI.

## ⚡ Quick Start (5 Minutes)

### 1. Environment Setup
```bash
# Create .env file in root directory
GROQ_API_KEY=gsk_your_actual_key_here
ADMIN_PASSWORD=YourSecurePassword123
PORT=3000
NODE_ENV=production
```

**Get GROQ API Key:**
1. Visit https://console.groq.com
2. Sign up/Login
3. Create and copy your API key

### 2. Install & Start
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Or production
npm start

# Test: Visit http://localhost:3000
```

### 3. Embed in Your Site
Copy this into your HTML's `</body>` tag:

```html
<style>
  :root {
    --opc-navy: #001f3f;
    --opc-gold: #d4a574;
    --opc-light: #f5f5f5;
  }
  .opc-chat-bubble {
    position: fixed;
    bottom: 30px;
    right: 30px;
    width: 65px;
    height: 65px;
    background: linear-gradient(135deg, var(--opc-navy) 0%, #003d66 100%);
    border: 3px solid var(--opc-gold);
    border-radius: 50%;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    z-index: 9999;
    box-shadow: 0 4px 12px rgba(0, 31, 63, 0.3);
  }
  .opc-chat-bubble:hover {
    transform: scale(1.1);
  }
  .opc-chat-container {
    position: fixed;
    bottom: 100px;
    right: 30px;
    width: 420px;
    height: 600px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 5px 40px rgba(0, 0, 0, 0.16);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    display: none;
  }
  .opc-chat-container.open {
    display: flex;
  }
  .opc-chat-header {
    background: linear-gradient(135deg, var(--opc-navy) 0%, #003d66 100%);
    color: white;
    padding: 20px;
    border-radius: 12px 12px 0 0;
  }
  .opc-chat-close {
    float: right;
    cursor: pointer;
    font-size: 24px;
  }
  .opc-chat-messages {
    flex: 1;
    overflow-y: auto;
    padding: 15px;
    background: var(--opc-light);
  }
  .opc-message {
    margin: 10px 0;
    padding: 10px 15px;
    border-radius: 8px;
    max-width: 85%;
  }
  .opc-message.user {
    background: var(--opc-navy);
    color: white;
    margin-left: auto;
    text-align: right;
  }
  .opc-message.bot {
    background: white;
    border: 1px solid #ddd;
  }
  .opc-quick-actions {
    padding: 10px;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }
  .opc-quick-btn {
    padding: 6px 12px;
    background: var(--opc-navy);
    color: white;
    border: none;
    border-radius: 20px;
    cursor: pointer;
    font-size: 12px;
  }
  .opc-quick-btn:hover {
    background: var(--opc-gold);
    color: var(--opc-navy);
  }
  .opc-input-area {
    display: flex;
    padding: 10px;
    border-top: 1px solid #ddd;
  }
  .opc-input-area input {
    flex: 1;
    border: 1px solid #ddd;
    border-radius: 20px;
    padding: 10px 15px;
    margin-right: 10px;
  }
  .opc-send-btn {
    background: var(--opc-navy);
    color: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    cursor: pointer;
  }
  .opc-send-btn:hover {
    background: var(--opc-gold);
    color: var(--opc-navy);
  }
  @media (max-width: 480px) {
    .opc-chat-container {
      width: 100%;
      height: 100%;
      bottom: 0;
      right: 0;
      border-radius: 0;
    }
  }
</style>

<div id="opc-chat-widget">
  <div class="opc-chat-bubble">💬</div>
  <div class="opc-chat-container">
    <div class="opc-chat-header">
      OPC Support <span class="opc-chat-close">×</span>
    </div>
    <div class="opc-chat-messages"></div>
    <div class="opc-quick-actions"></div>
    <div class="opc-input-area">
      <input type="text" placeholder="Ask about OPC services..." />
      <button class="opc-send-btn">→</button>
    </div>
  </div>
</div>

<script>
  const API_URL = "http://localhost:3000"; // Change to your backend URL
  const widget = document.getElementById("opc-chat-widget");
  const bubble = widget.querySelector(".opc-chat-bubble");
  const container = widget.querySelector(".opc-chat-container");
  const messagesDiv = widget.querySelector(".opc-chat-messages");
  const closeBtn = widget.querySelector(".opc-chat-close");
  const input = widget.querySelector(".opc-input-area input");
  const sendBtn = widget.querySelector(".opc-send-btn");
  const quickActionsDiv = widget.querySelector(".opc-quick-actions");
  
  let chatHistory = [];
  let quickActions = [];

  // Fetch quick actions
  async function fetchQuickActions() {
    try {
      const res = await fetch(`${API_URL}/api/bot-config`, {
        headers: { "x-admin-password": "public" }
      });
      if (res.ok) {
        const config = await res.json();
        quickActions = config.quickActions || [];
        renderQuickActions();
      }
    } catch (e) {
      console.log("Quick actions not available");
    }
  }

  function renderQuickActions() {
    quickActionsDiv.innerHTML = quickActions
      .map(action => `<button class="opc-quick-btn">${action}</button>`)
      .join("");
    
    quickActionsDiv.querySelectorAll(".opc-quick-btn").forEach(btn => {
      btn.onclick = () => sendMessage(btn.textContent);
    });
  }

  function toggleChat() {
    container.classList.toggle("open");
    if (container.classList.contains("open") && messagesDiv.children.length === 0) {
      fetchQuickActions();
      addMessage("Welcome to OPC Support! 👋 I'm here to help. What would you like to know?", "bot");
    }
  }

  function addMessage(text, sender) {
    const msg = document.createElement("div");
    msg.className = `opc-message ${sender}`;
    msg.textContent = text;
    messagesDiv.appendChild(msg);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
  }

  async function sendMessage(text) {
    if (!text.trim()) return;
    
    addMessage(text, "user");
    input.value = "";
    
    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, history: chatHistory })
      });
      
      const data = await res.json();
      addMessage(data.reply, "bot");
      
      chatHistory.push({ role: "user", content: text });
      chatHistory.push({ role: "assistant", content: data.reply });
    } catch (e) {
      addMessage("Sorry, I couldn't connect. Please try again.", "bot");
    }
  }

  bubble.onclick = toggleChat;
  closeBtn.onclick = toggleChat;
  sendBtn.onclick = () => sendMessage(input.value);
  input.onkeypress = (e) => e.key === "Enter" && sendMessage(input.value);
</script>
```

## 📁 Project Structure

```
OPC-chatbot/
├── app/
│   ├── api/
│   │   ├── chat/              # Chat endpoint
│   │   └── bot-config/        # Config management API
│   ├── layout.js              # Root layout
│   ├── page.js                # Home page
│   └── globals.css            # Global styles
├── components/
│   └── ChatWidget/            # React chat widget
├── data/
│   └── bot-config.json        # Knowledge base & personality
├── .env.example               # Environment template
├── next.config.js             # Next.js config
├── package.json               # Dependencies
├── web.config                 # IIS deployment config
└── README.md                  # This file
```

## 🧠 How It Works

1. **User sends message** → Chat widget captures input
2. **Message sent to backend** → `/api/chat` endpoint
3. **System prompt built** → Personality + knowledge base injected
4. **Groq AI processes** → LLaMA 3.3 70B model generates response
5. **Reply returned** → Displayed in chat widget

## ⚙️ Configuration

Edit [data/bot-config.json](data/bot-config.json) to customize:

- **Personality**: Name, role, tone, greeting messages
- **Quick Actions**: Clickable shortcuts (first 8 shown)
- **Knowledge Base**: Topics and content (unlimited)
- **Response Rules**: Length, formatting, personality traits

Example:
```json
{
  "personality": {
    "name": "OPC Assistant",
    "role": "Customer Support Specialist...",
    "greeting": "Welcome! How can I help?",
    "systemPromptRules": {
      "responseLength": "Keep it to 4-6 sentences",
      "formatting": "Use → for paths, numbered lists"
    }
  },
  "quickActions": ["What are OPC services?", "..."],
  "knowledge": [
    {
      "topic": "About OPC",
      "content": "OPC is a government agency..."
    }
  ]
}
```

## 🔐 Admin Access

Access bot config programmatically:

```bash
# GET config (with admin password)
curl http://localhost:3000/api/bot-config \
  -H "x-admin-password: YourSecurePassword123"

# POST to update config
curl -X POST http://localhost:3000/api/bot-config \
  -H "Content-Type: application/json" \
  -H "x-admin-password: YourSecurePassword123" \
  -d '{...config...}'
```

## 📞 Support

- **Documentation**: See [data/bot-config.json](data/bot-config.json)
- **Issues**: Check console logs (`npm run dev` output)
- **Groq API Docs**: https://console.groq.com/docs
- **Next.js Docs**: https://nextjs.org/docs

## 📝 Tech Stack

- **Backend**: Next.js 14 + Node.js
- **Frontend**: React 18 + Vanilla JS
- **AI**: Groq API (LLaMA 3.3 70B)
- **Storage**: JSON file (no database)
- **Deployment**: Vercel, Plesk, Docker

## 📄 License

MIT License - Free to use and modify

---

**Version**: 1.0.0 | **Updated**: 2026 | **Status**: Production Ready ✅
