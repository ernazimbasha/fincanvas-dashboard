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

      {/* Problem-Solution Section: hide on homepage per brief */}
      <section className="relative z-10 px-6 py-16 hidden">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-3 gap-8"
        >
          <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-red-500/20">
                  <Target className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Problem</h3>
              </div>
              <p className="text-white/70 leading-relaxed">
                In 2025's volatile markets (Nifty swings 15% YTD per NSE), 80% Indian retail investors lose money due to confusing charts and generic advice (SEBI report). Big Air's tools lack collaborative, preference-based customization.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-emerald-500/20">
                  <Lightbulb className="h-6 w-6 text-emerald-400" />
                </div>
                <h3 className="text-xl font-bold text-white">Solution</h3>
              </div>
              <p className="text-white/70 leading-relaxed">
                FinCanvas AI is an AI-native collaborative canvas where users "draw" stock queries (e.g., sketch a trend line), and it generates personalized, interactive charts with predictive insights.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 rounded-lg bg-purple-500/20">
                  <Zap className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold text-white">MVP Features</h3>
              </div>
              <p className="text-white/70 leading-relaxed">
                Interactive Canvas, Preference Engine, Collab Mode, Risk Alerts, and Analytics Dashboard targeting young Indians (Gen Z finance literacy gap).
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-6 py-16">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold text-white mb-4">
              Powerful Features for Modern Traders
            </h2>
            <p className="text-xl text-white/70 max-w-2xl mx-auto">
              Everything you need to make informed trading decisions with AI-powered insights
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "AI-Powered Analysis",
                description: "Get personalized insights based on your trading style and risk tolerance"
              },
              {
                icon: TrendingUp,
                title: "Interactive Charts",
                description: "Draw your ideas directly on charts and get AI-generated predictions"
              },
              {
                icon: Users,
                title: "Collaborative Trading",
                description: "Share canvases and brainstorm with other traders in real-time"
              },
              {
                icon: Shield,
                title: "Risk Management",
                description: "Automated alerts for biases and volatility with trade plan validation"
              },
              {
                icon: BarChart3,
                title: "Portfolio Analytics",
                description: "Monitor your performance with detailed analytics and insights"
              },
              {
                icon: Zap,
                title: "Real-time Data",
                description: "Live market data and instant notifications for your watchlist"
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 + index * 0.1 }}
              >
                <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl hover:bg-white/10 transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-3 rounded-lg bg-gradient-to-r from-emerald-500/20 to-purple-500/20">
                        <feature.icon className="h-6 w-6 text-emerald-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                    </div>
                    <p className="text-white/70">{feature.description}</p>
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
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center gap-3 mb-4 md:mb-0">
              <img
                src="./logo.svg"
                alt="FinCanvas AI"
                width={32}
                height={32}
                className="rounded-lg"
              />
              <span className="text-white font-semibold">FinCanvas AI</span>
            </div>
            <p className="text-white/60 text-sm">
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