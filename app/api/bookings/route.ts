import { NextResponse } from "next/server";
import { cookies } from 'next/headers';
import { createClient } from '@/utils/supabase/server';

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    // Get user's API settings
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('[Bookings API] User auth error:', userError);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.log('[Bookings API] User authenticated:', user.id);

    const { data: settings, error: settingsError } = await supabase
      .from('api_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (settingsError) {
      console.error('[Bookings API] Settings fetch error:', settingsError);
      return NextResponse.json(
        { error: 'Failed to fetch API settings' },
        { status: 500 }
      );
    }

    if (!settings?.cal_api_key || !settings?.cal_event_type_id) {
      console.error('[Bookings API] Missing required settings:', {
        hasCalApiKey: !!settings?.cal_api_key,
        hasEventTypeId: !!settings?.cal_event_type_id
      });
      return NextResponse.json(
        { error: 'API settings not configured' },
        { status: 400 }
      );
    }

    console.log('[Bookings API] Fetching from Cal.com with:', {
      eventTypeId: settings.cal_event_type_id,
      hasApiKey: !!settings.cal_api_key
    });

    const response = await fetch(
      `https://api.cal.com/v2/bookings?eventTypeId=${settings.cal_event_type_id}`,
      {
        headers: {
          'cal-api-version': '2024-08-13',
          'Authorization': `Bearer ${settings.cal_api_key}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[Bookings API] Cal.com API error:', {
        status: response.status,
        statusText: response.statusText,
        error: errorText
      });
      throw new Error(`Failed to fetch bookings from Cal.com: ${errorText}`);
    }

    const data = await response.json();
    console.log('[Bookings API] Successfully fetched bookings:', {
      count: data.data?.length || 0
    });
    
    // Map the bookings to include agent_id from responses
    const enrichedData = {
      ...data,
      data: data.data.map((booking: any) => {
        // Look for agent_id in the booking responses
        const agentId = booking.responses?.agent_id || null;
        return {
          ...booking,
          agent_id: agentId
        };
      })
    };

    return NextResponse.json(enrichedData);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}

// POST endpoint to associate an agent with a booking
export async function POST(request: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { booking_uid, agent_id } = body;

    if (!booking_uid || !agent_id) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('booking_agents')
      .upsert(
        { 
          booking_uid,
          agent_id,
          user_id: user.id 
        },
        { 
          onConflict: 'booking_uid',
          ignoreDuplicates: false 
        }
      );

    if (error) {
      console.error('Error associating agent with booking:', error);
      return NextResponse.json(
        { error: 'Failed to associate agent with booking' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error in POST /api/bookings:', error);
    return NextResponse.json(
      { error: 'Failed to process request' },
      { status: 500 }
    );
  }
}
