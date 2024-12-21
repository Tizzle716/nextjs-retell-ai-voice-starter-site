import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

// Force dynamic route handling
export const dynamic = 'force-dynamic';

// Enable dynamic route parameters
export const dynamicParams = true;

// Configure segment config
export const runtime = 'nodejs';
export const preferredRegion = 'auto';

async function getRetellApiKey() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    throw new Error('Unauthorized');
  }

  const { data: settings, error: settingsError } = await supabase
    .from('api_settings')
    .select('retell_api_key')
    .eq('user_id', user.id)
    .single();

  if (settingsError || !settings?.retell_api_key) {
    throw new Error('Retell API key not configured');
  }

  return settings.retell_api_key;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: { agentId: string } }
) {
  try {
    const agentId = params.agentId;
    const data = await request.json();

    // Ensure pronunciation_dictionary is an array
    if (data.pronunciation_dictionary && !Array.isArray(data.pronunciation_dictionary)) {
      data.pronunciation_dictionary = [];
    }

    console.log('Updating agent:', agentId);
    console.log('Update data:', JSON.stringify(data, null, 2));

    let retellApiKey;
    try {
      retellApiKey = await getRetellApiKey();
    } catch (error) {
      console.error('Failed to get Retell API key:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to get API key' },
        { status: 500 }
      );
    }

    // Update the agent using the Retell API
    const agentResponse = await fetch(`https://api.retellai.com/update-agent/${agentId}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${retellApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        response_engine: {
          type: 'retell-llm',
          llm_id: data.response_engine.llm_id
        },
        agent_name: data.agent_name,
        voice_id: data.voice_id,
        voice_model: data.voice_model || null,
        fallback_voice_ids: data.fallback_voice_ids || null,
        voice_temperature: data.voice_temperature || 1,
        voice_speed: data.voice_speed || 1,
        volume: data.volume || 1,
        responsiveness: data.responsiveness || 1,
        interruption_sensitivity: data.interruption_sensitivity || 1,
        enable_backchannel: data.enable_backchannel || false,
        backchannel_frequency: data.backchannel_frequency || 0.8,
        backchannel_words: data.backchannel_words || null,
        reminder_trigger_ms: data.reminder_trigger_ms || 10000,
        reminder_max_count: data.reminder_max_count || 1,
        ambient_sound: data.ambient_sound || null,
        ambient_sound_volume: data.ambient_sound_volume || 1,
        language: data.language || 'en-US',
        webhook_url: data.webhook_url || null,
        boosted_keywords: data.boosted_keywords || null,
        enable_transcription_formatting: data.enable_transcription_formatting ?? true,
        opt_out_sensitive_data_storage: data.opt_out_sensitive_data_storage ?? false,
        pronunciation_dictionary: data.pronunciation_dictionary || null,
        normalize_for_speech: data.normalize_for_speech ?? true,
        end_call_after_silence_ms: data.end_call_after_silence_ms || 600000,
        max_call_duration_ms: data.max_call_duration_ms || 3600000,
        enable_voicemail_detection: data.enable_voicemail_detection || false,
        voicemail_message: data.voicemail_message || '',
        voicemail_detection_timeout_ms: data.voicemail_detection_timeout_ms || 30000,
        post_call_analysis_data: data.post_call_analysis_data || null
      }),
    });

    if (!agentResponse.ok) {
      const errorText = await agentResponse.text();
      console.error('Retell Agent API error:', errorText);
      return NextResponse.json(
        { error: `Failed to update agent: ${agentResponse.statusText}`, details: errorText },
        { status: agentResponse.status }
      );
    }

    const updatedAgent = await agentResponse.json();

    // If there's an LLM to update, do it separately
    if (data.response_engine?.system_prompt || data.response_engine?.functions) {
      console.log('Updating LLM configuration...');
      const llmResponse = await fetch(`https://api.retellai.com/update-retell-llm/${updatedAgent.response_engine.llm_id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${retellApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          general_prompt: data.response_engine.system_prompt,
          general_tools: data.response_engine.functions?.map((func: any) => ({
            type: func.name.toLowerCase().replace(/_/g, '-'),
            name: func.name,
            description: func.description,
            parameters: func.parameters
          }))
        }),
      });

      if (!llmResponse.ok) {
        const errorText = await llmResponse.text();
        console.error('Retell LLM API error:', errorText);
        return NextResponse.json(
          { error: `Failed to update LLM configuration: ${llmResponse.statusText}`, details: errorText },
          { status: llmResponse.status }
        );
      }
    }

    return NextResponse.json(updatedAgent);
  } catch (error: any) {
    console.error('Error in PATCH /api/agents/[agentId]:', error);
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: { agentId: string } }
) {
  try {
    const agentId = params.agentId;
    console.log('Checking Retell API configuration...');
    console.log('Agent ID:', agentId);
    
    let retellApiKey;
    try {
      retellApiKey = await getRetellApiKey();
    } catch (error) {
      console.error('Failed to get Retell API key:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to get API key' },
        { status: 500 }
      );
    }

    console.log(`Fetching details for agent: ${agentId}`);
    try {
      // Get agent details using the exact endpoint format from Retell API
      const agentResponse = await fetch(`https://api.retellai.com/get-agent/${agentId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${retellApiKey}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });

      if (!agentResponse.ok) {
        const errorText = await agentResponse.text();
        console.error('Agent API error:', errorText);
        return NextResponse.json(
          { error: `Failed to fetch agent: ${agentResponse.statusText}`, details: errorText },
          { status: agentResponse.status }
        );
      }

      const agent = await agentResponse.json();
      console.log('Agent retrieved:', agent);

      if (!agent.response_engine?.llm_id) {
        console.error('Agent has no LLM ID');
        return NextResponse.json(
          { error: 'Agent has no associated LLM' },
          { status: 404 }
        );
      }

      // Get LLM details using the exact endpoint format from Retell API
      console.log(`Fetching LLM details for ID: ${agent.response_engine.llm_id}`);
      const llmResponse = await fetch(`https://api.retellai.com/get-retell-llm/${agent.response_engine.llm_id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${retellApiKey}`,
          'Content-Type': 'application/json',
        },
        cache: 'no-store'
      });

      if (!llmResponse.ok) {
        const errorText = await llmResponse.text();
        console.error('LLM API error:', errorText);
        return NextResponse.json(
          { error: `Failed to fetch LLM details: ${llmResponse.statusText}`, details: errorText },
          { status: llmResponse.status }
        );
      }

      const llm = await llmResponse.json();
      console.log('LLM retrieved:', llm);

      // Return the agent data directly since it already has the correct format
      return NextResponse.json(agent);
      
    } catch (error: any) {
      console.error(`Error fetching agent ${agentId}:`, error);
      console.error('Error details:', {
        message: error.message,
        status: error.status,
        stack: error.stack
      });
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch agent details',
          details: error.message
        },
        { status: error.status || 500 }
      );
    }
  } catch (error: any) {
    console.error('Error in GET /api/agents/[agentId]:', error);
    return NextResponse.json(
      { 
        error: error.message || 'An unexpected error occurred',
        details: error.stack
      },
      { status: error.status || 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { agentId: string } }
) {
  try {
    let retellApiKey;
    try {
      retellApiKey = await getRetellApiKey();
    } catch (error) {
      console.error('Failed to get Retell API key:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to get API key' },
        { status: 500 }
      );
    }

    const response = await fetch(
      `https://api.retellai.com/delete-agent/${params.agentId}`,
      {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${retellApiKey}`,
        },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error deleting agent:', errorText);
      return NextResponse.json(
        { error: `Failed to delete agent: ${response.statusText}` },
        { status: response.status }
      );
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting agent:', error);
    return NextResponse.json(
      { error: 'Failed to delete agent' },
      { status: 500 }
    );
  }
}
