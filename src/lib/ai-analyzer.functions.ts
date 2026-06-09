import { createServerFn } from "@tanstack/react-start";
import { generateText, Output } from "ai";
import { z } from "zod";
import { createLovableAiGatewayProvider } from "./ai-gateway.server";

const InputSchema = z.object({
  projectName: z.string().max(200).optional().default(""),
  description: z.string().min(10).max(8000),
  domain: z.string().max(200).optional().default(""),
  budget: z.string().max(100).optional().default(""),
  durationMonths: z.string().max(50).optional().default(""),
  teamSize: z.string().max(50).optional().default(""),
  techStack: z.string().max(500).optional().default(""),
  constraints: z.string().max(2000).optional().default(""),
  documentText: z.string().max(20000).optional().default(""),
});

const Category = z.enum([
  "Technical",
  "Supply Chain",
  "Schedule",
  "Regulatory",
  "Operational",
  "External",
]);

const RiskSchema = z.object({
  title: z.string(),
  description: z.string(),
  category: Category,
  severity: z.number().min(1).max(10),
  occurrence: z.number().min(1).max(10),
  detection: z.number().min(1).max(10),
  mitigations: z.array(z.string()).min(1).max(4),
});

const OutSchema = z.object({ risks: z.array(RiskSchema).min(3).max(12) });

export type AiRisk = z.infer<typeof RiskSchema> & { rpn: number };

export const analyzeProjectRisks = createServerFn({ method: "POST" })
  .inputValidator((d: unknown) => InputSchema.parse(d))
  .handler(async ({ data }) => {
    const key = process.env.LOVABLE_API_KEY;
    if (!key) throw new Error("Missing LOVABLE_API_KEY");

    const gateway = createLovableAiGatewayProvider(key);
    const model = gateway("google/gemini-3-flash-preview");

    const prompt = `You are a senior project risk analyst. Identify 5-10 distinct, realistic, project-specific risks. Score Severity (impact), Occurrence (likelihood) and Detection (1=easy to detect, 10=hard to detect), each 1-10. Provide 2-3 concrete, actionable mitigation steps per risk.

Project: ${data.projectName || "(unnamed)"}
Domain: ${data.domain}
Budget: ${data.budget}
Duration (months): ${data.durationMonths}
Team size: ${data.teamSize}
Tech stack: ${data.techStack}
Constraints: ${data.constraints}

Description:
${data.description}

${data.documentText ? `Reference document excerpts:\n${data.documentText}` : ""}`;

    try {
      const { experimental_output } = await generateText({
        model,
        prompt,
        experimental_output: Output.object({ schema: OutSchema }),
      });

      const risks: AiRisk[] = experimental_output.risks.map((r) => ({
        ...r,
        rpn: r.severity * r.occurrence * r.detection,
      }));
      risks.sort((a, b) => b.rpn - a.rpn);
      return { risks };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      if (/429/.test(msg))
        throw new Error("Rate limit reached. Please try again in a moment.");
      if (/402/.test(msg))
        throw new Error(
          "AI credits exhausted. Add credits in Workspace → Usage.",
        );
      throw new Error(`AI analysis failed: ${msg}`);
    }
  });
