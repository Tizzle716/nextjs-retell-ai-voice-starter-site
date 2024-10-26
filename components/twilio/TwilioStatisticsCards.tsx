import React from 'react'
import { TwilioCall, TwilioMessage } from '@/app/types/twilio'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { PhoneCall, MessageSquare, Clock, TrendingUp } from 'lucide-react'

interface TwilioStatisticsCardsProps {
  calls: TwilioCall[]
  messages: TwilioMessage[]
}

const TwilioStatisticsCards: React.FC<TwilioStatisticsCardsProps> = ({ calls, messages }) => {
  const totalCalls = calls.length
  const totalMessages = messages.length
  const averageCallDuration = calls.reduce((acc, call) => acc + call.duration, 0) / totalCalls
  const successfulCalls = calls.filter(call => call.status === 'completed').length
  const successRate = (successfulCalls / totalCalls) * 100

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Calls</CardTitle>
          <PhoneCall className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCalls}</div>
          <p className="text-xs text-muted-foreground">+{successfulCalls} successful</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Messages</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalMessages}</div>
          <p className="text-xs text-muted-foreground">Across all channels</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Avg Call Duration</CardTitle>
          <Clock className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{averageCallDuration.toFixed(2)} sec</div>
          <p className="text-xs text-muted-foreground">Per completed call</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Call Success Rate</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{successRate.toFixed(2)}%</div>
          <p className="text-xs text-muted-foreground">Of total calls</p>
        </CardContent>
      </Card>
    </div>
  )
}

export default TwilioStatisticsCards
