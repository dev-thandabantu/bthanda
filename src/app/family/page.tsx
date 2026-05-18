import type { Metadata } from 'next'
import FamilyStats from '@/components/FamilyStats'
import Attempt1Loader from '@/components/family/attempts/attempt-1-react-d3-tree/Loader'
import Attempt2Loader from '@/components/family/attempts/attempt-2-family-chart/Loader'
import AttemptSection from '@/components/family/AttemptSection'

export const metadata: Metadata = {
  title: 'Family — Brighton Tandabantu',
  description:
    'An interactive map of my extended family across Zimbabwe, South Africa, and Mozambique. A living document built to preserve oral history before it disappears.',
  robots: { index: true, follow: true },
}

export default function FamilyPage() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white/60">
      <div className="max-w-[1600px] mx-auto px-6 py-20">

        {/* ── Header ── */}
        <div className="mb-16 max-w-2xl">
          <p className="text-xs tracking-widest text-white/25 uppercase mb-6">Family</p>
          <h1 className="text-3xl sm:text-4xl font-medium text-white/90 leading-snug mb-6">
            I stopped counting cousins somewhere around 80.
            <br />
            <span className="text-white/40">That&apos;s when I started building this.</span>
          </h1>
          <div className="space-y-4 text-sm leading-relaxed text-white/55">
            <p>
              My family spans Zimbabwe, South Africa, and Mozambique — across borders that were drawn
              through our land, not around it. My maternal grandfather Ifraim Musabani was a sangoma with five wives.
              My paternal grandfather Wilson Maphutukezi was a traditional healer with three.
              His brother succeeded their father as Chief of Chifiti, Mozambique — that chieftaincy is ours.
            </p>
            <p>
              This is a living document. Oral history has gaps — names misremembered, branches
              undocumented, elders not yet consulted. I&apos;m adding to it as I learn more.
            </p>
          </div>
          <div className="mt-8">
            <FamilyStats />
          </div>
        </div>

        {/* ── The challenge ── */}
        <div className="mb-20 max-w-2xl">
          <p className="text-xs tracking-widest text-white/20 uppercase mb-4">The challenge</p>
          <div className="space-y-3 text-sm leading-relaxed text-white/45">
            <p>
              Standard genealogy tools assume nuclear, Western family structures — one father, one mother,
              a tidy binary tree. That assumption breaks immediately against my family.
            </p>
            <p>
              Both grandfathers had multiple wives. Wilson Maphutukezi had three, with children born across
              Zimbabwe and Mozambique. Ifraim Musabani had five. That&apos;s not a tree — it&apos;s a graph.
              Every genealogy library I&apos;ve tried quietly panics at it.
            </p>
            <p>
              This page is a running experiment. Each attempt below is a real try at solving the
              visualisation problem. I&apos;m documenting what worked, what didn&apos;t, and what I learned.
              Eventually one of them — or something I haven&apos;t built yet — will be the answer.
            </p>
          </div>
        </div>

        {/* ── Attempts ── */}
        <div className="space-y-24">

          <AttemptSection
            number={1}
            title="react-d3-tree — ego-centered model"
            status="abandoned"
            verdict="Two separate mistakes, compounding each other"
            what={<>
              Brighton at the center, ancestors radiating outward as &ldquo;children&rdquo; in the data model.
              Built on <a href="https://github.com/bkrem/react-d3-tree" target="_blank" rel="noopener noreferrer">react-d3-tree</a>,
              which the library itself describes as a general-purpose hierarchical renderer — it lists family trees as one example
              alongside org charts and file directories, with no genealogy-specific features.
            </>}
            problem={<>
              Two issues, not one. First, the data model: inverting the tree so Brighton was the root required every
              genealogy library to build its D3 hierarchy backwards — these libraries assume ancestors at the root,
              descendants as leaves. Fighting that assumption broke the layout engine entirely.
              Second, even after fixing the model, react-d3-tree&apos;s layout algorithm spread siblings horizontally with
              no awareness of generation density. At 10+ siblings in one generation, cards overlapped regardless of
              spacing configuration. This is consistent with <a href="https://github.com/bkrem/react-d3-tree/issues/41" target="_blank" rel="noopener noreferrer">reported
              performance and rendering issues</a> on large datasets — the library wasn&apos;t designed for this scale or structure.
              We moved on rather than confirming whether further configuration could have resolved it.
            </>}
            learned={<>
              Data model and library are separate problems — solve the model first. The correct model for this family
              is a directed graph rooted at the oldest known ancestors, flowing downward. More importantly:
              the standard genealogy data format, <a href="https://en.wikipedia.org/wiki/GEDCOM" target="_blank" rel="noopener noreferrer">GEDCOM</a>,
              only supports one husband and one wife per family record — polygamous unions require
              separate family records as a workaround. The assumption of nuclear family structure
              is baked into the standards, not just the libraries.
            </>}
          >
            <Attempt1Loader />
          </AttemptSection>

          <AttemptSection
            number={2}
            title="family-chart — ancestor-rooted, split by lineage"
            status="current"
            verdict="Right direction, not fully resolved"
            what={<>
              Dropped the ego-center model. Ifraim Musabani (maternal) and Wilson Maphutukezi (paternal) are the
              respective roots, flowing down through their children to Brighton as a leaf node.
              Two side-by-side panels, one per lineage, using <a href="https://github.com/donatso/family-chart" target="_blank" rel="noopener noreferrer">family-chart</a> —
              a genealogy-specific D3 library designed for kinship layout rather than generic hierarchies.
            </>}
            problem={<>
              The library&apos;s layout engine auto-inserts a ghost &ldquo;missing spouse&rdquo; node for every single parent,
              then draws the sibling connector bar between that ghost and the real parent. With multiple wives per
              grandfather, this produces ambiguous connector geometry — the library has no model for one person
              having children across multiple simultaneous partnerships.
              Connector lines also failed to render on initial load, only appearing after a pan or zoom. Reading the{' '}
              <a href="https://github.com/donatso/family-chart" target="_blank" rel="noopener noreferrer">library source</a> shows
              links are drawn inside a D3 zoom handler — meaning the first render pass completes before links are calculated.
              This isn&apos;t a documented known issue; it&apos;s an observation from tracing the rendering pipeline directly.
              Multiple workarounds were attempted (synthetic wheel events, delayed updateTree calls) without fully resolving it.
            </>}
            learned={<>
              Purpose-built beats generic, but purpose-built still encodes assumptions.
              Even <a href="https://github.com/PeWu/topola-viewer" target="_blank" rel="noopener noreferrer">Topola</a> and{' '}
              <a href="https://gramps-project.org" target="_blank" rel="noopener noreferrer">Gramps</a> — the most capable open-source genealogy tools —
              handle polygamy by creating separate family records per wife, not by modelling the
              simultaneous multi-partner structure as a single unit.
              The <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6170727/" target="_blank" rel="noopener noreferrer">Lineage system</a> (University of Utah, 2018)
              is the closest academic reference to what this actually needs: a &ldquo;couple concept&rdquo; node where
              children attach to a partnership line rather than to individual parents.
              That approach doesn&apos;t exist in any maintained open-source library I&apos;ve found.
            </>}
          >
            <Attempt2Loader />
          </AttemptSection>

        </div>

        {/* ── Footer ── */}
        <div className="mt-24 pt-8 border-t border-white/[0.06] max-w-2xl">
          <p className="text-xs text-white/20 leading-relaxed">
            Data sourced from family conversations, memory, and ongoing research.
            If you&apos;re family and see an error — or want to be added — reach out.
          </p>
        </div>

      </div>
    </main>
  )
}
