import { type PaginationState } from "@tanstack/react-table"

export interface Pagination {
  pageIndex: number
  pageSize: number
  totalPages: number
}

// Type pour la réponse API
export interface PaginationResponse {
  pageIndex: number
  pageSize: number
  totalPages: number
}

// Convertisseurs
export const toPaginationResponse = (state: PaginationState): PaginationResponse => ({
  pageIndex: state.pageIndex,
  pageSize: state.pageSize,
  totalPages: 0 // sera mis à jour par l'API
})
