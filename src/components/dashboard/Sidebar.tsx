import { LayoutDashboard, Users, Clock, MapPin, FileBarChart, BarChart3, Hexagon, Activity, Settings } from "lucide-react";

const items = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Users, label: "Employees" },
  { icon: Clock, label: "Attendance" },
  { icon: MapPin, label: "GPS Tracking" },
  { icon: FileBarChart, label: "Reports" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Hexagon, label: "Geofencing" },
  { icon: Activity, label: "Productivity" },
  { icon: Settings, label: "Settings" },
];

export function Sidebar() {
  return (
    <aside className="sticky top-6 hidden h-[calc(100vh-3rem)] w-20 shrink-0 lg:flex">
      <div className="glass-strong flex w-full flex-col items-center gap-2 rounded-3xl p-3">
        <div className="mb-2 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-electric to-violet-glow shadow-[0_0_30px_-4px_var(--electric)]">
          <Hexagon className="h-6 w-6 text-white" />
        </div>
        <nav className="flex flex-1 flex-col gap-1.5">
          {items.map(({ icon: Icon, label, active }) => (
            <button
              key={label}
              title={label}
              className={`group relative grid h-12 w-14 place-items-center rounded-2xl transition-all ${
                active
                  ? "bg-white/10 text-white shadow-[inset_0_0_0_1px_oklch(1_0_0_/_0.12)]"
                  : "text-muted-foreground hover:bg-white/5 hover:text-white"
              }`}
            >
              {active && <span className="absolute -left-3 h-6 w-1 rounded-r-full bg-gradient-to-b from-electric to-cyan-glow shadow-[0_0_12px_var(--electric)]" />}
              <Icon className="h-5 w-5" />
              <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-lg bg-popover px-2.5 py-1 text-xs opacity-0 shadow-lg ring-1 ring-white/10 transition-opacity group-hover:opacity-100">
                {label}
              </span>
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
}
