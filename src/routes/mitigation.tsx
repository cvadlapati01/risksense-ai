import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useMemo } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import {
  risks as seedRisks,
  rpn,
  priorityFromRpn,
  actionForRisk,
  type Risk,
  type MatrixAction,
} from "@/lib/risk-data";
import { toast } from "sonner";

const ACTION_VALUES: MatrixAction[] = ["Critical Priority", "Manage", "Monitor"];

type MitigationSearch = { action?: MatrixAction };

export const Route = createFileRoute("/mitigation")({
  validateSearch: (s: Record<string, unknown>): MitigationSearch => {
    const a = s.action;
    return {
      action:
        typeof a === "string" && (ACTION_VALUES as string[]).includes(a)
          ? (a as MatrixAction)
          : undefined,
    };
  },
  head: () => ({
    meta: [
      { title: "Develop Mitigation Plans — RiskSense" },
      {
        name: "description",
        content:
          "Formulate response playbooks, trigger thresholds, and assign departmental owners for identified risks.",
      },
      { property: "og:title", content: "Develop Mitigation Plans — RiskSense" },
      { property: "og:description", content: "Build mitigation playbooks per risk." },
    ],
  }),
  component: MitigationPage,
});

type Strategy = "Avoid" | "Reduce" | "Transfer" | "Accept";

const STRATEGIES: { key: Strategy; title: string; desc: string }[] = [
  { key: "Avoid", title: "Avoid", desc: "Change scope or approach entirely" },
  { key: "Reduce", title: "Reduce", desc: "Lower probability or impact" },
  { key: "Transfer", title: "Transfer", desc: "Shift operational risk to 3rd party" },
  { key: "Accept", title: "Accept", desc: "Accept risk, monitor closely" },
];

const DEPARTMENTS = [
  "Engineering / R&D",
  "Procurement / Supply Chain",
  "Operations",
  "Quality / Compliance",
  "Finance",
  "Legal",
  "PMO",
];

const ACTION_CATEGORIES = [
  "Process Change",
  "Technical Control",
  "Contractual",
  "Training / Awareness",
  "Monitoring / KPI",
  "Contingency Plan",
];

