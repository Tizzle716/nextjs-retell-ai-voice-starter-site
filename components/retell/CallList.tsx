import React, { useState } from 'react'
import { RetellCall } from '@/app/types/retell'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { formatDistanceToNow } from 'date-fns'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import CallModal from './CallModal'

interface CallListProps {
  calls: RetellCall[]
}

const CallList: React.FC<CallListProps> = ({ calls }) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState<keyof RetellCall>('start_timestamp')
  const [sortOrder] = useState<'asc' | 'desc'>('desc')
  const [selectedCall, setSelectedCall] = useState<RetellCall | null>(null)

  const sortedCalls = [...calls].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortOrder === 'asc' ? -1 : 1
    if (a[sortBy] > b[sortBy]) return sortOrder === 'asc' ? 1 : -1
    return 0
  })

  const filteredCalls = sortedCalls.filter(call =>
    call.call_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    call.agent_id.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-4 w-full max-w-full mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-4">
        <Input
          placeholder="Search calls..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-64 md:w-80"
        />
        <Select value={sortBy} onValueChange={(value) => setSortBy(value as keyof RetellCall)}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="start_timestamp">Start Time</SelectItem>
            <SelectItem value="end_timestamp">End Time</SelectItem>
            <SelectItem value="agent_id">Agent</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[15%]">Call ID</TableHead>
              <TableHead className="w-[20%]">Agent</TableHead>
              <TableHead className="w-[25%]">Start Time</TableHead>
              <TableHead className="w-[20%]">Duration</TableHead>
              <TableHead className="w-[20%]">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCalls.map((call) => (
              <TableRow
                key={call.call_id}
                onClick={() => setSelectedCall(call)}
                className="cursor-pointer hover:bg-gray-50 transition-colors"
              >
                <TableCell className="font-medium">{call.call_id}</TableCell>
                <TableCell>{call.agent_id}</TableCell>
                <TableCell>{formatDistanceToNow(new Date(call.start_timestamp), { addSuffix: true })}</TableCell>
                <TableCell>{((call.end_timestamp - call.start_timestamp) / 1000 / 60).toFixed(2)} min</TableCell>
                <TableCell>{call.call_status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pour les écrans mobiles, on pourrait ajouter une vue alternative */}
      <div className="sm:hidden">
        {filteredCalls.map((call) => (
          <div key={call.call_id} className="bg-white p-4 rounded-lg shadow mb-4">
            <p><strong>Call ID:</strong> {call.call_id}</p>
            <p><strong>Agent:</strong> {call.agent_id}</p>
            <p><strong>Start Time:</strong> {formatDistanceToNow(new Date(call.start_timestamp), { addSuffix: true })}</p>
            <p><strong>Duration:</strong> {((call.end_timestamp - call.start_timestamp) / 1000 / 60).toFixed(2)} min</p>
            <p><strong>Status:</strong> {call.call_status}</p>
          </div>
        ))}
      </div>

      <CallModal call={selectedCall} onClose={() => setSelectedCall(null)} />
    </div>
  )
}

export default CallList
