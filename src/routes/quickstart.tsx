import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Bell, Play, Loader2, Filter, Check, Plus } from "lucide-react";

export const Route = createFileRoute("/quickstart")({
  head: () => ({
    meta: [
      { title: "Quickstart — RiskSense" },
      {
        name: "description",
        content:
          "Four-step guided flow: enter project context, let the AI surface relevant risks, review them, and adopt the ones you want.",
      },
      { property: "og:title", content: "RiskSense Quickstart" },
      { property: "og:description", content: "No Risk, Only Fun — guided risk intake in four steps." },
    ],
  }),
  component: Quickstart,
});

type Step = "input" | "wait" | "output" | "adopt";

type Suggested = {
  id: string;
  title: string;
  category: string;
  score: number;
  rationale: string;
};

const SUGGESTED: Suggested[] = [
  {
    id: "R1",
    title: "Long-lead silicon supplier slippage",
    category: "Supply Chain",
    score: 240,
    rationale: "3 historical KLUSA projects in this WBS hit ≥6-week delays on wafer fab capacity.",
  },
  {
    id: "R2",
    title: "Regulatory pre-clearance gap (EU AI Act)",
    category: "Regulatory",
    score: 192,
    rationale: "Category 'AI/ML' projects now require conformity assessment — not yet scheduled.",
  },
  {
    id: "R3",
    title: "Cross-team dependency on Platform v2",
    category: "Technical",
    score: 144,
    rationale: "Platform v2 rollout overlaps your milestone M3; FMEA-DB flags 2 open defects.",
  },
  {
    id: "R4",
    title: "Key-person concentration (1 architect)",
    category: "Operational",
    score: 96,
    rationale: "Lessons-Learned: 4/5 similar projects flagged single-architect bus factor.",
  },
];

const CATEGORIES = ["All", "Supply Chain", "Regulatory", "Technical", "Operational"];

function scoreTone(s: number) {
  if (s >= 200) return "bg-accent text-accent-foreground";
  if (s >= 120) return "bg-warning text-warning-foreground";
  return "bg-foreground text-background";
}

