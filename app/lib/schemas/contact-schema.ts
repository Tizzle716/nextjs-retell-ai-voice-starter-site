import * as z from "zod"
import { interactionSchema } from "@/app/types/interaction"

// Schema pour Provider
const providerSchema = z.object({
  site: z.string().url().optional(),
  funnel: z.string().optional(),
  call: z.string().optional(),
  vip: z.boolean().optional(),
})

// Schema principal pour Contact
export const contactSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  status: z.enum(["lead", "prospect", "client"]),
  dateJoined: z.string().optional(),
  score: z.number().optional(),
  type: z.string().optional(),
  tags: z.array(z.string()).optional(),
  notifications: z.object({
    lastInteraction: interactionSchema.nullable().optional(),
    history: z.array(interactionSchema).optional(),
  }).nullable().optional(),
  provider: providerSchema.optional(),
  comments: z.string().optional(),
  interactions: z.array(interactionSchema).optional(),
})

// Schema pour l'import CSV
export const csvContactSchema = contactSchema.omit({ 
  id: true,
  dateJoined: true,
  notifications: true,
  interactions: true 
})