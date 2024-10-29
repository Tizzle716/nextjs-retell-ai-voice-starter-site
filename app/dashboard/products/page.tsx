"use client"

import { useState } from "react"
import { ProductsList } from "./products-list"
import { ProductsHeader } from "./products-header"
import { AdvancedSearch } from "./advanced-search"
import { useSearch } from "@/hooks/use-search"
import { useProducts } from "@/hooks/use-products"
import { Product } from "@/app/types/product"

export default function ProductsPage() {
  const { results, isSearching } = useSearch()
  const { data: products, isLoading } = useProducts()
  const [isSearchMode, setIsSearchMode] = useState(false)

  const handleSearchResults = (searchResults: Product[]) => {
    setIsSearchMode(searchResults.length > 0)
  }

  return (
    <div className="flex flex-col gap-8 p-8">
      <ProductsHeader />
      <AdvancedSearch onSearch={handleSearchResults} />
      <ProductsList 
        products={isSearchMode ? results : products}
        isLoading={isSearching || isLoading} 
      />
    </div>
  )
} 