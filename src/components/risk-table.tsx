import { useMemo, useState } from "react";
import {
  risks as allRisks,
  rpn,
  priorityFromRpn,
  actionForRisk,
  type Risk,
  type MatrixAction,
  ALL_SOURCES,
} from "@/lib/risk-data";

type Props = {
  initial?: Risk[];
  showFilters?: boolean;
  onSelect?: (r: Risk) => void;
  selectedId?: string;
  limit?: number;
  onAddManual?: () => void;
  actionFilter?: MatrixAction;
  onClearActionFilter?: () => void;
};


const priorityStyle: Record<ReturnType<typeof priorityFromRpn>, string> = {
  Critical: "bg-accent/10 text-accent",
  High: "bg-warning/15 text-warning",
  Medium: "bg-warning/10 text-warning",
  Low: "bg-muted text-muted-foreground",
};

export function RiskTable({
  initial,
  showFilters = true,
  onSelect,
  selectedId,
  limit,
  onAddManual,
  actionFilter,
  onClearActionFilter,
}: Props) {
  const source = initial ?? allRisks;
  const [stream, setStream] = useState<string>("All");
  const [src, setSrc] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"rpn" | "id">("rpn");

  const streams = useMemo(() => ["All", ...Array.from(new Set(source.map((r) => r.workstream)))], [source]);

  const rows = useMemo(() => {
    let r = source;
    if (actionFilter) r = r.filter((x) => actionForRisk(x) === actionFilter);
    if (stream !== "All") r = r.filter((x) => x.workstream === stream);
    if (src !== "All") r = r.filter((x) => x.source === src);
    r = [...r].sort((a, b) => (sortBy === "rpn" ? rpn(b) - rpn(a) : a.id.localeCompare(b.id)));
    return limit ? r.slice(0, limit) : r;
  }, [source, stream, src, sortBy, limit, actionFilter]);

  return (
    <div className="border border-border bg-card">
      <div className="flex items-center justify-between p-4 border-b border-border gap-4 flex-wrap">
        <h2 className="text-[11px] font-extrabold uppercase tracking-widest">Risk Register (Live View)</h2>
        {showFilters && (
          <div className="flex gap-2 items-center flex-wrap">
            <select
              value={stream}
              onChange={(e) => setStream(e.target.value)}
              className="px-2 py-1 border border-border text-[10px] font-bold uppercase bg-background"
            >
              {streams.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <select
              value={src}
              onChange={(e) => setSrc(e.target.value)}
              className="px-2 py-1 border border-border text-[10px] font-bold uppercase bg-background"
            >
              <option>All</option>
              {ALL_SOURCES.map((s) => (
                <option key={s}>{s}</option>
              ))}
            </select>
            <button
              onClick={() => setSortBy(sortBy === "rpn" ? "id" : "rpn")}
              className="px-3 py-1 border border-border text-[10px] font-bold uppercase hover:bg-muted"
            >
              Sort: {sortBy.toUpperCase()}
            </button>
            {onAddManual && (
              <button
                onClick={onAddManual}
                className="px-3 py-1 border border-foreground text-[10px] font-bold uppercase hover:bg-muted"
              >
                + Manual Risk
              </button>
            )}
            <button className="px-3 py-1 bg-foreground text-background text-[10px] font-bold uppercase">
              Export CSV
            </button>
          </div>
        )}
      </div>
      {actionFilter && (
        <div className="flex items-center justify-between gap-3 px-4 py-2 border-b border-border bg-muted/40 text-[10px] font-bold uppercase tracking-wider">
          <span>
            Filtered to action:{" "}
            <span className="text-accent">{actionFilter}</span> · {rows.length} risk{rows.length === 1 ? "" : "s"}
          </span>
          {onClearActionFilter && (
            <button
              type="button"
              onClick={onClearActionFilter}
              className="px-2 py-1 border border-border hover:bg-background"
            >
              Clear
            </button>
          )}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-muted/60 border-b border-border">
            <tr>
              <th className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">ID</th>
              <th className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Risk</th>
              <th className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Source</th>
              <th className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">S·O·D</th>
              <th className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">RPN</th>
              <th className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Priority</th>
              <th className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Status</th>
              <th className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tight text-right">
                Owner
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => {
              const score = rpn(r);
              const priority = priorityFromRpn(score);
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
                    <div className="text-[10px] text-muted-foreground">
                      {r.subtitle} · {r.workstream}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="text-[10px] font-bold">{r.source}</div>
                    <div className="text-[10px] font-mono text-muted-foreground">{r.sourceRef}</div>
                  </td>
                  <td className="px-4 py-3 text-[10px] font-mono tabular-nums">
                    {r.severity}·{r.occurrence}·{r.detection}
                  </td>
                  <td className="px-4 py-3 font-mono font-extrabold tabular-nums text-xs">{score}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${priorityStyle[priority]}`}
                    >
                      {priority}
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
