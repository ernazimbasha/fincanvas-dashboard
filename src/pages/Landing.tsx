import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { 
  TrendingUp, 
  Brain, 
  Users, 
  Shield, 
  BarChart3, 
  Zap,
  ArrowRight,
  Star,
  Target,
  Lightbulb
} from "lucide-react";
import { useMemo } from "react";

export default function Landing() {
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  // Add: lightweight ticker data (mock, no backend dependency)
  const tickerItems = useMemo(
    () => [
      { symbol: "AAPL", price: 171.62, change: -0.55 },
      { symbol: "MSFT", price: 417.30, change: +0.30 },
      { symbol: "TSLA", price: 248.50, change: -0.12 },
      { symbol: "GOOGL", price: 139.17, change: -0.80 },
      { symbol: "NVDA", price: 901.12, change: +1.15 },
      { symbol: "^GSPC", price: 4783.45, change: -0.26 },
      { symbol: "^IXIC", price: 15055.65, change: +0.30 },
      { symbol: "^DJI", price: 37863.8, change: -0.15 },
    ],
    []
  );

  // Add: Live Market Snapshot mock data
  const marketSnapshot = useMemo(
    () => ({
      indices: [
        { symbol: "^GSPC", name: "S&P 500", price: 4783.45, change: -12.37, changePercent: -0.26 },
        { symbol: "^DJI", name: "Dow Jones", price: 37863.80, change: -57.44, changePercent: -0.15 },
        { symbol: "^IXIC", name: "NASDAQ", price: 15055.65, change: +45.12, changePercent: +0.30 },
      ],
      gainers: [
        { symbol: "NVDA", name: "NVIDIA", price: 901.12, change: +10.35, changePercent: +1.15 },
        { symbol: "MSFT", name: "Microsoft", price: 417.30, change: +1.25, changePercent: +0.30 },
        { symbol: "AMZN", name: "Amazon", price: 178.52, change: +2.10, changePercent: +1.19 },
      ],
      losers: [
        { symbol: "AAPL", name: "Apple", price: 171.62, change: -0.95, changePercent: -0.55 },
        { symbol: "TSLA", name: "Tesla", price: 248.50, change: -0.31, changePercent: -0.12 },
        { symbol: "GOOGL", name: "Alphabet", price: 139.17, change: -1.12, changePercent: -0.80 },
      ],
    }),
    []
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Background Elements with slight motion pulse */}
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3),transparent_50%)]"
        animate={{ opacity: [0.6, 0.8, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.3),transparent_50%)]"
        animate={{ opacity: [0.4, 0.6, 0.4] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(120,219,226,0.2),transparent_50%)]"
        animate={{ opacity: [0.3, 0.5, 0.3] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 p-6 border-b border-white/10 bg-white/5 backdrop-blur-md"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="./logo.svg"
              alt="FinCanvas AI"
              width={40}
              height={40}
              className="rounded-lg cursor-pointer"
              onClick={() => navigate("/")}
            />
            <div>
              <h1 className="text-xl font-bold text-white">FinCanvas AI</h1>
              <p className="text-xs text-white/60">Guaranteed Winner</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              Features
            </Button>
            <Button
              variant="ghost"
              className="text-white hover:bg-white/10"
            >
              About
            </Button>
            <Button
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-emerald-500 to-purple-600 hover:from-emerald-600 hover:to-purple-700 text-white"
            >
              {isAuthenticated ? "Dashboard" : "Get Started"}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </motion.nav>

      {/* Live Ticker Bar */}
      <div className="relative z-10 border-b border-white/10 bg-white/5 backdrop-blur-md">
        <div className="overflow-hidden">
          <motion.div
            className="flex gap-8 py-2"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          >
            {[...tickerItems, ...tickerItems].map((t, i) => (
              <div key={`${t.symbol}-${i}`} className="flex items-center gap-2 min-w-fit">
                <span className="text-xs text-white/70">{t.symbol}</span>
                <span className="text-xs text-white/90">${t.price.toFixed(2)}</span>
                <span className={`text-xs ${t.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {t.change >= 0 ? "+" : ""}
                  {t.change.toFixed(2)}%
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <Badge className="mb-6 bg-gradient-to-r from-emerald-500 to-purple-600 text-white">
              <Star className="mr-2 h-4 w-4" />
              AI-Powered Trading Platform
            </Badge>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              <span className="bg-gradient-to-r from-emerald-400 to-purple-400 bg-clip-text text-transparent">
                FinCanvas AI
              </span>
              <br />
              <span className="text-3xl md:text-4xl font-semibold">
                — Smarter Finance, Interactive Insights.
              </span>
            </h1>
            
            <p className="text-xl text-white/80 mb-8 max-w-3xl mx-auto leading-relaxed">
              Trade with clarity. Explore interactive charts, real-time insights, and an AI assistant built for decision-making.
              A clean, modern workspace designed for speed, precision, and confidence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={handleGetStarted}
                className="bg-gradient-to-r from-emerald-500 to-purple-600 hover:from-emerald-600 hover:to-purple-700 text-white text-lg px-8 py-4 transition-transform active:scale-95"
              >
                {isAuthenticated ? "Go to Dashboard" : "Get Started"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleGetStarted}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20 text-lg px-8 py-4 transition-transform active:scale-95"
              >
                Try Demo
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live Market Snapshot Section */}
      <section className="relative z-10 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <h2 className="text-4xl font-bold text-white mb-3">Live Market Snapshot</h2>
            <p className="text-white/70">
              Track key indices and movers at a glance
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Indices */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.25 }}
              className="space-y-3"
            >
              <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Indices</h3>
                    <Badge className="bg-white/10 text-white/70">Market</Badge>
                  </div>
                  <div className="space-y-2">
                    {marketSnapshot.indices.map((idx, i) => (
                      <motion.div
                        key={idx.symbol}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 + i * 0.05 }}
                        className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div>
                          <p className="text-sm font-medium text-white">{idx.name}</p>
                          <p className="text-xs text-white/60">{idx.symbol.replace('^', '')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-white">${idx.price.toLocaleString()}</p>
                          <p className={`text-xs ${idx.change >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                            {(idx.change >= 0 ? '+' : '') + idx.change.toFixed(2)} ({(idx.changePercent >= 0 ? '+' : '') + idx.changePercent.toFixed(2)}%)
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Gainers */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="space-y-3"
            >
              <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Top Gainers</h3>
                    <Badge className="bg-emerald-500/20 text-emerald-300">Bullish</Badge>
                  </div>
                  <div className="space-y-2">
                    {marketSnapshot.gainers.map((s, i) => (
                      <motion.div
                        key={s.symbol}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.12 + i * 0.05 }}
                        className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-emerald-400" />
                          <div>
                            <p className="text-sm font-medium text-white">{s.symbol}</p>
                            <p className="text-xs text-white/60">{s.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-white">${s.price.toFixed(2)}</p>
                          <p className="text-xs text-emerald-400">
                            +{s.change.toFixed(2)} (+{s.changePercent.toFixed(2)}%)
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Top Losers */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.35 }}
              className="space-y-3"
            >
              <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold text-white">Top Losers</h3>
                    <Badge className="bg-red-500/20 text-red-300">Bearish</Badge>
                  </div>
                  <div className="space-y-2">
                    {marketSnapshot.losers.map((s, i) => (
                      <motion.div
                        key={s.symbol}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.14 + i * 0.05 }}
                        className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-400" />
                          <div>
                            <p className="text-sm font-medium text-white">{s.symbol}</p>
                            <p className="text-xs text-white/60">{s.name}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-white">${s.price.toFixed(2)}</p>
                          <p className="text-xs text-red-400">
                            {s.change.toFixed(2)} ({s.changePercent.toFixed(2)}%)
                          </p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Why FinCanvas / Testimonials */}
      <section className="relative z-10 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">Why FinCanvas?</h2>
            <p className="text-white/70 max-w-2xl mx-auto">
              Professional-grade tools, AI-powered insights, and a frictionless experience built for modern traders.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Interactive Canvas",
                text: "Sketch trends, annotate charts, and explore patterns with AI-assisted overlays.",
              },
              {
                title: "Risk Alerts",
                text: "Stay ahead with volatility alerts, bias checks, and position risk flags.",
              },
              {
                title: "Collaborative Whiteboard",
                text: "Share ideas with your team in real time and build smarter strategies together.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.25 + i * 0.1 }}
              >
                <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl hover:bg-white/10 transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-white mb-2">{item.title}</h3>
                    <p className="text-white/70">{item.text}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Transform Your Trading?
            </h2>
            <p className="text-xl text-white/70 mb-8">
              Join thousands of traders who are already using FinCanvas AI to make smarter investment decisions.
            </p>
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="bg-gradient-to-r from-emerald-500 to-purple-600 hover:from-emerald-600 hover:to-purple-700 text-white text-lg px-12 py-4"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-white/10 bg-white/5 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {/* Brand */}
            <div className="flex items-center gap-3">
              <img
                src="./logo.svg"
                alt="FinCanvas AI"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <div>
                <span className="text-white font-semibold block">FinCanvas AI</span>
                <span className="text-xs text-white/60">Smarter Finance, Interactive Insights</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-white/70 text-sm">
              <p className="font-semibold text-white mb-2">Quick Links</p>
              <div className="flex gap-4">
                <button
                  className="hover:text-white transition-colors"
                  onClick={() => navigate('/auth')}
                >
                  Get Started
                </button>
                <button
                  className="hover:text-white transition-colors"
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                </button>
                <a
                  href="https://vly.ai"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  vly.ai
                </a>
              </div>
            </div>

            {/* Contact + Disclaimer */}
            <div className="text-white/70 text-sm">
              <p className="font-semibold text-white mb-2">Contact</p>
              <p>Email: support@fincanvas.ai</p>
              <p className="mt-3 text-xs text-white/50">
                Disclaimer: For educational purposes only. Not investment advice. Markets involve risk.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <p className="text-white/60 text-xs">
              © {new Date().getFullYear()} FinCanvas AI. All rights reserved.
            </p>
            <p className="text-white/60 text-xs">
              Powered by{" "}
              <a
                href="https://vly.ai"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                vly.ai
              </a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}