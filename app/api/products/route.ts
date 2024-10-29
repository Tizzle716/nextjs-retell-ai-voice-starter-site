// app/api/products/route.ts
import type { SupabaseResponse, Product } from "@/app/types/product"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { generateEmbeddings } from "@/utils/embeddings"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const query = searchParams.get('query')
  const category = searchParams.get('category')
  
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  if (query) {
    const embedding = await generateEmbeddings(query)
    const { data, error } = await supabase.rpc('search_products', {
      query_embedding: embedding,
      match_threshold: 0.8,
      match_count: 10
    }) as SupabaseResponse<Product>
    if (error) throw error
    return NextResponse.json(data)
  }

  // Regular search with filters
  let productsQuery = supabase.from('products').select('*')
  if (category) {
    productsQuery = productsQuery.eq('category', category)
  }
  
  const { data, error } = await productsQuery as SupabaseResponse<Product>
  if (error) throw error
  return NextResponse.json(data)
}