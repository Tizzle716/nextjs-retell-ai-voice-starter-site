import { AIAgentChat } from "./components/ai-agent-chat"
import { AIAgentHeader } from "./components/ai-agent-header"

export default function AIAgentPage() {
  return (
    <div className="container mx-auto p-6 space-y-4 h-full">
      <AIAgentHeader />
      <AIAgentChat />
    </div>
  )
} 