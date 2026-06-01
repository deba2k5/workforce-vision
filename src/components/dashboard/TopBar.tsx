import { Search, Bell, Command, ChevronDown } from "lucide-react";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 -mx-6 mb-6 flex items-center gap-4 border-b border-border bg-background/85 px-6 py-3 backdrop-blur-md">
      <div className="relative flex-1 max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          placeholder="Search employees, sites, reports…"
          className="h-9 w-full rounded-lg border border-border bg-card pl-9 pr-14 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary/40 focus:ring-2 focus:ring-primary/15"
        />
        <kbd className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-0.5 rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">
          <Command className="h-3 w-3" />K
        </kbd>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button className="hidden h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-medium text-foreground hover:bg-muted md:flex">
          This week <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
        <button className="relative grid h-9 w-9 place-items-center rounded-lg border border-border bg-card hover:bg-muted">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-primary" />
        </button>
        <div className="flex h-9 items-center gap-2.5 rounded-lg border border-border bg-card pl-1 pr-3">
          <div className="grid h-7 w-7 place-items-center rounded-md bg-primary font-display text-[11px] font-semibold text-primary-foreground">AK</div>
          <div className="hidden text-left leading-tight sm:block">
            <div className="text-xs font-medium">Ana Kowalski</div>
            <div className="text-[10px] text-muted-foreground">Operations Lead</div>
          </div>
        </div>
      </div>
    </header>
  );
}
