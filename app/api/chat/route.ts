import { createClient } from '@/utils/supabase/server'
import { StreamingTextResponse, Message } from 'ai'
import { togetherAI, TOGETHER_MODEL } from '@/lib/together-ai'
import { cookies } from 'next/headers'

export async function POST(req: Request) {
  const supabase = createClient(cookies())
  const { messages, conversationId } = await req.json()

  const { data: { user }, error: authError } = await supabase.auth.getUser()
  if (authError || !user) {
    return new Response('Unauthorized', { status: 401 })
  }

  try {
    const stream = await togetherAI.chat.completions.create({
      model: TOGETHER_MODEL,
      messages: messages.map(({ content, role }: Message) => ({
        content,
        role: role === 'user' ? 'user' : 'assistant'
      })),
      stream: true,
      temperature: 0.7,
      max_tokens: 1000
    })

    // Convert OpenAI stream to ReadableStream
    const readableStream = new ReadableStream({
      async start(controller) {
        for await (const chunk of stream) {
          const text = chunk.choices[0]?.delta?.content || ''
          if (text) {
            controller.enqueue(text)
          }
        }
        controller.close()
      }
    })

    // Stockage du message dans Supabase
    if (conversationId) {
      await supabase.from('ai_messages').insert({
        conversation_id: conversationId,
        role: 'user',
        content: messages[messages.length - 1].content,
        user_id: user.id,
        timestamp: new Date().toISOString()
      })
    }

    return new StreamingTextResponse(readableStream)
  } catch (error) {
    console.error('Chat error:', error)
    return new Response('Error processing your request', { status: 500 })
  }
} 