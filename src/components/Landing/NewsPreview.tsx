import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";

export function NewsPreview() {
  const items = [
    { title: "AI Hits New Stride in Finance", img: "https://images.unsplash.com/photo-1551281044-8a99eafc7b9f?q=80&w=1200&auto=format&fit=crop", blurb: "Analysts see AI accelerating research workflows across desks." },
    { title: "Semiconductors Lead Markets", img: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop", blurb: "Chipmakers drive indices higher on strong demand." },
    { title: "Macro Watch: Rates & Growth", img: "https://images.unsplash.com/photo-1542228262-3d663b306a95?q=80&w=1200&auto=format&fit=crop", blurb: "Investors eye central bank commentary and GDP forecasts." },
  ];
  return (
    <section className="relative z-10 px-6 py-16">
      <div className="max-w-7xl mx-auto">
        <motion.h2 initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.5 }} className="text-3xl md:text-4xl font-bold text-white mb-8">
          Blog & News
        </motion.h2>
        <div className="grid md:grid-cols-3 gap-6">
          {items.map((n, i) => (
            <motion.div key={n.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}>
              <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors overflow-hidden">
                <img src={n.img} alt={n.title} className="h-36 w-full object-cover" />
                <CardContent className="p-5">
                  <div className="text-white font-semibold mb-1">{n.title}</div>
                  <div className="text-white/70 text-sm">{n.blurb}</div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}