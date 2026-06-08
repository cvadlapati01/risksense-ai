import type { Risk } from "@/lib/risk-data";

export function MitigationFocus({ risk }: { risk: Risk }) {
  const progress = Math.round((risk.actionsCompleted / risk.actionsTotal) * 100);
  return (
    <div className="bg-card border border-border p-4">
      <div className="flex justify-between items-start mb-4 gap-4">
        <div>
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">
            Focused View
          </span>
          <h4 className="text-sm font-extrabold">Mitigation Strategy: {risk.id}</h4>
          <p className="text-xs text-muted-foreground mt-0.5">{risk.title}</p>
        </div>
        <div className="text-right shrink-0">
          <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest block">
            Due Date
          </span>
          <span className="text-xs font-mono">{risk.dueDate}</span>
        </div>
      </div>
      <p className="text-xs text-muted-foreground mb-4 leading-relaxed">{risk.mitigation}</p>
      <div className="grid grid-cols-3 gap-3">
        <div className="p-2 bg-muted border border-border/50">
          <span className="text-[9px] font-bold text-muted-foreground uppercase block">Actions</span>
          <span className="text-xs font-bold">
            {risk.actionsCompleted.toString().padStart(2, "0")} / {risk.actionsTotal.toString().padStart(2, "0")}
          </span>
          <div className="mt-1 h-1 bg-border">
            <div className="h-full bg-foreground" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="p-2 bg-muted border border-border/50">
          <span className="text-[9px] font-bold text-muted-foreground uppercase block">Residual</span>
          <span
            className={`text-xs font-bold ${
              risk.residual === "Critical"
                ? "text-accent"
                : risk.residual === "High"
                  ? "text-warning"
                  : risk.residual === "Moderate"
                    ? "text-warning"
                    : "text-safe"
            }`}
          >
            {risk.residual}
          </span>
        </div>
        <div className="p-2 bg-muted border border-border/50">
          <span className="text-[9px] font-bold text-muted-foreground uppercase block">Owner</span>
          <span className="text-xs font-bold">{risk.owner}</span>
        </div>
      </div>
    </div>
  );
}
