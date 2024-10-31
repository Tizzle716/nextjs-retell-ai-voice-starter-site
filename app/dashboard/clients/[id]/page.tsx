// app/dashboard/clients/[id]/page.tsx
import { ClientProfileComponent } from "@/components/client-profile/client-profile"
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { notFound } from "next/navigation"

export default async function ClientProfilePage({ 
  params 
}: { 
  params: { id: string } 
}) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)

  const { data: client } = await supabase
    .from('contacts')
    .select('*')
    .eq('id', params.id)
    .single()

  if (!client) {
    notFound()
  }

  return <ClientProfileComponent clientId={params.id} />
}