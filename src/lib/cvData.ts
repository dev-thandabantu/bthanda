export const cvHeader = {
  name: "Brighton Tandabantu",
  title: "AI Engineer & Founder",
  phone: "(+27) 64 129 5093",
  email: "brightontandabantu@gmail.com",
  linkedin: "linkedin.com/in/bthanda",
  linkedinUrl: "https://www.linkedin.com/in/bthanda/",
  website: "bthanda.vercel.app",
  websiteUrl: "https://bthanda.vercel.app",
};

export const cvSummary =
  "Production AI and software engineer with 4+ years of experience designing, building, and operating end-to-end AI systems in Python and TypeScript. Specialises in RAG pipelines (query refinement, intent routing, blended reranking), multi-step agent orchestration with tool use and structured output, async pipeline architecture (Inngest), and real-time inference APIs with full observability. Hands-on experience with Azure, Docker, CI/CD, and cloud-native deployment. Currently co-founding AnchorBase (London), an AI document search platform with 50+ users, and leading AgriData AI with live government pilots within Zimbabwe's Ministry of Agriculture. Works AI-natively with agentic tooling (Claude, Cursor, Copilot, Antigravity) as core development workflow.";

export interface CvJob {
  title: string;
  org: string;
  dates: string;
  bullets: string[];
}

