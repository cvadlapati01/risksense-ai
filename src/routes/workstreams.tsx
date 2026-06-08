import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { MonitorLog } from "@/components/monitor-log";
import {
  risks,
  actionForRisk,
  type MatrixAction,
} from "@/lib/risk-data";

const ACTION_VALUES: MatrixAction[] = ["Critical Priority", "Manage", "Monitor"];

type WorkstreamSearch = { action?: MatrixAction };

export const Route = createFileRoute("/workstreams")({
  validateSearch: (s: Record<string, unknown>): WorkstreamSearch => {
    const a = s.action;
    return {
      action:
        typeof a === "string" && (ACTION_VALUES as string[]).includes(a)
          ? (a as MatrixAction)
          : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Workstreams — RiskSense" },
      {
        name: "description",
        content:
          "Risk exposure by program workstream. Compare total risks, weighted score, and critical count per delivery stream.",
      },
      { property: "og:title", content: "Workstreams — RiskSense" },
      { property: "og:description", content: "Cross-workstream risk comparison." },
    ],
  }),
  component: WorkstreamsPage,
});

function WorkstreamsPage() {
  const { action } = Route.useSearch();
  const navigate = useNavigate({ from: "/workstreams" });

  const filteredRisks = action ? risks.filter((r) => actionForRisk(r) === action) : risks;

  const streams = Array.from(new Set(filteredRisks.map((r) => r.workstream)))
    .map((ws) => {
      const list = filteredRisks.filter((r) => r.workstream === ws);
      const scoreTotal = list.reduce((s, r) => s + r.likelihood * r.impact, 0);
      const crit = list.filter((r) => r.likelihood * r.impact >= 20).length;
      return { ws, list, scoreTotal, crit };
    })
    .sort((a, b) => b.scoreTotal - a.scoreTotal);

  const max = Math.max(1, ...streams.map((s) => s.scoreTotal));

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="p-6 max-w-[1600px] mx-auto space-y-6">
        <header>
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
            Cross-Stream View
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight">Workstream Exposure</h1>
        </header>

        {action && (
          <div className="flex items-center justify-between gap-3 border border-accent/40 bg-accent/5 px-4 py-2 text-[11px] font-bold uppercase tracking-wider">
            <span>
              Routed from matrix · Action:{" "}
              <span className="text-accent">{action}</span> · {filteredRisks.length} risk
              {filteredRisks.length === 1 ? "" : "s"} under watch
            </span>
            <button
              type="button"
              onClick={() => navigate({ search: { action: undefined }, replace: true })}
              className="px-2 py-1 border border-border hover:bg-background"
            >
              Show all
            </button>
          </div>
        )}

        <MonitorLog />
      </main>
      <SiteFooter />
    </div>
  );
}
