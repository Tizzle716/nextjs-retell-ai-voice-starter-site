import React from 'react';
import { TwilioPhoneNumber } from '@/app/types/twilio';
import { FiPhone, FiMessageSquare, FiImage } from 'react-icons/fi';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface TwilioPhoneNumberListProps {
  phoneNumbers: TwilioPhoneNumber[]
}

export function TwilioPhoneNumberList({ phoneNumbers }: TwilioPhoneNumberListProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Twilio Phone Numbers</CardTitle>
      </CardHeader>
      <CardContent>
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
                  <div className="flex space-x-1">
                    {number.capabilities.voice && (
                      <Badge variant="secondary" aria-label="Voice capability">
                        <FiPhone className="h-3 w-3 mr-1" />
                        Voice
                      </Badge>
                    )}
                    {number.capabilities.SMS && (
                      <Badge variant="secondary" aria-label="SMS capability">
                        <FiMessageSquare className="h-3 w-3 mr-1" />
                        SMS
                      </Badge>
                    )}
                    {number.capabilities.MMS && (
                      <Badge variant="secondary" aria-label="MMS capability">
                        <FiImage className="h-3 w-3 mr-1" />
                        MMS
                      </Badge>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