export const cvJobs: CvJob[] = [
  {
    title: "Co-Founder & Builder",
    org: "Project Machine · Remote",
    dates: "Nov 2025 – Jan 2026",
    bullets: [
      "Co-founded an AI-powered visual project management SaaS — canvas-based task planning with an AI chat assistant, multi-user collaboration, and file upload with AI summarization.",
      "Implemented a voice-first prototype using OpenAI Realtime API (WebRTC) — users spoke to an AI that manipulated the canvas in real time, creating and updating tasks through natural conversation.",
      "Built the full backend: 16-table PostgreSQL schema with Drizzle ORM, 31+ REST endpoints (projects, tasks, subtasks, comments, assignments, canvas snapshots, collaborators, file parsing, AI chat, Excel export), RLS policies, and Swagger/OpenAPI documentation.",
      "Implemented file text extraction pipeline with AI summarization (OpenAI), AI chat with context assembly and usage logging, and multi-user invite/collaboration system.",
      "107 tests passing; shelved Jan 2026 when document parsing work pointed toward AnchorBase.",
      "Stack: Next.js 15, TypeScript, ReactFlow, Supabase (Postgres + auth + storage), Drizzle ORM, OpenAI.",
    ],
  },
  {
    title: "Co-Founder & AI Engineer",
    org: "AnchorBase · London, UK (Remote)",
    dates: "Feb 2026 – Present",
    bullets: [
      "Built and shipped an AI-powered document search platform for engineers working with codes, standards, and technical specifications — enabling natural language Q&A with precise citations. Pivoted from Project Machine after file-parsing and AI summarization work revealed the bigger opportunity.",
      "Designed and implemented a production RAG pipeline ('Agent Nicholas'): query refinement, intent-based routing to 5 parallel execution paths (vector search, document summaries, metadata, full-context, general LLM), embedding via Gemini gemini-embedding-001, Pinecone retrieval with blended semantic+lexical reranking, Supabase metadata hydration, and structured JSON output with real-time source citations.",
      "Built internet-augmented Q&A: Grok Responses API with web_search tool combines Pinecone document chunks with live web results in a single call; circuit breaker degrades gracefully to document-only if the Responses API is unavailable.",
      "Built a two-phase document parsing pipeline: Phase 1 uses LlamaParse (agentic tier) to produce structured markdown with headings, tables, and figure descriptions — chunked via LangChain MarkdownHeaderTextSplitter, embedded with Gemini, and upserted to Pinecone. Phase 2 runs Tesseract/ocrmypdf as a background job for scanned pages. Selected LlamaParse after a systematic 5-provider evaluation (Docling, Google Document AI, Azure, Unstructured.io).",
      "Shipped streaming answer delivery via SSE with an admin observability dashboard; implemented follow-up question generation and rolling conversation summarisation.",
      "Stack: React + TypeScript (frontend), FastAPI + Python (backend), Pinecone (vector search), Supabase (Postgres + auth), Cloudflare R2 (storage), xAI/Grok, Gemini.",
      "Onboarded 50+ organic users since launch; actively onboarding pilot partners.",
    ],
  },
  {
    title: "Founder & AI Engineer",
    org: "AgriData AI · Zimbabwe",
    dates: "2025 – Present",
    bullets: [
      "Built an AI system for Zimbabwe's agricultural sector, processing farmer and extension officer queries via a WhatsApp-native interface.",
      "Deployed live pilots with the Migratory Pests & Biosecurity Control (MPBC) team within Zimbabwe's Ministry of Agriculture — system has processed 5,000+ messages from 22+ extension officers.",
      "Running an active pilot with the Tobacco Research Board (Kutsaga); in contract deliberations with the Zimbabwe Sugarcane Association Experiment Station (ZSAES).",
      "Finalist, Kutsaga Innovation Challenge 2025.",
    ],
  },
  {
    title: "Co-Founder & CEO",
    org: "AakiTech · Remote",
    dates: "Jun 2024 – Present",
    bullets: [
      "Founded and led AakiTech, building digital tools for African schools and small businesses in underserved, low-resource environments.",
      "Built and led a cross-functional team of 7 — developers, business operations, and growth specialists.",
      "Shipped multiple products across edtech and SME operations — including a platform now serving 1,000+ users, engineered for low-bandwidth, mobile-first environments.",
      "Selected: Mastercard FAST Build 2024. 2nd place, Unity Challenge 2025 (AL for Professionals). Finalist, Kutsaga Innovation Challenge 2025.",
    ],
  },
  {
    title: "Builder",
    org: "BOQ Generator · Remote",
    dates: "2026",
    bullets: [
      "Built an AI-powered Bill of Quantities platform for the Zambian construction market — upload a Scope of Work PDF, receive a structured and priced BOQ; or upload an unrated Excel BOQ and have AI fill Zambian market rates calibrated to province, site accessibility, labour source, and margin.",
      "Architected a 7-step async generation pipeline using Inngest to handle large documents beyond Vercel's serverless timeout limits: extract > structure > save > rate-fill > QA > save > notify.",
      "Built a vector-indexed rate library (pgvector) sourced from real Zambian construction BOQs, used to ground AI pricing with temporal rate anchors — rates carry rate_date for auditability.",
      "Implemented full payment gate via Stripe (dynamic pricing by BOQ size and item count), Google OAuth, in-browser BOQ editor with auto-save, Excel export in Zambian tender format, and a streaming AI edit assistant.",
      "Observability stack: Sentry (errors + session replay), PostHog (server events), structured JSON logging, Upstash Redis rate limiting, Inngest dashboard for per-step execution traces.",
      "Stack: Next.js 15, TypeScript, Supabase (Postgres + RLS), Gemini 2.5 Pro/Flash, Inngest, Stripe, Vercel.",
    ],
  },
  {
    title: "Software Consultant",
    org: "Kindred for Business · London (Remote)",
    dates: "Sep 2023 – Jun 2024",
    bullets: [
      "Led migration of multiple C# Azure Functions applications to .NET 8 LTS, ensuring zero-downtime transitions.",
      "Triaged and resolved backend bugs detected via Azure Function Monitor and Application Insights, improving system resilience.",
      "Collaborated with distributed service desk and engineering teams on backend stability and delivery.",
    ],
  },
  {
    title: "Software Developer",
    org: "Full Stack (Pty) Ltd · Cape Town",
    dates: "2021 – Sep 2023",
    bullets: [
      "Brokers Platform: Built a brokers management platform using OutSystems and ASP.NET Core; automated test suites with Selenium and Katalon.",
      "Mortgage Application Platform: Deployed application, SQL database, and storage on AWS; implemented gRPC/Proto Buffers for frontend-backend communication.",
      "Jupyter Data Science Portal: Developed a high-security data analysis portal — Angular frontend, ASP.NET Core + YARP middleware, customized JupyterHub on Azure Kubernetes Cluster with custom images on ACR.",
      "File Submission & Review System: Led Umbraco 8 to 10 migration; integrated Azure AD B2C authentication and Azure Blob Storage; delivered within 6-month timeline.",
      "Phase II CMS: Contributed to Umbraco + ASP.NET project; managed deployment across dev, staging, and production; delivered with a 4-person team in 2 months.",
    ],
  },
];

