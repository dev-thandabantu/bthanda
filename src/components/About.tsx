const skills = [
  "C#", ".NET / ASP.NET Core", "Python", "FastAPI",
  "TypeScript", "React", "Next.js", "Angular",
  "SQL", "PostgreSQL", "Supabase",
  "Microsoft Azure", "AWS", "Google Cloud",
  "Docker", "CI/CD", "Azure Functions",
  "Flutter", "Firebase",
  "AI / LLM integration", "RAG pipelines", "Vector search",
  "Scrum", "Kanban",
];

export default function About() {
  return (
    <section id="about" className="py-20 border-t border-white/8">
      <h2 className="text-xs text-white/30 uppercase tracking-widest mb-10">About</h2>
      <div className="flex flex-col gap-8 text-white/60 text-sm leading-relaxed max-w-xl">
        <p>
          I grew up in Matezwa, Chipinge — rural Zimbabwe. Long walks to school, early responsibility,
          financial instability. I became head boy. I was meant for MIT. Structural realities had
          other plans, and I ended up at the University of Cape Town, where I graduated with a BSc
          in Computer Science on a Mastercard Foundation scholarship.
        </p>
        <p>
          Since then: two years of production software delivery at Full Stack (Pty) Ltd in Cape Town,
          a stint as a software consultant for a London firm, and then the leap into founding.
          AakiTech. AgriData AI. Now AnchorBase.
        </p>
        <p>
          I think in systems. I like retrospectives. I move fast and care about what I ship.
          People who&apos;ve worked with me describe the environment as psychologically safe —
          intense but calm. I care about impact, not optics.
        </p>
        <p>
          Outside of work: six years of serious mindfulness practice, philosophy, effective altruism,
          and a quiet mission to change the trajectory of my family&apos;s lineage.
        </p>

        <div className="pt-4">
          <p className="text-xs text-white/25 uppercase tracking-widest mb-4">Stack</p>
          <div className="flex flex-wrap gap-2">
            {skills.map((s) => (
              <span
                key={s}
                className="text-xs px-2.5 py-1 rounded-full border border-white/10 text-white/40"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        <div className="pt-2">
          <p className="text-xs text-white/25 uppercase tracking-widest mb-4">Education</p>
          <div className="flex flex-col gap-3">
            <div>
              <p className="text-white/70 font-medium">BSc Computer Science</p>
              <p className="text-white/35">University of Cape Town · 2017 – 2021 · Mastercard Foundation Scholar</p>
            </div>
            <div>
              <p className="text-white/70 font-medium">O-Level & A-Level (ZIMSEC)</p>
              <p className="text-white/35">Mt Selinda High · 2010 – 2015 · Head Boy · 8 As at O-Level · USAP recipient</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
