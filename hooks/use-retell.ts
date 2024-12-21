/**
 * @deprecated This file is deprecated. Please use use-retell-web.ts for frontend web client functionality
 * and retell-service.ts for backend SDK functionality.
 */

'use client'

import { useState, useEffect, useCallback } from 'react'
import { Retell } from 'retell-sdk'
import { RetellWebClient } from "retell-client-js-sdk";
import { v4 as uuidv4 } from 'uuid';
import { WebCallResponse } from '../types/retell';

type RetellEvent = any;

interface ApiSettings {
  retell_api_key: string;
  retell_agent_id: string;
}

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

interface RetellState {
  isCallActive: boolean;
  isListening: boolean;
  webClient: RetellWebClient | null;
  error: string | null;
  currentResponse: string;
  currentTranscript: { role: string; content: string } | null;
  messages: Message[];
  accessToken: string | null;
  role: string;
  content: string;
}

interface RetellConfig {
  agent_id: string;
  voice_id: string;
  language: string;
}

// Extend RetellWebClient type to include disconnect, initializeDevices and createWebCall methods
declare module "retell-client-js-sdk" {
  interface RetellWebClient {
    agent_id: string;
    access_token: string;
    voice_id: string;
    language: string;
    accessToken: string;
    sampleRate: number;
    new(): RetellWebClient;
    disconnect(): Promise<void>;
    initializeDevices(): Promise<void>;
    createWebCall(params: { agent_id: string }): Promise<{ access_token: string }>;
    setVoiceConfig(config: { voice_id: string; language: string }): Promise<void>;
    startCall(config: { accessToken: string; sampleRate: number }): Promise<void>;
    stopCall(): Promise<void>;
    on(event: any, listener: (...args: any[]) => void): this;
    removeAllListeners(): this;
  }
}

