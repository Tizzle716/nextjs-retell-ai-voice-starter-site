import { z } from "zod"
import type { ClientProfile } from "@/app/types/client-profile"

// Schéma pour l'entreprise
const companySchema = z.object({
  name: z.string().min(1, "Le nom de l'entreprise est requis"),
  industry: z.string().optional(),
  website: z.string().url("URL invalide").optional().or(z.literal("")),
  linkedin: z.string().optional(),
})

// Schéma pour les interactions
const interactionSchema = z.object({
  type: z.enum(["Appel Sortant", "Appel Entrant", "Email Entrant"]),
  date: z.string(),
  duration: z.number().optional(),
  score: z.number().min(0).max(100).optional(),
})

// Schéma pour les notifications
const notificationsSchema = z.object({
  lastInteraction: interactionSchema.nullable().optional(),
  history: z.array(interactionSchema).optional(),
})

// Schéma principal du profil client
export const clientProfileSchema = z.object({
  id: z.string(),
  name: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(10, "Numéro de téléphone invalide").optional(),
  status: z.enum(["Lead", "Prospect", "Client"]),
  company: companySchema.optional(),
  notifications: notificationsSchema.optional(),
  created_at: z.string(),
  updated_at: z.string(),
})

// Schéma pour les mises à jour
export const clientProfileUpdateSchema = clientProfileSchema
  .partial()
  .omit({ id: true, created_at: true, updated_at: true })

// Type pour les mises à jour
export type ClientProfileUpdate = z.infer<typeof clientProfileUpdateSchema>

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

// Type inféré du schéma complet
export type ClientProfileSchemaType = z.infer<typeof clientProfileSchema> 