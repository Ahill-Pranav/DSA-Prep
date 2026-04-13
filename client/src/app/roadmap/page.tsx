"use client";
import { useState, useMemo } from "react";
import { 
  CheckCircle2, 
  ExternalLink, 
  Search, 
  Filter,
  MoreVertical,
  Plus
} from "lucide-react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const PHASES = [
  {id:0,  title:"Programming Basics",    desc:"Logic building without DSA"},
  {id:1,  title:"Arrays & Strings",      desc:"Core data manipulation, sliding window"},
  {id:10, title:"Dynamic Programming",  desc:"Memoization, tabulation, classic patterns"},
];

const PLATFORMS: any = {
  leetcode:   { label:"LeetCode",   color:"text-[#FFA116]", bg:"bg-[#FFA116]/10" },
  hackerrank: { label:"HackerRank", color:"text-[#00EA64]", bg:"bg-[#00EA64]/10" },
};

const PROBLEMS = [
  {"id":"p0_1", "phase":0,"title":"FizzBuzz", "platform":"leetcode", "difficulty":"easy", "tags": ["math", "strings"]},
  {"id":"p0_2", "phase":0,"title":"Palindrome Number", "platform":"leetcode", "difficulty":"easy", "tags": ["math"]},
  {"id":"p1_1", "phase":1,"title":"Two Sum", "platform":"leetcode", "difficulty":"easy", "tags": ["array", "hash-table"]},
  {"id":"p10_1", "phase":10,"title":"House Robber", "platform":"leetcode", "difficulty":"medium", "tags": ["dp"]},
];

import { SyncButton } from "@/components/roadmap/SyncButton";

export default function RoadmapPage() {
  const [activePhase, setAP] = useState(0);
  const [completed, setCompleted] = useState<Set<string>>(new Set(["p0_1"]));

  const currentProblems = useMemo(() => 
    PROBLEMS.filter(p => p.phase === activePhase), 
  [activePhase]);

  const toggle = (id: string) => {
    const next = new Set(completed);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setCompleted(next);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <header className="flex items-end justify-between border-b border-white/5 pb-6">
        <div className="space-y-1">
          <h1 className="text-3xl font-bold tracking-tight">DSA Roadmap</h1>
          <p className="text-white/40 italic">Phase {activePhase}: {PHASES.find(p => p.id === activePhase)?.title}</p>
        </div>
        <div className="flex gap-3 items-center">
          <SyncButton />
          <button className="flex items-center gap-2 rounded-xl bg-white/5 px-4 py-2 text-sm font-medium hover:bg-white/10 ring-1 ring-white/10">
            <Filter className="h-4 w-4" />
            Filters
          </button>
          <button className="flex items-center gap-2 rounded-xl bg-emerald-500 px-4 py-2 text-sm font-bold text-black hover:bg-emerald-400">
            <Plus className="h-4 w-4" />
            Add Problem
          </button>
        </div>
      </header>

      <div className="flex gap-8">
        {/* Sidebar Phases */}
        <aside className="w-64 shrink-0 space-y-1">
          {PHASES.map((phase) => (
            <button
              key={phase.id}
              onClick={() => setAP(phase.id)}
              className={`w-full rounded-xl px-4 py-3 text-left transition-all ${
                activePhase === phase.id 
                  ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20" 
                  : "text-white/40 hover:bg-white/5 hover:text-white"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-bold uppercase tracking-widest opacity-50">#0{phase.id}</span>
                {activePhase === phase.id && <div className="h-1 w-1 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,1)]" />}
              </div>
              <div className="font-semibold text-sm">{phase.title}</div>
            </button>
          ))}
        </aside>

        {/* Problem List */}
        <div className="flex-1 rounded-2xl border border-white/5 bg-white/[0.02] overflow-hidden">
          <Table>
            <TableHeader className="bg-white/[0.03]">
              <TableRow className="hover:bg-transparent border-white/5">
                <TableHead className="w-[50px] text-center">Done</TableHead>
                <TableHead>Problem</TableHead>
                <TableHead>Platform</TableHead>
                <TableHead>Difficulty</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentProblems.map((prob) => (
                <TableRow key={prob.id} className="border-white/5 hover:bg-white/[0.02]">
                  <TableCell className="text-center">
                    <Checkbox 
                      checked={completed.has(prob.id)} 
                      onCheckedChange={() => toggle(prob.id)}
                      className="border-white/20 data-[state=checked]:bg-emerald-500 data-[state=checked]:border-emerald-500"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className={`font-medium ${completed.has(prob.id) ? 'text-white/20 line-through' : 'text-white/80'}`}>
                        {prob.title}
                      </span>
                      <span className="text-[10px] text-white/20 font-mono">ID: {prob.id}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={`border-none ${PLATFORMS[prob.platform].bg} ${PLATFORMS[prob.platform].color} font-bold text-[10px]`}>
                      {PLATFORMS[prob.platform].label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className={`text-xs font-bold uppercase tracking-wider ${
                      prob.difficulty === 'easy' ? 'text-emerald-400' : 
                      prob.difficulty === 'medium' ? 'text-orange-400' : 'text-red-400'
                    }`}>
                      {prob.difficulty}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {prob.tags.map(tag => (
                        <span key={tag} className="text-[10px] text-white/30 hover:text-white/60 transition-colors cursor-pointer">#{tag}</span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button className="h-8 w-8 rounded-lg hover:bg-white/5 flex items-center justify-center text-white/20 hover:text-white">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-[#0c0c0c] border-white/10 text-white">
                        <DropdownMenuItem className="focus:bg-white/5 focus:text-emerald-400 cursor-pointer">
                          <ExternalLink className="mr-2 h-4 w-4" /> Open Link
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-white/5 cursor-pointer">
                          Add Notes
                        </DropdownMenuItem>
                        <DropdownMenuItem className="focus:bg-white/5 text-red-400 cursor-pointer">
                          Clear Progress
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
