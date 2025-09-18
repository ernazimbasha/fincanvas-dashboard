import { motion } from "framer-motion";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export function FAQ() {
  const faqs = [
    { q: "Is FinCanvas AI free to try?", a: "Yes, you can explore a fully interactive demo instantly." },
    { q: "Do you offer real-time data?", a: "The demo uses mock data; production supports real-time feeds." },
    { q: "Can I collaborate with teammates?", a: "Yes, share canvases and annotate together in real time." },
    { q: "Is my data secure?", a: "We follow best practices with encryption and access controls." },
    { q: "Does this provide investment advice?", a: "No. For educational purposes only. Not investment advice." },
  ];
  return (
    <section className="relative z-10 px-6 py-16">
      <div className="max-w-3xl mx-auto">
        <motion.h2 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-3xl md:text-4xl font-bold text-white mb-8 text-center">
          FAQ
        </motion.h2>
        <Accordion type="single" collapsible className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl">
          {faqs.map((f, i) => (
            <AccordionItem key={i} value={`item-${i}`} className="border-white/10">
              <AccordionTrigger className="px-4 text-white">{f.q}</AccordionTrigger>
              <AccordionContent className="px-4 pb-4 text-white/80">{f.a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
