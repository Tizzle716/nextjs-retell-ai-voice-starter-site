// hooks/use-search-with-debounce.ts
import { useState, useEffect } from 'react'
import { useDebounce } from './use-debounce'
import { Product, Search } from '@/app/types/product'

export function useSearchWithDebounce(initialParams: Search) {
  const [searchParams, setSearchParams] = useState(initialParams)
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  
  const debouncedQuery = useDebounce(searchParams.query, 300)

  useEffect(() => {
    const performSearch = async () => {
      if (!debouncedQuery) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        const queryParams = new URLSearchParams({
          q: debouncedQuery,
          threshold: searchParams.threshold.toString(),
          ...(searchParams.category && { category: searchParams.category })
        })

        const response = await fetch(`/api/search?${queryParams.toString()}`)
        if (!response.ok) throw new Error('Search request failed')
        
        const data = await response.json()
        setResults(data)
      } catch (error) {
        console.error("Search error:", error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    performSearch()
  }, [debouncedQuery, searchParams.threshold, searchParams.category])

  const handleSearch = async () => {
    if (!searchParams.query) return
    
    setIsLoading(true)
    try {
      const queryParams = new URLSearchParams({
        q: searchParams.query,
        threshold: searchParams.threshold.toString(),
        ...(searchParams.category && { category: searchParams.category })
      })
      
      const response = await fetch(`/api/search?${queryParams.toString()}`)
      if (!response.ok) throw new Error('Search request failed')
      
      const data = await response.json()
      setResults(data)
    } catch (error) {
      console.error("Search error:", error)
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }

  return {
    searchParams,
    setSearchParams,
    results,
    isLoading,
    handleSearch
  }
}