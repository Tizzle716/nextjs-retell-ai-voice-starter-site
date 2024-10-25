'use client'

import React from 'react'
import { RetellCall } from '@/app/types/retell'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface CallStatsProps {
  calls: RetellCall[]
}

const CallStats: React.FC<CallStatsProps> = ({ calls }) => {
  const totalCalls = calls.length
  const successfulCalls = calls.filter(call => call.call_analysis.call_successful).length
  const averageDuration = calls.reduce((acc, call) => acc + (call.end_timestamp - call.start_timestamp), 0) / totalCalls / 1000 / 60
  const uniqueAgents = new Set(calls.map(call => call.agent_id)).size

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm sm:text-base font-medium">Total Calls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl lg:text-3xl font-bold">{totalCalls}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Successful Calls</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{successfulCalls}</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Average Duration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageDuration.toFixed(2)} min</div>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Unique Agents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{uniqueAgents}</div>
        </CardContent>
      </Card>
    </div>
  )
}

export default CallStats
