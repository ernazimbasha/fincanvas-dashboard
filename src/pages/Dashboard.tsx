import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navigate } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Bell, Settings, User } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { toast } from "sonner";

// Dashboard Components
import { PortfolioOverview } from "@/components/Dashboard/PortfolioOverview";
import { PortfolioChart } from "@/components/Dashboard/PortfolioChart";
import { MarketView } from "@/components/Dashboard/MarketView";
import { PositionsTable } from "@/components/Dashboard/PositionsTable";
import { CandlestickChart } from "@/components/Dashboard/CandlestickChart";
import { ChatBot } from "@/components/Dashboard/ChatBot";
import { ProjectSummary } from "@/components/Dashboard/ProjectSummary";

export default function Dashboard() {
  const { isLoading, isAuthenticated, user, signOut } = useAuth();
  
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

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
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
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 relative"
            >
              <Bell className="h-4 w-4" />
              {unreadAlertsCount && unreadAlertsCount > 0 && (
                <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                  {unreadAlertsCount}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Settings className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
              onClick={handleSignOut}
            >
              <User className="h-4 w-4 mr-2" />
              Sign Out
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Main Content */}
      <main className="relative z-10 p-6 space-y-6">
        {/* Project Summary */}
        <ProjectSummary />
        
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
      </main>

      {/* ChatBot */}
      <ChatBot />
    </div>
  );
}
