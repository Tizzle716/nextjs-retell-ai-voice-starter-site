'use client'

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import { RetellWebClient } from "retell-client-js-sdk";
import { Retell } from 'retell-sdk';
import type { 
  CallCreateWebCallParams,
} from 'retell-sdk'
import { z } from 'zod';

// Zod schema for WebCallResponse
const WebCallResponseSchema = z.object({
  call_id: z.string().min(1, "Call ID must not be empty"),
  web_call_link: z.string().url("Invalid web call link"),
  access_token: z.string().min(10, "Access token is invalid"),
  agent_id: z.string(),
  call_status: z.enum(['registered', 'ongoing', 'ended', 'error']),
  call_type: z.literal('web_call'),
  metadata: z.record(z.string(), z.unknown()).optional(),
  transcript: z.string().optional(),
  call_analysis: z.object({
    call_successful: z.boolean().optional(),
    call_summary: z.string().optional(),
    user_sentiment: z.enum(['Negative', 'Positive', 'Neutral', 'Unknown']).optional()
  }).optional()
});

type WebCallResponse = z.infer<typeof WebCallResponseSchema>;

interface RetellWidgetProps {
  call: {
    agent_id: string;
  };
  onCallUpdate: (response: WebCallResponse) => void;
}

interface RetellWidgetState {
  error: string | null;
  isLoading: boolean;
  isCallActive: boolean;
  callStatus: 'idle' | 'ongoing' | 'ended' | 'error' | 'registered';
  currentTranscript: string;
  currentResponse: string;
}

export function RetellWidget({ call, onCallUpdate }: RetellWidgetProps) {
  const widgetRef = useRef<HTMLDivElement>(null);
  const clientRef = useRef<RetellWebClient | null>(null);
  const activeCallRef = useRef<WebCallResponse | null>(null);

  const [state, setState] = useState<RetellWidgetState>({
    error: null,
    isLoading: false,
    isCallActive: false,
    callStatus: 'idle',
    currentTranscript: '',
    currentResponse: ''
  });

  const updateState = useCallback((newState: Partial<RetellWidgetState>) => {
    setState(prev => ({ ...prev, ...newState }));
  }, []);

  const defaultCallOptions = useMemo<CallCreateWebCallParams>(() => ({
    agent_id: call.agent_id,
    metadata: {
      timestamp: Date.now(),
      source: 'web_widget'
    }
  }), [call.agent_id]);

  const initializeRetell = useCallback(async () => {
    try {
      updateState({ isLoading: true });

      // Initialize Retell SDK client
      const apiKey = process.env.NEXT_PUBLIC_RETELL_API_KEY;
      if (!apiKey) {
        throw new Error('Retell API Key is required');
      }

      const retellClient = new Retell({
        apiKey: apiKey
      });

      // Create web call using SDK
      const callResponse = await retellClient.call.createWebCall(defaultCallOptions);
      console.log('[Retell] Web call created:', callResponse);
      
      if (!callResponse || !callResponse.access_token) {
        throw new Error('Failed to create web call: Invalid response');
      }

      // Add web_call_link to the response
      const completeCallResponse = {
        ...callResponse,
        web_call_link: `https://app.retellai.com/call/${callResponse.call_id}`
      } as WebCallResponse;

      // Update state with call response
      activeCallRef.current = completeCallResponse;
      onCallUpdate(completeCallResponse);

      // Initialize RetellWebClient for audio handling
      const webClient = new RetellWebClient();
      clientRef.current = webClient;

      // Set up event listeners
      webClient.on("call_started", () => {
        console.log('[Retell] Call started successfully');
        updateState({ 
          isCallActive: true,
          callStatus: 'ongoing',
          error: null 
        });
      });

      webClient.on("error", (error) => {
        console.error('[Retell] Call error:', error);
        updateState({ 
          error: error.message || 'An error occurred during the call',
          callStatus: 'error'
        });
      });

      webClient.on("call_ended", () => {
        console.log('[Retell] Call ended');
        updateState({ 
          isCallActive: false,
          callStatus: 'ended',
          currentTranscript: '',
          currentResponse: ''
        });
      });

      webClient.on("update", (update) => {
        console.log('[Retell] Received update:', update);
        updateState({
          currentTranscript: update.transcript || state.currentTranscript,
          currentResponse: update.response || state.currentResponse
        });
        
        // Notify parent component of updates
        if (activeCallRef.current) {
          onCallUpdate({
            ...activeCallRef.current,
            transcript: update.transcript || activeCallRef.current.transcript,
            call_status: 'ongoing'
          });
        }
      });

      // Start the call with the WebClient
      await webClient.startCall({
        accessToken: callResponse.access_token,
        sampleRate: 24000,
        captureDeviceId: 'default',
        emitRawAudioSamples: false
      });

      updateState({ 
        isLoading: false,
        callStatus: 'registered'
      });
    } catch (error) {
      console.error('[Retell] Initialization error:', error);
      updateState({
        error: error instanceof Error ? error.message : 'Failed to initialize call',
        isLoading: false,
        callStatus: 'error'
      });
    }
  }, [defaultCallOptions, onCallUpdate, updateState]);

  const endCall = useCallback(async () => {
    try {
      if (clientRef.current) {
        await clientRef.current.stopCall();
        updateState({ 
          isCallActive: false,
          callStatus: 'ended',
          currentTranscript: '',
          currentResponse: ''
        });
      }
    } catch (error) {
      console.error('[Retell] Error ending call:', error);
      updateState({
        error: error instanceof Error ? error.message : 'Failed to end call',
        callStatus: 'error'
      });
    }
  }, [updateState]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (clientRef.current) {
        clientRef.current.stopCall();
        clientRef.current.removeAllListeners();
      }
    };
  }, []);

  return (
    <div ref={widgetRef} className="retell-widget p-4 border rounded-lg">
      <div className="flex items-center gap-4 mb-4">
        <button 
          onClick={initializeRetell}
          disabled={state.isLoading || state.isCallActive}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors disabled:opacity-50"
        >
          {state.isLoading ? 'Initializing...' : 'Start Call'}
        </button>

        {state.isCallActive && (
          <button 
            onClick={endCall}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            End Call
          </button>
        )}

        <div className="text-sm font-medium">
          Status: <span className="text-gray-600">{state.callStatus}</span>
        </div>
      </div>

      {state.error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
          <p className="text-sm text-red-600">{state.error}</p>
        </div>
      )}

      {state.currentTranscript && (
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Transcript:</h3>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{state.currentTranscript}</p>
        </div>
      )}

      {state.currentResponse && (
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Response:</h3>
          <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded">{state.currentResponse}</p>
        </div>
      )}
    </div>
  );
}

export default RetellWidget;