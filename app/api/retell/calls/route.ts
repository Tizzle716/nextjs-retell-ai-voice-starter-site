import { NextResponse } from 'next/server';
import { z } from 'zod';
import Retell from 'retell-sdk';

// Define the schema here since it's not exported from types
const RetellCallDataSchema = z.object({
  agent_id: z.string(),
  customer_number: z.string(),
  webhook_url: z.string().optional(),
  recording_webhook_url: z.string().optional(),
  recording_format: z.string().optional(),
  recording_destination_url: z.string().optional()
});

interface RetellCall {
  call_id: string;
  agent_id: string;
  customer_number: string;
  status: string;
  created_at: string;
  updated_at: string;
}

const client = new Retell({
  apiKey: process.env.RETELL_API_KEY || '',
});

// Helper function to handle API responses
async function handleApiResponse(response: Response, context: string) {
  const contentType = response.headers.get('content-type');
  let errorData: any;
  
  try {
    if (contentType?.includes('application/json')) {
      errorData = await response.json();
    } else {
      errorData = await response.text();
    }
  } catch (e) {
    errorData = 'Could not parse response';
  }

  console.error(`${context} API error:`, {
    status: response.status,
    statusText: response.statusText,
    data: errorData,
  });

  let errorMessage = 'An error occurred';
  if (typeof errorData === 'string') {
    errorMessage = errorData;
  } else if (errorData?.error) {
    errorMessage = errorData.error;
  } else if (errorData?.message) {
    errorMessage = errorData.message;
  }

  const error = new Error(errorMessage);
  (error as any).status = response.status;
  (error as any).data = errorData;
  throw error;
}

export async function GET(request: Request) {
  try {
    if (!process.env.RETELL_API_KEY) {
      console.error('Retell API key is missing');
      return NextResponse.json(
        { error: 'Retell API key not configured' },
        { status: 500 }
      );
    }

    const { searchParams } = new URL(request.url);
    const callId = searchParams.get('callId');
    const limit = parseInt(searchParams.get('limit') || '10');
    const offset = parseInt(searchParams.get('offset') || '0');

    // If callId is provided, fetch specific call
    if (callId) {
      try {
        // TODO: Replace with proper Retell API call when types are fixed
        const call: RetellCall = {
          call_id: callId,
          agent_id: 'placeholder',
          customer_number: 'placeholder',
          status: 'completed',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };

        return NextResponse.json(call);
      } catch (error: any) {
        console.error('[Calls API] Error fetching call:', error);
        return NextResponse.json(
          { error: 'Failed to fetch call' },
          { status: error.status || 500 }
        );
      }
    }

    // If no callId, fetch all calls with pagination
    try {
      // TODO: Replace with proper Retell API call when types are fixed
      const calls: RetellCall[] = [{
        call_id: 'placeholder',
        agent_id: 'placeholder',
        customer_number: 'placeholder',
        status: 'completed',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }];

      return NextResponse.json({
        calls,
        pagination: {
          total: calls.length,
          limit,
          offset
        }
      });
    } catch (error: any) {
      console.error('[Calls API] Error fetching calls:', error);
      return NextResponse.json(
        { error: 'Failed to fetch calls' },
        { status: error.status || 500 }
      );
    }
  } catch (error: any) {
    console.error('[Calls API] Error in GET /api/calls:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: error.status || 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    if (!process.env.RETELL_API_KEY) {
      console.error('Retell API key is missing');
      return NextResponse.json(
        { error: 'Retell API key not configured' },
        { status: 500 }
      );
    }

    const body = await request.json();
    console.log('[Calls API] Creating new call with data:', body);

    try {
      // TODO: Replace with proper Retell API call when types are fixed
      const callData: RetellCall = {
        call_id: 'placeholder',
        agent_id: body.agent_id,
        customer_number: body.customer_number,
        status: 'created',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return NextResponse.json(callData);
    } catch (error: any) {
      console.error('[Calls API] Error creating call:', error);
      console.error('[Calls API] Error details:', {
        message: error.message,
        status: error.status,
        stack: error.stack
      });
      
      return NextResponse.json(
        { error: 'Failed to create call' },
        { status: error.status || 500 }
      );
    }
  } catch (error: any) {
    console.error('[Calls API] Error in POST /api/calls:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: error.status || 500 }
    );
  }
}
