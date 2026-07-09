import { risks, type Workstream } from "@/lib/risk-data";

// Program timeline: Phoenix Core · Q4 2024 → Q3 2025 (12 months)
export const MONTHS = [
  "Oct '24", "Nov '24", "Dec '24",
  "Jan '25", "Feb '25", "Mar '25",
  "Apr '25", "May '25", "Jun '25",
  "Jul '25", "Aug '25", "Sep '25",
];

type Phase = {
  workstream: Workstream;
  label: string;
  start: number; // month index
  end: number;   // month index (inclusive)
};

export const PHASES: Phase[] = [
  { workstream: "Planning",       label: "Permit & Design Freeze",      start: 0,  end: 2 },
  { workstream: "Procurement",    label: "Long-Lead Procurement",       start: 1,  end: 5 },
  { workstream: "Infrastructure", label: "Site Prep & Foundations",     start: 2,  end: 5 },
  { workstream: "Construction",   label: "Vertical Build",              start: 4,  end: 9 },
  { workstream: "MEP",            label: "MEP Rough-In & Fit-Out",      start: 6,  end: 10 },
  { workstream: "Legal",          label: "Contracts & Compliance",      start: 0,  end: 11 },
  { workstream: "Commissioning",  label: "Test & Handover",             start: 9,  end: 11 },
  { workstream: "Finance",        label: "Budget Gate Reviews",         start: 2,  end: 11 },
];

export const MILESTONES: { month: number; label: string; critical?: boolean }[] = [
  { month: 2,  label: "M1 · Design Freeze",      critical: true },
  { month: 5,  label: "M2 · Groundbreaking" },
  { month: 8,  label: "M3 · Topping Out" },
  { month: 10, label: "M4 · Systems Live",       critical: true },
  { month: 11, label: "M5 · Handover",           critical: true },
];

// Distribute risks across phase months deterministically by id hash
export function monthForRisk(id: string, phase: Phase): number {
  const span = phase.end - phase.start;
  const seed = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return phase.start + (seed % (span + 1));
}

function dotClass(score: number) {
  if (score >= 20) return "bg-accent ring-accent/40";
  if (score >= 15) return "bg-warning ring-warning/40";
  if (score >= 10) return "bg-foreground ring-foreground/30";
  return "bg-muted-foreground ring-muted-foreground/30";
}

export function RiskGantt() {
  const cols = MONTHS.length;

  return (
    <div className="border border-border bg-card p-5 animate-fade-in">
      <div className="flex items-end justify-between mb-4">
        <div>
          <h3 className="text-[11px] font-extrabold uppercase tracking-widest">
            Risk Timeline vs Program Milestones
          </h3>
          <p className="text-[10px] font-mono text-muted-foreground mt-1">
            Phoenix Core · Q4 2024 → Q3 2025 · {risks.length} risks plotted
          </p>
        </div>
        <div className="hidden md:flex items-center gap-3 text-[10px] font-mono uppercase tracking-wider">
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-accent" /> Critical
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-warning" /> High
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2 rounded-full bg-foreground" /> Moderate
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[720px]">
          {/* Month header */}
          <div
            className="grid border-b border-border pb-2 mb-2"
            style={{ gridTemplateColumns: `160px repeat(${cols}, minmax(0, 1fr))` }}
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Workstream
            </div>
            {MONTHS.map((m, i) => (
              <div
                key={m}
                className={`text-center text-[10px] font-mono ${
                  MILESTONES.some((x) => x.month === i)
                    ? "text-foreground font-bold"
                    : "text-muted-foreground"
                }`}
              >
                {m}
              </div>
            ))}
          </div>

          {/* Milestone markers row */}
          <div
            className="grid relative h-6 mb-2"
            style={{ gridTemplateColumns: `160px repeat(${cols}, minmax(0, 1fr))` }}
          >
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground self-center">
              Milestones
            </div>
            {MONTHS.map((_, i) => {
              const ms = MILESTONES.find((x) => x.month === i);
              return (
                <div key={i} className="relative flex items-center justify-center">
                  {ms && (
                    <div
                      className={`group relative size-3 rotate-45 border ${
                        ms.critical
                          ? "bg-accent border-accent"
                          : "bg-foreground border-foreground"
                      }`}
                      title={ms.label}
                    >
                      <span className="absolute left-1/2 -translate-x-1/2 -top-5 whitespace-nowrap text-[9px] font-mono uppercase tracking-wider text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                        {ms.label}
                      </span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Workstream rows */}
          <div className="space-y-1">
            {PHASES.map((phase) => {
              const phaseRisks = risks.filter((r) => r.workstream === phase.workstream);
              return (
                <div
                  key={phase.workstream}
                  className="grid items-center group hover:bg-muted/30 transition-colors"
                  style={{ gridTemplateColumns: `160px repeat(${cols}, minmax(0, 1fr))` }}
                >
                  <div className="py-2 pr-3">
                    <div className="text-xs font-bold">{phase.workstream}</div>
                    <div className="text-[10px] text-muted-foreground truncate">
                      {phase.label}
                    </div>
                  </div>

                  {/* Cells with vertical month grid */}
                  {MONTHS.map((_, i) => {
                    const inPhase = i >= phase.start && i <= phase.end;
                    const isMilestoneCol = MILESTONES.some((x) => x.month === i);
                    const cellRisks = phaseRisks.filter(
                      (r) => monthForRisk(r.id, phase) === i,
                    );
                    return (
                      <div
                        key={i}
                        className={`relative h-9 border-l ${
                          isMilestoneCol ? "border-foreground/30" : "border-border/40"
                        }`}
                      >
                        {inPhase && (
                          <div
                            className={`absolute inset-y-2 ${
                              i === phase.start ? "left-0" : "-left-px"
                            } ${
                              i === phase.end ? "right-0" : "-right-px"
                            } bg-muted/60 border-y border-border`}
                          />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center gap-0.5 flex-wrap">
                          {cellRisks.map((r) => {
                            const score = r.likelihood * r.impact;
                            return (
                              <div
                                key={r.id}
                                className={`relative size-2 rounded-full ring-2 ${dotClass(
                                  score,
                                )} hover:scale-150 transition-transform cursor-pointer`}
                                title={`${r.id} · ${r.title} (Score ${score})`}
                              />
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          {/* Today marker footer */}
          <div
            className="grid mt-3 pt-2 border-t border-border"
            style={{ gridTemplateColumns: `160px repeat(${cols}, minmax(0, 1fr))` }}
          >
            <div className="text-[10px] font-mono uppercase tracking-widest text-accent">
              ▸ Today
            </div>
            {MONTHS.map((_, i) => (
              <div key={i} className="flex justify-center">
                {i === 4 && (
                  <div className="text-[10px] font-mono font-bold text-accent">
                    NOW
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
