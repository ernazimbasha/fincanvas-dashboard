import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, TrendingDown, DollarSign, Briefcase } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

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
                onClick={() => toast.success("Funds added (demo)")}
              >
                <DollarSign className="h-4 w-4 mr-1" />
                Fund
              </Button>
              <Button 
                size="sm" 
                variant="outline" 
                className="flex-1 bg-white/10 border-white/20 text-white hover:bg-white/20"
                onClick={() => toast.success("Trade submitted (demo)")}
              >
                <Briefcase className="h-4 w-4 mr-1" />
                Trade
              </Button>
            </div>
            <Button 
              size="sm" 
              variant="outline" 
              className="w-full bg-white/10 border-white/20 text-white hover:bg-white/20"
              onClick={() => toast.info("Balance fetched (demo)")}
            >
              Balance
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}