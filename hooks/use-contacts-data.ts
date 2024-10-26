import useSWR from 'swr'

const fetcher = (url: string) => fetch(url).then((res) => res.json())

export function useContactsData() {
  const { data, error } = useSWR('/api/storage/contacts-data', fetcher)

  return {
    data,
    isLoading: !error && !data,
    error
  }
}
