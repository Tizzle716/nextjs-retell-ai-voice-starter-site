// app/api/documents/route.ts
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { generateEmbeddings } from "@/utils/embeddings"

export async function POST(request: Request) {
  try {
    console.log('API: Starting document creation process');
    
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      console.error('API: Authentication error:', authError);
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Gérer le FormData
    const formData = await request.formData();
    console.log('API: Received form data keys:', Array.from(formData.keys()));

    // Convertir FormData en objet
    const body = Object.fromEntries(formData.entries());

    // Traiter correctement les keywords
    let keywords: string[] = [];
    try {
      const keywordsData = formData.get('keywords');
      if (typeof keywordsData === 'string') {
        try {
          // Essayer de parser comme JSON d'abord
          keywords = JSON.parse(keywordsData);
        } catch {
          // Si ce n'est pas du JSON valide, traiter comme une chaîne simple
          keywords = keywordsData.split(',').map((k: string) => k.trim());
        }
      }
    } catch (e) {
      console.error('Error parsing keywords:', e);
      keywords = [];
    }

    // Générer les embeddings
    const embeddings = await generateEmbeddings(body.content as string);
    console.log('API: Generated embeddings');

    const documentData = {
      title: body.title,
      content: body.content,
      category: body.category,
      subcategory: body.subcategory,
      keywords,
      file_type: 'PDF' as const,
      embedding_vector: embeddings,
      user_id: user.id
    };

    console.log('API: Inserting document into Supabase');
    const { data, error } = await supabase
      .from('documents')
      .insert(documentData)
      .select()
      .single()

    if (error) {
      console.error('API: Supabase error:', error);
      throw error;
    }
    
    console.log('API: Document created successfully');
    return NextResponse.json({ data })
  } catch (error) {
    console.error('API: Error details:', error);
    return NextResponse.json(
      { error: "Failed to create document", details: error },
      { status: 500 }
    )
  }
}