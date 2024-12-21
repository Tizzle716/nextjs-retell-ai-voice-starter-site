import { createHmac } from 'crypto';
import Retell from 'retell-sdk';

// Extend Retell's functionality with our verify method
export function verifyWebhookSignature(rawBody: string, signature: string, apiKey: string): boolean {
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

// Add the verify method to Retell's static methods
(Retell as any).verify = verifyWebhookSignature;
