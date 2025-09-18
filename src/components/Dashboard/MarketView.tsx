import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";

interface MarketViewProps {
  indices: Array<{
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
  }>;
  watchlist: Array<{
    symbol: string;
    name: string;
    price: number;
    change: number;
    changePercent: number;
    volume: number;
  }>;
}

export function MarketView({ indices, watchlist }: MarketViewProps) {
  const formatPrice = (price: number) => price.toLocaleString('en-US', { minimumFractionDigits: 2 });
  const formatChange = (change: number) => `${change >= 0 ? '+' : ''}${change.toFixed(2)}`;
  const formatPercent = (percent: number) => `${percent >= 0 ? '+' : ''}${percent.toFixed(2)}%`;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="h-full bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg font-semibold text-white">Market View</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Indices */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-white/80">Indices</h3>
              <Badge variant="secondary" className="bg-white/10 text-white/60 text-xs">
                Market
              </Badge>
            </div>
            <div className="space-y-2">
              {indices.map((index, i) => (
                <motion.div
                  key={index.symbol}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.05 }}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${index.change >= 0 ? 'bg-green-400' : 'bg-red-400'}`} />
                    <div>
                      <p className="text-sm font-medium text-white">{index.symbol.replace('^', '')}</p>
                      <p className="text-xs text-white/60">{formatPrice(index.price)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {index.change >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-400" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-400" />
                      )}
                      <span className={`text-xs font-medium ${index.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatChange(index.change)}
                      </span>
                    </div>
                    <p className={`text-xs ${index.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatPercent(index.changePercent)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Watchlist */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-medium text-white/80">Watchlist</h3>
              <Badge variant="secondary" className="bg-white/10 text-white/60 text-xs">
                My Portfolio
              </Badge>
            </div>
            <div className="space-y-2">
              {watchlist.map((stock, i) => (
                <motion.div
                  key={stock.symbol}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: (indices.length + i) * 0.05 }}
                  className="flex items-center justify-between p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${stock.change >= 0 ? 'bg-green-400' : 'bg-red-400'}`} />
                    <div>
                      <p className="text-sm font-medium text-white">{stock.symbol}</p>
                      <p className="text-xs text-white/60">{formatPrice(stock.price)}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-1">
                      {stock.change >= 0 ? (
                        <TrendingUp className="h-3 w-3 text-green-400" />
                      ) : (
                        <TrendingDown className="h-3 w-3 text-red-400" />
                      )}
                      <span className={`text-xs font-medium ${stock.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {formatChange(stock.change)}
                      </span>
                    </div>
                    <p className={`text-xs ${stock.changePercent >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {formatPercent(stock.changePercent)}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
