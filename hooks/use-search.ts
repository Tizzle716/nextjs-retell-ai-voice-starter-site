import { useState } from "react"
import { Product } from "@/app/types/product"

interface SearchResult extends Product {
  similarity: number
}

export function useSearch() {
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleSearch = async (
    query: string,
    options?: { category?: string; threshold?: number }
  ) => {
    if (!query) {
      setResults([])
      return
    }

    setIsSearching(true)
    try {
      const params = new URLSearchParams({
        q: query,
        ...(options?.category && { category: options.category }),
        ...(options?.threshold && { threshold: options.threshold.toString() }),
      })

      const response = await fetch(`/api/search?${params.toString()}`)
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
    } finally {
      setIsSearching(false)
    }
  }

  return {
    results,
    isSearching,
    handleSearch,
  }
} 