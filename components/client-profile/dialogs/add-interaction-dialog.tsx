import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Interaction, interactionSchema } from "@/app/types/interaction"
import { z } from "zod"

const formSchema = interactionSchema.omit({ 
  id: true, 
  contact_id: true, 
  created_at: true, 
  updated_at: true 
}).extend({
  metadataText: z.string().optional()
})

type FormData = z.infer<typeof formSchema>

interface AddInteractionDialogProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: Partial<Interaction>) => Promise<void>
}

export function AddInteractionDialog({ isOpen, onClose, onSubmit }: AddInteractionDialogProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      type: "Appel Sortant",
      date: new Date().toISOString(),
      duration: undefined,
      score: undefined,
      metadataText: "{}"
    }
  })

  const handleSubmit = async (data: FormData) => {
    try {
      let metadata: Record<string, unknown> | undefined
      try {
        metadata = data.metadataText ? JSON.parse(data.metadataText) : undefined
      } catch {
        form.setError("metadataText", {
          type: "manual",
          message: "Format JSON invalide"
        })
        return
      }

      const formattedData = {
        ...data,
        duration: data.duration ? Number(data.duration) : undefined,
        score: data.score ? Number(data.score) : undefined,
        metadata
      }

      await onSubmit(formattedData)
      form.reset()
      onClose()
    } catch (error) {
      console.error('Error submitting interaction:', error)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Ajouter une interaction</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez un type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Appel Sortant">Appel Sortant</SelectItem>
                      <SelectItem value="Appel Entrant">Appel Entrant</SelectItem>
                      <SelectItem value="Email Entrant">Email Entrant</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="duration"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Durée (minutes)</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value ? Number(e.target.value) : undefined
                        field.onChange(value)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="score"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Score</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      min="0" 
                      max="100" 
                      {...field}
                      onChange={(e) => {
                        const value = e.target.value ? Number(e.target.value) : undefined
                        field.onChange(value)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="metadataText"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Metadata (JSON)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='{
  "commentaire": "Appel très positif",
  "intérêt": "élevé",
  "rappel": "dans 2 jours"
}'
                      className="font-mono"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end space-x-2">
              <Button type="button" variant="outline" onClick={onClose}>
                Annuler
              </Button>
              <Button type="submit">
                Ajouter
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}