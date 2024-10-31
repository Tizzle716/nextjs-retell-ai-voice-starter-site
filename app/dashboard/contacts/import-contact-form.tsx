import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"
import { Contact } from "@/app/types/contact"
import { parse } from 'csv-parse/sync'

// Définition du schéma pour le formulaire d'import
const formSchema = z.object({
  file: z.instanceof(File).refine((file) => file.size <= 5000000, {
    message: "File size should be less than 5MB.",
  }),
})

interface ImportContactFormProps {
  onSubmit: (contacts: Partial<Contact>[]) => Promise<void>
  onCancel: () => void
}

// Schéma de validation pour les données CSV
const csvContactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  status: z.enum(["Lead", "Prospect", "Client"]),
  type: z.string().optional(),
  tags: z.array(z.string()).optional(),
  score: z.number().optional(),
  provider: z.object({
    site: z.string().url().optional(),
    funnel: z.string().optional(),
    call: z.string().optional(),
    vip: z.boolean().optional(),
  }).optional(),
  comments: z.string().optional(),
})

export function ImportContactForm({ onSubmit, onCancel }: ImportContactFormProps) {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      const fileContent = await readFileContent(values.file)
      const parsedContacts = parseCSV(fileContent)
      
      // Validate each contact
      const validatedContacts = parsedContacts.map((contact: Partial<Contact>) => {
        const validated = csvContactSchema.parse(contact)
        return {
          ...validated,
          dateJoined: new Date().toISOString(),
          notifications: {
            lastInteraction: null,
            history: [],
          },
          interactions: [],
        }
      })
      
      await onSubmit(validatedContacts)
      form.reset()
      onCancel()
      
      toast({
        title: "Success",
        description: `${validatedContacts.length} contacts imported successfully`,
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Validation Error",
          description: "The CSV file contains invalid data. Please check the format.",
          variant: "destructive",
        })
      } else {
        toast({
          title: "Import Error",
          description: "Failed to import contacts. Please try again.",
          variant: "destructive",
        })
      }
      console.error(error)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Import CSV File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".csv"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>
              <FormDescription>
                Upload a CSV file with the following headers: name, email, phone, status, type, tags, score, provider_site, provider_funnel, provider_call, provider_vip, comments
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Import Contacts</Button>
        </div>
      </form>
    </Form>
  )
}

// Helper function to read file content
async function readFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (event) => resolve(event.target?.result as string)
    reader.onerror = (error) => reject(error)
    reader.readAsText(file)
  })
}

function parseCSV(content: string): Partial<Contact>[] {
  const records = parse(content, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
  })
  
  interface CSVRecord {
    name: string
    email: string
    phone: string
    status: string
    type?: string
    tags?: string
    score?: string
    provider_site?: string
    provider_funnel?: string
    provider_call?: string
    provider_vip?: string
    comments?: string
  }
  
  return records.map((record: CSVRecord) => ({
    name: record.name,
    email: record.email,
    phone: record.phone,
    status: record.status as "Lead" | "Prospect" | "Client",
    type: record.type,
    tags: record.tags?.split(',').map((tag: string) => tag.trim()) || [],
    score: record.score ? parseInt(record.score) : undefined,
    provider: {
      site: record.provider_site,
      funnel: record.provider_funnel,
      call: record.provider_call,
      vip: record.provider_vip === 'true',
    },
    comments: record.comments,
  }))
}
