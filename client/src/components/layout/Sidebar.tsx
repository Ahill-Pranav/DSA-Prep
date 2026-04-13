"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  LayoutDashboard, 
  Map, 
  Trophy, 
  Settings, 
  LogOut,
  Target,
  Zap
} from "lucide-react";
import { cn } from "@/lib/utils";

const items = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Roadmap", icon: Map, href: "/roadmap" },
  { label: "Goals", icon: Target, href: "/goals" },
  { label: "Gamification", icon: Trophy, href: "/gamification" },
  { label: "Settings", icon: Settings, href: "/settings" },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-16 z-40 h-[calc(100vh-64px)] w-60 border-r border-white/5 bg-black/50 p-4 backdrop-blur-xl">
      <div className="flex h-full flex-col justify-between">
        <nav className="space-y-1.5">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-200",
                pathname === item.href 
                  ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-inset ring-emerald-500/20" 
                  : "text-white/40 hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 transition-colors",
                pathname === item.href ? "text-emerald-400" : "text-inherit"
              )} />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="space-y-4">
          <div className="rounded-2xl bg-linear-to-br from-emerald-500/10 to-blue-500/10 p-4 ring-1 ring-white/10">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/40">
              <Zap className="h-3 w-3 text-emerald-400" />
              Next Level
            </div>
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-white">Level 4</span>
                <span className="text-white/40">850/1000 XP</span>
              </div>
              <div className="mt-2 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                <div className="h-full w-[85%] bg-linear-to-r from-emerald-400 to-blue-500" />
              </div>
            </div>
          </div>

          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium text-white/40 transition-colors hover:bg-red-500/10 hover:text-red-400">
            <LogOut className="h-5 w-5" />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
