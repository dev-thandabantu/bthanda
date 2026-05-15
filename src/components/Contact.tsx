export default function Contact() {
  return (
    <section id="contact" className="py-20 border-t border-white/8">
      <h2 className="text-xs text-white/30 uppercase tracking-widest mb-10">Contact</h2>
      <div className="max-w-md">
        <p className="text-white/60 text-sm leading-relaxed mb-8">
          I take on select freelance and contract work — AI integration, full-stack development,
          technical consulting for startups building in or for Africa. If you have something
          interesting, reach out.
        </p>
        <div className="flex flex-col gap-4">
          <a
            href="/cv.html"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 hover:border-white/25 transition-all"
          >
            <span className="text-sm text-white/60 group-hover:text-white transition-colors">
              View CV
            </span>
            <span className="text-white/25 group-hover:text-white/60 transition-colors text-sm">↗</span>
          </a>
          <a
            href="mailto:brightontandabantu@gmail.com"
            className="group flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 hover:border-white/25 transition-all"
          >
            <span className="text-sm text-white/60 group-hover:text-white transition-colors">
              brightontandabantu@gmail.com
            </span>
            <span className="text-white/25 group-hover:text-white/60 transition-colors text-sm">→</span>
          </a>
          <a
            href="https://www.linkedin.com/in/bthanda/"
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center justify-between px-4 py-3 rounded-xl border border-white/10 hover:border-white/25 transition-all"
          >
            <span className="text-sm text-white/60 group-hover:text-white transition-colors">
              linkedin.com/in/bthanda
            </span>
            <span className="text-white/25 group-hover:text-white/60 transition-colors text-sm">↗</span>
          </a>
        </div>
      </div>
      <p className="text-white/15 text-xs mt-16">
        © {new Date().getFullYear()} Brighton Tandabantu
      </p>
    </section>
  );
}
