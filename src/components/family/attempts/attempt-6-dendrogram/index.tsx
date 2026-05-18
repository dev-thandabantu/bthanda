'use client'

import { useRef, useState, useCallback, useEffect, useMemo } from 'react'
import { buildFamilyGraph, wifeById } from '@/data/family-graph'
import type { GraphNode, GraphEdge } from '@/data/family-graph'
import { allPeople } from '@/data/family'

// ── Colours ───────────────────────────────────────────────────────────────────
const MATERNAL_BG     = '#fef3c7'
const MATERNAL_BORDER = '#b45309'
const MATERNAL_TEXT   = '#78350f'
const PATERNAL_BG     = '#e0e7ff'
const PATERNAL_BORDER = '#4338ca'
const PATERNAL_TEXT   = '#312e81'
const EGO_BG          = '#111111'
const EGO_TEXT        = '#ffffff'
const NEUTRAL_BG      = '#e5e5e5'
const NEUTRAL_BORDER  = '#999999'
const NEUTRAL_TEXT    = '#1a1a1a'

function nodeColors(gn: GraphNode, isEgo: boolean) {
  if (isEgo)                  return { bg: EGO_BG,      border: '#444',          text: EGO_TEXT   }
  if (gn.side === 'maternal') return { bg: MATERNAL_BG, border: MATERNAL_BORDER, text: MATERNAL_TEXT }
  if (gn.side === 'paternal') return { bg: PATERNAL_BG, border: PATERNAL_BORDER, text: PATERNAL_TEXT }
  return                             { bg: NEUTRAL_BG,  border: NEUTRAL_BORDER,  text: NEUTRAL_TEXT  }
}

function accentColor(side?: string) {
  if (side === 'maternal') return MATERNAL_BORDER
  if (side === 'paternal') return PATERNAL_BORDER
  return '#555'
}

// ── Layout constants ──────────────────────────────────────────────────────────
const NODE_W       = 140
const NODE_H       = 40
const WIFE_W       = 120
const WIFE_H       = 36
const V_GAP        = 14    // vertical gap between siblings in a column
const WIFE_COL_GAP = 28    // horizontal gap between wife columns
const TREE_GAP     = 80    // horizontal gap between maternal and paternal trees
const GP_INDENT    = 20    // grandparent indented from left edge of its subtree
const GP_TOP       = 20    // y of grandparent row
const WIFE_OFFSET  = 100   // y below grandparent where wife nodes start
const CHILD_OFFSET = 60    // y below wife node where first child starts

// ── Layout types ──────────────────────────────────────────────────────────────
interface Rect { x: number; y: number; w: number; h: number }
type Layout = Map<string, Rect>

interface Cluster { wifeId: string | null; childIds: string[] }

function clustersFor(gpId: string, nodes: GraphNode[], edges: GraphEdge[]): Cluster[] {
  const nodeById = new Map(nodes.map(n => [n.id, n]))
  const gpEdges = edges.filter(e => e.source === gpId)

  const directChildren = gpEdges
    .filter(e => e.edgeType === 'direct')
    .map(e => e.target)

  const intermediaries = gpEdges
    .filter(e => e.edgeType === 'spouse-to-union')
    .map(e => e.target)

  const clusters: Cluster[] = []

  for (const intId of intermediaries) {
    const intNode = nodeById.get(intId)
    if (!intNode) continue
    const children = edges
      .filter(e => e.source === intId && e.edgeType === 'union-to-child')
      .map(e => e.target)
    clusters.push({ wifeId: intNode.type === 'wife' ? intId : null, childIds: children })
  }

  if (directChildren.length > 0) {
    clusters.push({ wifeId: null, childIds: directChildren })
  }

  return clusters
}

/**
 * Dendrogram layout: each wife-cluster is a vertical column.
 * Wife node at top of column, children stacked below.
 * Clusters arranged left-to-right under the grandparent.
 * Returns total width of the subtree.
 */
