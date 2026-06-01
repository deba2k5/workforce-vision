import { Users, Timer, Gauge, Satellite, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useEffect, useState } from "react";

type Kpi = {
  label: string;
  value: number;
  suffix?: string;
  delta: number;
  icon: typeof Users;
  tint: string;
  spark: number[];
};

const kpis: Kpi[] = [
  { label: "Active Employees", value: 2847, delta: 4.2, icon: Users, tint: "var(--primary)", spark: [12,18,14,22,28,24,32,30,38,42] },
  { label: "Hours Logged", value: 18642, suffix: "h", delta: 2.8, icon: Timer, tint: "var(--teal)", spark: [20,22,26,24,30,28,34,38,36,44] },
  { label: "Productivity Score", value: 92, suffix: "%", delta: 1.6, icon: Gauge, tint: "var(--emerald)", spark: [80,82,79,85,88,86,90,89,91,92] },
  { label: "Field Workforce Online", value: 412, delta: -0.6, icon: Satellite, tint: "var(--indigo)", spark: [30,28,32,30,34,33,31,30,29,30] },
];

function useCount(target: number, duration = 800) {
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

function Spark({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data), min = Math.min(...data);
  const pts = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((d - min) / (max - min || 1)) * 100;
    return `${x},${y}`;
  }).join(" ");
  const id = `s-${color.replace(/[^a-z]/gi, "")}`;
  return (
    <svg viewBox="0 0 100 30" preserveAspectRatio="none" className="h-10 w-full">
      <defs>
        <linearGradient id={id} x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.18" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,30 ${data.map((d,i)=>{const x=(i/(data.length-1))*100;const y=30-((d-min)/(max-min||1))*30;return `${x},${y}`}).join(" ")} 100,30`} fill={`url(#${id})`} />
      <polyline
        points={data.map((d,i)=>{const x=(i/(data.length-1))*100;const y=30-((d-min)/(max-min||1))*30;return `${x},${y}`}).join(" ")}
        fill="none" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
      />
    </svg>
  );
}

export function KpiCards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {kpis.map((k, i) => {
        const Icon = k.icon;
        const v = useCount(k.value);
        const positive = k.delta >= 0;
        return (
          <div key={k.label} className="rounded-xl border border-border bg-card p-5 transition hover:shadow-[var(--shadow-lift)] animate-count-up" style={{ animationDelay: `${i * 50}ms` }}>
            <div className="flex items-start justify-between">
              <div className="grid h-9 w-9 place-items-center rounded-lg" style={{ background: `color-mix(in oklab, ${k.tint} 12%, white)`, color: k.tint }}>
                <Icon className="h-4 w-4" strokeWidth={2.25} />
              </div>
              <span className={`flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-[11px] font-medium ${positive ? "bg-emerald/10 text-emerald" : "bg-destructive/10 text-destructive"}`} style={positive ? { background: "color-mix(in oklab, var(--emerald) 12%, white)", color: "var(--emerald)" } : {}}>
                {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                {Math.abs(k.delta)}%
              </span>
            </div>
            <div className="mt-4">
              <div className="text-xs font-medium text-muted-foreground">{k.label}</div>
              <div className="mt-1 font-display text-[28px] font-semibold leading-none tracking-tight text-foreground">
                {v.toLocaleString()}{k.suffix}
              </div>
            </div>
            <div className="mt-3">
              <Spark data={k.spark} color={k.tint} />
            </div>
          </div>
        );
      })}
    </div>
  );
}
