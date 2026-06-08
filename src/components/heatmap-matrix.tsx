import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  risks,
  actionFor,
  actionForRisk,
  bucket3,
  ACTION_ROUTES,
  type MatrixAction,
  type Risk,
} from "@/lib/risk-data";

type Cell = { likelihood: number; impact: number; items: Risk[] };

const ACTIONS: MatrixAction[] = ["Critical Priority", "Manage", "Monitor"];

const actionStyle: Record<MatrixAction, { cell: string; chip: string; ring: string }> = {
  "Critical Priority": {
    cell: "bg-accent/80",
    chip: "bg-accent text-accent-foreground hover:opacity-90",
    ring: "ring-accent",
  },
  Manage: {
    cell: "bg-warning/60",
    chip: "bg-warning text-foreground hover:opacity-90",
    ring: "ring-warning",
  },
  Monitor: {
    cell: "bg-safe/50",
    chip: "bg-safe text-foreground hover:opacity-90",
    ring: "ring-safe",
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
            (r) => bucket3(r.likelihood) === likelihood && bucket3(r.impact) === impact,
          ),
        });
      }
    }
    return out;
  }, []);

  const countsByAction = useMemo(() => {
    const c: Record<MatrixAction, number> = {
      "Critical Priority": 0,
      Manage: 0,
      Monitor: 0,
    };
    for (const r of risks) c[actionForRisk(r)] += 1;
    return c;
  }, []);

  const [hover, setHover] = useState<Cell | null>(null);
  const hoverAction = hover ? actionFor(hover.likelihood, hover.impact) : null;

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
            const target = ACTION_ROUTES[action];
            return (
              <Link
                key={`${c.likelihood}-${c.impact}`}
                to={target.route}
                search={{ action }}
                onMouseEnter={() => setHover(c)}
                onMouseLeave={() => setHover(null)}
                className={`${style.cell} relative flex items-center justify-center text-[10px] font-mono font-bold text-foreground/80 hover:outline hover:outline-2 hover:outline-foreground transition-all`}
                aria-label={`Likelihood ${c.likelihood} Impact ${c.impact} — ${c.items.length} risks — ${action}`}
              >
                {c.items.length > 0 ? c.items.length : ""}
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex justify-between mt-2 text-[10px] font-bold uppercase text-muted-foreground">
        <span>Probability (Low → High)</span>
        <span className="text-right">Severity / Impact ↑</span>
      </div>

      {/* Action legend — each chip routes to its FMEA workflow step */}
      <div className="mt-4 border-t border-border pt-3">
        <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
          Actions · routed to workflow step
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {ACTIONS.map((a) => {
            const target = ACTION_ROUTES[a];
            const isHovered = hoverAction === a;
            return (
              <Link
                key={a}
                to={target.route}
                search={{ action: a }}
                className={`block border border-border bg-background p-2.5 transition-all hover:border-foreground ${
                  isHovered ? `ring-2 ${actionStyle[a].ring}` : ""
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span
                    className={`${actionStyle[a].chip} px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider`}
                  >
                    {a}
                  </span>
                  <span className="font-mono text-[10px] font-bold tabular-nums">
                    {countsByAction[a]}
                  </span>
                </div>
                <div className="text-[10px] font-bold uppercase tracking-wider text-foreground/80">
                  → {target.step}
                </div>
                <div className="text-[10px] text-muted-foreground leading-snug">
                  {target.verb}
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="mt-4 h-16 border-t border-border pt-3 text-xs">
        {hover ? (
          <div>
            <div className="font-mono text-[10px] text-muted-foreground uppercase">
              L{hover.likelihood} × I{hover.impact} — Action: {hoverAction}
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
            Hover a cell or chip — click to jump to the wired workflow step.
          </div>
        )}
      </div>
    </section>
  );
}
