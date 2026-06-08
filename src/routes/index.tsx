import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import {
  Play,
  ClipboardList,
  AlertTriangle,
  ShieldCheck,
  FileBarChart,
  BookOpen,
  PlusCircle,
} from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "My RiskSense" },
      {
        name: "description",
        content:
          "Personal risk management workspace for Project Managers — open risks, to-dos, and quick actions.",
      },
    ],
  }),
  component: Home,
});

type TabKey = "owned" | "reviewing" | "watching" | "closed";

const riskTabs: { key: TabKey; label: string }[] = [
  { key: "owned", label: "Owned by me" },
  { key: "reviewing", label: "In review" },
  { key: "watching", label: "Watching" },
  { key: "closed", label: "Closed" },
];

const risksByTab: Record<TabKey, { code: string; category: string; title: string; project: string }[]> = {
  owned: [
    { code: "R-0042", category: "Schedule", title: "Vendor delivery slip on long-lead components", project: "Phoenix Core" },
    { code: "R-0058", category: "Technical", title: "Interface spec gap between Module A and B", project: "Phoenix Core" },
    { code: "R-0071", category: "Resource", title: "Key SME availability constrained in Q1", project: "Atlas Migration" },
    { code: "R-0083", category: "Compliance", title: "GDPR review pending for analytics pipeline", project: "Atlas Migration" },
    { code: "R-0091", category: "Cost", title: "Currency exposure on EU subcontract", project: "Helios Rollout" },
  ],
  reviewing: [
    { code: "R-0034", category: "Quality", title: "Acceptance criteria ambiguity in UAT scripts", project: "Phoenix Core" },
    { code: "R-0067", category: "Vendor", title: "Subcontractor SLA renegotiation in progress", project: "Helios Rollout" },
  ],
  watching: [
    { code: "R-0102", category: "Market", title: "Competitor product launch may shift scope", project: "Atlas Migration" },
  ],
  closed: [],
};

const todos = [
  { icon: ClipboardList, label: "Mitigation actions due", count: 3 },
  { icon: AlertTriangle, label: "Risks awaiting review", count: 2, warn: true },
  { icon: ShieldCheck, label: "Quarterly risk re-assessments", count: 4 },
];

const whatHappened: { icon: typeof AlertTriangle; label: string; to: "/intake" | "/mitigation" }[] = [
  { icon: AlertTriangle, label: "Report a new risk", to: "/intake" },
  { icon: PlusCircle, label: "Log mitigation update", to: "/mitigation" },
];

const stayInformed: { icon: typeof BookOpen; label: string; to: "/admin" | "/register" | "/workstreams" }[] = [
  { icon: BookOpen, label: "Risk management guideline", to: "/admin" },
  { icon: FileBarChart, label: "Risk register", to: "/register" },
  { icon: ShieldCheck, label: "Workstreams overview", to: "/workstreams" },
];

function Home() {
  const [tab, setTab] = useState<TabKey>("owned");
  const rows = risksByTab[tab];

  return (
    <div className="min-h-screen bg-muted/30 text-foreground">
      <SiteHeader />

      <main className="max-w-[1400px] mx-auto px-6 py-10">
        <header className="mb-8 flex flex-wrap items-baseline gap-3">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome, L. Bolongaita
          </h1>
          <Link
            to="/dashboard"
            className="text-sm text-accent hover:underline"
          >
            Switch to program view
          </Link>
        </header>

        <div className="grid grid-cols-12 gap-6">
          {/* My Risks */}
          <section className="col-span-12 lg:col-span-7 bg-card border border-border rounded-sm">
            <div className="px-6 pt-5">
              <h2 className="text-xl font-semibold text-accent">My Risks</h2>
              <div className="mt-4 flex gap-6 border-b border-border">
                {riskTabs.map((t) => (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className={`pb-2 text-sm transition-colors ${
                      tab === t.key
                        ? "text-accent border-b-2 border-accent font-medium"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex justify-between border-b border-border">
              <span>Risk / Project</span>
              <span>Action</span>
            </div>

            <ul className="divide-y divide-border">
              {rows.length === 0 && (
                <li className="px-6 py-10 text-center text-sm text-muted-foreground">
                  Nothing here.
                </li>
              )}
              {rows.map((r) => (
                <li
                  key={r.code}
                  className="px-6 py-4 flex items-center justify-between gap-4 hover:bg-muted/40"
                >
                  <div className="min-w-0">
                    <div className="text-xs text-muted-foreground">
                      {r.code} · {r.category}
                    </div>
                    <div className="font-medium truncate">{r.title}</div>
                    <div className="text-xs text-muted-foreground mt-0.5">
                      {r.project}
                    </div>
                  </div>
                  <Link
                    to="/risks"
                    className="shrink-0 inline-flex items-center gap-2 border border-border rounded-sm px-3 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground transition-colors"
                  >
                    <Play className="size-3.5" />
                    Open
                  </Link>
                </li>
              ))}
            </ul>
          </section>

          {/* To-dos */}
          <section className="col-span-12 md:col-span-7 lg:col-span-3 bg-card border border-border rounded-sm self-start">
            <div className="px-5 pt-5 pb-3">
              <h2 className="text-xl font-semibold text-accent">To-dos</h2>
            </div>
            <div className="px-5 pb-2 flex justify-between text-xs font-semibold uppercase tracking-wider text-muted-foreground border-b border-border pb-2">
              <span>Scope</span>
              <span>Number</span>
            </div>
            <ul>
              {todos.map((t) => (
                <li
                  key={t.label}
                  className="px-5 py-3 flex items-center justify-between border-b border-border last:border-b-0 hover:bg-muted/40"
                >
                  <span className="flex items-center gap-2 text-sm">
                    <t.icon className="size-4 text-muted-foreground" />
                    {t.label}
                  </span>
                  <span className="flex items-center gap-2">
                    {t.warn && (
                      <span className="size-4 rounded-full border border-destructive text-destructive text-[10px] flex items-center justify-center font-bold">
                        !
                      </span>
                    )}
                    <span className="text-sm font-semibold">{t.count}</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* Right column quick links */}
          <aside className="col-span-12 md:col-span-5 lg:col-span-2 space-y-6">
            <div>
              <h3 className="text-sm font-semibold text-accent mb-2">
                What happened?
              </h3>
              <div className="space-y-2">
                {whatHappened.map((q) => (
                  <Link
                    key={q.label}
                    to={q.to}
                    className="flex items-center gap-2 bg-card border border-border rounded-sm px-3 py-2.5 text-sm hover:border-accent transition-colors"
                  >
                    <q.icon className="size-4 text-warning" />
                    <span>{q.label}</span>
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-accent mb-2">
                Stay informed
              </h3>
              <div className="space-y-2">
                {stayInformed.map((q) => (
                  <Link
                    key={q.label}
                    to={q.to}
                    className="flex items-center gap-2 bg-card border border-border rounded-sm px-3 py-2.5 text-sm hover:border-accent transition-colors"
                  >
                    <q.icon className="size-4 text-muted-foreground" />
                    <span>{q.label}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
