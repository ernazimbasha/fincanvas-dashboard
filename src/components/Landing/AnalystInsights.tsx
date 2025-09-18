import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { LineChart, Target, TrendingUp } from "lucide-react";

export function AnalystInsights() {
  const insights = [
    {
      icon: TrendingUp,
      title: "Momentum Watch: Large Cap Tech",
      blurb:
        "Breadth improving vs sector. Pullbacks to 20D MA have been bought across leaders; risk skew positive if volume confirms.",
    },
    {
      icon: LineChart,
      title: "Earnings Drift: Post-Beat Patterns",
      blurb:
        "Beat-and-raise cycles continue. Software names with margin discipline show sustained drift over 10–20 sessions.",
    },
    {
      icon: Target,
      title: "Risk Radar: Volatility Signals",
      blurb:
        "Options skew elevated in autos and semis. Consider position sizing guidelines as IV expands around catalysts.",
    },
  ];

  return (
    <section className="relative z-10 px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-4xl font-bold text-white mb-8"
        >
          Analyst Insights
        </motion.h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {insights.map((i, idx) => (
            <motion.div
              key={i.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: 0.1 + idx * 0.05 }}
            >
              <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-colors h-full">
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-purple-600 flex items-center justify-center mb-3">
                    <i.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-white font-semibold mb-1">{i.title}</div>
                  <div className="text-white/70 text-sm">{i.blurb}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
