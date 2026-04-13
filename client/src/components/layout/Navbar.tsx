"use client";
import { Search, Bell, User, Flame } from "lucide-react";

export function Navbar() {
  return (
    <header className="fixed top-0 z-50 w-full border-b border-white/5 bg-black/50 backdrop-blur-xl">
      <div className="flex h-16 items-center justify-between px-6">
        <div className="flex items-center gap-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-blue-600 font-bold text-white shadow-lg shadow-emerald-500/20">
            D
          </div>
          <span className="text-lg font-bold tracking-tight text-white">DSA Tracker <span className="text-emerald-400">Pro</span></span>
        </div>

        <div className="flex items-center gap-6">
          <div className="hidden h-9 items-center gap-2 rounded-full bg-white/5 px-4 md:flex">
            <Search className="h-4 w-4 text-white/40" />
            <input 
              placeholder="Search problems..." 
              className="bg-transparent text-sm text-white focus:outline-none placeholder:text-white/20 w-48"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5 rounded-full bg-orange-500/10 px-3 py-1 text-orange-400 ring-1 ring-inset ring-orange-500/20">
              <Flame className="h-4 w-4 fill-current" />
              <span className="text-sm font-semibold">12 Days</span>
            </div>
            
            <button className="relative rounded-full bg-white/5 p-2 text-white/60 transition-colors hover:bg-white/10 hover:text-white">
              <Bell className="h-5 w-5" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-emerald-500" />
            </button>
            
            <div className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-white/10">
              <User className="h-full w-full p-1.5 text-white/40" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