function placeDendrogramSubtree(
  gpId: string,
  clusters: Cluster[],
  startX: number,
  layout: Layout,
): { totalW: number; gpCx: number; bottomY: number } {
  if (clusters.length === 0) return { totalW: NODE_W, gpCx: startX + NODE_W / 2, bottomY: GP_TOP + NODE_H }

  // Column width = max(NODE_W, WIFE_W)
  const colW = Math.max(NODE_W, WIFE_W)
  const totalW = clusters.length * colW + Math.max(0, clusters.length - 1) * WIFE_COL_GAP

  const gpCx = startX + totalW / 2
  layout.set(gpId, { x: gpCx - NODE_W / 2, y: GP_TOP, w: NODE_W, h: NODE_H })

  let bottomY = GP_TOP + NODE_H
  let colX = startX

  for (const cluster of clusters) {
    const colCx = colX + colW / 2

    // Wife node
    const wifeY = GP_TOP + WIFE_OFFSET
    if (cluster.wifeId) {
      layout.set(cluster.wifeId, {
        x: colCx - WIFE_W / 2,
        y: wifeY,
        w: WIFE_W,
        h: WIFE_H,
      })
    }

    // Children stacked vertically below wife
    const firstChildY = wifeY + (cluster.wifeId ? WIFE_H : 0) + CHILD_OFFSET
    let cy = firstChildY
    for (const childId of cluster.childIds) {
      layout.set(childId, { x: colCx - NODE_W / 2, y: cy, w: NODE_W, h: NODE_H })
      cy += NODE_H + V_GAP
    }

    bottomY = Math.max(bottomY, cy)
    colX += colW + WIFE_COL_GAP
  }

  return { totalW, gpCx, bottomY }
}

export function computeLayout(nodes: GraphNode[], edges: GraphEdge[]): Layout {
  const layout: Layout = new Map()

  const maternalClusters = clustersFor('ifraim-musabani', nodes, edges)
  const paternalClusters = clustersFor('wilson-maphutukezi', nodes, edges)

  const { totalW: matW, gpCx: matGpCx, bottomY: matBottom } =
    placeDendrogramSubtree('ifraim-musabani', maternalClusters, 0, layout)

  const patStartX = matW + TREE_GAP
  const { gpCx: patGpCx, bottomY: patBottom } =
    placeDendrogramSubtree('wilson-maphutukezi', paternalClusters, patStartX, layout)

  // For every person node that is already placed and has direct children (not
  // Brighton), stack those children vertically below them in the same column.
  let globalBottom = Math.max(matBottom, patBottom)
  for (const n of nodes) {
    if (n.type !== 'person' || n.id === 'brighton') continue
    const parentRect = layout.get(n.id)
    if (!parentRect) continue
    const childIds = edges
      .filter(e => e.source === n.id && e.edgeType === 'direct' && e.target !== 'brighton')
      .map(e => e.target)
    if (childIds.length === 0) continue
    const colCx = parentRect.x + parentRect.w / 2
    let cy = parentRect.y + parentRect.h + CHILD_OFFSET
    for (const childId of childIds) {
      if (layout.has(childId)) continue
      layout.set(childId, { x: colCx - NODE_W / 2, y: cy, w: NODE_W, h: NODE_H })
      cy += NODE_H + V_GAP
    }
    globalBottom = Math.max(globalBottom, cy)
  }

  // Brighton below both trees, centred between his two parents
  const brightonY = globalBottom + 60
  const maternalParent = layout.get('beauty-pakaisai')
  const paternalParent = layout.get('dennis-maphutukezi')
  const brightonCx = maternalParent && paternalParent
    ? ((maternalParent.x + maternalParent.w / 2) + (paternalParent.x + paternalParent.w / 2)) / 2
    : (matGpCx + patGpCx) / 2
  layout.set('brighton', { x: brightonCx - NODE_W / 2, y: brightonY, w: NODE_W, h: NODE_H })

  // Union nodes: invisible 1×1 midpoint between their source and first target
  for (const n of nodes) {
    if (layout.has(n.id)) continue
    if (n.type === 'union') {
      const srcEdge = edges.find(e => e.target === n.id)
      const tgtEdge = edges.find(e => e.source === n.id)
      if (srcEdge && tgtEdge) {
        const src = layout.get(srcEdge.source)
        const tgt = layout.get(tgtEdge.target)
        if (src && tgt) {
          layout.set(n.id, {
            x: (src.x + src.w / 2 + tgt.x + tgt.w / 2) / 2 - 0.5,
            y: (src.y + src.h / 2 + tgt.y + tgt.h / 2) / 2 - 0.5,
            w: 1, h: 1,
          })
          continue
        }
      }
      layout.set(n.id, { x: 0, y: 0, w: 1, h: 1 })
    }
  }

  return layout
}

// ── Edge helpers ──────────────────────────────────────────────────────────────
function edgeColor(e: GraphEdge, nodes: Map<string, GraphNode>): string {
  const src = nodes.get(e.source)
  if (!src) return 'rgba(120,120,120,0.4)'
  if (src.side === 'maternal') return 'rgba(180,83,9,0.35)'
  if (src.side === 'paternal') return 'rgba(67,56,202,0.35)'
  return 'rgba(120,120,120,0.35)'
}

