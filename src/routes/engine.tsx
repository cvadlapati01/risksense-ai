import { createFileRoute, Link } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";

export const Route = createFileRoute("/engine")({
  head: () => ({
    meta: [
      { title: "How the Engine Works — RiskSense" },
      {
        name: "description",
        content:
          "Inside the continuous Identify → Assess → Mitigate → Monitor cycle that keeps the RiskSense register live.",
      },
      { property: "og:title", content: "How the RiskSense Engine Works" },
      {
        property: "og:description",
        content: "The continuous engine that separates RiskSense from static risk registers.",
      },
    ],
  }),
  component: EnginePage,
});

const phases = [
  {
    n: "01",
    key: "identify",
    title: "Identify",
    tagline: "Scan every connected source, every cycle.",
    body: "Runs in parallel across all connected data sources so cycle time stays flat as you add more. Pulls any risk record that didn't exist in the previous cycle and merges duplicates across sources — a new Windchill ECO and an existing Excel entry describing the same problem become one record, not two. Because Identify runs every cycle (not just at kick-off), a supply-chain disruption that appears in public news on day 47 is captured on the next cycle, not at the next quarterly review.",
    signals: ["12 sources scanned", "2 new risks", "1 duplicate merged"],
  },
  {
    n: "02",
    key: "assess",
    title: "Assess",
    tagline: "Recalculate RPN for every risk, not just the new ones.",
    body: "Computes Severity × Occurrence × Detection for the full register. Severity is pulled from Pella QA historical data for similar failure modes. Occurrence is updated from current-cycle signals — for example, when a public API reports a new tariff on a material your project uses, that risk's occurrence score goes up. This is score drift: risks don't stay at the values they were given on day one — they move as the project and the world change around them.",
    signals: ["47 RPNs recalculated", "5 drifted up", "2 drifted down"],
  },
  {
    n: "03",
    key: "mitigate",
    title: "Mitigate",
    tagline: "Suggest actions and auto-escalate before it's too late.",
    body: "For every risk above a configurable severity threshold, queries the Lessons Learned and Risk databases for matching historical cases and generates 3–5 concrete recommended actions. Runs auto-escalation rules: any risk whose RPN crosses the threshold (default 400, configurable per project) is flagged to the steering committee automatically — no PM action required. This closes the gap where a risk sits at RPN 450 for three weeks and never gets escalated because everyone assumed someone else was handling it.",
    signals: ["3 auto-escalated", "14 actions generated", "RPN threshold 400"],
  },
  {
    n: "04",
    key: "monitor",
    title: "Monitor",
    tagline: "Housekeep, log, and schedule the next cycle.",
    body: "Refreshes the risk matrix, updates dashboard statistics, writes the full cycle activity to the audit log, then schedules the next cycle. The return arrow from Monitor back to Identify is the most important line in the diagram — it means the engine never stops. A PM opening the tool on Monday morning is looking at a register updated overnight, not one frozen at project kick-off six weeks ago.",
    signals: ["Matrix refreshed", "Audit entry written", "Next cycle in 04:12"],
  },
] as const;

function EnginePage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="p-6 max-w-[1200px] mx-auto space-y-10">
        <header className="border-b border-border pb-8">
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-2">
            System Foundation · v4.12
          </p>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tighter">
            The Continuous <span className="text-accent">Risk Engine</span>
          </h1>
          <p className="mt-4 text-sm md:text-base text-muted-foreground max-w-3xl leading-relaxed">
            Every other risk tool is a register — you fill it in once and it sits there. RiskSense
            runs a four-phase cycle that never stops. Here's what happens in each phase and why the
            loop matters.
          </p>
        </header>

        {/* Cycle diagram */}
        <section className="border border-border bg-card p-6">
          <div className="text-[11px] font-extrabold uppercase tracking-widest mb-5">
            Cycle Topology
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {phases.map((p) => (
              <div key={p.key} className="border border-border bg-background p-4 relative">
                <div className="flex items-baseline justify-between">
                  <span className="text-[10px] font-mono text-muted-foreground">{p.n}</span>
                  <span className="text-[9px] font-mono uppercase tracking-widest text-accent">
                    ↻ live
                  </span>
                </div>
                <div className="mt-3 text-lg font-extrabold uppercase tracking-tight">
                  {p.title}
                </div>
                <div className="mt-1 text-[11px] text-muted-foreground leading-snug">
                  {p.tagline}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 text-[10px] font-mono text-muted-foreground text-center">
            04 → 01 ·· the loop that makes the register self-healing
          </div>
        </section>

        {/* Phase details */}
        <section className="space-y-6">
          {phases.map((p) => (
            <article key={p.key} className="grid grid-cols-12 gap-6 border-b border-border pb-6">
              <div className="col-span-12 md:col-span-3">
                <div className="text-[10px] font-mono text-muted-foreground">PHASE {p.n}</div>
                <h2 className="text-3xl font-extrabold tracking-tight mt-1">{p.title}</h2>
                <p className="mt-2 text-xs text-accent font-bold uppercase tracking-wider">
                  {p.tagline}
                </p>
              </div>
              <div className="col-span-12 md:col-span-6">
                <p className="text-sm leading-relaxed text-foreground/90">{p.body}</p>
              </div>
              <div className="col-span-12 md:col-span-3 space-y-2">
                <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  Last cycle signals
                </div>
                {p.signals.map((s) => (
                  <div
                    key={s}
                    className="border border-border bg-card px-3 py-2 text-[11px] font-mono"
                  >
                    {s}
                  </div>
                ))}
              </div>
            </article>
          ))}
        </section>

        {/* Why it matters */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              h: "No stale registers",
              b: "Scores move with reality. A risk created at RPN 120 may be RPN 380 next week — and you'll see it without anyone re-entering data.",
            },
            {
              h: "No missed escalations",
              b: "Crossing the threshold triggers an automatic alert to the steering committee. No reliance on someone remembering.",
            },
            {
              h: "No source blind spots",
              b: "Identify runs across every connected source in parallel, every cycle — so new entries in any system surface within minutes.",
            },
          ].map((c) => (
            <div key={c.h} className="border border-border bg-card p-5">
              <h3 className="text-sm font-extrabold uppercase tracking-wider">{c.h}</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{c.b}</p>
            </div>
          ))}
        </section>

        <div className="flex items-center justify-between border-t border-border pt-6">
          <p className="text-[11px] text-muted-foreground">
            Tune thresholds, intervals, and source weights in{" "}
            <Link to="/admin" className="underline font-bold text-foreground">
              Global Risk Settings
            </Link>
            .
          </p>
          <Link
            to="/"
            className="text-[11px] font-bold uppercase tracking-widest text-foreground hover:text-accent"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