function MitigationPage() {
  const { action } = Route.useSearch();
  const navigate = useNavigate({ from: "/mitigation" });
  const list = useMemo(() => {
    const open = seedRisks.filter((r) => r.status !== "Mitigated");
    return action ? open.filter((r) => actionForRisk(r) === action) : open;
  }, [action]);
  const [selectedId, setSelectedId] = useState<string>(list[0]?.id ?? "");
  const selected = list.find((r) => r.id === selectedId) ?? list[0];

  const [strategy, setStrategy] = useState<Strategy>("Reduce");
  const [actions, setActions] = useState("");
  const [trigger, setTrigger] = useState("");
  const [owner, setOwner] = useState("");
  const [dept, setDept] = useState(DEPARTMENTS[0]);
  const [email, setEmail] = useState("");
  const [category, setCategory] = useState("");

  // Allocation state
  type AllocRow = { id: string; scope: string; position: string; task: string; checked: boolean };
  const [allocRows, setAllocRows] = useState<AllocRow[]>([
    {
      id: "a1",
      scope: "Hamburg Main",
      position: "Facility Manager (ega) — Major, Tom (Facility Management)",
      task: "Recording",
      checked: false,
    },
  ]);
  const [intervalStart, setIntervalStart] = useState("2024-01");
  const [intervalEnd, setIntervalEnd] = useState("");
  const [repetition, setRepetition] = useState("Monthly");
  const [deadlineDays, setDeadlineDays] = useState(5);

  const addAllocRow = () =>
    setAllocRows((rows) => [
      ...rows,
      {
        id: `a${rows.length + 1}-${Date.now()}`,
        scope: "",
        position: "",
        task: "Recording",
        checked: false,
      },
    ]);
  const removeAllocRows = () =>
    setAllocRows((rows) => rows.filter((r) => !r.checked));
  const updateAllocRow = (id: string, patch: Partial<AllocRow>) =>
    setAllocRows((rows) => rows.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const save = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success(`Mitigation playbook saved for ${selected.id}`, {
      description: `${strategy} · ${dept}`,
    });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="p-6 max-w-[1600px] mx-auto space-y-6">
        <header>
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
            Mitigate Strategy
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight">Develop Mitigation Plans</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Formulate response playbooks, trigger thresholds, and assign departmental owners for
            identified risks.
          </p>
        </header>

        {action && (
          <div className="flex items-center justify-between gap-3 border border-accent/40 bg-accent/5 px-4 py-2 text-[11px] font-bold uppercase tracking-wider">
            <span>
              Routed from matrix · Action:{" "}
              <span className="text-accent">{action}</span> · {list.length} risk
              {list.length === 1 ? "" : "s"} queued for playbook
            </span>
            <button
              type="button"
              onClick={() => navigate({ search: { action: undefined }, replace: true })}
              className="px-2 py-1 border border-border hover:bg-background"
            >
              Show all
            </button>
          </div>
        )}

        <div className="grid grid-cols-12 gap-6">
          {/* Risks Checklist */}
          <aside className="col-span-12 lg:col-span-3">

            <div className="border border-border bg-card p-4">
              <h2 className="text-[11px] font-extrabold uppercase tracking-widest mb-3">
                Risks Checklist
              </h2>
              <ul className="space-y-2 max-h-[680px] overflow-y-auto pr-1">
                {list.map((r) => {
                  const pr = priorityFromRpn(rpn(r));
                  const active = r.id === selected?.id;
                  return (
                    <li key={r.id}>
                      <button
                        type="button"
                        onClick={() => setSelectedId(r.id)}
                        className={`w-full text-left border p-3 transition-colors ${
                          active
                            ? "border-primary bg-primary/5"
                            : "border-border bg-background hover:border-muted-foreground/40"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <span className="font-mono text-[10px] font-bold">{r.id}</span>
                          <span
                            className={`text-[9px] font-bold uppercase tracking-widest ${
                              pr === "Critical"
                                ? "text-accent"
                                : pr === "High"
                                  ? "text-warning"
                                  : pr === "Medium"
                                    ? "text-warning"
                                    : "text-safe"
                            }`}
                          >
                            {pr}
                          </span>
                        </div>
                        <p className="text-xs font-bold leading-tight line-clamp-2 mb-1">
                          {r.title}
                        </p>
                        <div className="flex items-center justify-between text-[10px] text-muted-foreground">
                          <span className="truncate">Owner: {r.owner}</span>
                          <span className="font-mono bg-muted px-1.5 py-0.5 ml-2 shrink-0">
                            {r.source}
                          </span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </aside>

          {/* Mitigation Form */}
          <section className="col-span-12 lg:col-span-9">
            {selected && (
              <form onSubmit={save} className="border border-border bg-card p-6 space-y-6">
                <div>
                  <h2 className="text-lg font-extrabold leading-tight">
                    {selected.id}: {selected.title}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-1">{selected.subtitle}</p>
                </div>

                {/* Strategy selector */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                    Select Mitigation Strategy
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {STRATEGIES.map((s) => {
                      const active = strategy === s.key;
                      return (
                        <button
                          type="button"
                          key={s.key}
                          onClick={() => setStrategy(s.key)}
                          className={`border p-4 text-center transition-colors ${
                            active
                              ? "border-primary bg-primary/10"
                              : "border-border bg-background hover:border-muted-foreground/40"
                          }`}
                        >
                          <div className="text-sm font-extrabold mb-1">{s.title}</div>
                          <div className="text-[10px] text-muted-foreground leading-snug">
                            {s.desc}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* AI Mitigation Recommendations */}
                {selected.aiRecommendations.length > 0 && (
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                      AI Mitigation Recommendations
                    </label>
                    <ul className="space-y-2 border border-border bg-muted/30 p-4">
                      {selected.aiRecommendations.map((rec, i) => (
                        <li key={i} className="text-xs flex gap-2">
                          <span className="text-accent font-bold">{i + 1}.</span>
                          <span>{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Actions */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                    Concrete Countermeasures / Actions
                  </label>
                  <textarea
                    value={actions}
                    onChange={(e) => setActions(e.target.value)}
                    rows={4}
                    placeholder="Describe specific actions to implement..."
                    className="w-full bg-background border border-border p-3 text-xs font-mono focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Trigger */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                    Trigger Threshold / Trigger Condition
                  </label>
                  <input
                    value={trigger}
                    onChange={(e) => setTrigger(e.target.value)}
                    placeholder="e.g. Lead time exceeds 18 weeks, or vendor yields drop below 80%"
                    className="w-full bg-background border border-border p-3 text-xs font-mono focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Responsible Owner + Department */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                      Responsible Owner
                    </label>
                    <select
                      value={owner}
                      onChange={(e) => setOwner(e.target.value)}
                      className="w-full bg-background border border-border p-3 text-xs focus:outline-none focus:border-primary"
                    >
                      <option value="">-- Select Responsible Owner --</option>
                      {Array.from(new Set(seedRisks.map((r) => r.owner))).map((o) => (
                        <option key={o} value={o}>
                          {o}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                      Department Silo (Owner Group)
                    </label>
                    <select
                      value={dept}
                      onChange={(e) => setDept(e.target.value)}
                      className="w-full bg-background border border-border p-3 text-xs focus:outline-none focus:border-primary"
                    >
                      {DEPARTMENTS.map((d) => (
                        <option key={d} value={d}>
                          {d}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Owner Email */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                    Owner Email (for coordination sync)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="owner@company.com"
                    className="w-full bg-background border border-border p-3 text-xs font-mono focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Action Category */}
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                    Action Category (Taxonomy)
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full bg-background border border-border p-3 text-xs focus:outline-none focus:border-primary"
                  >
                    <option value="">-- Select Action Category --</option>
                    {ACTION_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Allocation */}
                <div className="space-y-4 border-t border-border pt-6">
                  <div>
                    <h3 className="text-base font-extrabold tracking-tight">Allocation</h3>
                  </div>


                  {/* Interval */}
                  <div>
                    <div className="border border-border divide-y divide-border">
                      <div className="grid grid-cols-1 md:grid-cols-2 items-center">
                        <div className="p-3 bg-muted/30 text-xs font-bold">Start</div>
                        <div className="p-3">
                          <input
                            type="month"
                            value={intervalStart}
                            onChange={(e) => setIntervalStart(e.target.value)}
                            className="w-full bg-background border border-border px-2 py-1 text-xs focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center">
                        <div className="p-3 bg-muted/30 text-xs font-bold">End</div>
                        <div className="p-3 md:col-span-3">
                          <input
                            type="date"
                            value={intervalEnd}
                            onChange={(e) => setIntervalEnd(e.target.value)}
                            className="w-full bg-background border border-border px-2 py-1 text-xs focus:outline-none focus:border-primary"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-4 items-center">
                        <div className="p-3 bg-muted/30 text-xs font-bold">
                          Deadline for recording
                        </div>
                        <div className="p-3 md:col-span-3 flex items-center gap-2">
                          <input
                            type="number"
                            min={0}
                            value={deadlineDays}
                            onChange={(e) => setDeadlineDays(Number(e.target.value))}
                            className="w-20 bg-background border border-border px-2 py-1 text-xs focus:outline-none focus:border-primary"
                          />
                          <span className="text-xs text-muted-foreground">
                            days after end of a reporting period
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Responsible Owner + Department */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                        Responsible Owner
                      </label>
                      <select
                        value={owner}
                        onChange={(e) => setOwner(e.target.value)}
                        className="w-full bg-background border border-border p-3 text-xs focus:outline-none focus:border-primary"
                      >
                        <option value="">-- Select Responsible Owner --</option>
                        {Array.from(new Set(seedRisks.map((r) => r.owner))).map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                        Department Silo (Owner Group)
                      </label>
                      <select
                        value={dept}
                        onChange={(e) => setDept(e.target.value)}
                        className="w-full bg-background border border-border p-3 text-xs focus:outline-none focus:border-primary"
                      >
                        {DEPARTMENTS.map((d) => (
                          <option key={d} value={d}>
                            {d}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Owner Email */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                      Owner Email (for coordination sync)
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="owner@company.com"
                      className="w-full bg-background border border-border p-3 text-xs font-mono focus:outline-none focus:border-primary"
                    />
                  </div>

                  {/* Action Category */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground block mb-2">
                      Action Category (Taxonomy)
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full bg-background border border-border p-3 text-xs focus:outline-none focus:border-primary"
                    >
                      <option value="">-- Select Action Category --</option>
                      {ACTION_CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground font-bold text-sm py-3 hover:bg-primary/90 transition-colors"
                >
                  Save Mitigation Playbook
                </button>
              </form>
            )}
          </section>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
