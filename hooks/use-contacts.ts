// hooks/use-contacts.ts
import { type PaginationState } from "@tanstack/react-table"
import { type Contact } from "@/app/types/contact"
import { type Filters } from "@/app/types/filters"
import { type Pagination, type PaginationResponse } from "@/app/types/pagination"
import useSWR from "swr"

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

export function useContacts(
  pagination: PaginationState,
  filters: Filters
): UseContactsReturn {
  const queryString = new URLSearchParams({
    page: String(pagination.pageIndex + 1),
    limit: String(pagination.pageSize),
    ...(filters.search && { search: filters.search }),
    ...(filters.tags?.length && { tags: JSON.stringify(filters.tags) })
  }).toString()

  const { data, error, mutate } = useSWR<ApiResponse>(
    `/api/contacts?${queryString}`,
    async (url: string) => {
      const response = await fetch(url)
      if (!response.ok) throw new Error("Failed to fetch contacts")
      return response.json()
    }
  )

  return {
    contacts: data?.data || [],
    isLoading: !error && !data,
    error: error || null,
    mutate: async () => { await mutate() },
    pagination: {
      pageIndex: data?.pagination.pageIndex ?? 0,
      pageSize: data?.pagination.pageSize ?? 10,
      totalPages: data?.pagination.totalPages ?? 1
    }
  }
}
