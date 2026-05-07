# OCP Chatbot - Quick Reference Guide

One-page quick reference for OCP chatbot setup, testing, and deployment.

## 🚀 30-Second Start

```bash
# 1. Create .env file with:
GROQ_API_KEY=gsk_your_actual_key_here
ADMIN_PASSWORD=YourSecurePassword123
PORT=3000
NODE_ENV=production

# 2. Install & run
npm install
npm start

# 3. Open browser
http://localhost:3000
```

## 💬 Chat Bubble Widget

**Appears**: Bottom-right corner  
**Color**: Navy gradient with gold border  
**Icon**: 💬  
**Click**: Opens/closes chat window  

**Quick Actions** (auto-loaded):
- What are OPC services?
- How do I file a complaint?
- What is the complaint process?
- What are your office hours?
- How do I contact OPC?
- What are your fees?
- Can you help with consumer disputes?
- What documents do I need?

## 📁 Project Structure

```
ocp-chatbot/
├── app/api/chat           → Chat endpoint (POST)
├── app/api/bot-config     → Config endpoint (GET/POST)
├── components/ChatWidget  → React chat component
├── data/bot-config.json   → Knowledge base + personality
├── README.md              → Full documentation
├── TESTING-GUIDE.md       → Test procedures
└── PROJECT-SUMMARY.md     → What's been done
```

## 🧠 Customization

### Edit Bot Personality
File: `data/bot-config.json` → `personality`

```json
{
  "name": "OPC Assistant",
  "role": "Customer Support Specialist...",
  "greeting": "👋 Welcome to OPC Support!...",
  "tone": "Friendly, professional, empathetic..."
}
```

### Add Knowledge Topic
File: `data/bot-config.json` → `knowledge` array

```json
{
  "topic": "My New Topic",
  "content": "Detailed explanation of the topic..."
}
```

### Add Quick Action Button
File: `data/bot-config.json` → `quickActions` array

```json
"New question to display as button?"
```

**Changes take effect after**: Server restart

## 🧪 Test Scenarios

| Scenario | Input | Expected |
|----------|-------|----------|
| Complaint | "How do I file a complaint?" | 8-step process |
| Hours | "What are your office hours?" | Business hours |
| Services | "What services?" | 10 OPC services |
| Contact | "How to contact?" | Phone, email, address |
| Fees | "What are your fees?" | Service costs |
| Off-topic | "Tell me a joke" | Redirect to OPC |
| Follow-up | "How much?" (after fees) | Maintains context |

## 🔌 API Endpoints

### Chat Endpoint
**POST** `/api/chat`

```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How do I file a complaint?",
    "history": []
  }'
```

Response:
```json
{
  "reply": "Filing a complaint is simple..."
}
```

### Config Endpoint
**GET** `/api/bot-config`  
**POST** `/api/bot-config`

```bash
# Read config
curl http://localhost:3000/api/bot-config \
  -H "x-admin-password: YourSecurePassword123"

# Update config
curl -X POST http://localhost:3000/api/bot-config \
  -H "Content-Type: application/json" \
  -H "x-admin-password: YourSecurePassword123" \
  -d '{...config json...}'
```

## 🎨 Colors & Styling

| Element | Color | Code |
|---------|-------|------|
| Primary | Navy Blue | #001f3f |
| Accent | Gold | #d4a574 |
| Background | Light Gray | #f5f5f5 |
| Chat Bubble | Gradient | Linear gradient |
| User Message | Navy | Left aligned |
| Bot Message | White | Right aligned |

## 📱 Responsive Design

- **Desktop**: 360px wide, 520px tall
- **Tablet**: 90% width
- **Mobile**: Full screen (100% × 100%)
- **Animation**: Smooth slide-up on open

## 🔒 Security

- Admin endpoints require `x-admin-password` header
- Environment variables stored in `.env`
- API keys never exposed to frontend
- Config protected with admin password

## 🚀 Deployment

### Vercel (Recommended)
```bash
git push origin main
# Auto-deploys, add env vars in Vercel dashboard
```

### Plesk/cPanel
1. Upload files to `public_html`
2. Create `.env` file
3. Run `npm install`
4. Point domain to app
5. Node.js auto-starts via `web.config`

### Docker
```bash
docker build -t ocp-chatbot .
docker run -e GROQ_API_KEY=xxx -p 3000:3000 ocp-chatbot
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| "Connection refused" | Run `npm start` |
| "Bot not responding" | Check GROQ_API_KEY |
| "Wrong greeting" | Restart server after editing config |
| "Quick actions missing" | Check network in F12 DevTools |
| "Mobile layout broken" | Clear browser cache |
| "401 Unauthorized" | Check admin password header |

## 📋 Pre-Deployment Checklist

- [ ] npm start runs without errors
- [ ] Chat bubble appears
- [ ] All 7 test scenarios pass
- [ ] API endpoints respond
- [ ] Admin protection working
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Configuration saved

## 📞 Quick Commands

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm build

# Start production server
npm start

# View logs
npm logs

# Stop server
Ctrl + C
```

## 📚 Documentation

1. **README.md** - Full setup and deployment guide
2. **TESTING-GUIDE.md** - Complete testing procedures
3. **PROJECT-SUMMARY.md** - What's been completed
4. **QUICK-REFERENCE.md** - This file

## 🎯 Key Files to Know

| File | Purpose |
|------|---------|
| `data/bot-config.json` | Personality + knowledge base |
| `app/api/chat/route.js` | Chat processing logic |
| `components/ChatWidget/` | React chat component |
| `.env` | Secret credentials |
| `package.json` | Dependencies & scripts |

## 💡 Tips

1. **Change bot personality** → Edit `data/bot-config.json`
2. **Add knowledge** → Add to `knowledge` array
3. **Test locally first** → Use `npm run dev`
4. **Check logs** → Browser console (F12) & terminal
5. **Monitor responses** → Check if accurate and relevant
6. **Update often** → Config changes apply after restart

## 🎉 Status

✅ **Ready to Test**
- Clean structure
- Complete personality
- Comprehensive knowledge base
- Full documentation
- Production ready

---

**Need help?** See README.md or TESTING-GUIDE.md

**Version**: 1.0.0 | **Status**: Production Ready
