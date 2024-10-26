export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  createdAt: string;
  updatedAt: string;
}

export interface Proposal {
  id: string;
  title: string;
  client: string;
  date: string;
  status: 'draft' | 'sent' | 'accepted' | 'rejected';
  score: number;
  createdAt: string;
  updatedAt: string;
}

