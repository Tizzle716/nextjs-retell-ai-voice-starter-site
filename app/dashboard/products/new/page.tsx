import { ProductForm } from "../product-form"
import { createProduct } from "../actions"
import { ProductFormValues } from "@/app/types/product"

export default function NewProductPage() {
  async function handleCreate(values: ProductFormValues) {
    'use server'
    return createProduct(values)
  }

  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Nouveau Produit</h1>
        <p className="text-muted-foreground">
          Créez un nouveau produit ou service dans votre catalogue
        </p>
      </div>
      <ProductForm 
        action={handleCreate}
      />
    </div>
  )
} 