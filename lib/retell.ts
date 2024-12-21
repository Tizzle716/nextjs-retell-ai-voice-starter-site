import Retell from "retell-sdk";
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export async function getRetellClient() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('Unauthorized');
  }

  const { data: settings, error: settingsError } = await supabase
    .from('api_settings')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (settingsError || !settings?.retell_api_key) {
    throw new Error('Retell API key not configured');
  }

  return new Retell({
    apiKey: settings.retell_api_key,
  });
}
