import type { ReactNode } from "react";

type Props = {
  label: ReactNode;
  value: ReactNode;
  delta?: ReactNode;
  tone?: "default" | "accent" | "warning" | "safe";
  delay?: number;
};

export function KpiCard({ label, value, delta, tone = "default", delay = 0 }: Props) {
  const labelClass =
    tone === "accent" ? "text-accent" : tone === "warning" ? "text-warning" : "text-muted-foreground";
  const valueClass = tone === "accent" ? "text-accent" : "text-foreground";
  return (
    <div
      className={`animate-entry p-4 border border-border bg-card ${tone === "accent" ? "ring-2 ring-accent/10" : ""}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={`text-[10px] font-bold uppercase tracking-tighter mb-1 ${labelClass}`}>{label}</div>
      <div className={`text-3xl font-extrabold tabular-nums ${valueClass}`}>{value}</div>
      {delta && <div className="mt-2 flex items-center gap-1 text-xs font-mono text-muted-foreground">{delta}</div>}
    </div>
  );
}
