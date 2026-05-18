import type { FamilyPerson } from '@/data/family-types'
import { familyTree } from '@/data/family'

export interface CyNode {
  data: {
    id: string
    label: string
    type: 'person' | 'union'
    side?: 'maternal' | 'paternal' | 'both'
    status?: string
    generation?: number
    relationship?: string
    notes?: string
  }
}

export interface CyEdge {
  data: {
    id: string
    source: string
    target: string
    edgeType: 'spouse-to-union' | 'union-to-child' | 'direct'
  }
}

// Extract which wife group a child belongs to from the relationship string.
// Returns a key like 'Bhesi line', 'Wife 1', 'Wife 2', etc., or null for direct children.
function extractWifeKey(relationship: string): string | null {
  // Paternal: "(Wife 1)", "(Wife 2)", "(Wife 3)"
  const wifeNumMatch = relationship.match(/\(Wife (\d+)\)/)
  if (wifeNumMatch) return `Wife ${wifeNumMatch[1]}`

  // Maternal: "(Bhesi line)", "(aMutigo line)", "(aNgarika line)", "(Makhuya line)", "(Musarisari line)"
  const lineMatch = relationship.match(/\(([^)]+) line\)/)
  if (lineMatch) return lineMatch[1]

  // Also catch aMutigo/Selina, Ngarika
  if (relationship.includes('aNgarika') || relationship.includes('Ngarika')) return 'aNgarika'

  return null
}

// Group direct children of a grandparent by their wife key.
// Returns a map: wifeKey → person[] for each wife group, plus null → ungrouped
function groupChildrenByWife(children: FamilyPerson[]): Map<string, FamilyPerson[]> {
  const groups = new Map<string, FamilyPerson[]>()
  for (const child of children) {
    const key = extractWifeKey(child.relationship) ?? '__direct'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(child)
  }
  return groups
}

const nodes: CyNode[] = []
const edges: CyEdge[] = []
const seen = new Set<string>()

function addPerson(p: FamilyPerson) {
  if (seen.has(p.id)) return
  seen.add(p.id)
  nodes.push({
    data: {
      id: p.id,
      label: p.displayName,
      type: 'person',
      side: p.side as 'maternal' | 'paternal' | 'both',
      status: p.status,
      generation: p.generation,
      relationship: p.relationship,
      notes: p.notes,
    },
  })
}

function addUnion(unionId: string, side: 'maternal' | 'paternal') {
  if (seen.has(unionId)) return
  seen.add(unionId)
  nodes.push({
    data: { id: unionId, label: '', type: 'union', side },
  })
}

function addEdge(source: string, target: string, edgeType: CyEdge['data']['edgeType']) {
  const id = `${source}--${target}`
  if (seen.has(id)) return
  seen.add(id)
  edges.push({ data: { id, source, target, edgeType } })
}

// Walk a grandparent's children, creating union nodes per wife group,
// then recursively walk all descendants.
function walkGrandparent(grandparent: FamilyPerson) {
  addPerson(grandparent)
  if (!grandparent.children?.length) return

  const groups = groupChildrenByWife(grandparent.children)

  for (const [wifeKey, children] of groups) {
    if (wifeKey === '__direct') {
      // No wife grouping — connect directly
      for (const child of children) {
        addPerson(child)
        addEdge(grandparent.id, child.id, 'direct')
        walkDescendants(child)
      }
    } else {
      const unionId = `union--${grandparent.id}--${wifeKey.replace(/\s+/g, '-')}`
      const side = grandparent.side as 'maternal' | 'paternal'
      addUnion(unionId, side)
      addEdge(grandparent.id, unionId, 'spouse-to-union')
      for (const child of children) {
        addPerson(child)
        addEdge(unionId, child.id, 'union-to-child')
        walkDescendants(child)
      }
    }
  }
}

function walkDescendants(person: FamilyPerson) {
  if (!person.children?.length) return
  for (const child of person.children) {
    // Skip Brighton — he's the ego node added separately; don't create duplicate edges
    if (child.id === 'brighton') continue
    addPerson(child)
    addEdge(person.id, child.id, 'direct')
    walkDescendants(child)
  }
}

// Brighton is the ego node — add him first, then both grandparent lineages
addPerson(familyTree)

// familyTree.children = [musabaniMaternal, maphutukezi]
const [maternal, paternal] = familyTree.children ?? []
if (maternal) walkGrandparent(maternal)
if (paternal) walkGrandparent(paternal)

// Connect Brighton to his parents (beauty-pakaisai on maternal, dennis-maphutukezi on paternal)
// These edges are direct (not union-routed) since Brighton is the leaf connection point
const maternalParentId = 'beauty-pakaisai'
const paternalParentId = 'dennis-maphutukezi'
if (seen.has(maternalParentId)) addEdge(maternalParentId, 'brighton', 'direct')
if (seen.has(paternalParentId)) addEdge(paternalParentId, 'brighton', 'direct')

export const cytoscapeElements = [...nodes, ...edges]
