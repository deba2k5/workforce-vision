import { Play, Sparkles, MapPin } from "lucide-react";
import video from "@/assets/workforce.mp4.asset.json";

const tiles = [
  { type: "video" as const, title: "Site Alpha · Walkthrough", meta: "AI summary ready", h: "h-72" },
  { type: "image" as const, title: "Downtown HQ · Progress", meta: "Marcus Chen · 12m ago", grad: "from-electric/40 via-violet-glow/30 to-cyan-glow/40", h: "h-44" },
  { type: "image" as const, title: "North Field · Inspection", meta: "Daniel Park · 42m ago", grad: "from-emerald-glow/40 via-cyan-glow/30 to-electric/30", h: "h-56" },
  { type: "image" as const, title: "East Depot · Loading", meta: "Liam O'Connor · 1h", grad: "from-violet-glow/40 via-electric/30 to-emerald-glow/30", h: "h-48" },
];

export function Multimedia() {
  return (
    <div className="glass-strong rounded-3xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold">Worksite Media</h3>
          <p className="text-xs text-muted-foreground">Recent uploads · AI-summarized</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-xl bg-white/5 px-3 py-1.5 text-xs ring-1 ring-white/10 hover:bg-white/10">
          <Sparkles className="h-3.5 w-3.5 text-cyan-glow" /> AI Insights
        </button>
      </div>
      <div className="columns-2 gap-4 [column-fill:_balance] md:columns-3">
        {tiles.map((t, i) => (
          <div key={i} className={`group relative mb-4 break-inside-avoid overflow-hidden rounded-2xl ring-1 ring-white/10 ${t.h}`}>
            {t.type === "video" ? (
              <video
                src={video.url}
                autoPlay loop muted playsInline
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${t.grad}`}>
                <div className="absolute inset-0 opacity-30" style={{backgroundImage:"radial-gradient(circle at 30% 20%, white, transparent 40%), radial-gradient(circle at 80% 70%, white, transparent 35%)"}} />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
            {t.type === "video" && (
              <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2 py-1 text-[10px] backdrop-blur-md ring-1 ring-white/10">
                <Play className="h-3 w-3 fill-white" /> LIVE
              </div>
            )}
            <div className="absolute bottom-3 left-3 right-3">
              <div className="text-sm font-medium text-white">{t.title}</div>
              <div className="flex items-center gap-1 text-[11px] text-white/70"><MapPin className="h-3 w-3" /> {t.meta}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
