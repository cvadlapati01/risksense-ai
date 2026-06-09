# AI Risk Analyzer

Add an AI-powered feature where a PM enters project details and gets back categorized risks (with Severity/Occurrence/Detection + RPN) plus mitigation suggestions, persisted into the Risk Register.

## Placement
- New route `/ai-analyzer` (file: `src/routes/ai-analyzer.tsx`)
- Add nav link "AI Analyzer" to `src/components/site-header.tsx`

## Inputs (PM form)
- Project description (textarea, required)
- Structured fields: project name, domain/industry, budget, duration (months), team size, tech stack, key constraints
- Document upload (PDF/DOCX charter or SOW) — parsed client-side to text and appended to the prompt context (PDF via `pdfjs-dist`, DOCX via `mammoth`)

## AI pipeline
- Enable Lovable Cloud → provisions `LOVABLE_API_KEY`
- Server function `analyzeProjectRisks` in `src/lib/ai-analyzer.functions.ts` using AI SDK + Lovable AI Gateway helper
  - Model: `google/gemini-3-flash-preview`
  - Uses `generateText` + `Output.object` with a Zod schema returning:
    ```
    { risks: [{ title, description, category (Technical|Supply Chain|Schedule|Regulatory|Operational|External), severity (1-10), occurrence (1-10), detection (1-10), mitigations: string[] }] }
    ```
  - RPN computed server-side as severity × occurrence × detection
- Gateway helper at `src/lib/ai-gateway.server.ts` (per knowledge spec)

## UI
- Form section at top
- "Analyze Risks" button → loading state → results
- Results: grid of risk cards grouped by category, each showing S/O/D, RPN badge, and 2-3 mitigations
- Per-card "Add to Register" + bulk "Add all to Register" button — appends to a local in-memory store extending `src/lib/risk-data.ts` (new `addAiRisks` helper using a simple module-level array + subscription), so they show on `/register`
- Error handling for 429/402 with clear toast messages

## Technical notes
- Server function reads `process.env.LOVABLE_API_KEY` inside `.handler()`
- Schema kept small (no long enums) per Gemini constraints
- Document parsing happens in browser; only extracted text sent to server
- No DB persistence in v1 (risks live in client state); can be upgraded to Cloud DB later

## Files
- create: `src/routes/ai-analyzer.tsx`
- create: `src/lib/ai-analyzer.functions.ts`
- create: `src/lib/ai-gateway.server.ts`
- create: `src/components/ai-risk-results.tsx`
- edit: `src/components/site-header.tsx` (add nav link)
- edit: `src/lib/risk-data.ts` (add `addAiRisks` + subscriber helpers)
- enable: Lovable Cloud (for `LOVABLE_API_KEY`)
