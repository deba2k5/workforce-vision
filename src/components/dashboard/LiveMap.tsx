import { Layers, Maximize2, Navigation } from "lucide-react";

const markers = [
  { x: 22, y: 35, label: "Site Alpha", count: 28, color: "var(--primary)" },
  { x: 48, y: 58, label: "Downtown HQ", count: 142, color: "var(--teal)" },
  { x: 70, y: 30, label: "North Field", count: 64, color: "var(--emerald)" },
  { x: 82, y: 70, label: "East Depot", count: 41, color: "var(--indigo)" },
  { x: 35, y: 75, label: "South Site", count: 18, color: "var(--primary)" },
];

export function LiveMap() {
  return (
    <div className="rounded-xl border border-border bg-card p-5 xl:col-span-2">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-display text-[15px] font-semibold">Workforce Live Map</h3>
            <span className="flex items-center gap-1.5 rounded-md px-2 py-0.5 text-[10px] font-medium" style={{ background: "color-mix(in oklab, var(--emerald) 12%, white)", color: "var(--emerald)" }}>
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full opacity-75" style={{ background: "var(--emerald)" }} />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full" style={{ background: "var(--emerald)" }} />
              </span>
              412 online
            </span>
          </div>
          <p className="mt-0.5 text-xs text-muted-foreground">Real-time GPS · Geofences · Route trails</p>
        </div>
        <div className="flex items-center gap-1.5">
          <button className="grid h-8 w-8 place-items-center rounded-md border border-border bg-card hover:bg-muted"><Layers className="h-3.5 w-3.5" /></button>
          <button className="grid h-8 w-8 place-items-center rounded-md border border-border bg-card hover:bg-muted"><Navigation className="h-3.5 w-3.5" /></button>
          <button className="grid h-8 w-8 place-items-center rounded-md border border-border bg-card hover:bg-muted"><Maximize2 className="h-3.5 w-3.5" /></button>
        </div>
      </div>

      <div className="relative h-[380px] overflow-hidden rounded-lg border border-border">
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#EEF2F7,#E5EAF1)]" />
        <svg className="absolute inset-0 h-full w-full opacity-60" preserveAspectRatio="none" viewBox="0 0 100 100">
          {Array.from({ length: 10 }).map((_, i) => (
            <path key={i} d={`M0 ${10 + i * 9} Q 25 ${i * 9}, 50 ${15 + i * 8} T 100 ${10 + i * 9}`} fill="none" stroke="#C9D2DF" strokeWidth="0.15" />
          ))}
        </svg>
        <svg className="absolute inset-0 h-full w-full opacity-50"><pattern id="mg" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="#D6DCE5" strokeWidth="0.4" /></pattern><rect width="100%" height="100%" fill="url(#mg)" /></svg>
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon points="18,28 55,20 78,42 70,72 32,78 14,55" fill="color-mix(in oklab, var(--primary) 8%, transparent)" stroke="var(--primary)" strokeWidth="0.3" strokeDasharray="1,0.6" opacity="0.6" />
          <path d="M22 35 Q 35 50, 48 58 T 70 30" fill="none" stroke="var(--teal)" strokeWidth="0.4" strokeDasharray="0.8,0.6" opacity="0.7" />
        </svg>

        {markers.map((m, i) => (
          <div key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${m.x}%`, top: `${m.y}%` }}>
            <div className="relative">
              <span className="absolute inset-0 rounded-full animate-pulse-ring" style={{ background: m.color, opacity: 0.4 }} />
              <span className="relative grid h-3 w-3 place-items-center rounded-full ring-2 ring-white" style={{ background: m.color }} />
            </div>
            <div className="mt-2 rounded-md border border-border bg-card px-2 py-1 text-[10px] leading-tight shadow-sm">
              <div className="font-semibold text-foreground">{m.label}</div>
              <div className="text-muted-foreground">{m.count} active</div>
            </div>
          </div>
        ))}

        <div className="absolute bottom-3 left-3 flex items-center gap-3 rounded-md border border-border bg-card px-2.5 py-1.5 text-[10px] text-muted-foreground shadow-sm">
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{background:"var(--primary)"}} /> HQ</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{background:"var(--emerald)"}} /> Field</span>
          <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full" style={{background:"var(--indigo)"}} /> Depot</span>
        </div>
      </div>
    </div>
  );
}
