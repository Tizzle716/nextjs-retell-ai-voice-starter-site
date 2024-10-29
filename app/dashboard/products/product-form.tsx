"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Product } from "@/app/types/product"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Plus, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { useRouter } from "next/navigation"

const productSchema = z.object({
  title: z.string().min(2, "Le titre doit contenir au moins 2 caractères"),
  description: z.string().min(10, "La description doit contenir au moins 10 caractères"),
  type: z.enum(["Product", "Service"]),
  category: z.enum(["Renovation", "Energy", "RealEstate", "Coaching", ""]),
  subcategory: z.string(),
  price: z.object({
    base: z.number().min(0),
    hasRange: z.boolean().default(false),
    range: z.object({
      min: z.number().min(0).optional(),
      max: z.number().min(0).optional(),
    }).optional(),
  }),
  technicalSpecs: z.record(z.string()),
  tags: z.array(z.string()),
  media: z.object({
    images: z.array(z.string()),
    videos: z.array(z.string()).optional(),
    documents: z.array(z.string()).optional(),
  }),
  metadata: z.object({
    duration: z.string().optional(),
    efficiency: z.string().optional(),
    warranty: z.string().optional(),
    maintenance: z.string().optional(),
    certifications: z.array(z.string()).optional(),
  }),
})

type ProductFormValues = z.infer<typeof productSchema>

interface ProductFormProps {
  initialData?: Partial<Product>
  action: (values: ProductFormValues) => Promise<{ success: boolean }>
}

const defaultValues: ProductFormValues = {
  title: "",
  description: "",
  type: "Product",
  category: "Renovation",
  subcategory: "",
  technicalSpecs: {},
  price: {
    base: 0,
    hasRange: false,
    range: {
      min: 0,
      max: 0
    }
  },
  tags: [],
  media: {
    images: []
  },
  metadata: {}
}

export function ProductForm({ initialData, action }: ProductFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [newTag, setNewTag] = useState("")
  const [newSpec, setNewSpec] = useState({ key: "", value: "" })

  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: initialData ? { ...defaultValues, ...initialData } : defaultValues
  })

  const handleSubmit = async (values: ProductFormValues) => {
    try {
      setIsLoading(true)
      await action(values)
      router.push("/dashboard/products")
      toast({
        title: "Succès",
        description: "Produit enregistré avec succès"
      })
    } catch (error) {
      console.error("Error submitting product:", error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const addTag = () => {
    if (newTag && !form.getValues("tags").includes(newTag)) {
      form.setValue("tags", [...form.getValues("tags"), newTag])
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    form.setValue(
      "tags",
      form.getValues("tags").filter((tag) => tag !== tagToRemove)
    )
  }

  const addTechnicalSpec = () => {
    if (newSpec.key && newSpec.value) {
      form.setValue("technicalSpecs", {
        ...form.getValues("technicalSpecs"),
        [newSpec.key]: newSpec.value,
      })
      setNewSpec({ key: "", value: "" })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Titre</FormLabel>
              <FormControl>
                <Input {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea {...field} disabled={isLoading} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Type</FormLabel>
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Product">Produit</SelectItem>
                    <SelectItem value="Service">Service</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="category"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Catégorie</FormLabel>
                <Select
                  disabled={isLoading}
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une catégorie" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Renovation">Rénovation</SelectItem>
                    <SelectItem value="Energy">Énergie</SelectItem>
                    <SelectItem value="RealEstate">Immobilier</SelectItem>
                    <SelectItem value="Coaching">Coaching</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Prix */}
        <Card>
          <CardContent className="pt-6">
            <FormField
              control={form.control}
              name="price.base"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prix de base</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                      disabled={isLoading}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="price.hasRange"
              render={({ field }) => (
                <FormItem className="flex items-center justify-between mt-4">
                  <FormLabel>Ajouter une fourchette de prix</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLoading}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {form.watch("price.hasRange") && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="price.range.min"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix minimum</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price.range.max"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix maximum</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          disabled={isLoading}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tags */}
        <div className="space-y-4">
          <FormLabel>Tags</FormLabel>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Nouveau tag"
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={addTag}
              disabled={isLoading}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {form.watch("tags").map((tag) => (
              <Badge key={tag} variant="secondary">
                {tag}
                <button
                  type="button"
                  onClick={() => removeTag(tag)}
                  className="ml-2"
                  disabled={isLoading}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <FormLabel>Spécifications techniques</FormLabel>
          <div className="flex gap-2">
            <Input
              placeholder="Clé"
              value={newSpec.key}
              onChange={(e) => setNewSpec({ ...newSpec, key: e.target.value })}
              disabled={isLoading}
            />
            <Input
              placeholder="Valeur"
              value={newSpec.value}
              onChange={(e) => setNewSpec({ ...newSpec, value: e.target.value })}
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={addTechnicalSpec}
              disabled={isLoading}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(form.watch("technicalSpecs")).map(([key, value]) => (
              <Badge key={key} variant="secondary" className="justify-between">
                {key}: {value}
                <button
                  type="button"
                  onClick={() => {
                    const specs = { ...form.getValues("technicalSpecs") }
                    delete specs[key]
                    form.setValue("technicalSpecs", specs)
                  }}
                  className="ml-2"
                  disabled={isLoading}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/products")}
            disabled={isLoading}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {initialData ? "Mettre à jour" : "Créer"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 