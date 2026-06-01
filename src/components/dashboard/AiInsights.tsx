import { Sparkles, AlertTriangle, TrendingUp, Zap, ArrowRight } from "lucide-react";

const insights = [
  { icon: TrendingUp, label: "Productivity uptrend", value: "+12.4%", desc: "Field Ops outperforming forecast this week.", tint: "var(--emerald)" },
  { icon: AlertTriangle, label: "Burnout risk", value: "3 employees", desc: "Sustained >55h weekly load detected.", tint: "var(--amber)" },
  { icon: Zap, label: "Efficiency score", value: "92 / 100", desc: "Top quartile across all departments.", tint: "var(--primary)" },
];

export function AiInsights() {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: "color-mix(in oklab, var(--primary) 12%, white)", color: "var(--primary)" }}>
            <Sparkles className="h-4 w-4" strokeWidth={2.25} />
          </div>
          <div>
            <h3 className="font-display text-[15px] font-semibold">AI Insights</h3>
            <p className="text-xs text-muted-foreground">Updated 2 min ago</p>
          </div>
        </div>
        <span className="rounded-md border border-border bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">BETA</span>
      </div>

      <div className="space-y-2.5">
        {insights.map((i, idx) => {
          const I = i.icon;
          return (
            <div key={idx} className="flex items-start gap-3 rounded-lg border border-border bg-card p-3 transition hover:bg-muted/50">
              <div className="grid h-8 w-8 shrink-0 place-items-center rounded-md" style={{ background: `color-mix(in oklab, ${i.tint} 14%, white)`, color: i.tint }}>
                <I className="h-4 w-4" strokeWidth={2.25} />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium">{i.label}</span>
                  <span className="text-sm font-semibold tabular-nums" style={{ color: i.tint }}>{i.value}</span>
                </div>
                <p className="mt-0.5 text-xs text-muted-foreground">{i.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      <button className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition hover:opacity-95">
        Generate weekly briefing <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
