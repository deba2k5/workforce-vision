import { LayoutDashboard, Users, Clock, MapPin, FileBarChart, BarChart3, Hexagon, Activity, Settings, HelpCircle } from "lucide-react";

const items = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: Users, label: "Employees" },
  { icon: Clock, label: "Attendance" },
  { icon: MapPin, label: "GPS Tracking" },
  { icon: FileBarChart, label: "Reports" },
  { icon: BarChart3, label: "Analytics" },
  { icon: Hexagon, label: "Geofencing" },
  { icon: Activity, label: "Productivity" },
];

export function Sidebar() {
  return (
    <aside className="sticky top-0 hidden h-screen w-60 shrink-0 lg:flex">
      <div className="flex w-full flex-col bg-sidebar text-sidebar-foreground">
        <div className="flex items-center gap-2.5 px-5 py-5">
          <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary">
            <Hexagon className="h-4 w-4 text-primary-foreground" strokeWidth={2.5} />
          </div>
          <span className="font-display text-base font-semibold tracking-tight">Workforce<span className="text-primary">.</span>iQ</span>
        </div>

        <div className="px-3 pb-2 pt-1">
          <div className="px-2 pb-2 text-[10px] font-semibold uppercase tracking-wider text-white/40">Workspace</div>
          <nav className="flex flex-col gap-0.5">
            {items.map(({ icon: Icon, label, active }) => (
              <button
                key={label}
                className={`group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm transition ${
                  active
                    ? "bg-white/10 text-white"
                    : "text-white/65 hover:bg-white/5 hover:text-white"
                }`}
              >
                {active && <span className="absolute left-0 top-1.5 h-5 w-0.5 rounded-r-full bg-primary" />}
                <Icon className="h-4 w-4" strokeWidth={2} />
                <span>{label}</span>
                {label === "Attendance" && (
                  <span className="ml-auto rounded-full bg-primary/20 px-1.5 py-0.5 text-[10px] font-medium text-primary">12</span>
                )}
              </button>
            ))}
          </nav>
        </div>

        <div className="mt-auto px-3 pb-4">
          <div className="flex flex-col gap-0.5">
            <button className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-white/65 transition hover:bg-white/5 hover:text-white">
              <Settings className="h-4 w-4" /> Settings
            </button>
            <button className="flex items-center gap-3 rounded-lg px-2.5 py-2 text-sm text-white/65 transition hover:bg-white/5 hover:text-white">
              <HelpCircle className="h-4 w-4" /> Help & Support
            </button>
          </div>
          <div className="mt-3 rounded-xl bg-white/[0.04] p-3 ring-1 ring-white/10">
            <div className="text-xs font-medium text-white">Pro Plan</div>
            <div className="mt-0.5 text-[11px] text-white/55">2,847 / 3,000 seats</div>
            <div className="mt-2 h-1 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[94%] rounded-full bg-primary" />
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
