'use client'
import React, { useState, useEffect } from 'react'
import { RetellCall } from '@/app/types/retell'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Calendar,
  Clock,
  Users,
  TrendingUp,
  MessageSquare,
  Waves,
  FileText,
} from 'lucide-react'
import { format } from 'date-fns'

export default function Overview() {
  const [calls, setCalls] = useState<RetellCall[]>([])
  const [bookings, setBookings] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [agents, setAgents] = useState<any[]>([])
  const [selectedAgent, setSelectedAgent] = useState<string>('all')

  useEffect(() => {
    fetchData()
    fetchAgents()
  }, [page])

  const fetchAgents = async () => {
    try {
      const response = await fetch('/api/agents')
      if (!response.ok) {
        throw new Error('Failed to fetch agents')
      }
      const data = await response.json()
      setAgents(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Error fetching agents:', error)
    }
  }

  useEffect(() => {
    fetchData()
  }, [page])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Fetch calls with pagination
      const callsResponse = await fetch(`/api/retell/calls?page=${page}&limit=1000`)
      if (!callsResponse.ok) {
        throw new Error('Failed to fetch calls')
      }
      const callsData = await callsResponse.json()
      
      if (page === 1) {
        setCalls(callsData.calls)
      } else {
        setCalls(prev => [...prev, ...callsData.calls])
      }
      
      setHasMore(callsData.calls.length === callsData.limit)

      // Fetch bookings
      const bookingsResponse = await fetch('/api/bookings')
      if (!bookingsResponse.ok) {
        throw new Error('Failed to fetch bookings')
      }
      const bookingsData = await bookingsResponse.json()
      // Cal.com API returns bookings in data array
      setBookings(bookingsData.data || [])
    } catch {
      setError('Error fetching data. Please try again later.')
    } finally {
      setIsLoading(false)
    }
  }

  const loadMore = () => {
    if (!isLoading && hasMore) {
      setPage(prev => prev + 1)
    }
  }

  const getAnalytics = () => {
    // Filter calls by selected agent
    const filteredCalls = selectedAgent === 'all' 
      ? calls 
      : calls.filter(call => call.agent_id === selectedAgent)
    
    const totalCalls = filteredCalls.length
    
    // Filter bookings by selected agent
    const filteredBookings = selectedAgent === 'all'
      ? bookings
      : bookings.filter(booking => booking.agent_id === selectedAgent)
    
    const currentTime = new Date()
    
    // Calculate total bookings from both past and upcoming appointments
    const pastBookings = filteredBookings.filter(booking => 
      booking?.start && new Date(booking.start) < currentTime
    ).length
    
    const upcomingBookings = filteredBookings.filter(booking => 
      booking?.start && new Date(booking.start) >= currentTime
    ).length
    
    const totalBookings = pastBookings + upcomingBookings
    const successRate = totalCalls > 0 ? (totalBookings / totalCalls * 100).toFixed(1) : '0'
    
    return { totalCalls, totalBookings, pastBookings, upcomingBookings, successRate }
  }

  const renderAnalytics = () => {
    const { totalCalls, totalBookings, pastBookings, upcomingBookings, successRate } = getAnalytics()
    
    return (
      <>
        <div className="mb-4">
          <select
            value={selectedAgent}
            onChange={(e) => setSelectedAgent(e.target.value)}
            className="w-full md:w-auto px-3 py-2 border rounded-md text-sm"
          >
            <option value="all">All Agents</option>
            {agents.map((agent) => (
              <option key={agent.agent_id} value={agent.agent_id}>
                {agent.name || `Agent ${agent.agent_id.slice(0, 8)}`}
              </option>
            ))}
          </select>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalCalls}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Booked Appointments</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Past: {pastBookings} | Upcoming: {upcomingBookings}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Booking Rate</CardTitle>
              <div className={`rounded-full w-2 h-2 ${Number(successRate) >= 30 ? 'bg-green-500' : Number(successRate) >= 15 ? 'bg-yellow-500' : 'bg-red-500'}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{successRate}%</div>
            </CardContent>
          </Card>
        </div>
      </>
    )
  }

  const renderCallCard = (call: RetellCall) => (
    <Card key={call.call_id} className="overflow-hidden">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Call {call.call_id.slice(0, 8)}</CardTitle>
          <Badge variant={
            call.call_status === 'ongoing' ? 'default' :
            call.call_status === 'ended' ? 'secondary' :
            call.call_status === 'error' ? 'destructive' : 'outline'
          }>
            {call.call_status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4" />
              {call.start_timestamp && format(new Date(call.start_timestamp), 'PPP')}
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              {call.start_timestamp && format(new Date(call.start_timestamp), 'p')}
              {call.end_timestamp && ` - ${format(new Date(call.end_timestamp), 'p')}`}
            </div>
            {call.agent_id && (
              <div className="flex items-center gap-2 text-sm">
                <Users className="h-4 w-4" />
                Agent ID: {call.agent_id.slice(0, 8)}
              </div>
            )}
            {call.call_analysis?.user_sentiment && (
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4" />
                Sentiment: {call.call_analysis.user_sentiment}
              </div>
            )}
          </div>
          
          {call.recording_url && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Waves className="h-4 w-4" />
                Recording
              </div>
              <audio 
                controls 
                className="w-full"
                src={call.recording_url}
              >
                Your browser does not support the audio element.
              </audio>
            </div>
          )}
        </div>

        {call.transcript && (
          <div className="flex items-start gap-2 text-sm border-t pt-4">
            <MessageSquare className="h-4 w-4 mt-1" />
            <div className="flex-1">
              <div className="font-medium mb-1">Transcript Preview</div>
              <p className="line-clamp-3">{call.transcript}</p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mt-2">
          {call.public_log_url && (
            <a
              href={call.public_log_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-blue-500 hover:text-blue-600"
            >
              <FileText className="h-4 w-4" />
              Logs
            </a>
          )}
        </div>
      </CardContent>
    </Card>
  )

  if (isLoading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return <ErrorAlert message={error} />
  }

  return (
    <div className="space-y-6">
      {renderAnalytics()}
      <div className="flex flex-col space-y-4">
        {calls.map(renderCallCard)}
        {hasMore && (
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={loadMore}
          >
            Load More
          </button>
        )}
      </div>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <Skeleton key={i} className="h-[200px] w-full" />
        ))}
      </div>
    </div>
  )
}

function ErrorAlert({ message }: { message: string }) {
  return (
    <Alert variant="destructive">
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}
