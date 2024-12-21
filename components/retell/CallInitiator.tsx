'use client'

import React, { useState, useEffect } from 'react'
import { RetellPhoneNumber } from '@/app/types/retell'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { PhoneIcon, PhoneCallIcon, PhoneOffIcon } from 'lucide-react'
import { useToast } from "@/hooks/use-toast"
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'

interface CallInitiatorProps {
  retellNumber: RetellPhoneNumber
  onCallInitiated: (callId: string) => void
  onCallEnded: () => void
}

export default function CallInitiator({ 
  retellNumber, 
  onCallInitiated, 
  onCallEnded 
}: CallInitiatorProps) {
  const [toNumber, setToNumber] = useState('')
  const [isCallInProgress, setIsCallInProgress] = useState(false)
  const { toast } = useToast()
  const [duration, setDuration] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallInProgress) {
      interval = setInterval(() => {
        setDuration(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallInProgress]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartCall = async () => {
    if (!toNumber) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive",
      })
      return
    }

    try {
      const response = await fetch('/api/retell/create-call', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from_number: retellNumber.phone_number,
          to_number: toNumber,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to start call')
      }

      const data = await response.json()
      setIsCallInProgress(true)
      onCallInitiated(data.callId)
    } catch (error) {
      console.error('Error starting call:', error)
      toast({
        title: "Error",
        description: "Failed to start call",
        variant: "destructive",
      })
    }
  }

  const handleEndCall = async () => {
    try {
      const response = await fetch('/api/retell/end-call', {
        method: 'POST',
      })

      if (!response.ok) {
        throw new Error('Failed to end call')
      }

      setIsCallInProgress(false)
      onCallEnded()
    } catch (error) {
      console.error('Error ending call:', error)
      toast({
        title: "Error",
        description: "Failed to end call",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="flex-1 min-w-[280px]">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center space-x-2">
          <PhoneIcon className="h-4 w-4" />
          <span>Initiate Call</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="flex items-center text-sm">
          <span className="font-medium w-12">From:</span>
          <span className="text-muted-foreground">{retellNumber.phone_number_pretty || "Loading..."}</span>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="to" className="text-sm font-medium w-12">To:</label>
          <PhoneInput
            defaultCountry="us"
            value={toNumber}
            onChange={(phone) => setToNumber(phone)}
            inputClassName="flex h-8 w-full rounded-md border border-input bg-background px-2 py-1 text-sm"
          />
        </div>
      </CardContent>
      <CardFooter className="pt-2">
        {isCallInProgress ? (
          <div className="flex justify-between items-center w-full">
            <span className="text-sm">Duration: {formatTime(duration)}</span>
            <Button 
              onClick={handleEndCall} 
              variant="destructive" 
              size="sm"
            >
              <PhoneOffIcon className="h-4 w-4 mr-1" />
              End Call
            </Button>
          </div>
        ) : (
          <Button 
            onClick={handleStartCall} 
            disabled={!toNumber || retellNumber.phone_number === "Loading..."}
            size="sm"
            className="w-full"
          >
            <PhoneCallIcon className="h-4 w-4 mr-1" />
            Make Call
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