// ── Detail panel ──────────────────────────────────────────────────────────────
interface SelectedNode {
  id: string; name: string; relationship: string
  side?: string; status?: string; country?: string; location?: string; notes?: string
}

function DetailPanel({ node, onClose }: { node: SelectedNode; onClose: () => void }) {
  const a = accentColor(node.side)
  return (
    <div
      className="absolute top-3 right-3 w-56 rounded-2xl border border-black/10 flex flex-col overflow-hidden z-10 shadow-lg"
      style={{ background: '#fff' }}
    >
      <div style={{ height: 3, background: `linear-gradient(90deg, ${a}bb, transparent)` }} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-4">
          <div>
            <p className="font-semibold text-sm leading-tight" style={{ color: a }}>{node.name}</p>
            <p className="text-black/40 text-xs mt-0.5">{node.relationship}</p>
          </div>
          <button onClick={onClose} className="text-black/25 hover:text-black/60 transition-colors shrink-0 mt-0.5">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
              <path d="M2 2l10 10M12 2L2 12" />
            </svg>
          </button>
        </div>
        <div className="space-y-2">
          {node.status   && <PanelRow label="status"><span className={node.status === 'deceased' ? 'line-through text-black/25' : 'text-black/60'}>{node.status}</span></PanelRow>}
          {node.country  && <PanelRow label="country"><span className="text-black/60">{node.country}</span></PanelRow>}
          {node.location && <PanelRow label="location"><span className="text-black/60">{node.location}</span></PanelRow>}
          {node.side     && <PanelRow label="side"><span style={{ color: a }}>{node.side}</span></PanelRow>}
        </div>
        {node.notes && <p className="text-black/35 text-xs leading-relaxed mt-4 pt-4 border-t border-black/[0.08]">{node.notes}</p>}
      </div>
    </div>
  )
}

function PanelRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-baseline gap-2">
      <span className="text-black/30 text-[9px] uppercase tracking-widest w-14 shrink-0">{label}</span>
      <span className="text-xs">{children}</span>
    </div>
  )
}

