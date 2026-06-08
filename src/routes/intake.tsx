import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { EngineRunner } from "@/components/engine-runner";
import { SimilarProjects } from "@/components/similar-projects";
import { SourceCoverage } from "@/components/source-coverage";
import { RiskTable } from "@/components/risk-table";

export const Route = createFileRoute("/intake")({
  head: () => ({
    meta: [
      { title: "Import or Identify — RiskSense AI" },
      {
        name: "description",
        content:
          "Enter a WBS or KLUSA project ID. RiskSense AI aggregates risks across 9 enterprise sources, scores them via RPN, and surfaces similar historical projects.",
      },
      { property: "og:title", content: "Import or Identify — RiskSense AI" },
      { property: "og:description", content: "Single-ID entry to the 4-phase continuous risk engine." },
    ],
  }),
  component: IntakePage,
});

function IntakePage() {
  const [projectId, setProjectId] = useState("");
  const [armed, setArmed] = useState(false);
  const [cyclesRun, setCyclesRun] = useState(0);
  const [risksFound, setRisksFound] = useState(0);

  const handleStart = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectId.trim()) return;
    setArmed(true);
    setRisksFound(0);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="p-6 max-w-[1600px] mx-auto space-y-6">
        <header>
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
            Single Entry Point
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight">Import or Identify</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Enter a WBS or KLUSA project ID. The engine aggregates risk signals across all nine connected
            systems, scores them with RPN methodology, and returns a structured risk register in seconds.
          </p>
        </header>

        {/* Project ID entry */}
        <section className="border border-border bg-card p-6">
          <form onSubmit={handleStart} className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end">
            <div className="md:col-span-10">
              <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                WBS · KLUSA Project ID
              </label>
              <select
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full border border-border bg-background px-4 py-3 text-sm font-mono focus:outline-none focus:border-foreground"
              >
                <option value="">Select a demo project…</option>
                <option value="EVAL-2025-MCU">EVAL-2025-MCU</option>
                <option value="SW-UPDATE-V4">SW-UPDATE-V4</option>
                <option value="PROD-LINE-EXP">PROD-LINE-EXP</option>
              </select>
            </div>
            <button
              type="submit"
              className="md:col-span-2 px-4 py-3 bg-accent text-accent-foreground text-[11px] font-bold uppercase tracking-widest hover:opacity-90"
            >
              Run Engine
            </button>
          </form>

          {armed && (
            <div className="mt-4 p-3 bg-muted border border-border text-xs flex items-center justify-between">
              <span>
                <span className="font-mono font-bold text-accent">{projectId}</span>
                <span className="text-muted-foreground"> · armed and aggregating</span>
              </span>
              <span className="font-mono text-[10px] text-muted-foreground">
                Cycles {cyclesRun} · Risks surfaced {risksFound}
              </span>
            </div>
          )}
        </section>

        {/* 4-phase engine */}
        <EngineRunner
          running={armed}
          cycleSeconds={10}
          onCycleComplete={(c) => {
            setCyclesRun(c);
            setRisksFound((r) => r + Math.floor(Math.random() * 3) + 1);
          }}
        />

        {/* Source coverage + similar projects */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-5">
            <SourceCoverage />
          </div>
          <div className="col-span-12 lg:col-span-7 space-y-6">
            <SimilarProjects />
            <div className="border border-border bg-card p-5">
              <h3 className="text-[11px] font-extrabold uppercase tracking-widest mb-2">
                Why this matters
              </h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Historical FMEA and Lessons Learned data is internal — no external competitor can replicate
                it. Every risk surfaced links back to its source record, so PMs can trust the signal and
                trace the evidence.
              </p>
            </div>
          </div>
        </div>

        {/* Live register preview */}
        {armed && (
          <>
            <header className="pt-4">
              <h2 className="text-lg font-extrabold tracking-tight">Aggregated Risk Register</h2>
              <p className="text-xs text-muted-foreground">
                Live output from the engine, sorted by RPN. Each row traces back to its source system.
              </p>
            </header>
            <RiskTable limit={8} showFilters={false} />
          </>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}
