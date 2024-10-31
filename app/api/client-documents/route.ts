import { cookies } from "next/headers"
import { createClient } from "@/utils/supabase/server"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const formData = await request.formData()
    
    const file = formData.get('file') as File
    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const contact_id = formData.get('contact_id') as string
    const subcategory = formData.get('subcategory') as string | null

    // Upload file to Supabase Storage
    const { data: fileData, error: uploadError } = await supabase
      .storage
      .from('documents')
      .upload(`${contact_id}/${file.name}`, file)

    if (uploadError) {
      throw uploadError
    }

    // Create document record
    const { data: document, error: documentError } = await supabase
      .from('documents')
      .insert({
        title,
        category,
        subcategory,
        file_type: file.type,
        storage_path: fileData.path,
        size: file.size,
      })
      .select()
      .single()

    if (documentError) {
      throw documentError
    }

    // Create client_document link
    const { error: linkError } = await supabase
      .from('client_documents')
      .insert({
        contact_id,
        document_id: document.id,
      })

    if (linkError) {
      throw linkError
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing document upload:', error)
    return NextResponse.json(
      { error: 'Error uploading document' },
      { status: 500 }
    )
  }
} 