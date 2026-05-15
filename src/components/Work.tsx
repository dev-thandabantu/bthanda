const projects = [
  {
    name: "AnchorBase",
    url: "https://anchorbase.xyz",
    role: "Co-founder & builder",
    period: "2025 – present",
    description:
      "AI-powered document search for engineers buried in codes, standards, and technical specs. Upload PDFs, ask natural language questions, get precise answers with citations. Built with React, FastAPI, Pinecone, xAI/Grok, Gemini, and Supabase. Near launch — actively onboarding pilot partners.",
    tags: ["AI", "RAG", "FastAPI", "React", "Pinecone", "SaaS"],
  },
  {
    name: "AgriData AI",
    url: null,
    role: "Founder",
    period: "2024 – present",
    description:
      "AI system for Zimbabwe's agricultural sector. Currently running pilots with the Tobacco Research Board (Kutsaga), the Migratory Pests & Biosecurity Control team within the Ministry of Agriculture, and in active contract deliberations with ZSAES.",
    tags: ["AI", "Agriculture", "Zimbabwe", "Government"],
  },
  {
    name: "AakiTech",
    url: null,
    role: "Co-founder & CEO",
    period: "2024 – present",
    description:
      "Venture building digital tools for African schools and small businesses. Launched Project PINDA for SME operations. Built and led a cross-functional team. Tech-partnered a platform now serving 1,000+ users for an edtech startup. Recipients: Mastercard FAST Build 2024, Unity Challenge 2nd place 2025, Kutsaga Innovation Challenge finalist.",
    tags: ["Founder", "Edtech", "Africa", "Team leadership"],
  },
  {
    name: "BOQ Generator",
    url: null,
    role: "Builder",
    period: "2025",
    description:
      "SaaS tool that generates and prices Bills of Quantities from construction documents using AI. Full payment flow via Stripe. Built with Next.js, Gemini, and Supabase.",
    tags: ["AI", "Construction", "Next.js", "Stripe", "SaaS"],
  },
  {
    name: "Auto Tuck Shop",
    url: null,
    role: "Builder",
    period: "2025",
    description:
      "WhatsApp AI assistant for Zimbabwean tuckshop owners. Owners send voice or text messages about sales — the bot records inventory, tracks revenue, and surfaces insights. Built with Django, Meta WhatsApp Business API, OpenRouter (Gemini), and ElevenLabs.",
    tags: ["AI", "WhatsApp", "Django", "Zimbabwe", "Voice"],
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
              <div className="flex items-baseline gap-3">
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
