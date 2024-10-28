// Créons d'abord le type Filters
export interface Filters {
  search: string
  status: string
  sortBy: string
  sortOrder: 'asc' | 'desc'
  tags: string[]
}

