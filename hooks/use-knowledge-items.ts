import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useKnowledgeItems() {
  const { data, error } = useSWR('/api/storage/knowledge', fetcher)

  return {
    data,
    isLoading: !error && !data,
    error
  }
}
