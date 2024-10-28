import type { User, Session } from '@supabase/supabase-js'

export interface AuthResponse {
  error: Error | null;
  data: {
    user: User | null;
    session: Session | null;
  };
}

export interface AuthError {
  message: string;
}
