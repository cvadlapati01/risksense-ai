import { similarProjects } from "@/lib/risk-data";

export function SimilarProjects() {
  return (
    <section className="border border-border bg-card">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-[11px] font-extrabold uppercase tracking-widest">
          Similar Historical Projects
        </h2>
        <span className="text-[10px] font-mono text-muted-foreground">
          Vector match · cosine
        </span>
      </div>
      <ul className="divide-y divide-border">
        {similarProjects.map((p) => (
          <li key={p.id} className="p-4 grid grid-cols-12 gap-3 items-center hover:bg-muted/30">
            <div className="col-span-12 md:col-span-5">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[10px] font-bold text-accent">{p.id}</span>
                <span className="text-[10px] font-mono text-muted-foreground">· {p.year}</span>
              </div>
              <div className="text-sm font-bold mt-0.5">{p.name}</div>
              <div className="text-[10px] text-muted-foreground mt-0.5">{p.outcome}</div>
            </div>
            <div className="col-span-6 md:col-span-3">
              <div className="text-[10px] font-bold uppercase text-muted-foreground">Similarity</div>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-muted">
                  <div className="h-full bg-foreground" style={{ width: `${p.similarity * 100}%` }} />
                </div>
                <span className="text-xs font-mono font-bold tabular-nums">
                  {Math.round(p.similarity * 100)}%
                </span>
              </div>
            </div>
            <div className="col-span-3 md:col-span-2 text-right">
              <div className="text-[10px] font-bold uppercase text-muted-foreground">Shared</div>
              <div className="text-base font-extrabold tabular-nums">{p.sharedRisks}</div>
            </div>
            <div className="col-span-3 md:col-span-2 text-right">
              <div className="text-[10px] font-bold uppercase text-muted-foreground">Resolved</div>
              <div className="text-base font-extrabold tabular-nums text-safe">
                {Math.round(p.resolutionRate * 100)}%
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
