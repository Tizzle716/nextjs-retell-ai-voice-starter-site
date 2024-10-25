'use client'

import React from 'react'
import { RetellCall } from '@/app/types/retell'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

interface CallChartProps {
  calls: RetellCall[]
}

const CallChart: React.FC<CallChartProps> = ({ calls }) => {
  const chartData = calls.reduce((acc, call) => {
    const date = new Date(call.start_timestamp).toLocaleDateString()
    if (!acc[date]) {
      acc[date] = { date, successful: 0, unsuccessful: 0 }
    }
    if (call.call_analysis.call_successful) {
      acc[date].successful++
    } else {
      acc[date].unsuccessful++
    }
    return acc
  }, {} as Record<string, { date: string; successful: number; unsuccessful: number }>)

  const chartConfig = {
    successful: {
      label: 'Successful Calls',
      color: 'hsl(var(--chart-1))',
    },
    unsuccessful: {
      label: 'Unsuccessful Calls',
      color: 'hsl(var(--chart-2))',
    },
  }

  return (
    <ChartContainer config={chartConfig} className="h-[300px] sm:h-[400px] lg:h-[500px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={Object.values(chartData)} accessibilityLayer>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="date" 
            tickFormatter={(value) => value.slice(0, 5)} 
            angle={-45}
            textAnchor="end"
            height={50}
            interval={0}
          />
          <YAxis />
          <ChartTooltip content={<ChartTooltipContent />} />
          <Bar dataKey="successful" fill="var(--color-successful)" stackId="a" radius={[4, 4, 0, 0]} />
          <Bar dataKey="unsuccessful" fill="var(--color-unsuccessful)" stackId="a" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  )
}

export default CallChart
