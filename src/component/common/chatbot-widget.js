"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { MessageCircle, X, Send, Loader2 } from "lucide-react";
import { chatbotApi } from "../../services/chatbot-api";
// === MAP AI LINKS → FE SPA LINKS ===
const productLinkMap = {
    "https://example.com/Uniqlo-AIRism-Oversized-Crew-Neck-T-Shirt": "/#/products/product/1",
    "https://example.com/Another-Product": "/#/products/product/2",
    // Add more mappings here
};
export default function ChatbotWidget({ role = "guest" }) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hello! How can I help you today?" },
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    // === HÀM XỬ LÝ TEXT THÀNH LINK + MAP INTERNAL/EXTERNAL ===
    const renderMessage = (text) => {
        const regex = /\[([^\]]+)\]\(([^)]+)\)|(https?:\/\/[^\s]+)/g;
        const parts = [];
        let lastIndex = 0;
        let match;
        while ((match = regex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                parts.push(text.substring(lastIndex, match.index));
            }
            let linkText, linkUrl;
            if (match[3]) {
                // Raw URL
                linkText = match[3];
                linkUrl = match[3];
            }
            else {
                // Markdown [text](url)
                linkText = match[1];
                linkUrl = match[2];
            }
            // Map AI link → FE SPA link
            const correctedUrl = productLinkMap[linkUrl] || linkUrl;
            // Internal if path starts with /, #, or is our FE domain
            const isInternal = correctedUrl.startsWith("/") ||
                correctedUrl.startsWith("#") ||
                correctedUrl.includes("swd392-group3-fe.onrender.com");
            parts.push(_jsx("a", { href: correctedUrl, target: isInternal ? "_self" : "_blank", rel: isInternal ? "" : "noopener noreferrer", className: "text-blue-600 underline hover:text-blue-800 font-semibold transition-colors dark:text-blue-400", children: linkText }, match.index));
            lastIndex = regex.lastIndex;
        }
        if (lastIndex < text.length) {
            parts.push(text.substring(lastIndex));
        }
        return parts.length > 0 ? parts : text;
    };
    const handleSend = async () => {
        if (!input.trim() || isLoading)
            return;
        const userMessage = { role: "user", content: input };
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
        }
        catch (error) {
            setMessages([
                ...newMessages,
                {
                    role: "assistant",
                    content: "Sorry, I'm having trouble connecting. Please try again later.",
                },
            ]);
        }
        finally {
            setIsLoading(false);
        }
    };
    const handleKeyPress = (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };
    return (_jsxs("div", { className: "fixed bottom-6 right-6 z-50", children: [!isOpen && (_jsx("button", { onClick: () => setIsOpen(true), className: "w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center", children: _jsx(MessageCircle, { className: "w-6 h-6" }) })), isOpen && (_jsxs("div", { className: "w-80 md:w-96 h-[500px] bg-card border border-border rounded-lg shadow-xl flex flex-col", children: [_jsxs("div", { className: "flex items-center justify-between px-4 py-3 border-b border-border", children: [_jsxs("div", { className: "flex items-center gap-2", children: [_jsx("div", { className: "w-8 h-8 bg-primary rounded-full flex items-center justify-center", children: _jsx(MessageCircle, { className: "w-4 h-4 text-primary-foreground" }) }), _jsxs("div", { children: [_jsx("p", { className: "font-semibold text-sm", children: "Style Assistant" }), _jsx("p", { className: "text-xs text-muted-foreground", children: "Always here to help" })] })] }), _jsx("button", { onClick: () => setIsOpen(false), className: "p-1 hover:bg-secondary rounded transition-colors", children: _jsx(X, { className: "w-5 h-5" }) })] }), _jsxs("div", { className: "flex-1 overflow-y-auto p-4 space-y-4", children: [messages.map((msg, idx) => (_jsx("div", { className: `flex ${msg.role === "user" ? "justify-end" : "justify-start"}`, children: _jsx("div", { className: `max-w-[80%] px-4 py-2 rounded-lg ${msg.role === "user"
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-secondary text-foreground"}`, children: _jsx("p", { className: "text-sm whitespace-pre-wrap leading-relaxed", children: renderMessage(msg.content) }) }) }, idx))), isLoading && (_jsx("div", { className: "flex justify-start", children: _jsx("div", { className: "bg-secondary px-4 py-2 rounded-lg", children: _jsx(Loader2, { className: "w-4 h-4 animate-spin" }) }) }))] }), _jsx("div", { className: "p-4 border-t border-border", children: _jsxs("div", { className: "flex items-center gap-2", children: [_jsx("input", { type: "text", value: input, onChange: (e) => setInput(e.target.value), onKeyPress: handleKeyPress, placeholder: "Type your message...", className: "flex-1 px-3 py-2 border border-border rounded-lg bg-background text-sm focus:outline-none focus:ring-2 focus:ring-accent" }), _jsx("button", { onClick: handleSend, disabled: !input.trim() || isLoading, className: "p-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50", children: _jsx(Send, { className: "w-4 h-4" }) })] }) })] }))] }));
}
