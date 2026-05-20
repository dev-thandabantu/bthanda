import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Applications",
  robots: { index: false, follow: false },
};

type Status = "Applied" | "Interviewing" | "Offer" | "Rejected" | "Withdrawn";

type Application = {
  company: string;
  role: string;
  date: string;
  status: Status;
  url?: string;
  notes?: string;
};

const applications: Application[] = [
  {
    company: "Bolt.new (StackBlitz)",
    role: "Senior Applied AI Engineer",
    date: "2026-05-17",
    status: "Applied",
    url: "https://job-boards.greenhouse.io/stackblitz/jobs/4005254009",
    notes:
      "Bolt.new is StackBlitz's AI app builder — used by 1M+ developers. Role is building the AI agents that turn natural language into production apps: context management, multi-LLM orchestration, tool use, evals. TypeScript stack throughout. Cover letter led with AnchorBase RAG pipeline and AgriData AI government pilots. Removed a false claim about using Bolt.new (haven't opened it — use Lovable instead); replaced with honest framing about understanding the category from the user side. CV updated same session: TypeScript surfaced to top of languages, Vercel AI SDK added, new AnchorBase bullet on multi-step agent orchestration. Also applied for Staff AI Engineer but correctly self-selected down to Senior — Staff asked whether you've led AI architecture at scale across teams, which is a stretch right now.",
  },
  {
    company: "Sweed (SweedPos)",
    role: "AI Engineer",
    date: "2026-05-17",
    status: "Applied",
    url: "https://jobs.ashbyhq.com/sweedpos.com/b2335d86-ace5-4773-acf4-3d5c89c2a008",
    notes:
      "Cannabis retail SaaS (POS, eCommerce, Inventory, Analytics). 200+ people, remote-first, USD B2B contract. Role is full-cycle AI engineer — own features end-to-end using AI tools as core workflow. Strong fit: .NET, React, TypeScript, PostgreSQL, RAG, LLM integration all checked. Same session as the mobile fix: noticed the site wasn't mobile-optimised, fixed the nav (hamburger menu) and Work section header wrapping, shipped, then scraped the JD, assessed fit, updated CV to name Claude/Cursor/Copilot/Antigravity explicitly, and applied. Used the Additional Info field to describe exactly that — applying to an AI engineer role using AI tools to apply, as proof of the thing they're hiring for. Salary: $75k USD/year.",
  },
  {
    company: "Infinity Constellation (Everest)",
    role: "AI Engineer",
    date: "2026-05-17",
    status: "Applied",
    url: "https://www.infinityconstellation.com/openings?ashby_jid=e84aea13-1d51-4a4e-b179-0d9a3cb890ae",
    notes:
      "AI holding company. Everest is their tech-enabled executive assistant service. Role involves building AI infrastructure and automation for service delivery. Quick/straightforward application.",
  },
  {
    company: "Huzzle (client placement)",
    role: "AI Engineer",
    date: "2026-05-17",
    status: "Applied",
    url: "https://apply.workable.com/huzzle/j/172A019A2A/",
    notes:
      "Huzzle places you in-house with a client company. Full-time, independent contractor. JD: LLMs, RAG, Python, scalable APIs, MLOps. Submitted CV + tools/industries answers + cover letter leading with AnchorBase RAG pipeline and AgriData AI government pilots.",
  },
  {
    company: "Momentum Group",
    role: "Machine Learning Engineer",
    date: "2026-05-18",
    status: "Applied",
    url: "https://momentumgroupltd.erecruit.co/candidateapp/Jobs/View/MMH260511-1",
    notes:
      "Large South African financial services group (insurance, savings, investments). Role: ML Engineer on a data/AI team — model development, deployment, monitoring, and MLOps. JD asked for Python, ML frameworks, Azure/AWS, CI/CD, and experience deploying models to production. Honest gap: no pure ML/data science background (no sklearn pipelines, model training, feature engineering). The fit is on the engineering and deployment side — pipelines, observability, async orchestration, cloud infra — which maps well to production AI work done on AnchorBase, AgriData, BOQ Generator. Decision to apply: came via a personal contact's referral link (friend sent the specific role). Not a perfect fit on paper but the engineering depth is real and the gap is learnable fast, especially with agentic dev tooling. Reasoning: 'what exactly can't I do or learn with my background?' was the framing. Shot taken. CV temporarily reframed for this role: pipeline engineering emphasis, Python first in languages, new 'Pipeline & Orchestration' and 'Observability & Monitoring' skill rows added, AnchorBase location updated to London UK. Cover letter written emphasising production pipeline engineering, observability stack (Sentry, PostHog, structured logging), and async orchestration (Inngest 7-step pipeline) as direct analogues to MLOps concerns. Experience dropdowns: ML engineering 1-2 years, insurance/financial 0 years, similar position 1-2 years. Salary: R70,000/month (R840,000 per annum). CV refactor happened same session: all CV content extracted to src/lib/cvData.ts — single source of truth for web page, PDF, and Word doc.",
  },
  {
    company: "AI Product Studio (Indeed)",
    role: "AI Engineer",
    date: "2026-05-19",
    status: "Applied",
    notes:
      "Small AI product studio hiring via Indeed — builds intelligent software systems for clients, production-only, no demos or slide decks. Role: AI-native product development, full-stack (Python/TypeScript, GCP, FastAPI, React/Vite, Firestore/Postgres, Cloud Run), end-to-end delivery. Required: daily use of Claude Code/Cursor/Codex, Anthropic SDK, systems thinking, strong written comms. Applied with updated CV (summary rewritten for this role specifically — mirrors their 'LLMs drive core application logic' framing, names AnchorBase and AgriData as production systems), cover letter leading with production bias and specific architectural decisions (5-path RAG routing, 7-step Inngest pipeline, circuit breaker), Loom video recorded (https://www.loom.com/share/3a503e93d5b543419990d446618dc4be), and typing test passed (71 WPM, 98% accuracy, 81% consistency). Also submitted portfolio link (bthanda.vercel.app). Multi-step process: initial application → video intro → homework assignment → recruitment interview → executive interview → client interview → background check → offer.",
  },
  {
    company: "MediaVision Interactive / Metis",
    role: "Senior Software Engineer",
    date: "2026-05-19",
    status: "Applied",
    url: "https://za.indeed.com/viewjob?jk=bfe78112002e4cd8",
    notes:
      "Metis is a retail ecommerce intelligence platform (AWS, TypeScript, React, Lambda, CDK, Bedrock) — role posted via MediaVision Interactive on Indeed. Key differentiator: autonomous delivery pipeline — spec-gated PRs, post-deploy monitoring, overnight fix agent. Cover letter led with autonomous pipeline framing ('not a threat, the most interesting part'), AnchorBase and BOQ Generator as production TypeScript systems, honest CDK gap acknowledged, and real AI tooling opinions (well-specified problems vs architectural decisions). Noted UK-aligned hours from Cape Town and prior remote contract experience via Kindred. CV updated same session: AWS surfaced prominently in skills (Lambda, S3, EC2, RDS, API Gateway), AWS attribution corrected to Full Stack Mortgage Platform, AakiTech updated with Flutter/Firebase mobile work (edtech client, Play Store/App Store/Huawei App Gallery) and AWS client bullet — client names removed. Salary: R80,000–R90,000/month.",
  },
  {
    company: "Hire with Reef",
    role: "AI Developer (Contract)",
    date: "2026-05-19",
    status: "Applied",
    notes:
      "Remote contract role — scope, design, and build AI workflows and internal tools for business efficiency. JD: LLMs, RAG, agents, automation platforms (N8N/Zapier/Make.com), API integration, stakeholder communication. CV-only application, no cover letter field. Honest gap: N8N/Zapier/Make.com not in background — custom pipeline experience (Inngest, FastAPI) is the closest analogue. Strong fit on RAG, LLM integration, agents, prompt engineering, fast iteration, and stakeholder translation (AgriData government pilots, AakiTech client delivery).",
  },
  {
    company: "Conquest",
    role: "Intermediate Developer",
    date: "2026-05-20",
    status: "Applied",
    notes:
      "Cape Town-based software startup, product called Conquest One. Stack: Next.js 16 App Router, React 19, TypeScript strict, Mantine, Redux Toolkit, RTK Query, React Hook Form, Zod, PostgreSQL, Drizzle ORM, Better Auth, Entra ID, Azure Blob, Pino, Sentry, Vitest, Playwright. JD explicitly requires Claude Code and AGENTS.md/CLAUDE.md — written by someone who uses agentic tooling daily. Near-perfect fit. Applied via Indeed one-click. Also sent cold email to enquiries@conquest.co.za asking recipient to forward to the right person — led with 'this email was drafted in Claude Code' and called out that we spent real effort trying to find a direct email and failed. Cover letter led with the 'agentic coding non-negotiable' line and mirrored JD language (Plan Mode, Git worktrees, AGENTS.md). Salary: R70,000–R90,000/month.",
  },
  {
    company: "DeepMetis",
    role: "Senior AI Engineer",
    date: "2026-05-17",
    status: "Applied",
    url: "https://join.com/companies/deepmetis/16163667/apply/success?sso=false",
    notes:
      "Question on recent AI paper/architectural shift. Answered with AnchorBase RAG/parsing experience — vision-guided chunking insight, LlamaParse agentic model, chunking quality as first-order retrieval problem. Referenced Tripathi et al. (2025). ETL, Microservices, Python stack.",
  },
];

