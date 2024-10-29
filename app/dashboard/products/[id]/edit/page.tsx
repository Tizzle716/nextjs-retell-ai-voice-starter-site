import { notFound } from "next/navigation"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { ProductForm } from "../../product-form"
import { ProductFormValues } from "@/app/types/product"
import { updateProduct } from "../../actions"

export default async function EditProductPage({ params }: { params: { id: string } }) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", params.id)
    .single()

  if (error || !product) {
    notFound()
  }

  async function handleUpdate(values: ProductFormValues) {
    'use server'
    return updateProduct(params.id, values)
  }

  // Conversion des données pour le formulaire
  const formInitialData: ProductFormValues = {
    title: product.title,
    description: product.description,
    type: product.type,
    category: product.category,
    subcategory: product.subcategory,
    price: product.price,
    technicalSpecs: product.technicalSpecs,
    tags: product.tags,
    media: {
      images: product.media.images,
      videos: product.media.videos || [],
      documents: product.media.documents || []
    },
    metadata: {
      duration: product.metadata.duration || "",
      efficiency: product.metadata.efficiency || "",
      warranty: product.metadata.warranty || "",
      maintenance: product.metadata.maintenance || "",
      certifications: product.metadata.certifications || []
    }
  }

  return (
    <div className="container max-w-3xl py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Modifier le Produit</h1>
        <p className="text-muted-foreground">
          Modifiez les informations du produit
        </p>
      </div>
      <ProductForm 
        action={handleUpdate}
        initialData={formInitialData}
      />
    </div>
  )
} 