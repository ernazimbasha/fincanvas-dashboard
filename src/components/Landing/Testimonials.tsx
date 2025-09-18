import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export function Testimonials() {
  const items = [
    { name: "Aarav, Student", quote: "Makes markets approachable. Visuals + AI = clarity.", avatar: "https://i.pravatar.cc/40?img=5" },
    { name: "Maya, Analyst", quote: "Faster research and better context for decisions.", avatar: "https://i.pravatar.cc/40?img=8" },
    { name: "Rahul, Investor", quote: "I finally track positions with confidence.", avatar: "https://i.pravatar.cc/40?img=12" },
  ];
  return (
    <section className="relative z-10 px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }} className="text-3xl md:text-4xl font-bold text-white mb-8">
          Why FinCanvas?
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((t, i) => (
            <motion.div key={t.name} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}>
              <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors">
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full" />
                    <div className="text-white/80 text-sm">{t.name}</div>
                  </div>
                  <div className="text-white">{t.quote}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}