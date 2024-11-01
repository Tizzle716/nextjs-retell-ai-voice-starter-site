"use client"

import { useState } from "react"
import { Product } from "@/app/types/product"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface ProductSelectorProps {
  products: Product[]
  onSelect: (product: Product) => void
}

export function ProductSelector({ products, onSelect }: ProductSelectorProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState("")

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Ajouter un produit
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Sélectionner un produit</DialogTitle>
        </DialogHeader>
        <Command>
          <CommandInput
            placeholder="Rechercher un produit..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandEmpty>Aucun produit trouvé.</CommandEmpty>
          <CommandGroup>
            {products.map((product) => (
              <CommandItem
                key={product.id}
                onSelect={() => {
                  onSelect(product)
                  setOpen(false)
                }}
              >
                <div className="flex flex-col">
                  <span>{product.title}</span>
                  <span className="text-sm text-gray-500">
                    {product.price.base} €
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        </Command>
      </DialogContent>
    </Dialog>
  )
} 