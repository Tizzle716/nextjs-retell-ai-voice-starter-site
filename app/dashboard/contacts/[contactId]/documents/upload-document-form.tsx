"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Schema de validation
const MAX_FILE_SIZE = 5000000 // 5MB
const ACCEPTED_FILE_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
]

const uploadDocumentSchema = z.object({
  title: z.string().min(2, "Title must be at least 2 characters"),
  category: z.string().min(2, "Category is required"),
  subcategory: z.string().optional(),
  file: z
    .custom<File>()
    .refine((file) => file, "File is required")
    .refine((file) => file?.size <= MAX_FILE_SIZE, "Max file size is 5MB")
    .refine(
      (file) => ACCEPTED_FILE_TYPES.includes(file?.type),
      "Only .pdf, .jpg, .png, .doc, .docx files are accepted"
    ),
  contact_id: z.string().uuid()
})

type UploadDocumentFormValues = z.infer<typeof uploadDocumentSchema>

const CATEGORIES = [
  "Contract",
  "Invoice",
  "Proposal",
  "Report",
  "Other"
] as const

interface Contact {
  id: string
  name: string
  email: string
}

interface UploadDocumentFormProps {
  contactId?: string
  contacts?: Contact[]
  onSubmit: (data: UploadDocumentFormValues) => Promise<void>
  onCancel: () => void
}

export function UploadDocumentForm({ 
  contactId, 
  contacts,
  onSubmit, 
  onCancel 
}: UploadDocumentFormProps) {
  const [isLoading, setIsLoading] = useState(false)

  const form = useForm<UploadDocumentFormValues>({
    resolver: zodResolver(uploadDocumentSchema),
    defaultValues: {
      title: "",
      category: "",
      subcategory: "",
      contact_id: contactId || "",
    },
  })

  const handleSubmit = async (values: UploadDocumentFormValues) => {
    try {
      setIsLoading(true)
      await onSubmit(values)
      form.reset()
    } catch (error) {
      console.error("Error uploading document:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        {contacts && (
          <FormField
            control={form.control}
            name="contact_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contact</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a contact" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {contacts.map((contact) => (
                      <SelectItem key={contact.id} value={contact.id}>
                        {contact.name} ({contact.email})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input placeholder="Document title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {CATEGORIES.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="subcategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Subcategory (optional)</FormLabel>
              <FormControl>
                <Input placeholder="Subcategory" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem>
              <FormLabel>File</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept={ACCEPTED_FILE_TYPES.join(",")}
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      field.onChange(file)
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-2">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      </form>
    </Form>
  )
}