import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const productivity = [
  { d: "Mon", a: 72, b: 58 }, { d: "Tue", a: 78, b: 62 }, { d: "Wed", a: 84, b: 70 },
  { d: "Thu", a: 80, b: 68 }, { d: "Fri", a: 92, b: 78 }, { d: "Sat", a: 88, b: 74 }, { d: "Sun", a: 95, b: 82 },
];
const departments = [
  { name: "Engineering", v: 94 }, { name: "Operations", v: 88 }, { name: "Sales", v: 76 },
  { name: "Support", v: 82 }, { name: "Field Ops", v: 91 }, { name: "Logistics", v: 79 },
];
const workTypes = [
  { name: "On-site", value: 45, color: "var(--electric)" },
  { name: "Remote", value: 28, color: "var(--cyan-glow)" },
  { name: "Hybrid", value: 19, color: "var(--emerald-glow)" },
  { name: "Field", value: 8, color: "var(--violet-glow)" },
];

const tooltipStyle = {
  background: "rgba(15,20,40,0.9)",
  border: "1px solid rgba(255,255,255,0.1)",
  borderRadius: 12,
  fontSize: 12,
  backdropFilter: "blur(12px)",
};

export function ProductivityChart() {
  return (
    <div className="glass-strong rounded-3xl p-5">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-lg font-semibold">Productivity Trend</h3>
          <p className="text-xs text-muted-foreground">Weekly · Active vs Idle hours</p>
        </div>
        <div className="flex gap-1.5 rounded-xl bg-white/5 p-1 ring-1 ring-white/10 text-[11px]">
          {["7D","30D","QTR"].map((t,i)=>(<button key={t} className={`rounded-lg px-2.5 py-1 ${i===0?"bg-white/10 text-white":"text-muted-foreground"}`}>{t}</button>))}
        </div>
      </div>
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={productivity}>
          <defs>
            <linearGradient id="ga" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.72 0.2 255)" stopOpacity={0.6}/>
              <stop offset="100%" stopColor="oklch(0.72 0.2 255)" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="gb" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.78 0.17 160)" stopOpacity={0.4}/>
              <stop offset="100%" stopColor="oklch(0.78 0.17 160)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="d" stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area type="monotone" dataKey="a" stroke="oklch(0.72 0.2 255)" strokeWidth={2.5} fill="url(#ga)" />
          <Area type="monotone" dataKey="b" stroke="oklch(0.78 0.17 160)" strokeWidth={2} fill="url(#gb)" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export function DepartmentChart() {
  return (
    <div className="glass-strong rounded-3xl p-5">
      <div className="mb-4">
        <h3 className="font-display text-lg font-semibold">Department Performance</h3>
        <p className="text-xs text-muted-foreground">Efficiency index</p>
      </div>
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={departments}>
          <defs>
            <linearGradient id="bb" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="oklch(0.82 0.15 200)" />
              <stop offset="100%" stopColor="oklch(0.72 0.2 255)" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
          <XAxis dataKey="name" stroke="rgba(255,255,255,0.4)" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "rgba(255,255,255,0.04)" }} />
          <Bar dataKey="v" fill="url(#bb)" radius={[8,8,4,4]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function WorkTypeChart() {
  return (
    <div className="glass-strong rounded-3xl p-5">
      <div className="mb-2">
        <h3 className="font-display text-lg font-semibold">Work Distribution</h3>
        <p className="text-xs text-muted-foreground">By location type</p>
      </div>
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="55%" height={180}>
          <PieChart>
            <Pie data={workTypes} dataKey="value" innerRadius={48} outerRadius={70} paddingAngle={3} stroke="none">
              {workTypes.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <ul className="flex-1 space-y-2 text-xs">
          {workTypes.map(w=>(
            <li key={w.name} className="flex items-center justify-between">
              <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-full" style={{background:w.color}} />{w.name}</span>
              <span className="font-medium tabular-nums">{w.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function Heatmap() {
  const days = ["M","T","W","T","F","S","S"];
  const hours = ["6a","9a","12p","3p","6p","9p"];
  return (
    <div className="glass-strong rounded-3xl p-5">
      <div className="mb-4">
        <h3 className="font-display text-lg font-semibold">Attendance Heatmap</h3>
        <p className="text-xs text-muted-foreground">Last 7 days · check-in density</p>
      </div>
      <div className="flex gap-3">
        <div className="flex flex-col justify-around text-[10px] text-muted-foreground pt-1">
          {hours.map(h=> <span key={h}>{h}</span>)}
        </div>
        <div className="flex-1 grid grid-cols-7 gap-1.5">
          {days.flatMap((d,di)=> hours.map((_,hi)=>{
            const v = Math.random()*0.9 + 0.1;
            return <div key={`${di}-${hi}`} className="aspect-square rounded-md" style={{background:`oklch(0.72 0.2 255 / ${v})`, boxShadow: v>0.7 ? "0 0 8px oklch(0.72 0.2 255 / 0.5)" : undefined}} />;
          }))}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between text-[10px] text-muted-foreground">
        <div className="flex gap-1">{days.map((d,i)=><span key={i} className="w-full text-center" style={{width:"calc((100% - 1.5rem)/7)"}}>{d}</span>)}</div>
      </div>
    </div>
  );
}
