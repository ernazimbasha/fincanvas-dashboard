import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export function EducationHub() {
  const items = [
    { title: "What is Risk Tolerance?", time: "4 min", blurb: "Understand how much volatility you can handle." },
    { title: "Basics of Stock Trends", time: "5 min", blurb: "Spot uptrends, downtrends, and consolidations." },
    { title: "Reading Candlesticks", time: "6 min", blurb: "Interpret price action with key candle patterns." },
  ];
  return (
    <section className="relative z-10 px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }} className="text-3xl md:text-4xl font-bold text-white mb-8">
          AI Education Hub
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((a, i) => (
            <motion.div key={a.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}>
              <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                <CardContent className="p-6">
                  <div className="text-white font-semibold mb-1">{a.title}</div>
                  <div className="text-white/60 text-sm mb-3">{a.blurb}</div>
                  <div className="text-xs text-white/50">Read time: {a.time}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}