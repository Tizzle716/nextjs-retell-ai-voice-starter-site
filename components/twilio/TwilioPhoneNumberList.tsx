import React from 'react';
import { TwilioPhoneNumber } from '@/app/types/twilio';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

interface TwilioPhoneNumberListProps {
  phoneNumbers: TwilioPhoneNumber[];
}

export function TwilioPhoneNumberList({ phoneNumbers }: TwilioPhoneNumberListProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Phone Number</TableHead>
          <TableHead>Friendly Name</TableHead>
          <TableHead>Capabilities</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {phoneNumbers.map((number) => (
          <TableRow key={number.sid}>
            <TableCell>{number.phoneNumber}</TableCell>
            <TableCell>{number.friendlyName}</TableCell>
            <TableCell>
              {number.capabilities.voice && <Badge className="mr-1">Voice</Badge>}
              {number.capabilities.SMS && <Badge className="mr-1">SMS</Badge>}
              {number.capabilities.MMS && <Badge>MMS</Badge>}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}