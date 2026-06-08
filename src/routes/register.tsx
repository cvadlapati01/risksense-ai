import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { RiskTable } from "@/components/risk-table";
import { MitigationFocus } from "@/components/mitigation-focus";
import { risks, type Risk } from "@/lib/risk-data";

export const Route = createFileRoute("/register")({
  head: () => ({
    meta: [
      { title: "Risk Register — RiskSense" },
      {
        name: "description",
        content:
          "Full risk register for the program. Filter by workstream, sort by score, and drill into mitigation plans and history.",
      },
      { property: "og:title", content: "Risk Register — RiskSense" },
      { property: "og:description", content: "Searchable, filterable program risk register." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const [selected, setSelected] = useState<Risk>(risks[0]);

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
            <RiskTable onSelect={setSelected} selectedId={selected.id} />
          </div>

          <aside className="col-span-12 lg:col-span-4 space-y-4">
            <div className="border border-border bg-card p-5">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <p className="text-[10px] font-mono font-bold text-accent mb-1">#{selected.id}</p>
                  <h2 className="text-base font-extrabold leading-tight">{selected.title}</h2>
                  <p className="text-xs text-muted-foreground mt-1">{selected.subtitle}</p>
                </div>
              </div>

              <dl className="grid grid-cols-2 gap-3 text-xs border-t border-border pt-3">
                <div>
                  <dt className="text-[9px] font-bold uppercase text-muted-foreground">Workstream</dt>
                  <dd className="font-medium">{selected.workstream}</dd>
                </div>
                <div>
                  <dt className="text-[9px] font-bold uppercase text-muted-foreground">Status</dt>
                  <dd className="font-medium">{selected.status}</dd>
                </div>
                <div>
                  <dt className="text-[9px] font-bold uppercase text-muted-foreground">Likelihood</dt>
                  <dd className="font-mono">{selected.likelihood} / 5</dd>
                </div>
                <div>
                  <dt className="text-[9px] font-bold uppercase text-muted-foreground">Impact</dt>
                  <dd className="font-mono">{selected.impact} / 5</dd>
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
    </div>
  );
}
