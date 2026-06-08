import { useEffect, useRef, useState, useMemo } from "react";
import { toast } from "sonner";
import { risks, type Workstream, type RiskCategory } from "@/lib/risk-data";

type KnownEntry = {
  id: string;
  timestamp: string;
  cycle: number;
  level: "info" | "warn" | "alert";
  message: string;
};

type NewRiskEntry = {
  id: string;
  timestamp: string;
  cycle: number;
  level: "info" | "warn" | "alert";
  message: string;
  risk?: {
    title: string;
    workstream: Workstream;
    category: RiskCategory;
    severity: number;
    occurrence: number;
    detection: number;
  };
};

const KNOWN_TEMPLATES = [
  (r: string) => `${r} · mitigation on track, no drift`,
  (r: string) => `${r} · efficacy holding (KPI within tolerance)`,
  (r: string) => `${r} · owner heartbeat received`,
  (r: string) => `${r} · residual score unchanged`,
];

const KNOWN_ALERTS = [
  (r: string) => `${r} · mitigation slipping, KPI variance > 8%`,
  (r: string) => `${r} · owner missed checkpoint, escalation suggested`,
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
const uid = () => crypto.randomUUID();

const SEVERITY_OPTIONS = [
  { label: "All", value: "all" },
  { label: "Info", value: "info" },
  { label: "Warn", value: "warn" },
  { label: "Alert", value: "alert" },
] as const;

export function MonitorLog() {
  const [known, setKnown] = useState<KnownEntry[]>([]);
  const [scan, setScan] = useState<NewRiskEntry[]>([]);
  const [running, setRunning] = useState(true);
  const cycleRef = useRef(0);
  const addedRef = useRef<Set<string>>(new Set());
  const [, force] = useState(0);

  // Search & filter states
  const [knownSearch, setKnownSearch] = useState("");
  const [knownSeverity, setKnownSeverity] = useState<(typeof SEVERITY_OPTIONS)[number]["value"]>("all");
  const [scanSearch, setScanSearch] = useState("");
  const [scanSeverity, setScanSeverity] = useState<(typeof SEVERITY_OPTIONS)[number]["value"]>("all");

  const filteredKnown = useMemo(() => {
    return known.filter((e) => {
      const matchesSearch = !knownSearch || e.message.toLowerCase().includes(knownSearch.toLowerCase());
      const matchesSeverity = knownSeverity === "all" || e.level === knownSeverity;
      return matchesSearch && matchesSeverity;
    });
  }, [known, knownSearch, knownSeverity]);

  const filteredScan = useMemo(() => {
    return scan.filter((e) => {
      const matchesSearch = !scanSearch || e.message.toLowerCase().includes(scanSearch.toLowerCase());
      const matchesSeverity = scanSeverity === "all" || e.level === scanSeverity;
      return matchesSearch && matchesSeverity;
    });
  }, [scan, scanSearch, scanSeverity]);

  useEffect(() => {
    setKnown([
      { id: uid(), timestamp: ts(), cycle: 0, level: "info", message: `Tracking ${risks.length} known risks across register` },
    ]);
    setScan([
      { id: uid(), timestamp: ts(), cycle: 0, level: "info", message: "Scanner online · polling 9 external sources" },
    ]);
  }, []);

  useEffect(() => {
    if (!running) return;
    const t = setInterval(() => {
      cycleRef.current += 1;
      const cycle = cycleRef.current;

      // Known risk monitor entry
      const r = risks[Math.floor(Math.random() * risks.length)];
      const ref = `${r.id} — ${r.title}`;
      const alert = Math.random() < 0.25;
      const knownEntry: KnownEntry = alert
        ? {
            id: uid(),
            timestamp: ts(),
            cycle,
            level: "warn",
            message: KNOWN_ALERTS[Math.floor(Math.random() * KNOWN_ALERTS.length)](ref),
          }
        : {
            id: uid(),
            timestamp: ts(),
            cycle,
            level: "info",
            message: KNOWN_TEMPLATES[Math.floor(Math.random() * KNOWN_TEMPLATES.length)](ref),
          };

      // New-risk scan entry
      const found = Math.random() < 0.5;
      const scanEntry: NewRiskEntry = found
        ? (() => {
            const c = CANDIDATE_RISKS[Math.floor(Math.random() * CANDIDATE_RISKS.length)];
            const sev = 4 + Math.floor(Math.random() * 6);
            const occ = 3 + Math.floor(Math.random() * 6);
            const det = 3 + Math.floor(Math.random() * 6);
            return {
              id: uid(),
              timestamp: ts(),
              cycle,
              level: sev * occ >= 35 ? "alert" : "warn",
              message: `Potential new risk identified — ${c.title}`,
              risk: { ...c, severity: sev, occurrence: occ, detection: det },
            };
          })()
        : {
            id: uid(),
            timestamp: ts(),
            cycle,
            level: "info",
            message: `Cycle #${cycle} · scanned ${risks.length + Math.floor(Math.random() * 4)} signals · no new threats`,
          };

      setKnown((prev) => [knownEntry, ...prev].slice(0, 30));
      setScan((prev) => [scanEntry, ...prev].slice(0, 30));
    }, 6000);
    return () => clearInterval(t);
  }, [running]);

  const addToRegister = (entry: NewRiskEntry) => {
    const rk = entry.risk;
    if (!rk || addedRef.current.has(entry.id)) return;
    addedRef.current.add(entry.id);
    setScan((prev) => [
      {
        id: uid(),
        timestamp: ts(),
        cycle: entry.cycle,
        level: "info",
        message: `✓ Added to Risk Register — ${rk.title} (${rk.workstream})`,
      },
      ...prev,
    ]);
    force((n) => n + 1);
    toast.success("Risk added to register", { description: rk.title });
  };

  const LogFilterBar = ({
    search,
    setSearch,
    severity,
    setSeverity,
    count,
  }: {
    search: string;
    setSearch: (s: string) => void;
    severity: (typeof SEVERITY_OPTIONS)[number]["value"];
    setSeverity: (v: (typeof SEVERITY_OPTIONS)[number]["value"]) => void;
    count: number;
  }) => (
    <div className="flex flex-wrap items-center gap-2 px-4 py-2 border-b border-border bg-background/50">
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search log…"
        className="flex-1 min-w-[120px] px-2 py-1 text-[11px] font-mono bg-background border border-border placeholder:text-muted-foreground focus:outline-none focus:border-foreground"
      />
      <select
        value={severity}
        onChange={(e) => setSeverity(e.target.value as (typeof SEVERITY_OPTIONS)[number]["value"])}
        className="px-2 py-1 text-[11px] font-mono bg-background border border-border focus:outline-none focus:border-foreground"
      >
        {SEVERITY_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <span className="text-[10px] font-mono text-muted-foreground">{count} entries</span>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Heading */}
      <header>
        <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
          Automated Risk Surveillance
        </p>
        <h2 className="text-2xl font-extrabold tracking-tight">Monitor & Sync</h2>
      </header>

      <div className="flex items-center justify-between border border-border bg-card px-4 py-3">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            Automated Monitor Cycle
          </p>
          <p className="text-sm font-extrabold tracking-tight">Log</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
            <span
              className={`size-2 rounded-full ${running ? "bg-safe animate-pulse" : "bg-muted-foreground"}`}
            />
            {running ? "Live · weekly cycle" : "Paused"}
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

      <div className="grid md:grid-cols-2 gap-4">
        {/* Known Risk Monitoring */}
        <section className="border border-border bg-card">
          <div className="border-b border-border px-4 py-2">
            <h3 className="text-sm font-extrabold tracking-tight">Known Risk Monitoring</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Tracks register risks, checks mitigation efficacy.
            </p>
          </div>
          <LogFilterBar
            search={knownSearch}
            setSearch={setKnownSearch}
            severity={knownSeverity}
            setSeverity={setKnownSeverity}
            count={filteredKnown.length}
          />
          <div className="max-h-[420px] overflow-y-auto font-mono text-[11px] divide-y divide-border/60">
            {filteredKnown.length === 0 && (
              <div className="px-4 py-8 text-center text-muted-foreground text-[11px]">
                No entries match your filters.
              </div>
            )}
            {filteredKnown.map((e) => {
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
                    {e.level === "info" ? "OK" : e.level === "warn" ? "WARN" : "ALERT"}
                  </span>
                  <span className="text-foreground">{e.message}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Scan for New Risks */}
        <section className="border border-border bg-card">
          <div className="border-b border-border px-4 py-2">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Section 2
            </p>
            <h3 className="text-sm font-extrabold tracking-tight">Scan for New Risks</h3>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Scans external sources for emerging threats not yet in the register.
            </p>
          </div>
          <LogFilterBar
            search={scanSearch}
            setSearch={setScanSearch}
            severity={scanSeverity}
            setSeverity={setScanSeverity}
            count={filteredScan.length}
          />
          <div className="max-h-[420px] overflow-y-auto font-mono text-[11px] divide-y divide-border/60">
            {filteredScan.length === 0 && (
              <div className="px-4 py-8 text-center text-muted-foreground text-[11px]">
                No entries match your filters.
              </div>
            )}
            {filteredScan.map((e) => {
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
      </div>
    </div>
  );
}
