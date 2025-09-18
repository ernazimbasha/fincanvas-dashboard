import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell, Settings, User } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { useNavigate } from "react-router";

// Dashboard Components
import { PortfolioOverview } from "@/components/Dashboard/PortfolioOverview";
import { PortfolioChart } from "@/components/Dashboard/PortfolioChart";
import { MarketView } from "@/components/Dashboard/MarketView";
import { PositionsTable } from "@/components/Dashboard/PositionsTable";
import { CandlestickChart } from "@/components/Dashboard/CandlestickChart";
import { ChatBot } from "@/components/Dashboard/ChatBot";

export default function Dashboard() {
  const { isLoading, isAuthenticated, user, signOut } = useAuth();
  const navigate = useNavigate();
  
  // Convex queries
  const portfolioOverview = useQuery(api.portfolio.getPortfolioOverview);
  const positions = useQuery(api.portfolio.getPositions);
  const portfolioHistory = useQuery(api.portfolio.getPortfolioHistory, { timeRange: "1M" });
  const marketIndices = useQuery(api.market.getMarketIndices);
  const watchlist = useQuery(api.market.getWatchlist);
  const insights = useQuery(api.insights.getInsights);
  const unreadAlertsCount = useQuery(api.insights.getUnreadAlertsCount);
  
  // Seed data mutations
  const seedMarketData = useMutation(api.seedData.seedMarketData);
  const seedUserPortfolio = useMutation(api.seedData.seedUserPortfolio);

  // Seed data on first load
  useEffect(() => {
    const seedData = async () => {
      try {
        if (!marketIndices || marketIndices.length === 0) {
          await seedMarketData();
        }
        if (!positions || positions.length === 0) {
          await seedUserPortfolio();
          toast.success("Welcome! Your demo portfolio has been set up.");
        }
      } catch (error) {
        console.error("Error seeding data:", error);
      }
    };
    
    if (user && marketIndices !== undefined && positions !== undefined) {
      seedData();
    }
  }, [user, marketIndices, positions, seedMarketData, seedUserPortfolio]);

  // Add local state for notifications modal
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<{ title: string; body: string } | null>(null);

  // Add local state for analyze and search
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<Array<{ symbol: string; name: string; price: number; change: number }>>([]);

  // Dummy market list for search
  const demoUniverse: Array<{ symbol: string; name: string; price: number; change: number }> = [
    { symbol: "AAPL", name: "Apple Inc.", price: 171.62, change: -0.55 },
    { symbol: "MSFT", name: "Microsoft Corp.", price: 417.30, change: +0.30 },
    { symbol: "TSLA", name: "Tesla, Inc.", price: 248.50, change: -0.12 },
    { symbol: "NVDA", name: "NVIDIA Corp.", price: 901.12, change: +1.15 },
    { symbol: "AMZN", name: "Amazon.com, Inc.", price: 178.52, change: +1.19 },
    { symbol: "GOOGL", name: "Alphabet Inc.", price: 139.17, change: -0.80 },
  ];

  const runSearch = () => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setSearchResults([]);
      return;
    }
    const results = demoUniverse.filter(
      (r) => r.symbol.toLowerCase().includes(term) || r.name.toLowerCase().includes(term)
    );
    setSearchResults(results.slice(0, 5));
  };

  const notifications = [
    { title: "High Volatility Alert", body: "TSLA volatility increased 8% today. Review risk." },
    { title: "Price Target Update", body: "MSFT consensus target revised to $440." },
    { title: "Portfolio Milestone", body: "Your portfolio crossed $60k this week. Great job!" },
  ];

  const openNotification = (n: { title: string; body: string }) => {
    setSelectedNotification(n);
    setNotifyOpen(true);
  };

  const handleProfileClick = (action: "profile" | "settings" | "signout") => {
    if (action === "signout") {
      handleSignOut();
      return;
    }
    toast.info(action === "profile" ? "Profile is coming soon (demo)" : "Settings are coming soon (demo)");
  };

  // Redirect if not authenticated
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
      navigate("/");
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(120,119,198,0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,119,198,0.3),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_40%_40%,rgba(120,219,226,0.2),transparent_50%)]" />
      
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 p-6 border-b border-white/10 bg-white/5 backdrop-blur-md"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
              onClick={() => window.history.back()}
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-white">
                FinCanvas AI Dashboard
              </h1>
              <p className="text-white/60">
                Hello {user?.name || 'Trader'} — Your AI insights are ready
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Notifications dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10 relative"
                >
                  <Bell className="h-4 w-4" />
                  {unreadAlertsCount && unreadAlertsCount > 0 && (
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-[10px] leading-3 flex items-center justify-center text-white">
                      {unreadAlertsCount}
                    </span>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {notifications.map((n, i) => (
                  <DropdownMenuItem key={i} onClick={() => openNotification(n)}>
                    {n.title}
                  </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => toast("All caught up!")}>
                  View all
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings button keeps behavior */}
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
              onClick={() => toast.info("Settings panel coming soon (demo)")}
            >
              <Settings className="h-4 w-4" />
            </Button>

            {/* Profile dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-white hover:bg-white/10"
                >
                  <User className="h-4 w-4 mr-2" />
                  Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuLabel>{user?.name || "Trader"}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleProfileClick("profile")}>Profile</DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleProfileClick("settings")}>Settings</DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleProfileClick("signout")}>Sign out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </motion.header>

      {/* Notifications Modal */}
      <Dialog open={notifyOpen} onOpenChange={setNotifyOpen}>
        <DialogContent className="bg-slate-900/90 text-white border-white/10 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle>{selectedNotification?.title || "Notification"}</DialogTitle>
          </DialogHeader>
          <div className="text-white/80">
            {selectedNotification?.body}
          </div>
        </DialogContent>
      </Dialog>

      {/* Search Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
          <CardHeader className="pb-3">
            <CardTitle className="text-white text-base">Search Markets & Companies</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") runSearch();
                }}
                placeholder="Search by symbol or company name (e.g., AAPL, Microsoft)"
                className="flex-1 rounded-md bg-white/10 border border-white/20 text-white px-3 py-2 placeholder:text-white/60"
              />
              <Button
                onClick={runSearch}
                className="bg-gradient-to-r from-emerald-500 to-purple-600 hover:from-emerald-600 hover:to-purple-700 text-white"
              >
                Search
              </Button>
            </div>

            {searchResults.length > 0 && (
              <div className="mt-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {searchResults.map((r) => (
                  <div
                    key={r.symbol}
                    className="rounded-lg border border-white/10 bg-white/5 px-4 py-3 flex items-center justify-between"
                  >
                    <div>
                      <div className="text-white font-semibold">{r.symbol}</div>
                      <div className="text-xs text-white/60">{r.name}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm text-white">${r.price.toFixed(2)}</div>
                      <div className={`text-xs ${r.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                        {(r.change >= 0 ? "+" : "") + r.change.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Main Content */}
      <main className="relative z-10 p-6 space-y-6">
        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[400px]">
          {/* Portfolio Overview */}
          <div className="lg:col-span-1">
            <PortfolioOverview data={portfolioOverview ?? null} />
          </div>
          
          {/* Portfolio Performance Chart */}
          <div className="lg:col-span-2">
            <PortfolioChart data={portfolioHistory || []} />
          </div>
          
          {/* Market View */}
          <div className="lg:col-span-1">
            <MarketView 
              indices={marketIndices || []} 
              watchlist={watchlist || []} 
            />
          </div>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Positions Table */}
          <div className="lg:col-span-2">
            <PositionsTable positions={positions || []} />
          </div>
          
          {/* Candlestick Chart */}
          <div className="lg:col-span-1">
            <CandlestickChart symbol="AAPL" />
          </div>
        </div>

        {/* Research & Insights Section */}
        <section className="mt-6 grid grid-cols-1 xl:grid-cols-5 gap-6">
          {/* Company Research */}
          <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl hover:bg-white/10 transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-base">Company Research</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-white/70 space-y-2">
              <p>Fundamentals, ratios, and profiles for top holdings.</p>
              <ul className="list-disc ml-4 space-y-1">
                <li>AAPL • P/E 28.1 • EPS 6.42</li>
                <li>MSFT • P/E 35.2 • EPS 9.95</li>
                <li>TSLA • P/E 58.4 • EPS 4.10</li>
              </ul>
              <div className="pt-2 space-y-3">
                <Button
                  size="sm"
                  className="bg-gradient-to-r from-emerald-500 to-purple-600 text-white w-full"
                  onClick={() => setShowAnalysis((s) => !s)}
                >
                  {showAnalysis ? "Hide Insight" : "Analyze"}
                </Button>

                {showAnalysis && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="rounded-lg border border-white/10 bg-white/5 p-3"
                  >
                    <div className="text-white/90 mb-2">
                      AI Insight: MSFT shows sustained momentum vs sector peers with improving breadth.
                      Pullbacks to 20D MA have been bought; risk skews positive into earnings if volume confirms.
                    </div>
                    {/* Mini chart (dummy) */}
                    <svg width="100%" height="60" viewBox="0 0 200 60" className="opacity-90">
                      <polyline
                        fill="none"
                        stroke="#10b981"
                        strokeWidth="2"
                        points="0,45 20,40 40,42 60,35 80,30 100,28 120,25 140,22 160,20 180,18 200,15"
                      />
                    </svg>
                    <div className="mt-2 text-xs text-white/60">
                      Backtest: 6/8 positive weeks; Avg +1.2% over next 10 sessions on similar setups (demo).
                    </div>
                  </motion.div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Market News */}
          <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl hover:bg-white/10 transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-base">Market News</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-white/70 space-y-2">
              <ul className="space-y-2">
                <li>• Tech leads market rebound; indices mixed.</li>
                <li>• Fed commentary signals cautious optimism.</li>
                <li>• AI chip demand lifts semiconductor peers.</li>
              </ul>
              <div className="pt-2">
                <Button size="sm" variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">View Feed</Button>
              </div>
            </CardContent>
          </Card>

          {/* Learning Hub */}
          <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl hover:bg-white/10 transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-base">Learning Hub</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-white/70 space-y-2">
              <ul className="space-y-2">
                <li>• Candlestick Basics (5 min)</li>
                <li>• Risk-Adjusted Returns (8 min)</li>
                <li>• Portfolio Diversification (6 min)</li>
              </ul>
              <div className="pt-2">
                <Button size="sm" variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">Start Learning</Button>
              </div>
            </CardContent>
          </Card>

          {/* Analyst Insights */}
          <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl hover:bg-white/10 transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-base">Analyst Insights</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-white/70 space-y-2">
              <p className="text-white/80">AI-generated alerts and predictions:</p>
              <ul className="space-y-1">
                <li>• TSLA volatility rising — consider position sizing.</li>
                <li>• MSFT momentum strong vs sector peers.</li>
                <li>• AAPL near resistance; watch volume spikes.</li>
              </ul>
              <div className="pt-2">
                <Button size="sm" className="bg-gradient-to-r from-emerald-500 to-purple-600 text-white w-full">Generate Insight</Button>
              </div>
            </CardContent>
          </Card>

          {/* Comparison Tool */}
          <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl hover:bg-white/10 transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-white text-base">Comparison Tool</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-white/70 space-y-2">
              <p>Compare stocks vs sector benchmarks.</p>
              <ul className="space-y-1">
                <li>• AAPL vs XLK • 1M: +3.2% vs +2.4%</li>
                <li>• TSLA vs XLY • 1M: +5.1% vs +1.3%</li>
              </ul>
              <div className="pt-2">
                <Button size="sm" variant="outline" className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20">Compare Now</Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>

      {/* ChatBot */}
      <ChatBot />
    </div>
  );
}