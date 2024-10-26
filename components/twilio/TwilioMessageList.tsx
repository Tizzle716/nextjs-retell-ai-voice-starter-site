'use client'

import React from 'react';
import { TwilioMessage } from '@/app/types/twilio';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';

interface TwilioMessageListProps {
  messages: TwilioMessage[];
}

const getStatusBadgeVariant = (status: string) => {
  switch (status.toLowerCase()) {
    case 'delivered':
      return 'success';
    case 'sent':
      return 'default';
    case 'failed':
      return 'destructive';
    case 'undelivered':
      return 'warning';
    case 'queued':
      return 'secondary';
    default:
      return 'outline';
  }
};

export function TwilioMessageList({ messages }: TwilioMessageListProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[25%]">From</TableHead>
            <TableHead className="w-[25%]">To</TableHead>
            <TableHead className="w-[30%]">Body</TableHead>
            <TableHead className="w-[10%]">Status</TableHead>
            <TableHead className="w-[10%]">Sent</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {messages.map((message) => (
            <TableRow key={message.sid}>
              <TableCell>{message.from}</TableCell>
              <TableCell>{message.to}</TableCell>
              <TableCell className="truncate max-w-[200px]">{message.body}</TableCell>
              <TableCell>
                <Badge variant={getStatusBadgeVariant(message.status)}>
                  {message.status}
                </Badge>
              </TableCell>
              <TableCell>{formatDistanceToNow(new Date(message.dateSent), { addSuffix: true })}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
