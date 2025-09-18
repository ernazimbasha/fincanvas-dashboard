import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, DollarSign, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface PortfolioOverviewProps {
  data: {
    accountValue: number;
    marketValue: number;
    totalGainLoss: number;
    totalGainLossPercent: number;
    todayGainLoss: number;
    todayGainLossPercent: number;
    cashBuyingPower: number;
    totalPositions: number;
  } | null;
}

export function PortfolioOverview({ data }: PortfolioOverviewProps) {
  if (!data) return null;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`;
  };

  const [fundOpen, setFundOpen] = useState(false);
  const [tradeOpen, setTradeOpen] = useState(false);
  const [balanceOpen, setBalanceOpen] = useState(false);
  const [researchOpen, setResearchOpen] = useState(false);

  // Trade form state
  const [tradeSide, setTradeSide] = useState<"buy" | "sell">("buy");
  const [tradeSymbol, setTradeSymbol] = useState("AAPL");
  const [tradeCompany, setTradeCompany] = useState("Apple Inc.");
  const [tradeQty, setTradeQty] = useState(10);
  const [tradePrice, setTradePrice] = useState(175);

  const placeTrade = useMutation(api.portfolio.placeDemoTrade);

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="h-full bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-white">Account Overview</CardTitle>
          <p className="text-sm text-white/60">Portfolio • Account #456-789-123</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Full Portfolio */}
          <div className="space-y-2">
            <p className="text-sm text-white/60">Full Portfolio</p>
            <div className="space-y-1">
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/80">Account Value</span>
                <span className="text-sm font-medium text-white">{formatCurrency(data.accountValue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/80">Market Value</span>
                <span className="text-sm font-medium text-white">{formatCurrency(data.marketValue)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/80">Total Gain/Loss</span>
                <div className="flex items-center gap-1">
                  {data.totalGainLoss >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-400" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-400" />
                  )}
                  <span className={`text-sm font-medium ${data.totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(data.totalGainLoss)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/80">Today's Gain/Loss</span>
                <div className="flex items-center gap-1">
                  {data.todayGainLoss >= 0 ? (
                    <TrendingUp className="h-3 w-3 text-green-400" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-400" />
                  )}
                  <span className={`text-sm font-medium ${data.todayGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {formatCurrency(data.todayGainLoss)}
                  </span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/80">Cash Buying Power</span>
                <span className="text-sm font-medium text-white">{formatCurrency(data.cashBuyingPower)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-white/80">Total Positions</span>
                <span className="text-sm font-medium text-white">{data.totalPositions}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <div className="flex gap-2">
              <Button 
                size="sm" 
                className="flex-1 bg-gradient-to-r from-emerald-500 to-purple-600 hover:from-emerald-600 hover:to-purple-700 text-white border-0"
                onClick={() => setFundOpen(true)}
              >
                <DollarSign className="h-4 w-4 mr-1" />
                Fund
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => setTradeOpen(true)}
              >
                <Briefcase className="h-4 w-4 mr-1" />
                Trade
              </Button>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => setBalanceOpen(true)}
            >
              Balance
            </Button>
          </div>
        </CardContent>
      </Card>

      <Dialog open={fundOpen} onOpenChange={setFundOpen}>
        <DialogContent className="bg-slate-900/90 text-white border-white/10 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle>Fund Account</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="text-white/70">Add funds to your account (demo).</div>
            <div className="grid grid-cols-2 gap-3">
              <button className="rounded-md bg-white/10 hover:bg-white/20 py-2">+$100</button>
              <button className="rounded-md bg-white/10 hover:bg-white/20 py-2">+$500</button>
            </div>
            <button className="mt-2 w-full rounded-md bg-gradient-to-r from-emerald-500 to-purple-600 py-2">Confirm</button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={tradeOpen} onOpenChange={setTradeOpen}>
        <DialogContent className="bg-slate-900/90 text-white border-white/10 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle>Trade Ticket</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <button
                className={`rounded-md py-2 ${tradeSide === "buy" ? "bg-emerald-600" : "bg-white/10 hover:bg-white/20"}`}
                onClick={() => setTradeSide("buy")}
              >
                Buy
              </button>
              <button
                className={`rounded-md py-2 ${tradeSide === "sell" ? "bg-red-600" : "bg-white/10 hover:bg-white/20"}`}
                onClick={() => setTradeSide("sell")}
              >
                Sell
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                className="rounded-md bg-white/10 border border-white/20 px-3 py-2"
                placeholder="Symbol (e.g., AAPL)"
                value={tradeSymbol}
                onChange={(e) => setTradeSymbol(e.target.value.toUpperCase())}
              />
              <input
                className="rounded-md bg-white/10 border border-white/20 px-3 py-2"
                placeholder="Company (e.g., Apple Inc.)"
                value={tradeCompany}
                onChange={(e) => setTradeCompany(e.target.value)}
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input
                type="number"
                className="rounded-md bg-white/10 border border-white/20 px-3 py-2"
                placeholder="Qty (e.g., 10)"
                value={tradeQty}
                onChange={(e) => setTradeQty(parseInt(e.target.value || "0", 10))}
              />
              <input
                type="number"
                className="rounded-md bg-white/10 border border-white/20 px-3 py-2"
                placeholder="Price (e.g., 175)"
                value={tradePrice}
                onChange={(e) => setTradePrice(parseFloat(e.target.value || "0"))}
              />
            </div>
            <button
              className="mt-2 w-full rounded-md bg-gradient-to-r from-emerald-500 to-purple-600 py-2"
              onClick={async () => {
                try {
                  await placeTrade({
                    symbol: tradeSymbol,
                    companyName: tradeCompany,
                    side: tradeSide,
                    quantity: tradeQty,
                    price: tradePrice,
                  });
                  toast.success(`Order submitted: ${tradeSide.toUpperCase()} ${tradeQty} ${tradeSymbol} @ $${tradePrice}`);
                  setTradeOpen(false);
                } catch (e) {
                  toast.error("Failed to submit order");
                }
              }}
            >
              Submit Order
            </button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={balanceOpen} onOpenChange={setBalanceOpen}>
        <DialogContent className="bg-slate-900/90 text-white border-white/10 backdrop-blur-md">
          <DialogHeader>
            <DialogTitle>Balance Details</DialogTitle>
          </DialogHeader>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Cash:</span><span>$10,000.00</span></div>
            <div className="flex justify-between"><span>Buying Power:</span><span>$20,000.00</span></div>
            <div className="flex justify-between"><span>Margin Available:</span><span>$8,000.00</span></div>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={researchOpen} onOpenChange={setResearchOpen}>
        <DialogContent className="bg-slate-900/90 text-white border-white/10 backdrop-blur-md max-w-xl">
          <DialogHeader>
            <DialogTitle>Research Summary</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 text-sm">
            <div className="text-white/80">
              AI Research (demo): Large-cap tech breadth improving; pullbacks to 20D MA have been bought. Risk skew positive if volume confirms.
            </div>
            <div className="rounded-lg border border-white/10 bg-white/5 p-3">
              <div className="text-xs text-white/60 mb-2">Relative Performance (Demo)</div>
              <svg width="100%" height="80" viewBox="0 0 220 80" className="opacity-90">
                <polyline fill="none" stroke="#10b981" strokeWidth="2" points="0,70 20,65 40,60 60,58 80,50 100,48 120,45 140,40 160,35 180,30 200,28 220,25" />
              </svg>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}