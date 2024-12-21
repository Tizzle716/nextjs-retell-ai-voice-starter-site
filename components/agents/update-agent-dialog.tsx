'use client';

import { useEffect, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Agent } from '@/types/agent';
import { LANGUAGES } from '@/lib/constants';

interface Voice {
  voice_id: string;
  voice_name: string;
  provider: 'elevenlabs' | 'openai' | 'deepgram';
  accent?: string;
  gender: 'male' | 'female';
  age?: string;
  preview_audio_url?: string;
}

interface RetellLLM {
  llm_id: string;
  llm_websocket_url: string;
  model: string;
  model_temperature: number;
  tool_call_strict_mode: boolean;
  general_prompt: string;
  general_tools: any[];
  states: any[];
  last_modification_timestamp: number;
}

const VOICE_MODELS = [
  { value: 'eleven_turbo_v2', label: 'Eleven Turbo v2 (Fast, English only)' },
  { value: 'eleven_turbo_v2_5', label: 'Eleven Turbo v2.5 (Lowest latency, Multilingual)' },
  { value: 'eleven_multilingual_v2', label: 'Eleven Multilingual v2 (Rich emotion, Nice accent)' },
];

const LLM_MODELS = [
  { value: 'gpt-4o', label: 'GPT-4 Optimized' },
  { value: 'gpt-4', label: 'GPT-4' },
  { value: 'claude-3-sonnet', label: 'Claude 3 Sonnet' },
  { value: 'claude-3-haiku', label: 'Claude 3 Haiku' },
];

interface UpdateAgentDialogProps {
  agent: Agent;
  open: boolean;
  onClose: () => void;
  onAgentUpdated: () => void;
}

export function UpdateAgentDialog({ agent, open, onClose, onAgentUpdated }: UpdateAgentDialogProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [audioPreview, setAudioPreview] = useState<HTMLAudioElement | null>(null);

  const [formData, setFormData] = useState({
    agent_name: agent.agent_name,
    voice_id: agent.voice_id,
    voice_model: '',
    language: agent.language || 'en-US',
    response_engine: {
      type: 'retell-llm',
      llm_id: agent.response_engine?.llm_id || '',
      llm_model: 'GPT-4 Optimized',
      system_prompt: ''
    }
  });

  // Fetch voices when the dialog opens
  useEffect(() => {
    const fetchVoices = async () => {
      try {
        const response = await fetch('/api/voices');
        if (!response.ok) {
          throw new Error('Failed to fetch voices');
        }
        const data = await response.json();
        setVoices(data);

        // Find and set the selected voice
        const voice = data.find((v: Voice) => v.voice_id === agent.voice_id);
        if (voice) {
          setSelectedVoice(voice);
          // Set voice model based on provider
          if (voice.provider === 'elevenlabs') {
            setFormData(prev => ({
              ...prev,
              voice_model: 'eleven_multilingual_v2' // Default to multilingual
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching voices:', error);
        setError('Failed to fetch voices');
      }
    };

    if (open) {
      fetchVoices();
    }
  }, [open, agent.voice_id]);

  // Fetch agent details when dialog opens
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        // Fetch agent details
        const agentResponse = await fetch(`/api/agents/${agent.agent_id}`);
        if (!agentResponse.ok) {
          throw new Error('Failed to fetch agent details');
        }
        const agentData = await agentResponse.json();
        
        // Update form data with agent details
        setFormData(prev => ({
          ...prev,
          agent_name: agentData.agent_name,
          voice_id: agentData.voice_id,
          language: agentData.language, // From agent response
          response_engine: {
            ...prev.response_engine,
            llm_id: agentData.response_engine.llm_id,
            llm_model: 'GPT-4 Optimized', // Fixed value
            system_prompt: agentData.general_prompt // From agent response
          }
        }));

      } catch (error) {
        console.error('Error fetching details:', error);
        setError('Failed to fetch agent details');
      }
    };

    if (open) {
      fetchDetails();
    }
  }, [open, agent.agent_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/agents/${agent.agent_id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update agent');
      }

      onAgentUpdated();
      onClose();
    } catch (error) {
      console.error('Error updating agent:', error);
      setError('Failed to update agent');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this agent?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/agents/${agent.agent_id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete agent');
      }

      onAgentUpdated();
      onClose();
    } catch (error) {
      console.error('Error deleting agent:', error);
      setError('Failed to delete agent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Update Agent: {agent.agent_name}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="agent_name" className="text-right">
                Agent Name
              </Label>
              <Input
                id="agent_name"
                value={formData.agent_name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    agent_name: e.target.value,
                  }))
                }
                className="col-span-3"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="voice_id" className="text-right">
                Voice
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.voice_id}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      voice_id: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent>
                    {voices.map((voice) => (
                      <SelectItem key={voice.voice_id} value={voice.voice_id}>
                        {voice.voice_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="voice_model" className="text-right">
                Voice Model
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.voice_model}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      voice_model: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a voice model" />
                  </SelectTrigger>
                  <SelectContent>
                    {VOICE_MODELS.map((model) => (
                      <SelectItem key={model.value} value={model.value}>
                        {model.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="language" className="text-right">
                Language
              </Label>
              <div className="col-span-3">
                <Select
                  value={formData.language}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      language: value,
                    }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a language" />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(LANGUAGES).map(([code, name]) => (
                      <SelectItem key={code} value={code}>
                        {typeof name === 'string' ? name : name.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="llm_model" className="text-right">
                LLM Model
              </Label>
              <div className="col-span-3">
                <Input
                  id="llm_model"
                  value="GPT-4 Optimized"
                  disabled
                  className="bg-muted"
                />
              </div>
            </div>

            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="system_prompt" className="text-right">
                Lead Qualification Prompt
              </Label>
              <div className="col-span-3">
                <Textarea
                  id="system_prompt"
                  value={formData.response_engine.system_prompt}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      response_engine: {
                        ...prev.response_engine,
                        system_prompt: e.target.value,
                      },
                    }))
                  }
                  className="h-32"
                  placeholder="Enter lead qualification prompt"
                />
              </div>
            </div>

          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex justify-between">
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
            >
              Delete Agent
            </Button>
            <div className="space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Updating...' : 'Update Agent'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
