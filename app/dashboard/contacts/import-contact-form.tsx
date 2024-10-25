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
import { toast } from "@/hooks/use-toast"
import { Contact } from "@/app/types/contact"

// Define the Zod schema for a single contact
const contactSchema: z.ZodType<Omit<Contact, "id">> = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  dateJoined: z.string().datetime(),
  status: z.enum(["Lead", "Prospect", "Client"]),
  score: z.number().int().min(0).max(100),
  type: z.string(),
  notifications: z.object({
    lastInteraction: z.object({
      type: z.enum(["Appel Sortant", "Appel Entrant", "Email Entrant"]),
      date: z.string().datetime(),
      duration: z.number().optional(),
      score: z.number().int().min(0).max(100),
    }),
    history: z.array(z.object({
      type: z.enum(["Appel Sortant", "Appel Entrant", "Email Entrant"]),
      date: z.string().datetime(),
      duration: z.number().optional(),
      score: z.number().int().min(0).max(100),
    })),
  }),
  provider: z.object({
    site: z.string().url("Invalid URL"),
    funnel: z.string(),
    call: z.string(),
    vip: z.boolean(),
  }),
  comments: z.string(),
})

const formSchema = z.object({
  file: z.instanceof(File).refine((file) => file.size <= 5000000, {
    message: "File size should be less than 5MB.",
  }),
})

export function ImportContactForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const fileContent = await readFileContent(values.file);
      const contacts = parseFileContent(fileContent);
      
      // Validate each contact using the Zod schema
      const validatedContacts = contacts.map(contact => contactSchema.parse(contact));
      
      // TODO: Send validated contacts to the server for import
      console.log(validatedContacts);
      
      toast({
        title: "Contacts imported successfully",
        description: `${validatedContacts.length} contacts have been imported.`,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        toast({
          title: "Import failed",
          description: "Some contacts failed validation. Please check your file and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Import failed",
          description: "An error occurred while importing contacts. Please try again.",
          variant: "destructive",
        });
      }
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Import Contacts</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept=".csv,.xlsx"
                  onChange={(e) => field.onChange(e.target.files?.[0])}
                />
              </FormControl>
              <FormDescription>
                Upload a CSV or Excel file containing contact information.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Import</Button>
      </form>
    </Form>
  )
}

// Helper function to read file content
async function readFileContent(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
}

// Helper function to parse file content (you'll need to implement this based on your file format)
function parseFileContent(content: string): Partial<Contact>[] {
  // TODO: Implement parsing logic for CSV or Excel file
  // This should return an array of objects that match the Contact interface
  console.log("Parsing content:", content);
  return [];
}
