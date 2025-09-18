import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, Target, Zap } from "lucide-react";
import { motion } from "framer-motion";

export function ProjectSummary() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
      className="mb-6"
    >
      <Card className="bg-white/5 backdrop-blur-md border-white/10 shadow-xl">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-white">
              FinCanvas AI (Guaranteed Winner)
            </CardTitle>
            <Badge className="bg-gradient-to-r from-emerald-500 to-purple-600 text-white">
              MVP Ready
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-red-500/20">
                <Target className="h-5 w-5 text-red-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Problem</h3>
                <p className="text-xs text-white/70 mt-1">
                  In 2025's volatile markets (Nifty swings 15% YTD per NSE), 80% Indian retail investors lose money due to confusing charts and generic advice (SEBI report).
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-500/20">
                <Lightbulb className="h-5 w-5 text-emerald-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Solution</h3>
                <p className="text-xs text-white/70 mt-1">
                  FinCanvas AI is an AI-native collaborative canvas where users "draw" stock queries and get personalized, interactive charts with predictive insights.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <Zap className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm">Features</h3>
                <p className="text-xs text-white/70 mt-1">
                  Interactive Canvas, Preference Engine, Collab Mode, Risk Alerts, and Analytics Dashboard for Gen Z finance literacy.
                </p>
              </div>
            </div>
          </div>
          
          <div className="pt-2 border-t border-white/10">
            <p className="text-xs text-white/60">
              <strong>Tech Stack:</strong> React + Fabric.js (canvas), Python FastAPI + Hugging Face (AI), Firebase (realtime collab), Vercel deployment
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
