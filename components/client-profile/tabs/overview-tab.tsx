import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ClientProfile, formatters, CompanyInfo } from "@/app/types/client-profile"
import { Phone, Mail, MapPin, Building2 } from 'lucide-react'

// Helper pour parser la company string en objet si possible
const parseCompanyInfo = (companyString?: string): CompanyInfo | null => {
  if (!companyString) return null;
  try {
    // Tente de parser si c'est un JSON
    return JSON.parse(companyString) as CompanyInfo;
  } catch {
    // Si ce n'est pas du JSON, retourne un objet simple
    return { name: companyString };
  }
}

export function ClientOverviewTab({ client }: { client: ClientProfile }) {
  const companyInfo = parseCompanyInfo(client.company);

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

      {companyInfo && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Entreprise</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{companyInfo.name}</div>
            <p className="text-xs text-muted-foreground">
              {companyInfo.industry || 'Secteur non spécifié'}
            </p>
          </CardContent>
        </Card>
      )}

      {companyInfo?.website && (
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
            <p className="text-xs text-muted-foreground">
              {companyInfo.linkedin && 'Voir aussi sur LinkedIn'}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
} 