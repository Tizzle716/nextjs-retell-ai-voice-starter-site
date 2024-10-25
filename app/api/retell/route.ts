import { NextResponse } from 'next/server';
import Retell from 'retell-sdk';

const apiKey = process.env.RETELL_API_KEY;
if (!apiKey) {
  throw new Error('RETELL_API_KEY is not defined in the environment variables');
}

const client = new Retell({
  apiKey,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const callId = searchParams.get('callId');

  if (!callId) {
    return NextResponse.json({ error: 'Call ID is required' }, { status: 400 });
  }

  try {
    const callResponse = await client.call.retrieve(callId);
    return NextResponse.json(callResponse);
  } catch (error) {
    console.error('Error fetching call data:', error);
    return NextResponse.json({ error: 'Failed to fetch call data' }, { status: 500 });
  }
}
