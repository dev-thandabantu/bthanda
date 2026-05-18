'use client'

import { useRef, useState, useCallback, useEffect } from 'react'
import { buildFamilyGraph, wifeById } from '@/data/family-graph'
import type { GraphNode, GraphEdge } from '@/data/family-graph'
import { allPeople } from '@/data/family'

// ── Colours (matches attempt-4) ───────────────────────────────────────────────
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
  if (isEgo)                        return { bg: EGO_BG,      border: '#444',          text: EGO_TEXT        }
  if (gn.side === 'maternal')       return { bg: MATERNAL_BG, border: MATERNAL_BORDER, text: MATERNAL_TEXT   }
  if (gn.side === 'paternal')       return { bg: PATERNAL_BG, border: PATERNAL_BORDER, text: PATERNAL_TEXT   }
  return                                   { bg: NEUTRAL_BG,  border: NEUTRAL_BORDER,  text: NEUTRAL_TEXT    }
}

function accentColor(side?: string) {
  if (side === 'maternal') return MATERNAL_BORDER
  if (side === 'paternal') return PATERNAL_BORDER
  return '#555'
}

// ── Layout constants ──────────────────────────────────────────────────────────
const NODE_W      = 140
const NODE_H      = 44
const WIFE_W      = 120
const WIFE_H      = 40
const H_GAP       = 18   // gap between siblings in a cluster
const CLUSTER_GAP = 48   // gap between wife-clusters under same grandparent
const GP_GAP      = 120  // gap between the two grandparent subtrees
const ROW_H       = 160  // vertical distance between generation rows

// ── Layout types ──────────────────────────────────────────────────────────────
interface Rect { x: number; y: number; w: number; h: number }
type Layout = Map<string, Rect>

// ── Layout engine ─────────────────────────────────────────────────────────────

function generationY(gen: number): number {
  // gen -3 → row 0, gen -2 → row 1, gen -1 → row 2, gen 0 → row 3, gen 1 → row 4 …
  return (gen + 3) * ROW_H
}

/**
 * Lay out a flat list of nodes left-to-right with H_GAP spacing.
 * Returns the total width occupied and mutates `layout`.
 */
function placeRow(ids: string[], cx: number, y: number, w: number, h: number, layout: Layout): number {
  if (ids.length === 0) return 0
  const totalW = ids.length * w + (ids.length - 1) * H_GAP
  let x = cx - totalW / 2
  for (const id of ids) {
    layout.set(id, { x, y, w, h })
    x += w + H_GAP
  }
  return totalW
}

/**
 * Lay out one wife-cluster: wife node centred above her children.
 * Returns the total width of the cluster.
 */
function placeCluster(
  wifeId: string | null,
  childIds: string[],
  cx: number,
  wifeY: number,
  childY: number,
  layout: Layout,
): number {
  const childrenW = childIds.length * NODE_W + Math.max(0, childIds.length - 1) * H_GAP

  // wife node width may differ
  const wW = wifeId ? WIFE_W : 0
  const clusterW = Math.max(childrenW, wW)

  if (wifeId) {
    layout.set(wifeId, { x: cx - WIFE_W / 2, y: wifeY + (NODE_H - WIFE_H) / 2, w: WIFE_W, h: WIFE_H })
  }

  // children centred under the cluster cx
  let x = cx - childrenW / 2
  for (const cid of childIds) {
    layout.set(cid, { x, y: childY, w: NODE_W, h: NODE_H })
    x += NODE_W + H_GAP
  }

  return clusterW
}

interface Cluster { wifeId: string | null; childIds: string[] }

/**
 * Collect the wife-clusters for a grandparent: groups of children that share
 * the same wife node (or fall under a union node).
 */
function clustersFor(gpId: string, nodes: GraphNode[], edges: GraphEdge[]): Cluster[] {
  const nodeById = new Map(nodes.map(n => [n.id, n]))

  // edges from grandparent
  const gpEdges = edges.filter(e => e.source === gpId)

  // direct children (no wife/union intermediary)
  const directChildren = gpEdges
    .filter(e => e.edgeType === 'direct')
    .map(e => e.target)

  // wife/union intermediaries
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

    clusters.push({
      wifeId: intNode.type === 'wife' ? intId : null,
      childIds: children,
    })
  }

  if (directChildren.length > 0) {
    clusters.push({ wifeId: null, childIds: directChildren })
  }

  return clusters
}

