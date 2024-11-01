import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Phone, Mail, Edit } from 'lucide-react'
import { ClientProfile } from "@/app/types/client-profile"

interface ClientHeaderProps {
  client: ClientProfile
  onEdit: () => void
}

export function ClientHeader({ client, onEdit }: ClientHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <div className="flex items-center space-x-4">
        <Avatar className="h-20 w-20">
          <AvatarImage src={`/placeholder.svg?height=80&width=80`} alt={client.name} />
          <AvatarFallback>{client.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-3xl font-bold">{client.name}</h1>
          {client.company && (
            <p className="text-xl text-muted-foreground">{client.company.name}</p>
          )}
          <div className="flex space-x-2 mt-2">
            <Badge>{client.status}</Badge>
            {client.notifications?.lastInteraction?.score && (
              <Badge variant="outline">
                Score: {client.notifications.lastInteraction.score}
              </Badge>
            )}
            {client.company?.industry && (
              <Badge variant="secondary">{client.company.industry}</Badge>
            )}
          </div>
        </div>
      </div>
      <div className="space-x-2">
        <Button variant="outline" onClick={onEdit}>
          <Edit className="mr-2 h-4 w-4" /> Modifier
        </Button>
        {client.phone && (
          <Button variant="outline">
            <Phone className="mr-2 h-4 w-4" /> Appeler
          </Button>
        )}
        {client.email && (
          <Button>
            <Mail className="mr-2 h-4 w-4" /> Envoyer un email
          </Button>
        )}
      </div>
    </div>
  )
} 