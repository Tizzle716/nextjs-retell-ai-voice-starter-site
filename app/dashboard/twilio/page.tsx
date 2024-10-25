'use client';

import React, { useState, useEffect } from 'react';
import { AppSidebar } from '@/components/app-sidebar/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TwilioCallList } from '@/components/twilio/TwilioCallList';
import { TwilioMessageList } from '@/components/twilio/TwilioMessageList';
import { TwilioPhoneNumberList } from '@/components/twilio/TwilioPhoneNumberList';
import { getTwilioCalls, getTwilioMessages, getTwilioPhoneNumbers } from '@/lib/twilio';
import { TwilioCall, TwilioMessage, TwilioPhoneNumber } from '@/app/types/twilio';
import { TwilioCallForm } from '@/components/twilio/TwilioCallForm';

export default function TwilioPage() {
  const [calls, setCalls] = useState<TwilioCall[]>([]);
  const [messages, setMessages] = useState<TwilioMessage[]>([]);
  const [phoneNumbers, setPhoneNumbers] = useState<TwilioPhoneNumber[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchTwilioData() {
      try {
        const [callsData, messagesData, phoneNumbersData] = await Promise.all([
          getTwilioCalls(),
          getTwilioMessages(),
          getTwilioPhoneNumbers(),
        ]);
        setCalls(callsData);
        setMessages(messagesData);
        setPhoneNumbers(phoneNumbersData);
      } catch (error) {
        console.error('Error fetching Twilio data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchTwilioData();
  }, []);

  return (
    <SidebarProvider>
      <div className="flex h-screen">
        <AppSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl md:text-3xl font-bold mb-6">Twilio Dashboard</h1>
            {isLoading ? (
              <p>Loading Twilio data...</p>
            ) : (
              <Tabs defaultValue="calls">
                <TabsList>
                  <TabsTrigger value="calls">Calls</TabsTrigger>
                  <TabsTrigger value="messages">Messages</TabsTrigger>
                  <TabsTrigger value="phone-numbers">Phone Numbers</TabsTrigger>
                </TabsList>
                <TabsContent value="calls">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Calls</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <TwilioCallList calls={calls} />
                    </CardContent>
                  </Card>
                  <TwilioCallForm />
                </TabsContent>
                <TabsContent value="messages">
                  <Card>
                    <CardHeader>
                      <CardTitle>Recent Messages</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <TwilioMessageList messages={messages} />
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="phone-numbers">
                  <Card>
                    <CardHeader>
                      <CardTitle>Phone Numbers</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <TwilioPhoneNumberList phoneNumbers={phoneNumbers} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            )}
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}
