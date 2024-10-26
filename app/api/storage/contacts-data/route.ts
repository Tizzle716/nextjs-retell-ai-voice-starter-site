import { NextResponse } from 'next/server'

const mockContactsData = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    lastInteraction: '2024-03-20'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    phone: '+0987654321',
    lastInteraction: '2024-03-18'
  },
  {
    id: '3',
    name: 'Alice Johnson',
    email: 'alice.johnson@example.com',
    phone: '+1122334455',
    lastInteraction: '2024-03-15'
  },
  // Add more mock items as needed
]

export async function GET() {
  // Simulate a delay to mimic a real API call
  await new Promise(resolve => setTimeout(resolve, 500))

  return NextResponse.json(mockContactsData)
}
