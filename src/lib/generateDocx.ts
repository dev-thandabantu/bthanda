import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  TabStopType,
  TabStopPosition,
  UnderlineType,
} from "docx";
import { saveAs } from "file-saver";

const FONT = "Calibri";
const COLOR_DARK = "1a1a1a";
const COLOR_MID = "444444";
const COLOR_LIGHT = "777777";

function sectionHeading(text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({
        text: text.toUpperCase(),
        bold: true,
        size: 19,
        font: FONT,
        color: COLOR_DARK,
        characterSpacing: 60,
      }),
    ],
    spacing: { before: 200, after: 80 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 4, color: "cccccc", space: 4 },
    },
  });
}

function jobHeader(title: string, dates: string): Paragraph {
  return new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
    children: [
      new TextRun({ text: title, bold: true, size: 22, font: FONT, color: COLOR_DARK }),
      new TextRun({ text: "\t", font: FONT }),
      new TextRun({ text: dates, size: 20, font: FONT, color: COLOR_MID }),
    ],
    spacing: { before: 160, after: 20 },
  });
}

function jobOrg(text: string): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text, size: 20, font: FONT, color: COLOR_MID, italics: true })],
    spacing: { after: 40 },
  });
}

function bullet(text: string): Paragraph {
  return new Paragraph({
    bullet: { level: 0 },
    children: [new TextRun({ text, size: 21, font: FONT, color: COLOR_DARK })],
    spacing: { after: 40 },
  });
}

function skillRow(label: string, value: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: label + ": ", bold: true, size: 21, font: FONT, color: COLOR_DARK }),
      new TextRun({ text: value, size: 21, font: FONT, color: COLOR_MID }),
    ],
    spacing: { after: 40 },
  });
}

function eduHeader(degree: string, dates: string): Paragraph {
  return new Paragraph({
    tabStops: [{ type: TabStopType.RIGHT, position: TabStopPosition.MAX }],
    children: [
      new TextRun({ text: degree, bold: true, size: 22, font: FONT, color: COLOR_DARK }),
      new TextRun({ text: "\t", font: FONT }),
      new TextRun({ text: dates, size: 20, font: FONT, color: COLOR_MID }),
    ],
    spacing: { before: 120, after: 20 },
  });
}

function recItem(year: string, text: string): Paragraph {
  return new Paragraph({
    children: [
      new TextRun({ text: year + "  ", size: 21, font: FONT, color: COLOR_LIGHT }),
      new TextRun({ text, size: 21, font: FONT, color: COLOR_DARK }),
    ],
    spacing: { after: 40 },
  });
}

function divider(): Paragraph {
  return new Paragraph({
    children: [new TextRun({ text: "" })],
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 2, color: "dddddd", space: 2 },
    },
    spacing: { before: 120, after: 120 },
  });
}

