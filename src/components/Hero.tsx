export default function Hero() {
  return (
    <section className="pt-24 pb-20">
      <p className="text-sm text-white/40 mb-4 tracking-wide uppercase">
        Zimbabwe → Cape Town → The world
      </p>
      <h1 className="text-4xl sm:text-5xl font-semibold tracking-tight text-white leading-tight mb-6">
        Brighton Tandabantu
      </h1>
      <p className="text-lg text-white/60 leading-relaxed max-w-xl mb-10">
        Software engineer and founder. I build AI-powered products that solve real problems —
        currently shipping{" "}
        <a
          href="https://anchorbase.xyz"
          target="_blank"
          rel="noopener noreferrer"
          className="text-white/90 underline underline-offset-4 decoration-white/20 hover:decoration-white/60 transition-all"
        >
          AnchorBase
        </a>{" "}
        and running pilots with Zimbabwe&apos;s Ministry of Agriculture via AgriData AI.
        Available for select freelance and contract engagements.
      </p>
      <div className="flex flex-wrap gap-3">
        <a
          href="#contact"
          className="px-4 py-2 rounded-full bg-white text-black text-sm font-medium hover:bg-white/90 transition-colors"
        >
          Work with me
        </a>
        <a
          href="#work"
          className="px-4 py-2 rounded-full border border-white/15 text-white/70 text-sm hover:border-white/30 hover:text-white transition-all"
        >
          See my work
        </a>
        <a
          href="https://www.linkedin.com/in/bthanda/"
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 rounded-full border border-white/15 text-white/70 text-sm hover:border-white/30 hover:text-white transition-all"
        >
          LinkedIn
        </a>
      </div>
    </section>
  );
}
