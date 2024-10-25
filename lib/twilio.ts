import { TwilioCall, TwilioMessage, TwilioPhoneNumber } from '@/app/types/twilio';

// Données simulées
const mockCalls: TwilioCall[] = [
  {
    sid: 'CA1234567890abcdef1234567890abcdef',
    to: '+33123456789',
    from: '+33987654321',
    status: 'completed',
    startTime: '2023-06-01T10:00:00Z',
    endTime: '2023-06-01T10:05:00Z',
    duration: 300,
    direction: 'outbound-api',
    price: '0.50',
    recordingUrl: 'https://api.twilio.com/2010-04-01/Accounts/ACXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX/Recordings/REXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
  },
  // Ajoutez d'autres appels simulés ici
];

const mockMessages: TwilioMessage[] = [
  {
    sid: 'SM1234567890abcdef1234567890abcdef',
    to: '+33123456789',
    from: '+33987654321',
    body: 'Ceci est un message de test',
    status: 'delivered',
    dateSent: '2023-06-01T11:00:00Z',
    direction: 'outbound-api',
    price: '0.10',
  },
  // Ajoutez d'autres messages simulés ici
];

const mockPhoneNumbers: TwilioPhoneNumber[] = [
  {
    sid: 'PN1234567890abcdef1234567890abcdef',
    phoneNumber: '+33123456789',
    friendlyName: 'Numéro principal',
    capabilities: {
      voice: true,
      SMS: true,
      MMS: true,
    },
  },
  // Ajoutez d'autres numéros de téléphone simulés ici
];

// Fonction utilitaire pour simuler un délai réseau
const simulateNetworkDelay = (ms: number = 500) => new Promise(resolve => setTimeout(resolve, ms));

export async function getTwilioCalls(): Promise<TwilioCall[]> {
  await simulateNetworkDelay();
  return mockCalls;
}

export async function getTwilioMessages(): Promise<TwilioMessage[]> {
  await simulateNetworkDelay();
  return mockMessages;
}

export async function getTwilioPhoneNumbers(): Promise<TwilioPhoneNumber[]> {
  await simulateNetworkDelay();
  return mockPhoneNumbers;
}

export async function makeCall(to: string, from: string): Promise<TwilioCall> {
  await simulateNetworkDelay(1000);
  const newCall: TwilioCall = {
    sid: `CA${Math.random().toString(36).substr(2, 32)}`,
    to,
    from,
    status: 'initiated',
    startTime: new Date().toISOString(),
    endTime: '',
    duration: 0,
    direction: 'outbound-api',
    price: '0.00',
    recordingUrl: undefined,
  };
  return newCall;
}

export async function sendMessage(to: string, from: string, body: string): Promise<TwilioMessage> {
  await simulateNetworkDelay(1000);
  const newMessage: TwilioMessage = {
    sid: `SM${Math.random().toString(36).substr(2, 32)}`,
    to,
    from,
    body,
    status: 'sent',
    dateSent: new Date().toISOString(),
    direction: 'outbound-api',
    price: '0.00',
  };
  return newMessage;
}
