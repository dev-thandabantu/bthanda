export type Side = 'maternal' | 'paternal' | 'self' | 'both'
export type Status = 'living' | 'deceased' | 'unknown'
export type Country = 'ZW' | 'ZA' | 'MZ' | 'other'

export interface FamilyPerson {
  id: string
  name: string
  displayName: string
  relationship: string
  side: Side
  generation: number  // 0 = Brighton, negative = ancestors, positive = descendants
  status: Status
  country?: Country
  location?: string
  notes?: string
  children?: FamilyPerson[]
}

// react-d3-tree compatible node with our data attached
export interface TreeNode {
  name: string
  attributes?: Record<string, string>
  children?: TreeNode[]
  __data: FamilyPerson
}