export async function generateDocx() {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: { top: 720, bottom: 720, left: 864, right: 864 },
          },
        },
        children: [
          // ── Header ──
          new Paragraph({
            children: [
              new TextRun({
                text: "Brighton Tandabantu",
                bold: true,
                size: 44,
                font: FONT,
                color: COLOR_DARK,
              }),
            ],
            spacing: { after: 40 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "AI Engineer & Founder", size: 24, font: FONT, color: COLOR_MID }),
            ],
            spacing: { after: 80 },
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "(+27) 64 129 5093", size: 20, font: FONT, color: COLOR_MID }),
              new TextRun({ text: "  ·  ", size: 20, font: FONT, color: COLOR_LIGHT }),
              new TextRun({
                text: "brightontandabantu@gmail.com",
                size: 20,
                font: FONT,
                color: "1a5276",
                underline: { type: UnderlineType.SINGLE },
              }),
              new TextRun({ text: "  ·  ", size: 20, font: FONT, color: COLOR_LIGHT }),
              new TextRun({
                text: "linkedin.com/in/bthanda",
                size: 20,
                font: FONT,
                color: "1a5276",
                underline: { type: UnderlineType.SINGLE },
              }),
              new TextRun({ text: "  ·  ", size: 20, font: FONT, color: COLOR_LIGHT }),
              new TextRun({
                text: "bthanda.vercel.app",
                size: 20,
                font: FONT,
                color: "1a5276",
                underline: { type: UnderlineType.SINGLE },
              }),
            ],
            spacing: { after: 160 },
            border: {
              bottom: { style: BorderStyle.SINGLE, size: 8, color: COLOR_DARK, space: 6 },
            },
          }),

          // ── Summary ──
          sectionHeading("Professional Summary"),
          new Paragraph({
            children: [
              new TextRun({
                text: "AI engineer and founder with 4+ years of experience building and shipping full-stack software products. Deep hands-on expertise in RAG pipelines, LLM integration, vector search, and AI-powered SaaS. Currently co-founding AnchorBase — an AI document search platform for engineers — and leading AgriData AI, which is running live government pilots within Zimbabwe's Ministry of Agriculture. Proven record of taking products from zero to production, leading cross-functional teams, and securing recognition in competitive startup programs across Africa. Available for select freelance and contract engagements in AI engineering and full-stack development.",
                size: 21,
                font: FONT,
                color: COLOR_DARK,
              }),
            ],
            spacing: { after: 120 },
          }),

          divider(),

          // ── Work Experience ──
          sectionHeading("Work Experience"),

          jobHeader("Co-Founder & AI Engineer", "Jan 2025 – Present"),
          jobOrg("AnchorBase · Remote"),
          bullet("Built and shipped an AI-powered document search platform for engineers working with codes, standards, and technical specifications — enabling natural language Q&A with precise citations."),
          bullet("Designed and implemented a full RAG pipeline: HyDE query expansion, embedding via Gemini gemini-embedding-001, semantic + keyword retrieval with RRF reranking, and hierarchical chunk expansion."),
          bullet("Architected multi-LLM routing: xAI/Grok for document Q&A; Gemini 2.5 Flash with Google Search grounding for internet-routed queries."),
          bullet("Built streaming answer delivery via SSE with real-time source citation, follow-up question generation, and an admin observability dashboard."),
          bullet("Stack: React + TypeScript (frontend), FastAPI + Python (backend), Pinecone (vector search), Supabase (Postgres + auth), Cloudflare R2 (storage)."),
          bullet("Onboarded 50+ organic users since launch; actively onboarding pilot partners."),

          jobHeader("Founder & AI Engineer", "2024 – Present"),
          jobOrg("AgriData AI · Zimbabwe"),
          bullet("Built an AI system for Zimbabwe's agricultural sector, processing farmer and extension officer queries via a WhatsApp-native interface."),
          bullet("Deployed live pilots with the Migratory Pests & Biosecurity Control (MPBC) team within Zimbabwe's Ministry of Agriculture — system has processed 5,000+ messages from 22+ extension officers."),
          bullet("Running an active pilot with the Tobacco Research Board (Kutsaga); in contract deliberations with the Zimbabwe Society of Agricultural and Environmental Sciences (ZSAES)."),
          bullet("Finalist, Kutsaga Innovation Challenge 2025."),

          jobHeader("Co-Founder & CEO", "Jun 2024 – Present"),
          jobOrg("AakiTech · Remote"),
          bullet("Founded and led AakiTech, building digital tools for African schools and small businesses in underserved, low-resource environments."),
          bullet("Built and led a cross-functional team of 7 — developers, business operations, and growth specialists."),
          bullet("Tech-partnered a platform launch now serving 1,000+ users for an edtech startup, engineered for low-bandwidth, mobile-first environments."),
          bullet("Designed and shipped Project PINDA — a digital inclusion initiative delivering recordkeeping, communication, and operational tools for SMEs and schools."),
          bullet("Selected: Mastercard FAST Build 2024. 2nd place, Unity Challenge 2025 (AL for Professionals). Finalist, Kutsaga Innovation Challenge 2025."),

          jobHeader("Software Consultant", "Sep 2023 – Jun 2024"),
          jobOrg("Kindred for Business · London (Remote)"),
          bullet("Led migration of multiple C# Azure Functions applications to .NET 8 LTS, ensuring zero-downtime transitions."),
          bullet("Triaged and resolved backend bugs detected via Azure Function Monitor and Application Insights, improving system resilience."),
          bullet("Collaborated with distributed service desk and engineering teams on backend stability and delivery."),

          jobHeader("Software Developer", "2021 – Sep 2023"),
          jobOrg("Full Stack (Pty) Ltd · Cape Town"),
          bullet("Brokers Platform: Built a brokers management platform using OutSystems and ASP.NET Core; automated test suites with Selenium and Katalon."),
          bullet("Mortgage Application Platform: Deployed application, SQL database, and storage on AWS; implemented gRPC/Proto Buffers for frontend-backend communication."),
          bullet("Jupyter Data Science Portal: Developed a high-security data analysis portal — Angular frontend, ASP.NET Core + YARP middleware, customized JupyterHub on Azure Kubernetes Cluster with custom images on ACR."),
          bullet("File Submission & Review System: Led Umbraco 8 → 10 migration; integrated Azure AD B2C and Azure Blob Storage; delivered within 6-month timeline."),
          bullet("Phase II CMS: Contributed to Umbraco + ASP.NET project; managed deployment across dev, staging, and production; delivered with a 4-person team in 2 months."),

          divider(),

          // ── Skills ──
          sectionHeading("Skills"),
          skillRow("AI & Machine Learning", "RAG pipelines, LLM integration, vector search, embeddings, HyDE, prompt engineering, OpenAI, Gemini, xAI/Grok, OpenRouter, ElevenLabs"),
          skillRow("Languages", "Python, C#, TypeScript, JavaScript, Dart, SQL"),
          skillRow("Frameworks & Libraries", "FastAPI, ASP.NET Core, Next.js, React, Angular, Blazor, Flutter, Django, Entity Framework Core"),
          skillRow("Databases & Storage", "PostgreSQL, SQL Server, Supabase, Firebase, Pinecone, Azure Blob Storage, Cloudflare R2"),
          skillRow("Cloud & Infrastructure", "Microsoft Azure (Functions, AKS, ACR, AD B2C, Application Insights), AWS, Google Cloud, Docker, CI/CD, Vercel, Fly.io"),
          skillRow("Tools & Practices", "Git, GitHub, Azure DevOps, Scrum, Kanban, Jupyter, OutSystems, YARP, gRPC, Selenium, Katalon"),

          divider(),

          // ── Education ──
          sectionHeading("Education"),

          eduHeader("BSc Computer Science", "2017 – 2021"),
          jobOrg("University of Cape Town (UCT)"),
          bullet("Mastercard Foundation Scholar (full scholarship)"),
          bullet("Chairperson, Space & Astronomy Society (SpaceSoc)"),
          bullet("Co-Founder, SEDS South Africa — enrolled 3 universities; organized 10+ events nationally"),
          bullet("Keynote speaker, 4th SA-GEO National Symposium, CSIR (2022)"),
          bullet("Relevant electives: Statistics, Philosophy, Astronomy, African Studies"),

          eduHeader("O-Level & A-Level (ZIMSEC)", "2010 – 2015"),
          jobOrg("Mt Selinda High School"),
          bullet("Head Boy"),
          bullet("8 As and 1 B at O-Level"),
          bullet("Recipient, United States Achievers Program (USAP)"),

          divider(),

          // ── Recognition ──
          sectionHeading("Recognition & Awards"),
          recItem("2026", "AIM Founding to Give 2026 Cohort — selected after multiple rigorous rounds"),
          recItem("2025", "Mastercard Foundation Scholars — Alumni Panellist"),
          recItem("2025", "Unity Challenge — 2nd Place (AL for Professionals)"),
          recItem("2025", "Kutsaga Innovation Challenge — Finalist"),
          recItem("2024", "Mastercard FAST Build — Recipient"),
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);
  saveAs(blob, "Brighton Tandabantu - CV.docx");
}
