// Types for Retell LLM integration
export interface CustomLlmRequest {
  request_type: 'transcription' | 'call_details';
  transcription?: {
    text: string;
    is_final: boolean;
  };
  call_details?: {
    call_id: string;
    agent_id: string;
    metadata?: Record<string, unknown>;
  };
}

export interface CustomLlmResponse {
  response_type: 'config' | 'llm_response';
  config?: {
    auto_reconnect: boolean;
    call_details: boolean;
  };
  response?: {
    content: string;
    voice_settings?: {
      stability: number;
      similarity_boost: number;
      speed: number;
      pitch: number;
    };
    functions_called?: Array<{
      name: string;
      parameters: Record<string, unknown>;
    }>;
  };
}
