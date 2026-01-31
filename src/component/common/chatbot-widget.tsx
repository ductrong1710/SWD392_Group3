"use client"

import { useState } from "react"
import { X, MessageCircle } from "lucide-react"

interface ChatbotWidgetProps {
  role?: "guest" | "user" | "admin"
  onLoginClick?: () => void
}

export default function ChatbotWidget({ role = "guest", onLoginClick }: ChatbotWidgetProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Array<{ type: "user" | "bot"; text: string }>>([
    {
      type: "bot",
      text:
        role === "guest"
          ? "Hi! Welcome to STYLE. How can I help you find the perfect outfit?"
          : role === "admin"
            ? "Hello Admin! Ready to review today's business metrics and operations?"
            : "Welcome back! What can I help you with today?",
    },
  ])
  const [inputValue, setInputValue] = useState("")

  const getQuickReplies = () => {
    if (role === "admin") {
      return ["Show today's orders", "Low stock products", "Top selling items", "Customer feedback", "Revenue summary"]
    } else if (role === "guest") {
      return ["Find women clothes", "Show me best sellers", "Size guide", "Login to shop"]
    } else {
      return ["Track my order", "Size recommendation", "View recommendations", "Help with checkout"]
    }
  }

  const handleQuickReply = (reply: string) => {
    setMessages([...messages, { type: "user", text: reply }])

    let botResponse = ""

    if (role === "admin") {
      if (reply.includes("today's orders")) {
        botResponse =
          "📊 Today's Orders Summary:\n• Pending: 3 orders\n• Shipping: 5 orders\n• Completed: 8 orders\n• Cancelled: 1 order\n\nTotal Revenue Today: $2,847.50"
      } else if (reply.includes("Low stock")) {
        botResponse =
          "⚠️ Low Stock Alert:\n• Classic Oxford Shirt: 8 units\n• Premium Denim Jeans: 5 units\n• Cotton T-Shirt: 2 units\n\nRecommend reordering ASAP!"
      } else if (reply.includes("Top selling")) {
        botResponse =
          "🏆 Top 3 Best Sellers:\n1. Elegant Summer Dress - 156 sales\n2. Premium Denim Jeans - 189 sales\n3. Classic Oxford Shirt - 234 sales\n\nTotal Revenue: $78,435"
      } else if (reply.includes("Customer feedback")) {
        botResponse =
          "💬 Recent Feedback Analysis:\n• 5-star reviews: 65\n• 4-star reviews: 32\n• 3-star reviews: 8\n• Negative feedback: 3 (flagged for review)\n\nAvg Rating: 4.7 ★"
      } else if (reply.includes("Revenue")) {
        botResponse =
          "💰 Revenue Summary:\n• This Month: $45,230\n• Last Month: $38,950\n• Growth: +16%\n• Projected End of Month: $62,150"
      } else {
        botResponse = "I can help with analytics! Use the quick replies to view key business metrics."
      }
    } else if (role === "guest") {
      if (reply.includes("Find women")) {
        botResponse =
          "Great! Our women's collection features elegant dresses, blouses, and more. Please log in to shop!"
        setTimeout(() => onLoginClick?.(), 500)
      } else if (reply.includes("best sellers")) {
        botResponse =
          "Our bestsellers right now are:\n• Elegant Summer Dress (★4.9)\n• Premium Denim Jeans (★4.6)\n• Classic Oxford Shirt (★4.8)\n\nLog in to add to cart!"
      } else if (reply.includes("Size")) {
        botResponse =
          "📏 Quick Sizing Guide:\nWomen: XS-XL\nMen: XS-XXL\nAccessories: One Size\n\nNeed detailed recommendations? Log in and I can help based on your history!"
      } else if (reply.includes("Login")) {
        botResponse = "Ready to start shopping? Click the Login button to access your account!"
        setTimeout(() => onLoginClick?.(), 500)
      } else {
        botResponse = "Feel free to ask me anything about our products, sizing, or policies!"
      }
    } else {
      if (reply.includes("Track")) {
        botResponse = "📦 Go to the Orders section to track your purchases in real-time with delivery updates!"
      } else if (reply.includes("Size")) {
        botResponse =
          "👕 Based on your purchase history, I recommend size M for this item. Would you like personalized recommendations?"
      } else if (reply.includes("recommendations")) {
        botResponse =
          "✨ Based on your browsing, we think you'd love:\n• Wool Blazer (★4.7)\n• Designer Handbag (★4.9)\n• Premium Leather Belt (★4.8)\n\nCheck them out!"
      } else if (reply.includes("checkout")) {
        botResponse =
          "🛒 Checkout Steps:\n1. Review your cart\n2. Enter shipping address (Vietnam)\n3. Select payment method (VNPay, MoMo, COD)\n4. Confirm order\n\nReady?"
      } else {
        botResponse = "Happy to help! Use quick replies or ask me anything about your shopping experience."
      }
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { type: "bot", text: botResponse }])
    }, 300)
  }

  const handleSend = () => {
    if (!inputValue.trim()) return

    setMessages([...messages, { type: "user", text: inputValue }])
    setInputValue("")

    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { type: "bot", text: "Thanks for your message! Use the quick replies below or I'll do my best to help." },
      ])
    }, 300)
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-accent hover:bg-accent/90 text-accent-foreground rounded-full shadow-lg flex items-center justify-center transition hover:scale-110 z-40"
        aria-label="Open chatbot"
      >
        <MessageCircle className="w-6 h-6" />
      </button>
    )
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      <div className="w-96 h-[500px] shadow-2xl flex flex-col bg-background border border-border rounded-lg overflow-hidden">
        {/* Header */}
        <div className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
          <h3 className="font-semibold">{role === "admin" ? "Admin Assistant" : "Shopping Assistant"}</h3>
          <button onClick={() => setIsOpen(false)} className="text-primary-foreground hover:opacity-80">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-xs px-3 py-2 rounded-lg text-sm whitespace-pre-wrap ${
                  msg.type === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Replies */}
        <div className="px-4 py-3 border-t border-border space-y-2 max-h-32 overflow-y-auto">
          {getQuickReplies().map((reply) => (
            <button
              key={reply}
              onClick={() => handleQuickReply(reply)}
              className="w-full text-left px-3 py-2 bg-secondary text-foreground rounded hover:bg-accent hover:text-accent-foreground transition-colors text-xs font-medium"
            >
              {reply}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="border-t border-border p-3 flex gap-2">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask something..."
            className="flex-1 px-3 py-2 border border-border rounded text-sm bg-background focus:outline-none focus:ring-2 focus:ring-accent"
          />
          <button
            onClick={handleSend}
            className="px-3 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  )
}
