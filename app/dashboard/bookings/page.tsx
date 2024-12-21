'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { Badge } from "@/components/ui/badge";
import { MapPin, Phone, Calendar, Clock } from 'lucide-react';

interface BookingFieldsResponses {
  email: string;
  name: string;
  guests: string[];
  Phone: string;
  title: string;
  location: {
    value: string;
    optionValue: string;
  };
  smsReminderNumber: string;
  notes?: string;
}

interface Attendee {
  name: string;
  timeZone: string;
  language: string;
  absent: boolean;
}

interface Host {
  id: number;
  name: string;
  username: string;
  timeZone: string;
}

interface Booking {
  id: number;
  uid: string;
  title: string;
  description: string;
  hosts: Host[];
  status: string;
  start: string;
  end: string;
  duration: number;
  eventTypeId: number;
  eventType: {
    id: number;
    slug: string;
  };
  meetingUrl: string;
  location: string;
  absentHost: boolean;
  createdAt: string;
  metadata: Record<string, any>;
  attendees: Attendee[];
  guests: string[];
  bookingFieldsResponses: BookingFieldsResponses;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [timeFilter, setTimeFilter] = useState<'current' | 'past'>('current');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch('/api/bookings');
        if (!response.ok) {
          throw new Error('Failed to fetch bookings');
        }
        const data = await response.json();
        const sortedBookings = sortBookings(data.data || []);
        setBookings(sortedBookings);
      } catch (err) {
        setError('Error loading bookings');
        console.error('Error:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const sortBookings = (bookingsToSort: Booking[]) => {
    const now = new Date();
    return [...bookingsToSort].sort((a, b) => {
      const aDate = new Date(a.start);
      const bDate = new Date(b.start);
      return bDate.getTime() - aDate.getTime(); // Most recent first
    });
  };

  const filterBookings = (bookings: Booking[]) => {
    const now = new Date();
    return bookings.filter(booking => {
      const bookingDate = new Date(booking.start);
      return timeFilter === 'current' ? bookingDate > now : bookingDate <= now;
    });
  };

  const renderBookingCard = (booking: Booking) => (
    <Card key={booking.uid} className="overflow-hidden">
      <CardHeader className="space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{booking.bookingFieldsResponses.name}</CardTitle>
          <Badge variant={booking.status === 'accepted' ? 'success' : 'secondary'}>
            {booking.status}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{booking.title}</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="h-4 w-4" />
            {format(new Date(booking.start), 'PPP')}
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Clock className="h-4 w-4" />
            {format(new Date(booking.start), 'p')} - {format(new Date(booking.end), 'p')}
          </div>
          {booking.location && (
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="h-4 w-4" />
              {booking.location}
            </div>
          )}
          {booking.bookingFieldsResponses.Phone && (
            <div className="flex items-center gap-2 text-sm">
              <Phone className="h-4 w-4" />
              {booking.bookingFieldsResponses.Phone}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const renderBookingListItem = (booking: Booking) => (
    <div key={booking.uid} className="flex items-center justify-between p-4 border-b last:border-b-0">
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-medium">{booking.bookingFieldsResponses.name}</h3>
          <Badge variant={booking.status === 'accepted' ? 'success' : 'secondary'}>
            {booking.status}
          </Badge>
        </div>
        <div className="mt-1 text-sm text-muted-foreground">{booking.title}</div>
        <div className="mt-2 flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {format(new Date(booking.start), 'PPP')}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {format(new Date(booking.start), 'p')} - {format(new Date(booking.end), 'p')}
          </div>
        </div>
      </div>
    </div>
  );

  if (isLoading) {
    return <div>Loading bookings...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  const filteredBookings = filterBookings(bookings);

  return (
    <div className="container mx-auto py-6">
      <div className="mb-6">
        <Tabs defaultValue="current" onValueChange={(value) => setTimeFilter(value as 'current' | 'past')}>
          <TabsList>
            <TabsTrigger value="current">Current Bookings</TabsTrigger>
            <TabsTrigger value="past">Past Bookings</TabsTrigger>
          </TabsList>
          <TabsContent value="current">
            <div className="mb-4">
              <Tabs defaultValue="list" onValueChange={(value) => setViewMode(value as 'list' | 'grid')}>
                <TabsList>
                  <TabsTrigger value="list">List View</TabsTrigger>
                  <TabsTrigger value="grid">Grid View</TabsTrigger>
                </TabsList>
                <TabsContent value="list">
                  <Card>
                    <CardContent className="p-0 divide-y">
                      {filteredBookings.map(renderBookingListItem)}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="grid">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredBookings.map(renderBookingCard)}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
          <TabsContent value="past">
            <div className="mb-4">
              <Tabs defaultValue="list" onValueChange={(value) => setViewMode(value as 'list' | 'grid')}>
                <TabsList>
                  <TabsTrigger value="list">List View</TabsTrigger>
                  <TabsTrigger value="grid">Grid View</TabsTrigger>
                </TabsList>
                <TabsContent value="list">
                  <Card>
                    <CardContent className="p-0 divide-y">
                      {filteredBookings.map(renderBookingListItem)}
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="grid">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredBookings.map(renderBookingCard)}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
