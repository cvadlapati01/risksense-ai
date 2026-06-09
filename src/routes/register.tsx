import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { RiskTable } from "@/components/risk-table";
import { HeatmapMatrix } from "@/components/heatmap-matrix";
import { ManualRiskDialog } from "@/components/manual-risk-dialog";
import { RiskDetailDialog } from "@/components/risk-detail-dialog";
import {
  risks as seedRisks,
  getAiRisks,
  subscribeAiRisks,
  type Risk,
  type RiskCategory,
  type MatrixAction,
} from "@/lib/risk-data";

const ACTION_VALUES: MatrixAction[] = ["Critical Priority", "Manage", "Monitor"];

type RegisterSearch = { action?: MatrixAction };

export const Route = createFileRoute("/register")({
  validateSearch: (s: Record<string, unknown>): RegisterSearch => {
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
      { title: "Risk Register — RiskSense" },
      {
        name: "description",
        content:
          "Full risk register aggregated across 9 sources. Filter, sort by RPN, drill into AI mitigations and source traceability.",
      },
      { property: "og:title", content: "Risk Register — RiskSense" },
      { property: "og:description", content: "Aggregated risks with full source traceability." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const { action } = Route.useSearch();
  const navigate = useNavigate({ from: "/register" });
  const [list, setList] = useState<Risk[]>([...getAiRisks(), ...seedRisks]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedRisk, setSelectedRisk] = useState<Risk | null>(null);

  useEffect(() => {
    const unsub = subscribeAiRisks(() => {
      setList((prev) => {
        const ai = getAiRisks();
        const manual = prev.filter((r) => !r.id.startsWith("AI-"));
        return [...ai, ...manual];
      });
    });
    return unsub;
  }, []);

  const addManual = (m: {
    title: string;
    description: string;
    category: RiskCategory;
    severity: number;
    occurrence: number;
    detection: number;
  }) => {
    const nextId = `M-${(900 + list.filter((r) => r.source === "Manual").length + 1)
      .toString()
      .padStart(3, "0")}`;
    const newRisk: Risk = {
      id: nextId,
      title: m.title,
      subtitle: m.description || "Manually entered risk",
      workstream: "Planning",
      category: m.category,
      source: "Manual",
      sourceRef: "PM entry",
      severity: m.severity,
      occurrence: m.occurrence,
      detection: m.detection,
      likelihood: Math.max(1, Math.min(5, Math.ceil(m.occurrence / 2))),
      impact: Math.max(1, Math.min(5, Math.ceil(m.severity / 2))),
      status: "Under Review",
      owner: "PM Entry",
      dueDate: "TBD",
      mitigation: "Pending mitigation plan.",
      aiRecommendations: [],
      actionsCompleted: 0,
      actionsTotal: 3,
      residual: "Moderate",
      history: [{ date: "TODAY", note: "Manually added via Risk Register" }],
    };
    const next = [newRisk, ...list];
    setList(next);
    setDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="p-6 max-w-[1600px] mx-auto space-y-6">
        <header>
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
            Master Ledger
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight">Risk Register</h1>
        </header>

        <div className="space-y-6">
          <HeatmapMatrix />
          <RiskTable
            initial={list}
            onAddManual={() => setDialogOpen(true)}
            actionFilter={action}
            onClearActionFilter={() =>
              navigate({ search: { action: undefined }, replace: true })
            }
            onSelect={(r) => setSelectedRisk(r)}
            selectedId={selectedRisk?.id}
          />
        </div>
      </main>
      <SiteFooter />
      <ManualRiskDialog open={dialogOpen} onClose={() => setDialogOpen(false)} onSubmit={addManual} />
      <RiskDetailDialog risk={selectedRisk} onClose={() => setSelectedRisk(null)} />
    </div>
  );
}
