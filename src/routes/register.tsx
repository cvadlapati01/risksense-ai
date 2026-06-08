import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { RiskTable } from "@/components/risk-table";
import { HeatmapMatrix } from "@/components/heatmap-matrix";
import { MitigationFocus } from "@/components/mitigation-focus";
import { ManualRiskDialog } from "@/components/manual-risk-dialog";
import {
  risks as seedRisks,
  rpn,
  priorityFromRpn,
  type Risk,
  type RiskCategory,
} from "@/lib/risk-data";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Risk Register — RiskSense" },
      {
        name: "description",
        content:
          "Full risk register aggregated across 9 sources. Filter, sort by RPN, drill into AI mitigations and source traceability.",
      },
      { property: "og:title", content: "Risk Register — RiskSense" },
      { property: "og:description", content: "Aggregated risks with full source traceability." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const [list, setList] = useState<Risk[]>(seedRisks);
  const [selected, setSelected] = useState<Risk>(seedRisks[0]);
  const [dialogOpen, setDialogOpen] = useState(false);

  const addManual = (m: {
    title: string;
    description: string;
    category: RiskCategory;
    severity: number;
    occurrence: number;
    detection: number;
  }) => {
    const nextId = `M-${(900 + list.filter((r) => r.source === "Manual").length + 1)
      .toString()
      .padStart(3, "0")}`;
    const newRisk: Risk = {
      id: nextId,
      title: m.title,
      subtitle: m.description || "Manually entered risk",
      workstream: "Planning",
      category: m.category,
      source: "Manual",
      sourceRef: "PM entry",
      severity: m.severity,
      occurrence: m.occurrence,
      detection: m.detection,
      likelihood: Math.max(1, Math.min(5, Math.ceil(m.occurrence / 2))),
      impact: Math.max(1, Math.min(5, Math.ceil(m.severity / 2))),
      status: "Under Review",
      owner: "PM Entry",
      dueDate: "TBD",
      mitigation: "Pending mitigation plan.",
      aiRecommendations: [],
      actionsCompleted: 0,
      actionsTotal: 3,
      residual: "Moderate",
      history: [{ date: "TODAY", note: "Manually added via Risk Register" }],
    };
    const next = [newRisk, ...list];
    setList(next);
    setSelected(newRisk);
    setDialogOpen(false);
  };

  const score = rpn(selected);
  const priority = priorityFromRpn(score);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="p-6 max-w-[1600px] mx-auto space-y-6">
        <header>
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
            Master Ledger
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight">Risk Register</h1>
        </header>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8">
            <RiskTable
              initial={list}
              onSelect={setSelected}
              selectedId={selected.id}
              onAddManual={() => setDialogOpen(true)}
            />
          </div>

          <aside className="col-span-12 lg:col-span-4 space-y-4">
            <div className="border border-border bg-card p-5">
              <div className="flex items-start justify-between mb-3 gap-3">
                <div className="min-w-0">
                  <p className="text-[10px] font-mono font-bold text-accent mb-1">#{selected.id}</p>
                  <h2 className="text-base font-extrabold leading-tight">{selected.title}</h2>
                  <p className="text-xs text-muted-foreground mt-1">{selected.subtitle}</p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] font-bold uppercase text-muted-foreground">RPN</div>
                  <div className="text-2xl font-extrabold tabular-nums">{score}</div>
                  <div
                    className={`text-[10px] font-bold uppercase tracking-widest ${
                      priority === "Critical"
                        ? "text-accent"
                        : priority === "High"
                          ? "text-warning"
                          : "text-muted-foreground"
                    }`}
                  >
                    {priority}
                  </div>
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-3 text-xs border-t border-border pt-3">
                <div>
                  <dt className="text-[9px] font-bold uppercase text-muted-foreground">Source</dt>
                  <dd className="font-medium">{selected.source}</dd>
                  <dd className="font-mono text-[10px] text-muted-foreground">{selected.sourceRef}</dd>
                </div>
                <div>
                  <dt className="text-[9px] font-bold uppercase text-muted-foreground">Category</dt>
                  <dd className="font-medium">{selected.category}</dd>
                </div>
                <div>
                  <dt className="text-[9px] font-bold uppercase text-muted-foreground">S · O · D</dt>
                  <dd className="font-mono">
                    {selected.severity} · {selected.occurrence} · {selected.detection}
                  </dd>
                </div>
                <div>
                  <dt className="text-[9px] font-bold uppercase text-muted-foreground">Status</dt>
                  <dd className="font-medium">{selected.status}</dd>
                </div>
                <div>
                  <dt className="text-[9px] font-bold uppercase text-muted-foreground">Owner</dt>
                  <dd className="font-medium">{selected.owner}</dd>
                </div>
                <div>
                  <dt className="text-[9px] font-bold uppercase text-muted-foreground">Due</dt>
                  <dd className="font-mono">{selected.dueDate}</dd>
                </div>
              </dl>
            </div>

            {selected.aiRecommendations.length > 0 && (
              <div className="border border-border bg-card p-5">
                <h3 className="text-[11px] font-extrabold uppercase tracking-widest mb-3">
                  AI Mitigation Recommendations
                </h3>
                <ul className="space-y-2">
                  {selected.aiRecommendations.map((rec, i) => (
                    <li key={i} className="text-xs flex gap-2">
                      <span className="text-accent font-bold">{i + 1}.</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <MitigationFocus risk={selected} />

            <div className="border border-border bg-card p-5">
              <h3 className="text-[11px] font-extrabold uppercase tracking-widest mb-3">History</h3>
              <ol className="space-y-3">
                {selected.history.map((h, i) => (
                  <li key={i} className="flex gap-3 text-xs">
                    <span className="font-mono text-[10px] text-muted-foreground w-12 shrink-0 pt-0.5">
                      {h.date}
                    </span>
                    <span className="border-l border-border pl-3">{h.note}</span>
                  </li>
                ))}
              </ol>
            </div>
          </aside>
        </div>
      </main>
      <SiteFooter />
      <ManualRiskDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSubmit={addManual} />
    </div>
  );
}
