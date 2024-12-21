'use client';

import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Upload, X } from 'lucide-react';
import { CreateAgentFormData, DEFAULT_AGENT_FUNCTIONS } from '@/types/agent';

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
  model: 'gpt-4o' | 'gpt-4o-mini' | 'claude-3.5-sonnet' | 'claude-3-haiku' | null;
}

interface CreateAgentDialogProps {
  onAgentCreated: () => void;
}

const VOICE_MODELS = [
  { value: 'eleven_turbo_v2', label: 'Eleven Turbo v2 (Fast, English only)' },
  { value: 'eleven_turbo_v2_5', label: 'Eleven Turbo v2.5 (Lowest latency, Multilingual)' },
  { value: 'eleven_multilingual_v2', label: 'Eleven Multilingual v2 (Rich emotion, Nice accent)' },
];

const LLM_MODELS = [
  { value: 'gpt-4o', label: 'GPT-4o' },
  { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
  { value: 'claude-3.5-sonnet', label: 'Claude 3.5 Sonnet' },
  { value: 'claude-3-haiku', label: 'Claude 3 Haiku' },
];

const LANGUAGES = [
  { value: 'en-US', label: 'English (US)' },
  { value: 'en-GB', label: 'English (UK)' },
  { value: 'es-ES', label: 'Spanish (Spain)' },
  { value: 'fr-FR', label: 'French' },
  { value: 'de-DE', label: 'German' },
  { value: 'it-IT', label: 'Italian' },
  { value: 'pt-BR', label: 'Portuguese (Brazil)' },
  { value: 'multi', label: 'Multilingual' },
];

interface KnowledgeBaseForm {
  name: string;
  texts: { text: string; title: string }[];
  urls: string[];
  files: File[];
  enableAutoRefresh: boolean;
}

export function CreateAgentDialog({ onAgentCreated }: CreateAgentDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [voices, setVoices] = useState<Voice[]>([]);
  const [llms, setLLMs] = useState<RetellLLM[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<Voice | null>(null);
  const [audioPreview, setAudioPreview] = useState<HTMLAudioElement | null>(null);
  const [formData, setFormData] = useState<CreateAgentFormData>({
    agent_name: '',
    voice_id: '',
    voice_model: undefined,
    language: 'en-US',
    response_engine: {
      type: 'retell-llm',
      llm_model: 'gpt-4o',
      system_prompt: '',
      functions: DEFAULT_AGENT_FUNCTIONS,
    },
    knowledge_base_id: '',
  });

  const [knowledgeBase, setKnowledgeBase] = useState<KnowledgeBaseForm>({
    name: '',
    texts: [],
    urls: [''],
    files: [],
    enableAutoRefresh: false,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch voices
        const voicesResponse = await fetch('/api/voices');
        if (!voicesResponse.ok) {
          throw new Error('Failed to fetch voices');
        }
        const voicesData = await voicesResponse.json();
        setVoices(voicesData);

        // Fetch LLMs
        const llmsResponse = await fetch('/api/llms');
        if (!llmsResponse.ok) {
          throw new Error('Failed to fetch LLMs');
        }
        const llmsData = await llmsResponse.json();
        setLLMs(llmsData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (open) {
      fetchData();
    }
  }, [open]);

  // Find LLM ID based on selected model
  const getLLMId = (model: string): string => {
    const llm = llms.find(l => l.model === model);
    return llm?.llm_id || '';
  };

  const handleVoiceChange = (voiceId: string) => {
    const voice = voices.find(v => v.voice_id === voiceId);
    setSelectedVoice(voice || null);
    
    // Reset voice model if changing provider
    if (voice?.provider !== 'elevenlabs') {
      setFormData({ 
        ...formData, 
        voice_id: voiceId,
        voice_model: undefined 
      });
    } else {
      setFormData({ 
        ...formData, 
        voice_id: voiceId,
        voice_model: 'eleven_turbo_v2' 
      });
    }

    // Stop current audio preview if playing
    if (audioPreview) {
      audioPreview.pause();
      audioPreview.currentTime = 0;
    }
  };

  const playVoicePreview = () => {
    if (selectedVoice?.preview_audio_url) {
      if (audioPreview) {
        audioPreview.pause();
        audioPreview.currentTime = 0;
      }

      const audio = new Audio(selectedVoice.preview_audio_url);
      audio.play();
      setAudioPreview(audio);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setKnowledgeBase(prev => ({
        ...prev,
        files: [...prev.files, ...newFiles]
      }));
    }
  };

  const removeFile = (index: number) => {
    setKnowledgeBase(prev => ({
      ...prev,
      files: prev.files.filter((_, i) => i !== index)
    }));
  };

  const addUrl = () => {
    setKnowledgeBase(prev => ({
      ...prev,
      urls: [...prev.urls, '']
    }));
  };

  const updateUrl = (index: number, value: string) => {
    setKnowledgeBase(prev => ({
      ...prev,
      urls: prev.urls.map((url, i) => i === index ? value : url)
    }));
  };

  const removeUrl = (index: number) => {
    setKnowledgeBase(prev => ({
      ...prev,
      urls: prev.urls.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate required fields
    if (!formData.agent_name.trim()) {
      setError('Agent name is required');
      setLoading(false);
      return;
    }

    if (!formData.voice_id) {
      setError('Please select a voice');
      setLoading(false);
      return;
    }

    try {
      // Only create knowledge base if there's content to add
      let knowledgeBaseId = '';
      if (
        (knowledgeBase.files.length > 0 || knowledgeBase.urls.some(url => url.trim() !== '')) &&
        knowledgeBase.name.trim() !== ''
      ) {
        console.log('Creating knowledge base...');
        const kbFormData = new FormData();
        kbFormData.append('name', knowledgeBase.name);
        knowledgeBase.files.forEach((file) => {
          kbFormData.append('files', file);
        });
        
        const validUrls = knowledgeBase.urls.filter(url => url.trim() !== '');
        if (validUrls.length > 0) {
          kbFormData.append('urls', JSON.stringify(validUrls));
        }
        
        kbFormData.append('enableAutoRefresh', String(knowledgeBase.enableAutoRefresh));

        console.log('Knowledge base form data:', {
          name: knowledgeBase.name,
          files: knowledgeBase.files.map(f => f.name),
          urls: validUrls,
          enableAutoRefresh: knowledgeBase.enableAutoRefresh
        });

        const kbResponse = await fetch('/api/knowledge-base', {
          method: 'POST',
          body: kbFormData,
        });

        const kbData = await kbResponse.json();
        console.log('Knowledge base response:', kbData);

        if (!kbResponse.ok) {
          throw new Error(kbData.error || 'Failed to create knowledge base');
        }

        knowledgeBaseId = kbData.id;
        console.log('Created knowledge base with ID:', knowledgeBaseId);
      }

      // Get LLM ID for the selected model
      const llmId = getLLMId(formData.response_engine.llm_model);
      if (!llmId) {
        throw new Error('Failed to get LLM ID for selected model');
      }

      // Create the agent with the correct LLM ID
      const agentData = {
        ...formData,
        response_engine: {
          ...formData.response_engine,
          llm_id: llmId,
        },
        ...(knowledgeBaseId ? { knowledge_base_id: knowledgeBaseId } : {}),
      };

      console.log('Creating agent with data:', JSON.stringify(agentData, null, 2));

      const agentResponse = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(agentData),
      });

      const responseText = await agentResponse.text();
      console.log('Raw agent response:', responseText);

      let agentResponseData;
      try {
        agentResponseData = JSON.parse(responseText);
      } catch (err) {
        console.error('Failed to parse agent response:', err);
        throw new Error('Invalid response from server');
      }

      console.log('Parsed agent response:', agentResponseData);

      if (!agentResponse.ok) {
        throw new Error(agentResponseData.error || 'Failed to create agent');
      }

      onAgentCreated();
      setOpen(false);
    } catch (err: any) {
      console.error('Full error details:', err);
      setError(err.message || 'An error occurred while creating the agent');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Create Agent
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Agent</DialogTitle>
          <DialogDescription>
            Configure your AI agent with voice, language, and knowledge base settings.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="agent_name">Agent Name</Label>
              <Input
                id="agent_name"
                value={formData.agent_name}
                onChange={(e) => setFormData({ ...formData, agent_name: e.target.value })}
                placeholder="Enter agent name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="llm_model">LLM Model</Label>
              <Select
                value={formData.response_engine.llm_model}
                onValueChange={(value) => setFormData({
                  ...formData,
                  response_engine: { ...formData.response_engine, llm_model: value }
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select LLM model" />
                </SelectTrigger>
                <SelectContent>
                  {LLM_MODELS.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      {model.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="voice_id">Voice</Label>
              <div className="space-y-2">
                <Select
                  value={formData.voice_id}
                  onValueChange={handleVoiceChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a voice" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Eleven Labs Voices</SelectLabel>
                      {voices
                        .filter(voice => voice.provider === 'elevenlabs')
                        .map((voice) => (
                          <SelectItem key={voice.voice_id} value={voice.voice_id}>
                            {voice.voice_name} - {voice.gender}, {voice.accent}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>OpenAI Voices</SelectLabel>
                      {voices
                        .filter(voice => voice.provider === 'openai')
                        .map((voice) => (
                          <SelectItem key={voice.voice_id} value={voice.voice_id}>
                            {voice.voice_name} - {voice.gender}, {voice.accent}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>Deepgram Voices</SelectLabel>
                      {voices
                        .filter(voice => voice.provider === 'deepgram')
                        .map((voice) => (
                          <SelectItem key={voice.voice_id} value={voice.voice_id}>
                            {voice.voice_name} - {voice.gender}, {voice.accent}
                          </SelectItem>
                        ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {selectedVoice?.preview_audio_url && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={playVoicePreview}
                  >
                    Play Preview
                  </Button>
                )}
              </div>
            </div>
            {selectedVoice?.provider === 'elevenlabs' && (
              <div className="space-y-2">
                <Label htmlFor="voice_model">Voice Model</Label>
                <Select
                  value={formData.voice_model}
                  onValueChange={(value) => setFormData({ ...formData, voice_model: value })}
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
            )}
            <div className="space-y-2">
              <Label htmlFor="language">Language</Label>
              <Select
                value={formData.language}
                onValueChange={(value) => setFormData({ ...formData, language: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a language" />
                </SelectTrigger>
                <SelectContent>
                  {LANGUAGES.map((lang) => (
                    <SelectItem key={lang.value} value={lang.value}>
                      {lang.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="system_prompt">System Message Content (Prompt)</Label>
            <Textarea
              id="system_prompt"
              value={formData.response_engine.system_prompt}
              onChange={(e) => setFormData({
                ...formData,
                response_engine: { ...formData.response_engine, system_prompt: e.target.value }
              })}
              placeholder="Enter the system prompt for the agent..."
              className="min-h-[100px]"
            />
          </div>

          <div className="space-y-4">
            <Label>Knowledge Base</Label>
            <div className="space-y-4 border rounded-lg p-4">
              <div className="space-y-2">
                <Label htmlFor="kb_name">Knowledge Base Name</Label>
                <Input
                  id="kb_name"
                  value={knowledgeBase.name}
                  onChange={(e) => setKnowledgeBase({ ...knowledgeBase, name: e.target.value })}
                  placeholder="Enter knowledge base name"
                />
              </div>

              <div className="space-y-2">
                <Label>Upload Files (max 25 files, 50MB each)</Label>
                <div className="grid gap-2">
                  <Label
                    htmlFor="file_upload"
                    className="flex items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer hover:bg-accent/50"
                  >
                    <div className="flex flex-col items-center">
                      <Upload className="w-8 h-8 mb-2" />
                      <span>Click to upload files</span>
                    </div>
                    <Input
                      id="file_upload"
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileChange}
                      accept=".txt,.pdf,.doc,.docx"
                    />
                  </Label>
                  {knowledgeBase.files.length > 0 && (
                    <div className="grid gap-2">
                      {knowledgeBase.files.map((file, index) => (
                        <div key={index} className="flex items-center justify-between bg-accent/50 rounded p-2">
                          <span className="truncate">{file.name}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => removeFile(index)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>URLs to Scrape</Label>
                <div className="space-y-2">
                  {knowledgeBase.urls.map((url, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={url}
                        onChange={(e) => updateUrl(index, e.target.value)}
                        placeholder="Enter URL"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeUrl(index)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addUrl}
                  >
                    Add URL
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="auto_refresh"
                  checked={knowledgeBase.enableAutoRefresh}
                  onChange={(e) => setKnowledgeBase({ ...knowledgeBase, enableAutoRefresh: e.target.checked })}
                  className="rounded border-gray-300"
                />
                <Label htmlFor="auto_refresh">Enable Auto Refresh (every 12 hours)</Label>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Agent'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
