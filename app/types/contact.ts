// Types pour les interactions
export interface ContactInteraction {
  id: string;
  type: string;
  date: string;
  duration?: number;
  score?: number;
}

// Type pour les données brutes de Supabase
export interface SupabaseContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "Lead" | "Prospect" | "Client";
  type?: string;
  tags?: string[];
  score?: number;
  provider?: Provider;
  comments?: string;
  created_at: string;
  updated_at?: string;
  user_id: string;
  interactions?: ContactInteraction[];
}

// Type pour le provider
export interface Provider {
  site?: string;
  funnel?: string;
  call?: string;
  vip?: boolean;
}

// Type principal pour un contact
export interface Contact {
  id: string;
  // Champs obligatoires
  name: string;
  email: string;
  phone: string;
  status: "Lead" | "Prospect" | "Client";
  // Champs optionnels
  dateJoined?: string;
  score?: number;
  type?: string;
  tags?: string[];
  notifications?: {
    lastInteraction?: {
      type: "Appel Sortant" | "Appel Entrant" | "Email Entrant";
      date: string;
      duration?: number;
      score?: number;
    } | null;
    history?: Array<{
      type: string;
      date: string;
      duration?: number;
      score?: number;
    }>;
  } | null;
  provider?: Provider;
  comments?: string;
  interactions?: ContactInteraction[];
}
