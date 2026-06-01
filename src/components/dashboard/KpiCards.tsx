import { Users, Timer, Gauge, Satellite, TrendingUp, TrendingDown } from "lucide-react";
import { useEffect, useState } from "react";

type Kpi = {
  label: string;
  value: number;
  suffix?: string;
  delta: number;
  icon: typeof Users;
  accent: string;
  spark: number[];
};

const kpis: Kpi[] = [
  { label: "Active Employees", value: 2847, delta: 4.2, icon: Users, accent: "from-electric to-cyan-glow", spark: [12,18,14,22,28,24,32,30,38,42] },
  { label: "Total Hours Logged", value: 18642, suffix: "h", delta: 2.8, icon: Timer, accent: "from-cyan-glow to-emerald-glow", spark: [20,22,26,24,30,28,34,38,36,44] },
  { label: "Productivity Score", value: 92, suffix: "%", delta: 1.6, icon: Gauge, accent: "from-emerald-glow to-cyan-glow", spark: [80,82,79,85,88,86,90,89,91,92] },
  { label: "Field Workforce Online", value: 412, delta: -0.6, icon: Satellite, accent: "from-violet-glow to-electric", spark: [30,28,32,30,34,33,31,30,29,30] },
];

function useCount(target: number, duration = 900) {
  const [v, setV] = useState(0);
  useEffect(() => {
    let raf = 0; const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setV(Math.floor(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return v;
}

function Spark({ data, accent }: { data: number[]; accent: string }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d - min) / (max - min || 1)) * 100;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-12 w-full">
      <defs>
        <linearGradient id={`g-${accent}`} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.35" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polyline points={pts} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <polygon points={`0,100 ${pts} 100,100`} fill={`url(#g-${accent})`} />
    </svg>
  );
}

export function KpiCards() {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((k, i) => {
        const Icon = k.icon;
        const v = useCount(k.value);
        const positive = k.delta >= 0;
        return (
          <div key={k.label} className="glass group relative overflow-hidden rounded-3xl p-5 transition-all hover:-translate-y-0.5 hover:glow-ring animate-count-up" style={{ animationDelay: `${i * 60}ms` }}>
            <div className={`absolute -right-12 -top-12 h-40 w-40 rounded-full bg-gradient-to-br ${k.accent} opacity-20 blur-2xl transition-opacity group-hover:opacity-40`} />
            <div className="relative flex items-start justify-between">
              <div className={`grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br ${k.accent} text-white shadow-lg`}>
                <Icon className="h-5 w-5" />
              </div>
              <span className={`flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ${positive ? "bg-emerald-glow/10 text-emerald-glow ring-emerald-glow/30" : "bg-destructive/10 text-destructive ring-destructive/30"}`}>
                {positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                {Math.abs(k.delta)}%
              </span>
            </div>
            <div className="relative mt-5">
              <div className="text-xs text-muted-foreground">{k.label}</div>
              <div className="mt-1 font-display text-3xl font-semibold tracking-tight text-gradient">
                {v.toLocaleString()}{k.suffix}
              </div>
            </div>
            <div className={`relative mt-3 text-cyan-glow`} style={{ color: "var(--cyan-glow)" }}>
              <Spark data={k.spark} accent={k.label} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
