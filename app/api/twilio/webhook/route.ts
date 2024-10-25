import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const body = await request.text();
  const params = new URLSearchParams(body);

  // Simuler la validation de la signature
  const isValid = true;

  if (!isValid) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 403 });
  }

  // Simuler le traitement du webhook
  const messageStatus = params.get('MessageStatus');
  const messageSid = params.get('MessageSid');

  console.log(`Simulated webhook: Message ${messageSid} status updated to ${messageStatus}`);

  return NextResponse.json({ success: true });
}
