import { Play, Sparkles, MapPin } from "lucide-react";
import video from "@/assets/workforce.mp4.asset.json";

const tiles = [
  { type: "video" as const, title: "Site Alpha · Walkthrough", meta: "AI summary ready", h: "h-72" },
  { type: "image" as const, title: "Downtown HQ · Progress", meta: "Marcus Chen · 12m ago", grad: "linear-gradient(135deg,#FFD3BD,#FFB58E)", h: "h-44" },
  { type: "image" as const, title: "North Field · Inspection", meta: "Daniel Park · 42m ago", grad: "linear-gradient(135deg,#BFEAE3,#8FD4CC)", h: "h-56" },
  { type: "image" as const, title: "East Depot · Loading", meta: "Liam O'Connor · 1h", grad: "linear-gradient(135deg,#D7D4FF,#B0AAF5)", h: "h-48" },
];

export function Multimedia() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-[15px] font-semibold">Worksite Media</h3>
          <p className="text-xs text-muted-foreground">Recent uploads · AI-summarized</p>
        </div>
        <button className="flex items-center gap-1.5 rounded-md border border-border bg-card px-2.5 py-1.5 text-xs font-medium hover:bg-muted">
          <Sparkles className="h-3.5 w-3.5 text-primary" /> AI Insights
        </button>
      </div>
      <div className="columns-2 gap-4 md:columns-3">
        {tiles.map((t, i) => (
          <div key={i} className={`group relative mb-4 break-inside-avoid overflow-hidden rounded-lg border border-border ${t.h}`}>
            {t.type === "video" ? (
              <video src={video.url} autoPlay loop muted playsInline className="absolute inset-0 h-full w-full object-cover" />
            ) : (
              <div className="absolute inset-0" style={{ background: t.grad }} />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            {t.type === "video" && (
              <div className="absolute left-2.5 top-2.5 flex items-center gap-1 rounded-md bg-white/95 px-1.5 py-0.5 text-[10px] font-medium text-foreground">
                <Play className="h-2.5 w-2.5 fill-primary text-primary" /> LIVE
              </div>
            )}
            <div className="absolute bottom-2.5 left-2.5 right-2.5">
              <div className="text-sm font-medium text-white">{t.title}</div>
              <div className="flex items-center gap-1 text-[11px] text-white/80"><MapPin className="h-3 w-3" /> {t.meta}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
