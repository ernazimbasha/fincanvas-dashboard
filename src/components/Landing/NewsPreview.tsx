import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function NewsPreview() {
  // Demo articles with robust images; any failure falls back to placeholder
  const items = [
    {
      title: "AI Hits New Stride in Finance",
      img: "https://images.unsplash.com/photo-1551281044-8a99eafc7b9f?q=80&w=1200&auto=format&fit=crop",
      blurb: "Analysts see AI accelerating research workflows across desks.",
      full:
        "AI in finance is rapidly evolving, enhancing research productivity across sell-side and buy-side desks. From NLP document parsing to predictive modeling, teams leverage AI to streamline processes and extract timely insights.",
    },
    {
      title: "Semiconductors Lead Markets",
      img: "https://images.unsplash.com/photo-1518779578993-ec3579fee39f?q=80&w=1200&auto=format&fit=crop",
      blurb: "Chipmakers drive indices higher on strong demand.",
      full:
        "Global chip demand remains resilient amid AI infrastructure builds and edge computing. Leading GPU providers continue to see upward revisions while supply chains gradually normalize.",
    },
    {
      title: "Macro Watch: Rates & Growth",
      img: "https://images.unsplash.com/photo-1542228262-3d663b306a95?q=80&w=1200&auto=format&fit=crop",
      blurb: "Investors eye central bank commentary and GDP forecasts.",
      full:
        "Markets are focused on upcoming policy commentary and growth prints. Risk assets are balancing soft-landing expectations with inflation persistence, prompting selective sector leadership.",
    },
    {
      title: "Earnings Season: Key Trends",
      img: "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=1200&auto=format&fit=crop",
      blurb: "Beat-and-raise cycles broaden across large cap tech.",
      full:
        "With earnings beats widening, guidance is trending positive in software and AI-linked hardware. Margin discipline and efficient growth remain dominant investor themes.",
    },
  ];

  const placeholder = "https://source.unsplash.com/400x300/?stock,finance,market";

  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

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
          Blog & News
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((n, i) => (
            <motion.div
              key={n.title}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.4, delay: 0.1 + i * 0.05 }}
            >
              <Card className="bg-white/5 border-white/10 hover:bg-white/10 transition-colors overflow-hidden">
                <img
                  src={n.img}
                  alt={n.title}
                  className="h-36 w-full object-cover"
                  onError={(e) => {
                    const target = e.currentTarget as HTMLImageElement;
                    if (target.src !== placeholder) {
                      target.src = placeholder;
                    }
                  }}
                />
                <CardContent className="p-5">
                  <div className="text-white font-semibold mb-1">{n.title}</div>
                  <div className="text-white/70 text-sm mb-4">{n.blurb}</div>
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-emerald-500 to-purple-600 hover:from-emerald-600 hover:to-purple-700 text-white"
                    onClick={() => toggleExpand(i)}
                  >
                    {expandedIndex === i ? "Hide" : "Read More"}
                  </Button>

                  {/* Inline expandable full article */}
                  {expandedIndex === i && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 text-white/80 text-sm leading-relaxed"
                    >
                      {n.full}
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}