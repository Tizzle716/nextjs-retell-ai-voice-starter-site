import { createClient } from '@/utils/supabase/server'
import { StreamingTextResponse } from 'ai'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const supabase = createClient(cookies())
  const { messages, conversationId } = await req.json()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    // TODO: Replace with Retell AI implementation
    const response = "This chat functionality is currently disabled. Please use the voice call feature instead.";
    
    // Convert to ReadableStream
    const readableStream = new ReadableStream({
      start(controller) {
        controller.enqueue(response);
        controller.close();
      }
    });

    // Store message in Supabase if needed
    if (conversationId) {
      await supabase.from('ai_messages').insert({
        conversation_id: conversationId,
        role: 'user',
        content: messages[messages.length - 1].content,
        user_id: user.id,
        timestamp: new Date().toISOString()
      });
    }

    return new StreamingTextResponse(readableStream);
  } catch (error) {
    console.error('Chat error:', error)
    return new Response('Error processing your request', { status: 500 })
  }
} 