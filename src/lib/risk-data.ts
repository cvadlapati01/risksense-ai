export type RiskStatus = "Escalated" | "Active" | "Under Review" | "Mitigated" | "Watching";
export type Workstream =
  | "Planning"
  | "Procurement"
  | "Infrastructure"
  | "MEP"
  | "Construction"
  | "Legal"
  | "Commissioning"
  | "Finance";

export type Risk = {
  id: string;
  title: string;
  subtitle: string;
  workstream: Workstream;
  likelihood: 1 | 2 | 3 | 4 | 5;
  impact: 1 | 2 | 3 | 4 | 5;
  status: RiskStatus;
  owner: string;
  dueDate: string;
  mitigation: string;
  actionsCompleted: number;
  actionsTotal: number;
  residual: "Low" | "Moderate" | "High" | "Critical";
  history: { date: string; note: string }[];
};

export const risks: Risk[] = [
  {
    id: "R-812",
    title: "Regulatory approval window compression",
    subtitle: "Environmental Impact Assessment delayed by 6 weeks",
    workstream: "Planning",
    likelihood: 4,
    impact: 5,
    status: "Escalated",
    owner: "J. Sterling",
    dueDate: "15 NOV 2024",
    mitigation:
      "Expedite Tier-2 consultant review. Deploy local PMO office for daily council liaison. Engage legal counsel for fast-track appeal provision.",
    actionsCompleted: 4,
    actionsTotal: 9,
    residual: "Moderate",
    history: [
      { date: "08 OCT", note: "Risk raised by Planning Lead following council notice" },
      { date: "14 OCT", note: "Escalated to Steering Committee, Tier-2 review approved" },
      { date: "21 OCT", note: "Local PMO office stood up, daily standups initiated" },
    ],
  },
  {
    id: "R-809",
    title: "Grid connectivity lead times",
    subtitle: "Utility provider capacity shortfall in region 4",
    workstream: "MEP",
    likelihood: 3,
    impact: 4,
    status: "Active",
    owner: "D. Chen",
    dueDate: "30 NOV 2024",
    mitigation:
      "Negotiate priority slot with secondary utility. Pre-purchase long-lead switchgear. Re-sequence commissioning plan to defer Block C tie-in.",
    actionsCompleted: 6,
    actionsTotal: 8,
    residual: "Moderate",
    history: [
      { date: "12 OCT", note: "Utility confirmed 14-week extension to tie-in date" },
      { date: "19 OCT", note: "Switchgear PO issued under contingency budget" },
    ],
  },
  {
    id: "R-795",
    title: "Labor force availability Q4",
    subtitle: "Local market saturation affecting masonry trades",
    workstream: "Construction",
    likelihood: 2,
    impact: 4,
    status: "Under Review",
    owner: "S. O'Neill",
    dueDate: "05 DEC 2024",
    mitigation: "Engage two additional sub-contractors from neighbouring region with relocation package.",
    actionsCompleted: 1,
    actionsTotal: 5,
    residual: "Low",
    history: [{ date: "05 OCT", note: "Identified during quarterly workforce planning review" }],
  },
  {
    id: "R-792",
    title: "Logistics hub congestion",
    subtitle: "Port strikes affecting prefab modules",
    workstream: "Procurement",
    likelihood: 4,
    impact: 3,
    status: "Active",
    owner: "M. Russo",
    dueDate: "10 NOV 2024",
    mitigation: "Re-route shipments via secondary port. Increase buffer stock at staging yard.",
    actionsCompleted: 3,
    actionsTotal: 6,
    residual: "Moderate",
    history: [{ date: "01 OCT", note: "Port authority issued labor action notice" }],
  },
  {
    id: "R-788",
    title: "Subsurface geotechnical delay on North Wing",
    subtitle: "Unforeseen rock strata requires controlled blasting permits",
    workstream: "Infrastructure",
    likelihood: 5,
    impact: 5,
    status: "Escalated",
    owner: "K. Wallace",
    dueDate: "22 OCT 2024",
    mitigation:
      "Engage specialist contractor for controlled blast. Sequence Foundation Pour Phase B ahead of Phase A. Re-baseline schedule with 18-day float consumption.",
    actionsCompleted: 7,
    actionsTotal: 11,
    residual: "Critical",
    history: [
      { date: "22 SEP", note: "Test bore returned unexpected granite intrusion" },
      { date: "01 OCT", note: "Specialist contractor mobilised, blasting permit submitted" },
      { date: "18 OCT", note: "Critical path re-baseline approved by Program Director" },
    ],
  },
  {
    id: "R-780",
    title: "Supply chain insolvencies (Steel Fabricators)",
    subtitle: "Two of four Tier-1 fabricators issued profit warnings",
    workstream: "Procurement",
    likelihood: 3,
    impact: 5,
    status: "Active",
    owner: "P. Iyer",
    dueDate: "28 NOV 2024",
    mitigation: "Diversify supplier base, dual-source critical assemblies, secure parent-company guarantees.",
    actionsCompleted: 2,
    actionsTotal: 7,
    residual: "High",
    history: [{ date: "10 OCT", note: "Treasury flagged credit exposure during quarterly review" }],
  },
  {
    id: "R-774",
    title: "Cyber posture during commissioning",
    subtitle: "OT/IT segregation incomplete on building management system",
    workstream: "Commissioning",
    likelihood: 2,
    impact: 5,
    status: "Active",
    owner: "A. Okafor",
    dueDate: "12 JAN 2025",
    mitigation: "Deploy network segmentation, complete penetration testing prior to handover.",
    actionsCompleted: 4,
    actionsTotal: 9,
    residual: "Moderate",
    history: [{ date: "20 SEP", note: "Identified during pre-commissioning audit" }],
  },
  {
    id: "R-761",
    title: "Currency exposure on imported finishes",
    subtitle: "FX volatility on EUR-denominated facade package",
    workstream: "Finance",
    likelihood: 3,
    impact: 3,
    status: "Under Review",
    owner: "L. Park",
    dueDate: "30 OCT 2024",
    mitigation: "Hedge 70% of remaining EUR exposure through forward contracts.",
    actionsCompleted: 1,
    actionsTotal: 3,
    residual: "Low",
    history: [{ date: "02 OCT", note: "Treasury proposed hedging strategy" }],
  },
  {
    id: "R-750",
    title: "Stakeholder objection — adjacent landowner",
    subtitle: "Noise complaint risk during night-shift construction",
    workstream: "Legal",
    likelihood: 4,
    impact: 2,
    status: "Watching",
    owner: "R. Mahmood",
    dueDate: "ongoing",
    mitigation: "Community liaison plan, restricted-hours operations near boundary.",
    actionsCompleted: 5,
    actionsTotal: 5,
    residual: "Low",
    history: [{ date: "15 SEP", note: "Community engagement plan ratified" }],
  },
  {
    id: "R-742",
    title: "Crane availability during peak lift sequence",
    subtitle: "Single point of failure on 600t crawler",
    workstream: "Construction",
    likelihood: 2,
    impact: 5,
    status: "Active",
    owner: "T. Brennan",
    dueDate: "05 DEC 2024",
    mitigation: "Reserve back-up crane, schedule preventive maintenance window in Week 47.",
    actionsCompleted: 3,
    actionsTotal: 5,
    residual: "Moderate",
    history: [{ date: "28 SEP", note: "Maintenance log review identified attrition risk" }],
  },
  {
    id: "R-731",
    title: "Design coordination clashes — MEP vs structural",
    subtitle: "Level 7 plant room clash detection flagged 42 issues",
    workstream: "MEP",
    likelihood: 5,
    impact: 2,
    status: "Mitigated",
    owner: "D. Chen",
    dueDate: "15 OCT 2024",
    mitigation: "BIM clash resolution sprint, weekly federated model reviews.",
    actionsCompleted: 6,
    actionsTotal: 6,
    residual: "Low",
    history: [
      { date: "01 SEP", note: "Issues identified during federation" },
      { date: "12 OCT", note: "All Level 7 clashes resolved, sign-off received" },
    ],
  },
  {
    id: "R-720",
    title: "Insurance renewal premium increase",
    subtitle: "Market hardening could add 18% to OPEX",
    workstream: "Finance",
    likelihood: 4,
    impact: 3,
    status: "Active",
    owner: "L. Park",
    dueDate: "30 NOV 2024",
    mitigation: "Tender renewal early, evaluate captive insurance vehicle.",
    actionsCompleted: 2,
    actionsTotal: 5,
    residual: "Moderate",
    history: [{ date: "20 SEP", note: "Broker indicated hardening market conditions" }],
  },
];

