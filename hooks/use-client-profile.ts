// hooks/use-client-profile.ts
import useSWR from 'swr'
import { ClientProfile } from '@/app/types/client-profile'

export function useClientProfile(clientId: string) {
  const { data, error, mutate } = useSWR<ClientProfile>(
    clientId ? `/api/clients/${clientId}` : null,
    async (url) => {
      try {
        const res = await fetch(url)
        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || 'Failed to fetch client profile')
        }
        return res.json()
      } catch (error) {
        console.error('Error in useClientProfile:', error)
        throw error
      }
    },
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
      onErrorRetry: (error, key, config, revalidate, { retryCount }) => {
        // Limiter les tentatives de retry
        if (retryCount >= 3) return
        if (error.status === 404) return

        setTimeout(() => revalidate({ retryCount }), 5000)
      }
    }
  )

  return {
    client: data,
    isLoading: !error && !data,
    isError: error,
    mutate
  }
}