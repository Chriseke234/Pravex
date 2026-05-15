"use client";

import { Bell, Search, Globe, ChevronDown, Command } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Topbar() {
  return (
    <header className="h-16 fixed top-0 right-0 left-64 bg-black/20 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-8 z-40">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input 
            type="text" 
            placeholder="Search transactions, assets..." 
            className="w-full bg-white/5 border border-white/10 rounded-xl py-1.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-bold text-muted-foreground bg-white/10 px-1.5 py-0.5 rounded border border-white/10">
            <Command className="w-2.5 h-2.5" />
            K
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full text-xs font-medium text-muted-foreground cursor-pointer hover:bg-white/10 transition-colors">
          <Globe className="w-3.5 h-3.5" />
          EN
          <ChevronDown className="w-3 h-3" />
        </div>

        <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-white/5">
          <Bell className="w-5 h-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full border-2 border-black" />
        </Button>

        <div className="h-8 w-[1px] bg-white/10 mx-2" />

        <div className="flex items-center gap-3 cursor-pointer group">
          <div className="text-right">
            <div className="text-sm font-bold leading-none">Portfolio Value</div>
            <div className="text-xs text-emerald-400 font-medium">$1,245,682.42</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:border-primary/50 transition-all overflow-hidden">
            <div className="w-full h-full bg-gradient-to-br from-primary/40 to-blue-600/40" />
          </div>
        </div>
      </div>
    </header>
  );
}
