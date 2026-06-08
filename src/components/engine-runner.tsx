import { useEffect, useState } from "react";
import { ALL_SOURCES, type DataSource } from "@/lib/risk-data";

const PHASES = [
  { code: "01", name: "Identify", desc: "Scanning 9 data sources for new risk signals" },
  { code: "02", name: "Assess", desc: "Pre-scoring risks via RPN (Severity × Occurrence × Detection)" },
  { code: "03", name: "Mitigate", desc: "Matching Lessons Learned to surface mitigation actions" },
  { code: "04", name: "Monitor", desc: "Refreshing matrix, dashboard, and score drift" },
] as const;

type Props = {
  running: boolean;
  cycleSeconds?: number;
  onCycleComplete?: (cycle: number) => void;
};

export function EngineRunner({ running, cycleSeconds = 12, onCycleComplete }: Props) {
  const [progress, setProgress] = useState(0); // 0..1
  const [cycle, setCycle] = useState(0);
  const [sourceIdx, setSourceIdx] = useState(0);

  useEffect(() => {
    if (!running) return;
    const start = performance.now();
    let raf = 0;
    const tick = (t: number) => {
      const elapsed = (t - start) / 1000;
      const p = (elapsed % cycleSeconds) / cycleSeconds;
      setProgress(p);
      setSourceIdx(Math.floor(elapsed * 2) % ALL_SOURCES.length);
      const c = Math.floor(elapsed / cycleSeconds);
      setCycle((prev) => {
        if (c > prev) onCycleComplete?.(c);
        return c;
      });
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [running, cycleSeconds, onCycleComplete]);

  const activePhase = Math.min(3, Math.floor(progress * 4));
  const activeSource: DataSource = ALL_SOURCES[sourceIdx];

  return (
    <section className="border border-border bg-card">
      <div className="p-4 border-b border-border flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <span
            className={`size-2 rounded-full ${
              running ? "bg-safe animate-pulse" : "bg-muted-foreground"
            }`}
          />
          <h2 className="text-[11px] font-extrabold uppercase tracking-widest">
            Continuous Engine — {running ? "Running" : "Paused"}
          </h2>
        </div>
        <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          Cycle {cycle.toString().padStart(3, "0")} · {Math.round(progress * 100)}%
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 divide-x divide-border">
        {PHASES.map((p, i) => {
          const isActive = running && i === activePhase;
          const isDone = running && i < activePhase;
          const phaseProgress = isActive ? (progress * 4) % 1 : isDone ? 1 : 0;
          return (
            <div key={p.code} className="p-4">
              <div className="flex items-baseline justify-between mb-1">
                <span
                  className={`font-mono text-[10px] font-bold ${
                    isActive ? "text-accent" : isDone ? "text-safe" : "text-muted-foreground"
                  }`}
                >
                  PHASE {p.code}
                </span>
                {isActive && <span className="text-[10px] font-mono text-accent">●</span>}
              </div>
              <h3 className="text-sm font-extrabold uppercase tracking-tight">{p.name}</h3>
              <p className="text-[11px] text-muted-foreground mt-1 leading-snug min-h-[2.5rem]">
                {p.desc}
              </p>
              <div className="h-1 bg-muted mt-3">
                <div
                  className={`h-full ${isActive ? "bg-accent" : isDone ? "bg-safe" : "bg-transparent"}`}
                  style={{ width: `${phaseProgress * 100}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-border flex items-center gap-3 text-xs">
        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          Currently reading
        </span>
        <span className="font-mono font-bold">{activeSource}</span>
        <div className="flex-1 h-px bg-border" />
        <span className="text-[10px] font-mono text-muted-foreground">
          {ALL_SOURCES.length} sources · read-only
        </span>
      </div>
    </section>
  );
}
