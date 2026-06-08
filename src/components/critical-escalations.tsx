import { risks, severity } from "@/lib/risk-data";

export function CriticalEscalations() {
  const top = [...risks]
    .sort((a, b) => b.likelihood * b.impact - a.likelihood * a.impact)
    .slice(0, 4);

  return (
    <section className="border border-border bg-card p-5">
      <h3 className="text-[11px] font-extrabold uppercase tracking-widest mb-4">Critical Escalations</h3>
      <div className="space-y-3">
        {top.map((r, i) => {
          const score = r.likelihood * r.impact;
          const sev = severity(score);
          const tone =
            sev === "critical" ? "bg-accent text-accent-foreground" : "bg-warning text-warning-foreground";
          const label = sev === "critical" ? "Critical" : sev === "high" ? "High" : "Moderate";
          const idTone = sev === "critical" ? "text-accent" : "text-warning";
          return (
            <div key={r.id}>
              <div className="group cursor-pointer">
                <div className="flex justify-between items-start mb-1">
                  <span className={`text-[10px] font-mono font-bold ${idTone}`}>#{r.id}</span>
                  <span className={`px-1.5 py-0.5 ${tone} text-[9px] font-bold uppercase tracking-wider`}>
                    {label}
                  </span>
                </div>
                <p className="text-xs font-semibold leading-tight group-hover:underline">{r.title}</p>
                <p className="text-[10px] text-muted-foreground mt-1 uppercase tracking-wider">
                  Workstream: {r.workstream} · Owner: {r.owner}
                </p>
              </div>
              {i < top.length - 1 && <div className="h-px bg-border mt-3" />}
            </div>
          );
        })}
      </div>
    </section>
  );
}
