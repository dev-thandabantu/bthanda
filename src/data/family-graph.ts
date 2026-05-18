/**
 * Shared graph builder — converts family.ts into a flat node/edge list.
 * Used by attempt-3 (Cytoscape) and attempt-4 (React Flow + ELK).
 *
 * Data model:
 *   grandparent → wife → [children…]   (when wife is known)
 *   grandparent → union-node → [children…]  (when wife unknown)
 *   person → [descendants…]  (direct parent-child below grandparent level)
 */

import type { FamilyPerson } from './family-types'
import { familyTree, wivesOf } from './family'
import type { Wife } from './family'

export type NodeType = 'person' | 'wife' | 'union'
export type EdgeType = 'spouse-to-union' | 'union-to-child' | 'direct'
export type Side = 'maternal' | 'paternal' | 'both'

export interface GraphNode {
  id: string
  label: string
  type: NodeType
  side?: Side
  status?: string
  generation: number
  relationship?: string
  notes?: string
  /** Full name — populated for wife nodes */
  fullName?: string
}

export interface GraphEdge {
  id: string
  source: string
  target: string
  edgeType: EdgeType
}

// ── Wife lookup ───────────────────────────────────────────────────────────────

export const wifeById = new Map<string, Wife>()
for (const wives of Object.values(wivesOf)) {
  for (const w of wives) wifeById.set(w.id, w)
}

const wifeKeyToId: Record<string, Record<string, string>> = {
  'ifraim-musabani': {
    'Bhesi':      'wife-ifraim-bhesi',
    'aMutigo':    'wife-ifraim-amutigo',
    'aNgarika':   'wife-ifraim-angarika',
    'Makhuya':    'wife-ifraim-amakhuya',
    'Musarisari': 'wife-ifraim-amusarisari',
  },
  'wilson-maphutukezi': {
    'Wife 1': 'wife-wilson-ester',
    'Wife 2': 'wife-wilson-dzakatsumbe',
    'Wife 3': 'wife-wilson-wife3',
  },
}

function extractWifeKey(relationship: string): string | null {
  const wifeNum = relationship.match(/\(Wife (\d+)\)/)
  if (wifeNum) return `Wife ${wifeNum[1]}`
  const line = relationship.match(/\(([^)]+) line\)/)
  if (line) return line[1]
  if (relationship.includes('Ngarika')) return 'aNgarika'
  return null
}

function groupByWife(children: FamilyPerson[]): Map<string, FamilyPerson[]> {
  const groups = new Map<string, FamilyPerson[]>()
  for (const child of children) {
    const key = extractWifeKey(child.relationship) ?? '__direct'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(child)
  }
  return groups
}

// ── Builder ───────────────────────────────────────────────────────────────────

export function buildFamilyGraph(): { nodes: GraphNode[]; edges: GraphEdge[] } {
  const nodes: GraphNode[] = []
  const edges: GraphEdge[] = []
  const seen = new Set<string>()

  function addNode(n: GraphNode) {
    if (seen.has(n.id)) return
    seen.add(n.id)
    nodes.push(n)
  }

  function addEdge(source: string, target: string, edgeType: EdgeType) {
    const id = `${source}--${target}`
    if (seen.has(id)) return
    seen.add(id)
    edges.push({ id, source, target, edgeType })
  }

  function addPerson(p: FamilyPerson) {
    addNode({
      id: p.id,
      label: p.displayName,
      type: 'person',
      side: p.side as Side,
      status: p.status,
      generation: p.generation,
      relationship: p.relationship,
      notes: p.notes,
    })
  }

  function addWife(w: Wife, side: 'maternal' | 'paternal', generation: number) {
    addNode({
      id: w.id,
      label: w.displayName,
      fullName: w.fullName,
      type: 'wife',
      side,
      status: 'unknown',
      generation,
      relationship: `${side === 'maternal' ? 'Maternal' : 'Paternal'} great-grandmother`,
      notes: w.notes,
    })
  }

  function addUnionNode(unionId: string, side: 'maternal' | 'paternal', generation: number) {
    addNode({ id: unionId, label: '', type: 'union', side, generation })
  }

  function walkDescendants(person: FamilyPerson) {
    if (!person.children?.length) return
    for (const child of person.children) {
      if (child.id === 'brighton') continue
      addPerson(child)
      addEdge(person.id, child.id, 'direct')
      walkDescendants(child)
    }
  }

  function walkGrandparent(gp: FamilyPerson) {
    addPerson(gp)
    if (!gp.children?.length) return

    const side = gp.side as 'maternal' | 'paternal'
    const groups = groupByWife(gp.children)
    const keyToId = wifeKeyToId[gp.id] ?? {}
    const gpWives = wivesOf[gp.id] ?? []

    for (const [wifeKey, children] of groups) {
      if (wifeKey === '__direct') {
        for (const child of children) {
          addPerson(child)
          addEdge(gp.id, child.id, 'direct')
          walkDescendants(child)
        }
      } else {
        const wifeId = keyToId[wifeKey]
        const wifeObj = wifeId ? gpWives.find(w => w.id === wifeId) : undefined

        if (wifeObj) {
          addWife(wifeObj, side, gp.generation + 1)
          addEdge(gp.id, wifeObj.id, 'spouse-to-union')
          for (const child of children) {
            addPerson(child)
            addEdge(wifeObj.id, child.id, 'union-to-child')
            walkDescendants(child)
          }
        } else {
          const unionId = `union--${gp.id}--${wifeKey.replace(/\s+/g, '-')}`
          addUnionNode(unionId, side, gp.generation + 1)
          addEdge(gp.id, unionId, 'spouse-to-union')
          for (const child of children) {
            addPerson(child)
            addEdge(unionId, child.id, 'union-to-child')
            walkDescendants(child)
          }
        }
      }
    }
  }

  // Brighton ego node
  addPerson(familyTree)

  const [maternal, paternal] = familyTree.children ?? []
  if (maternal) walkGrandparent(maternal)
  if (paternal) walkGrandparent(paternal)

  // Connect Brighton to his parents
  if (seen.has('beauty-pakaisai')) addEdge('beauty-pakaisai', 'brighton', 'direct')
  if (seen.has('dennis-maphutukezi')) addEdge('dennis-maphutukezi', 'brighton', 'direct')

  return { nodes, edges }
}
