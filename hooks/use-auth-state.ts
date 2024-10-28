// hooks/use-auth-state.ts
"use client"

import { User } from '@supabase/supabase-js'
import { createClient } from '@/utils/supabase/client'
import { useEffect, useState } from 'react'

export function useAuthState() {
  const [user, setUser] = useState<User | null>(null)
  const supabase = createClient()

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_, session) => {
        setUser(session?.user ?? null)
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [])

  return { user }
}