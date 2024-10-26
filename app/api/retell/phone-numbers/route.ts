import { NextResponse } from 'next/server';
import { RetellPhoneNumber } from '@/app/types/retell';

export async function GET() {
  const mockPhoneNumbers: RetellPhoneNumber[] = [
    {
      phone_number: "+14155552671",
      phone_number_pretty: "(415) 555-2671",
      inbound_agent_id: "agent_123",
      outbound_agent_id: "agent_456",
      area_code: 415,
      nickname: "SF Office",
      last_modification_timestamp: Date.now()
    }
  ];

  return NextResponse.json(mockPhoneNumbers);
}

