"use client";
import { useState, useRef, useEffect } from "react";
import styles from "./ChatWidget.module.css";

const BOT_NAME = "OPC Assistant";
const BOT_SUBTITLE = "Office of the Public Counsel";

export default function ChatWidget({ autoOpen = false }) {
  const [isOpen, setIsOpen] = useState(autoOpen);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `👋 Welcome to OPC Support! I'm here to help with complaints, services, documentation, fees, contact info, and general guidance. What can I help you with?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(true);
  const [quickActions, setQuickActions] = useState([]);
  const bottomRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch quick actions from config
  useEffect(() => {
    const fetchQuickActions = async () => {
      try {
        const res = await fetch("/api/bot-config", {
          headers: { "x-admin-password": "public" },
        });
        if (res.ok) {
          const config = await res.json();
          setQuickActions(config.quickActions?.slice(0, 6) || []);
        }
      } catch (e) {
        console.log("Could not fetch quick actions");
        setQuickActions([
          "What are OPC services?",
          "How do I file a complaint?",
          "What are your office hours?",
          "How do I contact OPC?",
        ]);
      }
    };
    fetchQuickActions();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const sendMessage = async (text) => {
    const userMessage = text || input.trim();
    if (!userMessage || isLoading) return;

    setInput("");
    setShowQuickActions(false);
    setIsLoading(true);

    const newMessages = [...messages, { role: "user", content: userMessage }];
    setMessages(newMessages);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMessage,
          history: newMessages.slice(1).map((m) => ({
            role: m.role,
            content: m.content,
          })),
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I couldn't connect. Please contact OPC directly.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const resetChat = () => {
    setMessages([
      {
        role: "assistant",
        content: `👋 Welcome to OPC Support! I'm here to help with complaints, services, documentation, fees, contact info, and general guidance. What can I help you with?`,
      },
    ]);
    setShowQuickActions(true);
    setInput("");
  };

  return (
    <>
    
      {/* Floating Bubble - hidden because OPC site has its own button */}
<button
  className={styles.bubble}
  onClick={() => setIsOpen((prev) => !prev)}
  aria-label="Open support chat"
  style={{ display: 'none' }}
>

      {/* Chat Window */}
      {isOpen && (
        <div className={styles.window}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerInfo}>
              <div className={styles.avatar}>💬</div>
              <div>
                <div className={styles.botName}>{BOT_NAME}</div>
                <div className={styles.botStatus}>
                  <span className={styles.dot} /> {BOT_SUBTITLE}
                </div>
              </div>
            </div>
            <button className={styles.resetBtn} onClick={resetChat} title="Restart chat">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 12a9 9 0 109-9 9 9 0 00-9 9" />
                <path d="M3 3v5h5" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className={styles.messages}>
            {messages.map((msg, i) => (
              <div key={i} className={`${styles.message} ${styles[msg.role]}`}>
                <div className={styles.bubble2}>
                  {msg.content.split("\n").map((line, j) => (
                    <span key={j}>
                      {line}
                      {j < msg.content.split("\n").length - 1 && <br />}
                    </span>
                  ))}
                </div>
              </div>
            ))}

            {/* Quick Actions */}
            {showQuickActions && quickActions.length > 0 && (
              <div className={styles.quickActions}>
                {quickActions.map((action, i) => (
                  <button
                    key={i}
                    className={styles.quickBtn}
                    onClick={() => sendMessage(action)}
                  >
                    {action}
                  </button>
                ))}
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div className={`${styles.message} ${styles.assistant}`}>
                <div className={styles.bubble2}>
                  <span className={styles.typing}>
                    <span /><span /><span />
                  </span>
                </div>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className={styles.inputArea}>
            <input
              ref={inputRef}
              className={styles.input}
              placeholder="Ask about OPC services..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isLoading}
            />
            <button
              className={styles.sendBtn}
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2L15 22l-4-9-9-4 20-7z" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </>
  );
}