const STATUS_COLORS: Record<Status, string> = {
  Applied: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  Interviewing: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  Offer: "bg-green-500/10 text-green-400 border-green-500/20",
  Rejected: "bg-red-500/10 text-red-400 border-red-500/20",
  Withdrawn: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

export default function Applied() {
  const counts = applications.reduce<Record<string, number>>((acc, a) => {
    acc[a.status] = (acc[a.status] || 0) + 1;
    return acc;
  }, {});

  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white px-6 py-16 max-w-3xl mx-auto">
      <div className="mb-12">
        <p className="text-xs text-white/20 uppercase tracking-widest mb-2">Private</p>
        <h1 className="text-2xl font-semibold text-white mb-1">Job Applications</h1>
        <p className="text-white/35 text-sm">{applications.length} application{applications.length !== 1 ? "s" : ""} logged</p>

        <div className="flex flex-wrap gap-3 mt-6">
          {Object.entries(counts).map(([status, count]) => (
            <span
              key={status}
              className={`text-xs px-3 py-1 rounded-full border ${STATUS_COLORS[status as Status]}`}
            >
              {count} {status}
            </span>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        {applications
          .slice()
          .sort((a, b) => b.date.localeCompare(a.date))
          .map((app, i) => (
            <div
              key={i}
              className="rounded-xl border border-white/8 p-5 flex flex-col gap-3"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-white">{app.company}</p>
                  <p className="text-sm text-white/50">{app.role}</p>
                </div>
                <div className="flex flex-col items-end gap-2 shrink-0">
                  <span
                    className={`text-xs px-2.5 py-0.5 rounded-full border ${STATUS_COLORS[app.status]}`}
                  >
                    {app.status}
                  </span>
                  <span className="text-xs text-white/25">{app.date}</span>
                </div>
              </div>

              {app.notes && (
                <p className="text-xs text-white/40 leading-relaxed border-t border-white/6 pt-3">
                  {app.notes}
                </p>
              )}

              {app.url && (
                <a
                  href={app.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-white/25 hover:text-white/50 transition-colors"
                >
                  {app.url}
                </a>
              )}
            </div>
          ))}
      </div>
    </main>
  );
}
