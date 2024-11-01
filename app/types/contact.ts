import { Interaction } from "./interaction"

// Type pour le provider
export interface Provider {
  site?: string;
  funnel?: string;
  call?: string;
  vip?: boolean;
}

// Type pour les données brutes de Supabase
export interface SupabaseContact {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: "lead" | "prospect" | "client";
  type?: string;
  tags?: string[];
  score?: number;
  provider?: Provider;
  comments?: string;
  created_at: string;
  updated_at?: string;
  user_id: string;
  interactions?: Interaction[];
}

// Type principal pour un contact
export interface Contact {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: 'lead' | 'prospect' | 'client';
  tags: string[];
  notes?: string;
  created_at: string;
  updated_at?: string;
  user_id: string;
  provider?: Provider;
  score?: number;
  dateJoined?: string;
  comments?: string;
  notifications?: {
    lastInteraction: Interaction | null;
    history: Interaction[];
  };
}
