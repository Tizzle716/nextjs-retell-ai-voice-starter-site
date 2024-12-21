export interface AgentFunction {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: {
      [key: string]: {
        type: string;
        description: string;
      };
    };
  };
}

export interface CreateAgentFormData {
  agent_name: string;
  voice_id: string;
  voice_model?: string;
  language: string;
  knowledge_base_id?: string;
  response_engine: {
    type: 'retell-llm';
    llm_model: string;
    system_prompt: string;
    functions: AgentFunction[];
  };
}

export interface Agent {
  agent_id: string;
  agent_name: string;
  voice_id: string;
  fallback_voice_ids: string[];
  voice_temperature: number;
  voice_speed: number;
  volume: number;
  enable_backchannel: boolean;
  backchannel_frequency: number;
  backchannel_words: string[];
  reminder_trigger_ms: number;
  reminder_max_count: number;
  interruption_sensitivity: number;
  ambient_sound_volume: number;
  response_engine: {
    type: 'retell-llm';
    llm_id: string;
  };
  llm_websocket_url: string;
  boosted_keywords: string[];
  enable_transcription_formatting: boolean;
  responsiveness: number;
  language: string;
  opt_out_sensitive_data_storage: boolean;
  pronunciation_dictionary: string[];
  normalize_for_speech: boolean;
  end_call_after_silence_ms: number;
  enable_voicemail_detection: boolean;
  voicemail_message: string;
  max_call_duration_ms: number;
  voicemail_detection_timeout_ms: number;
  last_modification_timestamp: number;
  is_selected?: boolean;
}

export const DEFAULT_AGENT_FUNCTIONS: AgentFunction[] = [
  {
    name: 'End_Call',
    description: 'End the current call',
    parameters: {
      type: 'object',
      properties: {
        reason: {
          type: 'string',
          description: 'Reason for ending the call',
        },
      },
    },
  },
  {
    name: 'Call_Transfer',
    description: 'Transfer the call to another department or agent',
    parameters: {
      type: 'object',
      properties: {
        department: {
          type: 'string',
          description: 'Department or agent to transfer to',
        },
        reason: {
          type: 'string',
          description: 'Reason for the transfer',
        },
      },
    },
  },
  {
    name: 'Check_Calendar_Availability',
    description: 'Check available time slots in the calendar',
    parameters: {
      type: 'object',
      properties: {
        start_date: {
          type: 'string',
          description: 'Start date to check availability (ISO format)',
        },
        end_date: {
          type: 'string',
          description: 'End date to check availability (ISO format)',
        },
      },
    },
  },
  {
    name: 'Book_on_the_Calendar',
    description: 'Book an appointment on the calendar',
    parameters: {
      type: 'object',
      properties: {
        date_time: {
          type: 'string',
          description: 'Date and time for the appointment (ISO format)',
        },
        duration_minutes: {
          type: 'number',
          description: 'Duration of the appointment in minutes',
        },
        description: {
          type: 'string',
          description: 'Description or purpose of the appointment',
        },
      },
    },
  },
];
