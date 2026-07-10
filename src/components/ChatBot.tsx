"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, Send, Sparkles, ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useChat } from "@ai-sdk/react";

// ──────────────────────────────────────────────────
// SNAPCHAT-STYLE BITMOJI AVATAR (Peeks from behind input)
// Uses actual generated Bitmoji-style images instead of raw SVG
// ──────────────────────────────────────────────────
const BitmojiAvatar = ({ 
  state = "idle" 
}: { 
  state?: "idle" | "typing" | "thinking" | "waving" 
}) => {
  const isTyping = state === "typing";

  return (
    <div className="relative w-full h-full flex items-end">
      {/* Idle state avatar */}
      <motion.div
        className="absolute bottom-0 w-full"
        animate={{ opacity: isTyping ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={{ y: [0, -3, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
          <Image
            src="/avatars/bitmoji-idle-v3.png"
            alt="Zoro's Bitmoji"
            width={200}
            height={280}
            className="w-full h-auto object-bottom object-contain drop-shadow-lg origin-bottom"
            priority
          />
        </motion.div>
      </motion.div>

      {/* Typing state avatar (on laptop) */}
      <motion.div
        className="absolute bottom-0 w-full"
        animate={{ opacity: isTyping ? 1 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          animate={isTyping ? { y: [0, 2, 0] } : {}}
          transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
        >
          <Image
            src="/avatars/bitmoji-typing-v3.png"
            alt="Zoro typing"
            width={200}
            height={280}
            className="w-full h-auto object-bottom object-contain drop-shadow-lg origin-bottom"
            priority
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

// ──────────────────────────────────────────────────
// SMALL AVATAR FOR MESSAGE BUBBLES (circle version)
// ──────────────────────────────────────────────────
const SmallAvatar = () => (
  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center overflow-hidden shrink-0 border border-white/20">
    <Image
      src="/avatars/bitmoji-face-v3.png"
      alt="Zoro"
      width={40}
      height={40}
      className="w-full h-full object-cover scale-[1.1]"
    />
  </div>
);

// ──────────────────────────────────────────────────
// HEADER AVATAR (Slightly larger for the header bar)
// ──────────────────────────────────────────────────
const HeaderAvatar = () => (
  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-neon-blue to-neon-purple flex items-center justify-center overflow-hidden shrink-0 border-2 border-white/30 shadow-lg">
    <Image
      src="/avatars/bitmoji-face-v3.png"
      alt="Hassaan"
      width={48}
      height={48}
      className="w-full h-full object-cover scale-[1.1]"
    />
  </div>
);

// ──────────────────────────────────────────────────
// MESSAGE FORMATTER (Parses bold and newlines)
// ──────────────────────────────────────────────────
const formatMessage = (text: string) => {
  if (!text) return null;
  // Split by newlines to respect paragraphs and lists
  return text.split('\n').map((line, i) => {
    // If it's an empty line, just return a br to preserve spacing
    if (line.trim() === '') return <div key={i} className="h-2" />;
    
    // Parse **bold** text
    const parts = line.split(/(\*\*.*?\*\*)/g);
    return (
      <div key={i} className="min-h-[1.25rem]">
        {parts.map((part, j) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return <strong key={j} className="font-semibold text-inherit opacity-95">{part.slice(2, -2)}</strong>;
          }
          return <span key={j}>{part}</span>;
        })}
      </div>
    );
  });
};

// ──────────────────────────────────────────────────
// CHATBOT COMPONENT
// ──────────────────────────────────────────────────
const initialMessages = [
  { id: "1", role: "assistant" as const, content: "Hey! 👋 I'm Zoro, Hassaan's personal assistant." },
  { id: "2", role: "assistant" as const, content: "Ask me about his projects, skills, or experience. What would you like to know?" }
];

const quickReplies = ["🚀 Projects", "💻 Skills", "📩 Hire Hassaan", "🎓 Education"];

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  
  const { messages, status, sendMessage, error } = useChat({
    api: "/api/chat",
    messages: initialMessages as any,
  } as any);

  const isLoading = status === "submitted" || status === "streaming";

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();

  // Hide on admin routes
  if (pathname?.startsWith("/admin")) return null;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView();
  };

  useEffect(() => {
    if (isOpen) setTimeout(scrollToBottom, 150);
  }, [isOpen, messages, isLoading]);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  const handleQuickReply = (text: string) => {
    sendMessage({ role: "user", content: text } as any);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    sendMessage({ role: "user", content: input } as any);
    setInput("");
  };

  const avatarState = isLoading ? "typing" : "idle";
  const showPeekingAvatar = isOpen && (isLoading || messages[messages.length - 1]?.role === "assistant");

  return (
    <>
      {/* ═══ FLOATING CHAT BUTTON ═══ */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-6 right-6 z-50 p-4 rounded-full bg-gradient-to-r from-neon-blue to-neon-purple text-white shadow-[0_0_25px_rgba(139,92,246,0.5)] cursor-pointer"
            aria-label="Open chat"
          >
            <MessageCircle className="w-7 h-7" />
            {/* Notification ping */}
            <span className="absolute -top-1 -right-1 flex h-4 w-4">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500 border-2 border-[var(--bg-color)]" />
            </span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* ═══ CHAT WINDOW ═══ */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="fixed bottom-4 right-4 z-50 w-[370px] sm:w-[400px] max-w-[calc(100vw-2rem)] h-[580px] max-h-[calc(100vh-2rem)] rounded-3xl flex flex-col overflow-hidden border border-[var(--glass-border-color)] shadow-2xl sm:shadow-[0_20px_60px_rgba(0,0,0,0.4)] bg-[var(--surface-color)] sm:bg-[var(--surface-color)]/90 backdrop-blur-none sm:backdrop-blur-md"
            style={{ 
              willChange: "transform, opacity" 
            }}
          >
            {/* ─── HEADER ─── */}
            <div className="relative bg-gradient-to-r from-neon-purple via-neon-blue to-neon-purple sm:animate-[gradientShift_4s_ease_infinite] sm:bg-[length:200%_100%] p-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <HeaderAvatar />
                <div>
                  <h3 className="font-bold text-white text-sm leading-tight flex items-center gap-1.5">
                    Zoro <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
                  </h3>
                  <p className="text-white/60 text-[11px] mt-0.5">
                    {isLoading ? "Typing..." : "Online • Replies instantly"}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/70 hover:text-white hover:bg-white/20 p-2 rounded-full transition-all"
                aria-label="Close chat"
              >
                <ChevronDown className="w-5 h-5" />
              </button>
            </div>

            {/* ─── MESSAGES AREA ─── */}
            <div 
              data-lenis-prevent="true"
              className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-3 custom-scrollbar" 
              style={{ background: "var(--bg-color)", WebkitOverflowScrolling: "touch" }}
            >
              {messages.map((msg: any, idx: number) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 12, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, delay: idx === messages.length - 1 ? 0.1 : 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} items-end gap-2`}
                >
                  {msg.role === "assistant" && <SmallAvatar />}
                  
                  <div 
                    className={`max-w-[85%] px-4 py-2.5 text-[13px] leading-relaxed ${
                      msg.role === "user" 
                        ? "bg-gradient-to-br from-neon-purple to-neon-blue text-white rounded-2xl rounded-br-md" 
                        : "bg-[var(--surface-color)] border border-[var(--glass-border-color)] text-[var(--fg-color)] rounded-2xl rounded-bl-md shadow-sm"
                    }`}
                  >
                    {formatMessage(msg.content || (msg.parts ? msg.parts.filter((p: any) => p.type === 'text').map((p: any) => p.text).join("") : ""))}
                  </div>
                </motion.div>
              ))}

              {/* Typing indicator */}
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-start items-end gap-2"
                >
                  <SmallAvatar />
                  <div className="bg-[var(--surface-color)] border border-[var(--glass-border-color)] px-4 py-3 rounded-2xl rounded-bl-md flex gap-1.5 items-center h-9">
                    <div className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-bounce [animation-delay:-0.3s]" />
                    <div className="w-1.5 h-1.5 bg-neon-blue rounded-full animate-bounce [animation-delay:-0.15s]" />
                    <div className="w-1.5 h-1.5 bg-neon-purple rounded-full animate-bounce" />
                  </div>
                </motion.div>
              )}

              {/* Error state */}
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex justify-center my-2"
                >
                  <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-[11px] px-3 py-2 rounded-lg max-w-[85%] text-center shadow-sm">
                    {error.message?.includes("API key") 
                      ? "⚠️ Missing Google Gemini API Key! Please add it to your .env.local file to chat." 
                      : `⚠️ ${error.message || "Failed to connect to AI server."}`}
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} className="pb-10" />
            </div>

            {/* ─── QUICK REPLIES ─── */}
            <AnimatePresence>
              {!isLoading && messages[messages.length - 1]?.role === "assistant" && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden border-t border-[var(--glass-border-color)]"
                  style={{ background: "var(--bg-color)" }}
                >
                  <div className="px-3 py-2 flex overflow-x-auto gap-2" style={{ scrollbarWidth: "none" }}>
                    {quickReplies.map((reply, i) => (
                      <motion.button
                        key={reply}
                        initial={{ opacity: 0, scale: 0.8, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ delay: i * 0.08, type: "spring", stiffness: 400 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.92 }}
                        onClick={() => handleQuickReply(reply)}
                        className="shrink-0 bg-[var(--surface-color)] border border-[var(--glass-border-color)] hover:border-neon-purple/50 text-[var(--fg-color)] text-xs font-medium px-3 py-1.5 rounded-full transition-colors whitespace-nowrap"
                      >
                        {reply}
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ─── INPUT AREA WITH PEEKING BITMOJI ─── */}
            <div className="shrink-0 border-t border-[var(--glass-border-color)] mt-auto" style={{ background: "var(--surface-color)" }}>
              <div className="p-3">
                <div className="relative z-20">
                  {/* Peeking Bitmoji — rises from behind the input */}
                  <AnimatePresence>
                    {showPeekingAvatar && (
                      <motion.div
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        transition={{ type: "spring", damping: 15, stiffness: 200 }}
                        className="absolute bottom-full left-5 w-24 h-24 pointer-events-none z-10 flex items-end overflow-visible origin-bottom"
                      >
                        <BitmojiAvatar state={avatarState} />
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  <form 
                  onSubmit={handleSubmit}
                  className="flex items-center gap-2 bg-[var(--bg-color)] border border-[var(--glass-border-color)] rounded-full pl-4 pr-1.5 py-1.5 focus-within:border-neon-purple/60 focus-within:shadow-[0_0_0_3px_rgba(139,92,246,0.15)] transition-all"
                >
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask anything..."
                    className="flex-1 bg-transparent text-[var(--fg-color)] text-sm focus:outline-none placeholder:text-[var(--fg-color)]/30"
                  />
                  <button
                    type="submit"
                    disabled={!input.trim() || isLoading}
                    className="bg-gradient-to-r from-neon-blue to-neon-purple text-white p-2.5 rounded-full disabled:opacity-30 disabled:grayscale transition-all hover:shadow-[0_0_15px_rgba(139,92,246,0.4)]"
                    aria-label="Send message"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
