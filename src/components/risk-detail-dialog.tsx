import { useEffect } from "react";
import { type Risk, rpn, priorityFromRpn } from "@/lib/risk-data";

type Props = {
  risk: Risk | null;
  onClose: () => void;
};

// Parse a risk id like "R003" or "M-901" into a sequence number string
function sequenceNumber(id: string) {
  const digits = id.replace(/\D/g, "");
  return digits ? `R${digits.padStart(3, "0")}` : id;
}

export function RiskDetailDialog({ risk, onClose }: Props) {
  useEffect(() => {
    if (!risk) return;
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [risk, onClose]);

  if (!risk) return null;

  const seq = sequenceNumber(risk.id);
  const projectCode = "IFX-2026-DRV-0042";
  const cycle = "C2";
  const score = rpn(risk);
  const priority = priorityFromRpn(score);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-background/80 backdrop-blur-sm p-4 sm:p-8">
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-5xl bg-card border border-border shadow-2xl">
        {/* Sticky note header */}
        <div className="flex items-start justify-between gap-4 p-5 border-b border-border">
          <div className="flex items-start gap-4">
            <div className="bg-warning/30 border border-warning/50 px-4 py-3 text-center min-w-[110px]">
              <div className="text-[9px] font-bold uppercase tracking-widest text-foreground/70">
                Risk Drilldown
              </div>
              <div className="text-xs font-extrabold mt-1">Details</div>
            </div>
            <div>
              <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
                Frame 1 · Identity
              </p>
              <h2 className="text-xl font-extrabold tracking-tight mt-0.5">{risk.title}</h2>
              <p className="text-xs text-muted-foreground mt-1">
                {risk.workstream} · {risk.category} · Owner: {risk.owner}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 border border-border text-[10px] font-bold uppercase hover:bg-muted"
          >
            Close ✕
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-8">
          {/* RISK ID FIELD */}
          <section className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Risk ID field
            </p>

            {/* Full composite ID bar */}
            <div className="bg-primary text-primary-foreground px-4 py-3 text-center font-mono font-extrabold text-sm tracking-wider">
              {seq}-{projectCode}-{cycle}
            </div>

            {/* 3 ID components */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="bg-primary/80 text-primary-foreground px-3 py-3 text-center">
                <div className="font-mono font-extrabold text-sm">{seq}</div>
                <div className="text-[10px] uppercase tracking-wider opacity-90 mt-0.5">
                  Sequence number
                </div>
              </div>
              <div className="bg-success/80 text-primary-foreground px-3 py-3 text-center" style={{ background: "hsl(160 60% 28%)" }}>
                <div className="font-mono font-extrabold text-sm text-white">{projectCode}</div>
                <div className="text-[10px] uppercase tracking-wider opacity-90 mt-0.5 text-white">
                  KLUSA project code
                </div>
              </div>
              <div className="px-3 py-3 text-center" style={{ background: "hsl(28 75% 32%)" }}>
                <div className="font-mono font-extrabold text-sm text-white">{cycle}</div>
                <div className="text-[10px] uppercase tracking-wider opacity-90 mt-0.5 text-white">
                  Cycle first detected
                </div>
              </div>
            </div>

            <div className="bg-foreground text-background px-4 py-2.5 text-center text-[11px] font-medium">
              Same ID persists across all cycles, exports, audits, and cross-project comparisons —
              full traceability guaranteed
            </div>
          </section>

          {/* DESCRIPTION FIELD */}
          <section className="space-y-3">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Description field
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr_auto_1fr] gap-3 items-center">
              {/* Inputs */}
              <div className="space-y-2">
                {[
                  { t: "Raw FMEA text", s: "Jargon · inconsistent" },
                  { t: "Lessons learned", s: "Narrative · unstructured" },
                  { t: "FAR PDF report", s: "Free text · scanned" },
                ].map((x) => (
                  <div key={x.t} className="bg-foreground text-background px-3 py-2.5">
                    <div className="text-xs font-bold">{x.t}</div>
                    <div className="text-[10px] opacity-80">{x.s}</div>
                  </div>
                ))}
              </div>

              <div className="text-muted-foreground text-center text-lg hidden lg:block">→</div>

              {/* LLM rewriter */}
              <div className="bg-primary text-primary-foreground px-3 py-4 text-center">
                <div className="text-xs font-extrabold uppercase tracking-wider">LLM rewriter</div>
                <div className="text-[11px] mt-1.5 leading-relaxed">
                  Plain English
                  <br />
                  <span className="font-bold">≤20 words</span>
                  <br />
                  No jargon
                </div>
              </div>

              <div className="text-muted-foreground text-center text-lg hidden lg:block">→</div>

              {/* Clean description outputs */}
              <div className="px-3 py-3 text-white text-[11px] leading-relaxed" style={{ background: "hsl(160 55% 30%)" }}>
                <div className="text-xs font-extrabold uppercase tracking-wider mb-1">
                  Clean description
                </div>
                <ul className="space-y-0.5">
                  <li>Cause + consequence</li>
                  <li>Who is affected</li>
                  <li>Measurable if possible</li>
                  <li>Source attributed</li>
                  <li>Deduplication flag</li>
                  <li>Searchable · indexable</li>
                </ul>
              </div>
            </div>

            {/* Example / actual clean description */}
            <div className="border border-dashed border-border bg-muted/30 px-4 py-3">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                Generated clean description
              </div>
              <p className="text-sm italic">"{risk.subtitle}"</p>
            </div>
          </section>

          {/* Scoring & mitigation summary */}
          <section className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Stat label="Severity" value={risk.severity} />
            <Stat label="Occurrence" value={risk.occurrence} />
            <Stat label="Detection" value={risk.detection} />
            <Stat label={`RPN · ${priority}`} value={score} accent />
          </section>

          <section className="border-t border-border pt-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
              Source
            </p>
            <div className="text-xs">
              <span className="font-bold">{risk.source}</span>{" "}
              <span className="font-mono text-muted-foreground">· {risk.sourceRef}</span>
            </div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mt-4 mb-2">
              Current mitigation
            </p>
            <p className="text-xs">{risk.mitigation}</p>
          </section>
        </div>
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: number; accent?: boolean }) {
  return (
    <div
      className={`px-3 py-2.5 border ${
        accent ? "bg-accent/10 border-accent/40" : "border-border bg-muted/30"
      }`}
    >
      <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="font-mono font-extrabold text-xl tabular-nums">{value}</div>
    </div>
  );
}
