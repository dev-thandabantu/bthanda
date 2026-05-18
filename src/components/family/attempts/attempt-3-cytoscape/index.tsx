'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { cytoscapeElements, wifeById } from './data'
import { allPeople } from '@/data/family'

// Unified "selected node" — either a FamilyPerson or a wife stub
interface SelectedNode {
  id: string
  name: string
  relationship: string
  side?: string
  status?: string
  country?: string
  location?: string
  notes?: string
}

const MATERNAL = '#eab308'
const PATERNAL = '#818cf8'
const EGO = '#ffffff'
const BG = '#ffffff'
const UNION_COLOR = 'rgba(0,0,0,0.08)'
const EDGE_COLOR = 'rgba(30,30,30,0.3)'

function getAccent(side?: string) {
  if (side === 'maternal') return MATERNAL
  if (side === 'paternal') return PATERNAL
  return EGO
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyStyle = Record<string, any>

function buildStylesheet(): Array<{ selector: string; style: AnyStyle }> {
  return [
    {
      selector: 'node[type="person"]',
      style: {
        shape: 'round-rectangle',
        width: 150,
        height: 50,
        label: 'data(label)',
        'font-size': 13,
        'font-weight': 'bold',
        'font-family': 'var(--font-geist-sans), system-ui, sans-serif',
        'text-valign': 'center',
        'text-halign': 'center',
        'text-wrap': 'ellipsis',
        'text-max-width': '138px',
        color: '#1a1a1a',
        'background-color': '#e5e5e5',
        'border-width': 2,
        'border-color': '#999',
      },
    },
    {
      selector: 'node[type="person"][side="maternal"]',
      style: {
        'border-color': '#b45309',
        'background-color': '#fef3c7',
        color: '#78350f',
      },
    },
    {
      selector: 'node[type="person"][side="paternal"]',
      style: {
        'border-color': '#4338ca',
        'background-color': '#e0e7ff',
        color: '#312e81',
      },
    },
    {
      selector: 'node[type="person"][side="both"], node[id="brighton"]',
      style: {
        'border-color': '#111',
        'background-color': '#111',
        color: '#ffffff',
        'border-width': 2.5,
        width: 160,
        height: 54,
        'font-size': 14,
      },
    },
    {
      selector: 'node[type="person"][status="deceased"]',
      style: {
        opacity: 0.45,
        'border-style': 'dashed',
      },
    },
    {
      selector: 'node[type="wife"]',
      style: {
        shape: 'ellipse',
        width: 130,
        height: 46,
        label: 'data(label)',
        'font-size': 12,
        'font-family': 'var(--font-geist-sans), system-ui, sans-serif',
        'text-valign': 'center',
        'text-halign': 'center',
        'text-wrap': 'ellipsis',
        'text-max-width': '118px',
        color: '#1a1a1a',
        'background-color': '#f5f5f5',
        'border-width': 2,
        'border-style': 'dashed',
        'border-color': '#aaa',
      },
    },
    {
      selector: 'node[type="wife"][side="maternal"]',
      style: {
        'border-color': '#b45309',
        'background-color': '#fffbeb',
        color: '#92400e',
      },
    },
    {
      selector: 'node[type="wife"][side="paternal"]',
      style: {
        'border-color': '#4338ca',
        'background-color': '#eef2ff',
        color: '#3730a3',
      },
    },
    {
      selector: 'node[type="union"]',
      style: {
        width: 1,
        height: 1,
        opacity: 0,
        label: '',
      },
    },
    {
      selector: 'edge',
      style: {
        width: 1.5,
        'line-color': EDGE_COLOR,
        'target-arrow-color': EDGE_COLOR,
        'target-arrow-shape': 'none',
        'curve-style': 'bezier',
      },
    },
    {
      selector: 'edge[edgeType="spouse-to-union"]',
      style: {
        'line-style': 'dashed',
        'line-color': UNION_COLOR,
        width: 1,
      },
    },
    {
      selector: 'node:selected',
      style: {
        'border-width': 3,
        'border-color': '#111',
      },
    },
  ]
}

// ── Detail panel ──────────────────────────────────────────────────────────────
function DetailPanel({ node, onClose }: { node: SelectedNode; onClose: () => void }) {
  const accent = getAccent(node.side)
  const isDead = node.status === 'deceased'

  return (
    <div
      className="absolute top-3 right-3 w-56 rounded-2xl border border-white/[0.06] flex flex-col overflow-hidden z-10"
      style={{ background: '#0d0d12' }}
    >
      <div style={{ height: 3, background: `linear-gradient(90deg, ${accent}bb, transparent)` }} />
      <div className="p-4 overflow-y-auto">
        <div className="flex items-start justify-between gap-2 mb-4">
          <div>
            <p className="font-semibold text-sm leading-tight" style={{ color: accent }}>{node.name}</p>
            <p className="text-white/35 text-xs mt-0.5">{node.relationship}</p>
          </div>
          <button onClick={onClose} className="text-white/20 hover:text-white/50 transition-colors shrink-0 mt-0.5">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M2 2l10 10M12 2L2 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-2.5">
          {node.status && (
            <Row label="status">
              <span className={isDead ? 'line-through text-white/20' : 'text-white/55'}>{node.status}</span>
            </Row>
          )}
          {node.country && <Row label="country"><span className="text-white/55">{node.country}</span></Row>}
          {node.location && <Row label="location"><span className="text-white/55">{node.location}</span></Row>}
          {node.side && <Row label="side"><span style={{ color: accent }}>{node.side}</span></Row>}
        </div>
        {node.notes && (
          <p className="text-white/25 text-xs leading-relaxed mt-4 pt-4 border-t border-white/[0.05]">
            {node.notes}
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

// ── Main ──────────────────────────────────────────────────────────────────────
export default function CytoscapeChart() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cyRef = useRef<import('cytoscape').Core | null>(null)
  const [selectedPerson, setSelectedPerson] = useState<SelectedNode | null>(null)
  const [showDeceased, setShowDeceased] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    let cy: import('cytoscape').Core | null = null

    async function init() {
      if (!containerRef.current) return

      const [cytoscape, dagreLib] = await Promise.all([
        import('cytoscape'),
        import('cytoscape-dagre'),
      ])

      const Cytoscape = cytoscape.default
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const dagre = dagreLib.default as any

      try { Cytoscape.use(dagre) } catch { /* already registered */ }

      cy = Cytoscape({
        container: containerRef.current,
        elements: cytoscapeElements,
        style: buildStylesheet(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        layout: {
          name: 'dagre',
          rankDir: 'TB',
          nodeSep: 30,
          edgeSep: 10,
          rankSep: 80,
          padding: 40,
        } as any,
        wheelSensitivity: 0.3,
        minZoom: 0.05,
        maxZoom: 3,
      })

      cy.on('tap', 'node[type="person"], node[type="wife"]', (e) => {
        const id = e.target.data('id') as string
        const side = e.target.data('side') as string | undefined
        const rel = e.target.data('relationship') as string | undefined

        let node: SelectedNode | null = null
        const fp = allPeople.find(p => p.id === id)
        if (fp) {
          node = { id: fp.id, name: fp.name, relationship: fp.relationship, side: fp.side, status: fp.status, country: fp.country, location: fp.location, notes: fp.notes }
        } else {
          const wife = wifeById.get(id)
          if (wife) node = { id: wife.id, name: wife.fullName, relationship: rel ?? 'Great-grandmother', side, status: 'unknown', notes: wife.notes }
        }

        setSelectedPerson(prev => prev?.id === id ? null : node)
      })

      cy.on('tap', (e) => {
        if (e.target === cy) setSelectedPerson(null)
      })

      cy.fit(undefined, 40)
      cyRef.current = cy
    }

    init()
    return () => { cy?.destroy() }
  }, [])

  // Filter deceased nodes
  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return
    cy.nodes('[type="person"][status="deceased"]').forEach(n => {
      n.style('display', showDeceased ? 'element' : 'none')
    })
  }, [showDeceased])

  // Search highlight
  useEffect(() => {
    const cy = cyRef.current
    if (!cy) return
    if (!search.trim()) {
      cy.nodes('[type="person"]').style('opacity', 1)
      return
    }
    const q = search.toLowerCase()
    cy.nodes('[type="person"]').forEach(n => {
      const matches = (n.data('label') as string).toLowerCase().includes(q)
      n.style('opacity', matches ? 1 : 0.15)
    })
  }, [search])

  const handleFitToScreen = useCallback(() => {
    cyRef.current?.fit(undefined, 40)
  }, [])

  const handleDownload = useCallback(() => {
    const cy = cyRef.current
    if (!cy) return
    const dataUrl = cy.png({ output: 'blob-promise', bg: '#f8f7f4', full: true, scale: 2 })
    void (dataUrl as Promise<Blob>).then(blob => {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'family-tree-attempt-3.png'
      a.click()
      URL.revokeObjectURL(url)
    })
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
        <button
          onClick={() => setShowDeceased(v => !v)}
          className={[
            'text-xs px-3 py-1.5 rounded-full border transition-colors',
            showDeceased
              ? 'border-white/15 text-white/50'
              : 'border-white/8 text-white/20',
          ].join(' ')}
        >
          {showDeceased ? 'hide deceased' : 'show deceased'}
        </button>
        <button
          onClick={handleFitToScreen}
          className="text-xs px-3 py-1.5 rounded-full border border-white/15 text-white/50 hover:text-white/70 hover:border-white/25 transition-colors"
        >
          fit to screen
        </button>
        <button
          onClick={handleDownload}
          className="text-xs px-3 py-1.5 rounded-full border border-white/15 text-white/50 hover:text-white/70 hover:border-white/25 transition-colors flex items-center gap-1.5"
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 1v7M3 5l3 3 3-3M1 10h10" />
          </svg>
          save as image
        </button>
        <div className="flex items-center gap-3 ml-auto text-[10px] text-white/20">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm" style={{ background: 'rgba(234,179,8,0.5)' }} />
            maternal
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm" style={{ background: 'rgba(129,140,248,0.5)' }} />
            paternal
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-sm" style={{ background: 'rgba(255,255,255,0.5)' }} />
            Brighton
          </span>
        </div>
      </div>

      {/* Canvas */}
      <div className="relative flex-1 min-h-0 rounded-xl overflow-hidden border border-black/10" style={{ background: '#ffffff' }}>
        <div ref={containerRef} className="w-full h-full" />
        {selectedPerson && (
          <DetailPanel node={selectedPerson} onClose={() => setSelectedPerson(null)} />
        )}
      </div>
    </div>
  )
}
