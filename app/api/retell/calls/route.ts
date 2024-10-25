import { NextResponse } from 'next/server'
import { RetellCall } from '@/app/types/retell'

// Fonction pour générer un appel mock
function generateMockCall(id: number): RetellCall {
  const startTime = Date.now() - Math.floor(Math.random() * 3600000) // Jusqu'à 1 heure dans le passé
  const endTime = startTime + Math.floor(Math.random() * 600000) // Jusqu'à 10 minutes de durée

  return {
    call_type: Math.random() > 0.5 ? 'inbound' : 'outbound',
    call_id: `call_${id}`,
    agent_id: `agent_${Math.floor(Math.random() * 5) + 1}`,
    call_status: ['completed', 'in_progress', 'failed'][Math.floor(Math.random() * 3)],
    metadata: {},
    retell_llm_dynamic_variables: {
      customer_name: `Customer ${id}`,
    },
    opt_out_sensitive_data_storage: false,
    start_timestamp: startTime,
    end_timestamp: endTime,
    transcript: `This is a mock transcript for call ${id}`,
    transcript_object: [
      {
        role: 'agent',
        content: 'Hello, how can I help you today?',
        words: [],
      },
      {
        role: 'customer',
        content: 'I have a question about my account.',
        words: [],
      },
    ],
    recording_url: `https://example.com/recording_${id}.mp3`,
    public_log_url: `https://example.com/log_${id}.txt`,
    e2e_latency: {
      p50: 100,
      p90: 200,
      p95: 250,
      p99: 300,
      max: 350,
      min: 50,
      num: 100,
    },
    llm_latency: {
      p50: 50,
      p90: 100,
      p95: 125,
      p99: 150,
      max: 175,
      min: 25,
      num: 100,
    },
    llm_websocket_network_rtt_latency: {
      p50: 10,
      p90: 20,
      p95: 25,
      p99: 30,
      max: 35,
      min: 5,
      num: 100,
    },
    disconnection_reason: '',
    call_analysis: {
      call_summary: `This is a summary for call ${id}`,
      in_voicemail: false,
      user_sentiment: ['positive', 'neutral', 'negative'][Math.floor(Math.random() * 3)],
      call_successful: Math.random() > 0.2,
      custom_analysis_data: {},
    },
  }
}

export async function GET() {
  // Générer 20 appels mock
  const mockCalls = Array.from({ length: 20 }, (_, i) => generateMockCall(i + 1))

  return NextResponse.json(mockCalls)
}
