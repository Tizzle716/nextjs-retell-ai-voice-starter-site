import { NextResponse } from 'next/server'

const mockKnowledgeItems = [
  {
    id: '1',
    title: 'Product Manual',
    description: 'Comprehensive guide for our main product',
    createdAt: '2023-05-15',
    size: '2.5 MB'
  },
  {
    id: '2',
    title: 'Sales Techniques',
    description: 'Best practices for closing deals',
    createdAt: '2023-06-01',
    size: '1.8 MB'
  },
  {
    id: '3',
    title: 'Customer FAQs',
    description: 'Common questions and answers for support team',
    createdAt: '2023-06-10',
    size: '500 KB'
  },
  // Add more mock items as needed
]

export async function GET() {
  // Simulate a delay to mimic a real API call
  await new Promise(resolve => setTimeout(resolve, 500))

  return NextResponse.json(mockKnowledgeItems)
}
