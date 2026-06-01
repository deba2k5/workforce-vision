import { Brain, AlertTriangle, TrendingUp, Zap } from "lucide-react";

const insights = [
  { icon: TrendingUp, label: "Productivity uptrend", value: "+12.4%", desc: "Field Ops outperforming forecast this week.", color: "text-emerald-glow", ring: "ring-emerald-glow/30", bg: "bg-emerald-glow/10" },
  { icon: AlertTriangle, label: "Burnout risk", value: "3 employees", desc: "Sustained >55h weekly load detected.", color: "text-amber-300", ring: "ring-amber-300/30", bg: "bg-amber-300/10" },
  { icon: Zap, label: "Efficiency score", value: "92 / 100", desc: "Top quartile across all departments.", color: "text-electric", ring: "ring-electric/30", bg: "bg-electric/10" },
];

export function AiInsights() {
  return (
    <div className="glass-strong relative overflow-hidden rounded-3xl p-5">
      <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full bg-violet-glow/30 blur-3xl" />
      <div className="absolute -left-10 bottom-0 h-40 w-40 rounded-full bg-electric/20 blur-3xl" />
      <div className="relative">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-gradient-to-br from-violet-glow to-electric shadow-[0_0_24px_-4px_var(--violet-glow)]">
              <Brain className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-display text-lg font-semibold">AI Workforce Intelligence</h3>
              <p className="text-xs text-muted-foreground">Predictive insights · updated 2m ago</p>
            </div>
          </div>
          <span className="rounded-full bg-violet-glow/15 px-2.5 py-1 text-[10px] font-medium text-violet-glow ring-1 ring-violet-glow/30">BETA</span>
        </div>

        <div className="space-y-3">
          {insights.map((i, idx) => {
            const I = i.icon;
            return (
              <div key={idx} className={`flex items-start gap-3 rounded-2xl p-3 ring-1 ${i.ring} ${i.bg}`}>
                <div className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/5 ${i.color}`}>
                  <I className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-medium">{i.label}</span>
                    <span className={`text-sm font-semibold tabular-nums ${i.color}`}>{i.value}</span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{i.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        <button className="mt-4 w-full rounded-2xl bg-gradient-to-r from-electric via-violet-glow to-electric bg-[length:200%_100%] py-2.5 text-sm font-medium text-white shadow-[0_0_30px_-8px_var(--electric)] transition hover:bg-[position:100%_0]">
          Generate weekly briefing
        </button>
      </div>
    </div>
  );
}
