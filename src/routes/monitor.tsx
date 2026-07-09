import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { risks, rpn, type Risk } from "@/lib/risk-data";
import { PHASES, MILESTONES, monthForRisk } from "@/components/risk-gantt";

export const Route = createFileRoute("/monitor")({
  head: () => ({
    meta: [
      { title: "Risks Overview — RiskSense" },
      {
        name: "description",
        content: "Risks overview with timeline and program milestones views.",
      },
      { property: "og:title", content: "Risks Overview — RiskSense" },
      { property: "og:description", content: "Risks overview with timeline and milestones." },
    ],
  }),
  component: MonitorPage,
});

type ViewMode = "timeline" | "milestones";

function riskMonth(risk: Risk) {
  const phase = PHASES.find((p) => p.workstream === risk.workstream);
  if (!phase) return 0;
  return monthForRisk(risk.id, phase);
}

function milestoneForRisk(risk: Risk) {
  const month = riskMonth(risk);
  return MILESTONES.reduce((closest, ms) =>
    Math.abs(ms.month - month) < Math.abs(closest.month - month) ? ms : closest,
  );
}

function RiskCard({ risk }: { risk: Risk }) {
  const score = rpn(risk);
  return (
    <div className="border border-border bg-card p-4 space-y-2">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-mono text-muted-foreground">{risk.id}</p>
          <h3 className="text-sm font-extrabold tracking-tight">{risk.title}</h3>
        </div>
        <span className="shrink-0 px-2 py-1 text-[10px] font-bold uppercase tracking-wider border border-border">
          {risk.status}
        </span>
      </div>
      <p className="text-[11px] text-muted-foreground">{risk.subtitle}</p>
      <div className="flex flex-wrap items-center gap-2 pt-1">
        <span className="px-1.5 py-0.5 border border-border text-[10px] uppercase">
          {risk.workstream}
        </span>
        <span className="px-1.5 py-0.5 border border-border text-[10px] uppercase">
          {risk.category}
        </span>
        <span className="text-[10px] font-mono text-muted-foreground">
          S{risk.severity} · O{risk.occurrence} · D{risk.detection} · RPN {score}
        </span>
      </div>
      <div className="text-[10px] font-mono text-muted-foreground pt-1">
        Owner: {risk.owner} · Due: {risk.dueDate}
      </div>
    </div>
  );
}

function ViewToggle({ mode, setMode }: { mode: ViewMode; setMode: (m: ViewMode) => void }) {
  return (
    <div className="inline-flex items-center border border-border bg-background p-1">
      <button
        type="button"
        onClick={() => setMode("timeline")}
        className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
          mode === "timeline" ? "bg-foreground text-background" : "hover:text-foreground"
        }`}
      >
        Risk Timeline
      </button>
      <button
        type="button"
        onClick={() => setMode("milestones")}
        className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-colors ${
          mode === "milestones" ? "bg-foreground text-background" : "hover:text-foreground"
        }`}
      >
        Program Milestones
      </button>
    </div>
  );
}

function TimelineView({ items }: { items: Risk[] }) {
  const sorted = [...items].sort((a, b) => riskMonth(a) - riskMonth(b));
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {sorted.map((risk) => (
        <RiskCard key={risk.id} risk={risk} />
      ))}
    </div>
  );
}

function MilestonesView({ items }: { items: Risk[] }) {
  const grouped = MILESTONES.map((ms) => ({
    milestone: ms,
    risks: items.filter((r) => milestoneForRisk(r).label === ms.label),
  }));

  return (
    <div className="space-y-6">
      {grouped.map(({ milestone, risks: msRisks }) => (
        <section key={milestone.label} className="space-y-3">
          <div className="flex items-center gap-3 border-b border-border pb-2">
            <span
              className={`size-2 rotate-45 border ${
                milestone.critical ? "bg-accent border-accent" : "bg-foreground border-foreground"
              }`}
            />
            <h3 className="text-sm font-extrabold tracking-tight">{milestone.label}</h3>
            <span className="text-[10px] font-mono text-muted-foreground">
              {MILESTONES[0] && `Month ${milestone.month + 1}`}
            </span>
            <span className="ml-auto text-[10px] font-mono text-muted-foreground">
              {msRisks.length} risk{msRisks.length === 1 ? "" : "s"}
            </span>
          </div>
          {msRisks.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {msRisks.map((risk) => (
                <RiskCard key={risk.id} risk={risk} />
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-muted-foreground">No risks mapped to this milestone.</p>
          )}
        </section>
      ))}
    </div>
  );
}

function MonitorPage() {
  const [mode, setMode] = useState<ViewMode>("timeline");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="p-6 max-w-[1600px] mx-auto space-y-6">
        <header>
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
            Live View
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight">Risks Overview</h1>
        </header>

        <section className="border border-border bg-card p-5 space-y-5">
          <div className="flex items-center justify-between gap-4">
            <h2 className="text-sm font-extrabold tracking-tight">Risk Register</h2>
            <ViewToggle mode={mode} setMode={setMode} />
          </div>

          {mode === "timeline" ? (
            <TimelineView items={risks} />
          ) : (
            <MilestonesView items={risks} />
          )}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
