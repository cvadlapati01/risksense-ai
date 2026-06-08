import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { risks, severity } from "@/lib/risk-data";

export const Route = createFileRoute("/workstreams")({
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
  const streams = Array.from(new Set(risks.map((r) => r.workstream))).map((ws) => {
    const list = risks.filter((r) => r.workstream === ws);
    const scoreTotal = list.reduce((s, r) => s + r.likelihood * r.impact, 0);
    const crit = list.filter((r) => r.likelihood * r.impact >= 20).length;
    return { ws, list, scoreTotal, crit };
  }).sort((a, b) => b.scoreTotal - a.scoreTotal);

  const max = Math.max(...streams.map((s) => s.scoreTotal));

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

        <section className="border border-border bg-card divide-y divide-border">
          {streams.map(({ ws, list, scoreTotal, crit }) => {
            const w = (scoreTotal / max) * 100;
            return (
              <div key={ws} className="p-5 grid grid-cols-12 gap-4 items-center">
                <div className="col-span-12 md:col-span-3">
                  <h3 className="font-extrabold text-sm">{ws}</h3>
                  <p className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                    {list.length} risks
                  </p>
                </div>
                <div className="col-span-12 md:col-span-6">
                  <div className="h-3 bg-muted border border-border relative">
                    <div
                      className={`h-full ${crit > 0 ? "bg-accent" : "bg-foreground"}`}
                      style={{ width: `${w}%` }}
                    />
                  </div>
                  <div className="mt-1 flex gap-2 flex-wrap">
                    {list.map((r) => {
                      const sev = severity(r.likelihood * r.impact);
                      const dot =
                        sev === "critical"
                          ? "bg-accent"
                          : sev === "high"
                            ? "bg-warning"
                            : sev === "moderate"
                              ? "bg-warning/50"
                              : "bg-safe/60";
                      return (
                        <span
                          key={r.id}
                          title={`${r.id} — ${r.title}`}
                          className={`size-2 ${dot} block`}
                        />
                      );
                    })}
                  </div>
                </div>
                <div className="col-span-6 md:col-span-2 text-right">
                  <div className="text-[10px] font-bold uppercase text-muted-foreground">Weighted Score</div>
                  <div className="text-2xl font-extrabold tabular-nums">{scoreTotal}</div>
                </div>
                <div className="col-span-6 md:col-span-1 text-right">
                  <div className="text-[10px] font-bold uppercase text-muted-foreground">Critical</div>
                  <div className={`text-2xl font-extrabold tabular-nums ${crit > 0 ? "text-accent" : ""}`}>
                    {crit}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      </main>
      <SiteFooter />
    </div>
  );
}
