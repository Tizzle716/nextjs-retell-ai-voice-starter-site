import * as dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY as string;
const webhookUrl = process.env.RETELL_WEBHOOK_URL as string;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Supabase URL and service role key are required');
  process.exit(1);
}

if (!webhookUrl) {
  console.error('RETELL_WEBHOOK_URL is required');
  process.exit(1);
}

async function configureAgent() {
  try {
    console.log('Fetching API settings from Supabase...');
    
    // Create Supabase client with service role key
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the first user's settings (assuming single user for now)
    const { data: settings, error: settingsError } = await supabase
      .from('api_settings')
      .select('*')
      .limit(1)
      .single();

    if (settingsError || !settings?.retell_api_key || !settings?.retell_agent_id) {
      throw new Error('Could not fetch API settings from Supabase');
    }

    console.log('Configuring Retell agent...');
    console.log(`Agent ID: ${settings.retell_agent_id}`);
    console.log(`Webhook URL: ${webhookUrl}`);

    const response = await fetch(`https://api.retellai.com/agents/${settings.retell_agent_id}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${settings.retell_api_key}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        webhook_url: webhookUrl
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Agent configuration updated successfully:', data);
  } catch (error) {
    console.error('Error updating agent configuration:', error);
    process.exit(1);
  }
}

configureAgent()
  .then(() => {
    console.log('[Config] Configuration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('[Config] Script failed:', error);
    process.exit(1);
  });
