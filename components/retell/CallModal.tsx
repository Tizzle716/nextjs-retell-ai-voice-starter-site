import React from 'react'
import { RetellCall } from '@/app/types/retell'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { ScrollArea } from '@/components/ui/scroll-area'

interface CallModalProps {
  call: RetellCall | null
  onClose: () => void
}

const CallModal: React.FC<CallModalProps> = ({ call, onClose }) => {
  if (!call) return null

  return (
    <Dialog open={!!call} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Call Details</DialogTitle>
          <DialogDescription>Call ID: {call.call_id}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="mt-4 h-[60vh]">
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold">Agent ID</h4>
              <p>{call.agent_id}</p>
            </div>
            <div>
              <h4 className="font-semibold">Call Status</h4>
              <p>{call.call_status}</p>
            </div>
            <div>
              <h4 className="font-semibold">Start Time</h4>
              <p>{new Date(call.start_timestamp).toLocaleString()}</p>
            </div>
            <div>
              <h4 className="font-semibold">End Time</h4>
              <p>{new Date(call.end_timestamp).toLocaleString()}</p>
            </div>
            <div>
              <h4 className="font-semibold">Duration</h4>
              <p>{((call.end_timestamp - call.start_timestamp) / 1000 / 60).toFixed(2)} minutes</p>
            </div>
            <div>
              <h4 className="font-semibold">Transcript</h4>
              <p>{call.transcript}</p>
            </div>
            <div>
              <h4 className="font-semibold">Call Analysis</h4>
              <p>Summary: {call.call_analysis.call_summary}</p>
              <p>Sentiment: {call.call_analysis.user_sentiment}</p>
              <p>Successful: {call.call_analysis.call_successful ? 'Yes' : 'No'}</p>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export default CallModal