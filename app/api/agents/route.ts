import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

interface Agent {
  agent_id: string;
  name: string;
  voice_id: string;
  initial_message?: string;
  webhook_url?: string;
  end_conversation_message?: string;
  allow_agent_human_handoff?: boolean;
  response_engine?: {
    type: string;
    llm_id: string;
    llm_websocket_url?: string;
    system_prompt?: string;
  };
  is_selected?: boolean;
}

async function getRetellApiKey() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    console.error('[Agents API] User authentication error:', userError);
    throw new Error('Unauthorized');
  }

  console.log('[Agents API] Fetching API key for user:', user.id);
  const { data: settings, error: settingsError } = await supabase
    .from('api_settings')
    .select('retell_api_key')
    .eq('user_id', user.id)
    .single();

  if (settingsError) {
    console.error('[Agents API] Settings fetch error:', settingsError);
    throw new Error('Failed to fetch API settings');
  }

  if (!settings?.retell_api_key) {
    console.error('[Agents API] No Retell API key found in settings');
    throw new Error('Retell API key not configured');
  }

  console.log('[Agents API] Successfully retrieved API key');
  return settings.retell_api_key;
}

export async function GET() {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get Retell API key
    let retellApiKey;
    try {
      retellApiKey = await getRetellApiKey();
    } catch (error) {
      console.error('[Agents API] Failed to get Retell API key:', error);
      return NextResponse.json(
        { error: error instanceof Error ? error.message : 'Failed to get API key' },
        { status: 500 }
      );
    }

    // Fetch agents from Retell
    console.log('[Agents API] Fetching agents from Retell...');
    const retellResponse = await fetch('https://api.retellai.com/list-agents', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${retellApiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!retellResponse.ok) {
      throw new Error(`Failed to fetch agents from Retell: ${retellResponse.statusText}`);
    }

    const retellAgents = await retellResponse.json();
    console.log('[Agents API] Retrieved agents from Retell:', {
      count: retellAgents.length,
      agents: retellAgents.map((a: { agent_id: string; name?: string; agent_name?: string }) => ({
        id: a.agent_id,
        name: a.name || a.agent_name || 'AI Assistant'
      }))
    });

    // Create agents table if it doesn't exist
    const { error: createTableError } = await supabase.rpc('create_agents_table_if_not_exists');
    if (createTableError) {
      console.error('[Agents API] Error creating table:', createTableError);
      // Continue anyway as the table might already exist
    }

    // Get existing agents to preserve selection state
    const { data: existingAgents } = await supabase
      .from('agents')
      .select('agent_id, is_selected')
      .eq('user_id', user.id);

    const existingSelections = new Map(
      existingAgents?.map((a: { agent_id: string; is_selected: boolean }) => [a.agent_id, a.is_selected]) || []
    );

    // Upsert agents into our database
    const agentsToUpsert = retellAgents.map((agent: { agent_id: string; name?: string; agent_name?: string; voice_id?: string; language?: string }) => {
      // Generate a display name for the agent
      const displayName = agent.name || agent.agent_name || `AI Assistant ${agent.agent_id.slice(-6)}`;
      
      return {
        user_id: user.id,
        agent_id: agent.agent_id,
        agent_name: displayName,
        voice_id: agent.voice_id || 'eleven_multilingual_v2',
        language: agent.language || 'english',
        is_selected: existingSelections.get(agent.agent_id) || false // Preserve existing selection
      };
    });

    console.log('[Agents API] Upserting agents:', {
      count: agentsToUpsert.length,
      agents: agentsToUpsert.map((a: { agent_id: string; agent_name: string; voice_id: string; is_selected: boolean }) => ({
        id: a.agent_id,
        name: a.agent_name,
        voice: a.voice_id,
        selected: a.is_selected
      }))
    });

    const { error: upsertError } = await supabase
      .from('agents')
      .upsert(agentsToUpsert, {
        onConflict: 'user_id,agent_id',
        ignoreDuplicates: false
      });

    if (upsertError) {
      console.error('[Agents API] Error upserting agents:', upsertError);
      throw upsertError;
    }

    // Get agents from our database
    const { data: agents, error: fetchError } = await supabase
      .from('agents')
      .select('*')
      .eq('user_id', user.id);

    if (fetchError) {
      console.error('[Agents API] Error fetching agents:', fetchError);
      throw fetchError;
    }

    return NextResponse.json(agents);
  } catch (error) {
    console.error('[Agents API] Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { agent_id } = body;

    console.log('[Agents API] Selecting agent:', agent_id);

    // First, unselect all agents
    const { error: unselectError } = await supabase
      .from('agents')
      .update({ is_selected: false })
      .eq('user_id', user.id);

    if (unselectError) {
      console.error('[Agents API] Error unselecting agents:', unselectError);
      return NextResponse.json({ error: 'Failed to update agent selection' }, { status: 500 });
    }

    // Then select the specified agent
    const { data: selectedAgent, error: updateError } = await supabase
      .from('agents')
      .update({ is_selected: true })
      .eq('agent_id', agent_id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (updateError) {
      console.error('[Agents API] Error updating agent:', updateError);
      return NextResponse.json({ error: 'Failed to update agent' }, { status: 500 });
    }

    console.log('[Agents API] Successfully selected agent:', {
      id: selectedAgent.agent_id,
      name: selectedAgent.agent_name,
      voice: selectedAgent.voice_id
    });

    // First get existing settings
    const { data: existingSettings } = await supabase
      .from('api_settings')
      .select('*')
      .eq('user_id', user.id)
      .single();

    // Update agent settings in settings table
    console.log('[Agents API] Updating agent settings:', {
      id: selectedAgent.agent_id,
      voice: selectedAgent.voice_id,
      language: selectedAgent.language
    });

    const settingsData = {
      user_id: user.id,
      retell_api_key: existingSettings?.retell_api_key || null,
      cal_api_key: existingSettings?.cal_api_key || null,
      cal_event_type_id: existingSettings?.cal_event_type_id || null,
      agent_settings: {
        agent_id: selectedAgent.agent_id,
        voice_id: selectedAgent.voice_id,
        language: selectedAgent.language || 'english',
        is_selected: true
      },
      updated_at: new Date().toISOString()
    };

    const { error: settingsError } = await supabase
      .from('api_settings')
      .upsert(settingsData, {
        onConflict: 'user_id',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (settingsError) {
      console.error('[Agents API] Error updating settings:', settingsError);
      // Don't return error since agent selection was successful
      console.warn('[Agents API] Failed to update settings but agent was selected');
    } else {
      console.log('[Agents API] Successfully updated settings');
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('[Agents API] Unexpected error:', error);
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const url = new URL(request.url);
    const agentId = url.pathname.split('/').pop();
    
    if (!agentId) {
      return NextResponse.json({ error: 'Agent ID is required' }, { status: 400 });
    }

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

    const data = await request.json();
    
    try {
      const response = await fetch(`https://api.retellai.com/update-agent/${agentId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${retellApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to update agent: ${errorText}`);
      }

      const result = await response.json() as Agent;
      return NextResponse.json(result);
    } catch (error: any) {
      console.error('[Agents API] Error updating agent:', error);
      return NextResponse.json(
        { error: error.message || 'Failed to update agent' },
        { status: error.status || 500 }
      );
    }
  } catch (error: any) {
    console.error('[Agents API] Error updating agent:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to update agent' },
      { status: error.status || 500 }
    );
  }
}
