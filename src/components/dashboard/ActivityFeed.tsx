import { MapPin, Camera, CheckCircle2, Clock } from "lucide-react";

const feed = [
  { name: "Marcus Chen", role: "Field Engineer", status: "On-site", site: "Downtown HQ", time: "12m", color: "from-electric to-cyan-glow", icon: CheckCircle2, tag: "Check-in" },
  { name: "Sofia Reyes", role: "Logistics", status: "Delivering", site: "Route 14B", time: "24m", color: "from-emerald-glow to-cyan-glow", icon: MapPin, tag: "GPS Update" },
  { name: "Daniel Park", role: "Inspector", status: "Uploaded 4 photos", site: "Site Alpha", time: "42m", color: "from-violet-glow to-electric", icon: Camera, tag: "Media" },
  { name: "Aiko Tanaka", role: "Supervisor", status: "Shift started", site: "North Field", time: "1h", color: "from-cyan-glow to-emerald-glow", icon: Clock, tag: "Attendance" },
  { name: "Liam O'Connor", role: "Driver", status: "Geofence entered", site: "East Depot", time: "1h", color: "from-electric to-violet-glow", icon: MapPin, tag: "GPS Update" },
];

export function ActivityFeed() {
  return (
    <div className="glass-strong rounded-3xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold">Live Activity</h3>
          <p className="text-xs text-muted-foreground">Streaming workforce events</p>
        </div>
        <span className="flex items-center gap-1.5 text-[10px] text-emerald-glow">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-glow animate-pulse" /> Live
        </span>
      </div>
      <ul className="space-y-3">
        {feed.map((f, i) => {
          const I = f.icon;
          return (
            <li key={i} className="group flex items-center gap-3 rounded-2xl p-2 transition hover:bg-white/5">
              <div className={`relative grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${f.color} font-display text-sm font-bold text-white shadow-lg`}>
                {f.name.split(" ").map(n=>n[0]).join("")}
                <span className="absolute -right-0.5 -bottom-0.5 grid h-4 w-4 place-items-center rounded-full bg-background ring-2 ring-background">
                  <span className="h-2 w-2 rounded-full bg-emerald-glow shadow-[0_0_6px_var(--emerald-glow)]" />
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium">{f.name}</span>
                  <span className="text-[10px] text-muted-foreground">· {f.role}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <I className="h-3 w-3" /> {f.status} · <span className="text-cyan-glow/90">{f.site}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="rounded-full bg-white/5 px-2 py-0.5 text-[10px] text-muted-foreground ring-1 ring-white/10">{f.tag}</span>
                <div className="mt-1 text-[10px] text-muted-foreground">{f.time} ago</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
