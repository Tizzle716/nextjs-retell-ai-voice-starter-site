'use client';

import React from 'react'
import { RetellCall } from '@/app/types/retell'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

interface CallModalProps {
  call: RetellCall | null
  onClose: () => void
}

const CallModal: React.FC<CallModalProps> = ({ call, onClose }) => {
  if (!call) return null

  const formatTimestamp = (timestamp: number) => format(new Date(timestamp), 'PPpp')

  return (
    <Dialog open={!!call} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Call Details</DialogTitle>
          <div className="flex items-center space-x-2">
            <Badge variant={call.call_analysis.call_successful ? "default" : "destructive"}>
              {call.call_analysis.call_successful ? "Successful" : "Unsuccessful"}
            </Badge>
            <Badge variant="outline">{call.call_type}</Badge>
          </div>
        </DialogHeader>
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="transcript">Transcript</TabsTrigger>
            <TabsTrigger value="analysis">Analysis</TabsTrigger>
          </TabsList>
          <TabsContent value="details">
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              <div className="space-y-4">
                <p><strong>Call ID:</strong> {call.call_id}</p>
                <p><strong>Agent ID:</strong> {call.agent_id}</p>
                <p><strong>Status:</strong> {call.call_status}</p>
                <p><strong>Start Time:</strong> {formatTimestamp(call.start_timestamp)}</p>
                <p><strong>End Time:</strong> {formatTimestamp(call.end_timestamp)}</p>
                <p><strong>Duration:</strong> {((call.end_timestamp - call.start_timestamp) / 1000 / 60).toFixed(2)} minutes</p>
                <p><strong>Customer Name:</strong> {call.retell_llm_dynamic_variables.customer_name}</p>
                <p><strong>Recording URL:</strong> <a href={call.recording_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">Listen to Recording</a></p>
                <p><strong>Public Log URL:</strong> <a href={call.public_log_url} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">View Log</a></p>
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="transcript">
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              <div className="space-y-4">
                {call.transcript_object.map((entry, index) => (
                  <div key={index} className={`p-2 rounded ${entry.role === 'agent' ? 'bg-blue-100' : 'bg-green-100'}`}>
                    <p><strong>{entry.role.charAt(0).toUpperCase() + entry.role.slice(1)}:</strong> {entry.content}</p>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
          <TabsContent value="analysis">
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              <div className="space-y-4">
                <p><strong>Call Summary:</strong> {call.call_analysis.call_summary}</p>
                <p><strong>In Voicemail:</strong> {call.call_analysis.in_voicemail ? 'Yes' : 'No'}</p>
                <p><strong>User Sentiment:</strong> {call.call_analysis.user_sentiment}</p>
                <p><strong>Call Successful:</strong> {call.call_analysis.call_successful ? 'Yes' : 'No'}</p>
                <div>
                  <strong>Latency Statistics:</strong>
                  <ul className="list-disc list-inside">
                    <li>E2E Latency (p50): {call.e2e_latency.p50}ms</li>
                    <li>LLM Latency (p50): {call.llm_latency.p50}ms</li>
                    <li>LLM Websocket Network RTT Latency (p50): {call.llm_websocket_network_rtt_latency.p50}ms</li>
                  </ul>
                </div>
                {Object.keys(call.call_analysis.custom_analysis_data).length > 0 && (
                  <div>
                    <strong>Custom Analysis Data:</strong>
                    <pre>{JSON.stringify(call.call_analysis.custom_analysis_data, null, 2)}</pre>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}

export default CallModal
