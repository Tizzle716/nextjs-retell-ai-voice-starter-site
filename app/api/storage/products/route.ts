import { NextResponse } from 'next/server'

const mockProducts = [
  {
    id: '1',
    name: 'Premium CRM Package',
    category: 'Software',
    price: '999.99',
    stock: 100
  },
  {
    id: '2',
    name: 'AI-Powered Analytics Tool',
    category: 'Software',
    price: '499.99',
    stock: 50
  },
  {
    id: '3',
    name: 'Customer Support Training Course',
    category: 'Service',
    price: '299.99',
    stock: 20
  },
  // Add more mock items as needed
]

export async function GET() {
  // Simulate a delay to mimic a real API call
  await new Promise(resolve => setTimeout(resolve, 500))

  return NextResponse.json(mockProducts)
}
