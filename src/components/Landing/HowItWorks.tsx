import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Lightbulb, Brain, Users } from "lucide-react";

export function HowItWorks() {
  const steps = [
    { icon: Lightbulb, title: "Draw Query", text: "Sketch or type your market question directly." },
    { icon: Brain, title: "Get Insights", text: "AI translates intent into charts and explanations." },
    { icon: Users, title: "Collaborate", text: "Share, annotate, and refine with your team." },
  ];
  return (
    <section className="relative z-10 px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-3xl md:text-4xl font-bold text-white mb-8">
          How It Works
        </motion.h2>
        <div className="grid sm:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <motion.div key={s.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}>
              <Card className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-colors">
                <CardContent className="p-6">
                  <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-emerald-500 to-purple-600 flex items-center justify-center mb-3">
                    <s.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-white font-semibold mb-1">{s.title}</div>
                  <div className="text-white/70 text-sm">{s.text}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
