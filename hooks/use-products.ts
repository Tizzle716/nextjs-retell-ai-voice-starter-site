import { useEffect, useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { Product, DatabaseProduct, transformProductFromDb } from '@/app/types/product'

export function useProducts() {
  const [data, setData] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const supabase = createClient()

  const fetchProducts = async () => {
    try {
      setIsLoading(true)
      const { data: dbProducts, error: supabaseError } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

      if (supabaseError) throw supabaseError

      if (dbProducts) {
        // Conversion explicite et sûre des données
        const safeDbProducts = dbProducts as unknown as DatabaseProduct[]
        const products = safeDbProducts.map(transformProductFromDb)
        setData(products)
      } else {
        setData([])
      }
      
    } catch (err) {
      console.error('Erreur lors du chargement des produits:', err)
      setError(err instanceof Error ? err : new Error('Erreur inconnue'))
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  return { 
    data, 
    isLoading, 
    error, 
    refetch: fetchProducts 
  }
}