/**
 * Lay out all clusters for a grandparent horizontally, return total width and
 * the x centre of the grandparent (midpoint of all clusters).
 */
function placeGrandparentSubtree(
  gpId: string,
  clusters: Cluster[],
  startX: number,
  nodes: GraphNode[],
  layout: Layout,
): { totalW: number; gpCx: number } {
  const gpNode = nodes.find(n => n.id === gpId)
  if (!gpNode) return { totalW: 0, gpCx: startX }

  const gpY = generationY(gpNode.generation)
  const wifeY = gpY + ROW_H * 0.45   // wives sit between grandparent row and child row
  const childY = generationY(gpNode.generation + 1)

  // First pass: measure each cluster width
  const clusterWidths = clusters.map(c => {
    const childrenW = c.childIds.length * NODE_W + Math.max(0, c.childIds.length - 1) * H_GAP
    return Math.max(childrenW, c.wifeId ? WIFE_W : 0)
  })
  const totalClusters = clusterWidths.reduce((s, w) => s + w, 0)
  const totalW = totalClusters + Math.max(0, clusters.length - 1) * CLUSTER_GAP
  const gpCx = startX + totalW / 2

  // Second pass: place clusters
  let cx = startX + clusterWidths[0] / 2
  for (let i = 0; i < clusters.length; i++) {
    placeCluster(clusters[i].wifeId, clusters[i].childIds, cx, wifeY, childY, layout)
    if (i + 1 < clusters.length) {
      cx += clusterWidths[i] / 2 + CLUSTER_GAP + clusterWidths[i + 1] / 2
    }
  }

  // Place grandparent centred over all clusters
  layout.set(gpId, { x: gpCx - NODE_W / 2, y: gpY, w: NODE_W, h: NODE_H })

  return { totalW, gpCx }
}

/**
 * Main layout function. Returns a Map<id, Rect> for every non-union node.
 * Union nodes get a 1×1 rect at the midpoint between grandparent and wife.
 */
export function computeLayout(nodes: GraphNode[], edges: GraphEdge[]): Layout {
  const layout: Layout = new Map()
  const nodeById = new Map(nodes.map(n => [n.id, n]))

  const maternalClusters = clustersFor('ifraim-musabani', nodes, edges)
  const paternalClusters = clustersFor('wilson-maphutukezi', nodes, edges)

  // Place maternal subtree starting at x=0
  const { totalW: matW, gpCx: matGpCx } = placeGrandparentSubtree(
    'ifraim-musabani', maternalClusters, 0, nodes, layout,
  )

  // Place paternal subtree after a gap
  const patStartX = matW + GP_GAP
  const { totalW: _patW, gpCx: patGpCx } = placeGrandparentSubtree(
    'wilson-maphutukezi', paternalClusters, patStartX, nodes, layout,
  )

  // Place Brighton between his two parents (gen 0 y)
  const brightonY = generationY(0)
  const maternalParent = layout.get('beauty-pakaisai')
  const paternalParent = layout.get('dennis-maphutukezi')
  const brightonCx = maternalParent && paternalParent
    ? ((maternalParent.x + maternalParent.w / 2) + (paternalParent.x + paternalParent.w / 2)) / 2
    : (matGpCx + patGpCx) / 2
  layout.set('brighton', { x: brightonCx - NODE_W / 2, y: brightonY, w: NODE_W, h: NODE_H })

  // Place any gen-0 siblings/cousins not yet placed (direct children of parents)
  // They were placed under their parent clusters above; just verify & fill gaps for
  // any nodes that slipped through (e.g. half-siblings under dennis)
  for (const n of nodes) {
    if (layout.has(n.id)) continue
    if (n.type === 'union') {
      // Place union as invisible point — midpoint between its source and first target
      const srcEdge = edges.find(e => e.target === n.id)
      const tgtEdge = edges.find(e => e.source === n.id)
      if (srcEdge && tgtEdge) {
        const src = layout.get(srcEdge.source)
        const tgt = layout.get(tgtEdge.target)
        if (src && tgt) {
          const ux = (src.x + src.w / 2 + tgt.x + tgt.w / 2) / 2
          const uy = (src.y + src.h / 2 + tgt.y + tgt.h / 2) / 2
          layout.set(n.id, { x: ux - 0.5, y: uy - 0.5, w: 1, h: 1 })
          continue
        }
      }
      layout.set(n.id, { x: 0, y: 0, w: 1, h: 1 })
      continue
    }
    // Remaining persons: place by generation at far right
    const y = generationY(n.generation)
    const existing = [...layout.values()].filter(r => r.y === y)
    const maxX = existing.length ? Math.max(...existing.map(r => r.x + r.w)) : 0
    layout.set(n.id, { x: maxX + H_GAP, y, w: NODE_W, h: NODE_H })
  }

  void nodeById // suppress unused warning

  return layout
}

