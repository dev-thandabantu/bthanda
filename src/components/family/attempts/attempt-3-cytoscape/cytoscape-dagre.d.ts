declare module 'cytoscape-dagre' {
  import type { Core } from 'cytoscape'
  const dagre: (cy: Core) => void
  export default dagre
}
