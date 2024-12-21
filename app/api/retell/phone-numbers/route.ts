import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: settings, error: settingsError } = await supabase
      .from('api_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (settingsError || !settings?.retell_api_key) {
      return NextResponse.json({ error: 'Retell API key not configured' }, { status: 400 });
    }

    const response = await fetch('https://api.retellai.com/list-phone-numbers', {
      headers: {
        'Authorization': `Bearer ${settings.retell_api_key}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const phoneNumbers = await response.json();
    return NextResponse.json(phoneNumbers);
  } catch (error) {
    console.error('Error fetching phone numbers:', error);
    return NextResponse.json({ error: 'Failed to fetch phone numbers' }, { status: 500 });
  }
}
