import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { MessageCircle, X, Send, Bot } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hello! I'm your FinCanvas AI assistant. I can help you analyze trends, explain market movements, and provide personalized insights. What would you like to know?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");

  // Simple intent-based response engine
  const getBotReply = (text: string) => {
    const t = text.trim().toLowerCase();

    // Greetings
    if (/(^|\b)(hi|hello|hey|yo|howdy)(\b|!|\.|$)/.test(t)) {
      return "Hi there! 👋 How can I help today? Try asking about your portfolio, a symbol (e.g., AAPL), market news, or how to fund your account.";
    }

    // Help
    if (t.includes("help") || t.includes("what can you do")) {
      return "I can assist with: portfolio summaries, basic symbol lookups (AAPL, MSFT, TSLA), demo funding steps, and quick market context. Ask me something like: \"What's up with NVDA?\" or \"How do I fund?\"";
    }

    // Funding / Cash
    if (t.includes("fund") || t.includes("add cash") || t.includes("buying power")) {
      return "To add demo funds: click Fund → choose an amount → Confirm. Your Cash Buying Power updates instantly. Want tips on how much to fund?";
    }

    // Portfolio
    if (t.includes("portfolio") || t.includes("holdings") || t.includes("positions") || t.includes("account value")) {
      return "Your portfolio shows account value, market value, P/L, and positions. For a quick check, open the dashboard overview. You can also place demo trades to adjust positions.";
    }

    // Symbol lookups (simple heuristics)
    const symbolMatch = t.match(/\b[a-z]{1,5}\b/g);
    const known = ["aapl", "msft", "tsla", "nvda", "amzn", "googl", "spy", "qqq"];
    if (symbolMatch && symbolMatch.some(s => known.includes(s))) {
      const sym = symbolMatch.find(s => known.includes(s))!.toUpperCase();
      const canned: Record<string, string> = {
        AAPL: "AAPL: Stable mega-cap; watch volume near resistance. Typical pullbacks to 20D MA get bought (demo).",
        MSFT: "MSFT: Momentum vs sector peers looks healthy; dips have been bought. Earnings drift can be supportive (demo).",
        TSLA: "TSLA: Elevated volatility; consider sizing and risk controls. Trend can be choppy around catalysts (demo).",
        NVDA: "NVDA: Leadership tied to AI demand; watch for digestion after strong runs; pullbacks can be constructive (demo).",
        AMZN: "AMZN: Efficiency + growth narrative; watch margins and AWS commentary (demo).",
        GOOGL: "GOOGL: Focus on AI monetization and ad spend trends; technicals improving (demo).",
        SPY: "SPY: Broad market proxy; breadth and sector rotation key. Watch 50/200D MAs (demo).",
        QQQ: "QQQ: Tech-heavy; moves often correlate with semis momentum and rates (demo).",
      };
      return canned[sym] || `${sym}: I can provide a quick demo take—what timeframe are you considering?`;
    }

    // News
    if (t.includes("news") || t.includes("headline") || t.includes("market")) {
      return "Market snapshot (demo): Tech leadership steady; semis firm on AI demand; policy tone cautiously optimistic. Want me to open the News Feed modal?";
    }

    // Trade
    if (t.includes("buy") || t.includes("sell") || t.includes("trade") || t.includes("order")) {
      return "To place a demo trade: open Trade → set Side, Symbol, Qty, and Price → Submit. I can also suggest a mock entry if you share a symbol.";
    }

    // Education
    if (t.includes("learn") || t.includes("education") || t.includes("how to")) {
      return "Learning Hub has quick reads on candlesticks, risk-adjusted returns, and more. Want me to open the Learning modal?";
    }

    // Appreciation
    if (t.includes("thanks") || t.includes("thank you") || t.includes("ty")) {
      return "You're welcome! Anything else I can help with?";
    }

    // Who are you
    if (t.includes("who are you") || t.includes("what are you")) {
      return "I'm the FinCanvas AI assistant—here to guide you with quick insights, portfolio context, and demo workflows.";
    }

    // Default
    return "Got it. Could you clarify whether you're asking about your portfolio, a specific symbol, funding, news, or learning resources?";
  };

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userText = inputValue;
    const userMessage = {
      id: messages.length + 1,
      text: userText,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue("");

    // Simulate typing delay, then respond based on intent
    setTimeout(() => {
      const reply = getBotReply(userText);
      setMessages(prev => [
        ...prev,
        {
          id: prev.length + 1,
          text: reply,
          isBot: true,
          timestamp: new Date(),
        },
      ]);
    }, 600);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.3, delay: 0.5 }}
      >
        <Button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-full bg-gradient-to-r from-emerald-500 to-purple-600 hover:from-emerald-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300"
        >
          {isOpen ? (
            <X className="h-6 w-6 text-white" />
          ) : (
            <MessageCircle className="h-6 w-6 text-white" />
          )}
        </Button>
      </motion.div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-40 w-80 h-96"
          >
            <Card className="h-full bg-white/10 backdrop-blur-md border-white/20 shadow-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg font-semibold text-white flex items-center gap-2">
                  <Bot className="h-5 w-5 text-emerald-400" />
                  FinCanvas AI Assistant
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col h-full pb-4">
                {/* Messages */}
                <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg text-sm ${
                          message.isBot
                            ? 'bg-white/10 text-white border border-white/20'
                            : 'bg-gradient-to-r from-emerald-500 to-purple-600 text-white'
                        }`}
                      >
                        {message.text}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about your portfolio..."
                    className="flex-1 bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                  <Button
                    onClick={handleSendMessage}
                    size="sm"
                    className="bg-gradient-to-r from-emerald-500 to-purple-600 hover:from-emerald-600 hover:to-purple-700"
                  >
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}