import jsPDF from "jspdf";

const MARGIN = 18;
const PAGE_W = 210;
const PAGE_H = 297;
const CONTENT_W = PAGE_W - MARGIN * 2;

const DARK = [26, 26, 26] as const;
const MID = [80, 80, 80] as const;
const LIGHT = [150, 150, 150] as const;
const LINK = [26, 82, 118] as const;

export async function generatePdf() {
  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

  let y = MARGIN;

  const checkPage = (needed: number) => {
    if (y + needed > PAGE_H - MARGIN) {
      pdf.addPage();
      y = MARGIN;
    }
  };

  const setColor = (rgb: readonly [number, number, number]) =>
    pdf.setTextColor(rgb[0], rgb[1], rgb[2]);

  const text = (
    str: string,
    x: number,
    size: number,
    rgb: readonly [number, number, number],
    style: "normal" | "bold" | "italic" = "normal",
    maxWidth?: number
  ) => {
    pdf.setFontSize(size);
    pdf.setFont("helvetica", style);
    setColor(rgb);
    if (maxWidth) {
      const lines = pdf.splitTextToSize(str, maxWidth);
      pdf.text(lines, x, y);
      return lines.length;
    }
    pdf.text(str, x, y);
    return 1;
  };

  const rule = (weight: number, rgb: readonly [number, number, number]) => {
    pdf.setDrawColor(rgb[0], rgb[1], rgb[2]);
    pdf.setLineWidth(weight);
    pdf.line(MARGIN, y, PAGE_W - MARGIN, y);
  };

  const sectionHeading = (label: string) => {
    checkPage(10);
    y += 4;
    pdf.setFontSize(8);
    pdf.setFont("helvetica", "bold");
    setColor(DARK);
    pdf.text(label.toUpperCase(), MARGIN, y);
    y += 2;
    rule(0.3, [200, 200, 200]);
    y += 4;
  };

  const jobHeader = (title: string, org: string, dates: string) => {
    checkPage(14);
    pdf.setFontSize(10.5);
    pdf.setFont("helvetica", "bold");
    setColor(DARK);
    pdf.text(title, MARGIN, y);
    const dateW = pdf.getTextWidth(dates);
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "normal");
    setColor(MID);
    pdf.text(dates, PAGE_W - MARGIN - dateW, y);
    y += 4;
    pdf.setFontSize(9);
    pdf.setFont("helvetica", "italic");
    setColor(MID);
    pdf.text(org, MARGIN, y);
    y += 5;
  };

  const bullet = (str: string) => {
    const lines = pdf.splitTextToSize(str, CONTENT_W - 5);
    checkPage(lines.length * 4 + 1);
    pdf.setFontSize(9.5);
    pdf.setFont("helvetica", "normal");
    setColor(DARK);
    pdf.text("-", MARGIN + 1, y);
    pdf.text(lines, MARGIN + 5, y);
    y += lines.length * 4 + 0.5;
  };

  const skillRow = (label: string, value: string) => {
    const labelW = 42;
    const valueLines = pdf.splitTextToSize(value, CONTENT_W - labelW);
    checkPage(valueLines.length * 4 + 1);
    pdf.setFontSize(9.5);
    pdf.setFont("helvetica", "bold");
    setColor(DARK);
    pdf.text(label + ":", MARGIN, y);
    pdf.setFont("helvetica", "normal");
    setColor(MID);
    pdf.text(valueLines, MARGIN + labelW, y);
    y += Math.max(valueLines.length, 1) * 4 + 0.5;
  };

  const recItem = (year: string, value: string) => {
    const valueLines = pdf.splitTextToSize(value, CONTENT_W - 14);
    checkPage(valueLines.length * 4 + 1);
    pdf.setFontSize(9.5);
    pdf.setFont("helvetica", "normal");
    setColor(LIGHT);
    pdf.text(year, MARGIN, y);
    setColor(DARK);
    pdf.text(valueLines, MARGIN + 14, y);
    y += valueLines.length * 4 + 0.5;
  };

  // ── HEADER ──
  pdf.setFontSize(22);
  pdf.setFont("helvetica", "bold");
  setColor(DARK);
  pdf.text("Brighton Tandabantu", MARGIN, y);
  y += 7;

  pdf.setFontSize(11);
  pdf.setFont("helvetica", "normal");
  setColor(MID);
  pdf.text("AI Engineer & Founder", MARGIN, y);
  y += 6;

  pdf.setFontSize(8.5);
  setColor(MID);
  pdf.text("(+27) 64 129 5093", MARGIN, y);
  pdf.setTextColor(LINK[0], LINK[1], LINK[2]);
  const phone = pdf.getTextWidth("(+27) 64 129 5093   | ");
  pdf.text("brightontandabantu@gmail.com", MARGIN + phone, y);
  const emailW = pdf.getTextWidth("brightontandabantu@gmail.com   | ");
  pdf.text("linkedin.com/in/bthanda", MARGIN + phone + emailW, y);
  const liW = pdf.getTextWidth("linkedin.com/in/bthanda   | ");
  pdf.text("bthanda.vercel.app", MARGIN + phone + emailW + liW, y);
  y += 5;

  rule(0.6, DARK);
  y += 6;

  // ── SUMMARY ──
  sectionHeading("Professional Summary");
  const summary =
    "Production AI and software engineer with 4+ years of experience designing, building, and operating end-to-end data and AI pipelines in Python and TypeScript. Proven record of taking complex, multi-step AI workflows from prototype to production — including async pipeline orchestration, vector-indexed data systems, real-time inference APIs, and full observability stacks (structured logging, error tracking, performance monitoring, alerting). Hands-on experience with Azure (Functions, AKS, ACR, Application Insights, AD B2C), Docker, CI/CD, and cloud-native deployment. Currently co-founding AnchorBase (London) — an AI document search platform — and leading AgriData AI, running live government pilots within Zimbabwe's Ministry of Agriculture. Works AI-natively with agentic tooling (Claude, Cursor, Copilot, Antigravity) as core development workflow.";
  const summaryLines = pdf.splitTextToSize(summary, CONTENT_W);
  pdf.setFontSize(9.5);
  pdf.setFont("helvetica", "normal");
  setColor(DARK);
  pdf.text(summaryLines, MARGIN, y);
  y += summaryLines.length * 4 + 4;

  // ── WORK EXPERIENCE ──
  sectionHeading("Work Experience");

  jobHeader("Co-Founder & AI Engineer", "AnchorBase  |Remote", "Feb 2026 -Present");
  bullet("Built and shipped an AI-powered document search platform for engineers working with codes, standards, and technical specifications -enabling natural language Q&A with precise citations.");
  bullet("Pivoted from Project Machine (Nov 2025) after deep work on document parsing and RAG pipelines revealed the bigger opportunity. Key insight: in RAG, parsing is the pipeline -document structure must be preserved at the pixel level before retrieval begins.");
  bullet("Designed and implemented a full RAG pipeline: HyDE query expansion, Gemini embeddings, semantic + keyword retrieval with RRF reranking, and hierarchical chunk expansion.");
  bullet("Architected multi-LLM routing: xAI/Grok for document Q&A; Gemini 2.5 Flash with Google Search grounding for internet-routed queries.");
  bullet("Stack: React + TypeScript, FastAPI + Python, Pinecone, Supabase, Cloudflare R2. 50+ organic users; actively onboarding pilot partners.");
  y += 2;

  jobHeader("Founder & AI Engineer", "AgriData AI  |Zimbabwe", "2025 -Present");
  bullet("Built an AI system for Zimbabwe's agricultural sector, processing queries via a WhatsApp-native interface.");
  bullet("Deployed live pilots with the Migratory Pests & Biosecurity Control (MPBC) team within Zimbabwe's Ministry of Agriculture -5,000+ messages from 22+ extension officers.");
  bullet("Active pilot with the Tobacco Research Board (Kutsaga); in contract deliberations with the Zimbabwe Sugarcane Association Experiment Station (ZSAES).");
  bullet("Finalist, Kutsaga Innovation Challenge 2025.");
  y += 2;

  jobHeader("Co-Founder & CEO", "AakiTech  |Remote", "Jun 2024 -Present");
  bullet("Founded and led AakiTech, building digital tools for African schools and small businesses in underserved, low-resource environments.");
  bullet("Built and led a cross-functional team of 7 -developers, business operations, and growth specialists.");
  bullet("Shipped multiple products across edtech and SME operations -including a platform now serving 1,000+ users, engineered for low-bandwidth, mobile-first environments.");
  bullet("Selected: Mastercard FAST Build 2024. 2nd place, Unity Challenge 2025. Finalist, Kutsaga Innovation Challenge 2025.");
  y += 2;

  jobHeader("Builder", "BOQ Generator  |Remote", "2026");
  bullet("Built an AI-powered Bill of Quantities platform for the Zambian construction market — upload a Scope of Work PDF, receive a structured and priced BOQ; or upload an unrated Excel BOQ and have AI fill Zambian market rates calibrated to province, site accessibility, labour source, and margin.");
  bullet("Architected a 7-step async generation pipeline using Inngest to handle large documents beyond serverless timeout limits: extract → structure → save → rate-fill → QA → save → notify. Includes retry logic and per-step execution traces.");
  bullet("Built a vector-indexed rate library (pgvector) sourced from real Zambian construction BOQs, grounding AI pricing with temporal rate anchors — rates carry rate_date for auditability.");
  bullet("Full observability stack: Sentry (errors + session replay), PostHog (server events), structured JSON logging, Upstash Redis rate limiting, Inngest dashboard for pipeline traces.");
  bullet("Stack: Next.js 15, TypeScript, Supabase (Postgres + RLS), Gemini 2.5 Pro/Flash, Inngest, Stripe, Vercel.");
  y += 2;

  jobHeader("Software Consultant", "Kindred for Business  |London (Remote)", "Sep 2023 -Jun 2024");
  bullet("Led migration of multiple C# Azure Functions applications to .NET 8 LTS, ensuring zero-downtime transitions.");
  bullet("Triaged and resolved backend bugs via Azure Function Monitor and Application Insights, improving system resilience.");
  y += 2;

  jobHeader("Software Developer", "Full Stack (Pty) Ltd  |Cape Town", "2021 -Sep 2023");
  bullet("Brokers Platform: OutSystems + ASP.NET Core; automated test suites with Selenium and Katalon.");
  bullet("Mortgage Application Platform: deployed on AWS; gRPC/Proto Buffers for frontend-backend communication.");
  bullet("Jupyter Data Science Portal: Angular frontend, ASP.NET Core + YARP middleware, JupyterHub on Azure Kubernetes Cluster with custom images on ACR.");
  bullet("File Submission & Review System: led Umbraco 8 to 10 migration; Azure AD B2C + Blob Storage; delivered within 6-month timeline.");
  y += 2;

  // ── SKILLS ──
  sectionHeading("Skills");
  skillRow("AI & ML Engineering", "RAG pipelines, LLM integration, vector search (pgvector, Pinecone), embeddings, HyDE, prompt engineering, multi-step agent orchestration, model evaluation, OpenAI, Gemini, xAI/Grok");
  skillRow("Languages", "Python, TypeScript, C#, JavaScript, SQL");
  skillRow("Pipeline & Orchestration", "Inngest (multi-step async pipelines), CI/CD (GitHub Actions, Azure DevOps, GitLab CI), batch + async job architecture, retry/recovery, event-driven workflows");
  skillRow("Frameworks", "FastAPI, Vercel AI SDK, ASP.NET Core, Next.js, React, Django, Entity Framework Core");
  skillRow("Databases", "PostgreSQL, SQL Server, Supabase, Firebase, Pinecone, Azure Blob Storage, Cloudflare R2");
  skillRow("Cloud & Infra", "Azure (Functions, AKS, ACR, AD B2C, App Insights), AWS, Google Cloud, Docker, Docker Compose, Vercel, Fly.io");
  skillRow("Observability", "Sentry (errors + session replay), PostHog, structured JSON logging, Upstash Redis, Azure Application Insights, health checks, alerting");
  skillRow("Tools", "Git, GitHub, Azure DevOps, Jupyter, Scrum, Kanban, gRPC, Selenium");
  y += 2;

  // ── EDUCATION ──
  sectionHeading("Education");

  jobHeader("BSc Computer Science", "University of Cape Town (UCT)", "2017 -2021");
  bullet("Mastercard Foundation Scholar (full scholarship)");
  bullet("Chairperson, Space & Astronomy Society  |Co-Founder, SEDS South Africa -enrolled 3 universities, organized 10+ events nationally");
  bullet("Keynote speaker, 4th SA-GEO National Symposium, CSIR (2022)");
  y += 2;

  jobHeader("O-Level & A-Level (ZIMSEC)", "Mt Selinda High School", "2010 -2015");
  bullet("Head Boy  |8 As and 1 B at O-Level  |Recipient, United States Achievers Program (USAP)");
  y += 2;

  // ── RECOGNITION ──
  sectionHeading("Recognition & Awards");
  recItem("2026", "AIM Founding to Give 2026 Cohort -selected after multiple rigorous rounds");
  recItem("2025", "Mastercard Foundation Scholars -Alumni Panellist");
  recItem("2025", "Unity Challenge -2nd Place (AL for Professionals)");
  recItem("2025", "Kutsaga Innovation Challenge -Finalist");
  recItem("2024", "Mastercard FAST Build -Recipient");

  pdf.save("Brighton Tandabantu - CV.pdf");
}
