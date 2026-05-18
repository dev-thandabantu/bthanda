"use client";

import { useState } from "react";
import { generateDocx } from "@/lib/generateDocx";
import { generatePdf } from "@/lib/generatePdf";

function DownloadBar() {
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingDocx, setLoadingDocx] = useState(false);

  const downloadPdf = async () => {
    setLoadingPdf(true);
    try {
      await generatePdf();
    } finally {
      setLoadingPdf(false);
    }
  };

  const downloadDocx = async () => {
    setLoadingDocx(true);
    try {
      await generateDocx();
    } finally {
      setLoadingDocx(false);
    }
  };

  return (
    <div className="download-bar">
      <span className="download-label">Brighton Tandabantu — CV</span>
      <div className="download-buttons">
        <button onClick={downloadPdf} disabled={loadingPdf} className="btn">
          {loadingPdf ? "Generating..." : "Download PDF"}
        </button>
        <button onClick={downloadDocx} disabled={loadingDocx} className="btn btn-secondary">
          {loadingDocx ? "Generating..." : "Download Word (.docx)"}
        </button>
      </div>
    </div>
  );
}

export default function CvPage() {
  return (
    <>
      <style>{`
        * { margin: 0; padding: 0; box-sizing: border-box; }

        body {
          background: #f5f5f5;
          font-family: Calibri, Arial, Helvetica, sans-serif;
          color: #1a1a1a;
        }

        .download-bar {
          position: fixed;
          top: 0; left: 0; right: 0;
          z-index: 100;
          background: #1a1a1a;
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 32px;
          height: 52px;
          gap: 16px;
        }
        .download-label {
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          font-family: system-ui, sans-serif;
        }
        .download-buttons { display: flex; gap: 8px; }
        .btn {
          font-family: system-ui, sans-serif;
          font-size: 13px;
          padding: 6px 16px;
          border-radius: 6px;
          border: none;
          cursor: pointer;
          font-weight: 500;
          transition: opacity 0.15s;
          background: #fff;
          color: #1a1a1a;
        }
        .btn:hover { opacity: 0.85; }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
        .btn-secondary {
          background: transparent;
          color: #fff;
          border: 1px solid rgba(255,255,255,0.25);
        }
        .btn-secondary:hover { background: rgba(255,255,255,0.08); opacity: 1; }

        .cv-sheet {
          background: #fff;
          max-width: 820px;
          margin: 72px auto 48px;
          padding: 56px 64px;
          box-shadow: 0 2px 24px rgba(0,0,0,0.10);
          line-height: 1.5;
          font-size: 11pt;
        }

        /* Header */
        .cv-name { font-size: 22pt; font-weight: 700; letter-spacing: 0.3px; margin-bottom: 2px; }
        .cv-title { font-size: 12pt; color: #444; margin-bottom: 10px; }
        .cv-contact { font-size: 10pt; color: #555; display: flex; flex-wrap: wrap; gap: 4px 16px; }
        .cv-contact a { color: #555; text-decoration: none; }
        .cv-contact a:hover { text-decoration: underline; }

        hr.full { border: none; border-top: 1.5px solid #1a1a1a; margin: 14px 0; }
        hr.light { border: none; border-top: 0.5px solid #ccc; margin: 14px 0; }

        h2 {
          font-size: 9.5pt;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1.2px;
          color: #1a1a1a;
          margin-bottom: 10px;
        }

        section { margin-bottom: 20px; }

        /* Summary */
        .summary p { font-size: 10.5pt; color: #333; line-height: 1.65; }

        /* Job */
        .job { margin-bottom: 16px; }
        .job-header { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 1px; }
        .job-title { font-weight: 700; font-size: 11pt; }
        .job-dates { font-size: 10pt; color: #555; white-space: nowrap; }
        .job-org { font-size: 10pt; color: #444; margin-bottom: 5px; }
        .job ul { padding-left: 18px; }
        .job ul li { font-size: 10.5pt; color: #222; margin-bottom: 3px; line-height: 1.5; }

        /* Skills */
        .skills-grid { display: flex; flex-direction: column; gap: 4px; }
        .skill-row { display: flex; gap: 8px; font-size: 10.5pt; }
        .skill-label { font-weight: 700; min-width: 180px; color: #1a1a1a; flex-shrink: 0; }
        .skill-value { color: #333; }

        /* Education */
        .edu-item { margin-bottom: 12px; }
        .edu-header { display: flex; justify-content: space-between; align-items: baseline; }
        .edu-degree { font-weight: 700; font-size: 11pt; }
        .edu-dates { font-size: 10pt; color: #555; }
        .edu-school { font-size: 10pt; color: #444; margin-bottom: 3px; }
        .edu-notes { padding-left: 18px; }
        .edu-notes li { font-size: 10pt; color: #444; margin-bottom: 2px; }

        /* Recognition */
        .rec-item { display: flex; gap: 16px; margin-bottom: 5px; font-size: 10.5pt; }
        .rec-year { color: #777; min-width: 36px; }
        .rec-text { color: #222; }

        @media (max-width: 600px) {
          .download-bar { padding: 0 16px; gap: 8px; }
          .download-label { display: none; }
          .cv-sheet { padding: 24px 18px; margin: 60px auto 32px; }
          .cv-name { font-size: 17pt; }
          .cv-title { font-size: 11pt; }
          .job-header { flex-direction: column; gap: 1px; }
          .job-dates { font-size: 9.5pt; }
          .edu-header { flex-direction: column; gap: 1px; }
          .skill-row { flex-direction: column; gap: 1px; }
          .skill-label { min-width: unset; }
        }

        @media print {
          .download-bar { display: none !important; }
          body { background: #fff; }
          .cv-sheet {
            margin: 0;
            padding: 32px 40px;
            box-shadow: none;
            max-width: 100%;
          }
          @page { margin: 0; size: A4; }
        }
      `}</style>

      <DownloadBar />

      <div className="cv-sheet" id="cv-content">
        {/* Header */}
        <div style={{ marginBottom: 24 }}>
          <div className="cv-name">Brighton Tandabantu</div>
          <div className="cv-title">AI Engineer &amp; Founder</div>
          <div className="cv-contact">
            <span>(+27) 64 129 5093</span>
            <a href="mailto:brightontandabantu@gmail.com">brightontandabantu@gmail.com</a>
            <a href="https://www.linkedin.com/in/bthanda/" target="_blank" rel="noopener noreferrer">linkedin.com/in/bthanda</a>
            <a href="https://bthanda.vercel.app" target="_blank" rel="noopener noreferrer">bthanda.vercel.app</a>
          </div>
        </div>

        <hr className="full" />

        {/* Summary */}
        <section className="summary">
          <h2>Professional Summary</h2>
          <p>
            Production AI and software engineer with 4+ years of experience designing, building, and operating
            end-to-end data and AI pipelines in Python and TypeScript. Proven record of taking complex,
            multi-step AI workflows from prototype to production — including async pipeline orchestration,
            vector-indexed data systems, real-time inference APIs, and full observability stacks (structured
            logging, error tracking, performance monitoring, alerting). Hands-on experience with Azure
            (Functions, AKS, ACR, Application Insights, AD B2C), Docker, CI/CD, and cloud-native deployment.
            Currently co-founding AnchorBase (London) — an AI document search platform — and leading AgriData AI,
            running live government pilots within Zimbabwe&apos;s Ministry of Agriculture.
            Works AI-natively with agentic tooling (Claude, Cursor, Copilot, Antigravity) as core development workflow.
          </p>
        </section>

        <hr className="light" />

        {/* Work Experience */}
        <section>
          <h2>Work Experience</h2>

          <div className="job">
            <div className="job-header">
              <span className="job-title">Co-Founder &amp; AI Engineer</span>
              <span className="job-dates">Feb 2026 – Present</span>
            </div>
            <div className="job-org">AnchorBase · London, UK (Remote)</div>
            <ul>
              <li>Built and shipped an AI-powered document search platform for engineers working with codes, standards, and technical specifications — enabling natural language Q&amp;A with precise citations. Pivoted from Project Machine (Nov 2025) after deep work on document parsing and RAG pipelines revealed the bigger opportunity.</li>
              <li>Designed and implemented a full RAG pipeline: HyDE query expansion, embedding via Gemini gemini-embedding-001, semantic + keyword retrieval with RRF reranking, and hierarchical chunk expansion.</li>
              <li>Architected multi-LLM routing: xAI/Grok for document Q&amp;A; Gemini 2.5 Flash with Google Search grounding for internet-routed queries.</li>
              <li>Built streaming answer delivery via SSE with real-time source citation, follow-up question generation, and an admin observability dashboard.</li>
              <li>Implemented multi-step agent workflows: intent classification, query routing, context retrieval, answer generation, and follow-up suggestion — each step orchestrated as a discrete agent action with fallback handling.</li>
              <li>Stack: React + TypeScript (frontend), FastAPI + Python (backend), Pinecone (vector search), Supabase (Postgres + auth), Cloudflare R2 (storage).</li>
              <li>Onboarded 50+ organic users since launch; actively onboarding pilot partners.</li>
            </ul>
          </div>

          <div className="job">
            <div className="job-header">
              <span className="job-title">Founder &amp; AI Engineer</span>
              <span className="job-dates">2025 – Present</span>
            </div>
            <div className="job-org">AgriData AI · Zimbabwe</div>
            <ul>
              <li>Built an AI system for Zimbabwe&apos;s agricultural sector, processing farmer and extension officer queries via a WhatsApp-native interface.</li>
              <li>Deployed live pilots with the Migratory Pests &amp; Biosecurity Control (MPBC) team within Zimbabwe&apos;s Ministry of Agriculture — system has processed 5,000+ messages from 22+ extension officers.</li>
              <li>Running an active pilot with the Tobacco Research Board (Kutsaga); in contract deliberations with the Zimbabwe Sugarcane Association Experiment Station (ZSAES).</li>
              <li>Finalist, Kutsaga Innovation Challenge 2025.</li>
            </ul>
          </div>

          <div className="job">
            <div className="job-header">
              <span className="job-title">Co-Founder &amp; CEO</span>
              <span className="job-dates">Jun 2024 – Present</span>
            </div>
            <div className="job-org">AakiTech · Remote</div>
            <ul>
              <li>Founded and led AakiTech, building digital tools for African schools and small businesses in underserved, low-resource environments.</li>
              <li>Built and led a cross-functional team of 7 — developers, business operations, and growth specialists.</li>
              <li>Shipped multiple products across edtech and SME operations — including a platform now serving 1,000+ users, engineered for low-bandwidth, mobile-first environments.</li>
              <li>Selected: Mastercard FAST Build 2024. 2nd place, Unity Challenge 2025 (AL for Professionals). Finalist, Kutsaga Innovation Challenge 2025.</li>
            </ul>
          </div>

          <div className="job">
            <div className="job-header">
              <span className="job-title">Builder</span>
              <span className="job-dates">2026</span>
            </div>
            <div className="job-org">BOQ Generator · Remote</div>
            <ul>
              <li>Built an AI-powered Bill of Quantities platform for the Zambian construction market — upload a Scope of Work PDF, receive a structured and priced BOQ; or upload an unrated Excel BOQ and have AI fill Zambian market rates calibrated to province, site accessibility, labour source, and margin.</li>
              <li>Architected a 7-step async generation pipeline using Inngest to handle large documents beyond Vercel's serverless timeout limits: extract → structure → save → rate-fill → QA → save → notify.</li>
              <li>Built a vector-indexed rate library (pgvector) sourced from real Zambian construction BOQs, used to ground AI pricing with temporal rate anchors — rates carry <code>rate_date</code> for auditability.</li>
              <li>Implemented full payment gate via Stripe (dynamic pricing by BOQ size and item count), Google OAuth, in-browser BOQ editor with auto-save, Excel export in Zambian tender format, and a streaming AI edit assistant.</li>
              <li>Observability stack: Sentry (errors + session replay), PostHog (server events), structured JSON logging, Upstash Redis rate limiting, Inngest dashboard for per-step execution traces.</li>
              <li>Stack: Next.js 15, TypeScript, Supabase (Postgres + RLS), Gemini 2.5 Pro/Flash, Inngest, Stripe, Vercel.</li>
            </ul>
          </div>

          <div className="job">
            <div className="job-header">
              <span className="job-title">Software Consultant</span>
              <span className="job-dates">Sep 2023 – Jun 2024</span>
            </div>
            <div className="job-org">Kindred for Business · London (Remote)</div>
            <ul>
              <li>Led migration of multiple C# Azure Functions applications to .NET 8 LTS, ensuring zero-downtime transitions.</li>
              <li>Triaged and resolved backend bugs detected via Azure Function Monitor and Application Insights, improving system resilience.</li>
              <li>Collaborated with distributed service desk and engineering teams on backend stability and delivery.</li>
            </ul>
          </div>

          <div className="job">
            <div className="job-header">
              <span className="job-title">Software Developer</span>
              <span className="job-dates">2021 – Sep 2023</span>
            </div>
            <div className="job-org">Full Stack (Pty) Ltd · Cape Town</div>
            <ul>
              <li>Brokers Platform: Built a brokers management platform using OutSystems and ASP.NET Core; automated test suites with Selenium and Katalon.</li>
              <li>Mortgage Application Platform: Deployed application, SQL database, and storage on AWS; implemented gRPC/Proto Buffers for frontend-backend communication.</li>
              <li>Jupyter Data Science Portal: Developed a high-security data analysis portal — Angular frontend, ASP.NET Core + YARP middleware, customized JupyterHub on Azure Kubernetes Cluster with custom images on ACR.</li>
              <li>File Submission &amp; Review System: Led Umbraco 8 → 10 migration; integrated Azure AD B2C authentication and Azure Blob Storage; delivered within 6-month timeline.</li>
              <li>Phase II CMS: Contributed to Umbraco + ASP.NET project; managed deployment across dev, staging, and production; delivered with a 4-person team in 2 months.</li>
            </ul>
          </div>
        </section>

        <hr className="light" />

        {/* Skills */}
        <section>
          <h2>Skills</h2>
          <div className="skills-grid">
            <div className="skill-row"><span className="skill-label">AI &amp; ML Engineering</span><span className="skill-value">RAG pipelines, LLM integration, vector search (pgvector, Pinecone), embeddings, HyDE, prompt engineering, multi-step agent orchestration, model evaluation, OpenAI, Gemini, xAI/Grok</span></div>
            <div className="skill-row"><span className="skill-label">Languages</span><span className="skill-value">Python, TypeScript, C#, JavaScript, SQL</span></div>
            <div className="skill-row"><span className="skill-label">Pipeline &amp; Orchestration</span><span className="skill-value">Inngest (multi-step async pipelines), CI/CD (GitHub Actions, Azure DevOps, GitLab CI), batch + async job architecture, retry/recovery, event-driven workflows</span></div>
            <div className="skill-row"><span className="skill-label">Frameworks &amp; Libraries</span><span className="skill-value">FastAPI, Vercel AI SDK, ASP.NET Core, Next.js, React, Django, Entity Framework Core</span></div>
            <div className="skill-row"><span className="skill-label">Databases &amp; Storage</span><span className="skill-value">PostgreSQL, SQL Server, Supabase, Firebase, Pinecone, Azure Blob Storage, Cloudflare R2</span></div>
            <div className="skill-row"><span className="skill-label">Cloud &amp; Infrastructure</span><span className="skill-value">Microsoft Azure (Functions, AKS, ACR, AD B2C, Application Insights), AWS, Google Cloud, Docker, Docker Compose, Vercel, Fly.io</span></div>
            <div className="skill-row"><span className="skill-label">Observability &amp; Monitoring</span><span className="skill-value">Sentry (errors + session replay), PostHog, structured JSON logging, Upstash Redis (rate limiting), Azure Application Insights, health checks, alerting</span></div>
            <div className="skill-row"><span className="skill-label">Tools &amp; Practices</span><span className="skill-value">Git, GitHub, Azure DevOps, Jupyter, Scrum, Kanban, gRPC, Selenium</span></div>
          </div>
        </section>

        <hr className="light" />

        {/* Education */}
        <section>
          <h2>Education</h2>
          <div className="edu-item">
            <div className="edu-header">
              <span className="edu-degree">BSc Computer Science</span>
              <span className="edu-dates">2017 – 2021</span>
            </div>
            <div className="edu-school">University of Cape Town (UCT)</div>
            <ul className="edu-notes">
              <li>Mastercard Foundation Scholar (full scholarship)</li>
              <li>Chairperson, Space &amp; Astronomy Society (SpaceSoc)</li>
              <li>Co-Founder, SEDS South Africa — enrolled 3 universities; organized 10+ events nationally</li>
              <li>Keynote speaker, 4th SA-GEO National Symposium, CSIR (2022)</li>
              <li>Relevant electives: Statistics, Philosophy, Astronomy, African Studies</li>
            </ul>
          </div>
          <div className="edu-item">
            <div className="edu-header">
              <span className="edu-degree">O-Level &amp; A-Level (ZIMSEC)</span>
              <span className="edu-dates">2010 – 2015</span>
            </div>
            <div className="edu-school">Mt Selinda High School</div>
            <ul className="edu-notes">
              <li>Head Boy</li>
              <li>8 As and 1 B at O-Level</li>
              <li>Recipient, United States Achievers Program (USAP)</li>
            </ul>
          </div>
        </section>

        <hr className="light" />

        {/* Recognition */}
        <section>
          <h2>Recognition &amp; Awards</h2>
          <div className="rec-item"><span className="rec-year">2026</span><span className="rec-text">AIM Founding to Give 2026 Cohort — selected after multiple rigorous rounds</span></div>
          <div className="rec-item"><span className="rec-year">2025</span><span className="rec-text">Mastercard Foundation Scholars — Alumni Panellist</span></div>
          <div className="rec-item"><span className="rec-year">2025</span><span className="rec-text">Unity Challenge — 2nd Place (AL for Professionals)</span></div>
          <div className="rec-item"><span className="rec-year">2025</span><span className="rec-text">Kutsaga Innovation Challenge — Finalist</span></div>
          <div className="rec-item"><span className="rec-year">2024</span><span className="rec-text">Mastercard FAST Build — Recipient</span></div>
        </section>
      </div>
    </>
  );
}
