"use server"

import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { ProductFormValues } from "@/app/types/product"

export async function createProduct(values: ProductFormValues) {
  'use server'
  
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      throw new Error("Unauthorized")
    }
    
    const { data, error } = await supabase
      .from('products')
      .insert([{
        ...values,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }])

    if (error) throw error
    
    return { success: true, data }

  } catch (error) {
    console.error('Erreur détaillée:', error)
    throw error
  }
}

export async function updateProduct(id: string, values: ProductFormValues) {
  'use server'
  
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase
    .from("products")
    .update({
      ...values,
      updated_at: new Date().toISOString()
    })
    .eq("id", id)

  if (error) throw error
  return { success: true }
}