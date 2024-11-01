"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { ContactSelector } from "./contact-selector"
import { ProductSelector } from "./product-selector"
import { ProposalTable } from "./proposal-table"
import { CompanyDetails } from "./company-details"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ProposalItem, proposalSchema } from "@/app/types/proposal"
import { Contact } from "@/app/types/contact"
import { Product } from "@/app/types/product"
import { useProducts } from "@/hooks/use-products"
import { useContacts } from "@/hooks/use-contacts"
import * as z from "zod";

export function ProposalForm() {
  const router = useRouter()
  const { toast } = useToast()
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  // État des items du devis
  const [items, setItems] = useState<ProposalItem[]>([])

  // Chargement des contacts et produits
  const { 
    contacts,
    isLoading: contactsLoading,
    error: contactsError 
  } = useContacts({
    pagination: {
      pageIndex: 0,
      pageSize: 100
    }
  })

  const { data: products, isLoading: productsLoading } = useProducts()

  // Configuration du formulaire
  const form = useForm({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      contactId: "",
      items: [],
      tax: 20,
      deadline: new Date().toISOString().split('T')[0],
      status: 'draft' as const
    }
  })

  // Gestion des produits
  const onAddProduct = (product: Product) => {
    setItems((current) => [
      ...current,
      {
        productId: product.id,
        description: product.title,
        quantity: 1,
        unitPrice: product.price.base,
        subtotal: product.price.base,
      },
    ])
  }

  const onUpdateQuantity = (index: number, quantity: number) => {
    setItems((current) =>
      current.map((item, i) =>
        i === index
          ? {
              ...item,
              quantity,
              subtotal: quantity * item.unitPrice,
            }
          : item
      )
    )
  }

  const onRemoveItem = (index: number) => {
    setItems((current) => current.filter((_, i) => i !== index))
  }

  // Soumission du formulaire
  const onSubmit = async (values: z.infer<typeof proposalSchema>) => {
    try {
      setIsSubmitting(true)

      if (!selectedContact) {
        toast({
          title: "Erreur",
          description: "Veuillez sélectionner un contact",
          variant: "destructive",
        })
        return
      }

      if (items.length === 0) {
        toast({
          title: "Erreur",
          description: "Veuillez ajouter au moins un produit",
          variant: "destructive",
        })
        return
      }

      // Calcul des totaux
      const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
      const total = subtotal * (1 + values.tax / 100)

      const proposalData = {
        ...values,
        contactId: selectedContact.id,
        items,
        subtotal,
        total,
      }

      // Appel API pour créer le devis
      const response = await fetch('/api/proposals', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(proposalData),
      })

      if (!response.ok) {
        throw new Error('Erreur lors de la création du devis')
      }

      toast({
        title: "Succès",
        description: "Le devis a été créé avec succès",
      })

      router.push('/dashboard/sales/proposals')
    } catch (error) {
      toast({
        title: "Erreur",
        description: error instanceof Error ? error.message : "Une erreur est survenue",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Affichage du loader pendant le chargement des données
  if (contactsLoading || productsLoading) {
    return <div>Chargement...</div>
  }

  // Affichage des erreurs
  if (contactsError) {
    return <div>Erreur de chargement des contacts</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-medium mb-4">Contact</h3>
              <ContactSelector 
                contacts={contacts}
                selectedContact={selectedContact}
                onSelect={(contact: Contact | null) => setSelectedContact(contact)}
              />
            </div>

            <div>
              <h3 className="text-lg font-medium mb-4">Produits</h3>
              <ProductSelector 
                products={products || []}
                onSelect={onAddProduct}
              />
            </div>
          </div>

          <CompanyDetails />
        </div>

        <ProposalTable
          items={items}
          onUpdateQuantity={onUpdateQuantity}
          onRemoveItem={onRemoveItem}
          tax={form.watch("tax")}
          onUpdateTax={(tax) => form.setValue("tax", tax)}
        />

        <FormField
          control={form.control}
          name="deadline"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date d échéance</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-4">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/dashboard/sales/proposals")}
          >
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Création..." : "Créer le devis"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 