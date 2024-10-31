import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"

interface ErrorHandlerProps {
  error: Error | null
  resetError?: () => void
}

export function ErrorHandler({ error, resetError }: ErrorHandlerProps) {
  if (!error) return null

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Erreur</AlertTitle>
      <AlertDescription>
        {error.message}
        {resetError && (
          <button
            onClick={resetError}
            className="underline ml-2"
          >
            Réessayer
          </button>
        )}
      </AlertDescription>
    </Alert>
  )
} 