export interface CvSkill {
  label: string;
  value: string;
}

export const cvSkills: CvSkill[] = [
  { label: "AI & ML Engineering", value: "RAG pipelines, LLM integration, vector search (pgvector, Pinecone), embeddings, query refinement, intent routing, blended reranking, tool use / function calling, structured output, prompt engineering, multi-step agent orchestration, model evaluation, LLM-as-judge evals, voice AI (OpenAI Realtime API, WebRTC), OpenAI, Gemini, xAI/Grok" },
  { label: "Languages", value: "Python, TypeScript, C#, JavaScript, SQL" },
  { label: "Pipeline & Orchestration", value: "Inngest (multi-step async pipelines), CI/CD (GitHub Actions, Azure DevOps, GitLab CI), batch + async job architecture, retry/recovery, event-driven workflows" },
  { label: "Frameworks & Libraries", value: "FastAPI, Vercel AI SDK, ASP.NET Core, Next.js, React, Django, Entity Framework Core, LangChain, LlamaParse, PyMuPDF" },
  { label: "Databases & Storage", value: "PostgreSQL, SQL Server, Supabase, Firebase, Pinecone, Azure Blob Storage, Cloudflare R2" },
  { label: "Cloud & Infrastructure", value: "Microsoft Azure (Functions, AKS, ACR, AD B2C, Application Insights), AWS, Google Cloud, Docker, Docker Compose, Vercel, Fly.io" },
  { label: "Observability & Monitoring", value: "Sentry (errors + session replay), PostHog, structured JSON logging, Upstash Redis (rate limiting), Azure Application Insights, health checks, alerting" },
  { label: "Tools & Practices", value: "Git, GitHub, Azure DevOps, Jupyter, Scrum, Kanban, gRPC, Selenium" },
];

export interface CvEdu {
  degree: string;
  school: string;
  dates: string;
  notes: string[];
}

export const cvEducation: CvEdu[] = [
  {
    degree: "BSc Computer Science",
    school: "University of Cape Town (UCT)",
    dates: "2017 – 2021",
    notes: [
      "Mastercard Foundation Scholar (full scholarship)",
      "Chairperson, Space & Astronomy Society (SpaceSoc)",
      "Co-Founder, SEDS South Africa — enrolled 3 universities; organized 10+ events nationally",
      "Keynote speaker, 4th SA-GEO National Symposium, CSIR (2022)",
      "Relevant electives: Statistics, Philosophy, Astronomy, African Studies",
    ],
  },
  {
    degree: "O-Level & A-Level (ZIMSEC)",
    school: "Mt Selinda High School",
    dates: "2010 – 2015",
    notes: [
      "Head Boy",
      "8 As and 1 B at O-Level",
      "Recipient, United States Achievers Program (USAP)",
    ],
  },
];

export interface CvAward {
  year: string;
  text: string;
}

export const cvAwards: CvAward[] = [
  { year: "2026", text: "AIM Founding to Give 2026 Cohort — selected after multiple rigorous rounds" },
  { year: "2025", text: "Mastercard Foundation Scholars — Alumni Panellist" },
  { year: "2025", text: "Unity Challenge — 2nd Place (AL for Professionals)" },
  { year: "2025", text: "Kutsaga Innovation Challenge — Finalist" },
  { year: "2024", text: "Mastercard FAST Build — Recipient" },
];
