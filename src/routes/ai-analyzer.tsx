import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { analyzeProjectRisks, type AiRisk } from "@/lib/ai-analyzer.functions";
import { addAiRisks, type RiskCategory } from "@/lib/risk-data";

export const Route = createFileRoute("/ai-analyzer")({
  head: () => ({
    meta: [
      { title: "AI Risk Analyzer — RiskSense AI" },
      {
        name: "description",
        content:
          "Describe your project and let AI surface categorized risks with RPN scoring and mitigation strategies.",
      },
      { property: "og:title", content: "AI Risk Analyzer — RiskSense AI" },
      {
        property: "og:description",
        content: "PM-driven AI risk identification with RPN scoring and mitigations.",
      },
    ],
  }),
  component: AiAnalyzerPage,
});

const CATEGORIES: RiskCategory[] = [
  "Technical",
  "Supply Chain",
  "Schedule",
  "Regulatory",
  "Operational",
  "External",
];

const catColor: Record<RiskCategory, string> = {
  Technical: "bg-blue-500/15 text-blue-300 border-blue-500/40",
  "Supply Chain": "bg-amber-500/15 text-amber-300 border-amber-500/40",
  Schedule: "bg-purple-500/15 text-purple-300 border-purple-500/40",
  Regulatory: "bg-rose-500/15 text-rose-300 border-rose-500/40",
  Operational: "bg-teal-500/15 text-teal-300 border-teal-500/40",
  External: "bg-orange-500/15 text-orange-300 border-orange-500/40",
};

function priority(rpn: number): "Critical" | "High" | "Medium" | "Low" {
  if (rpn >= 200) return "Critical";
  if (rpn >= 100) return "High";
  if (rpn >= 50) return "Medium";
  return "Low";
}

const priStyle: Record<"Critical" | "High" | "Medium" | "Low", string> = {
  Critical: "bg-accent/15 text-accent",
  High: "bg-warning/20 text-warning",
  Medium: "bg-warning/10 text-warning",
  Low: "bg-muted text-muted-foreground",
};

