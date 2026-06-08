import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { risks, type Workstream, type RiskCategory } from "@/lib/risk-data";

type LogEntry = {
  id: string;
  timestamp: string;
  cycle: number;
  message: string;
  level: "info" | "warn" | "alert";
  risk?: {
    title: string;
    workstream: Workstream;
    category: RiskCategory;
    severity: number;
    occurrence: number;
    detection: number;
  };
};

const WORKSTREAMS: Workstream[] = [
  "Planning",
  "Procurement",
  "Infrastructure",
  "MEP",
  "Construction",
  "Legal",
  "Commissioning",
  "Finance",
];

const CATEGORIES: RiskCategory[] = [
  "Technical",
  "Supply Chain",
  "Schedule",
  "Regulatory",
  "Operational",
  "External",
];

const CANDIDATE_RISKS: { title: string; workstream: Workstream; category: RiskCategory }[] = [
  { title: "Supplier lead time slipped 3 weeks (PLATO e1ns drift)", workstream: "Procurement", category: "Supply Chain" },
  { title: "Permit revision delta detected in FAR-DB record", workstream: "Legal", category: "Regulatory" },
  { title: "Commissioning sensor calibration variance > 5%", workstream: "Commissioning", category: "Technical" },
  { title: "Concrete pour schedule conflict with weather window", workstream: "Construction", category: "Schedule" },
  { title: "Forex exposure on EUR-denominated MEP order", workstream: "Finance", category: "External" },
  { title: "FMEA-DB flagged new failure mode on chiller plant", workstream: "MEP", category: "Technical" },
];

const ts = () => new Date().toLocaleTimeString("en-GB", { hour12: false });

export function MonitorLog() {
  const [entries, setEntries] = useState<LogEntry[]>([]);
  const [running, setRunning] = useState(true);
  const cycleRef = useRef(0);
  const addedRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    // seed with one entry
    setEntries([
      {
        id: crypto.randomUUID(),
        timestamp: ts(),
        cycle: 0,
        level: "info",
        message: "Monitor & Sync engine online · polling 9 data sources",
      },
    ]);
  }, []);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      cycleRef.current += 1;
      const cycle = cycleRef.current;
      const scanned = risks.length + Math.floor(Math.random() * 4);
      const findRisk = Math.random() < 0.45;

      setEntries((prev) => {
        const next: LogEntry[] = [
          {
            id: crypto.randomUUID(),
            timestamp: ts(),
            cycle,
            level: "info",
            message: `Cycle #${cycle} · scanned ${scanned} signals across KLUSA · FMEA-DB · Windchill`,
          },
          ...prev,
        ];
        if (findRisk) {
          const c = CANDIDATE_RISKS[Math.floor(Math.random() * CANDIDATE_RISKS.length)];
          const sev = 4 + Math.floor(Math.random() * 6);
          const occ = 3 + Math.floor(Math.random() * 6);
          const det = 3 + Math.floor(Math.random() * 6);
          next.unshift({
            id: crypto.randomUUID(),
            timestamp: ts(),
            cycle,
            level: sev * occ >= 35 ? "alert" : "warn",
            message: `Potential new risk identified — ${c.title}`,
            risk: { ...c, severity: sev, occurrence: occ, detection: det },
          });
        } else {
          next.unshift({
            id: crypto.randomUUID(),
            timestamp: ts(),
            cycle,
            level: "info",
            message: `No drift · register stable · next sync in 6s`,
          });
        }
        return next.slice(0, 40);
      });
    }, 6000);
    return () => clearInterval(t);
  }, [running]);

  const addToRegister = (entry: LogEntry) => {
    const r = entry.risk;
    if (!r || addedRef.current.has(entry.id)) return;
    addedRef.current.add(entry.id);
    setEntries((prev) => [
      {
        id: crypto.randomUUID(),
        timestamp: ts(),
        cycle: entry.cycle,
        level: "info",
        message: `✓ Added to Risk Register — ${r.title} (${r.workstream})`,
      },
      ...prev,
    ]);
    toast.success("Risk added to register", { description: r.title });
  };

  return (
    <section className="border border-border bg-card">
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Automated Monitor Cycle
          </p>
          <h2 className="text-sm font-extrabold tracking-tight">Monitor & Sync Log</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            <span
              className={`size-2 rounded-full ${running ? "bg-safe animate-pulse" : "bg-muted-foreground"}`}
            />
            {running ? "Live" : "Paused"}
          </span>
          <button
            type="button"
            onClick={() => setRunning((r) => !r)}
            className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider border border-border hover:bg-background"
          >
            {running ? "Pause" : "Resume"}
          </button>
        </div>
      </div>

      <div className="max-h-[420px] overflow-y-auto font-mono text-[11px] divide-y divide-border/60">
        {entries.length === 0 && (
          <div className="p-4 text-muted-foreground">Waiting for first cycle…</div>
        )}
        {entries.map((e) => {
          const accent =
            e.level === "alert"
              ? "text-accent"
              : e.level === "warn"
                ? "text-warning"
                : "text-muted-foreground";
          return (
            <div key={e.id} className="px-4 py-2 flex items-start gap-3">
              <span className="text-muted-foreground shrink-0">{e.timestamp}</span>
              <span className={`shrink-0 font-bold uppercase ${accent}`}>
                {e.level === "info" ? "INFO" : e.level === "warn" ? "WARN" : "ALERT"}
              </span>
              <div className="flex-1">
                <div className="text-foreground">{e.message}</div>
                {e.risk && (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <span className="px-1.5 py-0.5 border border-border text-[10px] uppercase">
                      {e.risk.workstream}
                    </span>
                    <span className="px-1.5 py-0.5 border border-border text-[10px] uppercase">
                      {e.risk.category}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      S{e.risk.severity} · O{e.risk.occurrence} · D{e.risk.detection} · RPN{" "}
                      {e.risk.severity * e.risk.occurrence * e.risk.detection}
                    </span>
                    <button
                      type="button"
                      onClick={() => addToRegister(e)}
                      disabled={addedRef.current.has(e.id)}
                      className="ml-auto px-2 py-1 text-[10px] font-bold uppercase tracking-wider bg-foreground text-background hover:opacity-90 disabled:opacity-40 disabled:cursor-not-allowed"
                    >
                      {addedRef.current.has(e.id) ? "Added" : "Add to Risk Register"}
                    </button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

// silence unused warnings for the reference arrays (kept for future expansion)
void WORKSTREAMS;
void CATEGORIES;
