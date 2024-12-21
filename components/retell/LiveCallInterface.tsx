'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useToast } from '@/components/ui/use-toast';
import { io, Socket } from 'socket.io-client';
import { motion, AnimatePresence } from "framer-motion";
import { clsx } from "clsx";
import { useRetellWeb } from '@/hooks/use-retell-web';
import SparklesText from '../ui/sparkle-text';
import ElectrolumeStormsphere from './ElectrolumeStormsphere';
import GlowingTypewriter from './GlowingTypewriter';
import { Phone } from "lucide-react";
import styles from './LiveCallInterface.module.css';

interface Message {
  id: string;
  type: 'transcription' | 'response';
  role: 'agent' | 'customer' | 'system';
  content: string;
  timestamp: Date;
}

interface CurrentTranscript {
  role: Message['role'];
  content: string;
}

interface Agent {
  agent_id: string;
  voice_id: string;
  language: string;
}

interface LiveCallInterfaceProps {
  agent?: Agent;
  onClose?: () => void;
  onPricingClick?: () => Promise<void>;
  isActive?: boolean;
}

export const LiveCallInterface: React.FC<LiveCallInterfaceProps> = ({ 
  agent,
  onClose = () => {} 
}) => {
  const { toast } = useToast();
  const [volumeLevel, setVolumeLevel] = useState(0);
  const [agentId, setAgentId] = useState('');
  const [voiceId, setVoiceId] = useState('');
  const [language, setLanguage] = useState('');
  const [callInProgress, setCallInProgress] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const [retellApiKey] = useState<string | null>(process.env.NEXT_PUBLIC_RETELL_API_KEY || null);

  // Initialize agent data from props
  useEffect(() => {
    if (agent && retellApiKey) {
      console.log('[LiveCallInterface] Using provided agent:', {
        id: agent.agent_id,
        voice: agent.voice_id,
        language: agent.language
      });
      setAgentId(agent.agent_id);
      setVoiceId(agent.voice_id);
      setLanguage(agent.language || 'english');
      setIsInitialized(true);
    } else if (!retellApiKey) {
      console.error('[LiveCallInterface] Retell API key not found in environment variables');
      toast({
        title: "Error",
        description: "Retell API key not found. Please check your environment configuration.",
        variant: "destructive"
      });
      onClose();
    }
  }, [agent, retellApiKey]);

  const { toggleCall, isCallActive, error, messages, currentResponse, currentTranscript, webClient } = useRetellWeb(
    isInitialized && retellApiKey ? {
      agent_id: agentId,
      voice_id: voiceId,
      language: language,
    } : undefined
  );

  useEffect(() => {
    if (error) {
      console.error('[LiveCallInterface] Retell error:', error);
      toast({
        title: "Call Error",
        description: error,
        variant: "destructive"
      });
    }
  }, [error, toast]);

  const [activeIndex, setActiveIndex] = useState(0);
  const [currentSpeaker, setCurrentSpeaker] = useState<string | null>(null);
  const [previousSpeaker, setPreviousSpeaker] = useState<string | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const [isAgentSpeaking, setIsAgentSpeaking] = useState(false);
  const [isCustomerSpeaking, setIsCustomerSpeaking] = useState(false);
  const audioContext = useRef<AudioContext>();
  const analyser = useRef<AnalyserNode>();
  const dataArray = useRef<Uint8Array>();
  const [welcomeMessageIndex, setWelcomeMessageIndex] = useState(0);
  const [isStreaming, setIsStreaming] = useState(true);

  const welcomeMessages = [
    "Book More Appointments!",
    "Convert more leads!",
    "Without Breaking a Sweat.",
    "Click To Demo!",
  ];

  // Update welcome message every 3 seconds when not in a call
  useEffect(() => {
    if (!isCallActive) {
      const interval = setInterval(() => {
        setWelcomeMessageIndex((prev) => (prev + 1) % welcomeMessages.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isCallActive, welcomeMessages.length]);

  // Update speakers when new messages come in
  useEffect(() => {
    if (currentTranscript) {
      setCurrentSpeaker(currentTranscript.role);
      if (currentTranscript.role === 'agent') {
        setIsAgentSpeaking(true);
        setIsCustomerSpeaking(false);
      } else {
        setIsAgentSpeaking(false);
        setIsCustomerSpeaking(true);
      }
    } else {
      setIsAgentSpeaking(false);
      setIsCustomerSpeaking(false);
      setCurrentSpeaker(null);
    }
  }, [currentTranscript]);

  useEffect(() => {
    if (!analyser.current || !dataArray.current) return;

    const updateAudioLevel = () => {
      analyser.current!.getByteFrequencyData(dataArray.current!);
      const average = Array.from(dataArray.current!).reduce((a, b) => a + b) / dataArray.current!.length;
      setAudioLevel(average / 255);
      requestAnimationFrame(updateAudioLevel);
    };

    updateAudioLevel();
  }, []);

  // Get the latest message from the messages array
  const latestMessage = messages[messages.length - 1];

  // Debug logging
  useEffect(() => {
    console.log('[LiveCallInterface] Call state:', {
      isCallActive,
      hasTranscript: !!currentTranscript,
      transcriptContent: currentTranscript?.content,
      messagesCount: messages.length,
      latestMessage: latestMessage
    });
  }, [isCallActive, currentTranscript, messages, latestMessage]);

  // Debug logging
  useEffect(() => {
    if (currentTranscript) {
      console.log('[LiveCallInterface] Current transcript:', currentTranscript);
    }
    if (latestMessage) {
      console.log('[LiveCallInterface] Latest message:', latestMessage);
    }
  }, [currentTranscript, latestMessage]);

  // Get display text based on call state
  const getDisplayText = () => {
    if (!isCallActive) {
      return welcomeMessages[welcomeMessageIndex].replace('\n', ' ');
    }

    if (currentTranscript?.content) {
      const speaker = currentTranscript.role === 'agent' ? 'Agent' : 'You';
      const content = currentTranscript.content;
      // Break text into chunks while maintaining whole words
      const words = content.split(' ');
      let lines = [];
      let currentLine = '';
      
      for (const word of words) {
        if ((currentLine + ' ' + word).length > 30) {
          if (currentLine) {
            lines.push(currentLine.trim());
            currentLine = word;
          } else {
            // If a single word is longer than the limit, keep it on its own line
            lines.push(word);
            currentLine = '';
          }
        } else {
          currentLine += (currentLine ? ' ' : '') + word;
        }
      }
      if (currentLine) {
        lines.push(currentLine.trim());
      }
      
      return `${speaker}:\n${lines.join('\n')}`;
    }

    return '';
  };

  const GlowingText: React.FC<{ text: string }> = ({ text }) => {
    return (
      <div className={styles.glowingText}>
        {text.split(' ').map((word, wordIndex) => (
          <React.Fragment key={wordIndex}>
            {wordIndex > 0 && <span className={styles.space}> </span>}
            <span className={styles.word}>
              {word.split('').map((char, charIndex) => (
                <span 
                  key={`${wordIndex}-${charIndex}`} 
                  style={{ animationDelay: `${(wordIndex * word.length + charIndex) * 0.05}s` }}
                >
                  {char}
                </span>
              ))}
            </span>
          </React.Fragment>
        ))}
      </div>
    );
  };

  const handlePricingClick = async () => {
    try {
      // If we're already in a call, end it
      if (isCallActive) {
        toggleCall();
        onClose();
        return;
      }

      // Check if we have all required settings
      if (!isInitialized || !agentId || !voiceId) {
        toast({
          title: "Missing Configuration",
          description: "Please select an agent before starting a call",
          variant: "destructive"
        });
        onClose();
        return;
      }

      // Initialize audio context if needed
      if (!audioContext.current || audioContext.current.state === 'suspended') {
        try {
          audioContext.current = new AudioContext();
          await audioContext.current.resume();
          analyser.current = audioContext.current.createAnalyser();
          analyser.current.fftSize = 256;
          const bufferLength = analyser.current.frequencyBinCount;
          dataArray.current = new Uint8Array(bufferLength);
        } catch (err) {
          console.error('[LiveCallInterface] Audio initialization error:', err);
          toast({
            title: "Error",
            description: "Failed to initialize audio. Please check your microphone permissions.",
            variant: "destructive"
          });
          return;
        }
      }

      // Start the call
      console.log('[LiveCallInterface] Starting call with agent:', {
        agent_id: agentId,
        voice_id: voiceId,
        language: language
      });
      await toggleCall();
    } catch (err) {
      console.error('[LiveCallInterface] Error starting call:', err);
      toast({
        title: "Error",
        description: "Failed to start call. Please try again.",
        variant: "destructive"
      });
      onClose();
    }
  };

  return (
    <div className={styles.container}>
      <ElectrolumeStormsphere
        isActive={isCallActive}
        isAgent={currentSpeaker === 'agent'}
        isCustomer={currentSpeaker === 'customer'}
      >
        <div className="flex flex-col items-center justify-center w-full h-full">
          <div className="w-full max-w-[280px] sm:max-w-[400px] md:max-w-[500px] min-h-[4rem] flex items-center justify-center px-4">
            {currentTranscript ? (
              <GlowingTypewriter
                texts={[getDisplayText()]}
                speed={1}
                fadeIn={true}
                isTranscript={true}
                className="text-sm sm:text-base md:text-lg"
              />
            ) : (
              <AnimatePresence mode="wait">
                <motion.div
                  key={welcomeMessageIndex}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <GlowingText text={welcomeMessages[welcomeMessageIndex].replace('\n', ' ')} />
                </motion.div>
              </AnimatePresence>
            )}
          </div>
        </div>
      </ElectrolumeStormsphere>
    <div className={styles.buttonContainer}>
    <button 
      className="px-3 sm:px-6 py-2 sm:py-3 text-xs sm:text-base text-white bg-black hover:bg-[#00ff8f]/10 border border-[#00ff8f] shadow-[0_0_10px_rgba(0,255,143,0.2)] hover:shadow-[0_0_20px_rgba(0,255,143,0.4)] transition-all duration-300 rounded-md flex items-center gap-2 whitespace-nowrap"
      onClick={handlePricingClick}
    >
      <Phone size={14} className="text-[#00ff8f]" />
      <span>{isCallActive ? "End Call" : "Click to Start"}</span>
    </button>
  </div>
    </div>
  );
}
