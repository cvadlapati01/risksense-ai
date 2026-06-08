import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { EngineConfigTab } from "@/components/engine-config-tab";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Administration — RiskSense" },
      {
        name: "description",
        content:
          "Configure company profile, departments, users, roles, master data, and audit trail.",
      },
      { property: "og:title", content: "Administration — RiskSense" },
      { property: "og:description", content: "Program administration and organisation settings." },
    ],
  }),
  component: AdminPage,
});

const TABS = [
  "Organization & Departments",
  "User & Role Directory",
  "Engine Configuration",
  "Global Risk Settings",
  "Master Data",
  "System Audit Trail",
] as const;
type Tab = (typeof TABS)[number];

type Dept = { name: string; lead: string; risks: number };
type UserRow = { name: string; email: string; role: string; dept: string; status: "Active" | "Invited" };

const initialDepartments: Dept[] = [
  { name: "Planning", lead: "J. Sterling", risks: 8 },
  { name: "Procurement", lead: "P. Iyer", risks: 14 },
  { name: "Infrastructure", lead: "K. Wallace", risks: 11 },
  { name: "MEP", lead: "D. Chen", risks: 9 },
  { name: "Construction", lead: "S. O'Neill", risks: 17 },
  { name: "Legal", lead: "R. Mahmood", risks: 5 },
  { name: "Finance", lead: "L. Park", risks: 6 },
];

const users: UserRow[] = [
  { name: "James Sterling", email: "j.sterling@phoenixcore.com", role: "Program Director", dept: "Planning", status: "Active" },
  { name: "David Chen", email: "d.chen@phoenixcore.com", role: "Workstream Lead", dept: "MEP", status: "Active" },
  { name: "Lena Park", email: "l.park@phoenixcore.com", role: "Risk Owner", dept: "Finance", status: "Active" },
  { name: "Priya Iyer", email: "p.iyer@phoenixcore.com", role: "Workstream Lead", dept: "Procurement", status: "Active" },
  { name: "Marco Russo", email: "m.russo@phoenixcore.com", role: "Risk Owner", dept: "Procurement", status: "Invited" },
  { name: "Aisha Okafor", email: "a.okafor@phoenixcore.com", role: "Risk Owner", dept: "Commissioning", status: "Active" },
];

const masterData = [
  { code: "WS", label: "Workstreams", count: 8 },
  { code: "CAT", label: "Risk Categories", count: 12 },
  { code: "STAT", label: "Status Codes", count: 5 },
  { code: "RESP", label: "Response Strategies", count: 4 },
  { code: "TAG", label: "Tags & Themes", count: 23 },
];

const auditLog = [
  { ts: "24 OCT 09:41", actor: "j.sterling", action: "Approved mitigation #R-788 budget extension" },
  { ts: "24 OCT 08:12", actor: "system", action: "Nightly risk re-score completed (142 records)" },
  { ts: "23 OCT 17:55", actor: "d.chen", action: "Escalated #R-809 to Steering Committee" },
  { ts: "23 OCT 14:02", actor: "l.park", action: "Updated escalation policy: Finance threshold 12 → 10" },
  { ts: "23 OCT 09:30", actor: "p.iyer", action: "Added supplier contingency #R-780" },
];

