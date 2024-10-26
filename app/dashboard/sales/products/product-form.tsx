import { useState } from "react"
import { Product } from "@/app/types/sales"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

interface ProductFormProps {
  product: Product | null
  onSave: () => void
}

export function ProductForm({ product, onSave }: ProductFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>(product || {})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Ici, vous devriez appeler votre API pour sauvegarder le produit
    console.log("Saving product:", formData)
    onSave()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        name="name"
        value={formData.name || ""}
        onChange={handleChange}
        placeholder="Product Name"
      />
      <Textarea
        name="description"
        value={formData.description || ""}
        onChange={handleChange}
        placeholder="Description"
      />
      <Input
        name="price"
        type="number"
        value={formData.price || ""}
        onChange={handleChange}
        placeholder="Price"
      />
      <Input
        name="category"
        value={formData.category || ""}
        onChange={handleChange}
        placeholder="Category"
      />
      <Button type="submit">Save Product</Button>
    </form>
  )
}
