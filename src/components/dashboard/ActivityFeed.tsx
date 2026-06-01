import { MapPin, Camera, CheckCircle2, Clock } from "lucide-react";

const feed = [
  { name: "Marcus Chen", role: "Field Engineer", status: "Checked in", site: "Downtown HQ", time: "12m", icon: CheckCircle2, tag: "Attendance", tint: "var(--emerald)" },
  { name: "Sofia Reyes", role: "Logistics", status: "On route", site: "Route 14B", time: "24m", icon: MapPin, tag: "GPS", tint: "var(--teal)" },
  { name: "Daniel Park", role: "Inspector", status: "Uploaded 4 photos", site: "Site Alpha", time: "42m", icon: Camera, tag: "Media", tint: "var(--indigo)" },
  { name: "Aiko Tanaka", role: "Supervisor", status: "Shift started", site: "North Field", time: "1h", icon: Clock, tag: "Attendance", tint: "var(--primary)" },
  { name: "Liam O'Connor", role: "Driver", status: "Geofence entered", site: "East Depot", time: "1h", icon: MapPin, tag: "GPS", tint: "var(--teal)" },
];

const initialsBg = ["#FFE5D9","#D9F1EE","#E2E0FF","#FFEAD1","#D6F1E0"];

export function ActivityFeed() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-[15px] font-semibold">Live Activity</h3>
          <p className="text-xs text-muted-foreground">Streaming workforce events</p>
        </div>
        <button className="text-xs font-medium text-primary hover:underline">View all</button>
      </div>
      <ul className="divide-y divide-border">
        {feed.map((f, i) => {
          const I = f.icon;
          return (
            <li key={i} className="flex items-center gap-3 py-3 first:pt-0 last:pb-0">
              <div className="relative grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-xs font-semibold text-foreground/80" style={{ background: initialsBg[i] }}>
                {f.name.split(" ").map(n=>n[0]).join("")}
                <span className="absolute -right-0 -bottom-0 h-2.5 w-2.5 rounded-full ring-2 ring-card" style={{ background: "var(--emerald)" }} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-sm">
                  <span className="truncate font-medium">{f.name}</span>
                  <span className="text-xs text-muted-foreground">· {f.role}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <I className="h-3 w-3" style={{ color: f.tint }} /> {f.status} · <span className="text-foreground/70">{f.site}</span>
                </div>
              </div>
              <div className="text-right">
                <span className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] text-muted-foreground">{f.tag}</span>
                <div className="mt-1 text-[10px] text-muted-foreground">{f.time} ago</div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
