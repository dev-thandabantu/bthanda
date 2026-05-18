'use client'

import { useEffect, useState, useCallback, memo } from 'react'
import {
  ReactFlow,
  ReactFlowProvider,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  useReactFlow,
  getNodesBounds,
  getViewportForBounds,
  type Node,
  type Edge,
  type NodeProps,
  BackgroundVariant,
  Handle,
  Position,
} from '@xyflow/react'
import { toPng } from 'html-to-image'
import '@xyflow/react/dist/style.css'
import { buildFamilyGraph, wifeById } from '@/data/family-graph'
import type { GraphNode, GraphEdge } from '@/data/family-graph'
import { allPeople } from '@/data/family'

// ── Accent colours ────────────────────────────────────────────────────────────
const MATERNAL = '#eab308'
const PATERNAL = '#818cf8'
const EGO = '#ffffff'

function accent(side?: string) {
  if (side === 'maternal') return MATERNAL
  if (side === 'paternal') return PATERNAL
  return EGO
}

// ── ELK layout ────────────────────────────────────────────────────────────────
const NODE_W = 130
const NODE_H = 40
const WIFE_W = 110
const WIFE_H = 36
const UNION_W = 1
const UNION_H = 1

async function runElkLayout(
  graphNodes: GraphNode[],
  graphEdges: GraphEdge[],
): Promise<{ nodes: Node[]; edges: Edge[] }> {
  const ELK = (await import('elkjs/lib/elk.bundled.js')).default
  const elk = new ELK()

  const elkNodes = graphNodes.map(n => ({
    id: n.id,
    width:  n.type === 'union' ? UNION_W : n.type === 'wife' ? WIFE_W : NODE_W,
    height: n.type === 'union' ? UNION_H : n.type === 'wife' ? WIFE_H : NODE_H,
  }))

  const elkEdges = graphEdges.map(e => ({
    id: e.id,
    sources: [e.source],
    targets: [e.target],
  }))

  const graph = await elk.layout({
    id: 'root',
    layoutOptions: {
      'elk.algorithm': 'layered',
      'elk.direction': 'DOWN',
      'elk.layered.spacing.nodeNodeBetweenLayers': '80',
      'elk.spacing.nodeNode': '28',
      'elk.layered.crossingMinimization.strategy': 'LAYER_SWEEP',
      'elk.layered.nodePlacement.strategy': 'BRANDES_KOEPF',
    },
    children: elkNodes,
    edges: elkEdges,
  })

  const nodeById = new Map(graphNodes.map(n => [n.id, n]))

  const rfNodes: Node[] = (graph.children ?? []).map(en => {
    const gn = nodeById.get(en.id)!
    return {
      id: en.id,
      position: { x: en.x ?? 0, y: en.y ?? 0 },
      data: gn as unknown as Record<string, unknown>,
      type: gn.type === 'union' ? 'unionNode' : gn.type === 'wife' ? 'wifeNode' : 'personNode',
      selectable: gn.type !== 'union',
    }
  })

  const rfEdges: Edge[] = graphEdges.map(e => ({
    id: e.id,
    source: e.source,
    target: e.target,
    type: 'smoothstep',
    style: {
      stroke: e.edgeType === 'spouse-to-union'
        ? 'rgba(255,255,255,0.1)'
        : 'rgba(148,163,184,0.2)',
      strokeWidth: 1,
      strokeDasharray: e.edgeType === 'spouse-to-union' ? '4 3' : undefined,
    },
    animated: false,
  }))

  return { nodes: rfNodes, edges: rfEdges }
}

// ── Custom node components ────────────────────────────────────────────────────

