export interface Contact {
  id: string
  name: string
  email: string
  phone: string
  dateJoined: string
  status: "Lead" | "Prospect" | "Client"
  score: number
  type: string
  notifications: {
    lastInteraction: {
      type: "Appel Sortant" | "Appel Entrant" | "Email Entrant"
      date: string
      duration?: number
      score: number
    }
    history: Array<{
      type: "Appel Sortant" | "Appel Entrant" | "Email Entrant"
      date: string
      duration?: number
      score: number
    }>
  }
  provider: {
    site: string
    funnel: string
    call: string
    vip: boolean
  }
  comments: string
}
