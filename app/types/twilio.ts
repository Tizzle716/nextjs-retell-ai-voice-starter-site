export interface TwilioCall {
    sid: string;
    to: string;
    from: string;
    status: string;
    startTime: string;
    endTime: string;
    duration: number;
    direction: 'inbound' | 'outbound-api' | 'outbound-dial';
    price: string;
    recordingUrl?: string;
  }
  
  export interface TwilioMessage {
    sid: string;
    to: string;
    from: string;
    body: string;
    status: string;
    dateSent: string;
    direction: 'inbound' | 'outbound-api' | 'outbound-reply';
    price: string;
  }
  
  export interface TwilioPhoneNumber {
    sid: string;
    phoneNumber: string;
    friendlyName: string;
    capabilities: {
      voice: boolean;
      SMS: boolean;
      MMS: boolean;
    };
  }