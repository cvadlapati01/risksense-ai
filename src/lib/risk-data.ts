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

export type RiskCategory =
  | "Technical"
  | "Supply Chain"
  | "Schedule"
  | "Regulatory"
  | "Operational"
  | "External";

export type DataSource =
  | "KLUSA"
  | "FMEA-DB"
  | "PLATO e1ns"
  | "Windchill"
  | "Lessons Learned"
  | "FAR-DB"
  | "MKB-DB"
  | "Excel/SharePoint"
  | "Public Sources"
  | "Manual";

export const ALL_SOURCES: DataSource[] = [
  "KLUSA",
  "FMEA-DB",
  "PLATO e1ns",
  "Windchill",
  "Lessons Learned",
  "FAR-DB",
  "MKB-DB",
  "Excel/SharePoint",
  "Public Sources",
  "Manual",
];

export const ALL_CATEGORIES: RiskCategory[] = [
  "Technical",
  "Supply Chain",
  "Schedule",
  "Regulatory",
  "Operational",
  "External",
];

export type Risk = {
  id: string;
  title: string;
  subtitle: string;
  workstream: Workstream;
  category: RiskCategory;
  source: DataSource;
  sourceRef: string;
  // RPN scoring: Severity × Occurrence × Detection (1-10 each)
  severity: number;
  occurrence: number;
  detection: number;
  /** Backwards-compat aliases used by heatmap UI (1-5) */
  likelihood: number;
  impact: number;
  status: RiskStatus;
  owner: string;
  dueDate: string;
  mitigation: string;
  aiRecommendations: string[];
  actionsCompleted: number;
  actionsTotal: number;
  residual: "Low" | "Moderate" | "High" | "Critical";
  history: { date: string; note: string }[];
};

/** Convert 1-10 score to 1-5 bucket for the heatmap UI */
const toFive = (n: number) => Math.max(1, Math.min(5, Math.ceil(n / 2))) as 1 | 2 | 3 | 4 | 5;

function makeRisk(r: Omit<Risk, "likelihood" | "impact" | "aiRecommendations"> & { aiRecommendations?: string[] }): Risk {
  return {
    ...r,
    likelihood: toFive(r.occurrence),
    impact: toFive(r.severity),
    aiRecommendations: r.aiRecommendations ?? [],
  };
}

