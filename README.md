# RiskSense

> An AI-powered risk intelligence layer for complex engineering and project environments.
> *Infineon Venture Hack '26 submission.*

RiskSense sits on top of an organisation's existing project-data infrastructure and turns scattered, stale risk information into a single, continuously updated, prioritised action list. It doesn't replace the tools engineers already use — it connects them, scores what they contain, and tells project managers what to do next.

Click for Prototype : https://risksense-ai.lovable.app/
---

## The problem

In complex engineering projects, everyone agrees risk management matters — and it still fails in practice. The failure is structural, not cultural:

- **Fragmented data.** Risk lives in FMEA databases, PLM systems (Windchill, PLATO), project tools (KLUSA), Lessons Learned archives, and public sources — none of which are connected. Cross-referencing them by hand rarely happens.
- **Static registers.** Risk registers are built at kick-off and rarely touched again. By the time a risk materialises, the register reflects the world from months ago.
- **Reactive culture.** Without a structured, automated process, teams default to firefighting: high cost, high burnout, high failure rate.

Projects rarely fail from one catastrophic event. They fail from the slow accumulation of unobserved, unactioned risks — exactly what structured risk management is supposed to prevent.

## The solution

RiskSense runs a continuous **four-phase engine** over every connected data source:

| Phase | What it does |
| --- | --- |
| **Identify** | Scans all connected sources in parallel (FMEA-DB, Windchill, KLUSA, PLATO, MRB-DB, Lessons Learned, regulatory feeds, Excel exports), deduplicates across them, and adds new risks to the register automatically. |
| **Assess** | Computes a **Risk Priority Number (RPN)** for each risk using the FMEA formula **Severity × Occurrence × Detection**, updating scores dynamically as new signals arrive. |
| **Mitigate** | Queries Lessons Learned and FMEA history to generate concrete, **source-cited** mitigation recommendations for any risk above a configurable threshold, and auto-escalates critical risks to the right owners. |
| **Monitor** | Refreshes the register on a configurable cycle, writes a full activity log, and flags any change in risk status. |

The payoff: a project manager opens RiskSense and immediately sees the top prioritised risks, where each came from, and exactly what to do — without searching, aggregating, or scoring anything by hand.

## Why it wins

- **Native integration with engineering systems** — reads FMEA-DB, Windchill, PLATO, and KLUSA directly, so there's zero manual data entry for initial risk identification.
- **A ranked action list, not a data dump** — the engine scores, ranks, and explains every risk.
- **Continuous, not point-in-time** — the register updates as the world changes (supply chain, regulatory, internal events).
- **Transparent sourcing** — every mitigation cites the past project or database entry it came from, for trust and auditability.

Generic PM tools (Jira, MS Project) don't understand engineering-risk ontologies or FMEA. Excel registers go stale instantly. Enterprise GRC platforms are heavyweight and don't use AI for continuous monitoring. RiskSense targets exactly that gap.

---

## What's in this repository

This repo is the **interactive prototype** built for the hackathon — a full TanStack Start web app that walks through the entire RiskSense user journey against a representative **semiconductor fab construction project** ("Phoenix Core"), spanning workstreams from Planning and Procurement through Infrastructure, MEP, Construction, and Commissioning. It demonstrates the complete flow, RPN-based scoring, and the continuous-engine concept end to end.

### Screens

| Route | Screen | Purpose |
| --- | --- | --- |
| `/` | **Dashboard** | Program-wide exposure: KPI cards, critical escalations, 5×5 heatmap, risk Gantt, and live engine status. |
| `/intake` | **Import & Identify** | Enter a WBS or KLUSA project ID; aggregate risks across sources, pre-score them, and surface similar historical projects. |
| `/register` | **Risk Register** | The full register aggregated across sources — filter, sort by RPN, and drill into mitigations and source traceability. |
| `/mitigation` | **Mitigate Strategy** | Build response playbooks, set trigger thresholds, and assign departmental owners. |
| `/workstreams` | **Monitor & Sync** | Risk exposure broken down by delivery workstream — compare totals, weighted score, and critical counts. |
| `/admin` | **Admin & Org** | Company profile, departments, users, roles, master data, and audit trail. |
| `/engine` | **How the Engine Works** | A walkthrough of the Identify → Assess → Mitigate → Monitor cycle. |

### Prototype status

The committed app runs on rich, representative demo data for a semiconductor fab construction project (`src/lib/risk-data.ts`) with the continuous engine **visualised** (`src/components/engine-runner.tsx`), demonstrating the full journey and RPN-based scoring end to end.

---

## Tech stack

- **[TanStack Start](https://tanstack.com/start)** — full-stack React framework (file-based routing, server functions)
- **[TanStack Router](https://tanstack.com/router)** + **[TanStack Query](https://tanstack.com/query)**
- **React 19** + **TypeScript**
- **[Vite 7](https://vite.dev)** with **[Nitro](https://nitro.build)** server
- **[Tailwind CSS v4](https://tailwindcss.com)** + **[shadcn/ui](https://ui.shadcn.com)** (Radix primitives, lucide-react)
- **[Recharts](https://recharts.org)** for charts · **react-hook-form** + **[Zod](https://zod.dev)** for forms and validation
- **[Bun](https://bun.sh)** as package manager and runtime
- Built with **[Lovable](https://lovable.dev)**

## Getting started

**Prerequisites:** [Bun](https://bun.sh) installed (`curl -fsSL https://bun.sh/install | bash`).

```bash
# 1. Install dependencies
bun install

# 2. Start the dev server
bun dev
```

The app runs on the Vite dev server (default `http://localhost:5173`).

### Scripts

| Command | Description |
| --- | --- |
| `bun dev` | Start the development server |
| `bun run build` | Production build |
| `bun run build:dev` | Development-mode build |
| `bun run preview` | Preview the production build locally |
| `bun run lint` | Run ESLint |
| `bun run format` | Format the codebase with Prettier |

## Project structure

```
src/
├── routes/            # File-based routes (one file per screen — see routes/README.md)
│   ├── __root.tsx     # App shell / layout
│   ├── index.tsx      # Dashboard
│   ├── intake.tsx     # Import & Identify
│   ├── register.tsx   # Risk Register
│   ├── mitigation.tsx # Mitigate Strategy
│   ├── workstreams.tsx# Monitor & Sync
│   ├── admin.tsx      # Admin & Org
│   └── engine.tsx     # How the Engine Works
├── components/        # Feature components (dashboard, heatmap, register table, engine…)
│   └── ui/            # shadcn/ui primitives
├── lib/
│   ├── risk-data.ts   # Risk domain model + representative program data
│   └── …
├── router.tsx         # Router configuration
└── styles.css         # Tailwind entry
```

> **Routing note:** this project uses TanStack Start's file-based routing. Every `.tsx` in `src/routes/` is a route, and `routeTree.gen.ts` is auto-generated — don't edit it by hand. See [`src/routes/README.md`](src/routes/README.md).


## License

Created for Infineon Venture Hack '26. No open-source license has been applied yet — please contact the team before reuse or redistribution.

---

*The best risk is the one you never had. RiskSense makes that possible.*
