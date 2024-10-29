"use client"

import { useEffect } from "react"
import { useSearchWithDebounce } from "@/hooks/use-search-with-debounce"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { SlidersHorizontal, Loader2 } from "lucide-react"
import { Product, Search, ProductCategory } from "@/app/types/product"

interface AdvancedSearchProps {
  onSearch: (results: Product[]) => void
}

const initialSearchParams: Search = {
  query: "",
  threshold: 0.7,
  category: undefined
}

export function AdvancedSearch({ onSearch }: AdvancedSearchProps) {
  const {
    searchParams,
    setSearchParams,
    results,
    isLoading,
    handleSearch
  } = useSearchWithDebounce(initialSearchParams)

  // Effet pour propager les résultats vers le parent
  useEffect(() => {
    onSearch(results)
  }, [results, onSearch])

  return (
    <div className="flex items-center gap-2">
      <Input
        placeholder="Rechercher..."
        value={searchParams.query}
        onChange={(e) => setSearchParams({ ...searchParams, query: e.target.value })}
        className="max-w-sm"
      />

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon">
            <SlidersHorizontal className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Options de recherche</SheetTitle>
            <SheetDescription>
              Affinez votre recherche avec des paramètres avancés
            </SheetDescription>
          </SheetHeader>

          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Catégorie</label>
              <Select
                value={searchParams.category}
                onValueChange={(value) => 
                  setSearchParams({ 
                    ...searchParams, 
                    category: value as ProductCategory
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Toutes les catégories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Toutes</SelectItem>
                  <SelectItem value="Renovation">Rénovation</SelectItem>
                  <SelectItem value="Energy">Énergie</SelectItem>
                  <SelectItem value="RealEstate">Immobilier</SelectItem>
                  <SelectItem value="Coaching">Coaching</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Seuil de similarité: {searchParams.threshold}
              </label>
              <Slider
                value={[searchParams.threshold]}
                min={0.1}
                max={0.9}
                step={0.1}
                onValueChange={([value]) =>
                  setSearchParams({ ...searchParams, threshold: value })
                }
              />
            </div>
          </div>
        </SheetContent>
      </Sheet>

      <Button 
        onClick={handleSearch}
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Recherche...
          </>
        ) : (
          "Rechercher"
        )}
      </Button>
    </div>
  )
} 