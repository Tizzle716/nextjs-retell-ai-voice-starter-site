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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Contact } from "@/app/types/contact"
import { User, Phone, Mail, Star, Type, Globe, Fuel, PhoneCall, MessageSquare } from "lucide-react"

const formSchema = z.object({
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
  score: z.number().int().min(0).max(100),
  type: z.string(),
  provider: z.object({
    site: z.string().url({
      message: "Please enter a valid URL.",
    }),
    funnel: z.string(),
    call: z.string(),
    vip: z.boolean(),
  }),
  comments: z.string(),
})

export function AddContactForm() {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      status: "Lead",
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

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const newContact: Omit<Contact, "id" | "notifications"> = {
      ...values,
      dateJoined: new Date().toISOString(),
    }
    
    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newContact),
      })

      if (!response.ok) {
        throw new Error('Failed to add contact')
      }

      await response.json()
      toast({
        title: "Contact added successfully",
        description: "The new contact has been added to the database.",
      })
    } catch (error: unknown) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add the contact. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Basic Information</h3>
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
          </div>
          
          <div className="space-y-6">
            <h3 className="text-lg font-semibold">Contact Details</h3>
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
                      <Input type="number" min={0} max={100} className="pl-8" {...field} onChange={e => field.onChange(parseInt(e.target.value))} />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Provider Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            
            <FormField
              control={form.control}
              name="provider.vip"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">VIP Status</FormLabel>
                    <FormDescription>
                      Is this contact a VIP?
                    </FormDescription>
                  </div>
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
        </div>
        
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Additional Information</h3>
          <FormField
            control={form.control}
            name="comments"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comments</FormLabel>
                <FormControl>
                  <div className="relative">
                    <MessageSquare className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
                    <Textarea placeholder="Additional comments" className="pl-8 min-h-[100px]" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit" className="w-full md:w-auto">Add Contact</Button>
      </form>
    </Form>
  )
}
