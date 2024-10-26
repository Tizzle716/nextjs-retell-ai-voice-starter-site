import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useProducts() {
  const { data, error } = useSWR('/api/storage/products', fetcher)

  return {
    data,
    isLoading: !error && !data,
    error
  }
}
