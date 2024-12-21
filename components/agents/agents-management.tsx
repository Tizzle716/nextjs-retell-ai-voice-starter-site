'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { CreateAgentDialog } from './create-agent-dialog';

interface Agent {
  agent_id: string;
  agent_name: string | null;
  voice_id: string;
  last_modification_timestamp: number;
}

export function AgentsManagement() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch agents');
      }

      const data = await response.json();
      setAgents(data);
    } catch (error) {
      console.error('Error fetching agents:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const handleAgentCreated = () => {
    fetchAgents();
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Manage Agents</h2>
        <CreateAgentDialog onAgentCreated={handleAgentCreated} />
      </div>

      {loading ? (
        <div>Loading agents...</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <Card key={agent.agent_id} className="cursor-pointer hover:bg-accent/50">
              <CardHeader>
                <CardTitle>{agent.agent_name || 'Unnamed Agent'}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p>Voice ID: {agent.voice_id}</p>
                  <p>Last Modified: {new Date(agent.last_modification_timestamp).toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