function AiAnalyzerPage() {
  const navigate = useNavigate();
  const analyze = useServerFn(analyzeProjectRisks);

  const [form, setForm] = useState({
    projectName: "",
    description: "",
    domain: "",
    budget: "",
    durationMonths: "",
    teamSize: "",
    techStack: "",
    constraints: "",
  });
  const [documentText, setDocumentText] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<AiRisk[]>([]);
  const [addedIdx, setAddedIdx] = useState<Set<number>>(new Set());

  const update = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFileName(f.name);
    if (f.size > 1_500_000) {
      toast.error("File too large (max ~1.5MB). For PDFs, paste key excerpts into the text area below.");
      return;
    }
    try {
      const text = await f.text();
      setDocumentText(text.slice(0, 20000));
      toast.success(`Loaded ${f.name}`);
    } catch {
      toast.error("Could not read file. Paste content into the text area instead.");
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.description.trim().length < 10) {
      toast.error("Add a project description (at least 10 characters).");
      return;
    }
    setLoading(true);
    setResults([]);
    setAddedIdx(new Set());
    try {
      const res = await analyze({ data: { ...form, documentText } });
      setResults(res.risks);
      toast.success(`Identified ${res.risks.length} risks`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "AI analysis failed");
    } finally {
      setLoading(false);
    }
  };

  const addOne = (i: number) => {
    const r = results[i];
    addAiRisks([r]);
    setAddedIdx((s) => new Set(s).add(i));
    toast.success(`Added "${r.title}" to register`);
  };

  const addAll = () => {
    const fresh = results.filter((_, i) => !addedIdx.has(i));
    if (!fresh.length) return;
    addAiRisks(fresh);
    setAddedIdx(new Set(results.map((_, i) => i)));
    toast.success(`Added ${fresh.length} risks to register`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteHeader />
      <main className="p-6 max-w-[1600px] mx-auto space-y-6">
        <header>
          <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground mb-1">
            AI-Powered Risk Discovery
          </p>
          <h1 className="text-2xl font-extrabold tracking-tight">AI Risk Analyzer</h1>
          <p className="text-sm text-muted-foreground mt-1 max-w-3xl">
            Describe your project. RiskSense AI identifies potential risks, categorizes them,
            scores Severity · Occurrence · Detection (RPN), and proposes mitigation strategies.
          </p>
        </header>

        <form onSubmit={onSubmit} className="border border-border bg-card p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            <Field label="Project Name" className="md:col-span-6">
              <input value={form.projectName} onChange={update("projectName")} className={inputCls} placeholder="Phoenix Core Expansion" />
            </Field>
            <Field label="Domain / Industry" className="md:col-span-6">
              <input value={form.domain} onChange={update("domain")} className={inputCls} placeholder="Semiconductor, Construction, SaaS…" />
            </Field>
            <Field label="Budget" className="md:col-span-3">
              <input value={form.budget} onChange={update("budget")} className={inputCls} placeholder="$2.4M" />
            </Field>
            <Field label="Duration (months)" className="md:col-span-3">
              <input value={form.durationMonths} onChange={update("durationMonths")} className={inputCls} placeholder="18" />
            </Field>
            <Field label="Team Size" className="md:col-span-3">
              <input value={form.teamSize} onChange={update("teamSize")} className={inputCls} placeholder="24" />
            </Field>
            <Field label="Tech Stack / Key Vendors" className="md:col-span-3">
              <input value={form.techStack} onChange={update("techStack")} className={inputCls} placeholder="AWS, Siemens PLC…" />
            </Field>
            <Field label="Project Description *" className="md:col-span-12">
              <textarea
                value={form.description}
                onChange={update("description")}
                rows={5}
                className={inputCls}
                placeholder="Scope, goals, stakeholders, timeline, dependencies…"
              />
            </Field>
            <Field label="Known Constraints" className="md:col-span-12">
              <textarea
                value={form.constraints}
                onChange={update("constraints")}
                rows={2}
                className={inputCls}
                placeholder="Regulatory deadlines, fixed-price contract, legacy system migration…"
              />
            </Field>
            <Field label="Upload Charter / SOW (text-based; .txt, .md)" className="md:col-span-6">
              <input
                type="file"
                accept=".txt,.md,.markdown,text/*"
                onChange={handleFile}
                className="w-full text-xs file:mr-3 file:px-3 file:py-2 file:border-0 file:bg-muted file:text-foreground file:font-bold file:uppercase file:text-[10px] file:tracking-widest"
              />
              {fileName && (
                <p className="text-[10px] font-mono text-muted-foreground mt-1">
                  Loaded: {fileName} · {documentText.length} chars
                </p>
              )}
            </Field>
            <Field label="…or paste document excerpts" className="md:col-span-6">
              <textarea
                value={documentText}
                onChange={(e) => setDocumentText(e.target.value.slice(0, 20000))}
                rows={3}
                className={inputCls}
                placeholder="Paste relevant sections of charter, SOW, or PDF text…"
              />
            </Field>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-border">
            <p className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
              Powered by Lovable AI · Gemini 3 Flash
            </p>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-accent text-accent-foreground text-[11px] font-bold uppercase tracking-widest hover:opacity-90 disabled:opacity-50"
            >
              {loading ? "Analyzing…" : "Analyze Risks"}
            </button>
          </div>
        </form>

        {loading && (
          <div className="border border-border bg-card p-8 text-center text-sm text-muted-foreground font-mono">
            <div className="inline-block size-2 bg-accent rounded-full animate-pulse mr-2" />
            AI is reading your project and cross-referencing risk patterns…
          </div>
        )}

        {results.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div>
                <h2 className="text-lg font-extrabold tracking-tight">
                  Identified Risks <span className="text-muted-foreground font-mono text-sm">({results.length})</span>
                </h2>
                <p className="text-xs text-muted-foreground">Sorted by RPN (Severity × Occurrence × Detection)</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={addAll}
                  className="px-4 py-2 bg-foreground text-background text-[11px] font-bold uppercase tracking-widest hover:opacity-90"
                >
                  + Add All to Register
                </button>
                <button
                  onClick={() => navigate({ to: "/register" })}
                  className="px-4 py-2 border border-border text-[11px] font-bold uppercase tracking-widest hover:bg-muted"
                >
                  Open Register →
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {CATEGORIES.map((cat) => {
                const inCat = results
                  .map((r, i) => ({ r, i }))
                  .filter(({ r }) => r.category === cat);
                if (!inCat.length) return null;
                return (
                  <div key={cat}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border ${catColor[cat]}`}>
                        {cat}
                      </span>
                      <span className="text-[10px] font-mono text-muted-foreground">{inCat.length} risks</span>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {inCat.map(({ r, i }) => {
                        const pri = priority(r.rpn);
                        const added = addedIdx.has(i);
                        return (
                          <article key={i} className="border border-border bg-card p-4 space-y-3">
                            <div className="flex items-start justify-between gap-3">
                              <h3 className="font-bold text-sm leading-tight">{r.title}</h3>
                              <span className={`shrink-0 px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest ${priStyle[pri]}`}>
                                {pri}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground leading-relaxed">{r.description}</p>
                            <div className="grid grid-cols-4 gap-2 text-center">
                              <Score label="SEV" v={r.severity} />
                              <Score label="OCC" v={r.occurrence} />
                              <Score label="DET" v={r.detection} />
                              <div className="border border-accent bg-accent/10 py-1">
                                <div className="text-[9px] font-mono uppercase text-muted-foreground">RPN</div>
                                <div className="text-sm font-extrabold text-accent">{r.rpn}</div>
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground mb-1">
                                Mitigations
                              </div>
                              <ul className="space-y-1">
                                {r.mitigations.map((m, mi) => (
                                  <li key={mi} className="text-xs flex gap-2">
                                    <span className="text-accent font-mono">›</span>
                                    <span>{m}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <button
                              onClick={() => addOne(i)}
                              disabled={added}
                              className="w-full py-2 border border-border text-[10px] font-bold uppercase tracking-widest hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {added ? "✓ Added to Register" : "+ Add to Register"}
                            </button>
                          </article>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}

const inputCls =
  "w-full border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-foreground";

function Field({
  label,
  className = "",
  children,
}: {
  label: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={className}>
      <label className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground block mb-1">
        {label}
      </label>
      {children}
    </div>
  );
}

function Score({ label, v }: { label: string; v: number }) {
  return (
    <div className="border border-border py-1">
      <div className="text-[9px] font-mono uppercase text-muted-foreground">{label}</div>
      <div className="text-sm font-extrabold">{v}</div>
    </div>
  );
}
