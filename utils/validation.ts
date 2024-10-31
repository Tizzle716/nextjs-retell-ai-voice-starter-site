import { z } from "zod"
import type { ClientProfile, ClientProfileUpdate } from "@/app/types/client-profile"

// Schéma de base
export const clientProfileSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Le nom est requis"),
  email: z.string().email("Email invalide"),
  phone: z.string().optional(),
  status: z.enum(["Lead", "Prospect", "Client"]),
  company: z.object({
    name: z.string(),
    industry: z.string().optional(),
    size: z.string().optional(),
    website: z.string().url().optional(),
    linkedin: z.string().optional()
  }).optional(),
  notifications: z.object({
    lastInteraction: z.object({
      type: z.enum(["Appel Sortant", "Appel Entrant", "Email Entrant"]),
      date: z.string(),
      duration: z.number().optional(),
      score: z.number().optional()
    }).nullable().optional(),
    history: z.array(z.object({
      type: z.string(),
      date: z.string(),
      duration: z.number().optional(),
      score: z.number().optional()
    })).optional()
  }).nullable().optional(),
  created_at: z.string(),
  updated_at: z.string()
})

// Schéma pour les mises à jour (tous les champs sont optionnels sauf ceux requis)
export const clientProfileUpdateSchema = clientProfileSchema
  .partial()
  .omit({ id: true, created_at: true, updated_at: true })

// Fonction de validation améliorée
export function validateClientUpdates(updates: unknown): updates is ClientProfileUpdate {
  try {
    clientProfileUpdateSchema.parse(updates)
    return true
  } catch (error) {
    console.error('Validation error:', error)
    return false
  }
}

// Type inféré du schéma
export type ClientProfileSchemaType = z.infer<typeof clientProfileSchema> 