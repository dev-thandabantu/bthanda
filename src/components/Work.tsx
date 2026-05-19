const projects = [
  {
    name: "AnchorBase",
    url: "https://anchorbase.xyz",
    role: "Co-founder & builder",
    period: "Feb 2026 – present",
    description:
      "AI-powered document search for engineers buried in codes, standards, and technical specs. Upload PDFs, ask natural language questions, get precise answers with citations. Pivoted from Project Machine after the file-parsing and AI summarization work revealed the bigger opportunity. Built with React, FastAPI, Pinecone, xAI/Grok, Gemini, and Supabase. Actively onboarding pilot partners.",
    tags: ["AI", "RAG", "FastAPI", "React", "Pinecone", "SaaS", "Document Parsing"],
  },
  {
    name: "Project Machine",
    url: "https://the-project-machine-inky.vercel.app/",
    role: "Co-founder & builder",
    period: "Nov 2025 – Jan 2026",
    description:
      "AI-powered visual project management SaaS — canvas-based task planning (ReactFlow) with an AI chat assistant, multi-user collaboration, and file upload with AI summarization. Core hypothesis: planning should be voice-first — implemented using OpenAI Realtime API (WebRTC) so users could speak to an AI that manipulated the canvas in real time. Built the full backend: 16-table PostgreSQL schema, 31+ REST endpoints (projects, tasks, subtasks, comments, assignments, canvas snapshots, collaborators, file parsing, AI chat, Excel export), RLS policies, 107 tests, and Swagger/OpenAPI docs. Co-built with a frontend collaborator. Shelved Jan 2026 when the document parsing and AI summarization work pointed toward a clearer, deeper problem — which became AnchorBase.",
    tags: ["AI", "Voice AI", "OpenAI Realtime API", "Next.js", "TypeScript", "Supabase", "ReactFlow", "SaaS"],
  },
  {
    name: "AgriData AI",
    url: "https://agridata-ai.vercel.app/",
    role: "Founder",
    period: "2025 – present",
    description:
      "AI system for Zimbabwe's agricultural sector. Currently running pilots with the Tobacco Research Board (Kutsaga), the Migratory Pests & Biosecurity Control team within the Ministry of Agriculture, and in active contract deliberations with the Zimbabwe Sugarcane Association Experiment Station (ZSAES).",
    tags: ["AI", "Agriculture", "Zimbabwe", "Government"],
  },
  {
    name: "AakiTech",
    url: "https://aakitech.com",
    role: "Co-founder & CEO",
    period: "2024 – present",
    description:
      "Venture building digital tools for African schools and small businesses in underserved, low-resource environments. Led a cross-functional team of 7 and shipped multiple products across edtech and SME operations — including a platform now serving 1,000+ users built for low-bandwidth, mobile-first environments. Recipients: Mastercard FAST Build 2024, Unity Challenge 2nd place 2025, Kutsaga Innovation Challenge finalist.",
    tags: ["Founder", "Edtech", "Africa", "Team leadership"],
  },
  {
    name: "BOQ Generator",
    url: "https://boq.aakitech.com",
    role: "Builder",
    period: "2026",
    description:
      "AI-powered BOQ platform for the Zambian construction market. Upload a Scope of Work PDF and receive a structured, priced Bill of Quantities — or upload an unrated Excel BOQ and have AI fill in Zambian market rates calibrated to province, site accessibility, and margin. Generation runs as a 7-step async pipeline (Inngest) to handle large documents beyond serverless limits. Rates are grounded by a vector-indexed library of real Zambian construction data. Full payment gate via Stripe, Google OAuth, in-browser BOQ editor with auto-save, Excel export in Zambian tender format, and AI edit assistant. Built with Next.js, Gemini 2.5, Supabase, Inngest, Stripe, PostHog, and Sentry.",
    tags: ["AI", "Construction", "Zambia", "Next.js", "Stripe", "Inngest", "RAG", "SaaS"],
  },
  {
    name: "Auto Tuck Shop",
    url: null,
    role: "Builder",
    period: "2026",
    description:
      "WhatsApp AI assistant for Zimbabwean tuckshop owners. Owners send voice or text messages about sales — the bot records inventory, tracks revenue, and surfaces insights. Built with Django, Meta WhatsApp Business API, OpenRouter (Gemini), and ElevenLabs.",
    tags: ["AI", "WhatsApp", "Django", "Zimbabwe", "Voice"],
  },
  {
    name: "Living Portraits",
    url: null,
    role: "Builder",
    period: "2026 – present",
    description:
      "A private app built for two users — me and my partner. We each build an evolving portrait of the other from our own point of view, then interact with a simulation of that portrait to test its accuracy. On top of that: a shared financial advisor that knows both of us, tracks our income and spending in rands, and gives grounded, context-aware advice. Not a product. A tool we actually live inside.",
    tags: ["AI", "Agents", "Personal", "Next.js", "OpenAI", "Gemini"],
  },
];

export default function Work() {
  return (
    <section id="work" className="py-20 border-t border-white/8">
      <h2 className="text-xs text-white/30 uppercase tracking-widest mb-10">Work</h2>
      <div className="flex flex-col gap-12">
        {projects.map((p) => (
          <div key={p.name} className="group">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div>
                <div className="flex items-baseline gap-3 flex-wrap">
                  {p.url ? (
                    <a
                      href={p.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-lg font-medium text-white hover:text-white/70 transition-colors"
                    >
                      {p.name} ↗
                    </a>
                  ) : (
                    <span className="text-lg font-medium text-white">{p.name}</span>
                  )}
                  <span className="text-sm text-white/30">{p.role}</span>
                </div>
              </div>
              <span className="text-sm text-white/25 shrink-0">{p.period}</span>
            </div>
            <p className="text-white/55 leading-relaxed text-sm mb-3">{p.description}</p>
            <div className="flex flex-wrap gap-2">
              {p.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs px-2 py-0.5 rounded-full border border-white/10 text-white/35"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
