import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useState } from "react";

interface CandlestickChartProps {
  symbol?: string;
}

export function CandlestickChart({ symbol = "AAPL" }: CandlestickChartProps) {
  const [timeRange, setTimeRange] = useState("1D");

  const timeRanges = [
    { label: "1D", value: "1D" },
    { label: "1M", value: "1M" },
    { label: "3M", value: "3M" },
    { label: "6M", value: "6M" },
    { label: "1Y", value: "1Y" },
    { label: "All", value: "All" },
  ];

  // Regenerate candles based on timeRange for real interactivity
  const candlestickData = (() => {
    // points per range
    const pointsByRange: Record<string, number> = {
      "1D": 50,   // intraday-style
      "1M": 50,
      "3M": 60,
      "6M": 90,
      "1Y": 120,
      "All": 150,
    };
    const numPoints = pointsByRange[timeRange] ?? 50;
    const data = [];
    let basePrice = 170;

    for (let i = 0; i < numPoints; i++) {
      // vary volatility a bit by range
      const vol = timeRange === "1D" ? 3 : timeRange === "1M" ? 4 : timeRange === "3M" ? 5 : timeRange === "6M" ? 6 : timeRange === "1Y" ? 7 : 8;
      const open = basePrice + (Math.random() - 0.5) * vol;
      const close = open + (Math.random() - 0.5) * (vol + 1);
      const high = Math.max(open, close) + Math.random() * (vol / 2 + 1);
      const low = Math.min(open, close) - Math.random() * (vol / 2 + 1);

      data.push({
        time: Date.now() - (numPoints - 1 - i) * 24 * 60 * 60 * 1000,
        open,
        high,
        low,
        close,
        volume: Math.floor(Math.random() * 1000000) + 500000,
      });

      basePrice = close;
    }

    return data;
  })();

  const currentPrice = candlestickData[candlestickData.length - 1];
  const previousPrice = candlestickData[candlestickData.length - 2] ?? currentPrice;
  const change = currentPrice.close - previousPrice.close;
  const changePercent = previousPrice.close ? (change / previousPrice.close) * 100 : 0;

  // Simple candlestick visualization
  const CandlestickSVG = () => {
    const width = 400;
    const height = 200;
    const padding = 20;
    
    const prices = candlestickData.flatMap(d => [d.high, d.low]);
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const priceRange = maxPrice - minPrice;
    
    const candleWidth = (width - padding * 2) / candlestickData.length * 0.8;
    
    return (
      <svg width={width} height={height} className="w-full h-full">
        {candlestickData.map((candle, index) => {
          const x = padding + (index * (width - padding * 2)) / candlestickData.length;
          const openY = height - padding - ((candle.open - minPrice) / priceRange) * (height - padding * 2);
          const closeY = height - padding - ((candle.close - minPrice) / priceRange) * (height - padding * 2);
          const highY = height - padding - ((candle.high - minPrice) / priceRange) * (height - padding * 2);
          const lowY = height - padding - ((candle.low - minPrice) / priceRange) * (height - padding * 2);
          
          const isGreen = candle.close > candle.open;
          const bodyTop = Math.min(openY, closeY);
          const bodyHeight = Math.abs(closeY - openY);
          
          return (
            <g key={index}>
              {/* Wick */}
              <line
                x1={x + candleWidth / 2}
                y1={highY}
                x2={x + candleWidth / 2}
                y2={lowY}
                stroke={isGreen ? "#10b981" : "#ef4444"}
                strokeWidth="1"
              />
              {/* Body */}
              <rect
                x={x}
                y={bodyTop}
                width={candleWidth}
                height={Math.max(bodyHeight, 1)}
                fill={isGreen ? "#10b981" : "#ef4444"}
                opacity={0.8}
              />
            </g>
          );
        })}
      </svg>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold text-white">Chart</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xl font-bold text-white">{symbol}</span>
                <span className="text-sm text-white/60">${currentPrice.close.toFixed(2)}</span>
                <span className={`text-sm font-medium ${change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {change >= 0 ? '+' : ''}${change.toFixed(2)} ({changePercent >= 0 ? '+' : ''}{changePercent.toFixed(2)}%)
                </span>
              </div>
            </div>
            <div className="flex gap-1">
              {timeRanges.map((range) => (
                <Button
                  key={range.value}
                  size="sm"
                  variant={timeRange === range.value ? "default" : "ghost"}
                  className={`h-8 px-2 text-xs ${
                    timeRange === range.value
                      ? "bg-gradient-to-r from-emerald-500 to-purple-600 text-white"
                      : "text-white/60 hover:text-white hover:bg-white/10"
                  }`}
                  onClick={() => setTimeRange(range.value)}
                >
                  {range.label}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Smooth fade on timeRange change */}
          <motion.div
            key={timeRange}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
            className="h-48 flex items-center justify-center"
          >
            <CandlestickSVG />
          </motion.div>
          <div className="mt-4 grid grid-cols-4 gap-4 text-xs">
            <div>
              <p className="text-white/60">Open</p>
              <p className="text-white font-medium">${currentPrice.open.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-white/60">High</p>
              <p className="text-white font-medium">${currentPrice.high.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-white/60">Low</p>
              <p className="text-white font-medium">${currentPrice.low.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-white/60">Volume</p>
              <p className="text-white font-medium">{(currentPrice.volume / 1000000).toFixed(1)}M</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}