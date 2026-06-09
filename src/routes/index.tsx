import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { KpiCard } from "@/components/kpi-card";
import { CriticalEscalations } from "@/components/critical-escalations";
import { RiskGantt } from "@/components/risk-gantt";
import { EngineStatus } from "@/components/engine-status";
import { kpis } from "@/lib/risk-data";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — RiskSense" },
      {
        name: "description",
        content:
          "Program-wide risk exposure dashboard: critical escalations, 5×5 heatmap, and live risk register for complex multi-workstream projects.",
      },
      { property: "og:title", content: "RiskSense Dashboard" },
      { property: "og:description", content: "Program-wide risk exposure at a glance." },
    ],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-accent/10">
      <SiteHeader />

      <main className="p-6 max-w-[1600px] mx-auto space-y-6">
        <header className="flex items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
              Program: Phoenix Core · Q4 2024
            </p>
            <h1 className="text-2xl font-extrabold tracking-tight">Risk Command Dashboard</h1>
          </div>
          <div className="hidden md:flex items-center gap-2 border border-border bg-card px-3 py-2">
            <div className="size-2 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-bold uppercase tracking-wider">3 Critical Alerts</span>
          </div>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <KpiCard
            label="Total Active Risks"
            value={kpis.totalActive}
            delta={
              <>
                <span className="text-safe">↓ 4%</span>
                <span>vs last month</span>
              </>
            }
            delay={0}
          />
          <KpiCard
            label="Critical (Score ≥ 20)"
            value={String(kpis.critical).padStart(2, "0")}
            tone="accent"
            delta={
              <>
                <span className="text-accent">↑ 2</span>
                <span>escalated today</span>
              </>
            }
            delay={60}
          />
          <KpiCard
            label="Overdue Mitigations"
            value={kpis.overdueMitigations}
            delta={<span className="text-warning">! Action required</span>}
            delay={120}
          />
          <KpiCard
            label="Risk Velocity"
            value={`+${kpis.velocity}`}
            delta={<span>Stable trend</span>}
            delay={180}
          />
        </section>

        

        <section className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-9">
            <RiskGantt />
          </div>
          <div className="col-span-12 lg:col-span-3">
            <CriticalEscalations />
          </div>
        </section>

      </main>

      <SiteFooter />
    </div>
  );
}
