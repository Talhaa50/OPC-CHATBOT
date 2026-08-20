#!/usr/bin/env node

/**
 * OPC Chatbot Deployment Checker
 * Run this script to verify your deployment configuration
 */

const https = require('https');

const CHATBOT_URL = 'https://opc-chatbot.vercel.app';
const CHECKS = [];

console.log('🔍 OPC Chatbot Deployment Checker\n');
console.log('━'.repeat(50));

// Check 1: Verify chatbot URL is accessible
async function checkURL() {
  return new Promise((resolve) => {
    console.log('\n✓ Checking chatbot URL accessibility...');
    https.get(CHATBOT_URL, (res) => {
      if (res.statusCode === 200) {
        console.log('  ✅ Chatbot URL is accessible');
        console.log(`  Status: ${res.statusCode}`);
        resolve(true);
      } else {
        console.log(`  ❌ Unexpected status: ${res.statusCode}`);
        resolve(false);
      }
    }).on('error', (err) => {
      console.log('  ❌ Cannot reach chatbot URL');
      console.log(`  Error: ${err.message}`);
      resolve(false);
    });
  });
}

// Check 2: Test chat API endpoint
async function checkChatAPI() {
  return new Promise((resolve) => {
    console.log('\n✓ Testing chat API endpoint...');
    
    const postData = JSON.stringify({
      message: 'Test message',
      history: []
    });

    const options = {
      hostname: 'opc-chatbot.vercel.app',
      path: '/api/chat',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': postData.length
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const response = JSON.parse(data);
            if (response.reply) {
              console.log('  ✅ Chat API is working');
              console.log(`  Sample response: "${response.reply.substring(0, 50)}..."`);
              resolve(true);
            } else {
              console.log('  ❌ Invalid API response format');
              resolve(false);
            }
          } catch (e) {
            console.log('  ❌ Failed to parse API response');
            console.log(`  Response: ${data}`);
            resolve(false);
          }
        } else if (res.statusCode === 500) {
          console.log('  ❌ Chat API returned 500 error');
          console.log('  💡 This usually means GROQ_API_KEY is missing or invalid');
          console.log(`  Response: ${data}`);
          resolve(false);
        } else {
          console.log(`  ❌ Unexpected status: ${res.statusCode}`);
          console.log(`  Response: ${data}`);
          resolve(false);
        }
      });
    });

    req.on('error', (err) => {
      console.log('  ❌ Cannot reach chat API');
      console.log(`  Error: ${err.message}`);
      resolve(false);
    });

    req.write(postData);
    req.end();
  });
}

// Check 3: Environment variable hints
function checkEnvVars() {
  console.log('\n✓ Environment Variables Check...');
  console.log('  Required variables in Vercel:');
  console.log('  1. GROQ_API_KEY - Your Groq AI API key');
  console.log('  2. ADMIN_PASSWORD - Admin access password');
  console.log('\n  💡 To add these:');
  console.log('     1. Go to Vercel Dashboard');
  console.log('     2. Select your OPC-CHATBOT project');
  console.log('     3. Settings → Environment Variables');
  console.log('     4. Add both variables');
  console.log('     5. Redeploy the application');
}

// Run all checks
async function runChecks() {
  const urlOk = await checkURL();
  const apiOk = await checkChatAPI();
  checkEnvVars();

  console.log('\n' + '━'.repeat(50));
  console.log('\n📊 Summary:\n');
  console.log(`  Chatbot URL:    ${urlOk ? '✅ OK' : '❌ FAIL'}`);
  console.log(`  Chat API:       ${apiOk ? '✅ OK' : '❌ FAIL'}`);
  
  if (!apiOk) {
    console.log('\n⚠️  Action Required:');
    console.log('  The chat API is not working. This usually means:');
    console.log('  • GROQ_API_KEY environment variable is missing');
    console.log('  • GROQ_API_KEY is invalid');
    console.log('  • GROQ API service is down');
    console.log('\n  Follow the CHATBOT-FIX-GUIDE.md to resolve this.');
  } else {
    console.log('\n🎉 Everything looks good!');
  }

  console.log('\n' + '━'.repeat(50) + '\n');
}

// Execute
runChecks().catch(console.error);
