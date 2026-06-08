import { ALL_SOURCES, dataSourcesMeta, risks } from "@/lib/risk-data";

export function SourceCoverage() {
  const counts = ALL_SOURCES.map((s) => ({
    src: s,
    count: risks.filter((r) => r.source === s).length,
    meta: dataSourcesMeta[s],
  }));

  return (
    <section className="border border-border bg-card">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-[11px] font-extrabold uppercase tracking-widest">
          9-System Aggregation Layer
        </h2>
        <span className="text-[10px] font-mono text-muted-foreground">Read-only</span>
      </div>
      <ul className="divide-y divide-border">
        {counts.map(({ src, count, meta }) => (
          <li key={src} className="p-3 flex items-center gap-3 hover:bg-muted/30">
            <span className="size-2 bg-safe rounded-full" />
            <div className="flex-1 min-w-0">
              <div className="text-xs font-bold">{src}</div>
              <div className="text-[10px] text-muted-foreground truncate">{meta.description}</div>
            </div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
              {meta.type}
            </span>
            <span className="text-xs font-mono font-bold tabular-nums w-8 text-right">
              {count}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
