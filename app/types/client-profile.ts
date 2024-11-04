// app/types/client-profile.ts

// Types de base
export type InteractionType = "Appel Sortant" | "Appel Entrant" | "Email Entrant"
export type ClientStatus = "Lead" | "Prospect" | "Client"

// Interface pour l'entreprise
export interface CompanyInfo {
  name: string
  industry?: string
  size?: string
  website?: string
  linkedin?: string
}

// Interface pour une interaction
export interface Interaction {
  type: string
  date: string
  duration?: number
  score?: number
}

// Interface pour la dernière interaction
export interface LastInteraction {
  type: InteractionType
  date: string
  duration?: number
  score?: number
}

// Interface pour les notifications
export interface Notifications {
  lastInteraction?: LastInteraction | null
  history?: Interaction[]
}

// Interface principale du profil client
export interface ClientProfile {
  id: string
  name: string
  email: string
  phone?: string
  company?: string | CompanyInfo
  status: string
  created_at: string
  updated_at: string
}

// Type pour les mises à jour du profil (rend certains champs optionnels)
export type ClientProfileUpdate = Partial<Omit<ClientProfile, 'id' | 'created_at' | 'updated_at'>>

// Utilitaires de formatage
export const formatters = {
  // Formatage des dates
  formatDate: (date: string): string => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date))
  },

  // Formatage des montants
  formatCurrency: (amount: string | number): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(numAmount)
  },

  // Formatage de la taille des fichiers
  formatFileSize: (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`
  },

  // Formatage du statut
  formatStatus: (status: string): { label: string; variant: 'default' | 'success' | 'warning' | 'destructive' } => {
    const statusMap: Record<string, { label: string; variant: 'default' | 'success' | 'warning' | 'destructive' }> = {
      'Draft': { label: 'Brouillon', variant: 'default' },
      'Sent': { label: 'Envoyé', variant: 'warning' },
      'Negotiating': { label: 'En négociation', variant: 'warning' },
      'Accepted': { label: 'Accepté', variant: 'success' },
      'Rejected': { label: 'Refusé', variant: 'destructive' }
    }
    return statusMap[status] || { label: status, variant: 'default' }
  },

  // Formatage du score
  formatScore: (score: number): { value: string; color: string } => {
    if (score >= 80) return { value: 'Excellent', color: 'text-green-500' }
    if (score >= 60) return { value: 'Bon', color: 'text-blue-500' }
    if (score >= 40) return { value: 'Moyen', color: 'text-yellow-500' }
    return { value: 'Faible', color: 'text-red-500' }
  }
}

// Types pour les hooks
export interface UseClientInteractionsReturn {
  interactions: Array<{
    type: string;
    date: string;
    duration?: number;
    score?: number;
  }> | undefined;
  isLoading: boolean;
  error: Error | null;
}

// Interface pour les documents
export interface ClientDocument {
  id: string
  name: string
  type: string
  size?: number
  uploadedAt: string
  url?: string
  metadata?: {
    contentType?: string
    lastModified?: string
  }
}

export interface UseClientDocumentsReturn {
  documents: ClientDocument[] | undefined
  isLoading: boolean
  error: Error | null
  uploadDocument: (file: File) => Promise<void>
  deleteDocument: (documentId: string) => Promise<void>
}

export interface AIAnalysis {
  conversionProbability: number
  attentionPoints: string[]
  recommendations: string[]
  lastUpdated: string
}

export interface UseClientAIAnalysisReturn {
  analysis: AIAnalysis | null
  isLoading: boolean
  error: Error | null
  generateInsights: () => Promise<void>
}