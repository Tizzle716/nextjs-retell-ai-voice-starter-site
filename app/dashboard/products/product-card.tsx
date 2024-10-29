"use client"

import { Product } from "@/app/types/product"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { formatPrice } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Edit, Trash } from "lucide-react"
import { useRouter } from "next/navigation"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const router = useRouter()

  const renderPrice = () => {
    if (product.price.hasRange && product.price.range) {
      return `${formatPrice(product.price.range.min || 0)} - ${formatPrice(product.price.range.max || 0)}`
    }
    return formatPrice(product.price.base)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="line-clamp-1">{product.title}</CardTitle>
            <CardDescription>{product.type}</CardDescription>
          </div>
          <Badge>{product.category}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground line-clamp-2">
            {product.description}
          </p>
          <div className="flex items-center justify-between">
            <div className="font-medium">
              {renderPrice()}
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push(`/dashboard/products/${product.id}/edit`)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button variant="destructive" size="icon">
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 