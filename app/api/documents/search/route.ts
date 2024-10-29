import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { generateEmbeddings } from "@/utils/embeddings"

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    
    const { query } = await request.json()
    const queryEmbedding = await generateEmbeddings(query)

    const { data, error } = await supabase.rpc('match_documents', {
      query_embedding: queryEmbedding,
      match_threshold: 0.78,
      match_count: 5
    })

    if (error) throw error
    
    return NextResponse.json({ data })
  } catch (error) {
    console.error('Document search failed:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Search failed" },
      { status: 500 }
    )
  }
}