import { NextResponse } from 'next/server'
import { TwilioPhoneNumber } from '@/app/types/twilio'

export async function GET() {
  const mockPhoneNumbers: TwilioPhoneNumber[] = [
    {
      sid: 'PN1234567890abcdef1234567890abcdef',
      phoneNumber: '+33123456789',
      friendlyName: 'Main Number',
      capabilities: {
        voice: true,
        SMS: true,
        MMS: true,
      },
    },
    // Add more mock phone numbers here
  ]

  return NextResponse.json(mockPhoneNumbers)
}