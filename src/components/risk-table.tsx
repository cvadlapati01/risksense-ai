import { useMemo, useState } from "react";
import { risks as allRisks, severity, severityColor, type Risk } from "@/lib/risk-data";

type Props = {
  initial?: Risk[];
  showFilters?: boolean;
  onSelect?: (r: Risk) => void;
  selectedId?: string;
  limit?: number;
};

const statusStyle: Record<Risk["status"], string> = {
  Escalated: "bg-accent/10 text-accent",
  Active: "bg-warning/15 text-warning",
  "Under Review": "bg-muted text-muted-foreground",
  Mitigated: "bg-safe/20 text-safe",
  Watching: "bg-muted text-muted-foreground",
};

export function RiskTable({ initial, showFilters = true, onSelect, selectedId, limit }: Props) {
  const source = initial ?? allRisks;
  const [stream, setStream] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"score" | "id">("score");

  const streams = useMemo(() => ["All", ...Array.from(new Set(source.map((r) => r.workstream)))], [source]);

  const rows = useMemo(() => {
    let r = stream === "All" ? source : source.filter((x) => x.workstream === stream);
    r = [...r].sort((a, b) =>
      sortBy === "score" ? b.likelihood * b.impact - a.likelihood * a.impact : a.id.localeCompare(b.id),
    );
    return limit ? r.slice(0, limit) : r;
  }, [source, stream, sortBy, limit]);

  return (
    <div className="border border-border bg-card">
      <div className="flex items-center justify-between p-4 border-b border-border gap-4 flex-wrap">
        <h2 className="text-[11px] font-extrabold uppercase tracking-widest">Risk Register (Live View)</h2>
        {showFilters && (
          <div className="flex gap-2 items-center">
            <select
              value={stream}
              onChange={(e) => setStream(e.target.value)}
              className="px-3 py-1 border border-border text-[10px] font-bold uppercase bg-background hover:bg-muted"
            >
              {streams.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <button
              onClick={() => setSortBy(sortBy === "score" ? "id" : "score")}
              className="px-3 py-1 border border-border text-[10px] font-bold uppercase hover:bg-muted"
            >
              Sort: {sortBy}
            </button>
            <button className="px-3 py-1 bg-foreground text-background text-[10px] font-bold uppercase">
              Export CSV
            </button>
          </div>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-muted/60 border-b border-border">
            <tr>
              <th className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">ID</th>
              <th className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                Risk Title
              </th>
              <th className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">
                Stream
              </th>
              <th className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">L × I</th>
              <th className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Score</th>
              <th className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Status</th>
              <th className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tight text-right">
                Owner
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => {
              const score = r.likelihood * r.impact;
              const sev = severity(score);
              const color = severityColor(sev);
              const isSelected = r.id === selectedId;
              return (
                <tr
                  key={r.id}
                  onClick={() => onSelect?.(r)}
                  className={`transition-colors cursor-pointer ${
                    isSelected ? "bg-accent/5" : "hover:bg-muted/40"
                  }`}
                >
                  <td className="px-4 py-3 font-mono text-[11px]">{r.id}</td>
                  <td className="px-4 py-3">
                    <div className="text-xs font-bold">{r.title}</div>
                    <div className="text-[10px] text-muted-foreground">{r.subtitle}</div>
                  </td>
                  <td className="px-4 py-3 text-[10px] font-medium">{r.workstream}</td>
                  <td className="px-4 py-3 text-[10px] font-mono">
                    {r.likelihood} × {r.impact}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 ${color.bg} ${color.text} text-[10px] font-extrabold`}>
                      {score.toString().padStart(2, "0")}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${statusStyle[r.status]}`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right text-[11px] font-medium">{r.owner}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
