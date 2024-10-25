'use client'

import React from 'react';
import { TwilioMessage } from '@/app/types/twilio';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { formatDistanceToNow } from 'date-fns';

interface TwilioMessageListProps {
  messages: TwilioMessage[];
}

export function TwilioMessageList({ messages }: TwilioMessageListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>From</TableHead>
          <TableHead>To</TableHead>
          <TableHead>Body</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Sent</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {messages.map((message) => (
          <TableRow key={message.sid}>
            <TableCell>{message.from}</TableCell>
            <TableCell>{message.to}</TableCell>
            <TableCell>{message.body}</TableCell>
            <TableCell>{message.status}</TableCell>
            <TableCell>{formatDistanceToNow(new Date(message.dateSent), { addSuffix: true })}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}