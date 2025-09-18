import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

interface Position {
  symbol: string;
  companyName: string;
  quantity: number;
  costBasis: number;
  currentPrice: number;
  marketValue: number;
  todayGainLoss: number;
  totalGainLoss: number;
  todayGainLossPercent: number;
  totalGainLossPercent: number;
}

interface PositionsTableProps {
  positions: Position[];
}

export function PositionsTable({ positions }: PositionsTableProps) {
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

  // Generate mini sparkline data (mock data for demo)
  const generateSparklineData = () => {
    return Array.from({ length: 20 }, () => Math.random() * 100 + 50);
  };

  const MiniSparkline = ({ data, isPositive }: { data: number[], isPositive: boolean }) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min;
    
    const points = data.map((value, index) => {
      const x = (index / (data.length - 1)) * 60;
      const y = 20 - ((value - min) / range) * 20;
      return `${x},${y}`;
    }).join(' ');

    return (
      <svg width="60" height="20" className="inline-block">
        <polyline
          points={points}
          fill="none"
          stroke={isPositive ? "#10b981" : "#ef4444"}
          strokeWidth="1.5"
          className="opacity-80"
        />
      </svg>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-white">Positions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  <th className="text-left py-3 px-2 text-xs font-medium text-white/60 uppercase tracking-wider">Symbol</th>
                  <th className="text-right py-3 px-2 text-xs font-medium text-white/60 uppercase tracking-wider">Qty</th>
                  <th className="text-right py-3 px-2 text-xs font-medium text-white/60 uppercase tracking-wider">Last Price</th>
                  <th className="text-right py-3 px-2 text-xs font-medium text-white/60 uppercase tracking-wider">Bid</th>
                  <th className="text-right py-3 px-2 text-xs font-medium text-white/60 uppercase tracking-wider">Ask</th>
                  <th className="text-right py-3 px-2 text-xs font-medium text-white/60 uppercase tracking-wider">Cost Basis</th>
                  <th className="text-right py-3 px-2 text-xs font-medium text-white/60 uppercase tracking-wider">Today's G/L</th>
                  <th className="text-right py-3 px-2 text-xs font-medium text-white/60 uppercase tracking-wider">Total G/L</th>
                  <th className="text-right py-3 px-2 text-xs font-medium text-white/60 uppercase tracking-wider">Mkt Value</th>
                  <th className="text-right py-3 px-2 text-xs font-medium text-white/60 uppercase tracking-wider">Chart</th>
                </tr>
              </thead>
              <tbody>
                {positions.map((position, index) => (
                  <motion.tr
                    key={position.symbol}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className="border-b border-white/5 hover:bg-white/5 transition-colors"
                  >
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-gradient-to-br from-emerald-500 to-purple-600 flex items-center justify-center">
                          <span className="text-xs font-bold text-white">
                            {position.symbol.slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-white">{position.symbol}</p>
                          <p className="text-xs text-white/60">{position.companyName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right text-sm text-white">{position.quantity.toLocaleString()}</td>
                    <td className="py-3 px-2 text-right text-sm text-white">{formatCurrency(position.currentPrice)}</td>
                    <td className="py-3 px-2 text-right text-sm text-white/80">{formatCurrency(position.currentPrice * 0.999)}</td>
                    <td className="py-3 px-2 text-right text-sm text-white/80">{formatCurrency(position.currentPrice * 1.001)}</td>
                    <td className="py-3 px-2 text-right text-sm text-white">{formatCurrency(position.costBasis)}</td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {position.todayGainLoss >= 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-400" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-400" />
                        )}
                        <div className="text-right">
                          <p className={`text-sm font-medium ${position.todayGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {formatCurrency(position.todayGainLoss)}
                          </p>
                          <p className={`text-xs ${position.todayGainLossPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {formatPercent(position.todayGainLossPercent)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right">
                      <div className="flex items-center justify-end gap-1">
                        {position.totalGainLoss >= 0 ? (
                          <TrendingUp className="h-3 w-3 text-green-400" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-red-400" />
                        )}
                        <div className="text-right">
                          <p className={`text-sm font-medium ${position.totalGainLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {formatCurrency(position.totalGainLoss)}
                          </p>
                          <p className={`text-xs ${position.totalGainLossPercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                            {formatPercent(position.totalGainLossPercent)}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-right text-sm font-medium text-white">
                      {formatCurrency(position.marketValue)}
                    </td>
                    <td className="py-3 px-2 text-right">
                      <MiniSparkline 
                        data={generateSparklineData()} 
                        isPositive={position.totalGainLoss >= 0} 
                      />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
