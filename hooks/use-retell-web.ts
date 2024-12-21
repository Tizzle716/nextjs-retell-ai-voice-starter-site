'use client'

import { useState, useEffect, useCallback } from 'react'
import { RetellWebClient } from "retell-client-js-sdk";
import { v4 as uuidv4 } from 'uuid';
import { WebCallResponse } from '../types/retell';

interface Message {
  id: string;
  type: 'response' | 'transcription';
  role?: string;  
  content: string;
  timestamp: Date;
}

interface TranscriptItem {
  role: string;
  content: string;
}

interface RetellWebState {
  isCallActive: boolean;
  isListening: boolean;
  webClient: RetellWebClient | null;
  error: string | null;
  currentResponse: string;
  currentTranscript: TranscriptItem | null;
  messages: Message[];
  apiKey: string | null;
}

interface RetellWebConfig {
  agent_id: string;
  voice_id?: string;
  language?: string;
}

interface FunctionCall {
  funcName: string;
  arguments: any;
}

interface RetellResponse {
  response_id: string;
  content: string;
  content_complete: boolean;
  end_call?: boolean;
  function_call?: FunctionCall;
}

// Update RetellWebClient interface to match SDK
declare module "retell-client-js-sdk" {
  interface RetellWebClient {
    disconnect(): Promise<void>;
    startCall(config: { 
      accessToken: string;
    }): Promise<void>;
    stopCall(): Promise<void>;
    on(event: string, listener: (...args: any[]) => void): this;
    removeAllListeners(): this;
  }
}

