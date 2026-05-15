"use client";

import { useState } from "react";
import { generateDocx } from "@/lib/generateDocx";

function DownloadBar() {
  const [loadingDocx, setLoadingDocx] = useState(false);

  const downloadPdf = () => {
    window.print();
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
        <button onClick={downloadPdf} className="btn">
          Download PDF
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

      <div className="cv-sheet">
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
            AI engineer and founder with 4+ years of experience building and shipping full-stack software products.
            Deep hands-on expertise in RAG pipelines, LLM integration, vector search, and AI-powered SaaS.
            Currently co-founding AnchorBase — an AI document search platform for engineers — and leading
            AgriData AI, which is running live government pilots within Zimbabwe&apos;s Ministry of Agriculture.
            Proven record of taking products from zero to production, leading cross-functional teams, and
            securing recognition in competitive startup programs across Africa. Available for select
            freelance and contract engagements in AI engineering and full-stack development.
          </p>
        </section>

        <hr className="light" />

        {/* Work Experience */}
        <section>
          <h2>Work Experience</h2>

          <div className="job">
            <div className="job-header">
              <span className="job-title">Co-Founder &amp; AI Engineer</span>
              <span className="job-dates">Jan 2025 – Present</span>
            </div>
            <div className="job-org">AnchorBase · Remote</div>
            <ul>
              <li>Built and shipped an AI-powered document search platform for engineers working with codes, standards, and technical specifications — enabling natural language Q&amp;A with precise citations.</li>
              <li>Designed and implemented a full RAG pipeline: HyDE query expansion, embedding via Gemini gemini-embedding-001, semantic + keyword retrieval with RRF reranking, and hierarchical chunk expansion.</li>
              <li>Architected multi-LLM routing: xAI/Grok for document Q&amp;A; Gemini 2.5 Flash with Google Search grounding for internet-routed queries.</li>
              <li>Built streaming answer delivery via SSE with real-time source citation, follow-up question generation, and an admin observability dashboard.</li>
              <li>Stack: React + TypeScript (frontend), FastAPI + Python (backend), Pinecone (vector search), Supabase (Postgres + auth), Cloudflare R2 (storage).</li>
              <li>Onboarded 50+ organic users since launch; actively onboarding pilot partners.</li>
            </ul>
          </div>

          <div className="job">
            <div className="job-header">
              <span className="job-title">Founder &amp; AI Engineer</span>
              <span className="job-dates">2024 – Present</span>
            </div>
            <div className="job-org">AgriData AI · Zimbabwe</div>
            <ul>
              <li>Built an AI system for Zimbabwe&apos;s agricultural sector, processing farmer and extension officer queries via a WhatsApp-native interface.</li>
              <li>Deployed live pilots with the Migratory Pests &amp; Biosecurity Control (MPBC) team within Zimbabwe&apos;s Ministry of Agriculture — system has processed 5,000+ messages from 22+ extension officers.</li>
              <li>Running an active pilot with the Tobacco Research Board (Kutsaga); in contract deliberations with the Zimbabwe Society of Agricultural and Environmental Sciences (ZSAES).</li>
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
              <li>Tech-partnered a platform launch now serving 1,000+ users for an edtech startup, engineered for low-bandwidth, mobile-first environments.</li>
              <li>Designed and shipped Project PINDA — a digital inclusion initiative delivering recordkeeping, communication, and operational tools for SMEs and schools.</li>
              <li>Selected: Mastercard FAST Build 2024. 2nd place, Unity Challenge 2025 (AL for Professionals). Finalist, Kutsaga Innovation Challenge 2025.</li>
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
            <div className="skill-row"><span className="skill-label">AI &amp; Machine Learning</span><span className="skill-value">RAG pipelines, LLM integration, vector search, embeddings, HyDE, prompt engineering, OpenAI, Gemini, xAI/Grok, OpenRouter, ElevenLabs</span></div>
            <div className="skill-row"><span className="skill-label">Languages</span><span className="skill-value">Python, C#, TypeScript, JavaScript, Dart, SQL</span></div>
            <div className="skill-row"><span className="skill-label">Frameworks &amp; Libraries</span><span className="skill-value">FastAPI, ASP.NET Core, Next.js, React, Angular, Blazor, Flutter, Django, Entity Framework Core</span></div>
            <div className="skill-row"><span className="skill-label">Databases &amp; Storage</span><span className="skill-value">PostgreSQL, SQL Server, Supabase, Firebase, Pinecone, Azure Blob Storage, Cloudflare R2</span></div>
            <div className="skill-row"><span className="skill-label">Cloud &amp; Infrastructure</span><span className="skill-value">Microsoft Azure (Functions, AKS, ACR, AD B2C, Application Insights), AWS, Google Cloud, Docker, CI/CD, Vercel, Fly.io</span></div>
            <div className="skill-row"><span className="skill-label">Tools &amp; Practices</span><span className="skill-value">Git, GitHub, Azure DevOps, Scrum, Kanban, Jupyter, OutSystems, YARP, gRPC, Selenium, Katalon</span></div>
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
