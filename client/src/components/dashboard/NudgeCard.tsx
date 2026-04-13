"use client";
import { Info, PartyPopper, Lightbulb } from "lucide-react";
import { motion } from "framer-motion";

export function NudgeCard({ stats }: { stats: any }) {
  const getMessage = () => {
    if (stats.weekly_progress.remaining === 0) {
      return {
        title: "Weekly Goal Smashed!",
        message: "You've hit your target. Why not try one extra challenge today?",
        icon: PartyPopper,
        color: "text-emerald-400",
        bg: "bg-emerald-500/10"
      };
    }
    if (stats.weekly_progress.daily_suggestion > 4) {
      return {
        title: "Time to Level Up!",
        message: "You're a bit behind your weekly goal. Solve 5 problems today to catch up!",
        icon: Lightbulb,
        color: "text-yellow-400",
        bg: "bg-yellow-500/10"
      };
    }
    return {
      title: "Keep the Momentum!",
      message: "You're doing great. Just a few more to hit your streak milestone.",
      icon: Info,
      color: "text-blue-400",
      bg: "bg-blue-500/10"
    };
  };

  const current = getMessage();

  return (
    <motion.div 
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`flex items-start gap-4 rounded-2xl ${current.bg} p-6 ring-1 ring-inset ring-white/5`}
    >
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/5 ${current.color}`}>
        <current.icon className="h-6 w-6" />
      </div>
      <div>
        <h3 className={`text-lg font-bold ${current.color}`}>{current.title}</h3>
        <p className="mt-1 text-white/60">{current.message}</p>
      </div>
    </motion.div>
  );
}
