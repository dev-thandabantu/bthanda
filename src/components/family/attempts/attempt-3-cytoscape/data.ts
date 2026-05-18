import { buildFamilyGraph, wifeById } from '@/data/family-graph'

export { wifeById }

const { nodes, edges } = buildFamilyGraph()

// Cytoscape expects elements in { data: {...} } wrapper format
export const cytoscapeElements = [
  ...nodes.map(n => ({ data: n })),
  ...edges.map(e => ({ data: e })),
]
