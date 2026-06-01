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
  { name: "On-site", value: 45, color: "var(--primary)" },
  { name: "Remote", value: 28, color: "var(--teal)" },
  { name: "Hybrid", value: 19, color: "var(--emerald)" },
  { name: "Field", value: 8, color: "var(--indigo)" },
];

const tooltipStyle = {
  background: "var(--card)",
  border: "1px solid var(--border)",
  borderRadius: 8,
  fontSize: 12,
  boxShadow: "var(--shadow-lift)",
  color: "var(--foreground)",
};

const CardWrap = ({ title, sub, children, action }: any) => (
  <div className="rounded-xl border border-border bg-card p-5">
    <div className="mb-4 flex items-start justify-between">
      <div>
        <h3 className="font-display text-[15px] font-semibold">{title}</h3>
        <p className="text-xs text-muted-foreground">{sub}</p>
      </div>
      {action}
    </div>
    {children}
  </div>
);

export function ProductivityChart() {
  return (
    <CardWrap
      title="Productivity Trend"
      sub="Weekly · Active vs Idle hours"
      action={
        <div className="flex gap-0.5 rounded-md border border-border bg-card p-0.5 text-[11px]">
          {["7D","30D","QTR"].map((t,i)=>(<button key={t} className={`rounded px-2 py-1 ${i===0?"bg-muted text-foreground font-medium":"text-muted-foreground"}`}>{t}</button>))}
        </div>
      }
    >
      <ResponsiveContainer width="100%" height={240}>
        <AreaChart data={productivity} margin={{ left: -20, right: 4, top: 4 }}>
          <defs>
            <linearGradient id="ga" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.25}/>
              <stop offset="100%" stopColor="var(--primary)" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="gb" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor="var(--teal)" stopOpacity={0.2}/>
              <stop offset="100%" stopColor="var(--teal)" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="d" stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
          <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} />
          <Area type="monotone" dataKey="a" stroke="var(--primary)" strokeWidth={2} fill="url(#ga)" />
          <Area type="monotone" dataKey="b" stroke="var(--teal)" strokeWidth={2} fill="url(#gb)" />
        </AreaChart>
      </ResponsiveContainer>
    </CardWrap>
  );
}

export function DepartmentChart() {
  return (
    <CardWrap title="Department Performance" sub="Efficiency index">
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={departments} margin={{ left: -20, right: 4 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
          <XAxis dataKey="name" stroke="var(--muted-foreground)" fontSize={10} tickLine={false} axisLine={false} />
          <YAxis stroke="var(--muted-foreground)" fontSize={11} tickLine={false} axisLine={false} />
          <Tooltip contentStyle={tooltipStyle} cursor={{ fill: "color-mix(in oklab, var(--primary) 6%, transparent)" }} />
          <Bar dataKey="v" fill="var(--primary)" radius={[6,6,0,0]} maxBarSize={32} />
        </BarChart>
      </ResponsiveContainer>
    </CardWrap>
  );
}

export function WorkTypeChart() {
  return (
    <CardWrap title="Work Distribution" sub="By location type">
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="55%" height={180}>
          <PieChart>
            <Pie data={workTypes} dataKey="value" innerRadius={48} outerRadius={70} paddingAngle={2} stroke="white" strokeWidth={2}>
              {workTypes.map((e, i) => <Cell key={i} fill={e.color} />)}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
          </PieChart>
        </ResponsiveContainer>
        <ul className="flex-1 space-y-2 text-xs">
          {workTypes.map(w=>(
            <li key={w.name} className="flex items-center justify-between">
              <span className="flex items-center gap-2"><span className="h-2.5 w-2.5 rounded-sm" style={{background:w.color}} />{w.name}</span>
              <span className="font-semibold tabular-nums">{w.value}%</span>
            </li>
          ))}
        </ul>
      </div>
    </CardWrap>
  );
}

export function Heatmap() {
  const days = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
  const hours = ["6a","9a","12p","3p","6p","9p"];
  // deterministic
  const val = (di:number,hi:number) => ((Math.sin(di*1.7+hi*0.9)+1)/2)*0.85 + 0.1;
  return (
    <CardWrap title="Attendance Heatmap" sub="Last 7 days · check-in density">
      <div className="flex gap-3">
        <div className="flex flex-col justify-between pt-1 text-[10px] text-muted-foreground" style={{height: 160}}>
          {hours.map(h=> <span key={h}>{h}</span>)}
        </div>
        <div className="flex-1">
          <div className="grid grid-cols-7 gap-1.5">
            {days.flatMap((_,di)=> hours.map((_,hi)=>{
              const v = val(di,hi);
              return <div key={`${di}-${hi}`} className="aspect-square rounded-[4px]" style={{background:`color-mix(in oklab, var(--primary) ${Math.round(v*100)}%, white)`}} />;
            }))}
          </div>
          <div className="mt-2 grid grid-cols-7 text-center text-[10px] text-muted-foreground">
            {days.map(d=> <span key={d}>{d}</span>)}
          </div>
        </div>
      </div>
    </CardWrap>
  );
}
