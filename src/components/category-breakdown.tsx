import { ALL_CATEGORIES, risks, type RiskCategory } from "@/lib/risk-data";

export function CategoryBreakdown() {
  const counts = ALL_CATEGORIES.map((c) => ({
    cat: c as RiskCategory,
    count: risks.filter((r) => r.category === c).length,
  }));
  const max = Math.max(...counts.map((c) => c.count), 1);

  return (
    <section className="border border-border bg-card p-5">
      <h2 className="text-[11px] font-extrabold uppercase tracking-widest mb-4">
        Risks by Category
      </h2>
      <div className="space-y-3">
        {counts.map(({ cat, count }) => (
          <div key={cat}>
            <div className="flex justify-between text-xs mb-1">
              <span className="font-medium">{cat}</span>
              <span className="font-mono tabular-nums">{count}</span>
            </div>
            <div className="h-1.5 bg-muted">
              <div className="h-full bg-foreground" style={{ width: `${(count / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
