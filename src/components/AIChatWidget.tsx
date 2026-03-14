import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

const quickReplies = [
  "How do I cancel a booking?",
  "What's the refund policy?",
  "How to change dates?",
  "Payment options available?",
];

const aiResponses: Record<string, string> = {
  "cancel": "To cancel a booking, go to **Dashboard → My Bookings**, find the booking you want to cancel, and click 'Cancel Booking'. Cancellations made 48+ hours before check-in get a full refund. Within 48 hours, a 20% fee applies.",
  "refund": "Our refund policy:\n• **48+ hours before check-in**: Full refund\n• **24-48 hours**: 80% refund\n• **Less than 24 hours**: 50% refund\n• **No-show**: No refund\n\nRefunds are processed within 5-7 business days.",
  "change": "To change your booking dates:\n1. Go to **Dashboard → My Bookings**\n2. Click on the booking\n3. Select 'Modify Dates'\n4. Choose new dates\n5. Pay any price difference\n\nDate changes are free if done 24+ hours before check-in.",
  "payment": "We accept the following payment methods:\n• **Credit/Debit Cards** (Visa, Mastercard, RuPay)\n• **UPI** (Google Pay, PhonePe, Paytm)\n• **Net Banking**\n• **EMI** on select cards\n• **Wallets** (Paytm, PhonePe)\n\nAll payments are secured with SSL encryption.",
  "hotel": "We have 50+ hotels across India and international destinations including Dubai, Singapore, Bali, Paris, Maldives and more. You can search by city, price range, rating, or property type on our Hotels page.",
  "flight": "We offer domestic flights across India and international flights to Dubai, Singapore, London, Bangkok, Tokyo, Paris and more. Search flights on our Flights page with filters for price, class, and airline.",
  "package": "We have curated vacation packages for every type of traveler — Beach, Adventure, Cultural, Honeymoon, Family, and Luxury. Packages include hotels, flights, transfers, meals, and sightseeing. Check our Packages page!",
  "default": "I'd be happy to help! Here are some things I can assist with:\n\n• 🏨 Hotel bookings & information\n• ✈️ Flight search & booking\n• 📦 Vacation packages\n• 💳 Payment & refund queries\n• 📝 Booking modifications\n• ❌ Cancellation help\n\nWhat would you like to know?",
};

function getAIResponse(message: string): string {
  const lower = message.toLowerCase();
  if (lower.includes("cancel")) return aiResponses.cancel;
  if (lower.includes("refund")) return aiResponses.refund;
  if (lower.includes("change") || lower.includes("modify") || lower.includes("date")) return aiResponses.change;
  if (lower.includes("payment") || lower.includes("pay") || lower.includes("upi") || lower.includes("card")) return aiResponses.payment;
  if (lower.includes("hotel") || lower.includes("room") || lower.includes("stay")) return aiResponses.hotel;
  if (lower.includes("flight") || lower.includes("fly") || lower.includes("airline")) return aiResponses.flight;
  if (lower.includes("package") || lower.includes("vacation") || lower.includes("trip") || lower.includes("tour")) return aiResponses.package;
  return aiResponses.default;
}

export function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: "Hi! 👋 I'm your Wanderlust travel assistant. How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages]);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text.trim(), timestamp: new Date() };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const response = getAIResponse(text);
      const aiMsg: Message = { id: (Date.now() + 1).toString(), role: "assistant", content: response, timestamp: new Date() };
      setMessages((prev) => [...prev, aiMsg]);
      setIsTyping(false);
    }, 800 + Math.random() * 700);
  };

  return (
    <>
      {/* FAB */}
      <AnimatePresence>
        {!open && (
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 h-14 w-14 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl flex items-center justify-center transition-shadow"
          >
            <MessageCircle className="h-6 w-6" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Window */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] h-[520px] bg-card rounded-2xl shadow-card-hover flex flex-col overflow-hidden border border-border"
          >
            {/* Header */}
            <div className="bg-primary p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <p className="text-primary-foreground font-semibold text-sm">Travel Assistant</p>
                  <p className="text-primary-foreground/70 text-xs">Online · Instant replies</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} className="text-primary-foreground/80 hover:text-primary-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line ${
                    msg.role === "user"
                      ? "bg-primary text-primary-foreground rounded-br-sm"
                      : "bg-muted text-foreground rounded-bl-sm"
                  }`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-muted rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="h-2 w-2 rounded-full bg-muted-foreground/40 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Quick Replies */}
            {messages.length <= 2 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {quickReplies.map((q) => (
                  <button key={q} onClick={() => sendMessage(q)} className="px-3 py-1.5 rounded-full border border-border text-xs text-foreground hover:bg-muted transition-colors">
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-border flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="Type your question..."
                className="bg-background text-sm"
              />
              <Button size="icon" onClick={() => sendMessage(input)} disabled={!input.trim()} className="bg-primary text-primary-foreground shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
