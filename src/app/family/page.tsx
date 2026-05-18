import type { Metadata } from 'next'
import FamilyStats from '@/components/FamilyStats'
import Attempt1Loader from '@/components/family/attempts/attempt-1-react-d3-tree/Loader'
import Attempt2Loader from '@/components/family/attempts/attempt-2-family-chart/Loader'
import Attempt3Loader from '@/components/family/attempts/attempt-3-cytoscape/Loader'
import Attempt4Loader from '@/components/family/attempts/attempt-4-react-flow-elk/Loader'
import Attempt5Loader from '@/components/family/attempts/attempt-5-custom-svg/Loader'
import AttemptSection from '@/components/family/AttemptSection'
import ChallengeBlock from '@/components/family/ChallengeBlock'

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
              Every genealogy library I tried quietly panics at it.
            </p>
            <p>
              Five attempts to get this right are documented below — what each one tried, where it broke,
              and what it taught me. Attempt 5 finally solved the rendering. The problem that&apos;s left
              isn&apos;t technical.
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
            status="abandoned"
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

          <AttemptSection
            number={3}
            title="Cytoscape.js — union node model"
            status="abandoned"
            verdict="First approach to correctly model polygamy"
            what={<>
              Each wife-grandfather pairing becomes an invisible &ldquo;union node&rdquo; in the graph.
              Children attach to the union node rather than directly to the grandfather — so &ldquo;children of Wilson and Wife 1&rdquo;
              is structurally distinct from &ldquo;children of Wilson and Wife 2&rdquo;.
              Built on <a href="https://js.cytoscape.org" target="_blank" rel="noopener noreferrer">Cytoscape.js</a> with the{' '}
              <a href="https://github.com/cytoscape/cytoscape.js-dagre" target="_blank" rel="noopener noreferrer">dagre layout</a> for top-down generational ordering.
              Inspired by <a href="https://github.com/BeepBeep84/family-tree" target="_blank" rel="noopener noreferrer">this approach</a> of
              using invisible coupling nodes to represent partnerships.
            </>}
            problem={<>
              Dagre is a generic directed-graph layout algorithm — it doesn&apos;t know about generations,
              so sibling ordering and generational alignment require manual nudging.
              Union nodes being invisible means edge routing sometimes produces visually confusing connector paths.
              The library handles zoom/pan natively, but canvas-based rendering means no DOM-level accessibility.
            </>}
            learned={<>
              The union node pattern solves the data modelling problem that defeats every genealogy library —
              it correctly represents simultaneous multi-partner structures without the GEDCOM workaround of
              separate family records. This is the &ldquo;couple concept&rdquo; node described in the{' '}
              <a href="https://pmc.ncbi.nlm.nih.gov/articles/PMC6170727/" target="_blank" rel="noopener noreferrer">Lineage system paper</a>.
              The challenge is now layout rather than data model.
            </>}
          >
            <Attempt3Loader />
          </AttemptSection>

          <AttemptSection
            number={4}
            title="React Flow + ELK — layered layout"
            status="abandoned"
            verdict="Better layout, same data model"
            what={<>
              Same union-node data model as Attempt 3, but swapped the renderer and layout engine.{' '}
              <a href="https://reactflow.dev" target="_blank" rel="noopener noreferrer">React Flow</a> (xyflow) renders
              nodes as DOM elements — CSS styling, accessibility, and custom React components instead of
              Cytoscape&apos;s canvas.{' '}
              <a href="https://eclipse.dev/elk/" target="_blank" rel="noopener noreferrer">ELK</a> (Eclipse Layout Kernel)
              computes positions using its <code>layered</code> algorithm, which is designed for
              hierarchical directed graphs and respects generation depth more reliably than dagre.
            </>}
            problem={<>
              ELK&apos;s <code>layered</code> algorithm still treats this as a general directed graph —
              it doesn&apos;t know that wife nodes and their children should form a horizontal cluster.
              With 8 grandmothers each fanning out to multiple children, the layout can still produce
              wide, hard-to-read generations. The data model is correct; the layout algorithm
              is still the bottleneck.
            </>}
            learned={<>
              DOM-based rendering is a clear improvement over canvas — nodes are selectable, zoomable,
              and styleable without fighting the library. ELK&apos;s layered algorithm does produce
              cleaner generational rows than dagre in most cases.
              The remaining problem is not the library — it&apos;s that no general-purpose layout
              algorithm knows to group &ldquo;Wilson + Wife 1&apos;s children&rdquo; as a visual unit.
              That grouping requires either a custom layout pass or a library purpose-built for kinship diagrams.
            </>}
          >
            <Attempt4Loader />
          </AttemptSection>

          <AttemptSection
            number={5}
            title="Custom generational SVG renderer"
            status="current"
            verdict="No library — full control over layout"
            what={<>
              No layout library at all. Positions are computed in a pure JS layout pass:
              people grouped by generation row, children sub-grouped by wife into visual clusters,
              wife node centred over her children, kinship brackets drawn as explicit SVG paths.
              Zoom and pan via pointer events on a native <code>&lt;svg&gt;</code> element.
            </>}
            problem={<>
              The layout pass is hand-coded, which means edge cases (nodes without a wife match,
              deeply-nested descendants, siblings that appear in both lineages) need explicit handling.
              Very wide generations still require horizontal scrolling — the constraint of a fixed
              viewport hasn&apos;t changed, only the clarity of the layout within it.
            </>}
            learned={<>
              Writing the layout algorithm takes less code than fighting a library.
              The wife-cluster grouping — centering a wife node over her children with a kinship bracket —
              is about 30 lines of geometry. Every attempt before this spent more than 30 lines working
              around library assumptions that prevented exactly this grouping.
              The rendering is done. The open problem now is data: 218 people documented,
              an unknown number still untraced, and most of the family reachable only by WhatsApp.
            </>}
          >
            <Attempt5Loader />
          </AttemptSection>

        </div>

        {/* ── What the renderer achieved ── */}
        <div className="mt-24 max-w-2xl">
          <p className="text-xs tracking-widest text-white/20 uppercase mb-6">What attempt 5 achieved</p>
          <p className="text-sm text-white/40 leading-relaxed mb-8">
            Five attempts to get this right. Here&apos;s what the current renderer actually does — and where it still falls short.
          </p>
          <ul className="space-y-5 text-sm leading-relaxed text-white/45 list-none">
            <li className="flex gap-4"><span className="text-emerald-400/40 shrink-0 w-4 mt-0.5 text-xs">+</span><div><span className="text-white/65">All 218 people are present. </span>Both lineages fully rendered. No one dropped.</div></li>
            <li className="flex gap-4"><span className="text-emerald-400/40 shrink-0 w-4 mt-0.5 text-xs">+</span><div><span className="text-white/65">All 8 grandmothers visible as nodes. </span>The five wives of Ifraim and three of Wilson appear as distinct labelled nodes &mdash; dashed ellipses, not ghost placeholders. They existed. They matter.</div></li>
            <li className="flex gap-4"><span className="text-emerald-400/40 shrink-0 w-4 mt-0.5 text-xs">+</span><div><span className="text-white/65">Children connect to their correct mother. </span>A child of Ifraim + Wife 3 is visually distinct from a child of Ifraim + Wife 1. Connectors route through the partnership cluster.</div></li>
            <li className="flex gap-4"><span className="text-emerald-400/40 shrink-0 w-4 mt-0.5 text-xs">+</span><div><span className="text-white/65">Generations are legible as rows. </span>Ifraim and Wilson at the top. Their children one row below. Brighton as the convergence point of both lineages.</div></li>
            <li className="flex gap-4"><span className="text-emerald-400/40 shrink-0 w-4 mt-0.5 text-xs">+</span><div><span className="text-white/65">Zoom and pan. </span>Wheel to zoom, drag to pan. Fits the whole tree on load.</div></li>
            <li className="flex gap-4"><span className="text-emerald-400/40 shrink-0 w-4 mt-0.5 text-xs">+</span><div><span className="text-white/65">Clicking a person shows their details. </span>Name, relationship, country, status, notes.</div></li>
            <li className="flex gap-4"><span className="text-white/15 shrink-0 w-4 mt-0.5 text-xs">~</span><div><span className="text-white/35">Very wide generations. </span>The maternal side has a lot of siblings per wife. Some rows are wide enough that you&apos;re panning more than reading &mdash; a known tradeoff of the flat generational model.</div></li>
          </ul>
        </div>

        {/* ── Challenge ── */}
        <div className="mt-20">
          <ChallengeBlock />
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
