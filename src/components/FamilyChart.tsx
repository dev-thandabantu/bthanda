'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import { maternalChartData, paternalChartData } from '@/data/family-chart-data'
import { allPeople } from '@/data/family'
import type { FamilyPerson } from '@/data/family-types'

// ── CSS injected once ─────────────────────────────────────────────────────────
const CHART_CSS = `
  .f3-cont { width: 100%; height: 100%; }
  .f3-cont svg { width: 100%; height: 100%; }

  /* Fullscreen — ensure background fills */
  :fullscreen { background: #0a0a0a; }
  :-webkit-full-screen { background: #0a0a0a; }

  .f3-link { stroke: rgba(148,163,184,0.2); stroke-width: 1px; fill: none; }

  .fc-card {
    display: flex;
    flex-direction: column;
    justify-content: center;
    gap: 2px;
    padding: 6px 10px;
    border-radius: 16px;
    border: 1px solid rgba(255,255,255,0.08);
    background: rgba(255,255,255,0.02);
    cursor: pointer;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
    overflow: hidden;
  }
  .fc-card:hover {
    border-color: rgba(255,255,255,0.3) !important;
    box-shadow: 0 0 10px rgba(255,255,255,0.06);
  }

  /* Maternal (yellow) */
  .fc-card[data-side="maternal"] {
    border-color: rgba(234,179,8,0.35);
    background: rgba(234,179,8,0.04);
  }
  .fc-card[data-side="maternal"]:hover {
    border-color: #eab308 !important;
    box-shadow: 0 0 12px rgba(234,179,8,0.18) !important;
  }
  .fc-card[data-side="maternal"] .fc-name { color: rgba(254,240,138,0.85); }
  .fc-card[data-side="maternal"] .fc-sub  { color: rgba(234,179,8,0.45); }

  /* Paternal (indigo) */
  .fc-card[data-side="paternal"] {
    border-color: rgba(129,140,248,0.35);
    background: rgba(99,102,241,0.04);
  }
  .fc-card[data-side="paternal"]:hover {
    border-color: #818cf8 !important;
    box-shadow: 0 0 12px rgba(129,140,248,0.18) !important;
  }
  .fc-card[data-side="paternal"] .fc-name { color: rgba(199,210,254,0.85); }
  .fc-card[data-side="paternal"] .fc-sub  { color: rgba(129,140,248,0.45); }

  /* Brighton */
  .fc-card[data-ego="true"] {
    background: #fff;
    border-color: #fff;
    box-shadow: 0 0 16px rgba(255,255,255,0.15);
  }
  .fc-card[data-ego="true"] .fc-name { color: #000; font-size: 12px; font-weight: 700; }
  .fc-card[data-ego="true"] .fc-sub  { color: rgba(0,0,0,0.4); }

  .fc-card[data-status="deceased"] { opacity: 0.45; border-style: dashed; }
  .fc-card[data-highlighted="true"] {
    border-color: #fff !important;
    box-shadow: 0 0 14px rgba(255,255,255,0.2) !important;
  }

  /* Ghost spouse placeholder — keep for layout/connectors but make invisible */
  .f3-node[data-is-new-rel] .fc-card,
  .f3-node[data-is-new-rel] foreignObject > div {
    opacity: 0 !important;
    pointer-events: none !important;
  }

  .fc-name {
    font-family: var(--font-geist-sans, sans-serif);
    font-size: 10px;
    font-weight: 600;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: rgba(203,213,225,0.7);
    letter-spacing: 0.1px;
  }
  .fc-sub {
    font-family: var(--font-geist-mono, monospace);
    font-size: 8px;
    letter-spacing: 0.6px;
    white-space: nowrap;
    color: rgba(148,163,184,0.4);
  }
`

type FilterSide = 'all' | 'maternal' | 'paternal'

interface ChartPanelProps {
  side: 'maternal' | 'paternal'
  search: string
  filterSide: FilterSide
  showDeceased: boolean
  onPersonClick: (person: FamilyPerson | null) => void
  selectedId: string | null
}

