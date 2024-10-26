import { NextResponse } from 'next/server'

const mockScripts = [
  {
    id: '1',
    name: 'Customer Onboarding',
    type: 'Process',
    lastModified: '2024-03-15',
    author: 'Alice Johnson'
  },
  {
    id: '2',
    name: 'Sales Pitch - Enterprise',
    type: 'Sales',
    lastModified: '2024-03-10',
    author: 'Bob Smith'
  },
  {
    id: '3',
    name: 'Technical Support Troubleshooting',
    type: 'Support',
    lastModified: '2024-03-05',
    author: 'Charlie Brown'
  },
  // Add more mock items as needed
]

export async function GET() {
  // Simulate a delay to mimic a real API call
  await new Promise(resolve => setTimeout(resolve, 500))

  return NextResponse.json(mockScripts)
}
