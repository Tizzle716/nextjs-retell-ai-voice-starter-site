"use client"

import { ColumnDef } from "@tanstack/react-table"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Contact, Provider } from "@/app/types/contact"

export const columns: ColumnDef<Contact>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => {
      const contact = row.original
      return (
        <div className="flex items-center">
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={`https://api.dicebear.com/6.x/initials/svg?seed=${contact.name}`} />
            <AvatarFallback>{contact.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          {contact.name}
        </div>
      )
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "phone",
    header: "Phone",
  },
  {
    accessorKey: "dateJoined",
    header: "Date Joined",
    cell: ({ row }) => new Date(row.getValue("dateJoined")).toLocaleDateString(),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as Contact['status']
      return (
        <Badge variant={status === "Lead" ? "default" : status === "Prospect" ? "secondary" : "outline"}>
          {status}
        </Badge>
      )
    },
  },
  {
    accessorKey: "score",
    header: "Score",
    cell: ({ row }) => {
      const score = row.getValue("score") as number
      return (
        <div className="flex items-center">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
            <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${score}%` }}></div>
          </div>
          <span>{score}</span>
        </div>
      )
    },
  },
  {
    accessorKey: "type",
    header: "Type",
  },
  {
    accessorKey: "lastInteraction",
    header: "Last Interaction",
    cell: ({ row }) => {
      const lastInteraction = row.original.notifications?.lastInteraction
      
      if (!lastInteraction) {
        return <div className="text-muted-foreground">No interaction yet</div>
      }

      return (
        <div className="space-y-1">
          <div className="text-sm font-medium">{lastInteraction.type}</div>
          <div className="text-xs text-muted-foreground">
            {new Date(lastInteraction.date).toLocaleDateString()}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "provider.site",
    header: "Provider Site",
  },
  {
    accessorKey: "provider.vip",
    header: "VIP",
    cell: ({ row }) => {
      const provider = row.original.provider
      return provider?.vip ? "Yes" : "No"
    },
  },
  {
    accessorKey: "comments",
    header: "Comments",
    cell: ({ row }) => (
      <div className="max-w-xs truncate">{row.original.comments}</div>
    ),
  },
  {
    accessorKey: "provider",
    header: "Provider",
    cell: ({ row }) => {
      const providerData = row.original.provider as (Provider | null)
      
      return (
        <div className="space-y-1">
          <div className="text-sm">
            {providerData?.site || "NO"}
          </div>
          <div className="text-xs text-muted-foreground">
            {providerData?.funnel || "NO"}
          </div>
        </div>
      )
    }
  },
  {
    accessorKey: "tags",
    header: "Tags",
    cell: ({ row }) => {
      const tags: string[] = row.original.tags || []
      return (
        <div className="flex flex-wrap gap-1">
          {tags.map((tag: string) => (
            <Badge 
              key={tag} 
              variant="secondary"
              className="text-xs"
            >
              {tag}
            </Badge>
          ))}
        </div>
      )
    },
    filterFn: (row, id, value: string[]) => {
      const tags: string[] = row.original.tags || []
      return value.length === 0 || value.some((tag: string) => tags.includes(tag))
    },
  },
]
