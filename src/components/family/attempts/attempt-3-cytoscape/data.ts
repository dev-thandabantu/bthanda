import type { FamilyPerson } from '@/data/family-types'
import { familyTree, wivesOf } from '@/data/family'
import type { Wife } from '@/data/family'

export interface CyNode {
  data: {
    id: string
    label: string
    type: 'person' | 'union' | 'wife'
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

// Map wife IDs to their display objects for click-to-detail
export const wifeById = new Map<string, Wife>()
for (const wives of Object.values(wivesOf)) {
  for (const w of wives) wifeById.set(w.id, w)
}

// Maps line key → wife ID for each grandparent.
// Derived from the wife arrays so the mapping stays in one place.
const wifeKeyToId: Record<string, Record<string, string>> = {
  'ifraim-musabani': {
    'Bhesi':       'wife-ifraim-bhesi',
    'aMutigo':     'wife-ifraim-amutigo',
    'aNgarika':    'wife-ifraim-angarika',
    'Makhuya':     'wife-ifraim-amakhuya',
    'Musarisari':  'wife-ifraim-amusarisari',
  },
  'wilson-maphutukezi': {
    'Wife 1': 'wife-wilson-ester',
    'Wife 2': 'wife-wilson-dzakatsumbe',
    'Wife 3': 'wife-wilson-wife3',
  },
}

// Extract which wife group a child belongs to from the relationship string.
function extractWifeKey(relationship: string): string | null {
  // Paternal: "(Wife 1)", "(Wife 2)", "(Wife 3)"
  const wifeNumMatch = relationship.match(/\(Wife (\d+)\)/)
  if (wifeNumMatch) return `Wife ${wifeNumMatch[1]}`

  // Maternal: "(Bhesi line)", "(aMutigo line)", "(Makhuya line)", "(Musarisari line)"
  const lineMatch = relationship.match(/\(([^)]+) line\)/)
  if (lineMatch) return lineMatch[1]

  // aNgarika appears without "line" in some entries
  if (relationship.includes('Ngarika')) return 'aNgarika'

  return null
}

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

function addWife(w: Wife, side: 'maternal' | 'paternal', generation: number) {
  if (seen.has(w.id)) return
  seen.add(w.id)
  nodes.push({
    data: {
      id: w.id,
      label: w.displayName,
      type: 'wife',
      side,
      status: 'unknown',
      generation,
      relationship: `${side === 'maternal' ? 'Maternal' : 'Paternal'} great-grandmother`,
      notes: w.notes,
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

function walkGrandparent(grandparent: FamilyPerson) {
  addPerson(grandparent)
  if (!grandparent.children?.length) return

  const side = grandparent.side as 'maternal' | 'paternal'
  const groups = groupChildrenByWife(grandparent.children)
  const keyToId = wifeKeyToId[grandparent.id] ?? {}
  const gpWives = wivesOf[grandparent.id] ?? []

  for (const [wifeKey, children] of groups) {
    if (wifeKey === '__direct') {
      for (const child of children) {
        addPerson(child)
        addEdge(grandparent.id, child.id, 'direct')
        walkDescendants(child)
      }
    } else {
      const wifeId = keyToId[wifeKey]
      const wifeObj = wifeId ? gpWives.find(w => w.id === wifeId) : undefined
      const unionId = `union--${grandparent.id}--${wifeKey.replace(/\s+/g, '-')}`

      addUnion(unionId, side)
      addEdge(grandparent.id, unionId, 'spouse-to-union')

      if (wifeObj) {
        // Wives are one generation below the grandparent (same generation as their children's parents)
        addWife(wifeObj, side, grandparent.generation + 1)
        addEdge(wifeObj.id, unionId, 'spouse-to-union')
      }

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
    if (child.id === 'brighton') continue
    addPerson(child)
    addEdge(person.id, child.id, 'direct')
    walkDescendants(child)
  }
}

// Brighton is the ego node — add first, then both lineages
addPerson(familyTree)

const [maternal, paternal] = familyTree.children ?? []
if (maternal) walkGrandparent(maternal)
if (paternal) walkGrandparent(paternal)

// Connect Brighton to his parents
const maternalParentId = 'beauty-pakaisai'
const paternalParentId = 'dennis-maphutukezi'
if (seen.has(maternalParentId)) addEdge(maternalParentId, 'brighton', 'direct')
if (seen.has(paternalParentId)) addEdge(paternalParentId, 'brighton', 'direct')

export const cytoscapeElements = [...nodes, ...edges]