function ChartPanel({ side, search, filterSide, showDeceased, onPersonClick, selectedId }: ChartPanelProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const rawData = side === 'maternal' ? maternalChartData : paternalChartData
  const accentColor = side === 'maternal' ? '#eab308' : '#818cf8'
  const label = side === 'maternal' ? 'Musabani / Makhuya' : 'Maphutukezi'

  const toggleFullscreen = useCallback(() => {
    const el = panelRef.current
    if (!el) return
    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {})
    } else {
      document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {})
    }
  }, [])

  useEffect(() => {
    const handler = () => setIsFullscreen(!!document.fullscreenElement)
    document.addEventListener('fullscreenchange', handler)
    return () => document.removeEventListener('fullscreenchange', handler)
  }, [])

  const initChart = useCallback(async () => {
    if (!containerRef.current) return

    const f3 = await import('family-chart')

    let data = rawData.filter(d => {
      if (!showDeceased && d.data.status === 'deceased' && d.id !== 'brighton') return false
      if (filterSide !== 'all' && filterSide !== side && d.id !== 'brighton') return false
      return true
    })

    // Clean broken rels after filtering
    const ids = new Set(data.map(d => d.id))
    data = data.map(d => ({
      ...d,
      rels: {
        parents: d.rels.parents.filter(id => ids.has(id)),
        spouses: d.rels.spouses.filter(id => ids.has(id)),
        children: d.rels.children.filter(id => ids.has(id)),
      },
    }))

    containerRef.current.innerHTML = ''

    const chart = f3.createChart(containerRef.current, data)

    chart.setCardHtml()
      .setCardDim({ w: 130, h: 44, text_x: 10, text_y: 15, img_w: 0, img_h: 0, img_x: 0, img_y: 0 })
      .setCardInnerHtmlCreator((d) => {
        const datum = d.data as typeof rawData[0]
        const isEgo = datum.id === 'brighton'
        const side = datum.data?.side ?? 'both'
        const status = datum.data?.status ?? 'living'
        const country = datum.data?.country ?? ''
        const name = datum.data?.displayName ?? datum.data?.name ?? ''
        const q = search.trim().toLowerCase()
        const isHighlighted = q.length > 0 && name.toLowerCase().includes(q)
        return `
          <div class="fc-card"
            data-side="${isEgo ? 'ego' : side}"
            data-ego="${isEgo}"
            data-status="${status}"
            data-highlighted="${isHighlighted}"
          >
            <div class="fc-name">${name}</div>
            ${country ? `<div class="fc-sub">${country}</div>` : ''}
          </div>
        `
      })
      .setOnCardClick((_e: MouseEvent, d: { data: { id: string } }) => {
        const person = allPeople.find(p => p.id === d.data.id)
        onPersonClick(person ?? null)
      })

    chart
      .setOrientationVertical()
      .setCardYSpacing(100)
      .setCardXSpacing(180)
      .setAncestryDepth(10)
      .setProgenyDepth(10)
      .updateTree({ initial: true, tree_position: 'main_to_middle' })

    // Dispatch a zero-delta wheel event to trigger D3 zoom handler — this forces
    // family-chart to recalculate and draw all connector lines on initial render.
    setTimeout(() => {
      const svg = containerRef.current?.querySelector('svg')
      if (svg) {
        svg.dispatchEvent(new WheelEvent('wheel', {
          bubbles: true, cancelable: true, deltaY: 0, deltaMode: 0,
        }))
      }
    }, 100)

  }, [rawData, side, search, filterSide, showDeceased, onPersonClick])

  useEffect(() => {
    // rAF ensures container has real dimensions before chart initialises
    const id = requestAnimationFrame(() => { initChart() })
    return () => cancelAnimationFrame(id)
  }, [initChart])

  const hidden = filterSide !== 'all' && filterSide !== side

  return (
    <div
      ref={panelRef}
      className="flex-1 flex flex-col min-w-0 min-h-0 rounded-2xl border overflow-hidden transition-opacity"
      style={{
        borderColor: `${accentColor}22`,
        background: `radial-gradient(ellipse at 50% 0%, ${accentColor}08 0%, transparent 60%), #0a0a0a`,
        opacity: hidden ? 0.25 : 1,
      }}
    >
      {/* Header */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b shrink-0" style={{ borderColor: `${accentColor}18` }}>
        <span className="w-2 h-2 rounded-full shrink-0" style={{ background: accentColor }} />
        <span className="text-xs font-medium tracking-wide flex-1" style={{ color: `${accentColor}cc` }}>{label}</span>
        <button
          onClick={toggleFullscreen}
          className="text-white/20 hover:text-white/50 transition-colors"
          title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'}
        >
          {isFullscreen ? (
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M5 1H1v4M9 1h4v4M5 13H1v-4M9 13h4v-4" />
            </svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M1 5V1h4M9 1h4v4M13 9v4H9M5 13H1V9" />
            </svg>
          )}
        </button>
      </div>

      <div ref={containerRef} className="flex-1 w-full min-h-0" style={{ height: 0 }} id={`FamilyChart-${side}`} />
    </div>
  )
}

