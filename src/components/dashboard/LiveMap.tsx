import { Layers, Maximize2, Navigation } from "lucide-react";

const markers = [
  { x: 22, y: 35, label: "Site Alpha", count: 28, color: "var(--electric)" },
  { x: 48, y: 58, label: "Downtown HQ", count: 142, color: "var(--cyan-glow)" },
  { x: 70, y: 30, label: "North Field", count: 64, color: "var(--emerald-glow)" },
  { x: 82, y: 70, label: "East Depot", count: 41, color: "var(--violet-glow)" },
  { x: 35, y: 75, label: "South Site", count: 18, color: "var(--cyan-glow)" },
];

export function LiveMap() {
  return (
    <div className="glass-strong relative overflow-hidden rounded-3xl p-5 xl:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-lg font-semibold">Workforce Live Map</h3>
            <span className="flex items-center gap-1.5 rounded-full bg-emerald-glow/15 px-2 py-0.5 text-[10px] font-medium text-emerald-glow ring-1 ring-emerald-glow/30">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-glow opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-glow" />
              </span>
              412 online
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">Real-time GPS · Geofences · Route trails</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10"><Layers className="h-4 w-4" /></button>
          <button className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10"><Navigation className="h-4 w-4" /></button>
          <button className="grid h-9 w-9 place-items-center rounded-xl bg-white/5 ring-1 ring-white/10 hover:bg-white/10"><Maximize2 className="h-4 w-4" /></button>
        </div>
      </div>

      <div className="relative h-[420px] overflow-hidden rounded-2xl ring-1 ring-white/10">
        {/* map base */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_30%,oklch(0.3_0.08_255_/_0.6),transparent_60%),radial-gradient(ellipse_at_70%_70%,oklch(0.3_0.1_295_/_0.5),transparent_60%),linear-gradient(180deg,#0d1530,#0a0f24)]" />
        {/* topo lines */}
        <svg className="absolute inset-0 h-full w-full opacity-30" preserveAspectRatio="none" viewBox="0 0 100 100">
          {Array.from({ length: 10 }).map((_, i) => (
            <path key={i} d={`M0 ${10 + i * 9} Q 25 ${i * 9}, 50 ${15 + i * 8} T 100 ${10 + i * 9}`} fill="none" stroke="oklch(0.7_0.1_220)" strokeWidth="0.15" />
          ))}
        </svg>
        {/* grid */}
        <svg className="absolute inset-0 h-full w-full opacity-[0.08]"><pattern id="mg" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="white" strokeWidth="0.5" /></pattern><rect width="100%" height="100%" fill="url(#mg)" /></svg>
        {/* geofence */}
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon points="18,28 55,20 78,42 70,72 32,78 14,55" fill="oklch(0.72_0.18_250_/_0.08)" stroke="oklch(0.72_0.18_250_/_0.5)" strokeWidth="0.3" strokeDasharray="1.2,0.8" />
          <path d="M22 35 Q 35 50, 48 58 T 70 30" fill="none" stroke="oklch(0.82_0.15_200)" strokeWidth="0.4" strokeDasharray="0.8,0.6" opacity="0.7" />
        </svg>

        {markers.map((m, i) => (
          <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${m.x}%`, top: `${m.y}%` }}>
            <div className="relative">
              <span className="absolute inset-0 rounded-full animate-pulse-ring" style={{ background: m.color, opacity: 0.5 }} />
              <span className="relative grid h-3.5 w-3.5 place-items-center rounded-full ring-2 ring-white/80" style={{ background: m.color, boxShadow: `0 0 16px ${m.color}` }} />
            </div>
            <div className="mt-2 glass rounded-xl px-2.5 py-1.5 text-[10px] leading-tight shadow-lg backdrop-blur-md">
              <div className="font-medium text-white">{m.label}</div>
              <div className="text-muted-foreground">{m.count} active</div>
            </div>
          </div>
        ))}

        {/* legend */}
        <div className="absolute bottom-3 left-3 glass rounded-xl px-3 py-2 text-[10px] text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-electric" /> HQ</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-glow" /> Field</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-violet-glow" /> Depot</span>
          </div>
        </div>
      </div>
    </div>
  );
}
