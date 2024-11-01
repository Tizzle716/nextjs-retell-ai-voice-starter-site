// types/interaction.ts
import { z } from "zod"

export type InteractionType = "Appel Sortant" | "Appel Entrant" | "Email Entrant"

export interface Interaction {
  id: string
  contact_id: string
  type: InteractionType
  date: string
  duration?: number
  score?: number
  metadata?: Record<string, unknown>
  created_at: string
  updated_at: string
}

// Schema Zod pour la validation
export const interactionSchema = z.object({
  id: z.string().optional(),
  contact_id: z.string(),
  type: z.enum(["Appel Sortant", "Appel Entrant", "Email Entrant"]),
  date: z.string(),
  duration: z.number().optional(),
  score: z.number().min(0).max(100).optional(),
  metadata: z.record(z.unknown()).optional(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
})