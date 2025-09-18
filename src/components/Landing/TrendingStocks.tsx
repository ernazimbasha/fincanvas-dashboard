import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

function Spark({ data, positive }: { data: number[]; positive: boolean }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 80;
    const y = 24 - ((v - min) / range) * 24;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width="80" height="24">
      <polyline points={points} fill="none" stroke={positive ? "#10b981" : "#ef4444"} strokeWidth="2" />
    </svg>
  );
}

export function TrendingStocks() {
  const stocks = [
    { symbol: "NVDA", change: 1.8, data: Array.from({ length: 24 }, () => 80 + Math.random() * 20) },
    { symbol: "AAPL", change: -0.6, data: Array.from({ length: 24 }, () => 70 + Math.random() * 25) },
    { symbol: "MSFT", change: 0.9, data: Array.from({ length: 24 }, () => 60 + Math.random() * 30) },
    { symbol: "TSLA", change: -1.2, data: Array.from({ length: 24 }, () => 90 + Math.random() * 35) },
    { symbol: "AMZN", change: 1.1, data: Array.from({ length: 24 }, () => 65 + Math.random() * 28) },
  ];
  return (
    <section className="relative z-10 px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }} className="text-3xl md:text-4xl font-bold text-white mb-8">
          Trending Stocks
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {stocks.map((s, i) => (
            <motion.div key={s.symbol} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}>
              <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                <CardContent className="p-4 flex items-center justify-between">
                  <div>
                    <div className="text-white font-semibold">{s.symbol}</div>
                    <div className={`text-xs ${s.change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                      {s.change >= 0 ? "+" : ""}{s.change.toFixed(2)}%
                    </div>
                  </div>
                  <Spark data={s.data} positive={s.change >= 0} />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}