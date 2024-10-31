// app/api/contacts/tags/route.ts
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { SupabaseContact } from "@/app/types/contact"

export async function GET() {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  
  const { data, error } = await supabase
    .from('contacts')
    .select('tags')
    .not('tags', 'is', null) as { 
      data: Pick<SupabaseContact, 'tags'>[] | null;
      error: Error | null;
    }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  if (!data) {
    return NextResponse.json([])
  }

  const uniqueTags = Array.from(
    new Set(data.flatMap(contact => contact.tags || []))
  )
  
  return NextResponse.json(uniqueTags)
}