// app/api/clients/[id]/route.ts
import { createClient } from "@/utils/supabase/server"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"
import { z } from "zod"
import type { ClientProfile } from "@/app/types/client-profile"
import type { Contact } from "@/app/types/contact"

// Schéma Provider (utilisé dans clientUpdateSchema)
const providerSchema = z.object({
  site: z.string().url().optional(),
  funnel: z.string().optional(),
  call: z.string().optional(),
  vip: z.boolean().optional(),
})

// Schéma de notification (utilisé dans clientUpdateSchema)
const notificationSchema = z.object({
  lastInteraction: z.object({
    type: z.enum(["Appel Sortant", "Appel Entrant", "Email Entrant"]),
    date: z.string().datetime(),
    duration: z.number().optional(),
    score: z.number().min(0).max(100).optional(),
  }).nullable().optional(),
  history: z.array(z.object({
    type: z.string(),
    date: z.string().datetime(),
    duration: z.number().optional(),
    score: z.number().optional(),
  })).optional(),
}).optional()

// Schéma de mise à jour du client
const clientUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(10).optional(),
  status: z.enum(["Lead", "Prospect", "Client"]).optional(),
  dateJoined: z.string().datetime().optional(),
  score: z.number().int().min(0).max(100).optional(),
  type: z.string().optional(),
  tags: z.array(z.string()).optional(),
  provider: providerSchema.optional(),
  notifications: notificationSchema,
  comments: z.string().optional(),
}).strict()

type ClientUpdate = z.infer<typeof clientUpdateSchema>

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)

    const { data, error } = await supabase
      .from('contacts')
      .select(`
        *,
        company:companies!companies_contact_id_fkey(
          id, 
          name, 
          industry, 
          size, 
          website, 
          linkedin
        ),
        campaigns:client_campaigns!client_campaigns_contact_id_fkey(
          id,
          campaign_id,
          status,
          results,
          campaign:campaigns!client_campaigns_campaign_id_fkey(
            id,
            name,
            type,
            status,
            start_date,
            end_date
          )
        ),
        proposals:client_proposals!client_proposals_contact_id_fkey(
          id, 
          product, 
          amount, 
          status, 
          date, 
          valid_until
        ),
        documents:client_documents!client_documents_contact_id_fkey(
          id, 
          name, 
          type, 
          url, 
          uploaded_at
        ),
        interactions:contact_interactions!contact_interactions_contact_id_fkey(
          id, 
          type, 
          date, 
          duration, 
          score
        )
      `)
      .eq('id', params.id)
      .single()

    if (error) {
      console.error('Error fetching client:', error)
      return NextResponse.json(
        { error: error.message },
        { status: error.code === 'PGRST116' ? 404 : 500 }
      )
    }

    // Type assertion pour garantir la structure
    const clientProfile = data as unknown as ClientProfile
    return NextResponse.json(clientProfile)

  } catch (error) {
    console.error('Error in GET /api/clients/[id]:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}

function validateClientUpdates(updates: unknown): {
  isValid: boolean;
  error?: string;
  data?: ClientUpdate;
} {
  try {
    const validatedData = clientUpdateSchema.parse(updates)
    return { isValid: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        isValid: false, 
        error: error.errors.map(e => e.message).join(", ")
      }
    }
    return { isValid: false, error: "Invalid update data" }
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    
    const updates = await request.json()
    const validation = validateClientUpdates(updates)
    
    if (!validation.isValid || !validation.data) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('contacts')
      .update({
        ...validation.data,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      throw error
    }

    // Ajout de la vérification de type et de la conversion
    if (!data) {
      throw new Error('No data returned from update')
    }

    // Assurez-vous que data correspond au type Contact
    const contactData = data as unknown as Contact
    return NextResponse.json(contactData)
    
  } catch (error) {
    console.error('Error updating client:', error)
    return NextResponse.json(
      { error: 'Failed to update client' },
      { status: 500 }
    )
  }
}