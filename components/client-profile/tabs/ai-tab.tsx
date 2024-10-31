import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Brain, TrendingUp, AlertCircle } from "lucide-react"

export function ClientAITab() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Brain className="h-5 w-5 mr-2" />
            Analyse IA
          </CardTitle>
          <CardDescription>
            Cette fonctionnalité sera bientôt disponible
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center">
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Probabilité de conversion
                </h4>
                <div className="text-2xl font-bold">
                  --
                </div>
              </div>
              
              <div className="p-4 border rounded-lg">
                <h4 className="font-semibold mb-2 flex items-center">
                  <AlertCircle className="h-4 w-4 mr-2" />
                  Points d&apos;attention
                </h4>
                <div className="space-y-2">
                  <Badge variant="outline" className="mr-2">
                    En développement
                  </Badge>
                </div>
              </div>
            </div>

            <div className="mt-6">
              <h4 className="font-semibold mb-2">Recommandations</h4>
              <p className="text-muted-foreground">
                Les recommandations IA seront disponibles prochainement.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Historique IA</CardTitle>
        </CardHeader>
        <CardContent>
          <Button disabled className="w-full">
            Générer recommandations (Bientôt disponible)
          </Button>
        </CardContent>
      </Card>
    </div>
  )
} 