// ── Edge path helpers ─────────────────────────────────────────────────────────

function edgeColor(e: GraphEdge, nodes: Map<string, GraphNode>): string {
  const src = nodes.get(e.source)
  if (!src) return 'rgba(120,120,120,0.4)'
  if (src.side === 'maternal') return 'rgba(180,83,9,0.35)'
  if (src.side === 'paternal') return 'rgba(67,56,202,0.35)'
  return 'rgba(120,120,120,0.35)'
}

/**
 * For a wife node and its children, render the kinship bracket:
 * vertical drop from wife to horizontal bar, then drops to each child.
 */
function renderBracket(
  wifeRect: Rect,
  childRects: Rect[],
  color: string,
  key: string,
): React.ReactNode {
  if (childRects.length === 0) return null
  const wifeCx = wifeRect.x + wifeRect.w / 2
  const wifeBottom = wifeRect.y + wifeRect.h

  const barY = wifeBottom + (childRects[0].y - wifeBottom) * 0.5
  const leftX  = childRects[0].x + childRects[0].w / 2
  const rightX = childRects[childRects.length - 1].x + childRects[childRects.length - 1].w / 2

  return (
    <g key={key} stroke={color} fill="none" strokeWidth={1.5}>
      {/* drop from wife to bar */}
      <line x1={wifeCx} y1={wifeBottom} x2={wifeCx} y2={barY} />
      {/* horizontal bar */}
      {childRects.length > 1 && <line x1={leftX} y1={barY} x2={rightX} y2={barY} />}
      {/* drops to each child */}
      {childRects.map((cr, i) => (
        <line key={i} x1={cr.x + cr.w / 2} y1={barY} x2={cr.x + cr.w / 2} y2={cr.y} />
      ))}
    </g>
  )
}

/**
 * Render a grandparent → wife/union dashed horizontal link.
 */
function renderSpouseEdge(
  gpRect: Rect,
  wifeRect: Rect,
  color: string,
  key: string,
): React.ReactNode {
  const gpBottom = gpRect.y + gpRect.h
  const gpCx = gpRect.x + gpRect.w / 2
  const wifeCx = wifeRect.x + wifeRect.w / 2
  const wifeTop = wifeRect.y

  // elbow: drop from gp bottom then go horizontal to wife
  const midY = gpBottom + (wifeTop - gpBottom) * 0.35
  const d = `M ${gpCx} ${gpBottom} L ${gpCx} ${midY} L ${wifeCx} ${midY} L ${wifeCx} ${wifeTop}`
  return (
    <path key={key} d={d} stroke={color} fill="none" strokeWidth={1.5} strokeDasharray="5 4" />
  )
}

