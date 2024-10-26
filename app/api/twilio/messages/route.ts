import { NextResponse } from 'next/server'
import { TwilioMessage } from '@/app/types/twilio'

export async function GET() {
  const mockMessages: TwilioMessage[] = [
    {
      sid: 'SM1234567890abcdef1234567890abcdef',
      to: '+33123456789',
      from: '+33987654321',
      body: 'This is a test message',
      status: 'delivered',
      dateSent: '2023-06-01T11:00:00Z',
      direction: 'outbound-api',
      price: '0.10',
    },
    // Add more mock messages here
  ]

  return NextResponse.json(mockMessages)
}