import { createFileRoute } from "@tanstack/react-router";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { TopBar } from "@/components/dashboard/TopBar";
import { KpiCards } from "@/components/dashboard/KpiCards";
import { LiveMap } from "@/components/dashboard/LiveMap";
import { AiInsights } from "@/components/dashboard/AiInsights";
import { ProductivityChart, DepartmentChart, WorkTypeChart, Heatmap } from "@/components/dashboard/Charts";
import { ActivityFeed } from "@/components/dashboard/ActivityFeed";
import { Multimedia } from "@/components/dashboard/Multimedia";
import { Download, Plus } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Workforce.iQ — Employee Workforce Intelligence" },
      { name: "description", content: "Professional workforce monitoring with attendance, GPS tracking, productivity analytics and AI insights." },
      { property: "og:title", content: "Workforce.iQ Dashboard" },
      { property: "og:description", content: "Professional workforce intelligence platform." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="min-w-0 flex-1">
        <div className="px-6">
          <TopBar />

          <section className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h1 className="font-display text-2xl font-semibold tracking-tight">Workforce Overview</h1>
              <p className="mt-0.5 text-sm text-muted-foreground">Monday, June 1 · Real-time intelligence across 14 sites</p>
            </div>
            <div className="flex gap-2">
              <button className="flex h-9 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-medium hover:bg-muted">
                <Download className="h-3.5 w-3.5" /> Export
              </button>
              <button className="flex h-9 items-center gap-1.5 rounded-lg bg-primary px-3 text-xs font-medium text-primary-foreground hover:opacity-95">
                <Plus className="h-3.5 w-3.5" /> New Report
              </button>
            </div>
          </section>

          <KpiCards />

          <section className="mt-5 grid gap-4 xl:grid-cols-3">
            <LiveMap />
            <AiInsights />
          </section>

          <section className="mt-5 grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
            <div className="xl:col-span-2"><ProductivityChart /></div>
            <WorkTypeChart />
            <DepartmentChart />
            <Heatmap />
            <ActivityFeed />
          </section>

          <section className="mt-5">
            <Multimedia />
          </section>

          <footer className="mt-10 pb-6 text-center text-[11px] text-muted-foreground">
            Workforce.iQ · Enterprise workforce intelligence
          </footer>
        </div>
      </main>
    </div>
  );
}
