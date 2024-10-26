import { NextResponse } from 'next/server'
import { TwilioCall } from '@/app/types/twilio'

export async function GET() {
  const mockCalls: TwilioCall[] = [
    {
      sid: 'CA1234567890abcdef1234567890abcdef',
      to: '+33123456789',
      from: '+33987654321',
      status: 'completed',
      startTime: '2023-06-01T10:00:00Z',
      endTime: '2023-06-01T10:05:00Z',
      duration: 300,
      direction: 'outbound-api',
      price: '0.50',
    },
    // Add more mock calls here
  ]

  return NextResponse.json(mockCalls)
}