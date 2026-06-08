import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { KpiCard } from "@/components/kpi-card";
import { HeatmapMatrix } from "@/components/heatmap-matrix";
import { CriticalEscalations } from "@/components/critical-escalations";
import { RiskTable } from "@/components/risk-table";
import { MitigationFocus } from "@/components/mitigation-focus";
import { CategoryBreakdown } from "@/components/category-breakdown";
import { SourceCoverage } from "@/components/source-coverage";
import { SimilarProjects } from "@/components/similar-projects";
import { RiskGantt } from "@/components/risk-gantt";
import { kpis, risks, trendSeries } from "@/lib/risk-data";

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
  const focus = risks.find((r) => r.id === "R-788")!;
  const max = Math.max(...trendSeries.map((t) => t.score));
  const min = Math.min(...trendSeries.map((t) => t.score));

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


        <RiskGantt />

        <section className="grid grid-cols-12 gap-6">

          <div className="col-span-12 lg:col-span-4 space-y-6">
            <HeatmapMatrix />
            <CriticalEscalations />
          </div>

          <div className="col-span-12 lg:col-span-8 space-y-6">
            <RiskTable limit={6} showFilters={false} />

            <div className="border border-border bg-card p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[11px] font-extrabold uppercase tracking-widest">
                  Aggregate Exposure Trend
                </h3>
                <span className="text-[10px] font-mono text-muted-foreground">8 weeks</span>
              </div>
              <div className="h-32 flex items-end gap-2">
                {trendSeries.map((t, i) => {
                  const h = ((t.score - min + 20) / (max - min + 20)) * 100;
                  const last = i === trendSeries.length - 1;
                  return (
                    <div key={t.week} className="flex-1 flex flex-col items-center gap-1">
                      <div
                        className={`w-full ${last ? "bg-accent" : "bg-foreground/80"} transition-all`}
                        style={{ height: `${h}%` }}
                        title={`${t.week}: ${t.score}`}
                      />
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-between mt-2 text-[10px] font-mono text-muted-foreground">
                {trendSeries.map((t) => (
                  <span key={t.week}>{t.week}</span>
                ))}
              </div>
            </div>

            <MitigationFocus risk={focus} />
          </div>
        </section>

        <section className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-5">
            <SourceCoverage />
          </div>
          <div className="col-span-12 lg:col-span-7 space-y-6">
            <SimilarProjects />
            <CategoryBreakdown />
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
