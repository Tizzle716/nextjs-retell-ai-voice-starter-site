import { TwilioCall, TwilioMessage, TwilioPhoneNumber } from '@/app/types/twilio';

export const mockCalls: TwilioCall[] = [
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
  },
  // Ajoutez d'autres appels simulés ici
];

export const mockMessages: TwilioMessage[] = [
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

export const mockPhoneNumbers: TwilioPhoneNumber[] = [
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