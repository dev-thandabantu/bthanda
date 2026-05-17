const projects = [
  {
    name: "AnchorBase",
    url: "https://anchorbase.xyz",
    role: "Co-founder & builder",
    period: "Feb 2026 – present",
    description:
      "AI-powered document search for engineers buried in codes, standards, and technical specs. Upload PDFs, ask natural language questions, get precise answers with citations. Pivoted from Project Machine (Nov 2025) after deep work on document parsing and RAG pipelines revealed the bigger opportunity. Built with React, FastAPI, Pinecone, xAI/Grok, Gemini, and Supabase. Actively onboarding pilot partners.",
    tags: ["AI", "RAG", "FastAPI", "React", "Pinecone", "SaaS", "Document Parsing"],
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
      "SaaS tool that generates and prices Bills of Quantities from construction documents using AI. Full payment flow via Stripe. Built with Next.js, Gemini, and Supabase.",
    tags: ["AI", "Construction", "Next.js", "Stripe", "SaaS"],
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
