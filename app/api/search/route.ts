import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { NextRequest, NextResponse } from "next/server"
import { generateEmbeddings } from "@/utils/embeddings"

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")
    const category = searchParams.get("category")
    const threshold = parseFloat(searchParams.get("threshold") || "0.7")
    
    if (!query) {
      return NextResponse.json({ error: "Query parameter is required" }, { status: 400 })
    }

    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    // Générer l'embedding pour la requête
    const embedding = await generateEmbeddings(query)

    // Effectuer la recherche vectorielle
    let searchQuery = supabase.rpc("match_products", {
      query_embedding: embedding,
      match_threshold: threshold,
      match_count: 20
    })

    // Appliquer des filtres supplémentaires si nécessaire
    if (category) {
      searchQuery = searchQuery.eq("category", category)
    }

    const { data: results, error } = await searchQuery

    if (error) throw error

    return NextResponse.json(results)
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json(
      { error: "Failed to perform search" },
      { status: 500 }
    )
  }
} 