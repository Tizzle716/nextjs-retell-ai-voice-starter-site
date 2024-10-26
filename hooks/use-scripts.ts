import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useScripts() {
  const { data, error } = useSWR('/api/storage/scripts', fetcher)

  return {
    data,
    isLoading: !error && !data,
    error
  }
}
