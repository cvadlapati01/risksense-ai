import { useMemo, useState } from "react";
import { risks, severity, severityColor, type Risk } from "@/lib/risk-data";

type Cell = { likelihood: number; impact: number; items: Risk[] };

export function HeatmapMatrix() {
  const cells = useMemo<Cell[]>(() => {
    const out: Cell[] = [];
    for (let impact = 5; impact >= 1; impact--) {
      for (let likelihood = 1; likelihood <= 5; likelihood++) {
        out.push({
          likelihood,
          impact,
          items: risks.filter((r) => r.likelihood === likelihood && r.impact === impact),
        });
      }
    }
    return out;
  }, []);

  const [hover, setHover] = useState<Cell | null>(null);

  return (
    <section className="border border-border bg-card p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-[11px] font-extrabold uppercase tracking-widest">Exposure Matrix (5×5)</h3>
        <span className="text-[10px] font-mono text-muted-foreground">N={risks.length}</span>
      </div>
      <div className="flex gap-2">
        <div className="flex flex-col justify-between py-1 text-[10px] font-mono text-muted-foreground pr-1">
          <span>I5</span>
          <span>I4</span>
          <span>I3</span>
          <span>I2</span>
          <span>I1</span>
        </div>
        <div className="aspect-square flex-1 grid grid-cols-5 grid-rows-5 gap-1 bg-muted p-1 border border-border">
          {cells.map((c) => {
            const score = c.likelihood * c.impact;
            const sev = severity(score);
            const color = severityColor(sev);
            return (
              <button
                type="button"
                key={`${c.likelihood}-${c.impact}`}
                onMouseEnter={() => setHover(c)}
                onMouseLeave={() => setHover(null)}
                className={`${color.cell} relative flex items-center justify-center text-[10px] font-mono font-bold text-foreground/80 hover:outline hover:outline-2 hover:outline-foreground transition-all`}
                aria-label={`Likelihood ${c.likelihood} Impact ${c.impact}, ${c.items.length} risks`}
              >
                {c.items.length > 0 ? c.items.length : ""}
              </button>
            );
          })}
        </div>
      </div>
      <div className="flex justify-between mt-2 text-[10px] font-bold uppercase text-muted-foreground">
        <span>Likelihood →</span>
        <span className="text-right">Impact ↑</span>
      </div>
      <div className="mt-4 h-16 border-t border-border pt-3 text-xs">
        {hover ? (
          <div>
            <div className="font-mono text-[10px] text-muted-foreground uppercase">
              L{hover.likelihood} × I{hover.impact} — score {hover.likelihood * hover.impact}
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
          <div className="text-muted-foreground text-[11px]">Hover a cell to inspect risks at that exposure.</div>
        )}
      </div>
    </section>
  );
}
