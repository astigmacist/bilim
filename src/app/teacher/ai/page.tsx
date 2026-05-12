"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Paperclip, Bot, User, Loader2 } from "lucide-react";

export default function AdminAIPage() {
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string }[]>([
    { role: "assistant", content: "Сәлеметсіз бе! Мен BilimQuest жүйесіндегі сіздің AI көмекшіңізбін. Жаңа сабақ құруға, тест сұрақтарын ойлап табуға немесе оқушылардың нәтижелерін талдауға көмектесе аламын. Маған файл жүктеп немесе сұрақ қойсаңыз болады." }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() && !isLoading) return;

    const newMessages = [...messages, { role: "user" as const, content: input }];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages })
      });

      const data = await response.json();
      
      if (response.ok) {
        setMessages(prev => [...prev, { role: "assistant", content: data.text }]);
      } else {
        setMessages(prev => [...prev, { role: "assistant", content: `Қате шықты: ${data.error}` }]);
      }
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Кешіріңіз, желілік қате пайда болды. Қайта көріңіз." }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 128px)", backgroundColor: "white", borderRadius: "16px", boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1)", overflow: "hidden" }}>
      
      {/* Header */}
      <div style={{ padding: "16px 24px", borderBottom: "1px solid #e2e8f0", backgroundColor: "#f8fafc", display: "flex", alignItems: "center", gap: "12px" }}>
        <div style={{ width: "40px", height: "40px", borderRadius: "50%", background: "linear-gradient(135deg, #4f7cf8, #a855f7)", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
          <Bot size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: "bold", color: "#0f172a", margin: 0 }}>AI Көмекші (Мұғалімдер үшін)</h2>
          <p style={{ fontSize: "12px", color: "#64748b", margin: 0 }}>BilimQuest AI негізінде</p>
        </div>
      </div>

      {/* Chat Messages */}
      <div style={{ flex: 1, padding: "24px", overflowY: "auto", display: "flex", flexDirection: "column", gap: "24px", backgroundColor: "#fcfcfd" }}>
        {messages.map((msg, idx) => (
          <div key={idx} style={{ display: "flex", gap: "16px", maxWidth: "85%", alignSelf: msg.role === "user" ? "flex-end" : "flex-start", flexDirection: msg.role === "user" ? "row-reverse" : "row" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: msg.role === "user" ? "#e2e8f0" : "#3b82f6", color: msg.role === "user" ? "#0f172a" : "white", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {msg.role === "user" ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div style={{ backgroundColor: msg.role === "user" ? "#3b82f6" : "white", color: msg.role === "user" ? "white" : "#1e293b", padding: "16px", borderRadius: "16px", borderTopRightRadius: msg.role === "user" ? "4px" : "16px", borderTopLeftRadius: msg.role === "assistant" ? "4px" : "16px", boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)", border: msg.role === "assistant" ? "1px solid #e2e8f0" : "none", fontSize: "15px", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
              {msg.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div style={{ display: "flex", gap: "16px", maxWidth: "80%" }}>
            <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#3b82f6", color: "white", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Bot size={20} />
            </div>
            <div style={{ padding: "16px", backgroundColor: "white", borderRadius: "16px", borderTopLeftRadius: "4px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "8px", color: "#64748b" }}>
              <Loader2 size={16} className="animate-spin" /> Ойлануда...
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div style={{ padding: "20px", borderTop: "1px solid #e2e8f0", backgroundColor: "white" }}>
        <div style={{ display: "flex", alignItems: "flex-end", gap: "12px", backgroundColor: "#f8fafc", padding: "8px 12px", borderRadius: "16px", border: "1px solid #cbd5e1" }}>
          <button style={{ padding: "10px", background: "none", border: "none", cursor: "pointer", color: "#64748b", borderRadius: "50%" }}>
            <Paperclip size={20} />
          </button>
          <textarea 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Сабақ жоспарын сұраңыз немесе материал жіберіңіз..."
            style={{ flex: 1, border: "none", background: "transparent", outline: "none", fontSize: "15px", padding: "10px 0", resize: "none", maxHeight: "150px", minHeight: "44px", color: "#0f172a", fontFamily: "inherit" }}
            rows={1}
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            style={{ padding: "10px", backgroundColor: input.trim() && !isLoading ? "#3b82f6" : "#cbd5e1", border: "none", cursor: input.trim() && !isLoading ? "pointer" : "not-allowed", color: "white", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 0.2s" }}
          >
            <Send size={18} />
          </button>
        </div>
        <div style={{ textAlign: "center", marginTop: "12px", fontSize: "12px", color: "#94a3b8" }}>
          AI қателесуі мүмкін. Маңызды мәліметтерді тексеріп алыңыз.
        </div>
      </div>
    </div>
  );
}
