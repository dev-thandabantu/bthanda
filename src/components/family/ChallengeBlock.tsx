export default function ChallengeBlock() {
  return (
    <div className="relative rounded-2xl border border-white/[0.08] overflow-hidden" style={{ background: '#0d0d10' }}>
      <div className="h-px w-full" style={{ background: 'linear-gradient(90deg, #eab30840, #818cf840, transparent)' }} />

      <div className="px-8 py-12 max-w-2xl">
        <p className="text-[10px] uppercase tracking-widest text-white/20 mb-6">The open challenge</p>

        <h2 className="text-2xl sm:text-3xl font-medium text-white/90 leading-snug mb-8">
          The rendering is solved.<br />
          <span className="text-white/40">The data problem isn&apos;t.</span>
        </h2>

        <div className="space-y-4 text-sm leading-relaxed text-white/50">
          <p>
            Five attempts to get this visualisation right are documented above. Attempt 5 finally solved
            the rendering — custom layout engine, no library assumptions, children correctly grouped
            under their specific mother rather than just their grandfather.
          </p>
          <p>
            But 218 people is not the real number. Every person in this record has their own branches
            I haven&apos;t traced. Each of those 218 has parents, siblings, children, cousins I don&apos;t
            know yet. The actual family is somewhere north of a thousand. Probably more. I don&apos;t know.
            That&apos;s the point.
          </p>
          <p>
            The harder problem: my family isn&apos;t on GitHub. They&apos;re on WhatsApp and TikTok,
            mostly in Zimbabwe and South Africa, some in Mozambique. There&apos;s no web form they&apos;re
            going to fill out. The gap between what&apos;s documented here and what actually exists
            is a data pipeline problem disguised as a family history problem.
          </p>
          <p className="text-white/35">
            The challenge: build the thing that closes that gap. Something that lets a cousin in Mutare
            send a voice note or a text and have it land correctly in this record. Whatever form that takes.
          </p>
        </div>

        <a
          href="https://github.com/dev-thandabantu/family-tree-challenge"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-8 px-5 py-2.5 rounded-full border border-white/15 text-sm text-white/60 hover:text-white/90 hover:border-white/30 transition-all"
        >
          View the challenge on GitHub
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2 10L10 2M10 2H4M10 2v6" />
          </svg>
        </a>

        <p className="mt-6 text-[11px] text-white/20 leading-relaxed">
          I&apos;ve never been to Chifiti. But I&apos;m told it&apos;s beautiful.
        </p>

        <div className="mt-8 pt-6 border-t border-white/[0.06] space-y-2 text-[11px] text-white/30 leading-relaxed">
          <p className="text-white/40 text-xs">The prize:</p>
          <ul className="space-y-1.5 text-white/25">
            <li>→ Land in Chifiti, Mozambique — actual land, where my grandfather&apos;s brother is chief</li>
            <li>→ The biggest family party you&apos;ve ever been to. 218 people minimum, probably more by the time this gets solved. Proper food, proper music.</li>
            <li>→ I&apos;m going to try to get{' '}
              <a href="https://www.youtube.com/@BestEverFoodReviewShow" target="_blank" rel="noopener noreferrer"
                className="text-white/40 underline underline-offset-2 hover:text-white/60 transition-colors">
                Sonny Side
              </a>
              {' '}to come eat with us. No promises. High ambition.</li>
            <li>→ Also going to try to get MrBeast involved somehow. No plan yet. It&apos;ll come to me.</li>
          </ul>
          <p className="text-white/15 pt-2">
            Land allocation subject to confirming his grandfather&apos;s brother is still running things in Chifiti.
            Family party subject to everyone showing up, which historically has not been a problem.
          </p>
        </div>

        {/* ── Creator pitch ── */}
        <div className="mt-10 pt-8 border-t border-white/[0.06]">
          <p className="text-[10px] uppercase tracking-widest text-white/20 mb-5">If you make things for the internet</p>

          <div className="space-y-4 text-sm leading-relaxed text-white/45">
            <p>
              This is a real story with a real arc: a family spread across three countries, two grandfathers
              with eight wives between them, a chieftaincy in Mozambique nobody talks about, and a
              grandson in Cape Town who built a custom genealogy renderer because every existing tool
              quietly breaks on polygamous family structures.
            </p>
            <p>
              The video writes itself. The party already exists — it just hasn&apos;t happened yet.
              The land in Chifiti is real. The 218 people (and counting) are real.
              The tech angle is real — six documented attempts at a layout algorithm that can handle
              a family that looks nothing like a binary tree.
            </p>
            <p className="text-white/30">
              If you&apos;re a creator — or you&apos;re with one — and this feels like something:
            </p>
          </div>

          <a
            href="mailto:brightontandabantu@gmail.com?subject=Family%20tree%20%2F%20Chifiti"
            className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-full border border-white/15 text-sm text-white/60 hover:text-white/90 hover:border-white/30 transition-all"
          >
            Get in touch
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M2 10L10 2M10 2H4M10 2v6" />
            </svg>
          </a>

          <p className="mt-4 text-[11px] text-white/15 leading-relaxed">
            Especially if your partner works in tech and you&apos;ve been looking for a reason to go to Zimbabwe.
          </p>
        </div>

      </div>
    </div>
  )
}
