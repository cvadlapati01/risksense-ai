import { Link } from "@tanstack/react-router";

const phases = [
  { key: "identify", label: "Identify", state: "done", detail: "12 sources scanned · 2 new risks" },
  { key: "assess", label: "Assess", state: "done", detail: "47 RPNs recalculated · 5 drifted ↑" },
  { key: "mitigate", label: "Mitigate", state: "done", detail: "3 auto-escalated · 14 actions generated" },
  { key: "monitor", label: "Monitor", state: "active", detail: "Refreshing matrix · next cycle in 04:12" },
] as const;

export function EngineStatus() {
  return (
    <section className="border border-border bg-card">
      <div className="flex items-center justify-between px-5 py-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="size-2 rounded-full bg-safe" />
            <div className="absolute inset-0 size-2 rounded-full bg-safe animate-ping opacity-60" />
          </div>
          <h3 className="text-[11px] font-extrabold uppercase tracking-widest">
            Continuous Risk Engine
          </h3>
          <span className="text-[10px] font-mono text-muted-foreground">
            CYCLE #1,284 · LAST RUN 00:48 AGO · INTERVAL 15m
          </span>
        </div>
        <Link
          to="/engine"
          className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground underline-offset-4 hover:underline"
        >
          How it works →
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-border">
        {phases.map((p, i) => {
          const active = p.state === "active";
          return (
            <div key={p.key} className="p-4 flex flex-col gap-2 relative">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-muted-foreground">
                    0{i + 1}
                  </span>
                  <span className="text-xs font-extrabold uppercase tracking-wider">
                    {p.label}
                  </span>
                </div>
                <span
                  className={
                    active
                      ? "text-[9px] font-mono uppercase tracking-widest text-accent"
                      : "text-[9px] font-mono uppercase tracking-widest text-safe"
                  }
                >
                  {active ? "● Running" : "✓ Done"}
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-snug">{p.detail}</p>
              <div className="h-0.5 bg-border overflow-hidden">
                <div
                  className={active ? "h-full bg-accent animate-pulse" : "h-full bg-foreground"}
                  style={{ width: active ? "62%" : "100%" }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 border-t border-border divide-x divide-border text-center">
        <Metric value="2" label="New this cycle" tone="foreground" />
        <Metric value="5 ↑" label="Score drift up" tone="warning" />
        <Metric value="3" label="Auto-escalated" tone="accent" />
        <Metric value="14" label="Actions generated" tone="safe" />
      </div>
    </section>
  );
}

function Metric({
  value,
  label,
  tone,
}: {
  value: string;
  label: string;
  tone: "foreground" | "warning" | "accent" | "safe";
}) {
  const cls = {
    foreground: "text-foreground",
    warning: "text-warning",
    accent: "text-accent",
    safe: "text-safe",
  }[tone];
  return (
    <div className="py-3 px-2">
      <div className={`text-xl font-extrabold tabular-nums ${cls}`}>{value}</div>
      <div className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground mt-0.5">
        {label}
      </div>
    </div>
  );
}
