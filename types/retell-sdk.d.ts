import { createHmac } from 'crypto';

declare module 'retell-sdk' {
  interface RetellWidgetConfig {
    container: HTMLElement;
    accessToken: string;
    styling?: {
      position?: string;
      primaryColor?: string;
      borderRadius?: string;
    };
  }

  interface CallCreateWebCallParams {
    agent_id: string;
    customer_number?: string;
    metadata?: Record<string, unknown>;
  }

  export interface WebCallResponse {
    call_id: string;
    web_call_link: string;
    access_token: string;
    agent_id: string;
    call_status: "error" | "registered" | "ongoing" | "ended";
    call_type: "web_call";
    metadata?: Record<string, unknown>;
    transcript?: string;
    call_analysis?: { /* define structure here if needed */ };
  }

  interface RetellCall {
    createWebCall: (params: CallCreateWebCallParams) => Promise<WebCallResponse>;
    retrieve: (callId: string) => Promise<WebCallResponse>;
  }

  export default class Retell {
    constructor(config: { apiKey: string });
    
    call: RetellCall;

    static verify(rawBody: string, signature: string, apiKey: string): boolean {
      try {
        // Create HMAC using API key as secret
        const hmac = createHmac('sha256', apiKey);
        
        // Update HMAC with request body
        hmac.update(rawBody);
        
        // Get computed signature
        const computedSignature = hmac.digest('hex');
        
        // Compare computed signature with provided signature
        return computedSignature === signature;
      } catch (error) {
        console.error('Error verifying webhook signature:', error);
        return false;
      }
    }
    
    static Widget: {
      new(config: RetellWidgetConfig): {
        on(event: string, callback: () => void): void;
      };
    };
  }
}