// ── Detail panel ──────────────────────────────────────────────────────────────
function DetailPanel({ person, onClose }: { person: FamilyPerson; onClose: () => void }) {
  const isEgo = person.id === 'brighton'
  const accent = isEgo ? '#ffffff' : person.side === 'maternal' ? '#eab308' : person.side === 'paternal' ? '#818cf8' : '#94a3b8'
  const isDead = person.status === 'deceased'

  return (
    <div className="w-64 shrink-0 rounded-2xl border border-white/[0.06] flex flex-col overflow-hidden" style={{ background: '#0d0d12' }}>
      <div style={{ height: 3, background: `linear-gradient(90deg, ${accent}bb, transparent)` }} />
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="flex items-start justify-between gap-2 mb-4">
          <div>
            <p className="font-semibold text-sm leading-tight" style={{ color: accent }}>{person.name}</p>
            <p className="text-white/35 text-xs mt-0.5">{person.relationship}</p>
          </div>
          <button onClick={onClose} className="text-white/20 hover:text-white/50 transition-colors shrink-0 mt-0.5">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M2 2l10 10M12 2L2 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-2.5">
          <Row label="status">
            <span className={isDead ? 'line-through text-white/20' : 'text-white/55'}>{person.status}</span>
          </Row>
          {person.country && <Row label="country"><span className="text-white/55">{person.country}</span></Row>}
          {person.location && <Row label="location"><span className="text-white/55">{person.location}</span></Row>}
          <Row label="side"><span style={{ color: accent }}>{person.side}</span></Row>
        </div>

        {person.notes && (
          <p className="text-white/25 text-xs leading-relaxed mt-4 pt-4 border-t border-white/[0.05]">
            {person.notes}
          </p>
        )}
      </div>
    </div>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-white/20 text-[9px] uppercase tracking-widest w-14 shrink-0">{label}</span>
      <span className="text-xs">{children}</span>
    </div>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function FamilyChart() {
  const [selectedPerson, setSelectedPerson] = useState<FamilyPerson | null>(null)
  const [search, setSearch] = useState('')
  const [filterSide, setFilterSide] = useState<FilterSide>('all')
  const [showDeceased, setShowDeceased] = useState(true)
  const [layout, setLayout] = useState<'side-by-side' | 'stacked'>('side-by-side')

  useEffect(() => {
    if (document.getElementById('fc-styles')) return
    const style = document.createElement('style')
    style.id = 'fc-styles'
    style.textContent = CHART_CSS
    document.head.appendChild(style)
  }, [])

  const handlePersonClick = useCallback((person: FamilyPerson | null) => {
    setSelectedPerson(prev => prev?.id === person?.id ? null : person)
  }, [])

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3 shrink-0">
        <input
          type="text"
          placeholder="Search by name…"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="rounded-full border border-white/12 bg-white/[0.02] px-4 py-1.5 text-sm text-white/70 placeholder:text-white/20 outline-none focus:border-white/25 w-48 transition-colors"
        />
        <div className="flex items-center rounded-full border border-white/10 overflow-hidden text-xs">
          {(['all', 'maternal', 'paternal'] as FilterSide[]).map(s => (
            <button
              key={s}
              onClick={() => setFilterSide(s)}
              className={[
                'px-3 py-1.5 transition-colors capitalize',
                filterSide === s
                  ? s === 'maternal' ? 'bg-yellow-500/12 text-yellow-300'
                    : s === 'paternal' ? 'bg-indigo-500/12 text-indigo-300'
                    : 'bg-white/8 text-white/70'
                  : 'text-white/30 hover:text-white/55',
              ].join(' ')}
            >{s}</button>
          ))}
        </div>
        <button
          onClick={() => setShowDeceased(v => !v)}
          className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/30 hover:text-white/55 transition-colors"
        >
          {showDeceased ? 'hide deceased' : 'show deceased'}
        </button>

        <button
          onClick={() => setLayout(v => v === 'side-by-side' ? 'stacked' : 'side-by-side')}
          className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/30 hover:text-white/55 transition-colors ml-auto flex items-center gap-1.5"
          title={layout === 'side-by-side' ? 'Switch to stacked view' : 'Switch to side-by-side view'}
        >
          {layout === 'side-by-side' ? (
            // stacked icon
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <rect x="1" y="1" width="10" height="4" rx="1" />
              <rect x="1" y="7" width="10" height="4" rx="1" />
            </svg>
          ) : (
            // side-by-side icon
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <rect x="1" y="1" width="4" height="10" rx="1" />
              <rect x="7" y="1" width="4" height="10" rx="1" />
            </svg>
          )}
          {layout === 'side-by-side' ? 'stack' : 'split'}
        </button>
      </div>

      {/* Charts + detail panel */}
      <div className={`flex gap-3 flex-1 min-h-0 ${layout === 'stacked' ? 'flex-col' : ''}`}>
        <ChartPanel
          side="maternal"
          search={search}
          filterSide={filterSide}
          showDeceased={showDeceased}
          onPersonClick={handlePersonClick}
          selectedId={selectedPerson?.id ?? null}
        />
        <ChartPanel
          side="paternal"
          search={search}
          filterSide={filterSide}
          showDeceased={showDeceased}
          onPersonClick={handlePersonClick}
          selectedId={selectedPerson?.id ?? null}
        />
        {selectedPerson && (
          <DetailPanel person={selectedPerson} onClose={() => setSelectedPerson(null)} />
        )}
      </div>
    </div>
  )
}
