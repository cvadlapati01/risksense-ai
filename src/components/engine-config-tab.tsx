import { useState } from "react";
import { ALL_SOURCES, dataSourcesMeta } from "@/lib/risk-data";

export function EngineConfigTab() {
  const [interval, setInterval] = useState(15);
  const [enabled, setEnabled] = useState<Record<string, boolean>>(
    Object.fromEntries(ALL_SOURCES.map((s) => [s, true])),
  );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <section className="border border-border bg-card p-5 space-y-5">
        <h2 className="text-[11px] font-extrabold uppercase tracking-widest">
          Continuous Engine — Run Settings
        </h2>

        <div>
          <div className="flex justify-between mb-2">
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Re-scan Interval
            </label>
            <span className="text-xs font-mono font-bold">
              {interval < 60 ? `${interval} min` : `${Math.floor(interval / 60)} h`}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={60}
            value={interval}
            onChange={(e) => setInterval(Number(e.target.value))}
            className="w-full accent-accent"
          />
          <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-1">
            <span>10s · demo</span>
            <span>60 min · production</span>
          </div>
        </div>
      </section>


      <section className="border border-border bg-card">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-[11px] font-extrabold uppercase tracking-widest">
            Data Source Toggles
          </h2>
          <span className="text-[10px] font-mono text-muted-foreground">
            {Object.values(enabled).filter(Boolean).length} / {ALL_SOURCES.length} active
          </span>
        </div>
        <ul className="divide-y divide-border">
          {ALL_SOURCES.map((s) => {
            const meta = dataSourcesMeta[s];
            const on = enabled[s];
            return (
              <li key={s} className="p-3 flex items-center gap-3 hover:bg-muted/30">
                <button
                  type="button"
                  onClick={() => setEnabled({ ...enabled, [s]: !on })}
                  className={`relative w-10 h-5 border ${
                    on ? "bg-foreground border-foreground" : "bg-background border-border"
                  }`}
                  aria-pressed={on}
                  aria-label={`Toggle ${s}`}
                >
                  <span
                    className={`absolute top-0.5 size-3.5 bg-background border border-foreground transition-all ${
                      on ? "left-[22px] bg-accent border-accent" : "left-0.5"
                    }`}
                  />
                </button>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-bold">{s}</div>
                  <div className="text-[10px] text-muted-foreground truncate">{meta.description}</div>
                </div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                  {meta.type}
                </span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
