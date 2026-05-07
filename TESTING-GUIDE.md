# OPC Chatbot - Testing Guide

Complete testing instructions for the OPC support chatbot.

## ⚡ Quick Test (2 Minutes)

### 1. Start the Server
```bash
npm start
# Server starts on http://localhost:3000
```

### 2. Open in Browser
- Visit: http://localhost:3000
- You should see: OPC welcome page
- Bottom-right: Purple chat bubble with 💬 icon

### 3. Test Chat
- Click the bubble
- Click a quick action button (e.g., "What are OPC services?")
- Bot should respond with relevant OPC information
- Ask another question manually

**Expected Result**: Bot responds with helpful, relevant OPC information

---

## 🧪 Full Test Scenarios

### Test 1: Complaint Filing
**User**: "How do I file a complaint?"
**Expected**: Bot explains 8-step complaint process with details about documentation needed
**Result**: ✅ Pass / ❌ Fail

### Test 2: Office Hours
**User**: "What are your office hours?"
**Expected**: Bot provides hours, days, locations
**Result**: ✅ Pass / ❌ Fail

### Test 3: Services Info
**User**: "What services does OPC provide?"
**Expected**: Bot lists 10 main services with details
**Result**: ✅ Pass / ❌ Fail

### Test 4: Contact Info
**User**: "How do I contact OPC?"
**Expected**: Bot provides phone, email, website, address options
**Result**: ✅ Pass / ❌ Fail

### Test 5: Fees
**User**: "What are your fees?"
**Expected**: Bot explains free/subsidized services and fee structure
**Result**: ✅ Pass / ❌ Fail

### Test 6: Off-Topic
**User**: "Tell me about pizza"
**Expected**: Bot politely redirects to OPC services
**Result**: ✅ Pass / ❌ Fail

### Test 7: Multi-turn Conversation
**Turn 1**: "What is mediation?"
**Turn 2**: "How much does it cost?"
**Expected**: Bot maintains context and provides accurate linked responses
**Result**: ✅ Pass / ❌ Fail

---

## 🔧 API Testing

### Test Chat Endpoint
```bash
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "How do I file a complaint?",
    "history": []
  }'
```

**Expected Response**:
```json
{
  "reply": "Filing a complaint is simple..."
}
```

### Test Config Endpoint
```bash
curl http://localhost:3000/api/bot-config \
  -H "x-admin-password: YourSecurePassword123"
```

**Expected Response**:
- Personality info
- Quick actions array (8 items)
- Knowledge base (15+ topics)
- System prompt rules

---

## 📱 Frontend Testing

### UI Elements to Check
- [ ] Chat bubble appears bottom-right
- [ ] Click bubble opens chat window
- [ ] Header shows "OPC Assistant" and "Office of the Public Counsel"
- [ ] Welcome message displays
- [ ] Quick action buttons appear (6 buttons)
- [ ] Input field is functional
- [ ] Send button works
- [ ] Messages appear in correct order
- [ ] User messages are on right (dark blue)
- [ ] Bot messages are on left (light gray)
- [ ] Close button (×) works
- [ ] Reset button (🔄) clears chat
- [ ] Responsive on mobile (full screen)

### Color Scheme Check
- [ ] Navy background (#001f3f)
- [ ] Gold accents (#d4a574)
- [ ] Light gray background
- [ ] White messages

---

## 🚀 Configuration Testing

### Edit Bot Config
Edit `data/bot-config.json` and change:
```json
"greeting": "Welcome to OPC! 🎉"
```

- Stop server
- Start server
- Reload browser
- Check new greeting appears

**Result**: ✅ Pass / ❌ Fail

### Add Quick Action
Add to `quickActions` array:
```json
"What documents do I need?"
```

- Reload browser chat
- New button should appear
- Click it and verify response

**Result**: ✅ Pass / ❌ Fail

---

## 🔒 Security Testing

### Admin Password Protection
```bash
# Without password (should fail)
curl http://localhost:3000/api/bot-config
# Expected: 401 Unauthorized

# With wrong password (should fail)
curl http://localhost:3000/api/bot-config \
  -H "x-admin-password: wrong-password"
# Expected: 401 Unauthorized

# With correct password (should work)
curl http://localhost:3000/api/bot-config \
  -H "x-admin-password: YourSecurePassword123"
# Expected: Config JSON response
```

---

## 📊 Performance Testing

### Response Time
- Measure time from message sent to response received
- Expected: < 2 seconds
- Result: _____ seconds

### Concurrent Users
- Open multiple browser windows
- Send messages in all simultaneously
- All should work without errors
- Result: ✅ Pass / ❌ Fail

### Chat History
- Send 20+ messages
- Scroll through history
- All messages should be visible and correct
- Result: ✅ Pass / ❌ Fail

---

## 🐛 Issue Checklist

If tests fail, check:

| Issue | Solution |
|-------|----------|
| "Connection refused" | Verify server is running (`npm start`) |
| "Bot not responding" | Check GROQ_API_KEY in .env is valid |
| "Messages not appearing" | Check browser console for errors (F12) |
| "Wrong bot name" | Verify `data/bot-config.json` was updated |
| "Quick actions missing" | Check fetch in ChatWidget works |
| "Styling looks different" | Clear browser cache (Ctrl+Shift+Del) |
| "Mobile layout broken" | Check ChatWidget.module.css @media |
| "Chat history lost on refresh" | This is expected - history only in session |

---

## ✅ Final Verification Checklist

Before deployment, verify:

- [ ] npm install completes without errors
- [ ] npm start runs without errors
- [ ] Server accessible on http://localhost:3000
- [ ] Chat bubble appears and is clickable
- [ ] Quick actions load from config
- [ ] All 6 test scenarios pass
- [ ] API endpoints respond correctly
- [ ] Admin password protection works
- [ ] Mobile responsiveness works
- [ ] No console errors in browser

---

## 📤 Ready to Deploy?

If all checks pass ✅:

1. Set environment variables on production server
2. Upload all files (except node_modules)
3. Run `npm install` on server
4. Run `npm start` or use PM2
5. Test in production
6. Monitor logs for errors

---

**Test Status**: _______________  
**Date**: _______________  
**Tester**: _______________  

---