export const risks: Risk[] = [
  makeRisk({
    id: "R-812",
    title: "Regulatory approval window compression",
    subtitle: "Environmental Impact Assessment delayed by 6 weeks",
    workstream: "Planning",
    category: "Regulatory",
    source: "Lessons Learned",
    sourceRef: "LL-2023-118",
    severity: 9,
    occurrence: 7,
    detection: 4,
    status: "Escalated",
    owner: "J. Sterling",
    dueDate: "15 NOV 2024",
    mitigation:
      "Expedite Tier-2 consultant review. Deploy local PMO office for daily council liaison. Engage legal counsel for fast-track appeal provision.",
    aiRecommendations: [
      "Engage Tier-2 environmental consultant — historical precedent in LL-2021-044 cut approval time 38%",
      "Pre-file appeal documentation in parallel to first review (FAR-DB pattern match)",
      "Schedule council liaison standup at T-14 days before each milestone",
    ],
    actionsCompleted: 4,
    actionsTotal: 9,
    residual: "Moderate",
    history: [
      { date: "08 OCT", note: "Risk raised by Planning Lead following council notice" },
      { date: "14 OCT", note: "Escalated to Steering Committee, Tier-2 review approved" },
      { date: "21 OCT", note: "Local PMO office stood up, daily standups initiated" },
    ],
  }),
  makeRisk({
    id: "R-809",
    title: "Grid connectivity lead times",
    subtitle: "Utility provider capacity shortfall in region 4",
    workstream: "MEP",
    category: "Schedule",
    source: "KLUSA",
    sourceRef: "WBS-4.3.2",
    severity: 8,
    occurrence: 6,
    detection: 5,
    status: "Active",
    owner: "D. Chen",
    dueDate: "30 NOV 2024",
    mitigation:
      "Negotiate priority slot with secondary utility. Pre-purchase long-lead switchgear. Re-sequence commissioning plan to defer Block C tie-in.",
    aiRecommendations: [
      "Dual-source switchgear via Schneider EU (Lessons Learned LL-2022-091)",
      "Reorder commissioning sequence — model in PLATO before lock-in",
    ],
    actionsCompleted: 6,
    actionsTotal: 8,
    residual: "Moderate",
    history: [
      { date: "12 OCT", note: "Utility confirmed 14-week extension to tie-in date" },
      { date: "19 OCT", note: "Switchgear PO issued under contingency budget" },
    ],
  }),
  makeRisk({
    id: "R-795",
    title: "Labor force availability Q4",
    subtitle: "Local market saturation affecting masonry trades",
    workstream: "Construction",
    category: "Operational",
    source: "MKB-DB",
    sourceRef: "MKB-CONST-09",
    severity: 7,
    occurrence: 4,
    detection: 4,
    status: "Under Review",
    owner: "S. O'Neill",
    dueDate: "05 DEC 2024",
    mitigation: "Engage two additional sub-contractors from neighbouring region with relocation package.",
    aiRecommendations: ["Open framework agreement with regional sub-contractors (FAR-DB pattern)"],
    actionsCompleted: 1,
    actionsTotal: 5,
    residual: "Low",
    history: [{ date: "05 OCT", note: "Identified during quarterly workforce planning review" }],
  }),
  makeRisk({
    id: "R-792",
    title: "Logistics hub congestion",
    subtitle: "Port strikes affecting prefab modules",
    workstream: "Procurement",
    category: "Supply Chain",
    source: "Public Sources",
    sourceRef: "Reuters · 01 OCT",
    severity: 7,
    occurrence: 7,
    detection: 3,
    status: "Active",
    owner: "M. Russo",
    dueDate: "10 NOV 2024",
    mitigation: "Re-route shipments via secondary port. Increase buffer stock at staging yard.",
    aiRecommendations: [
      "Activate secondary port contract (Lessons Learned LL-2024-007)",
      "Hold 14-day buffer at staging yard until labor action resolves",
    ],
    actionsCompleted: 3,
    actionsTotal: 6,
    residual: "Moderate",
    history: [{ date: "01 OCT", note: "Port authority issued labor action notice" }],
  }),
  makeRisk({
    id: "R-788",
    title: "Subsurface geotechnical delay on North Wing",
    subtitle: "Unforeseen rock strata requires controlled blasting permits",
    workstream: "Infrastructure",
    category: "Technical",
    source: "FAR-DB",
    sourceRef: "FAR-2020-208",
    severity: 10,
    occurrence: 8,
    detection: 6,
    status: "Escalated",
    owner: "K. Wallace",
    dueDate: "22 OCT 2024",
    mitigation:
      "Engage specialist contractor for controlled blast. Sequence Foundation Pour Phase B ahead of Phase A. Re-baseline schedule with 18-day float consumption.",
    aiRecommendations: [
      "Specialist blast contractor — direct match FAR-2020-208 resolution",
      "Resequence Phase B → A using PLATO scheduling model",
      "Reserve 18-day float in master schedule (Lessons Learned LL-2019-033)",
    ],
    actionsCompleted: 7,
    actionsTotal: 11,
    residual: "Critical",
    history: [
      { date: "22 SEP", note: "Test bore returned unexpected granite intrusion" },
      { date: "01 OCT", note: "Specialist contractor mobilised, blasting permit submitted" },
      { date: "18 OCT", note: "Critical path re-baseline approved by Program Director" },
    ],
  }),
  makeRisk({
    id: "R-780",
    title: "Supply chain insolvencies (Steel Fabricators)",
    subtitle: "Two of four Tier-1 fabricators issued profit warnings",
    workstream: "Procurement",
    category: "Supply Chain",
    source: "Public Sources",
    sourceRef: "Bloomberg · 10 OCT",
    severity: 9,
    occurrence: 5,
    detection: 5,
    status: "Active",
    owner: "P. Iyer",
    dueDate: "28 NOV 2024",
    mitigation: "Diversify supplier base, dual-source critical assemblies, secure parent-company guarantees.",
    aiRecommendations: [
      "Dual-source critical assemblies (Lessons Learned LL-2023-061)",
      "Require parent-company guarantee for remaining Tier-1 contracts",
    ],
    actionsCompleted: 2,
    actionsTotal: 7,
    residual: "High",
    history: [{ date: "10 OCT", note: "Treasury flagged credit exposure during quarterly review" }],
  }),
  makeRisk({
    id: "R-774",
    title: "Cyber posture during commissioning",
    subtitle: "OT/IT segregation incomplete on building management system",
    workstream: "Commissioning",
    category: "Technical",
    source: "PLATO e1ns",
    sourceRef: "FMEA-COMM-22",
    severity: 9,
    occurrence: 3,
    detection: 7,
    status: "Active",
    owner: "A. Okafor",
    dueDate: "12 JAN 2025",
    mitigation: "Deploy network segmentation, complete penetration testing prior to handover.",
    aiRecommendations: ["Segment OT/IT network ahead of pen test (FMEA pattern PLATO-22)"],
    actionsCompleted: 4,
    actionsTotal: 9,
    residual: "Moderate",
    history: [{ date: "20 SEP", note: "Identified during pre-commissioning audit" }],
  }),
  makeRisk({
    id: "R-761",
    title: "Currency exposure on imported finishes",
    subtitle: "FX volatility on EUR-denominated facade package",
    workstream: "Finance",
    category: "External",
    source: "Excel/SharePoint",
    sourceRef: "Treasury_Risk_Log.xlsx",
    severity: 5,
    occurrence: 6,
    detection: 4,
    status: "Under Review",
    owner: "L. Park",
    dueDate: "30 OCT 2024",
    mitigation: "Hedge 70% of remaining EUR exposure through forward contracts.",
    aiRecommendations: ["Forward-hedge 70% (Lessons Learned LL-2022-018)"],
    actionsCompleted: 1,
    actionsTotal: 3,
    residual: "Low",
    history: [{ date: "02 OCT", note: "Treasury proposed hedging strategy" }],
  }),
  makeRisk({
    id: "R-750",
    title: "Stakeholder objection — adjacent landowner",
    subtitle: "Noise complaint risk during night-shift construction",
    workstream: "Legal",
    category: "External",
    source: "Lessons Learned",
    sourceRef: "LL-2022-077",
    severity: 4,
    occurrence: 7,
    detection: 3,
    status: "Watching",
    owner: "R. Mahmood",
    dueDate: "ongoing",
    mitigation: "Community liaison plan, restricted-hours operations near boundary.",
    aiRecommendations: ["Community liaison plan — proven in LL-2022-077"],
    actionsCompleted: 5,
    actionsTotal: 5,
    residual: "Low",
    history: [{ date: "15 SEP", note: "Community engagement plan ratified" }],
  }),
  makeRisk({
    id: "R-742",
    title: "Crane availability during peak lift sequence",
    subtitle: "Single point of failure on 600t crawler",
    workstream: "Construction",
    category: "Operational",
    source: "Windchill",
    sourceRef: "ECO-7714",
    severity: 9,
    occurrence: 3,
    detection: 5,
    status: "Active",
    owner: "T. Brennan",
    dueDate: "05 DEC 2024",
    mitigation: "Reserve back-up crane, schedule preventive maintenance window in Week 47.",
    aiRecommendations: ["Reserve back-up 600t crane (FAR-DB pattern FAR-2021-119)"],
    actionsCompleted: 3,
    actionsTotal: 5,
    residual: "Moderate",
    history: [{ date: "28 SEP", note: "Maintenance log review identified attrition risk" }],
  }),
  makeRisk({
    id: "R-731",
    title: "Design coordination clashes — MEP vs structural",
    subtitle: "Level 7 plant room clash detection flagged 42 issues",
    workstream: "MEP",
    category: "Technical",
    source: "Windchill",
    sourceRef: "ECO-7702",
    severity: 4,
    occurrence: 9,
    detection: 3,
    status: "Mitigated",
    owner: "D. Chen",
    dueDate: "15 OCT 2024",
    mitigation: "BIM clash resolution sprint, weekly federated model reviews.",
    aiRecommendations: ["Weekly federation cadence (Lessons Learned LL-2020-022)"],
    actionsCompleted: 6,
    actionsTotal: 6,
    residual: "Low",
    history: [
      { date: "01 SEP", note: "Issues identified during federation" },
      { date: "12 OCT", note: "All Level 7 clashes resolved, sign-off received" },
    ],
  }),
  makeRisk({
    id: "R-720",
    title: "Insurance renewal premium increase",
    subtitle: "Market hardening could add 18% to OPEX",
    workstream: "Finance",
    category: "External",
    source: "FMEA-DB",
    sourceRef: "FMEA-FIN-04",
    severity: 6,
    occurrence: 7,
    detection: 4,
    status: "Active",
    owner: "L. Park",
    dueDate: "30 NOV 2024",
    mitigation: "Tender renewal early, evaluate captive insurance vehicle.",
    aiRecommendations: ["Early tender (FMEA-FIN-04 pattern)"],
    actionsCompleted: 2,
    actionsTotal: 5,
    residual: "Moderate",
    history: [{ date: "20 SEP", note: "Broker indicated hardening market conditions" }],
  }),
];

