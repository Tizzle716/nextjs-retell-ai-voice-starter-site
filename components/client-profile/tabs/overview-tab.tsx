import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientProfile, formatters } from "@/app/types/client-profile"
import { Phone, Mail, MapPin, Building2 } from 'lucide-react'

export function ClientOverviewTab({ client }: { client: ClientProfile }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Contact</CardTitle>
          <Phone className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{client.phone || 'Non renseigné'}</div>
          <p className="text-xs text-muted-foreground">
            {client.notifications?.lastInteraction && 
              `Dernier contact: ${formatters.formatDate(client.notifications.lastInteraction.date)}`
            }
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Email</CardTitle>
          <Mail className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{client.email}</div>
          <p className="text-xs text-muted-foreground">
            {client.notifications?.lastInteraction?.type === "Email Entrant" && 
              `Dernier email: ${formatters.formatDate(client.notifications.lastInteraction.date)}`
            }
          </p>
        </CardContent>
      </Card>

      {client.company && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entreprise</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{client.company.name}</div>
            <p className="text-xs text-muted-foreground">
              {client.company.industry || 'Secteur non spécifié'}
            </p>
          </CardContent>
        </Card>
      )}

      {client.company?.website && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Site Web</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              <a 
                href={client.company.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {new URL(client.company.website).hostname}
              </a>
            </div>
            <p className="text-xs text-muted-foreground">
              {client.company.linkedin && 'Voir aussi sur LinkedIn'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 