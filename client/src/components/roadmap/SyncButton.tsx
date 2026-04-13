"use client";
import { useState } from "react";
import { RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import api from "@/lib/api";

export function SyncButton() {
  const [syncing, setSyncing] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSync = async () => {
    setSyncing(true);
    setStatus("idle");
    try {
      const response = await api.post("/sync/all");
      console.log("Sync Results:", response.data);
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    } catch (error) {
      console.error("Sync failed:", error);
      setStatus("error");
      setTimeout(() => setStatus("idle"), 3000);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <button
      onClick={handleSync}
      disabled={syncing}
      className={`group flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-all duration-300 ${
        status === "success" 
          ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/40"
          : status === "error"
          ? "bg-red-500/20 text-red-400 ring-1 ring-red-500/40"
          : "bg-white/5 text-white/80 hover:bg-white/10 hover:text-white ring-1 ring-white/10"
      }`}
    >
      {syncing ? (
        <RefreshCw className="h-4 w-4 animate-spin text-emerald-400" />
      ) : status === "success" ? (
        <CheckCircle className="h-4 w-4 text-emerald-400" />
      ) : status === "error" ? (
        <AlertCircle className="h-4 w-4 text-red-400" />
      ) : (
        <RefreshCw className="h-4 w-4 transition-transform group-hover:rotate-180 duration-500" />
      )}
      <span>
        {syncing ? "Syncing..." : status === "success" ? "All Platforms Synced!" : status === "error" ? "Sync Failed" : "Sync All Platforms"}
      </span>
    </button>
  );
}
