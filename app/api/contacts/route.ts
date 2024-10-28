import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { z } from "zod"

const contactSchema = z.object({
  id: z.string().uuid().optional(),
  // Champs obligatoires
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  status: z.enum(["Lead", "Prospect", "Client"]),
  
  // Champs optionnels
  tags: z.array(z.string()).optional(),
  score: z.number().int().min(0).max(100).optional(),
  type: z.string().optional(),
  provider: z.object({
    site: z.string().url().optional(),
    funnel: z.string().optional(),
    call: z.string().optional(),
    vip: z.boolean().optional(),
  }).optional(),
  comments: z.string().optional(),
})

const querySchema = z.object({
  page: z.coerce.number().positive().default(1),
  limit: z.coerce.number().positive().max(100).default(10),
  search: z.string().optional(),
  status: z.enum(["Lead", "Prospect", "Client"]).optional(),
  sortBy: z.string().optional(),
  sortOrder: z.enum(["asc", "desc"]).optional(),
  tags: z.string().optional(), // Pour filtrer par tags
})

export async function GET(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    
    // Vérifier l'authentification
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const query = querySchema.parse(Object.fromEntries(searchParams))
    
    // Calculer la pagination
    const from = (query.page - 1) * query.limit
    const to = from + query.limit - 1
    
    // Construire la requête de base
    let contactsQuery = supabase
      .from("contacts")
      .select(`
        *,
        interactions:contact_interactions(*)
      `, { count: "exact" })
      .eq('user_id', user.id)
      .range(from, to)
    
    // Appliquer les filtres de recherche
    if (query.search) {
      contactsQuery = contactsQuery.or(`
        name.ilike.%${query.search}%,
        email.ilike.%${query.search}%,
        phone.ilike.%${query.search}%
      `)
    }

    // Appliquer le filtre de statut
    if (query.status) {
      contactsQuery = contactsQuery.eq('status', query.status)
    }

    // Appliquer le tri
    if (query.sortBy) {
      contactsQuery = contactsQuery.order(query.sortBy, {
        ascending: query.sortOrder === 'asc'
      })
    } else {
      contactsQuery = contactsQuery.order('created_at', { ascending: false })
    }

    // Ajouter le filtre par tags
    if (query.tags) {
      const tagsArray = JSON.parse(query.tags)
      if (Array.isArray(tagsArray) && tagsArray.length > 0) {
        contactsQuery = contactsQuery.contains('tags', tagsArray)
      }
    }

    const { data, error, count } = await contactsQuery

    if (error) throw error

    return NextResponse.json({
      data,
      pagination: {
        total: count || 0,
        pages: Math.ceil((count || 0) / query.limit),
        current: query.page,
        limit: query.limit,
      }
    })

  } catch (error) {
    console.error("GET /api/contacts error:", error)
    return NextResponse.json(
      { error: "Failed to fetch contacts" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    
    // Récupérer l'utilisateur avant de l'utiliser
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedContact = contactSchema.parse(body)
    
    const { data: contact, error: insertError } = await supabase
      .from("contacts")
      .insert([{
        ...validatedContact,
        tags: validatedContact.tags || [],
        user_id: user.id, // Maintenant user est défini
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }])
      .select()
      .single()
    
    if (insertError) throw insertError

    // Si des interactions sont fournies, les insérer également
    if (body.notifications?.lastInteraction) {
      const { error: interactionError } = await supabase
        .from("contact_interactions")
        .insert({
          contact_id: contact.id,
          type: body.notifications.lastInteraction.type,
          date: body.notifications.lastInteraction.date,
          duration: body.notifications.lastInteraction.duration,
          score: body.notifications.lastInteraction.score,
        })
      
      if (interactionError) throw interactionError
    }
    
    return NextResponse.json({ data: contact })
  } catch (error) {
    console.error("POST /api/contacts error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: "Failed to create contact" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    
    // Récupérer l'utilisateur avant de l'utiliser
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const validatedData = contactSchema.parse(body)
    
    if (!validatedData.id) {
      return NextResponse.json({ error: "Contact ID is required" }, { status: 400 })
    }

    const { id, ...updateData } = validatedData
    
    const { data, error } = await supabase
      .from("contacts")
      .update({
        ...updateData,
        tags: updateData.tags || [],
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id) // Maintenant user est correctement défini
      .select()
      .single()
    
    if (error) throw error
    
    return NextResponse.json({ data })
  } catch (error) {
    console.error("PUT /api/contacts error:", error)
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json(
      { error: "Failed to update contact" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')
    
    if (!id) {
      return NextResponse.json(
        { error: "Contact ID is required" },
        { status: 400 }
      )
    }

    const { error } = await supabase
      .from("contacts")
      .delete()
      .eq('id', id)
      .eq('user_id', user.id) // Sécurité supplémentaire
    
    if (error) throw error
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("DELETE /api/contacts error:", error)
    return NextResponse.json(
      { error: "Failed to delete contact" },
      { status: 500 }
    )
  }
}
