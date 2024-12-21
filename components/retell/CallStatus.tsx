'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { PhoneIcon, CheckCircleIcon, XCircleIcon } from 'lucide-react'
import { RetellCall } from '@/app/types/retell'

interface CallStatusProps {
  call: RetellCall | null
  status: 'idle' | 'started' | 'ended' | 'analyzed'
}

export default function CallStatus({ call, status }: CallStatusProps) {
  const formatTime = (start: number, end: number) => {
    const duration = Math.floor((end - start) / 1000) // durée en secondes
    const mins = Math.floor(duration / 60)
    const secs = duration % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center space-x-2">
          <PhoneIcon className="h-4 w-4" />
          <span>Call Status</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium">Status:</span>
          <Badge 
            variant={status === 'ended' ? 'destructive' : 'default'}
            className="capitalize text-xs"
          >
            {status}
          </Badge>
        </div>
        {call && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Call ID:</span>
              <span className="text-sm truncate max-w-[150px]">{call.call_id}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Duration:</span>
              <span className="text-sm">{formatTime(call.start_timestamp, call.end_timestamp)}</span>
            </div>
            {call.call_analysis && (
              <div className="mt-4">
                <h4 className="text-sm font-medium mb-2">Call Summary:</h4>
                <p className="text-sm text-muted-foreground">{call.call_analysis.call_summary}</p>
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="pt-2 justify-center">
        {status === 'ended' ? (
          <CheckCircleIcon className="h-5 w-5 text-green-500" />
        ) : status === 'started' ? (
          <PhoneIcon className="h-5 w-5 text-blue-500 animate-pulse" />
        ) : (
          <XCircleIcon className="h-5 w-5 text-red-500" />
        )}
      </CardFooter>
    </Card>
  )
}
