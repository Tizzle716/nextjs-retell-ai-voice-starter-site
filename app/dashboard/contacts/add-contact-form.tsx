import * as React from "react"
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
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Contact } from "@/app/types/contact"
import { User, Phone, Mail, Star, Type, Globe, Fuel, PhoneCall, MessageSquare, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

const defaultTags = [
  "Important",
  "Follow-up",
  "VIP",
  "New",
  "Urgent",
] as const

const formSchema = z.object({
  // Champs obligatoires
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(10, {
    message: "Phone number must be at least 10 digits.",
  }),
  status: z.enum(["Lead", "Prospect", "Client"]),
  
  // Champs optionnels
  tags: z.array(z.string()).default([]),
  score: z.number().int().min(0).max(100).optional(),
  type: z.string().optional(),
  provider: z.object({
    site: z.string().url().optional(),
    funnel: z.string().optional(),
    call: z.string().optional(),
    vip: z.boolean().optional(),
  }).optional(),
  comments: z.string().optional(),
})

export interface AddContactFormProps {
  initialData?: Contact | null
  onSubmit: (data: Partial<Contact>) => Promise<void>
  onCancel: () => void
}

export function AddContactForm({ initialData, onSubmit, onCancel }: AddContactFormProps) {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      phone: "",
      status: "Lead",
      tags: [],
      score: 0,
      type: "",
      provider: {
        site: "",
        funnel: "",
        call: "",
        vip: false,
      },
      comments: "",
    },
  })

  async function handleSubmit(values: z.infer<typeof formSchema>) {
    try {
      await onSubmit({
        ...values,
        dateJoined: new Date().toISOString(),
      })
      form.reset()
      onCancel()
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add the contact",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        {/* Section 1: Informations essentielles */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Essential Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name & Email */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <User className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <Input placeholder="John Doe" className="pl-8" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <Input type="email" placeholder="john@example.com" className="pl-8" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Phone & Status */}
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Phone className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                        <Input type="tel" placeholder="+1234567890" className="pl-8" {...field} />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Lead">Lead</SelectItem>
                        <SelectItem value="Prospect">Prospect</SelectItem>
                        <SelectItem value="Client">Client</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>

        {/* Section 2: Tags et Score */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Classification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="tags"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tags</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      const newTags = [...field.value, value]
                      field.onChange(newTags)
                    }}
                  >
                    <FormControl>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Add tags" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {defaultTags.map((tag) => (
                          <SelectItem
                            key={tag}
                            value={tag.toLowerCase()}
                            disabled={field.value.includes(tag.toLowerCase())}
                          >
                            {tag}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {field.value.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {field.value.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="cursor-pointer flex items-center"
                          onClick={() => {
                            const newTags = field.value.filter((t) => t !== tag)
                            field.onChange(newTags)
                          }}
                        >
                          {tag}
                          <X className="w-3 h-3 ml-1" />
                        </Badge>
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Type</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Type className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                      <Input placeholder="Contact type" className="pl-8" {...field} />
                    </div>
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
                    <div className="relative">
                      <Star className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                      <Input 
                        type="number" 
                        min={0} 
                        max={100} 
                        className="pl-8" 
                        {...field} 
                        onChange={e => field.onChange(parseInt(e.target.value))} 
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Section 3: Provider Information */}
        <div className="space-y-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h3 className="text-lg font-semibold">Provider Information</h3>
            <FormField
              control={form.control}
              name="provider.vip"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2">
                  <FormLabel className="text-sm">VIP Status</FormLabel>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="provider.site"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider Site</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Globe className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                      <Input type="url" placeholder="https://example.com" className="pl-8" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="provider.funnel"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider Funnel</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Fuel className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                      <Input placeholder="Funnel information" className="pl-8" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="provider.call"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provider Call</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <PhoneCall className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                      <Input placeholder="Call information" className="pl-8" {...field} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Section 4: Comments */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold border-b pb-2">Additional Information</h3>
          <FormField
            control={form.control}
            name="comments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comments</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MessageSquare className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Textarea 
                      placeholder="Additional comments" 
                      className="pl-8 min-h-[100px]" 
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">Add Contact</Button>
        </div>
      </form>
    </Form>
  )
}
