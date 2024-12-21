import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('[Settings API] Fetching settings...');
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('[Settings API] User authentication error:', userError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('[Settings API] Authenticated user:', user.id);

    // Try to get settings from Supabase
    const { data: existingSettings, error } = await supabase
      .from('api_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) {
      console.log('[Settings API] Database error:', error.code, error.message);
      if (error.code === 'PGRST116') { // No data found
        return NextResponse.json({
          retell_api_key: null,
          cal_api_key: null,
          cal_event_type_id: null,
          agent_settings: null
        });
      }
      return NextResponse.json({ error: 'Failed to fetch settings' }, { status: 500 });
    }

    console.log('[Settings API] Retrieved settings:', {
      hasSettings: !!existingSettings,
      hasCalApiKey: !!existingSettings?.cal_api_key,
      hasRetellApiKey: !!existingSettings?.retell_api_key,
      hasAgentSettings: !!existingSettings?.agent_settings
    });

    // Return the settings
    return NextResponse.json({
      retell_api_key: existingSettings?.retell_api_key || null,
      cal_api_key: existingSettings?.cal_api_key || null,
      cal_event_type_id: existingSettings?.cal_event_type_id || null,
      agent_settings: existingSettings?.agent_settings || null
    });
  } catch (error) {
    console.error('Error fetching settings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch settings' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    console.log('[Settings API] Updating settings...');
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('[Settings API] User authentication error:', userError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('[Settings API] Authenticated user:', user.id);

    const body = await req.json();
    console.log('[Settings API] Received settings update:', {
      hasCalApiKey: !!body.cal_api_key,
      hasRetellApiKey: !!body.retell_api_key,
      hasAgentSettings: !!(body.agent_id || body.voice_id || body.language)
    });

    // First get existing settings
    const { data: existingSettings } = await supabase
      .from('api_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Extract agent settings
    const agentSettings = body.agent_id ? {
      agent_id: body.agent_id,
      voice_id: body.voice_id,
      language: body.language || 'english'
    } : existingSettings?.agent_settings || null;

    // Prepare settings to save
    const settingsToSave = {
      user_id: user.id,
      cal_api_key: body.cal_api_key || existingSettings?.cal_api_key || null,
      cal_event_type_id: body.cal_event_type_id || existingSettings?.cal_event_type_id || null,
      retell_api_key: body.retell_api_key || existingSettings?.retell_api_key || null,
      agent_settings: agentSettings,
      updated_at: new Date().toISOString()
    };

    console.log('[Settings API] Upserting settings with fields:', Object.keys(settingsToSave));

    // Upsert settings
    const { data: savedSettings, error: saveError } = await supabase
      .from('api_settings')
      .upsert(settingsToSave, {
        onConflict: 'user_id',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (saveError) {
      console.error('[Settings API] Error saving settings:', saveError);
      return NextResponse.json({ error: 'Failed to save settings' }, { status: 500 });
    }

    console.log('[Settings API] Settings saved successfully');
    return NextResponse.json({
      retell_api_key: savedSettings.retell_api_key || null,
      cal_api_key: savedSettings.cal_api_key || null,
      cal_event_type_id: savedSettings.cal_event_type_id || null,
      agent_settings: savedSettings.agent_settings || null
    });
  } catch (error) {
    console.error('[Settings API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Failed to save settings' },
      { status: 500 }
    );
  }
}
