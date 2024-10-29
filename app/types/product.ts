// app/types/product.ts
export type ProductCategory = 'Renovation' | 'Energy' | 'RealEstate' | 'Coaching' | '';
export type ProductType = 'Product' | 'Service';

// Type spécifique pour le range de prix
interface PriceRange {
  min?: number;
  max?: number;
}

// Type spécifique pour le prix
interface ProductPrice {
  base: number;
  hasRange: boolean;
  range?: PriceRange;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  type: ProductType;
  category: ProductCategory;
  subcategory: string;
  technicalSpecs: Record<string, string>;
  price: ProductPrice;
  tags: string[];
  embedding_vector?: number[];
  media: {
    images: string[];
    videos?: string[];
    documents?: string[];
  };
  metadata: {
    duration?: string;
    efficiency?: string;
    warranty?: string;
    maintenance?: string;
    certifications?: string[];
  };
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Type pour le formulaire
export type ProductFormValues = {
  title: string;
  description: string;
  type: ProductType;
  category: ProductCategory;
  subcategory: string;
  technicalSpecs: Record<string, string>;
  price: ProductPrice;
  tags: string[];
  media: {
    images: string[];
    videos?: string[];
    documents?: string[];
  };
  metadata: {
    duration?: string;
    efficiency?: string;
    warranty?: string;
    maintenance?: string;
    certifications?: string[];
  };
};

// Type pour la validation du formulaire (utilisé avec Zod)
export type ProductFormData = {
  title: string;
  description: string;
  type: ProductType;
  category: ProductCategory;
  subcategory: string;
  price: ProductPrice;
  technicalSpecs: Record<string, string>;
  tags: string[];
  media: {
    images: string[];
    videos?: string[];
    documents?: string[];
  };
  metadata: {
    duration?: string;
    efficiency?: string;
    warranty?: string;
    maintenance?: string;
    certifications?: string[];
  };
};

// Type pour la recherche
export interface Search {
  query: string;
  threshold: number;
  category?: ProductCategory;
}

// Ajoutez ces types pour Supabase
export interface PostgrestError {
  message: string;
  details: string;
  hint?: string;
  code: string;
}

// Add these new types for database operations
export interface DatabaseProduct {
  id: string;
  title: string;
  description: string;
  type: ProductType;
  category: ProductCategory;
  subcategory: string;
  technical_specs: Record<string, string>;
  price: ProductPrice;
  tags: string[];
  embedding_vector?: number[];
  media: {
    images: string[];
    videos?: string[];
    documents?: string[];
  };
  metadata: {
    duration?: string;
    efficiency?: string;
    warranty?: string;
    maintenance?: string;
    certifications?: string[];
  };
  created_at: string;
  updated_at: string;
  user_id: string;
}

// Update SupabaseResponse to use DatabaseProduct
export interface SupabaseResponse<T = DatabaseProduct> {
  data: T[] | null;
  error: PostgrestError | null;
}

// Transform Functions
export function transformProductForDb(data: ProductFormValues) {
  const { technicalSpecs, ...rest } = data;
  return {
    ...rest,
    technical_specs: technicalSpecs || {},
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
}

export function transformProductFromDb(data: DatabaseProduct): Product {
  const { technical_specs, created_at, updated_at, ...rest } = data;
  return {
    ...rest,
    technicalSpecs: technical_specs || {},
    created_at,
    updated_at
  }
}
