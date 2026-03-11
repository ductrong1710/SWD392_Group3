"use client";

import { useState } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { chatbotApi } from "../../services/chatbot-api";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface ChatbotWidgetProps {
  role?: string;
}

export default function ChatbotWidget({ role = "guest" }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Hello! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // === HÀM XỬ LÝ TEXT THÀNH LINK (NEW) ===
  const renderMessage = (text: string) => {
    // Regex bắt 2 trường hợp: 
    // 1. Markdown link: [Tên sản phẩm](/link) 
    // 2. Raw URL: https://google.com
    const regex = /\[([^\]]+)\]\(([^)]+)\)|(https?:\/\/[^\s]+)/g;
    const parts = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(text)) !== null) {
      // Đẩy phần chữ bình thường (trước link) vào mảng
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }

      if (match[3]) {
        // Xử lý khi AI trả về Link thô (Raw URL)
        parts.push(
          <a
            key={match.index}
            href={match[3]}
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-300 underline hover:text-indigo-400 font-medium transition-colors"
          >
            {match[3]}
          </a>
        );
      } else {
        // Xử lý khi AI trả về Link Markdown: [Tên hiển thị](URL)
        const linkText = match[1];
        const linkUrl = match[2];
        
        parts.push(
          <a
            key={match.index}
            href={linkUrl}
            // Nếu link bắt đầu bằng http thì mở tab mới, nếu link nội bộ (VD: /products/1) thì mở tab hiện tại
            target={linkUrl.startsWith("http") ? "_blank" : "_self"}
            rel={linkUrl.startsWith("http") ? "noopener noreferrer" : ""}
            className="text-blue-600 underline hover:text-blue-800 font-semibold transition-colors dark:text-blue-400"
          >
            {linkText}
          </a>
        );
      }
      lastIndex = regex.lastIndex;
    }

    // Đẩy phần chữ còn lại (sau link cuối) vào mảng
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    // Nếu không có link nào thì trả về text gốc, có thì trả về mảng React Node
    return parts.length > 0 ? parts : text;
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const response = await chatbotApi.query({
        message: input,
        history: messages,
      });

      setMessages([
        ...newMessages,
        { role: "assistant", content: response.botMessage },
      ]);
    } catch (error) {
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting. Please try again later.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center"
        >
          <MessageCircle className="w-6 h-6" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-80 md:w-96 h-[500px] bg-card border border-border rounded-lg shadow-xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <MessageCircle className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <p className="font-semibold text-sm">Style Assistant</p>
                <p className="text-xs text-muted-foreground">Always here to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 hover:bg-secondary rounded transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-[80%] px-4 py-2 rounded-lg ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-secondary text-foreground"
                  }`}
                >
                  {/* SỬ DỤNG renderMessage(msg.content) Ở ĐÂY */}
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {renderMessage(msg.content)}
                  </p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-secondary px-4 py-2 rounded-lg">
                  <Loader2 className="w-4 h-4 animate-spin" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}