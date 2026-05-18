export default function ChallengeBlock() {
  return (
    <div className="relative rounded-2xl border border-white/[0.08] overflow-hidden" style={{ background: '#0d0d10' }}>
      {/* Accent line */}
      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, #eab30840, #818cf840, transparent)' }} />

      <div className="px-8 py-12 max-w-2xl">
        <p className="text-[10px] uppercase tracking-widest text-white/20 mb-6">The challenge</p>

        <h2 className="text-2xl sm:text-3xl font-medium text-white/90 leading-snug mb-8">
          My family is offering land.
        </h2>

        <div className="space-y-4 text-sm leading-relaxed text-white/50">
          <p>
            Not a metaphor. Actual land in Chifiti, Mozambique — where my grandfather is chief,
            and his father was chief before him.
          </p>
          <p>
            I&apos;ve been at this for a while now. Two attempts documented above. Neither solved the core
            problem: both my grandfathers had multiple wives <em className="text-white/70">simultaneously</em>.
            Not sequentially — simultaneously. Every genealogy library I&apos;ve tried quietly assumes
            that doesn&apos;t happen. The{' '}
            <a href="https://en.wikipedia.org/wiki/GEDCOM" target="_blank" rel="noopener noreferrer"
              className="text-white/40 underline underline-offset-2 hover:text-white/70 transition-colors">
              GEDCOM standard
            </a>
            {' '}— the industry format used by Ancestry and MyHeritage — only supports one husband
            and one wife per family record. My family requires five such records just for one grandfather.
          </p>
          <p>
            The challenge: render this family correctly. All 218 of us. Five wives on the maternal side,
            three on the paternal. Children belonging to specific wives, not just to a grandfather.
            Connectors that actually make sense.
          </p>
        </div>

        <a
          href="https://github.com/dev-thandabantu/family-tree-challenge"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-8 px-5 py-2.5 rounded-full border border-white/15 text-sm text-white/60 hover:text-white/90 hover:border-white/30 transition-all"
        >
          View the open challenge on GitHub
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 10L10 2M10 2H4M10 2v6" />
          </svg>
        </a>

        <p className="mt-6 text-[11px] text-white/20 leading-relaxed">
          I&apos;ve never been to Chifiti. But I&apos;m told it&apos;s beautiful.
        </p>

        <div className="mt-8 pt-6 border-t border-white/[0.06] space-y-2 text-[11px] text-white/30 leading-relaxed">
          <p className="text-white/40 text-xs">The prize (updated, because why not):</p>
          <ul className="space-y-1.5 text-white/25">
            <li>→ Land in Chifiti, Mozambique (the original offer, still on the table)</li>
            <li>→ The biggest family party you&apos;ve ever been to — 218 people, proper food, proper music</li>
            <li>→ I&apos;m going to try to get{' '}
              <a href="https://www.youtube.com/@SonnyDickson" target="_blank" rel="noopener noreferrer"
                className="text-white/40 underline underline-offset-2 hover:text-white/60 transition-colors">
                Sunny
              </a>
              {' '}(the guy who travels the world eating everything) to come eat with us. No promises. High ambition.</li>
            <li>→ I&apos;m also going to try to get MrBeast involved somehow. I don&apos;t know how yet. It&apos;ll come to me.</li>
          </ul>
          <p className="text-white/15 pt-2">
            Prize subject to Brighton having recently confirmed his grandfather&apos;s brother is still in charge of land allocation.
            Family party subject to everyone actually showing up, which historically has not been a problem.
          </p>
        </div>
      </div>
    </div>
  )
}
