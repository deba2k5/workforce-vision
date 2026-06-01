import { Search, Bell, Sun, Command } from "lucide-react";

export function TopBar() {
  return (
    <header className="glass sticky top-0 z-30 mb-6 flex items-center gap-4 rounded-3xl px-4 py-3">
      <div className="lg:hidden grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-electric to-violet-glow">
        <span className="font-display text-sm font-bold text-white">WI</span>
      </div>
      <div className="hidden md:flex items-center gap-2 pl-2">
        <span className="font-display text-lg font-semibold tracking-tight">Workforce<span className="text-cyan-glow">.</span>iQ</span>
        <span className="ml-2 rounded-full bg-emerald-glow/15 px-2 py-0.5 text-[10px] font-medium text-emerald-glow ring-1 ring-emerald-glow/30">LIVE</span>
      </div>

      <div className="relative ml-2 flex-1 max-w-xl">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search employees, sites, reports…"
          className="h-10 w-full rounded-2xl border border-white/10 bg-white/5 pl-10 pr-16 text-sm text-foreground placeholder:text-muted-foreground/70 outline-none transition focus:border-electric/50 focus:bg-white/10 focus:ring-2 focus:ring-electric/20"
        />
        <kbd className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1 rounded-md bg-white/5 px-1.5 py-0.5 text-[10px] text-muted-foreground ring-1 ring-white/10">
          <Command className="h-3 w-3" /> K
        </kbd>
      </div>

      <button className="grid h-10 w-10 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition">
        <Sun className="h-4 w-4" />
      </button>
      <button className="relative grid h-10 w-10 place-items-center rounded-2xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition">
        <Bell className="h-4 w-4" />
        <span className="absolute right-2.5 top-2.5 h-2 w-2 rounded-full bg-emerald-glow shadow-[0_0_8px_var(--emerald-glow)]" />
      </button>
      <div className="flex items-center gap-3 rounded-2xl bg-white/5 py-1 pl-1 pr-3 ring-1 ring-white/10">
        <div className="grid h-8 w-8 place-items-center rounded-xl bg-gradient-to-br from-violet-glow to-electric font-display text-xs font-bold text-white">AK</div>
        <div className="hidden sm:block text-left leading-tight">
          <div className="text-xs font-medium">Ana Kowalski</div>
          <div className="text-[10px] text-muted-foreground">Operations Lead</div>
        </div>
      </div>
    </header>
  );
}
