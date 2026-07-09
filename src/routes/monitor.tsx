import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { risks, rpn, type Risk } from "@/lib/risk-data";

export const Route = createFileRoute("/monitor")({
  head: () => ({
    meta: [
      { title: "Monitor — RiskSense" },
      {
        name: "description",
        content: "Monitor view of active risks in the register.",
      },
      { property: "og:title", content: "Monitor — RiskSense" },
      { property: "og:description", content: "Active risk monitoring view." },
    ],
  }),
  component: MonitorPage,
});

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

function MonitorPage() {
  const activeRisks = risks.filter(
    (r) => r.status === "Active" || r.status === "Escalated" || r.status === "Watching",
  );

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="p-6 max-w-[1600px] mx-auto space-y-6">
        <header>
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
            Live View
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight">Monitor</h1>
        </header>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {activeRisks.map((risk) => (
            <RiskCard key={risk.id} risk={risk} />
          ))}
        </div>

        {activeRisks.length === 0 && (
          <div className="border border-border bg-card p-8 text-center text-[11px] text-muted-foreground">
            No active risks to monitor.
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
