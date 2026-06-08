import { useMemo, useState } from "react";
import { risks, type Risk } from "@/lib/risk-data";

type Cell = { likelihood: number; impact: number; items: Risk[] };

// Bucket a 1-5 score into 1 (Low), 2 (Med), 3 (High)
function bucket(v: number): 1 | 2 | 3 {
  if (v <= 2) return 1;
  if (v <= 3) return 2;
  return 3;
}

type Action = "Critical Priority" | "Manage" | "Monitor";

function actionFor(likelihood: number, impact: number): Action {
  const score = likelihood * impact; // 1..9
  if (score >= 6) return "Critical Priority";
  if (score >= 3) return "Manage";
  return "Monitor";
}

const actionStyle: Record<Action, { cell: string; chip: string; label: string }> = {
  "Critical Priority": {
    cell: "bg-accent/80",
    chip: "bg-accent text-accent-foreground",
    label: "Critical Priority",
  },
  Manage: {
    cell: "bg-warning/60",
    chip: "bg-warning text-foreground",
    label: "Manage",
  },
  Monitor: {
    cell: "bg-safe/50",
    chip: "bg-safe text-foreground",
    label: "Monitor",
  },
};

export function HeatmapMatrix() {
  const cells = useMemo<Cell[]>(() => {
    const out: Cell[] = [];
    for (let impact = 3; impact >= 1; impact--) {
      for (let likelihood = 1; likelihood <= 3; likelihood++) {
        out.push({
          likelihood,
          impact,
          items: risks.filter(
            (r) => bucket(r.likelihood) === likelihood && bucket(r.impact) === impact,
          ),
        });
      }
    }
    return out;
  }, []);

  const [hover, setHover] = useState<Cell | null>(null);

  return (
    <section className="border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[11px] font-extrabold uppercase tracking-widest">
          Threat Evaluation Matrix (3×3)
        </h3>
        <span className="text-[10px] font-mono text-muted-foreground">N={risks.length}</span>
      </div>
      <div className="flex gap-2">
        <div className="flex flex-col justify-between py-1 text-[10px] font-mono text-muted-foreground pr-1">
          <span>High</span>
          <span>Med</span>
          <span>Low</span>
        </div>
        <div className="aspect-square flex-1 grid grid-cols-3 grid-rows-3 gap-1 bg-muted p-1 border border-border">
          {cells.map((c) => {
            const action = actionFor(c.likelihood, c.impact);
            const style = actionStyle[action];
            return (
              <button
                type="button"
                key={`${c.likelihood}-${c.impact}`}
                onMouseEnter={() => setHover(c)}
                onMouseLeave={() => setHover(null)}
                className={`${style.cell} relative flex items-center justify-center text-[10px] font-mono font-bold text-foreground/80 hover:outline hover:outline-2 hover:outline-foreground transition-all`}
                aria-label={`Likelihood ${c.likelihood} Impact ${c.impact}, ${c.items.length} risks, ${action}`}
              >
                {c.items.length > 0 ? c.items.length : ""}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex justify-between mt-2 text-[10px] font-bold uppercase text-muted-foreground">
        <span>Probability (Low → High)</span>
        <span className="text-right">Severity / Impact ↑</span>
      </div>

      {/* Action legend — exactly 3 */}
      <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-bold uppercase tracking-wider">
        {(["Critical Priority", "Manage", "Monitor"] as Action[]).map((a) => (
          <span key={a} className={`${actionStyle[a].chip} px-2 py-1`}>
            {a}
          </span>
        ))}
      </div>

      <div className="mt-4 h-16 border-t border-border pt-3 text-xs">
        {hover ? (
          <div>
            <div className="font-mono text-[10px] text-muted-foreground uppercase">
              L{hover.likelihood} × I{hover.impact} — Action: {actionFor(hover.likelihood, hover.impact)}
            </div>
            {hover.items.length === 0 ? (
              <div className="text-muted-foreground">No risks in this cell</div>
            ) : (
              <ul className="mt-1 space-y-0.5">
                {hover.items.slice(0, 2).map((r) => (
                  <li key={r.id} className="truncate">
                    <span className="font-mono text-[10px] text-accent mr-2">{r.id}</span>
                    {r.title}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div className="text-muted-foreground text-[11px]">
            Hover a cell to inspect risks at that exposure.
          </div>
        )}
      </div>
    </section>
  );
}
