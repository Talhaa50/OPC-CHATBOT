"use client";

import { useState, useEffect } from "react";
import styles from "./admin.module.css";

export default function BotAdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [config, setConfig] = useState(null);
  const [activeTab, setActiveTab] = useState("personality");
  const [saveStatus, setSaveStatus] = useState("");
  const [testMessages, setTestMessages] = useState([]);
  const [testInput, setTestInput] = useState("");
  const [isTestLoading, setIsTestLoading] = useState(false);

  // Login
  const handleLogin = async () => {
    try {
      const res = await fetch("/api/bot-config", {
        headers: { "x-admin-password": password },
      });
      if (res.ok) {
        const data = await res.json();
        setConfig(data);
        setIsAuthenticated(true);
        setTestMessages([
          { role: "assistant", content: data.personality.greeting },
        ]);
      } else {
        alert("Incorrect password");
      }
    } catch (error) {
      alert("Login failed");
    }
  };

  // Save config
  const saveConfig = async (newConfig) => {
    try {
      setSaveStatus("Saving...");
      const res = await fetch("/api/bot-config", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-password": password,
        },
        body: JSON.stringify(newConfig),
      });
      if (res.ok) {
        setConfig(newConfig);
        setSaveStatus("✓ Saved");
        setTimeout(() => setSaveStatus(""), 2000);
      }
    } catch (error) {
      setSaveStatus("✗ Error");
    }
  };

  // Update personality
  const updatePersonality = (field, value) => {
    const updated = {
      ...config,
      personality: { ...config.personality, [field]: value },
    };
    saveConfig(updated);
  };

  // Add knowledge
  const addKnowledge = () => {
    const newKnowledge = {
      id: `topic-${Date.now()}`,
      topic: "New Topic",
      content: "Add content here...",
    };
    const updated = {
      ...config,
      knowledge: [...config.knowledge, newKnowledge],
    };
    saveConfig(updated);
  };

  // Update knowledge
  const updateKnowledge = (id, field, value) => {
    const updated = {
      ...config,
      knowledge: config.knowledge.map((k) =>
        k.id === id ? { ...k, [field]: value } : k
      ),
    };
    saveConfig(updated);
  };

  // Delete knowledge
  const deleteKnowledge = (id) => {
    const updated = {
      ...config,
      knowledge: config.knowledge.filter((k) => k.id !== id),
    };
    saveConfig(updated);
  };

  // Add quick action
  const addQuickAction = () => {
    const updated = {
      ...config,
      quickActions: [...config.quickActions, "New quick action"],
    };
    saveConfig(updated);
  };

  // Update quick action
  const updateQuickAction = (index, value) => {
    const updated = {
      ...config,
      quickActions: config.quickActions.map((qa, i) =>
        i === index ? value : qa
      ),
    };
    saveConfig(updated);
  };

  // Delete quick action
  const deleteQuickAction = (index) => {
    const updated = {
      ...config,
      quickActions: config.quickActions.filter((_, i) => i !== index),
    };
    saveConfig(updated);
  };

  // Test bot
  const sendTestMessage = async () => {
    if (!testInput.trim()) return;

    const userMessage = { role: "user", content: testInput };
    setTestMessages((prev) => [...prev, userMessage]);
    setTestInput("");
    setIsTestLoading(true);

    try {
      const history = testMessages.map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: testInput, history }),
      });

      const data = await res.json();
      setTestMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch (error) {
      setTestMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Error: Could not reach bot" },
      ]);
    }
    setIsTestLoading(false);
  };

  // Reset test chat
  const resetTestChat = () => {
    setTestMessages([
      { role: "assistant", content: config.personality.greeting },
    ]);
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginBox}>
          <h1>🔐 Bot Admin Dashboard</h1>
          <p>Enter admin password to continue</p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleLogin()}
            placeholder="Admin password"
            className={styles.loginInput}
          />
          <button onClick={handleLogin} className={styles.loginButton}>
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>🤖 ChatBot Admin Dashboard</h1>
        <div className={styles.headerRight}>
          {saveStatus && <span className={styles.saveStatus}>{saveStatus}</span>}
          <button
            onClick={() => setIsAuthenticated(false)}
            className={styles.logoutButton}
          >
            Logout
          </button>
        </div>
      </header>

      <div className={styles.tabs}>
        <button
          className={activeTab === "personality" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("personality")}
        >
          Personality
        </button>
        <button
          className={activeTab === "knowledge" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("knowledge")}
        >
          Knowledge Base
        </button>
        <button
          className={activeTab === "quickActions" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("quickActions")}
        >
          Quick Actions
        </button>
        <button
          className={activeTab === "test" ? styles.tabActive : styles.tab}
          onClick={() => setActiveTab("test")}
        >
          Test Bot
        </button>
      </div>

      <div className={styles.content}>
        {activeTab === "personality" && (
          <div className={styles.section}>
            <h2>Bot Personality</h2>
            <div className={styles.field}>
              <label>Bot Name</label>
              <input
                type="text"
                value={config.personality.name}
                onChange={(e) => updatePersonality("name", e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>Role</label>
              <input
                type="text"
                value={config.personality.role}
                onChange={(e) => updatePersonality("role", e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>Tone</label>
              <input
                type="text"
                value={config.personality.tone}
                onChange={(e) => updatePersonality("tone", e.target.value)}
              />
            </div>
            <div className={styles.field}>
              <label>Greeting Message</label>
              <textarea
                value={config.personality.greeting}
                onChange={(e) => updatePersonality("greeting", e.target.value)}
                rows={3}
              />
            </div>
            <div className={styles.field}>
              <label>Fallback Message (when bot doesn't know)</label>
              <textarea
                value={config.personality.fallback}
                onChange={(e) => updatePersonality("fallback", e.target.value)}
                rows={2}
              />
            </div>
            <div className={styles.field}>
              <label>Off-Topic Message</label>
              <textarea
                value={config.personality.offTopic}
                onChange={(e) => updatePersonality("offTopic", e.target.value)}
                rows={2}
              />
            </div>
          </div>
        )}

        {activeTab === "knowledge" && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Knowledge Base</h2>
              <button onClick={addKnowledge} className={styles.addButton}>
                + Add Topic
              </button>
            </div>
            {config.knowledge.map((k) => (
              <div key={k.id} className={styles.knowledgeItem}>
                <div className={styles.field}>
                  <label>Topic Title</label>
                  <input
                    type="text"
                    value={k.topic}
                    onChange={(e) =>
                      updateKnowledge(k.id, "topic", e.target.value)
                    }
                  />
                </div>
                <div className={styles.field}>
                  <label>Content (use numbered steps)</label>
                  <textarea
                    value={k.content}
                    onChange={(e) =>
                      updateKnowledge(k.id, "content", e.target.value)
                    }
                    rows={6}
                  />
                </div>
                <button
                  onClick={() => deleteKnowledge(k.id)}
                  className={styles.deleteButton}
                >
                  Delete Topic
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "quickActions" && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Quick Action Buttons</h2>
              <button onClick={addQuickAction} className={styles.addButton}>
                + Add Button
              </button>
            </div>
            {config.quickActions.map((qa, index) => (
              <div key={index} className={styles.quickActionItem}>
                <input
                  type="text"
                  value={qa}
                  onChange={(e) => updateQuickAction(index, e.target.value)}
                  className={styles.quickActionInput}
                />
                <button
                  onClick={() => deleteQuickAction(index)}
                  className={styles.deleteButton}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "test" && (
          <div className={styles.section}>
            <div className={styles.sectionHeader}>
              <h2>Test Bot</h2>
              <button onClick={resetTestChat} className={styles.resetButton}>
                Reset Chat
              </button>
            </div>
            <div className={styles.testChat}>
              {testMessages.map((msg, i) => (
                <div
                  key={i}
                  className={
                    msg.role === "user" ? styles.userMessage : styles.botMessage
                  }
                >
                  {msg.content}
                </div>
              ))}
              {isTestLoading && (
                <div className={styles.botMessage}>Typing...</div>
              )}
            </div>
            <div className={styles.testInput}>
              <input
                type="text"
                value={testInput}
                onChange={(e) => setTestInput(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && sendTestMessage()}
                placeholder="Type a message..."
              />
              <button onClick={sendTestMessage} disabled={isTestLoading}>
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
