import { createFileRoute } from "@tanstack/react-router";
import { AuroraBackground } from "@/components/dashboard/AuroraBackground";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { LiveMap } from "@/components/dashboard/LiveMap";
import { AiInsights } from "@/components/dashboard/AiInsights";
import { ProductivityChart, DepartmentChart, WorkTypeChart, Heatmap } from "@/components/dashboard/Charts";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { Multimedia } from "@/components/dashboard/Multimedia";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Workforce.iQ — Employee Workforce Intelligence" },
      { name: "description", content: "Premium enterprise dashboard for real-time workforce monitoring, GPS tracking, productivity intelligence, and AI insights." },
      { property: "og:title", content: "Workforce.iQ Dashboard" },
      { property: "og:description", content: "Real-time workforce intelligence with GPS tracking, analytics, and AI insights." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="relative min-h-screen">
      <AuroraBackground />
      <div className="mx-auto flex max-w-[1600px] gap-6 p-6">
        <Sidebar />
        <main className="min-w-0 flex-1">
          <TopBar />

          <section className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-3xl font-semibold tracking-tight text-gradient">Workforce Overview</h1>
              <p className="text-sm text-muted-foreground">Monday, June 1 · Real-time intelligence across 14 sites</p>
            </div>
            <div className="flex gap-2">
              <button className="rounded-2xl bg-white/5 px-4 py-2 text-xs ring-1 ring-white/10 hover:bg-white/10">Export</button>
              <button className="rounded-2xl bg-gradient-to-r from-electric to-cyan-glow px-4 py-2 text-xs font-medium text-white shadow-[0_0_24px_-6px_var(--electric)]">+ New Report</button>
            </div>
          </section>

          <KpiCards />

          <section className="mt-6 grid gap-5 xl:grid-cols-3">
            <LiveMap />
            <AiInsights />
          </section>

          <section className="mt-6 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
            <div className="xl:col-span-2"><ProductivityChart /></div>
            <WorkTypeChart />
            <DepartmentChart />
            <Heatmap />
            <ActivityFeed />
          </section>

          <section className="mt-6">
            <Multimedia />
          </section>

          <footer className="mt-10 pb-4 text-center text-[11px] text-muted-foreground">
            Workforce.iQ · Enterprise Intelligence Platform · v2.6
          </footer>
        </main>
      </div>
    </div>
  );
}
