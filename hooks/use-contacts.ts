// hooks/use-contacts.ts
import { type PaginationState } from "@tanstack/react-table"
import { type Contact } from "@/app/types/contact"
import { type Filters } from "@/app/types/filters"
import { type Pagination, type PaginationResponse } from "@/app/types/pagination"
import useSWR from "swr"

interface UseContactsOptions {
  pagination?: PaginationState
  filters?: Filters
  includeInteractions?: boolean
}

interface UseContactsReturn {
  contacts: Contact[]
  isLoading: boolean
  error: Error | null
  mutate: () => Promise<void>
  pagination: Pagination
}

interface ApiResponse {
  data: Contact[]
  pagination: PaginationResponse
}

const DEFAULT_PAGINATION: PaginationState = {
  pageIndex: 0,
  pageSize: 10
}

const DEFAULT_FILTERS: Filters = {
  search: '',
  status: null,
  tags: [],
  sortBy: null,
  sortOrder: null
}

export function useContacts({
  pagination = DEFAULT_PAGINATION,
  filters = DEFAULT_FILTERS,
  includeInteractions = false
}: UseContactsOptions = {}): UseContactsReturn {
  // Construire les paramètres de requête
  const queryParams = new URLSearchParams({
    // Pagination
    page: String(pagination.pageIndex + 1),
    limit: String(pagination.pageSize),
    
    // Interactions
    include_interactions: String(includeInteractions)
  })

  // Ajouter les filtres de manière conditionnelle
  if (filters.search) {
    queryParams.set('search', filters.search)
  }

  if (filters.status) {
    queryParams.set('status', filters.status)
  }

  if (filters.tags.length > 0) {
    queryParams.set('tags', JSON.stringify(filters.tags))
  }

  if (filters.sortBy) {
    queryParams.set('sortBy', filters.sortBy)
  }

  if (filters.sortOrder) {
    queryParams.set('sortOrder', filters.sortOrder)
  }

  // Configuration du fetcher SWR
  const fetcher = async (url: string): Promise<ApiResponse> => {
    const response = await fetch(url)
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || "Failed to fetch contacts")
    }
    return response.json()
  }

  // Appel SWR
  const { data, error, mutate } = useSWR<ApiResponse>(
    `/api/contacts?${queryParams.toString()}`,
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 5000
    }
  )

  return {
    contacts: data?.data || [],
    isLoading: !error && !data,
    error: error || null,
    mutate: async () => { await mutate() },
    pagination: {
      pageIndex: data?.pagination.pageIndex ?? pagination.pageIndex,
      pageSize: data?.pagination.pageSize ?? pagination.pageSize,
      totalPages: data?.pagination.totalPages ?? 1,
      totalItems: data?.pagination.totalItems ?? 0
    }
  }
}

// Types d'export
export type { UseContactsOptions, UseContactsReturn, ApiResponse }
