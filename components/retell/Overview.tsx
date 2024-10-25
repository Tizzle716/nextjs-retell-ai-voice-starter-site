'use client'
import React, { useState, useEffect } from 'react'
import { RetellCall } from '@/app/types/retell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PhoneCall, Clock, TrendingUp, AlertCircle } from 'lucide-react'
import CallList from './CallList'
import CallStats from './CallStats'
import CallChart from './CallChart'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Skeleton } from '@/components/ui/skeleton'

const Overview: React.FC = () => {
  const [calls, setCalls] = useState<RetellCall[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab] = useState('list')

  useEffect(() => {
    fetchCalls()
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

  if (isLoading) {
    return (
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
  }

  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  const totalCalls = calls.length
  const averageDuration = calls.reduce((acc, call) => acc + (call.end_timestamp - call.start_timestamp), 0) / totalCalls / 1000 / 60
  const successRate = calls.filter(call => call.call_analysis.call_successful).length / totalCalls * 100

  return (
    <div className="space-y-6 w-full">
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

      <Tabs defaultValue="list" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto">
          <TabsTrigger value="list">Call List</TabsTrigger>
          <TabsTrigger value="stats">Statistics</TabsTrigger>
          <TabsTrigger value="chart">Charts</TabsTrigger>
        </TabsList>
        <TabsContent value="list" className="w-full">
          {activeTab === 'list' && <CallList calls={calls} />}
        </TabsContent>
        <TabsContent value="stats" className="w-full">
          {activeTab === 'stats' && <CallStats calls={calls} />}
        </TabsContent>
        <TabsContent value="chart" className="w-full">
          {activeTab === 'chart' && <CallChart calls={calls} />}
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Overview
