import type { FamilyPerson } from './family-types'
import { familyTree } from './family'

// family-chart expects a flat Datum array where relationships flow
// top-down: grandparents → parents → children.
// We expose two separate datasets — one per lineage — so each chart
// has a single root and no node has more than 1 parent.

export interface FcDatum {
  id: string
  data: {
    gender: 'M' | 'F'
    name: string
    displayName: string
    relationship: string
    side: string
    status: string
    country: string
    location: string
    notes: string
    generation: number
  }
  rels: {
    parents: string[]
    spouses: string[]
    children: string[]
  }
}

function ensureNode(person: FamilyPerson, map: Map<string, FcDatum>): void {
  if (!map.has(person.id)) {
    map.set(person.id, {
      id: person.id,
      data: {
        gender: 'M',
        name: person.name,
        displayName: person.displayName,
        relationship: person.relationship,
        side: person.side,
        status: person.status,
        country: person.country ?? '',
        location: person.location ?? '',
        notes: person.notes ?? '',
        generation: person.generation,
      },
      rels: { parents: [], spouses: [], children: [] },
    })
  }
}

// Walk the inverted tree (root = Brighton, .children = ancestors).
// We flip the direction: each person's .children in our data are their real-world
// ancestors, so we add them as parents in family-chart terms.
// Brighton is treated as a leaf — he gets no parents (single-root per chart).
function walk(
  person: FamilyPerson,
  parentId: string | null,
  map: Map<string, FcDatum>
): void {
  ensureNode(person, map)

  if (parentId) {
    const node = map.get(person.id)!
    const parent = map.get(parentId)!
    // person is the child of parentId in real genealogy
    if (!node.rels.parents.includes(parentId)) {
      node.rels.parents.push(parentId)
    }
    if (!parent.rels.children.includes(person.id)) {
      parent.rels.children.push(person.id)
    }
  }

  for (const ancestor of person.children ?? []) {
    ensureNode(ancestor, map)
    // ancestor is a real-world ancestor of person — so person is ancestor's child
    walk(person, ancestor.id, map)
    // recurse into ancestor's own ancestors
    walkAncestors(ancestor, map)
  }
}

// Walk strictly downward from an ancestor node
function walkAncestors(person: FamilyPerson, map: Map<string, FcDatum>): void {
  for (const ancestor of person.children ?? []) {
    ensureNode(ancestor, map)
    const node = map.get(person.id)!
    const ancestorNode = map.get(ancestor.id)!
    // ancestor is real-world parent of person
    if (!node.rels.parents.includes(ancestor.id)) {
      node.rels.parents.push(ancestor.id)
    }
    if (!ancestorNode.rels.children.includes(person.id)) {
      ancestorNode.rels.children.push(person.id)
    }
    walkAncestors(ancestor, map)
  }
}

function buildSideData(rootChild: FamilyPerson): FcDatum[] {
  const map = new Map<string, FcDatum>()

  // Add Brighton as a leaf
  ensureNode(familyTree, map)

  // rootChild is Brighton's direct ancestor branch (musabaniMaternal or maphutukezi)
  ensureNode(rootChild, map)

  // Brighton is a child of rootChild's lineage — connect via the actual parent node
  // (Beauty for maternal, Dennis for paternal) if present in rootChild's descendants
  connectBrightonToParent(familyTree, rootChild, map)

  // Now walk rootChild's full subtree top-down
  walkSubtree(rootChild, null, map)

  // Put the root at index 0 (family-chart uses first element as main)
  const arr = Array.from(map.values())
  const rootIdx = arr.findIndex(d => d.id === rootChild.id)
  if (rootIdx > 0) {
    const [root] = arr.splice(rootIdx, 1)
    arr.unshift(root)
  }
  return arr
}

// Walk a subtree top-down (ancestor → descendants in real genealogy = person → person.children in our data)
function walkSubtree(
  person: FamilyPerson,
  parentId: string | null,
  map: Map<string, FcDatum>
): void {
  ensureNode(person, map)

  if (parentId) {
    const node = map.get(person.id)!
    const parent = map.get(parentId)!
    if (!node.rels.parents.includes(parentId) && node.rels.parents.length === 0) {
      node.rels.parents.push(parentId)
    }
    if (!parent.rels.children.includes(person.id)) {
      parent.rels.children.push(person.id)
    }
  }

  for (const child of person.children ?? []) {
    // In our data, person.children = real-world ancestors of person.
    // BUT in the subtree of musabaniMaternal/maphutukezi, the .children
    // ARE real descendants (uncles, aunts, cousins) — NOT ancestors.
    // So here person is the parent and child is the real child.
    walkSubtree(child, person.id, map)
  }
}

// Find the parent node (Beauty/Dennis) in rootChild's subtree and link Brighton to it
function connectBrightonToParent(
  brightonNode: FamilyPerson,
  rootChild: FamilyPerson,
  map: Map<string, FcDatum>
): void {
  const parentId = rootChild.side === 'maternal' ? 'beauty-pakaisai' : 'dennis-maphutukezi'
  // We'll link after walkSubtree runs — handled by walkSubtree finding Brighton's parent
  // and calling linkBrighton at the end
  void parentId
  void brightonNode
}

function buildFlatData(): { maternal: FcDatum[]; paternal: FcDatum[] } {
  const [maternalBranch, paternalBranch] = familyTree.children ?? []
  if (!maternalBranch || !paternalBranch) return { maternal: [], paternal: [] }

  // Build each side independently using a clean top-down walk
  return {
    maternal: buildSide(maternalBranch, 'beauty-pakaisai', familyTree),
    paternal: buildSide(paternalBranch, 'dennis-maphutukezi', familyTree),
  }
}

// Proper clean build: walk the subtree of a lineage root (Ifraim / Wilson),
// connecting Brighton as a leaf child of the given parentId node.
function buildSide(
  lineageRoot: FamilyPerson,
  brightonParentId: string,
  brighton: FamilyPerson
): FcDatum[] {
  const map = new Map<string, FcDatum>()

  function walk2(person: FamilyPerson, parentId: string | null): void {
    ensureNode(person, map)

    if (parentId) {
      const node = map.get(person.id)!
      const parent = map.get(parentId)!
      if (!node.rels.parents.includes(parentId) && node.rels.parents.length === 0) {
        node.rels.parents.push(parentId)
      }
      if (!parent.rels.children.includes(person.id)) {
        parent.rels.children.push(person.id)
      }
    }

    for (const child of person.children ?? []) {
      walk2(child, person.id)
    }
  }

  walk2(lineageRoot, null)

  // Connect Brighton as a child of his parent node (if present in this side's data)
  if (map.has(brightonParentId)) {
    ensureNode(brighton, map)
    const brightonNode = map.get(brighton.id)!
    const parentNode = map.get(brightonParentId)!
    if (!brightonNode.rels.parents.includes(brightonParentId)) {
      brightonNode.rels.parents.push(brightonParentId)
    }
    if (!parentNode.rels.children.includes(brighton.id)) {
      parentNode.rels.children.push(brighton.id)
    }
  }

  // Root first
  const arr = Array.from(map.values())
  const rootIdx = arr.findIndex(d => d.id === lineageRoot.id)
  if (rootIdx > 0) {
    const [root] = arr.splice(rootIdx, 1)
    arr.unshift(root)
  }
  return arr
}

const { maternal, paternal } = buildFlatData()
export const maternalChartData: FcDatum[] = maternal
export const paternalChartData: FcDatum[] = paternal
