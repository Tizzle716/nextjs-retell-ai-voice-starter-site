'use client'
import React, { useState, useEffect } from 'react'
import { RetellCall, RetellPhoneNumber } from '@/app/types/retell'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { PhoneCall, Clock, TrendingUp, AlertCircle } from 'lucide-react'
import CallInitiator from './CallInitiator'
import CallStatus from './CallStatus'
import CallList from './CallList'

export function Overview() {
  const [calls, setCalls] = useState<RetellCall[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [retellNumber, setRetellNumber] = useState<RetellPhoneNumber | null>(null)
  const [activeCall, setActiveCall] = useState<RetellCall | null>(null)
  const [callStatus, setCallStatus] = useState<'idle' | 'started' | 'ended' | 'analyzed'>('idle')

  useEffect(() => {
    fetchCalls()
    fetchRetellNumber()
  }, [])

  const fetchCalls = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('/api/retell/calls')
      if (!response.ok) {
        throw new Error('Failed to fetch calls')
      }
      const data = await response.json()
      setCalls(data)
    } catch {
      setError('Error fetching calls. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchRetellNumber = async () => {
    try {
      const response = await fetch('/api/retell/phone-numbers')
      if (!response.ok) {
        throw new Error('Failed to fetch Retell phone number')
      }
      const data = await response.json()
      setRetellNumber(data[0])
    } catch (error) {
      console.error('Error fetching Retell phone number:', error)
    }
  }

  const handleCallInitiated = async (callId: string) => {
    setCallStatus('started');
    try {
      // Simulons un appel API pour obtenir les détails de l'appel
      const response = await fetch(`/api/retell/calls/${callId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch call details');
      }
      const callDetails: RetellCall = await response.json();
      setActiveCall(callDetails);
    } catch (error) {
      console.error('Error fetching call details:', error);
      setError('Failed to fetch call details');
    }
  };

  const handleCallEnded = async () => {
    setCallStatus('ended');
    if (activeCall) {
      try {
        // Simulons un appel API pour obtenir les détails mis à jour de l'appel
        const response = await fetch(`/api/retell/calls/${activeCall.call_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch updated call details');
        }
        const updatedCallDetails: RetellCall = await response.json();
        setActiveCall(updatedCallDetails);
      } catch (error) {
        console.error('Error fetching updated call details:', error);
        setError('Failed to fetch updated call details');
      }
    }
  };

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return <ErrorAlert message={error} />
  }

  return (
    <div className="space-y-4 w-full">
      <StatisticsCards calls={calls} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {retellNumber && (
          <CallInitiator
            retellNumber={retellNumber}
            onCallInitiated={handleCallInitiated}
            onCallEnded={handleCallEnded}
          />
        )}
        <CallStatus 
          call={activeCall}
          status={callStatus}
        />
      </div>
      <CallList calls={calls} />
    </div>
  )
}

const LoadingSkeleton = () => (
  <div className="space-y-4 md:space-y-6 lg:space-y-8 h-full">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 lg:gap-6">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <Skeleton className="h-4 w-[80px] md:w-[100px] lg:w-[120px]" />
            <Skeleton className="h-4 w-4 rounded-full" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-6 md:h-8 lg:h-10 w-[50px] md:w-[60px] lg:w-[70px]" />
          </CardContent>
        </Card>
      ))}
    </div>
    <Skeleton className="h-[calc(100%-120px)] w-full" />
  </div>
)

const ErrorAlert = ({ message }: { message: string }) => (
  <Alert variant="destructive">
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
)

const StatisticsCards = ({ calls }: { calls: RetellCall[] }) => {
  const totalCalls = calls.length
  const averageDuration = calls.reduce((acc, call) => acc + (call.end_timestamp - call.start_timestamp), 0) / totalCalls / 1000 / 60
  const successRate = calls.filter(call => call.call_analysis.call_successful).length / totalCalls * 100

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm lg:text-base font-medium">Total Calls</CardTitle>
          <PhoneCall className="h-3 w-3 md:h-4 md:w-4 lg:h-5 lg:w-5 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-xl md:text-2xl lg:text-3xl font-bold">{totalCalls}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">Avg Duration</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageDuration.toFixed(2)} min</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">Success Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{successRate.toFixed(2)}%</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs md:text-sm font-medium">Active Agents</CardTitle>
          <AlertCircle className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{new Set(calls.map(call => call.agent_id)).size}</div>
        </CardContent>
      </Card>
    </div>
  )
}

export default Overview
