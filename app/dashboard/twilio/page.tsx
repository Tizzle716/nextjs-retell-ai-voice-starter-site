'use client';

import React from 'react';
import { TwilioOverview } from '@/components/twilio/TwilioOverview';

export default function TwilioPage() {
  return (
    <div className="flex-1 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Twilio Dashboard</h1>
        <TwilioOverview />
      </div>
    </div>
  );
}
