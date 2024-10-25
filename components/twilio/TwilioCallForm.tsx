import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from '@/hooks/use-toast';
import { PhoneInput } from 'react-international-phone';
import 'react-international-phone/style.css';
import { FiPhone, FiPhoneCall, FiPhoneOff } from 'react-icons/fi';
import { makeCall } from '@/lib/twilio';
import { mockPhoneNumbers } from '@/app/mocks/twilioMockData';

export function TwilioCallForm() {
  const [to, setTo] = useState('');
  const [from, setFrom] = useState(mockPhoneNumbers[0].phoneNumber);
  const [isLoading, setIsLoading] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callDuration, setCallDuration] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isCallActive) {
      interval = setInterval(() => {
        setCallDuration((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isCallActive]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const call = await makeCall(to, from);
      setIsCallActive(true);
      toast({
        title: 'Call initiated',
        description: `Call SID: ${call.sid}`,
      });
    } catch {
      toast({
        title: 'Error making call',
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleEndCall = () => {
    setIsCallActive(false);
    setCallDuration(0);
    // Add logic to end the call via Twilio API
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FiPhone className="text-primary" />
          Make a Call
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label htmlFor="from" className="text-sm font-medium">From</label>
            <Select value={from} onValueChange={setFrom}>
              <SelectTrigger>
                <SelectValue placeholder="Select a number" />
              </SelectTrigger>
              <SelectContent>
                {mockPhoneNumbers.map((number) => (
                  <SelectItem key={number.sid} value={number.phoneNumber}>
                    {number.friendlyName} ({number.phoneNumber})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <label htmlFor="to" className="text-sm font-medium">To</label>
            <PhoneInput
              defaultCountry="fr"
              value={to}
              onChange={(phone) => setTo(phone)}
              inputClassName="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex justify-between items-center">
        {isCallActive ? (
          <>
            <span className="text-sm font-medium">Call duration: {formatTime(callDuration)}</span>
            <Button onClick={handleEndCall} variant="destructive">
              <FiPhoneOff className="mr-2" /> End Call
            </Button>
          </>
        ) : (
          <Button type="submit" disabled={isLoading || !to} onClick={handleSubmit} className="w-full">
            {isLoading ? (
              'Initiating Call...'
            ) : (
              <>
                <FiPhoneCall className="mr-2" /> Make Call
              </>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
