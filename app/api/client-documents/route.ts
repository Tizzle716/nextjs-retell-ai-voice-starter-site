import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { ClientDocument } from '@/app/types/client-profile'

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File
    const contact_id = formData.get('contact_id') as string

    if (!file || !contact_id) {
      return NextResponse.json(
        { error: 'File and contact_id are required' },
        { status: 400 }
      )
    }

    // 1. Upload file to storage bucket
    const fileExt = file.name.split('.').pop()
    const fileName = `${Date.now()}.${fileExt}`
    const filePath = `client-documents/${contact_id}/${fileName}`

    const { error: uploadError } = await supabase.storage
      .from('client-documents')
      .upload(filePath, file)

    if (uploadError) throw uploadError

    // 2. Create client document record
    const { data: clientDocument, error: docError } = await supabase
      .from('client_documents')
      .insert({
        contact_id,
        name: formData.get('title') as string || file.name,
        type: file.type,
        size: file.size,
        file_path: filePath,
        metadata: {
          contentType: file.type,
          lastModified: new Date().toISOString(),
          category: formData.get('category'),
          subcategory: formData.get('subcategory')
        },
        user_id: user.id
      })
      .select()
      .single()

    if (docError) throw docError

    // 3. Format response according to ClientDocument type
    const response: ClientDocument = {
      id: clientDocument.id,
      name: clientDocument.name,
      type: clientDocument.type,
      size: clientDocument.size,
      uploadedAt: clientDocument.created_at,
      url: await supabase.storage
        .from('client-documents')
        .getPublicUrl(filePath).data.publicUrl,
      metadata: clientDocument.metadata
    }

    return NextResponse.json({ success: true, document: response })
  } catch (error) {
    console.error('Client document upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload client document' },
      { status: 500 }
    )
  }
}

// GET route pour récupérer les documents d'un contact
export async function GET(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    
    const { searchParams } = new URL(request.url)
    const contactId = searchParams.get('contact_id')

    if (!contactId) {
      return NextResponse.json(
        { error: 'contact_id is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('client_documents')
      .select('*')
      .eq('contact_id', contactId)
      .order('created_at', { ascending: false })

    if (error) throw error

    const documents: ClientDocument[] = await Promise.all(
      data.map(async (doc) => ({
        id: doc.id,
        name: doc.name,
        type: doc.type,
        size: doc.size,
        uploadedAt: doc.created_at,
        url: await supabase.storage
          .from('client-documents')
          .getPublicUrl(doc.file_path).data.publicUrl,
        metadata: doc.metadata
      }))
    )

    return NextResponse.json(documents)
  } catch (error) {
    console.error('Error fetching client documents:', error)
    return NextResponse.json(
      { error: 'Failed to fetch client documents' },
      { status: 500 }
    )
  }
} 