function AdminPage() {
  const [tab, setTab] = useState<Tab>("Organization & Departments");
  const [orgName, setOrgName] = useState("Phoenix Core Program — Infineon Technologies AG");
  const [sector, setSector] = useState("Semiconductor & High-Tech Manufacturing");
  const [departments, setDepartments] = useState<Dept[]>(initialDepartments);
  const [newDept, setNewDept] = useState("");
  const [threshold, setThreshold] = useState(180);
  const [reviewCadence, setReviewCadence] = useState("Weekly");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="p-6 max-w-[1600px] mx-auto space-y-6">
        <header>
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
            Settings
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight">Administration & Organisation</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
            Configure company profile, manage department silos, users, roles, and global risk engine
            settings.
          </p>
        </header>

        {/* Tabs */}
        <nav className="border-b border-border flex flex-wrap gap-x-6">
          {TABS.map((t) => {
            const active = t === tab;
            return (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`text-[11px] font-bold uppercase tracking-widest py-3 -mb-px border-b-2 transition-colors ${
                  active
                    ? "border-foreground text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {t}
              </button>
            );
          })}
        </nav>

        {tab === "Organization & Departments" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="border border-border bg-card p-5">
              <h2 className="text-[11px] font-extrabold uppercase tracking-widest mb-4">
                Organization Profile
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Organization / Company Name
                  </label>
                  <input
                    value={orgName}
                    onChange={(e) => setOrgName(e.target.value)}
                    className="w-full border border-border bg-background px-3 py-2 text-sm font-medium focus:outline-none focus:border-foreground"
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                    Industry Sector
                  </label>
                  <input
                    value={sector}
                    onChange={(e) => setSector(e.target.value)}
                    className="w-full border border-border bg-background px-3 py-2 text-sm font-medium focus:outline-none focus:border-foreground"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                      Program Code
                    </label>
                    <input
                      defaultValue="PHX-CORE-4.2"
                      className="w-full border border-border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:border-foreground"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                      Reporting Currency
                    </label>
                    <select className="w-full border border-border bg-background px-3 py-2 text-sm font-medium">
                      <option>EUR</option>
                      <option>USD</option>
                      <option>GBP</option>
                    </select>
                  </div>
                </div>
                <button className="w-full bg-foreground text-background text-[11px] font-bold uppercase tracking-widest py-3 hover:opacity-90">
                  Save Profile
                </button>
              </div>
            </section>

            <section className="border border-border bg-card p-5">
              <div className="flex items-baseline justify-between mb-1">
                <h2 className="text-[11px] font-extrabold uppercase tracking-widest">
                  Active Departments / Silos
                </h2>
                <span className="text-[10px] font-mono text-muted-foreground">N={departments.length}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-4">
                Departments map to local risk logs and playbooks.
              </p>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!newDept.trim()) return;
                  setDepartments([...departments, { name: newDept.trim(), lead: "—", risks: 0 }]);
                  setNewDept("");
                }}
                className="flex gap-2 mb-4"
              >
                <input
                  value={newDept}
                  onChange={(e) => setNewDept(e.target.value)}
                  placeholder="Add new department (e.g. Finance)"
                  className="flex-1 border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground"
                />
                <button
                  type="submit"
                  className="px-4 bg-foreground text-background text-[11px] font-bold uppercase tracking-widest hover:opacity-90"
                >
                  Add Dept
                </button>
              </form>

              <table className="w-full text-left border-collapse">
                <thead className="bg-muted/60 border-y border-border">
                  <tr>
                    <th className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Department</th>
                    <th className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Lead</th>
                    <th className="px-3 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tight text-right">Risks</th>
                    <th className="px-3 py-2"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {departments.map((d) => (
                    <tr key={d.name} className="hover:bg-muted/40">
                      <td className="px-3 py-2.5 text-sm font-bold">{d.name}</td>
                      <td className="px-3 py-2.5 text-xs">{d.lead}</td>
                      <td className="px-3 py-2.5 text-xs font-mono text-right">{d.risks}</td>
                      <td className="px-3 py-2.5 text-right">
                        <button
                          onClick={() => setDepartments(departments.filter((x) => x.name !== d.name))}
                          className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-accent"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
          </div>
        )}

        {tab === "User & Role Directory" && (
          <section className="border border-border bg-card">
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h2 className="text-[11px] font-extrabold uppercase tracking-widest">User & Role Directory</h2>
              <button className="px-3 py-1 bg-foreground text-background text-[10px] font-bold uppercase">
                Invite User
              </button>
            </div>
            <table className="w-full text-left">
              <thead className="bg-muted/60 border-b border-border">
                <tr>
                  <th className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Name</th>
                  <th className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Email</th>
                  <th className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Role</th>
                  <th className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Department</th>
                  <th className="px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-tight">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => (
                  <tr key={u.email} className="hover:bg-muted/40">
                    <td className="px-4 py-3 text-sm font-bold">{u.name}</td>
                    <td className="px-4 py-3 text-xs font-mono text-muted-foreground">{u.email}</td>
                    <td className="px-4 py-3 text-xs">{u.role}</td>
                    <td className="px-4 py-3 text-xs">{u.dept}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider ${
                          u.status === "Active" ? "bg-safe/20 text-safe" : "bg-warning/15 text-warning"
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </section>
        )}

        {tab === "Engine Configuration" && <EngineConfigTab />}

        {tab === "Global Risk Settings" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <section className="border border-border bg-card p-5 space-y-5">
              <h2 className="text-[11px] font-extrabold uppercase tracking-widest">RPN Escalation Policy</h2>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    Auto-Escalate Threshold (RPN)
                  </label>
                  <span className="text-xs font-mono font-bold">≥ {threshold}</span>
                </div>
                <input
                  type="range"
                  min={60}
                  max={500}
                  step={10}
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-full accent-accent"
                />
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-1">
                  <span>60 · Medium</span>
                  <span>500 · Critical only</span>
                </div>
                <p className="text-[10px] text-muted-foreground mt-2">
                  RPN = Severity × Occurrence × Detection (each 1–10, max 1000)
                </p>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
                  Review Cadence
                </label>
                <div className="flex gap-2">
                  {["Daily", "Weekly", "Bi-Weekly", "Monthly"].map((c) => (
                    <button
                      key={c}
                      onClick={() => setReviewCadence(c)}
                      className={`px-3 py-2 text-[11px] font-bold uppercase tracking-widest border ${
                        reviewCadence === c
                          ? "bg-foreground text-background border-foreground"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                {[
                  ["Auto-escalate score ≥ 20", true],
                  ["Notify owner on status change", true],
                  ["Require mitigation on Critical", true],
                  ["Anonymise audit log exports", false],
                ].map(([label, def]) => (
                  <label key={label as string} className="flex items-center justify-between text-sm">
                    <span>{label as string}</span>
                    <input
                      type="checkbox"
                      defaultChecked={def as boolean}
                      className="size-4 accent-accent"
                    />
                  </label>
                ))}
              </div>
            </section>

            <section className="border border-border bg-card p-5">
              <h2 className="text-[11px] font-extrabold uppercase tracking-widest mb-4">
                Scoring Matrix Weights
              </h2>
              <div className="space-y-4">
                {[
                  { label: "Likelihood weighting", val: 50 },
                  { label: "Impact weighting", val: 50 },
                  { label: "Velocity multiplier", val: 25 },
                  { label: "Detectability factor", val: 15 },
                ].map((row) => (
                  <div key={row.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-medium">{row.label}</span>
                      <span className="font-mono">{row.val}%</span>
                    </div>
                    <div className="h-1.5 bg-muted">
                      <div className="h-full bg-foreground" style={{ width: `${row.val}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        )}

        {tab === "Master Data" && (
          <section className="border border-border bg-card">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-[11px] font-extrabold uppercase tracking-widest">Master Data Domains</h2>
              <button className="px-3 py-1 border border-border text-[10px] font-bold uppercase hover:bg-muted">
                Import CSV
              </button>
            </div>
            <ul className="divide-y divide-border">
              {masterData.map((d) => (
                <li key={d.code} className="p-4 flex items-center justify-between hover:bg-muted/40">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-[10px] font-bold text-accent w-12">{d.code}</span>
                    <span className="text-sm font-bold">{d.label}</span>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="text-xs font-mono text-muted-foreground">{d.count} entries</span>
                    <button className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground hover:text-foreground">
                      Manage →
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {tab === "System Audit Trail" && (
          <section className="border border-border bg-card">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-[11px] font-extrabold uppercase tracking-widest">System Audit Trail</h2>
              <span className="text-[10px] font-mono text-muted-foreground">Showing last {auditLog.length} events</span>
            </div>
            <ol className="divide-y divide-border">
              {auditLog.map((e, i) => (
                <li key={i} className="p-4 grid grid-cols-12 gap-4 hover:bg-muted/40">
                  <span className="col-span-3 md:col-span-2 font-mono text-[11px] text-muted-foreground">
                    {e.ts}
                  </span>
                  <span className="col-span-3 md:col-span-2 font-mono text-[11px] font-bold text-accent">
                    {e.actor}
                  </span>
                  <span className="col-span-12 md:col-span-8 text-sm">{e.action}</span>
                </li>
              ))}
            </ol>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