const PersonNode = memo(({ data, selected }: NodeProps) => {
  const gn = data as unknown as GraphNode
  const a = accent(gn.side)
  const isEgo = gn.id === 'brighton'
  const dead = gn.status === 'deceased'

  return (
    <div
      style={{
        width: NODE_W,
        height: NODE_H,
        borderRadius: 8,
        border: `${isEgo ? 1.5 : 1}px ${selected ? 'solid' : 'solid'}`,
        borderColor: selected ? EGO : `${a}${isEgo ? 'cc' : '55'}`,
        background: isEgo ? 'rgba(255,255,255,0.08)' : `${a}0a`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: dead ? 0.35 : 1,
        cursor: 'grab',
        boxShadow: selected ? `0 0 0 1px ${a}66` : undefined,
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: 'none' }} />
      <span style={{
        fontSize: isEgo ? 11 : 10,
        color: isEgo ? 'rgba(255,255,255,0.92)' : `${a}dd`,
        fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: NODE_W - 12,
        textAlign: 'center',
        textDecoration: dead ? 'line-through' : undefined,
      }}>
        {gn.label}
      </span>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: 'none' }} />
    </div>
  )
})
PersonNode.displayName = 'PersonNode'

const WifeNode = memo(({ data, selected }: NodeProps) => {
  const gn = data as unknown as GraphNode
  const a = accent(gn.side)

  return (
    <div
      style={{
        width: WIFE_W,
        height: WIFE_H,
        borderRadius: WIFE_H / 2,
        border: `1px dashed ${a}44`,
        background: `${a}06`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'grab',
        boxShadow: selected ? `0 0 0 1px ${a}55` : undefined,
      }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: 'none' }} />
      <span style={{
        fontSize: 9,
        color: `${a}88`,
        fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        maxWidth: WIFE_W - 10,
        textAlign: 'center',
      }}>
        {gn.label}
      </span>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: 'none' }} />
    </div>
  )
})
WifeNode.displayName = 'WifeNode'

const UnionNode = memo(() => (
  <div style={{ width: UNION_W, height: UNION_H, opacity: 0 }}>
    <Handle type="target" position={Position.Top} style={{ opacity: 0, pointerEvents: 'none' }} />
    <Handle type="source" position={Position.Bottom} style={{ opacity: 0, pointerEvents: 'none' }} />
  </div>
))
UnionNode.displayName = 'UnionNode'

const nodeTypes = { personNode: PersonNode, wifeNode: WifeNode, unionNode: UnionNode }

// ── Detail panel ──────────────────────────────────────────────────────────────
interface SelectedNode { id: string; name: string; relationship: string; side?: string; status?: string; country?: string; location?: string; notes?: string }

