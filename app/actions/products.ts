"use server"

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { revalidatePath } from "next/cache"
import { Product } from "@/app/types/product"

export async function createProduct(data: Partial<Product>) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  try {
    // 1. Vérifier l'utilisateur connecté
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      throw new Error("Unauthorized")
    }

    // 2. Préparer les données
    const productData = {
      ...data,
      user_id: user.id,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }

    // 3. Insérer le produit
    const { error } = await supabase
      .from("products")
      .insert([productData])

    if (error) {
      console.error("Insertion error:", error)
      throw error
    }

    revalidatePath("/dashboard/products")
    return { success: true }

  } catch (error) {
    console.error("Erreur détaillée:", error)
    throw error
  }
}

export async function updateProduct(id: string, data: Partial<Product>) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  // Mise à jour du produit sans embedding
  const { error } = await supabase
    .from("products")
    .update({ 
      ...data,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)

  if (error) throw error

  revalidatePath("/dashboard/products")
}

export async function deleteProduct(id: string) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase
    .from("products")
    .delete()
    .eq("id", id)

  if (error) throw error

  revalidatePath("/dashboard/products")
} 