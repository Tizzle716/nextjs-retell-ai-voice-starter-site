import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientProfile, formatters } from "@/app/types/client-profile"
import { Phone, Mail, MapPin, Building2 } from 'lucide-react'
import { getCompanyInfo } from "@/utils/company"

export function ClientOverviewTab({ client }: { client: ClientProfile }) {
  const companyInfo = getCompanyInfo(client.company)

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
            Dernière mise à jour: {formatters.formatDate(client.updated_at)}
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
            Contact principal
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
            <div className="text-2xl font-bold">{companyInfo.name}</div>
            {companyInfo.industry && (
              <p className="text-xs text-muted-foreground">
                {companyInfo.industry}
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {companyInfo.website && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Site Web</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold truncate">
              <a 
                href={companyInfo.website} 
                target="_blank" 
                rel="noopener noreferrer"
                className="hover:underline"
              >
                {companyInfo.website}
              </a>
            </div>
            {companyInfo.linkedin && (
              <p className="text-xs text-muted-foreground">
                Voir aussi sur LinkedIn
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
} 