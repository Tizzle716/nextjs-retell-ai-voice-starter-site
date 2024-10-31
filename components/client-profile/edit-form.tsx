import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { clientProfileSchema } from "@/utils/validation"
import { Button } from "@/components/ui/button"
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ClientProfile } from "@/app/types/client-profile"

type ClientProfileEditFormProps = {
  client: ClientProfile
  onSubmit: (data: ClientProfile) => Promise<void>
}

export function ClientProfileEditForm({ client, onSubmit }: ClientProfileEditFormProps) {
  const form = useForm<ClientProfile>({
    resolver: zodResolver(clientProfileSchema),
    defaultValues: client
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nom</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        {/* Add other form fields */}
        <Button type="submit">Enregistrer</Button>
      </form>
    </Form>
  )
} 