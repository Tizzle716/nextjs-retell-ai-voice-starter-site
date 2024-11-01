import { Contact, SupabaseContact } from "@/app/types/contact"

export function transformSupabaseContact(data: SupabaseContact): Contact {
  const lastInteraction = data.interactions?.[0] || null
  const history = data.interactions || []

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone || undefined,
    company: data.type || '',
    status: data.status.toLowerCase() as Contact['status'],
    tags: data.tags || [],
    notes: data.comments,
    created_at: data.created_at,
    updated_at: data.updated_at || data.created_at,
    user_id: data.user_id,
    dateJoined: data.created_at,
    provider: data.provider,
    score: data.score,
    notifications: {
      lastInteraction,
      history
    }
  }
}

export function transformToSupabaseContact(contact: Contact): Omit<SupabaseContact, 'interactions'> {
  return {
    id: contact.id,
    name: contact.name,
    email: contact.email,
    phone: contact.phone || '',
    type: contact.company,
    status: contact.status.charAt(0).toUpperCase() + contact.status.slice(1) as SupabaseContact['status'],
    tags: contact.tags,
    comments: contact.notes,
    created_at: contact.created_at,
    updated_at: contact.updated_at,
    user_id: contact.user_id,
    provider: contact.provider,
    score: contact.score
  }
}