function Quickstart() {
  const [step, setStep] = useState<Step>("input");
  const [project, setProject] = useState({
    wbs: "",
    klusa: "",
    name: "",
    category: "",
    lead: "",
    description: "",
  });
  const [filter, setFilter] = useState("All");
  const [adopted, setAdopted] = useState<Record<string, boolean>>({});
  const [newRisk, setNewRisk] = useState("");
  const [extra, setExtra] = useState<string[]>([]);

  useEffect(() => {
    if (step !== "wait") return;
    const t = setTimeout(() => setStep("output"), 2400);
    return () => clearTimeout(t);
  }, [step]);

  const filtered =
    filter === "All" ? SUGGESTED : SUGGESTED.filter((r) => r.category === filter);

  const adoptedCount = Object.values(adopted).filter(Boolean).length + extra.length;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />

      <main className="p-6 max-w-[1100px] mx-auto space-y-6">
        {/* Stepper */}
        <ol className="flex items-center gap-2 text-[10px] font-mono uppercase tracking-widest">
          {(["input", "wait", "output", "adopt"] as Step[]).map((s, i) => {
            const active = step === s;
            const done = (["input", "wait", "output", "adopt"] as Step[]).indexOf(step) > i;
            return (
              <li key={s} className="flex items-center gap-2">
                <span
                  className={`size-5 grid place-items-center border ${
                    active
                      ? "bg-foreground text-background border-foreground"
                      : done
                        ? "bg-safe/20 text-safe border-safe/40"
                        : "border-border text-muted-foreground"
                  }`}
                >
                  {i + 1}
                </span>
                <span className={active ? "text-foreground font-bold" : "text-muted-foreground"}>
                  {s === "input" ? "Project" : s === "wait" ? "AI Scan" : s === "output" ? "Risks" : "Adopt"}
                </span>
                {i < 3 && <span className="text-border">———</span>}
              </li>
            );
          })}
        </ol>

        {/* STEP 1 — Input */}
        {step === "input" && (
          <section className="border border-border bg-card animate-fade-in">
            <div className="flex items-center justify-between p-5 border-b border-border bg-warning/10">
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">
                  <span className="text-accent">No Risk</span>{" "}
                  <span className="text-safe">Only Fun!</span>
                </h1>
                <p className="text-xs text-muted-foreground mt-1">
                  Fill the project context. The AI will scan all connected sources and surface
                  what's relevant.
                </p>
              </div>
              <Bell className="size-6 text-muted-foreground" />
            </div>

            <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                ["wbs", "WBS", "e.g. 4711.02.A"],
                ["klusa", "KLUSA Code", "e.g. KL-2025-0142"],
                ["name", "Project Name", "Phoenix Core"],
                ["category", "Category", "AI/ML, Hardware, Infra…"],
                ["lead", "Project Lead", "First Last"],
              ].map(([key, label, ph]) => (
                <label key={key} className="space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                    {label}
                  </span>
                  <input
                    value={project[key as keyof typeof project]}
                    onChange={(e) => setProject({ ...project, [key]: e.target.value })}
                    placeholder={ph}
                    className="w-full bg-background border border-border px-3 py-2 text-sm font-mono focus:outline-none focus:border-foreground"
                  />
                </label>
              ))}
              <label className="md:col-span-2 space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                  Description
                </span>
                <textarea
                  value={project.description}
                  onChange={(e) => setProject({ ...project, description: e.target.value })}
                  placeholder="Short project description — scope, goals, constraints…"
                  rows={3}
                  className="w-full bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground"
                />
              </label>
            </div>

            <div className="p-5 border-t border-border flex items-center justify-end gap-3">
              <span className="text-[10px] font-mono text-muted-foreground">
                e.g. Bilder · Ton · Details
              </span>
              <button
                onClick={() => setStep("wait")}
                disabled={!project.name && !project.wbs}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-foreground text-background text-[11px] font-extrabold uppercase tracking-widest disabled:opacity-40 hover:bg-foreground/90"
              >
                <Play className="size-3.5 fill-current" />
                Start
              </button>
            </div>
          </section>
        )}

        {/* STEP 2 — Wait (KI) */}
        {step === "wait" && (
          <section className="border border-border bg-card p-12 text-center animate-fade-in">
            <div className="relative mx-auto size-32 grid place-items-center mb-6">
              <div className="absolute inset-0 rounded-full border-2 border-foreground/20" />
              <div className="absolute inset-0 rounded-full border-t-2 border-accent animate-spin" />
              <div className="absolute -top-1 -right-1 size-5 rounded-full bg-accent animate-pulse" />
              <div className="absolute -bottom-1 -left-1 size-3 rounded-full bg-warning animate-pulse" />
              <span className="text-2xl font-extrabold text-accent">KI</span>
            </div>
            <p className="text-sm font-mono uppercase tracking-widest text-muted-foreground">
              Please wait…
            </p>
            <p className="text-xs text-muted-foreground mt-2">
              Aggregating KLUSA · FMEA-DB · Lessons Learned · Public Sources
            </p>
          </section>
        )}

        {/* STEP 3 — Output (Risikoübersicht) */}
        {step === "output" && (
          <section className="space-y-4 animate-fade-in">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                  Output
                </p>
                <h2 className="text-xl font-extrabold tracking-tight">Risikoübersicht</h2>
              </div>
              <div className="flex items-center gap-2 border border-border bg-card px-3 py-1.5">
                <Filter className="size-3.5 text-muted-foreground" />
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-transparent text-[11px] font-bold uppercase tracking-wider focus:outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filtered.map((r) => (
                <article
                  key={r.id}
                  className="border border-border bg-card p-5 hover:border-foreground transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <span className="font-mono text-[10px] font-bold text-muted-foreground">
                      {r.id}
                    </span>
                    <span
                      className={`px-2 py-0.5 text-[10px] font-mono font-bold ${scoreTone(r.score)}`}
                    >
                      RPN {r.score}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold mb-2 leading-snug">{r.title}</h3>
                  <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                    {r.rationale}
                  </p>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                    {r.category}
                  </span>
                </article>
              ))}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setStep("adopt")}
                className="px-5 py-2.5 bg-foreground text-background text-[11px] font-extrabold uppercase tracking-widest hover:bg-foreground/90"
              >
                Review &amp; Adopt →
              </button>
            </div>
          </section>
        )}

        {/* STEP 4 — Adopt list */}
        {step === "adopt" && (
          <section className="border border-border bg-card animate-fade-in">
            <div className="p-5 border-b border-border flex items-center justify-between">
              <h2 className="text-sm font-extrabold uppercase tracking-widest">
                Liste der relevanten Risiken
              </h2>
              <span className="text-[10px] font-mono text-muted-foreground">
                {adoptedCount} selected
              </span>
            </div>

            <ol className="divide-y divide-border">
              {SUGGESTED.map((r, i) => {
                const on = !!adopted[r.id];
                return (
                  <li
                    key={r.id}
                    className={`flex items-center gap-4 p-4 hover:bg-muted/30 ${
                      on ? "bg-safe/5" : ""
                    }`}
                  >
                    <span className="size-7 grid place-items-center border border-border rounded-full font-mono text-[11px] font-bold">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold truncate">{r.title}</div>
                      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                        {r.id} · {r.category} · RPN {r.score}
                      </div>
                    </div>
                    <button
                      onClick={() => setAdopted({ ...adopted, [r.id]: !on })}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest border ${
                        on
                          ? "bg-safe text-safe-foreground border-safe"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      {on && <Check className="size-3" />}
                      {on ? "Übernommen" : "Übernehmen"}
                    </button>
                  </li>
                );
              })}

              {extra.map((title, i) => (
                <li key={`extra-${i}`} className="flex items-center gap-4 p-4 bg-warning/5">
                  <span className="size-7 grid place-items-center border border-warning rounded-full font-mono text-[11px] font-bold text-warning">
                    +
                  </span>
                  <div className="flex-1 text-sm font-bold">{title}</div>
                  <span className="text-[10px] font-mono uppercase tracking-wider text-warning">
                    Neu
                  </span>
                </li>
              ))}
            </ol>

            <div className="p-4 border-t border-border bg-muted/30">
              <div className="flex gap-2">
                <input
                  value={newRisk}
                  onChange={(e) => setNewRisk(e.target.value)}
                  placeholder="Optional — Neues Risiko hinzufügen…"
                  className="flex-1 bg-background border border-border px-3 py-2 text-sm focus:outline-none focus:border-foreground"
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && newRisk.trim()) {
                      setExtra([...extra, newRisk.trim()]);
                      setNewRisk("");
                    }
                  }}
                />
                <button
                  onClick={() => {
                    if (!newRisk.trim()) return;
                    setExtra([...extra, newRisk.trim()]);
                    setNewRisk("");
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 border border-border text-[10px] font-bold uppercase tracking-widest hover:bg-background"
                >
                  <Plus className="size-3" />
                  Add
                </button>
              </div>
            </div>

            <div className="p-5 border-t border-border flex items-center justify-between">
              <button
                onClick={() => {
                  setStep("input");
                  setAdopted({});
                  setExtra([]);
                }}
                className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground"
              >
                ← Start over
              </button>
              <button
                disabled={adoptedCount === 0}
                className="px-5 py-2.5 bg-accent text-accent-foreground text-[11px] font-extrabold uppercase tracking-widest disabled:opacity-40"
              >
                Commit {adoptedCount} to Register
              </button>
            </div>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
  );
}