export function useRetell(config: RetellConfig | undefined = undefined) {
  const [state, setState] = useState<RetellState>({
    isCallActive: false,
    isListening: false,
    webClient: null,
    error: null,
    currentResponse: '',
    currentTranscript: null,
    messages: [],
    accessToken: null,
    role: '',
    content: ''
  });

  const [apiSettings, setApiSettings] = useState<ApiSettings | null>(null);

  // Only initialize if we have a config
  useEffect(() => {
    if (!config) {
      console.log('[useRetell] No config provided, waiting for initialization');
      return;
    }

    console.log('[useRetell] Initializing hook with config:', {
      agent_id: config.agent_id,
      voice_id: config.voice_id,
      language: config.language
    });

    // Fetch API settings
    async function initializeRetell() {
      try {
        const response = await fetch('/api/settings');
        if (!response.ok) {
          throw new Error('Failed to fetch API settings');
        }
        const data = await response.json();
        
        if (!data.retell_api_key) {
          throw new Error('Retell API key not found in settings');
        }

        setApiSettings(data);

        // Initialize RetellWebClient
        const client = new RetellWebClient();

        await client.initializeDevices();
        setState(prev => ({ ...prev, webClient: client }));
        console.log('[useRetell] Successfully initialized RetellWebClient');
      } catch (err: any) {
        console.error('[useRetell] Initialization error:', err);
        setState(prev => ({ ...prev, error: err.message }));
      }
    }

    initializeRetell();

    // Cleanup
    return () => {
      if (state.webClient) {
        console.log('[useRetell] Cleaning up RetellWebClient');
        state.webClient.removeAllListeners();
        state.webClient.disconnect().catch(console.error);
      }
    };
  }, [config?.agent_id, config?.voice_id, config?.language]);

  const createWebCall = useCallback(async () => {
    // Wait for settings to be fetched if they haven't been yet
    if (!apiSettings) {
      try {
        console.log('[useRetell] Fetching API settings before creating web call...');
        const response = await fetch('/api/settings');
        const settings = await response.json();
        console.log('[useRetell] Fetched settings:', {
          hasRetellApiKey: !!settings.retell_api_key,
          retellApiKeyLength: settings.retell_api_key?.length
        });
        setApiSettings(settings);
      } catch (error) {
        console.error('[useRetell] Error fetching API settings:', error);
        setState(prevState => ({ 
          ...prevState, 
          error: 'Failed to load API settings' 
        }));
        return;
      }
    }

    if (!apiSettings?.retell_api_key || !config?.agent_id) {
      console.error('[useRetell] Missing required configuration:', {
        hasApiKey: !!apiSettings?.retell_api_key,
        apiKeyLength: apiSettings?.retell_api_key?.length,
        hasAgentId: !!config?.agent_id,
        agentId: config?.agent_id
      });
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
          await state.webClient.disconnect();
        } catch (e) {
          console.warn('[useRetell] Error cleaning up existing webClient:', e);
        }
      }

      console.log('[useRetell] Creating Retell client with config:', {
        hasApiKey: !!apiSettings.retell_api_key,
        apiKeyLength: apiSettings.retell_api_key.length,
        agentId: config.agent_id
      });

      // Create web call using Retell SDK
      const retellClient = new Retell({
        apiKey: apiSettings.retell_api_key
      });

      console.log('[useRetell] Creating web call with agent_id:', config.agent_id);

      // Create the web call and get access token
      const response = await retellClient.call.createWebCall({
        agent_id: config.agent_id
      });

      if (!response || !response.access_token) {
        console.error('[useRetell] No access token received in response:', response);
        throw new Error('Failed to create web call: No access token received');
      }

      console.log('[useRetell] Received access token:', {
        hasToken: !!response.access_token,
        tokenLength: response.access_token.length
      });
      
      // Initialize devices first
      const retellWebClient = new RetellWebClient();

      await retellWebClient.initializeDevices();

      // Update state with the new client before starting the call
      setState(prevState => ({
        ...prevState,
        webClient: retellWebClient,
        accessToken: response.access_token,
        error: null // Clear any previous errors
      }));

      // Set voice configuration if provided
      if (config?.voice_id) {
        await retellWebClient.setVoiceConfig({
          voice_id: config.voice_id,
          language: config.language || 'english'
        });
      }

      // Start the call with the access token
      try {
        await retellWebClient.startCall({
          accessToken: response.access_token,
          sampleRate: 24000
        });

        console.log("[useRetell] Call started successfully");
        
        setState(prevState => ({
          ...prevState,
          isCallActive: true
        }));
      } catch (error) {
        console.error("[useRetell] Error starting call:", error);
        setState(prevState => ({
          ...prevState,
          error: error instanceof Error ? error.message : 'Failed to start call',
          webClient: null,
          accessToken: null
        }));
        throw error;
      }
    } catch (error) {
      console.error('[useRetell] Error creating web call:', error);
      setState(prevState => ({ 
        ...prevState, 
        error: error instanceof Error ? error.message : 'Failed to create web call',
        webClient: null,
        accessToken: null
      }));
      throw error;
    }
  }, [apiSettings, state.webClient]);

  const toggleCall = useCallback(async () => {
    console.log('[useRetell] Toggle call called:', { 
      hasWebClient: !!state.webClient,
      isCallActive: state.isCallActive,
      hasSettings: !!apiSettings,
      hasApiKey: !!apiSettings?.retell_api_key
    });

    try {
      if (state.isCallActive) {
        console.log('[useRetell] Ending call...');
        if (state.webClient) {
          await state.webClient.stopCall();
          await state.webClient.disconnect();
        }
        setState(prevState => ({
          ...prevState,
          isCallActive: false,
          isListening: false,
          currentTranscript: null,
          webClient: null
        }));
      } else {
        console.log('[useRetell] Starting new call...');
        await createWebCall();
      }
    } catch (error) {
      console.error('[useRetell] Call error:', error);
      setState(prevState => ({ 
        ...prevState, 
        error: error instanceof Error ? error.message : 'Error managing call',
        isCallActive: false,
        isListening: false,
        currentTranscript: null,
        webClient: null
      }));
    }
  }, [state.webClient, state.isCallActive, apiSettings, createWebCall]);

  // Set up event listeners
  useEffect(() => {
    if (!state.webClient) {
      console.warn('[useRetell] webClient is not initialized yet');
      return;
    }

    state.webClient.on("call_started", () => {
      console.log('[useRetell] Call started');
      setState(prevState => ({
        ...prevState,
        isCallActive: true,
        isListening: true,
        error: null,
        currentTranscript: null,
        messages: []
      }));
    });

    state.webClient.on("update", (update: { 
      transcript?: TranscriptItem[],
      llmResponse?: string,
      response?: string | { content?: string; text?: string }
    }) => {
      console.log('[useRetell] Received update:', JSON.stringify(update, null, 2));
      
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
          newMessages.push({
            id: uuidv4(),
            type: 'response',
            role: 'agent',
            content: responseContent,
            timestamp: new Date()
          });

          return {
            ...prevState,
            currentResponse: responseContent,
            currentTranscript: null,
            messages: newMessages
          };
        });
      }
    });

    state.webClient.on("error", (error) => {
      console.error('[useRetell] Call error:', error);
      setState(prevState => ({
        ...prevState,
        error: error.message || 'An error occurred during the call'
      }));
    });

    state.webClient.on("call_ended", () => {
      console.log('[useRetell] Call ended - saving final transcript');
      setState(prevState => {
        const newMessages = [...prevState.messages];
        if (prevState.currentTranscript) {
          console.log('[useRetell] Saving final transcript:', prevState.currentTranscript);
          newMessages.push({
            id: uuidv4(),
            type: 'transcription',
            role: prevState.currentTranscript!.role,
            content: prevState.currentTranscript!.content,
            timestamp: new Date()
          });
        }
        return {
          ...prevState,
          isCallActive: false,
          isListening: false,
          currentTranscript: null,
          messages: newMessages
        };
      });
    });

    // Clean up on unmount
    return () => {
      if (!state.webClient) {
        return;
      }
      state.webClient.stopCall();
      state.webClient.removeAllListeners(); // Make sure to call without arguments
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
