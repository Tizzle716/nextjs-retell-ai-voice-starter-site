import * as z from "zod"

// Schema pour Provider
const providerSchema = z.object({
  site: z.string().url().optional(),
  funnel: z.string().optional(),
  call: z.string().optional(),
  vip: z.boolean().optional(),
})

// Schema pour ContactInteraction
const contactInteractionSchema = z.object({
  id: z.string(),
  type: z.string(),
  date: z.string(),
  duration: z.number().optional(),
  score: z.number().optional(),
})

// Schema principal pour Contact
export const contactSchema = z.object({
  id: z.string().optional(), // Optional car généré par Supabase
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  status: z.enum(["Lead", "Prospect", "Client"]),
  dateJoined: z.string().optional(),
  score: z.number().optional(),
  type: z.string().optional(),
  tags: z.array(z.string()).optional(),
  notifications: z.object({
    lastInteraction: z.object({
      type: z.enum(["Appel Sortant", "Appel Entrant", "Email Entrant"]),
      date: z.string(),
      duration: z.number().optional(),
      score: z.number().optional(),
    }).nullable().optional(),
    history: z.array(z.object({
      type: z.string(),
      date: z.string(),
      duration: z.number().optional(),
      score: z.number().optional(),
    })).optional(),
  }).nullable().optional(),
  provider: providerSchema.optional(),
  comments: z.string().optional(),
  interactions: z.array(contactInteractionSchema).optional(),
})

// Schema pour l'import CSV
export const csvContactSchema = contactSchema.omit({ 
  id: true,
  dateJoined: true,
  notifications: true,
  interactions: true 
})