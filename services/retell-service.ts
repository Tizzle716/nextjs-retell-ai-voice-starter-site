import { Retell } from 'retell-sdk';
import { WebCallResponse } from '../types/retell';

export class RetellService {
  private client: Retell;

  constructor(apiKey: string) {
    this.client = new Retell({
      apiKey: apiKey
    });
  }

  async createWebCall(agentId: string): Promise<WebCallResponse> {
    try {
      const response = await this.client.call.createWebCall({
        agent_id: agentId
      });

      if (!response || !response.access_token) {
        throw new Error('Failed to create web call: No access token received');
      }

      // Add web_call_link and ensure metadata type matches
      const webCallResponse: WebCallResponse = {
        call_id: response.call_id,
        web_call_link: `https://app.retellai.com/call/${response.call_id}`,
        access_token: response.access_token,
        agent_id: response.agent_id,
        call_status: response.call_status,
        call_type: response.call_type,
        metadata: response.metadata as Record<string, unknown> | undefined,
        transcript: response.transcript,
        call_analysis: response.call_analysis
      };

      return webCallResponse;
    } catch (error) {
      console.error('[RetellService] Error creating web call:', error);
      throw error;
    }
  }

  // Add more backend-specific Retell SDK methods here
}
