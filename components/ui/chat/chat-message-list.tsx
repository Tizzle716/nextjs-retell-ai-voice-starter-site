import * as React from "react";
import { cn } from "@/lib/utils";
import { Message } from "@/hooks/use-ai-chat";

interface ChatMessageListProps extends React.HTMLAttributes<HTMLDivElement> {
  messages: Message[];
  isLoading?: boolean;
  onScrollTop?: () => void;
  onScrollBottom?: () => void;
}

const ChatMessageList = React.forwardRef<HTMLDivElement, ChatMessageListProps>(
  ({ className, messages, isLoading, onScrollTop, onScrollBottom, ...props }, ref) => {
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      
      if (scrollTop === 0 && onScrollTop) {
        onScrollTop();
      }
      
      if (scrollHeight - scrollTop === clientHeight && onScrollBottom) {
        onScrollBottom();
      }
    };

    return (
      <div
        className={cn(
          "flex flex-col w-full h-full p-4 gap-6 overflow-y-auto",
          className,
        )}
        ref={ref}
        onScroll={handleScroll}
        {...props}
      >
        {messages.map((message) => (
          <div key={message.id} className={cn(
            "flex",
            message.role === "assistant" ? "justify-start" : "justify-end"
          )}>
            <div className={cn(
              "max-w-[80%] rounded-lg p-4",
              message.role === "assistant" 
                ? "bg-muted" 
                : "bg-primary text-primary-foreground"
            )}>
              {message.content}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg p-4 bg-muted animate-pulse">
              <div className="h-4 w-24 bg-muted-foreground/20 rounded" />
            </div>
          </div>
        )}
      </div>
    )
  }
);

ChatMessageList.displayName = "ChatMessageList";

export { ChatMessageList };
