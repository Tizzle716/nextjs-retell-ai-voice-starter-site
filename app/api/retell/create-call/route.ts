import { NextResponse } from 'next/server';
import { RetellCall } from '@/app/types/retell';

export async function POST(request: Request) {
  const body = await request.json();
  const { from_number, to_number } = body;

  if (!from_number || !to_number) {
    return NextResponse.json({ error: 'From number and to number are required' }, { status: 400 });
  }

  const mockCall: RetellCall = {
    call_type: "outbound",
    call_id: Math.random().toString(36).substring(7),
    agent_id: "agent_123",
    call_status: "initiated",
    metadata: {},
    retell_llm_dynamic_variables: {
      customer_name: "John Doe"
    },
    opt_out_sensitive_data_storage: false,
    start_timestamp: Date.now(),
    end_timestamp: Date.now() + 300000, // 5 minutes later
    transcript: "This is a mock transcript.",
    transcript_object: [
      {
        role: "agent",
        content: "Hello, this is a mock conversation.",
        words: [
          { word: "Hello,", start: 0, end: 0.5 },
          { word: "this", start: 0.6, end: 0.8 },
          { word: "is", start: 0.9, end: 1.0 },
          { word: "a", start: 1.1, end: 1.2 },
          { word: "mock", start: 1.3, end: 1.5 },
          { word: "conversation.", start: 1.6, end: 2.0 }
        ]
      }
    ],
    recording_url: "https://example.com/mock-recording.mp3",
    public_log_url: "https://example.com/mock-public-log",
    e2e_latency: {
      p50: 100, p90: 150, p95: 200, p99: 250, max: 300, min: 50, num: 100
    },
    llm_latency: {
      p50: 50, p90: 75, p95: 100, p99: 125, max: 150, min: 25, num: 100
    },
    llm_websocket_network_rtt_latency: {
      p50: 10, p90: 15, p95: 20, p99: 25, max: 30, min: 5, num: 100
    },
    disconnection_reason: "",
    call_analysis: {
      call_summary: "This was a mock call for testing purposes.",
      in_voicemail: false,
      user_sentiment: "neutral",
      call_successful: true,
      custom_analysis_data: {}
    }
  };

  return NextResponse.json(mockCall);
}
