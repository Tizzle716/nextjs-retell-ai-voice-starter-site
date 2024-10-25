'use client'

import React from 'react';
import { TwilioCall } from '@/app/types/twilio';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';

interface TwilioCallListProps {
  calls: TwilioCall[];
}

export function TwilioCallList({ calls }: TwilioCallListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Duration</TableHead>
          <TableHead>Start Time</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {calls.map((call) => (
          <TableRow key={call.sid}>
            <TableCell>{call.from}</TableCell>
            <TableCell>{call.to}</TableCell>
            <TableCell>{call.status}</TableCell>
            <TableCell>{call.duration} seconds</TableCell>
            <TableCell>{formatDistanceToNow(new Date(call.startTime), { addSuffix: true })}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}