'use client';

import { useState } from 'react';
import { AgentList } from '@/components/agents/agent-list';
// import { CreateAgentDialog } from '@/components/agents/create-agent-dialog';

export default function ManageAgentsPage() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleAgentCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      {/* <div className="flex justify-end mb-6">
        <CreateAgentDialog onAgentCreated={handleAgentCreated} />
      </div> */}
      <AgentList key={refreshKey} />
    </>
  );
}
