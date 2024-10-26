'use client'

import React, { useState, useEffect } from 'react'
import { TwilioCall, TwilioMessage, TwilioPhoneNumber } from '@/app/types/twilio'
import { TwilioPhoneNumberList } from './TwilioPhoneNumberList'
import TwilioStatisticsCards from './TwilioStatisticsCards'
import { TwilioMessageList } from './TwilioMessageList'
import TwilioCallStatus from './TwilioCallStatus'
import { TwilioCallForm } from './TwilioCallForm'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function TwilioOverview() {
  const [calls, setCalls] = useState<TwilioCall[]>([])
  const [messages, setMessages] = useState<TwilioMessage[]>([])
  const [phoneNumbers, setPhoneNumbers] = useState<TwilioPhoneNumber[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeCallSid, setActiveCallSid] = useState<string | null>(null)
  const [callStatus, setCallStatus] = useState<'idle' | 'started' | 'ended'>('idle')
  const [callDuration, setCallDuration] = useState(0)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const [callsData, messagesData, phoneNumbersData] = await Promise.all([
        fetch('/api/twilio/calls').then(res => res.json()),
        fetch('/api/twilio/messages').then(res => res.json()),
        fetch('/api/twilio/phone-numbers').then(res => res.json())
      ])
      setCalls(callsData)
      setMessages(messagesData)
      setPhoneNumbers(phoneNumbersData)
    } catch (err) {
      console.error('Error fetching data:', err);
      setError('Error fetching data. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleCallInitiated = (callSid: string) => {
    setActiveCallSid(callSid)
    setCallStatus('started')
  }

  const handleCallEnded = () => {
    setCallStatus('ended')
  }

  if (isLoading) return <LoadingSkeleton />
  if (error) return <ErrorAlert message={error} />

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="calls">Calls</TabsTrigger>
        <TabsTrigger value="messages">Messages</TabsTrigger>
        <TabsTrigger value="numbers">Numbers</TabsTrigger>
      </TabsList>
      <TabsContent value="overview">
        <Card>
          <CardHeader>
            <CardTitle>Twilio Overview</CardTitle>
            <CardDescription>Your Twilio account at a glance</CardDescription>
          </CardHeader>
          <CardContent>
            <TwilioStatisticsCards calls={calls} messages={messages} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="calls">
        <Card>
          <CardHeader>
            <CardTitle>Calls</CardTitle>
            <CardDescription>Manage your Twilio calls</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TwilioCallForm
                phoneNumbers={phoneNumbers}
                onCallInitiated={handleCallInitiated}
                onCallEnded={handleCallEnded}
                onDurationChange={setCallDuration}
              />
              <TwilioCallStatus
                callSid={activeCallSid}
                status={callStatus}
                duration={callDuration}
              />
            </div>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="messages">
        <Card>
          <CardHeader>
            <CardTitle>Messages</CardTitle>
            <CardDescription>Your recent Twilio messages</CardDescription>
          </CardHeader>
          <CardContent>
            <TwilioMessageList messages={messages} />
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="numbers">
        <Card>
          <CardHeader>
            <CardTitle>Phone Numbers</CardTitle>
            <CardDescription>Your Twilio phone numbers</CardDescription>
          </CardHeader>
          <CardContent>
            <TwilioPhoneNumberList phoneNumbers={phoneNumbers} />
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

const LoadingSkeleton = () => (
  <div className="space-y-4">
    <Skeleton className="h-8 w-[200px]" />
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
    <Skeleton className="h-[calc(100vh-200px)] w-full" />
  </div>
)

const ErrorAlert = ({ message }: { message: string }) => (
  <Alert variant="destructive">
    <AlertTitle>Error</AlertTitle>
    <AlertDescription>{message}</AlertDescription>
  </Alert>
)
