import * as React from "react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// On peut soit supprimer l'interface si on n'a pas de props supplémentaires
type ChatInputProps = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

// Ou ajouter des props spécifiques si nécessaire
// interface ChatInputProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
//   onSend?: (message: string) => void;
//   isLoading?: boolean;
// }

const ChatInput = React.forwardRef<HTMLTextAreaElement, ChatInputProps>(
  ({ className, ...props }, ref) => (
    <Textarea
      autoComplete="off"
      ref={ref}
      name="message"
      className={cn(
        "max-h-12 px-4 py-3 bg-background text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 w-full rounded-md flex items-center h-16 resize-none",
        className,
      )}
      {...props}
    />
  ),
);
ChatInput.displayName = "ChatInput";

export { ChatInput };