export const kpis = {
  totalActive: risks.filter((r) => r.status !== "Mitigated").length + 130,
  critical: risks.filter((r) => r.likelihood * r.impact >= 20).length + 7,
  overdueMitigations: 24,
  velocity: 1.2,
};

export const trendSeries = [
  { week: "W36", score: 412 },
  { week: "W37", score: 428 },
  { week: "W38", score: 441 },
  { week: "W39", score: 435 },
  { week: "W40", score: 462 },
  { week: "W41", score: 481 },
  { week: "W42", score: 472 },
  { week: "W43", score: 489 },
];

export function severity(score: number): "low" | "moderate" | "high" | "critical" {
  if (score >= 20) return "critical";
  if (score >= 12) return "high";
  if (score >= 6) return "moderate";
  return "low";
}

export function severityColor(sev: ReturnType<typeof severity>): {
  bg: string;
  text: string;
  cell: string;
} {
  switch (sev) {
    case "critical":
      return { bg: "bg-accent/10", text: "text-accent", cell: "bg-accent" };
    case "high":
      return { bg: "bg-warning/15", text: "text-warning", cell: "bg-warning" };
    case "moderate":
      return { bg: "bg-warning/10", text: "text-warning", cell: "bg-warning/50" };
    case "low":
      return { bg: "bg-muted", text: "text-muted-foreground", cell: "bg-safe/40" };
  }
}
