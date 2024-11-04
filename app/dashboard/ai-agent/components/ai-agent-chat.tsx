"use client"

import { useRef } from "react"
import { ChatBubble, ChatBubbleAvatar, ChatBubbleMessage } from "@/components/ui/chat/chat-bubble"
import { ChatInput } from "@/components/ui/chat/chat-input"
import { Button } from "@/components/ui/button"
import { Paperclip, Mic, CornerDownLeft } from "lucide-react"
import { useAIChat } from "@/hooks/use-ai-chat"

export function AIAgentChat() {
  const { messages, isLoading, sendMessage } = useAIChat()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] border rounded-lg bg-background">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            variant={message.role === "user" ? "sent" : "received"}
            layout={message.role === "assistant" ? "ai" : "default"}
          >
            {message.role === "assistant" && (
              <ChatBubbleAvatar
                src="/ai-avatar.png"
                fallback="AI"
              />
            )}
            <ChatBubbleMessage>
              {message.content}
            </ChatBubbleMessage>
          </ChatBubble>
        ))}
        {isLoading && (
          <ChatBubble variant="received" layout="ai">
            <ChatBubbleAvatar
              src="/ai-avatar.png"
              fallback="AI"
            />
            <ChatBubbleMessage isLoading />
          </ChatBubble>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="p-4 border-t">
        <form
          className="relative rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring p-1"
          onSubmit={(e) => {
            e.preventDefault()
            const input = e.currentTarget.querySelector('textarea')
            if (input?.value) {
              sendMessage(input.value)
              input.value = ""
            }
          }}
        >
          <ChatInput
            placeholder="Type your message..."
            className="min-h-12 resize-none rounded-lg bg-background border-0 p-3 shadow-none focus-visible:ring-0"
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault()
                sendMessage(e.currentTarget.value)
                e.currentTarget.value = ""
              }
            }}
          />
          <div className="flex items-center p-3 pt-0">
            <Button variant="ghost" size="icon" type="button">
              <Paperclip className="size-4" />
              <span className="sr-only">Attach file</span>
            </Button>

            <Button variant="ghost" size="icon" type="button">
              <Mic className="size-4" />
              <span className="sr-only">Use Microphone</span>
            </Button>

            <Button
              type="submit"
              size="sm"
              className="ml-auto gap-1.5"
            >
              Send Message
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
} 