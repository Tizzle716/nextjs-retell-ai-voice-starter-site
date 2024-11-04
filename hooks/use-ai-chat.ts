import { useState, useEffect } from "react"
import { createClient } from '@/utils/supabase/client'

export interface Message {
  id: string
  role: "user" | "assistant"
  content: string
  timestamp: string
  conversation_id?: string
}

export function useAIChat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [conversationId, setConversationId] = useState<string>()
  const supabase = createClient()

  useEffect(() => {
    const loadMessages = async () => {
      if (!conversationId) return
      
      const { data, error } = await supabase
        .from('ai_messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('timestamp', { ascending: true })

      if (data && !error) {
        setMessages(data)
      }
    }

    loadMessages()
  }, [conversationId, supabase])

  const sendMessage = async (content: string) => {
    if (!content.trim()) return

    const newMessage: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content,
      timestamp: new Date().toISOString(),
      conversation_id: conversationId
    }

    setMessages(prev => [...prev, newMessage])
    setIsLoading(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          messages: [...messages, newMessage],
          conversationId 
        }),
      })

      if (!response.ok) throw new Error('Failed to send message')

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      let assistantMessage = ''

      while (reader) {
        const { done, value } = await reader.read()
        if (done) break
        
        assistantMessage += decoder.decode(value)
        setMessages(prev => [
          ...prev.slice(0, -1),
          {
            id: crypto.randomUUID(),
            role: "assistant",
            content: assistantMessage,
            timestamp: new Date().toISOString(),
            conversation_id: conversationId
          }
        ])
      }

    } catch (error) {
      console.error("Error sending message:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const createNewConversation = async () => {
    const { data, error } = await supabase
      .from('ai_conversations')
      .insert([{ created_at: new Date().toISOString() }])
      .select()
      .single()

    if (data && !error) {
      setConversationId(data.id)
    }
  }

  return {
    messages,
    isLoading,
    sendMessage,
    createNewConversation
  }
}