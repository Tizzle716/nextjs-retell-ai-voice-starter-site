"use server"

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import { ProductFormValues, transformProductForDb } from "@/app/types/product"

export async function createProduct(values: ProductFormValues) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return {
        error: "Non autorisé",
        success: false
      }
    }
    
    const { error: insertError } = await supabase
      .from('products')
      .insert([{
        ...values,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])

    if (insertError) {
      return {
        error: insertError.message,
        success: false
      }
    }
    
    revalidatePath('/dashboard/products')
    redirect('/dashboard/products')

  } catch (error) {
    console.error('Erreur détaillée:', error)
    return {
      error: "Une erreur est survenue lors de la création du produit",
      success: false
    }
  }
}

export async function updateProduct(id: string, values: ProductFormValues) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  try {
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return {
        error: "Non autorisé",
        success: false
      }
    }

    // Transformer les données pour correspondre au format de la base de données
    const dbData = transformProductForDb(values)

    // Mise à jour du produit
    const { error: updateError } = await supabase
      .from('products')
      .update({
        ...dbData,
        updated_at: new Date().toISOString(),
        user_id: user.id
      })
      .eq('id', id)

    if (updateError) {
      return {
        error: updateError.message,
        success: false
      }
    }

    // Revalider le cache pour cette route
    revalidatePath('/dashboard/products')
    revalidatePath(`/dashboard/products/${id}`)

    // Rediriger vers la liste des produits
    redirect('/dashboard/products')

  } catch (error) {
    console.error('Erreur détaillée:', error)
    return {
      error: 'Une erreur est survenue lors de la mise à jour du produit',
      success: false
    }
  }
}