function DetailPanel({ node, onClose }: { node: SelectedNode; onClose: () => void }) {
  const a = accent(node.side)
  return (
    <div className="absolute top-3 right-3 w-56 rounded-2xl border border-white/[0.06] flex flex-col overflow-hidden z-10" style={{ background: '#0d0d12' }}>
      <div style={{ height: 3, background: `linear-gradient(90deg, ${a}bb, transparent)` }} />
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-4">
          <div>
            <p className="font-semibold text-sm leading-tight" style={{ color: a }}>{node.name}</p>
            <p className="text-white/35 text-xs mt-0.5">{node.relationship}</p>
          </div>
          <button onClick={onClose} className="text-white/20 hover:text-white/50 transition-colors shrink-0 mt-0.5">
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M2 2l10 10M12 2L2 12" /></svg>
          </button>
        </div>
        <div className="space-y-2">
          {node.status && <Row label="status"><span className={node.status === 'deceased' ? 'line-through text-white/20' : 'text-white/55'}>{node.status}</span></Row>}
          {node.country && <Row label="country"><span className="text-white/55">{node.country}</span></Row>}
          {node.location && <Row label="location"><span className="text-white/55">{node.location}</span></Row>}
          {node.side && <Row label="side"><span style={{ color: a }}>{node.side}</span></Row>}
        </div>
        {node.notes && <p className="text-white/25 text-xs leading-relaxed mt-4 pt-4 border-t border-white/[0.05]">{node.notes}</p>}
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

// ── Download helper ───────────────────────────────────────────────────────────
function DownloadButton({ getNodes }: { getNodes: () => Node[] }) {
  const { getViewport } = useReactFlow()

  const download = useCallback(async () => {
    const viewport = document.querySelector('.react-flow__viewport') as HTMLElement | null
    if (!viewport) return

    const nodes = getNodes().filter(n => n.type !== 'unionNode')
    const bounds = getNodesBounds(nodes)
    const padding = 60
    const imgW = Math.round(bounds.width + padding * 2)
    const imgH = Math.round(bounds.height + padding * 2)

    const vp = getViewport()
    const transform = getViewportForBounds(bounds, imgW, imgH, 0.05, 4, padding / imgW)

    const dataUrl = await toPng(viewport, {
      backgroundColor: '#080810',
      width: imgW,
      height: imgH,
      style: {
        width: `${imgW}px`,
        height: `${imgH}px`,
        transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.zoom})`,
        transformOrigin: 'top left',
      },
    })

    void vp // suppress unused warning
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = 'family-tree-attempt-4.png'
    a.click()
  }, [getNodes, getViewport])

  return (
    <button
      onClick={download}
      className="text-xs px-3 py-1.5 rounded-full border border-white/15 text-white/50 hover:text-white/70 hover:border-white/25 transition-colors flex items-center gap-1.5"
    >
      <svg width="11" height="11" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 1v7M3 5l3 3 3-3M1 10h10" />
      </svg>
      save as image
    </button>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────
function FamilyFlowInner() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [selected, setSelected] = useState<SelectedNode | null>(null)
  const [loading, setLoading] = useState(true)
  const { getNodes } = useReactFlow()

  useEffect(() => {
    const { nodes: gn, edges: ge } = buildFamilyGraph()
    runElkLayout(gn, ge).then(({ nodes: rn, edges: re }) => {
      setNodes(rn)
      setEdges(re)
      setLoading(false)
    })
  }, [setNodes, setEdges])

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    const gn = node.data as unknown as GraphNode
    if (gn.type === 'union') return

    let resolved: SelectedNode | null = null

    const fp = allPeople.find(p => p.id === gn.id)
    if (fp) {
      resolved = { id: fp.id, name: fp.name, relationship: fp.relationship, side: fp.side, status: fp.status, country: fp.country, location: fp.location, notes: fp.notes }
    } else {
      const wife = wifeById.get(gn.id)
      if (wife) resolved = { id: wife.id, name: wife.fullName, relationship: gn.relationship ?? 'Great-grandmother', side: gn.side, status: 'unknown', notes: wife.notes }
    }

    setSelected(prev => prev?.id === gn.id ? null : resolved)
  }, [])

  const onPaneClick = useCallback(() => setSelected(null), [])

  return (
    <div className="flex flex-col gap-3 h-full">
      {/* Legend + download */}
      <div className="flex items-center gap-4 shrink-0 text-[10px] text-white/20">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{ background: 'rgba(234,179,8,0.5)' }} />maternal</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{ background: 'rgba(129,140,248,0.5)' }} />paternal</span>
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-sm" style={{ background: 'rgba(255,255,255,0.5)' }} />Brighton</span>
        <span className="flex items-center gap-1.5"><span className="w-8 border-t border-dashed border-white/20" />wife / grandmother</span>
        <div className="ml-auto">
          <DownloadButton getNodes={getNodes} />
        </div>
      </div>

      {/* Canvas */}
      <div className="relative flex-1 min-h-0 rounded-xl overflow-hidden border border-white/[0.06]" style={{ background: '#080810' }}>
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center text-white/20 text-sm z-10">
            Computing layout…
          </div>
        )}
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.12 }}
          minZoom={0.03}
          maxZoom={3}
          nodesDraggable={true}
          nodesConnectable={false}
          elementsSelectable={true}
          colorMode="dark"
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={1} color="rgba(255,255,255,0.04)" />
          <Controls showInteractive={false} style={{ background: 'rgba(13,13,18,0.9)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 8 }} />
        </ReactFlow>
        {selected && <DetailPanel node={selected} onClose={() => setSelected(null)} />}
      </div>
    </div>
  )
}

export default function FamilyFlow() {
  return (
    <ReactFlowProvider>
      <FamilyFlowInner />
    </ReactFlowProvider>
  )
}
