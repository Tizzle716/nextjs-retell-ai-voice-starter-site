import { NextResponse } from 'next/server';
import Retell from 'retell-sdk';
import { z } from 'zod';
import { WebSocketServer } from 'ws';
import { CustomLlmRequest, CustomLlmResponse } from './types';

// Zod schema for validating call retrieval using SDK types
const CallRetrieveSchema = z.object({
  agent_id: z.string(),
  call_id: z.string(),
  call_status: z.enum(['registered', 'ongoing', 'ended', 'error']),
  call_type: z.enum(['web_call', 'phone_call']),
  access_token: z.string().optional(),
  start_timestamp: z.number().optional(),
  end_timestamp: z.number().optional(),
  transcript: z.string().optional(),
  metadata: z.record(z.unknown()).optional(),
  disconnection_reason: z.enum([
    'user_hangup',
    'agent_hangup',
    'call_transfer',
    'voicemail_reached',
    'inactivity',
    'machine_detected',
    'max_duration_reached',
    'concurrency_limit_reached',
    'no_valid_payment',
    'scam_detected',
    'error_inbound_webhook',
    'dial_busy',
    'dial_failed',
    'dial_no_answer',
    'error_llm_websocket_open',
    'error_llm_websocket_lost_connection',
    'error_llm_websocket_runtime',
    'error_llm_websocket_corrupt_payload',
    'error_frontend_corrupted_payload',
    'error_twilio',
    'error_no_audio_received',
    'error_asr',
    'error_retell',
    'error_unknown',
    'error_user_not_joined',
    'registered_call_timeout'
  ]).optional(),
  call_analysis: z.object({
    call_successful: z.boolean().optional(),
    call_summary: z.string().optional(),
    custom_analysis_data: z.unknown().optional(),
    in_voicemail: z.boolean().optional(),
    user_sentiment: z.enum(['Negative', 'Positive', 'Neutral', 'Unknown']).optional()
  }).optional()
});

type CallRetrieveResponse = z.infer<typeof CallRetrieveSchema>;

const initializeRetellClient = (): Retell => {
  const apiKey = process.env.RETELL_API_KEY;
  if (!apiKey) {
    throw new Error('RETELL_API_KEY is not defined');
  }
  return new Retell({ apiKey });
};

const retrieveCall = async (callId: string): Promise<CallRetrieveResponse> => {
  try {
    const client = initializeRetellClient();
    const callDetails = await client.call.retrieve(callId);
    
    // Validate the retrieved call details
    return CallRetrieveSchema.parse(callDetails);
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error retrieving call:', error.message);
    }
    throw error;
  }
};

// WebSocket handler for Retell LLM integration
let wss: WebSocketServer | null = null;

if (typeof process !== 'undefined' && !wss) {
  wss = new WebSocketServer({ 
    noServer: true,
    path: "/api/retell/llm-websocket"
  });

  wss.on('connection', async (ws, req) => {
    try {
      const callId = req.url?.split('/').pop();
      console.log("Handle llm ws for: ", callId);

      // Send initial config
      const config: CustomLlmResponse = {
        response_type: "config",
        config: {
          auto_reconnect: true,
          call_details: true,
        },
      };
      ws.send(JSON.stringify(config));

      ws.on('error', (err) => {
        console.error("Error received in LLM websocket client: ", err);
      });

      ws.on('close', () => {
        console.error("Closing llm ws for: ", callId);
      });

      ws.on('message', async (data: Buffer) => {
        try {
          const message = JSON.parse(data.toString()) as CustomLlmRequest;
          
          // Handle different message types
          switch (message.request_type) {
            case 'transcription':
              // Process transcription and generate response
              const response: CustomLlmResponse = {
                response_type: 'llm_response',
                response: {
                  content: "I'll help you with that request.",
                  // Add any additional response parameters
                }
              };
              ws.send(JSON.stringify(response));
              break;

            case 'call_details':
              console.log("Received call details:", message.call_details);
              break;

            default:
              console.warn("Unknown message type:", message.request_type);
          }
        } catch (error) {
          console.error("Error processing message:", error);
        }
      });
    } catch (error) {
      console.error("WebSocket connection error:", error);
    }
  });
}

// Zod schema for webhook payload validation
const WebhookPayloadSchema = z.object({
  event_type: z.enum(['call_ended', 'call_analyzed']),
  call_id: z.string(),
  timestamp: z.number(),
  data: z.record(z.unknown())
});

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const callId = searchParams.get('call_id');

    if (!callId) {
      return NextResponse.json(
        { error: 'Call ID is required' }, 
        { status: 400 }
      );
    }

    const callDetails = await retrieveCall(callId);

    return NextResponse.json(callDetails, { status: 200 });
  } catch (error) {
    console.error('API Error:', error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: 'Invalid call data', 
          details: error.errors.map(e => ({
            path: e.path.join('.'),
            message: e.message
          }))
        }, 
        { status: 422 }
      );
    }

    // Handle specific Retell API errors
    if (error instanceof Error) {
      if (error.message.includes('not found')) {
        return NextResponse.json(
          { error: 'Call not found' },
          { status: 404 }
        );
      }
      if (error.message.includes('unauthorized')) {
        return NextResponse.json(
          { error: 'Unauthorized access' },
          { status: 401 }
        );
      }
    }

    return NextResponse.json(
      { error: 'Failed to retrieve call details' }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  console.log('[Webhook] Received POST request to webhook endpoint');
  
  try {
    // Log the raw request details
    const url = request.url;
    const method = request.method;
    const headers = Object.fromEntries(request.headers);
    console.log('[Webhook] Request details:', {
      url,
      method,
      headers
    });

    const payload = await request.json();
    console.log('[Webhook] Received payload:', JSON.stringify(payload, null, 2));
    
    const validatedPayload = WebhookPayloadSchema.parse(payload);
    console.log('[Webhook] Validated payload:', validatedPayload);
    
    switch (validatedPayload.event_type) {
      case 'call_ended':
        console.log('[Webhook] Processing call_ended event:', validatedPayload.data);
        break;
      
      case 'call_analyzed':
        console.log('[Webhook] Processing call_analyzed event:', validatedPayload.data);
        break;
    }
    
    return NextResponse.json({ status: 'success' }, { status: 200 });
  } catch (error) {
    console.error('[Webhook] Error processing webhook:', error);
    
    if (error instanceof z.ZodError) {
      console.error('[Webhook] Validation error:', JSON.stringify(error.errors, null, 2));
      return NextResponse.json(
        { 
          error: 'Invalid webhook payload', 
          details: error.errors.map(e => ({
            path: e.path.join('.'),
            message: e.message
          }))
        }, 
        { status: 422 }
      );
    }
    
    if (error instanceof Error) {
      console.error('[Webhook] Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      });
    }
    
    return NextResponse.json(
      { error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
