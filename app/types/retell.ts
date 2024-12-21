export interface RetellCall {
    call_type: string;
    call_id: string;
    agent_id: string;
    call_status: string;
    metadata: Record<string, unknown>;
    retell_llm_dynamic_variables: {
      customer_name: string;
    };
    opt_out_sensitive_data_storage: boolean;
    start_timestamp: number;
    end_timestamp: number;
    transcript: string;
    transcript_object: TranscriptObject[];
    recording_url: string;
    public_log_url: string;
    e2e_latency: LatencyStats;
    llm_latency: LatencyStats;
    llm_websocket_network_rtt_latency: LatencyStats;
    disconnection_reason: string;
    call_analysis: CallAnalysis;
  }
  
  interface TranscriptObject {
    role: string;
    content: string;
    words: {
      word: string;
      start: number;
      end: number;
    }[];
  }
  
  interface LatencyStats {
    p50: number;
    p90: number;
    p95: number;
    p99: number;
    max: number;
    min: number;
    num: number;
  }
  
  interface CallAnalysis {
    call_summary: string;
    in_voicemail: boolean;
    user_sentiment: string;
    call_successful: boolean;
    custom_analysis_data: Record<string, unknown>;
  }

export interface RetellPhoneNumber {
  phone_number: string;
  phone_number_pretty: string;
  inbound_agent_id: string;
  outbound_agent_id: string;
  area_code: number;
  nickname: string;
  last_modification_timestamp: number;
}

export interface WebCallResponse {
  call_id: string;
  web_call_link: string;
  access_token: string;
  agent_id: string;
  call_status: 'registered' | 'ongoing' | 'ended' | 'error';
  call_type: 'web_call';
  metadata?: Record<string, unknown>;
  transcript?: string;
  call_analysis?: {
    call_successful?: boolean;
    call_summary?: string;
    user_sentiment?: 'Negative' | 'Positive' | 'Neutral' | 'Unknown';
  };
  endCall?: () => Promise<void>;
}

export interface RetellClient {
  createWebCall: (params: { agent_id: string }) => Promise<WebCallResponse>;
  call: {
    endCall: (callId: string) => Promise<void>;
    retrieve: (callId: string) => Promise<RetellCall>;
  };
  agent_id: string;
}

export interface Retell {
  new(config: { apiKey: string }): RetellClient;
  apiKey: string;
  verify(body: string, signature: string, apiKey: string): boolean;
}

export type CallUpdate = RetellCall;

export interface ErrorEvent {
  error: string;
  details?: string;
}

export interface AudioData {
  audio: Float32Array;
  sampleRate: number;
}