export function useRetellWeb(config: RetellWebConfig | undefined = undefined) {
  const [state, setState] = useState<RetellWebState>({
    isCallActive: false,
    isListening: false,
    webClient: null,
    error: null,
    currentResponse: '',
    currentTranscript: null,
    messages: [],
    apiKey: process.env.NEXT_PUBLIC_RETELL_API_KEY || null
  });

  // Only initialize if we have a config
  useEffect(() => {
    if (!config) {
      console.log('[useRetellWeb] No config provided, waiting for initialization');
      return;
    }

    console.log('[useRetellWeb] Initializing hook with config:', {
      agent_id: config.agent_id,
      voice_id: config.voice_id,
      language: config.language
    });

    // Initialize RetellWebClient directly with env variable
    setState(prev => ({ 
      ...prev, 
      webClient: new RetellWebClient() 
    }));
    console.log('[useRetellWeb] Successfully initialized RetellWebClient');

    // Cleanup
    return () => {
      if (state.webClient) {
        console.log('[useRetellWeb] Cleaning up RetellWebClient');
        state.webClient.removeAllListeners();
        if (typeof state.webClient.disconnect === 'function') {
          state.webClient.disconnect().catch(console.error);
        }
      }
    };
  }, [config?.agent_id, config?.voice_id, config?.language]);

  const startWebCall = useCallback(async () => {
    if (!state.apiKey || !config?.agent_id) {
      console.error('[useRetellWeb] Missing required configuration');
      setState(prevState => ({ 
        ...prevState, 
        error: 'Missing required configuration' 
      }));
      return;
    }

    try {
      // Clean up existing webClient if it exists
      if (state.webClient) {
        try {
          await state.webClient.stopCall();
          if (typeof state.webClient.disconnect === 'function') {
            await state.webClient.disconnect();
          }
        } catch (e) {
          console.warn('[useRetellWeb] Error cleaning up existing webClient:', e);
        }
      }

      // Create web call and get access token
      const response = await fetch('/api/retell/create-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agentId: config.agent_id,
          apiKey: state.apiKey
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to create call' }));
        throw new Error(errorData.error || 'Failed to create call');
      }

      const { access_token } = await response.json();

      // Start the call with the access token
      await state.webClient?.startCall({
        accessToken: access_token
      });

      setState(prev => ({
        ...prev,
        isCallActive: true,
        error: null
      }));

      console.log("[useRetellWeb] Call started successfully");
      
      setState(prevState => ({
        ...prevState,
        isCallActive: true
      }));
    } catch (error) {
      console.error('[useRetellWeb] Error creating web call:', error);
      setState(prevState => ({ 
        ...prevState, 
        error: error instanceof Error ? error.message : 'Failed to create web call',
        webClient: null
      }));
      throw error;
    }
  }, [state.apiKey, state.webClient, config]);

  const endCall = useCallback(async () => {
    try {
      if (state.webClient && state.isCallActive) {
        await state.webClient.stopCall();
        setState(prev => ({
          ...prev,
          isCallActive: false,
          isListening: false,
          currentTranscript: null
        }));
        console.log('[useRetellWeb] Call ended successfully');
      }
    } catch (error) {
      console.error('[useRetellWeb] Error ending call:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to end call',
        isCallActive: false,
        isListening: false
      }));
    }
  }, [state.webClient, state.isCallActive]);

  const toggleCall = useCallback(async () => {
    try {
      if (state.isCallActive) {
        await endCall();
      } else {
        await startWebCall();
      }
    } catch (error) {
      console.error('[useRetellWeb] Call error:', error);
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Call operation failed',
        isCallActive: false,
        isListening: false
      }));
      throw error;
    }
  }, [state.isCallActive, startWebCall, endCall]);

  useEffect(() => {
    if (!state.webClient) return;

    console.log('[useRetellWeb] Setting up event listeners');

    state.webClient.on("update", (update: { 
      transcript?: TranscriptItem[],
      llmResponse?: string,
      response?: string | { content?: string; text?: string }
    }) => {
      console.log('[useRetellWeb] Received update:', JSON.stringify(update, null, 2));
      
      // Handle transcript updates
      if (update.transcript && Array.isArray(update.transcript)) {
        // Get only the latest transcript for each role
        const latestTranscript = update.transcript[update.transcript.length - 1];
        if (!latestTranscript) return;

        const role = latestTranscript.role.toLowerCase() === 'agent' ? 'agent' : 'user';
        const content = latestTranscript.content.trim();

        if (!content) return;

        setState(prevState => {
          const isNewSpeaker = prevState.currentTranscript?.role !== role;

          // If speaker changed, save current transcript as message
          if (isNewSpeaker && prevState.currentTranscript?.content) {
            return {
              ...prevState,
              messages: [
                ...prevState.messages,
                {
                  id: uuidv4(),
                  type: 'transcription',
                  role: prevState.currentTranscript.role,
                  content: prevState.currentTranscript.content,
                  timestamp: new Date()
                }
              ],
              currentTranscript: {
                role,
                content
              }
            };
          }

          // Just update current transcript
          return {
            ...prevState,
            currentTranscript: {
              role,
              content
            }
          };
        });
      }

      // Handle LLM response updates
      if (update.llmResponse) {
        setState(prevState => ({
          ...prevState,
          currentResponse: update.llmResponse || ''
        }));
      }

      // Handle final responses
      if (update.response) {
        const responseContent = typeof update.response === 'object' 
          ? (update.response.content || update.response.text || JSON.stringify(update.response))
          : update.response;
          
        setState(prevState => {
          // First save any pending transcript
          const newMessages = [...prevState.messages];
          if (prevState.currentTranscript?.content) {
            newMessages.push({
              id: uuidv4(),
              type: 'transcription',
              role: prevState.currentTranscript.role,
              content: prevState.currentTranscript.content,
              timestamp: new Date()
            });
          }

          // Then add the response
          return {
            ...prevState,
            messages: [
              ...newMessages,
              {
                id: uuidv4(),
                type: 'response',
                role: 'agent',
                content: responseContent,
                timestamp: new Date()
              }
            ],
            currentResponse: responseContent
          };
        });
      }
    });

    state.webClient.on("error", (error) => {
      console.error('[useRetellWeb] Call error:', error);
      setState(prevState => ({
        ...prevState,
        error: error.message || 'An error occurred during the call'
      }));
    });

    state.webClient.on("call_ended", () => {
      console.log('[useRetellWeb] Call ended - saving final transcript');
      setState(prevState => {
        const newMessages = [...prevState.messages];
        if (prevState.currentTranscript?.content) {
          newMessages.push({
            id: uuidv4(),
            type: 'transcription',
            role: prevState.currentTranscript.role,
            content: prevState.currentTranscript.content,
            timestamp: new Date()
          });
        }
        return {
          ...prevState,
          messages: newMessages,
          currentTranscript: null,
          isCallActive: false,
          isListening: false
        };
      });
    });

    return () => {
      if (state.webClient) {
        state.webClient.removeAllListeners();
      }
    };
  }, [state.webClient]);

  return {
    toggleCall,
    isCallActive: state.isCallActive,
    isListening: state.isListening,
    error: state.error,
    messages: state.messages,
    currentResponse: state.currentResponse,
    currentTranscript: state.currentTranscript,
    webClient: state.webClient,
    fullTranscript: state.messages.reduce((acc, message) => 
      acc + (message.type === 'transcription' ? message.content + ' ' : ''), '')
  };
}
