'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Phone, Check, Loader2 } from 'lucide-react';
import { LiveCallInterface } from '@/components/retell/LiveCallInterface';
import { Agent } from '@/types/agent';
import { clsx } from 'clsx';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';

export function AgentList() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [isLiveCallOpen, setIsLiveCallOpen] = useState(false);
  const { toast } = useToast();

  const handleSelectAgent = async (agent: Agent) => {
    try {
      console.log('[AgentList] Selecting agent:', {
        id: agent.agent_id,
        name: agent.agent_name,
        voice: agent.voice_id
      });

      // Update agent selection in database
      const response = await fetch('/api/agents', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: agent.agent_id,
          voice_id: agent.voice_id,
          language: agent.language || 'english'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to select agent');
      }

      // Update local state
      setAgents(prevAgents => prevAgents.map(a => ({
        ...a,
        is_selected: a.agent_id === agent.agent_id
      })));
      setSelectedAgent(agent);

      // Save to settings as well
      const settingsResponse = await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          agent_id: agent.agent_id,
          voice_id: agent.voice_id,
          language: agent.language || 'english'
        }),
      });

      if (!settingsResponse.ok) {
        console.warn('[AgentList] Failed to update settings with agent selection');
      }

      toast({
        title: "Success",
        description: `Selected agent: ${agent.agent_name}`,
      });
    } catch (err) {
      console.error('[AgentList] Error selecting agent:', err);
      toast({
        title: "Error",
        description: "Failed to select agent",
        variant: "destructive"
      });
    }
  };

  // Load agents and selected agent
  useEffect(() => {
    async function fetchAgentsAndSelected() {
      try {
        setLoading(true);
        setError(null);
        console.log('[AgentList] Fetching agents...');
        const response = await fetch('/api/agents');
        
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || 'Failed to fetch agents');
        }
        
        const data = await response.json();
        console.log('[AgentList] Retrieved agents:', {
          count: data.length,
          agents: data.map((a: Agent) => ({
            id: a.agent_id,
            name: a.agent_name,
            voice: a.voice_id,
            selected: a.is_selected
          }))
        });

        setAgents(data);
        
        // Set selected agent if found
        const selectedAgent = data.find((a: Agent) => a.is_selected);
        if (selectedAgent) {
          console.log('[AgentList] Found selected agent:', {
            id: selectedAgent.agent_id,
            name: selectedAgent.agent_name
          });
          setSelectedAgent(selectedAgent);
        }
      } catch (err: any) {
        console.error('[AgentList] Error:', err);
        setError(err.message || 'Failed to fetch agents');
        toast({
          title: "Error",
          description: err.message || "Failed to fetch agents. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    }

    fetchAgentsAndSelected();
  }, []);

  const handleStartCall = (agent: Agent) => {
    console.log('[AgentList] Starting call with agent:', {
      id: agent.agent_id,
      name: agent.agent_name,
      voice: agent.voice_id
    });
    handleSelectAgent(agent);
    setIsLiveCallOpen(true);
  };

  const handleCardClick = (agent: Agent) => {
    handleSelectAgent(agent);
  };

  const handleAgentClick = async (agent: Agent) => {
    setError(null);
    handleCardClick(agent);
  };

  if (loading) return <div>Loading agents...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="flex flex-col gap-4">
      {/* Live Call Interface - Shows first on mobile, second on desktop when active */}
      {selectedAgent && isLiveCallOpen && (
        <div className="order-first md:order-2">
          <LiveCallInterface
            agent={selectedAgent}
            onClose={() => {
              setIsLiveCallOpen(false);
              setSelectedAgent(null);
            }}
          />
        </div>
      )}
      
      {/* Agent Grid - Shows second on mobile, first on desktop */}
      <div className="order-2 md:order-1 grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {agents.map((agent) => (
          <Card 
            key={agent.agent_id} 
            className={clsx(
              "flex flex-col cursor-pointer hover:shadow-lg transition-shadow",
              selectedAgent?.agent_id === agent.agent_id && "ring-2 ring-primary"
            )}
            onClick={() => handleAgentClick(agent)}
          >
            <CardContent className="flex flex-col gap-4 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-semibold">{agent.agent_name}</h3>
                  {selectedAgent?.agent_id === agent.agent_id && (
                    <Badge variant="outline" className="bg-primary/10">Selected</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      if (!selectedAgent) {
                        setSelectedAgent(agent);
                      }
                      handleStartCall(agent);
                    }}
                    disabled={!!selectedAgent && selectedAgent.agent_id !== agent.agent_id}
                  >
                    <Phone className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="text-sm text-gray-500">
                <p>Voice ID: {agent.voice_id}</p>
                <p>Language: {agent.language}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