// ── Detail panel (matches attempt-4) ─────────────────────────────────────────
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
          <button
            onClick={onClose}
            className="text-black/25 hover:text-black/60 transition-colors shrink-0 mt-0.5"
          >
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
export default function FamilyTreeSVG() {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selected, setSelected] = useState<SelectedNode | null>(null)

  // Viewport transform
  const [tx, setTx] = useState(40)
  const [ty, setTy] = useState(40)
  const [scale, setScale] = useState(0.55)
  const dragging = useRef(false)
  const lastPos  = useRef({ x: 0, y: 0 })

  // Build graph once
  const { nodes, edges } = buildFamilyGraph()
  const layout           = computeLayout(nodes, edges)
  const nodeById         = new Map(nodes.map(n => [n.id, n]))

  // Bounding box of the layout
  const rects = [...layout.values()]
  const svgW  = rects.reduce((m, r) => Math.max(m, r.x + r.w), 0) + 80
  const svgH  = rects.reduce((m, r) => Math.max(m, r.y + r.h), 0) + 80

  // ── Zoom + pan handlers ───────────────────────────────────────────────────
  const onWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const factor = e.deltaY < 0 ? 1.12 : 0.89
    setScale(s => Math.min(4, Math.max(0.06, s * factor)))
  }, [])

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    if ((e.target as Element).closest('rect,ellipse,text')) return
    dragging.current = true
    lastPos.current = { x: e.clientX, y: e.clientY };
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging.current) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    lastPos.current = { x: e.clientX, y: e.clientY }
    setTx(x => x + dx)
    setTy(y => y + dy)
  }, [])

  const onPointerUp = useCallback(() => { dragging.current = false }, [])

  // ── Node click ────────────────────────────────────────────────────────────
  const handleNodeClick = useCallback((id: string) => {
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

  // ── Download ──────────────────────────────────────────────────────────────
  const handleDownload = useCallback(async () => {
    const el = containerRef.current
    if (!el) return
    const { toPng } = await import('html-to-image')
    const dataUrl = await toPng(el, { backgroundColor: '#f8f7f4' })
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = 'family-tree-attempt-5.png'
    a.click()
  }, [])

  // ── Fit to container on mount ─────────────────────────────────────────────
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

  // ── Render edges ──────────────────────────────────────────────────────────
  const edgeElements: React.ReactNode[] = []

  // Group wife-bracket edges: for each wife node, find her children
  const renderedBrackets = new Set<string>()
  for (const n of nodes) {
    if (n.type !== 'wife') continue
    const wifeRect = layout.get(n.id)
    if (!wifeRect) continue
    const childIds = edges.filter(e => e.source === n.id && e.edgeType === 'union-to-child').map(e => e.target)
    const childRects = childIds.map(id => layout.get(id)).filter(Boolean) as Rect[]
    const srcEdge = edges.find(e => e.target === n.id)
    const color = srcEdge ? edgeColor(srcEdge, nodeById) : 'rgba(120,120,120,0.35)'
    edgeElements.push(renderBracket(wifeRect, childRects, color, `bracket-${n.id}`))
    renderedBrackets.add(n.id)
    // Spouse edge (grandparent → wife)
    if (srcEdge) {
      const gpRect = layout.get(srcEdge.source)
      if (gpRect) edgeElements.push(renderSpouseEdge(gpRect, wifeRect, color, `spouse-${n.id}`))
    }
    childIds.forEach(id => renderedBrackets.add(id))
    renderedBrackets.add(n.id)
  }

  // Union-node brackets (when wife is unknown)
  for (const n of nodes) {
    if (n.type !== 'union') continue
    const childIds = edges.filter(e => e.source === n.id && e.edgeType === 'union-to-child').map(e => e.target)
    const childRects = childIds.map(id => layout.get(id)).filter(Boolean) as Rect[]
    const srcEdge = edges.find(e => e.target === n.id)
    const gpId = srcEdge?.source
    const gpRect = gpId ? layout.get(gpId) : undefined
    const color = srcEdge ? edgeColor(srcEdge, nodeById) : 'rgba(120,120,120,0.35)'

    if (gpRect && childRects.length > 0) {
      const gpBottom = gpRect.y + gpRect.h
      const gpCx = gpRect.x + gpRect.w / 2
      const barY = gpBottom + (childRects[0].y - gpBottom) * 0.5
      const leftX  = childRects[0].x + childRects[0].w / 2
      const rightX = childRects[childRects.length - 1].x + childRects[childRects.length - 1].w / 2
      edgeElements.push(
        <g key={`union-${n.id}`} stroke={color} fill="none" strokeWidth={1.5} strokeDasharray="5 4">
          <line x1={gpCx} y1={gpBottom} x2={gpCx} y2={barY} />
          {childRects.length > 1 && <line x1={leftX} y1={barY} x2={rightX} y2={barY} />}
          {childRects.map((cr, i) => <line key={i} x1={cr.x + cr.w / 2} y1={barY} x2={cr.x + cr.w / 2} y2={cr.y} />)}
        </g>
      )
    }
  }

  // Direct parent→child edges
  for (const e of edges) {
    if (e.edgeType !== 'direct') continue
    const src = layout.get(e.source)
    const tgt = layout.get(e.target)
    if (!src || !tgt) continue
    const srcNode = nodeById.get(e.source)
    const color = edgeColor(e, nodeById)
    const srcCx = src.x + src.w / 2
    const tgtCx = tgt.x + tgt.w / 2
    const srcBottom = src.y + src.h
    const tgtTop    = tgt.y

    if (e.target === 'brighton') {
      // Draw curved lines from each parent to Brighton
      const midY = srcBottom + (tgtTop - srcBottom) * 0.5
      const d = `M ${srcCx} ${srcBottom} C ${srcCx} ${midY}, ${tgtCx} ${midY}, ${tgtCx} ${tgtTop}`
      edgeElements.push(<path key={e.id} d={d} stroke={color} fill="none" strokeWidth={1.5} />)
    } else if (srcNode?.type === 'person') {
      // Standard parent→child straight drop with horizontal jog
      const midY = srcBottom + (tgtTop - srcBottom) * 0.5
      const d = `M ${srcCx} ${srcBottom} L ${srcCx} ${midY} L ${tgtCx} ${midY} L ${tgtCx} ${tgtTop}`
      edgeElements.push(<path key={e.id} d={d} stroke={color} fill="none" strokeWidth={1.5} />)
    }
  }

  // ── Render nodes ──────────────────────────────────────────────────────────
  const nodeElements: React.ReactNode[] = []

  for (const n of nodes) {
    if (n.type === 'union') continue
    const r = layout.get(n.id)
    if (!r) continue

    const isEgo = n.id === 'brighton'
    const { bg, border, text } = nodeColors(n, isEgo)
    const dead = n.status === 'deceased'
    const isSelected = selected?.id === n.id

    if (n.type === 'wife') {
      nodeElements.push(
        <g
          key={n.id}
          onClick={() => handleNodeClick(n.id)}
          style={{ cursor: 'pointer' }}
          opacity={dead ? 0.4 : 1}
        >
          <ellipse
            cx={r.x + r.w / 2} cy={r.y + r.h / 2}
            rx={r.w / 2}        ry={r.h / 2}
            fill={n.side === 'maternal' ? '#fffbeb' : n.side === 'paternal' ? '#eef2ff' : '#f5f5f5'}
            stroke={isSelected ? '#000' : (n.side === 'maternal' ? MATERNAL_BORDER : n.side === 'paternal' ? PATERNAL_BORDER : '#aaa')}
            strokeWidth={isSelected ? 2.5 : 2}
            strokeDasharray="5 4"
          />
          <text
            x={r.x + r.w / 2} y={r.y + r.h / 2 + 4}
            textAnchor="middle"
            fontSize={10}
            fontWeight={600}
            fill={n.side === 'maternal' ? MATERNAL_TEXT : n.side === 'paternal' ? PATERNAL_TEXT : '#555'}
            fontFamily="var(--font-geist-sans), system-ui, sans-serif"
          >
            {n.label.length > 14 ? n.label.slice(0, 13) + '…' : n.label}
          </text>
        </g>
      )
    } else {
      // Person node
      nodeElements.push(
        <g
          key={n.id}
          onClick={() => handleNodeClick(n.id)}
          style={{ cursor: 'pointer' }}
          opacity={dead ? 0.45 : 1}
        >
          <rect
            x={r.x} y={r.y} width={r.w} height={r.h}
            rx={7} ry={7}
            fill={bg}
            stroke={isSelected ? '#000' : border}
            strokeWidth={isSelected ? 2.5 : isEgo ? 2.5 : 2}
          />
          <text
            x={r.x + r.w / 2} y={r.y + r.h / 2 + 4}
            textAnchor="middle"
            fontSize={isEgo ? 12 : 11}
            fontWeight={700}
            fill={text}
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
      <div className="flex items-center gap-4 shrink-0 text-[10px] text-white/40 select-none">
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
          <span className="inline-block w-7 border-t border-dashed border-white/30" />
          wife / grandmother
        </span>
        <button
          onClick={handleDownload}
          className="ml-auto text-xs px-3 py-1.5 rounded-full border border-white/15 text-white/50 hover:text-white/70 hover:border-white/25 transition-colors flex items-center gap-1.5"
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
        style={{ background: '#f8f7f4', cursor: dragging.current ? 'grabbing' : 'grab' }}
        onWheel={onWheel}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
        onClick={() => setSelected(null)}
      >
        <svg
          width="100%"
          height="100%"
          style={{ display: 'block' }}
        >
          <g transform={`translate(${tx},${ty}) scale(${scale})`}>
            {edgeElements}
            {nodeElements}
          </g>
        </svg>
        {selected && (
          <DetailPanel
            node={selected}
            onClose={() => setSelected(null)}
          />
        )}
      </div>
    </div>
  )
}
