'use client';

import { useEffect, useState, forwardRef, useImperativeHandle } from "react";
import { LiveCallInterface } from "@/components/retell/LiveCallInterface";
import { Agent } from "@/types/agent";
import { useToast } from "@/components/ui/use-toast";

interface LiveCallSectionProps {
  onPricingClick?: () => Promise<void>;
}

export interface LiveCallSectionRef {
  startCall: () => void;
}

const LiveCallSection = forwardRef<LiveCallSectionRef, LiveCallSectionProps>(
  ({ onPricingClick }, ref) => {
    const [agent, setAgent] = useState<Agent | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [isCallActive, setIsCallActive] = useState(false);
    const { toast } = useToast();

    useEffect(() => {
      async function fetchAgent() {
        try {
          // Use environment variables directly
          console.log('[LiveCallSection] Checking API settings...');
          const retellApiKey = process.env.NEXT_PUBLIC_RETELL_API_KEY;
          const retellAgentId = process.env.NEXT_PUBLIC_RETELL_AGENT_ID;
          
          if (!retellApiKey || !retellAgentId) {
            throw new Error('Please configure your API settings first');
          }

          // Create agent object with all required properties
          const agent: Agent = {
            agent_id: retellAgentId,
            agent_name: 'Default Agent',
            voice_id: 'eleven_labs_karen',
            fallback_voice_ids: [],
            voice_temperature: 0.5,
            voice_speed: 1.0,
            volume: 1.0,
            enable_backchannel: true,
            backchannel_frequency: 0.5,
            backchannel_words: ['mm-hmm', 'yes', 'okay'],
            reminder_trigger_ms: 30000,
            reminder_max_count: 3,
            interruption_sensitivity: 0.5,
            ambient_sound_volume: 0.1,
            response_engine: {
              type: 'retell-llm',
              llm_id: 'gpt-4'
            },
            llm_websocket_url: process.env.NEXT_PUBLIC_WEBSOCKET_URL || 'wss://api.retellai.com/retell-llm/llm-websocket',
            boosted_keywords: [],
            enable_transcription_formatting: true,
            responsiveness: 0.8,
            language: 'en-US',
            opt_out_sensitive_data_storage: false,
            pronunciation_dictionary: [],
            normalize_for_speech: true,
            end_call_after_silence_ms: 30000,
            enable_voicemail_detection: true,
            voicemail_message: 'Please leave a message after the tone.',
            max_call_duration_ms: 300000,
            voicemail_detection_timeout_ms: 10000,
            last_modification_timestamp: Date.now()
          };
          
          setAgent(agent);
          setLoading(false);
        } catch (err: any) {
          console.error('[LiveCallSection] Error:', err);
          setError(err.message || 'Failed to load agent');
          toast({
            title: "Error",
            description: err.message || "Failed to load agent. Please check your settings.",
            variant: "destructive"
          });
        }
      }

      fetchAgent();
    }, [toast]);

    useImperativeHandle(ref, () => ({
      startCall: async () => {
        if (!agent) {
          toast({
            title: "Error",
            description: "Please wait for the agent to load",
            variant: "destructive"
          });
          return;
        }
        console.log('Starting call...');
        setIsCallActive(true);
      }
    }));

    if (loading) {
      return (
        <div className="p-4 rounded-xl border border-[#00ff8f]/20 bg-black/40 backdrop-blur-sm shadow-[0_0_30px_rgba(0,255,143,0.1)]">
          <div className="animate-pulse">Loading agent...</div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="p-4 rounded-xl border border-red-500/20 bg-black/40 backdrop-blur-sm">
          <div className="text-red-500">{error}</div>
        </div>
      );
    }

    return (
      <div className="p-4 rounded-xl border border-[#00ff8f]/20 bg-black/40 backdrop-blur-sm shadow-[0_0_30px_rgba(0,255,143,0.1)]">
        <LiveCallInterface 
          agent={agent} 
          onClose={() => setIsCallActive(false)} 
          onPricingClick={onPricingClick}
          isActive={isCallActive}
        />
      </div>
    );
  }
);

LiveCallSection.displayName = 'LiveCallSection';

export default LiveCallSection;
