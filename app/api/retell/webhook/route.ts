import { NextResponse } from 'next/server';
import { Retell } from 'retell-sdk';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  console.log('[Webhook] Received POST request');
  
  try {
    // Get the raw body and signature
    const rawBody = await request.text();
    const signature = request.headers.get('x-retell-signature');
    const apiKey = process.env.RETELL_API_KEY;

    if (!signature || !apiKey) {
      console.error('[Webhook] Missing signature or API key');
      return NextResponse.json({ error: 'Missing signature or API key' }, { status: 401 });
    }

    // Verify the signature using Retell's SDK directly
    if (!Retell.verify(rawBody, apiKey, signature)) {
      console.error('[Webhook] Invalid signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    // Parse the body
    const body = JSON.parse(rawBody);
    const { event, call } = body;
    console.log('[Webhook] Received event:', event, 'for call:', call?.call_id);

    // Initialize Supabase client
    const supabase = createRouteHandlerClient({ cookies });

    // Handle different event types
    switch (event) {
      case 'call_started':
        console.log('[Webhook] Call started:', call.call_id);
        try {
          await supabase
            .from('retell_calls')
            .upsert({
              call_id: call.call_id,
              call_type: call.call_type,
              agent_id: call.agent_id,
              call_status: 'started',
              start_timestamp: call.start_timestamp || new Date().toISOString(),
              metadata: call.metadata || {},
              retell_llm_dynamic_variables: call.retell_llm_dynamic_variables || {},
              analysis: null // Initialize analysis as null
            }, {
              onConflict: 'call_id'
            });

          // Verify the call was started in Retell
          if (call.call_id && process.env.RETELL_API_KEY) {
            const client = new Retell({ apiKey: process.env.RETELL_API_KEY });
            await client.call.retrieve(call.call_id);
          }
        } catch (error) {
          console.error('[Webhook] Error processing call_started:', error);
          // Don't throw - we want to return 204 even if database update fails
        }
        break;

      case 'call_ended':
        console.log('[Webhook] Call ended:', call.call_id);
        try {
          // Update call status immediately
          await supabase
            .from('retell_calls')
            .update({
              call_status: 'ended',
              end_timestamp: call.end_timestamp,
              analysis: call.analysis || null // Use null if no analysis available
            })
            .eq('call_id', call.call_id);

          // Only attempt to retrieve call if we have both client and call_id
          if (call.call_id && process.env.RETELL_API_KEY) {
            const client = new Retell({ apiKey: process.env.RETELL_API_KEY });
            await client.call.retrieve(call.call_id);
          }
        } catch (error) {
          console.error('[Webhook] Error processing call_ended:', error);
          // Don't throw - we want to return 204 even if database update fails
        }
        break;

      case 'call_analyzed':
        console.log('[Webhook] Call analyzed:', call.call_id);
        try {
          await supabase
            .from('retell_calls')
            .update({
              call_status: 'analyzed',
              analysis: call.analysis || {}
            })
            .eq('call_id', call.call_id);
        } catch (error) {
          console.error('[Webhook] Error processing call_analyzed:', error);
          // Don't throw - we want to return 204 even if database update fails
        }
        break;

      default:
        console.log('[Webhook] Received unknown event:', event);
    }

    // Return 204 No Content to acknowledge receipt
    return new NextResponse(null, { status: 204 });

  } catch (error) {
    console.error('[Webhook] Error processing webhook:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}