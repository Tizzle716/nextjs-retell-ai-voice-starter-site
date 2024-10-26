import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PhoneIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react'

interface TwilioCallStatusProps {
  callSid: string | null
  status: 'idle' | 'started' | 'ended'
  duration: number
}

const TwilioCallStatus: React.FC<TwilioCallStatusProps> = ({ callSid, status, duration }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <PhoneIcon className="h-5 w-5" />
          <span>Call Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Status:</span>
          <Badge 
            variant={status === 'ended' ? 'destructive' : 'default'}
            className="capitalize"
          >
            {status}
          </Badge>
        </div>
        {callSid && (
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Call SID:</span>
            <span className="text-sm">{callSid}</span>
          </div>
        )}
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Duration:</span>
          <span className="text-sm">{formatTime(duration)}</span>
        </div>
        <div className="flex justify-center">
          {status === 'ended' ? (
            <CheckCircleIcon className="h-8 w-8 text-green-500" />
          ) : status === 'started' ? (
            <PhoneIcon className="h-8 w-8 text-blue-500 animate-pulse" />
          ) : (
            <XCircleIcon className="h-8 w-8 text-red-500" />
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export default TwilioCallStatus