import { createClient } from '@/utils/supabase/server'
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { proposalSchema } from "@/app/types/proposal"

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = await createClient(cookieStore)
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const data = await request.json()
    const validation = proposalSchema.safeParse(data)

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 }
      )
    }

    const { data: proposal, error } = await supabase
      .from("client_proposals")
      .insert([
        {
          ...validation.data,
          user_id: user.id,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        },
      ])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json(proposal)
  } catch (error) {
    console.error("Erreur lors de la création du devis:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création du devis" },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const cookieStore = cookies()
    const supabase = await createClient(cookieStore)
    const { data: { user }, error: userError } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: "Non autorisé" },
        { status: 401 }
      )
    }

    const { data: proposals, error } = await supabase
      .from("client_proposals")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) throw error

    return NextResponse.json(proposals)
  } catch (error) {
    console.error("Erreur lors de la récupération des devis:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des devis" },
      { status: 500 }
    )
  }
}