import { z } from "zod"
import { Contact } from "./contact"

export interface ProposalItem {
  productId: string
  description: string
  quantity: number
  unitPrice: number
  subtotal: number
}

export interface Proposal {
  id: string
  contactId: string
  contact: Contact
  items: ProposalItem[]
  subtotal: number
  tax: number
  total: number
  status: 'draft' | 'sent' | 'accepted' | 'rejected'
  deadline: string
  createdAt: string
  updatedAt: string
  userId: string
  score?: number
  companyDetails: {
    name: string
    logo?: string
    address: string
    taxId?: string
  }
}

export const proposalItemSchema = z.object({
  productId: z.string(),
  description: z.string(),
  quantity: z.number().min(1),
  unitPrice: z.number().min(0),
  subtotal: z.number()
})

export const proposalSchema = z.object({
  contactId: z.string(),
  items: z.array(proposalItemSchema),
  tax: z.number().min(0),
  deadline: z.string().datetime(),
  status: z.enum(['draft', 'sent', 'accepted', 'rejected']),
  score: z.number().min(0).max(100).optional()
})