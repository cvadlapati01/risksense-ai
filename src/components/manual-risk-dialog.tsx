import { useState } from "react";
import { ALL_CATEGORIES, priorityFromRpn, type RiskCategory } from "@/lib/risk-data";

type Props = {
  open: boolean;
  onClose: () => void;
  onSubmit: (r: {
    title: string;
    description: string;
    category: RiskCategory;
    severity: number;
    occurrence: number;
    detection: number;
  }) => void;
};

export function ManualRiskDialog({ open, onClose, onSubmit }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<RiskCategory>("Operational");
  const [severity, setSeverity] = useState(5);
  const [occurrence, setOccurrence] = useState(5);
  const [detection, setDetection] = useState(5);

  if (!open) return null;
  const rpn = severity * occurrence * detection;
  const priority = priorityFromRpn(rpn);

  // Naive AI suggestion: keyword-based
  const text = `${title} ${description}`.toLowerCase();
  const suggestions: string[] = [];
  if (/(supplier|vendor|logistics|port|shipment)/.test(text))
    suggestions.push("Dual-source critical inputs and pre-qualify a contingency vendor.");
  if (/(permit|approval|regulator|compliance|audit)/.test(text))
    suggestions.push("Pre-file appeal pack in parallel; schedule weekly regulator liaison.");
  if (/(labor|workforce|staff|trade|crew)/.test(text))
    suggestions.push("Open framework agreement with neighbouring-region sub-contractors.");
  if (/(crane|equipment|tool|machine)/.test(text))
    suggestions.push("Reserve back-up equipment and schedule preventive maintenance.");
  if (/(cyber|security|network|it)/.test(text))
    suggestions.push("Segment OT/IT network and complete penetration test pre-handover.");
  if (suggestions.length === 0)
    suggestions.push("Convene risk-owner workshop within 5 working days to define mitigation actions.");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4" onClick={onClose}>
      <div
        className="bg-background border border-border max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="p-5 border-b border-border flex items-center justify-between">
          <div>
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Source: Manual
            </p>
            <h2 className="text-lg font-extrabold tracking-tight">New Risk Entry</h2>
          </div>
          <button onClick={onClose} className="text-xs font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
            Close
          </button>
        </header>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (!title.trim()) return;
            onSubmit({ title, description, category, severity, occurrence, detection });
            setTitle("");
            setDescription("");
          }}
          className="p-5 space-y-4"
        >
          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Risk Title
            </label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
              placeholder="e.g. Verbal warning from on-site engineer about scaffolding stability"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground resize-none"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_CATEGORIES.map((c) => (
                <button
                  type="button"
                  key={c}
                  onClick={() => setCategory(c)}
                  className={`px-3 py-1 text-[11px] font-bold uppercase tracking-widest border ${
                    category === c
                      ? "bg-foreground text-background border-foreground"
                      : "border-border hover:bg-muted"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Severity", val: severity, set: setSeverity },
              { label: "Occurrence", val: occurrence, set: setOccurrence },
              { label: "Detection", val: detection, set: setDetection },
            ].map((s) => (
              <div key={s.label}>
                <div className="flex justify-between mb-1">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {s.label}
                  </label>
                  <span className="text-xs font-mono font-bold">{s.val}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={10}
                  value={s.val}
                  onChange={(e) => s.set(Number(e.target.value))}
                  className="w-full accent-accent"
                />
              </div>
            ))}
          </div>

          <div className="border border-border bg-muted/50 p-3 flex items-center justify-between">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">RPN</div>
              <div className="text-2xl font-extrabold tabular-nums">{rpn}</div>
            </div>
            <div className="text-right">
              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Priority
              </div>
              <div
                className={`text-2xl font-extrabold ${
                  priority === "Critical"
                    ? "text-accent"
                    : priority === "High"
                      ? "text-warning"
                      : "text-foreground"
                }`}
              >
                {priority}
              </div>
            </div>
          </div>

          <div className="border border-border p-3">
            <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-2">
              AI-Suggested Mitigations
            </div>
            <ul className="space-y-1">
              {suggestions.map((s, i) => (
                <li key={i} className="text-xs flex gap-2">
                  <span className="text-accent">→</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-border text-[11px] font-bold uppercase tracking-widest hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-foreground text-background text-[11px] font-bold uppercase tracking-widest hover:opacity-90"
            >
              Add to Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
