// hooks/use-client-profile.ts
import useSWR from 'swr'
import type { ClientProfile } from '@/app/types/client-profile'

const fetcher = async (url: string) => {
  const response = await fetch(url)
  if (!response.ok) {
    throw new Error('Failed to fetch client profile')
  }
  return response.json()
}

export function useClientProfile(clientId: string) {
  const { data, error, isLoading, mutate } = useSWR<ClientProfile>(
    `/api/clients/${clientId}`,
    fetcher
  )

  return {
    client: data,
    isLoading,
    isError: error,
    mutate
  }
}