// ── Main component ────────────────────────────────────────────────────────────
export default function DendrogramTree() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState<SelectedNode | null>(null)

  const [tx, setTx] = useState(40)
  const [ty, setTy] = useState(40)
  const [scale, setScale] = useState(0.7)
  const dragging = useRef(false)
  const lastPos  = useRef({ x: 0, y: 0 })
  const [isDragging, setIsDragging] = useState(false)

  const { nodes, edges } = useMemo(() => buildFamilyGraph(), [])
  const layout           = useMemo(() => computeLayout(nodes, edges), [nodes, edges])
  const nodeById         = useMemo(() => new Map(nodes.map(n => [n.id, n])), [nodes])

  const rects = [...layout.values()]
  const svgW  = rects.reduce((m, r) => Math.max(m, r.x + r.w), 0) + 80
  const svgH  = rects.reduce((m, r) => Math.max(m, r.y + r.h), 0) + 80

  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    setScale(s => Math.min(4, Math.max(0.06, s * (e.deltaY < 0 ? 1.12 : 0.89))))
  }, [])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as Element).closest('rect,ellipse,text')) return
    dragging.current = true
    setIsDragging(true)
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return
    setTx(x => x + e.clientX - lastPos.current.x)
    setTy(y => y + e.clientY - lastPos.current.y)
    lastPos.current = { x: e.clientX, y: e.clientY }
  }, [])

  const onPointerUp = useCallback(() => { dragging.current = false; setIsDragging(false) }, [])

  const handleNodeClick = useCallback((e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    const gn = nodeById.get(id)
    if (!gn || gn.type === 'union') return
    if (selected?.id === id) { setSelected(null); return }
    const fp = allPeople.find(p => p.id === id)
    if (fp) {
      setSelected({ id: fp.id, name: fp.name, relationship: fp.relationship, side: fp.side, status: fp.status, country: fp.country, location: fp.location, notes: fp.notes })
      return
    }
    const wife = wifeById.get(id)
    if (wife) {
      setSelected({ id: wife.id, name: wife.fullName, relationship: gn.relationship ?? 'Grandmother', side: gn.side, status: 'unknown', notes: wife.notes })
    }
  }, [nodeById, selected])

  const handleDownload = useCallback(async () => {
    const el = containerRef.current
    if (!el) return
    try {
      const { toPng } = await import('html-to-image')
      const dataUrl = await toPng(el, { backgroundColor: '#ffffff' })
      const a = document.createElement('a')
      a.href = dataUrl
      a.download = 'family-tree-attempt-6.png'
      a.click()
    } catch { /* silently no-op */ }
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const cw = el.clientWidth  || 900
    const ch = el.clientHeight || 600
    const s  = Math.min((cw - 80) / svgW, (ch - 80) / svgH, 1)
    setScale(s)
    setTx((cw - svgW * s) / 2)
    setTy(40)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Edges ─────────────────────────────────────────────────────────────────
  const edgeElements: React.ReactNode[] = []

  // Wife-column edges: grandparent → wife (horizontal elbow), wife → children (vertical drop)
  for (const n of nodes) {
    if (n.type !== 'wife') continue
    const wifeRect = layout.get(n.id)
    if (!wifeRect) continue

    const srcEdge = edges.find(e => e.target === n.id)
    const color = srcEdge ? edgeColor(srcEdge, nodeById) : 'rgba(120,120,120,0.35)'

    // Grandparent → wife: drop from gp bottom to a shared rail, then drop into wife top
    if (srcEdge) {
      const gpRect = layout.get(srcEdge.source)
      if (gpRect) {
        const gpCx    = gpRect.x + gpRect.w / 2
        const gpBottom = gpRect.y + gpRect.h
        const wifeCx  = wifeRect.x + wifeRect.w / 2
        const wifeTop = wifeRect.y
        const railY   = gpBottom + (wifeTop - gpBottom) * 0.45
        const d = `M ${gpCx} ${gpBottom} L ${gpCx} ${railY} L ${wifeCx} ${railY} L ${wifeCx} ${wifeTop}`
        edgeElements.push(
          <path key={`gp-wife-${n.id}`} d={d} stroke={color} fill="none" strokeWidth={1.5} strokeDasharray="5 4" />
        )
      }
    }

    // Wife → children: vertical drop with horizontal jog to each child
    const childIds = edges.filter(e => e.source === n.id && e.edgeType === 'union-to-child').map(e => e.target)
    const wifeCx     = wifeRect.x + wifeRect.w / 2
    const wifeBottom = wifeRect.y + wifeRect.h

    for (const childId of childIds) {
      const cr = layout.get(childId)
      if (!cr) continue
      const childCx  = cr.x + cr.w / 2
      const childTop = cr.y
      const midY = wifeBottom + (childTop - wifeBottom) * 0.5
      const d = `M ${wifeCx} ${wifeBottom} L ${wifeCx} ${midY} L ${childCx} ${midY} L ${childCx} ${childTop}`
      edgeElements.push(
        <path key={`wife-child-${n.id}-${childId}`} d={d} stroke={color} fill="none" strokeWidth={1.2} />
      )
    }
  }

  // Union-node edges (unknown wife)
  for (const n of nodes) {
    if (n.type !== 'union') continue
    const childIds = edges.filter(e => e.source === n.id && e.edgeType === 'union-to-child').map(e => e.target)
    const srcEdge = edges.find(e => e.target === n.id)
    if (!srcEdge) continue
    const gpRect = layout.get(srcEdge.source)
    const color = edgeColor(srcEdge, nodeById)
    if (!gpRect) continue
    const gpCx = gpRect.x + gpRect.w / 2
    const gpBottom = gpRect.y + gpRect.h

    for (const childId of childIds) {
      const cr = layout.get(childId)
      if (!cr) continue
      const childCx = cr.x + cr.w / 2
      const childTop = cr.y
      const midY = gpBottom + (childTop - gpBottom) * 0.5
      const d = `M ${gpCx} ${gpBottom} L ${gpCx} ${midY} L ${childCx} ${midY} L ${childCx} ${childTop}`
      edgeElements.push(
        <path key={`union-${n.id}-${childId}`} d={d} stroke={color} fill="none" strokeWidth={1.2} strokeDasharray="4 3" />
      )
    }
  }

  // Direct edges (parent → Brighton)
  for (const e of edges) {
    if (e.edgeType !== 'direct') continue
    const src = layout.get(e.source)
    const tgt = layout.get(e.target)
    if (!src || !tgt) continue
    const color  = edgeColor(e, nodeById)
    const srcCx  = src.x + src.w / 2
    const tgtCx  = tgt.x + tgt.w / 2
    const srcBottom = src.y + src.h
    const tgtTop    = tgt.y
    const midY = srcBottom + (tgtTop - srcBottom) * 0.5
    const d = `M ${srcCx} ${srcBottom} C ${srcCx} ${midY}, ${tgtCx} ${midY}, ${tgtCx} ${tgtTop}`
    edgeElements.push(<path key={e.id} d={d} stroke={color} fill="none" strokeWidth={1.5} />)
  }

  // ── Nodes ─────────────────────────────────────────────────────────────────
  const nodeElements: React.ReactNode[] = []

  for (const n of nodes) {
    if (n.type === 'union') continue
    const r = layout.get(n.id)
    if (!r) continue

    const isEgo = n.id === 'brighton'
    const { bg, border, text } = nodeColors(n, isEgo)
    const dead       = n.status === 'deceased'
    const isSelected = selected?.id === n.id

    if (n.type === 'wife') {
      nodeElements.push(
        <g key={n.id} onClick={(e) => handleNodeClick(e, n.id)} style={{ cursor: 'pointer' }} opacity={dead ? 0.4 : 1}>
          <ellipse
            cx={r.x + r.w / 2} cy={r.y + r.h / 2} rx={r.w / 2} ry={r.h / 2}
            fill={n.side === 'maternal' ? '#fffbeb' : n.side === 'paternal' ? '#eef2ff' : '#f5f5f5'}
            stroke={isSelected ? '#000' : (n.side === 'maternal' ? MATERNAL_BORDER : n.side === 'paternal' ? PATERNAL_BORDER : '#aaa')}
            strokeWidth={isSelected ? 2.5 : 2}
            strokeDasharray="5 4"
          />
          <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 4} textAnchor="middle" fontSize={9} fontWeight={600}
            fill={n.side === 'maternal' ? MATERNAL_TEXT : n.side === 'paternal' ? PATERNAL_TEXT : '#555'}
            fontFamily="var(--font-geist-sans), system-ui, sans-serif"
          >
            {n.label.length > 14 ? n.label.slice(0, 13) + '…' : n.label}
          </text>
        </g>
      )
    } else {
      nodeElements.push(
        <g key={n.id} onClick={(e) => handleNodeClick(e, n.id)} style={{ cursor: 'pointer' }} opacity={dead ? 0.45 : 1}>
          <rect
            x={r.x} y={r.y} width={r.w} height={r.h} rx={7} ry={7}
            fill={bg}
            stroke={isSelected ? '#000' : border}
            strokeWidth={isSelected ? 2.5 : isEgo ? 2.5 : 2}
          />
          <text x={r.x + r.w / 2} y={r.y + r.h / 2 + 4} textAnchor="middle"
            fontSize={isEgo ? 12 : 10} fontWeight={700} fill={text}
            fontFamily="var(--font-geist-sans), system-ui, sans-serif"
            textDecoration={dead ? 'line-through' : undefined}
          >
            {n.label.length > 16 ? n.label.slice(0, 15) + '…' : n.label}
          </text>
        </g>
      )
    }
  }

  return (
    <div className="flex flex-col gap-3 h-full p-3">
      {/* Legend + download */}
      <div className="flex items-center gap-4 shrink-0 text-[10px] text-black/40 select-none">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-sm" style={{ background: MATERNAL_BG, border: `1px solid ${MATERNAL_BORDER}` }} />
          maternal
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-sm" style={{ background: PATERNAL_BG, border: `1px solid ${PATERNAL_BORDER}` }} />
          paternal
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2 h-2 rounded-sm bg-[#111]" />
          Brighton
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-7 border-t border-dashed border-black/30" />
          wife / grandmother
        </span>
        <button
          onClick={handleDownload}
          className="ml-auto text-xs px-3 py-1.5 rounded-full border border-black/15 text-black/50 hover:text-black/70 hover:border-black/25 transition-colors flex items-center gap-1.5"
        >
          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 1v7M3 5l3 3 3-3M1 10h10" />
          </svg>
          save as image
        </button>
      </div>

      {/* Canvas */}
      <div
        ref={containerRef}
        className="relative flex-1 min-h-0 rounded-xl overflow-hidden select-none"
        style={{ background: '#ffffff', cursor: isDragging ? 'grabbing' : 'grab' }}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onClick={() => setSelected(null)}
      >
        <svg width="100%" height="100%" style={{ display: 'block' }}>
          <g transform={`translate(${tx},${ty}) scale(${scale})`}>
            {edgeElements}
            {nodeElements}
          </g>
        </svg>
        {selected && <DetailPanel node={selected} onClose={() => setSelected(null)} />}
      </div>
    </div>
  )
}
