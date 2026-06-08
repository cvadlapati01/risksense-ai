import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { risks } from "@/lib/risk-data";

export const Route = createFileRoute("/mitigation")({
  head: () => ({
    meta: [
      { title: "Mitigation Track — RiskSense" },
      {
        name: "description",
        content:
          "Track open mitigation actions across the program. Progress, owners, due dates, and residual exposure at a glance.",
      },
      { property: "og:title", content: "Mitigation Track — RiskSense" },
      { property: "og:description", content: "Progress on active risk mitigations." },
    ],
  }),
  component: MitigationPage,
});

function MitigationPage() {
  const open = risks
    .filter((r) => r.status !== "Mitigated")
    .sort((a, b) => a.actionsCompleted / a.actionsTotal - b.actionsCompleted / b.actionsTotal);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="p-6 max-w-[1600px] mx-auto space-y-6">
        <header>
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
            Live Plan
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight">Mitigation Track</h1>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {open.map((r) => {
            const pct = Math.round((r.actionsCompleted / r.actionsTotal) * 100);
            const blocked = pct < 40;
            return (
              <article key={r.id} className="border border-border bg-card p-5 flex flex-col">
                <div className="flex items-start justify-between mb-3">
                  <span className="font-mono text-[10px] font-bold text-accent">#{r.id}</span>
                  <span
                    className={`text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 ${
                      blocked ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {blocked ? "At Risk" : "On Track"}
                  </span>
                </div>
                <h3 className="text-sm font-extrabold leading-tight mb-1">{r.title}</h3>
                <p className="text-xs text-muted-foreground mb-4 line-clamp-2">{r.mitigation}</p>

                <div className="mt-auto space-y-3">
                  <div>
                    <div className="flex justify-between text-[10px] font-mono mb-1">
                      <span className="text-muted-foreground uppercase tracking-wider">
                        {r.actionsCompleted} / {r.actionsTotal} actions
                      </span>
                      <span className="font-bold">{pct}%</span>
                    </div>
                    <div className="h-1 bg-border">
                      <div
                        className={blocked ? "h-full bg-accent" : "h-full bg-foreground"}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-wider text-muted-foreground border-t border-border pt-3">
                    <span>{r.owner}</span>
                    <span>{r.dueDate}</span>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
