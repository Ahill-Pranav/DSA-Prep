"use client";
import { useEffect, useState } from "react";
import { 
  Trophy, 
  Flame, 
  Target, 
  Star, 
  ChevronRight,
  TrendingUp
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";

import { NudgeCard } from "@/components/dashboard/NudgeCard";

export default function DashboardPage() {
  const [stats, setStats] = useState<any>(null);

  // Mock stats for initial UI build
  const mockStats = {
    total_solved: 164,
    streak: 12,
    xp: 2450,
    level: 4,
    weekly_progress: {
      solved: 8,
      goal: 20,
      remaining: 12,
      daily_suggestion: 3
    },
    recommendations: [
      { id: "p10_1", title: "House Robber", platform: "leetcode", difficulty: "medium" },
      { id: "p7_5", title: "Validate BST", platform: "leetcode", difficulty: "medium" },
    ]
  };

  useEffect(() => {
    setStats(mockStats);
  }, []);

  if (!stats) return null;

  return (
    <div className="mx-auto max-w-7xl space-y-8 animate-in fade-in duration-700">
      <header className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Welcome back, <span className="text-emerald-400">Achiever</span>!</h1>
        <p className="text-white/40">You're on fire today. Keep pushing towards your weekly goal.</p>
      </header>

      {/* Main Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[
          { title: "Problems Solved", value: stats.total_solved, sub: "Total count", icon: Trophy, color: "text-emerald-400" },
          { title: "Day Streak", value: stats.streak, sub: "Longest: 18", icon: Flame, color: "text-orange-400" },
          { title: "Total XP", value: stats.xp, sub: "Next level in 150", icon: Star, color: "text-blue-400" },
          { title: "Level", value: stats.level, sub: "Expert Learner", icon: TrendingUp, color: "text-purple-400" },
        ].map((stat, i) => (
          <motion.div
            key={stat.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="border-white/5 bg-white/5 backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between pb-2 shadow-none border-b-0 space-y-0">
                <CardTitle className="text-sm font-medium text-white/40">{stat.title}</CardTitle>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </CardHeader>
              <CardContent className="shadow-none border-none p-6 pt-0">
                <div className="text-2xl font-bold">{stat.value}</div>
                <p className="text-xs text-white/20 mt-1">{stat.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        {/* Weekly Goal & Heatmap Column */}
        <div className="md:col-span-4 space-y-6">
          <NudgeCard stats={stats} />
          
          <Card className="border-white/5 bg-white/5">
            <CardHeader className="shadow-none border-none">
              <div className="flex items-center justify-between pb-2 border-none shadow-none">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="h-5 w-5 text-emerald-400" />
                  Weekly Progress
                </CardTitle>
                <span className="text-sm text-white/40">{stats.weekly_progress.solved}/{stats.weekly_progress.goal} solved</span>
              </div>
            </CardHeader>
            <CardContent className="shadow-none border-none">
              <Progress value={(stats.weekly_progress.solved / stats.weekly_progress.goal) * 100} className="h-3 bg-white/5" />
              <div className="mt-6 flex items-start gap-4 rounded-2xl bg-emerald-500/5 p-4 ring-1 ring-emerald-500/10">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400 font-bold text-xl">
                  {stats.weekly_progress.daily_suggestion}
                </div>
                <div>
                  <h4 className="font-semibold text-emerald-400">Daily Target Suggestion</h4>
                  <p className="text-sm text-white/60">To hit your goal of {stats.weekly_progress.goal} per week, solve {stats.weekly_progress.daily_suggestion} problems daily.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity Heatmap Placeholder */}
          <Card className="border-white/5 bg-white/5">
            <CardHeader className="shadow-none border-none">
              <CardTitle className="text-lg">Consistency Heatmap</CardTitle>
            </CardHeader>
            <CardContent className="shadow-none border-none flex flex-wrap gap-1">
              {Array.from({ length: 180 }).map((_, i) => (
                <div 
                  key={i} 
                  className={`h-3 w-3 rounded-[2px] ${Math.random() > 0.8 ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.3)]' : 'bg-white/5'}`} 
                />
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Recommendations Column */}
        <div className="md:col-span-3 space-y-6">
          <Card className="border-white/5 bg-white/5 overflow-hidden">
            <CardHeader className="shadow-none border-none bg-white/[0.02]">
              <CardTitle className="text-lg flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-400" />
                Smart Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent className="shadow-none border-none p-0">
              {stats.recommendations.map((prob: any) => (
                <div key={prob.id} className="group flex items-center justify-between border-b border-white/5 p-4 transition-colors hover:bg-white/5 cursor-pointer">
                  <div className="space-y-1">
                    <h5 className="font-medium text-white/80 group-hover:text-white">{prob.title}</h5>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] uppercase tracking-wider text-white/20 font-bold">{prob.platform}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase ${
                        prob.difficulty === 'easy' ? 'bg-emerald-500/10 text-emerald-400' : 
                        prob.difficulty === 'medium' ? 'bg-orange-500/10 text-orange-400' : 'bg-red-500/10 text-red-400'
                      }`}>
                        {prob.difficulty}
                      </span>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-white/20 transition-transform group-hover:translate-x-1" />
                </div>
              ))}
              <div className="p-4">
                <button className="w-full rounded-xl bg-white/5 py-2.5 text-sm font-semibold transition-colors hover:bg-white/10">
                  View Full Roadmap
                </button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Zap(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 14.71 13 4.5l-1 7.29h6l-9 10.21 1-7.29z" />
    </svg>
  );
}
