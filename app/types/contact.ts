export interface Contact {
  id: string
  // Champs obligatoires
  name: string
  email: string
  phone: string
  status: "Lead" | "Prospect" | "Client"
  // Champs optionnels
  dateJoined?: string
  score?: number
  type?: string
  tags?: string[]
  notifications?: {
    lastInteraction?: {
      type: "Appel Sortant" | "Appel Entrant" | "Email Entrant"
      date: string
      duration?: number
      score?: number
    } | null
    history?: Array<{
      type: string
      date: string
      duration?: number
      score?: number
    }>
  } | null
  provider?: {
    site?: string
    funnel?: string
    call?: string
    vip?: boolean
  }
  comments?: string
}

// Type helper pour provider
export interface Provider {
  site: string
  funnel: string
  call?: string
  vip?: boolean
}