export const kpis = {
  totalActive: risks.filter((r) => r.status !== "Mitigated").length + 130,
  critical: risks.filter((r) => rpn(r) >= 200).length + 5,
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

export function rpn(r: Risk): number {
  return r.severity * r.occurrence * r.detection;
}

export function priorityFromRpn(score: number): "Critical" | "High" | "Medium" | "Low" {
  if (score >= 200) return "Critical";
  if (score >= 120) return "High";
  if (score >= 60) return "Medium";
  return "Low";
}

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

export const similarProjects = [
  {
    id: "PHX-NORTH-22",
    name: "Phoenix North Substation Build",
    year: 2022,
    similarity: 0.91,
    resolutionRate: 0.86,
    sharedRisks: 14,
    outcome: "Delivered +12 days vs plan",
  },
  {
    id: "ATLAS-3",
    name: "Atlas Phase 3 — Hyperscale Datacenter",
    year: 2023,
    similarity: 0.84,
    resolutionRate: 0.78,
    sharedRisks: 11,
    outcome: "Delivered on time, 4% over budget",
  },
  {
    id: "MERIDIAN-EU",
    name: "Meridian EU Wafer Fab Expansion",
    year: 2021,
    similarity: 0.77,
    resolutionRate: 0.92,
    sharedRisks: 9,
    outcome: "Delivered −8 days vs plan",
  },
];

export const dataSourcesMeta: Record<DataSource, { type: "Internal" | "External" | "Manual"; description: string }> = {
  KLUSA: { type: "Internal", description: "Project metadata, WBS codes, milestones, budgets, owners" },
  "FMEA-DB": { type: "Internal", description: "Historical failure modes, effects, causes, RPN scores" },
  "PLATO e1ns": { type: "Internal", description: "Active-project FMEA: functions, failures, controls, RPN" },
  Windchill: { type: "Internal", description: "PLM: design docs, ECOs, component specs, version history" },
  "Lessons Learned": { type: "Internal", description: "Post-project retrospectives and mitigation outcomes" },
  "FAR-DB": { type: "Internal", description: "Failure Analysis Reports — root causes, field returns" },
  "MKB-DB": { type: "Internal", description: "Standard process descriptions, known issues, reference data" },
  "Excel/SharePoint": { type: "Internal", description: "Risk logs and trackers in spreadsheets across teams" },
  "Public Sources": { type: "External", description: "News, supplier financial signals, regulatory filings" },
  Manual: { type: "Manual", description: "PM-entered risks: tribal knowledge, verbal warnings, gut instincts" },
};
