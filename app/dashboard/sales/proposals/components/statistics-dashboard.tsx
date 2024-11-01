"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement,
} from "chart.js"
import { Proposal } from "@/app/types/proposal"

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  PointElement
)

interface StatisticsDashboardProps {
  proposals: Proposal[]
}

export function StatisticsDashboard({ proposals }: StatisticsDashboardProps) {
  // Calcul des statistiques
  const totalAmount = proposals.reduce((sum, p) => sum + p.total, 0)
  const averageAmount = totalAmount / proposals.length || 0
  const acceptedProposals = proposals.filter((p) => p.status === "accepted")
  const conversionRate = (acceptedProposals.length / proposals.length) * 100 || 0

  // Données pour le graphique mensuel
  const monthlyData = proposals.reduce((acc, proposal) => {
    const month = new Date(proposal.createdAt).toLocaleString("fr-FR", {
      month: "long",
    })
    acc[month] = (acc[month] || 0) + proposal.total
    return acc
  }, {} as Record<string, number>)

  const chartData = {
    labels: Object.keys(monthlyData),
    datasets: [
      {
        label: "Montant total des devis",
        data: Object.values(monthlyData),
        backgroundColor: "rgba(59, 130, 246, 0.5)",
        borderColor: "rgb(59, 130, 246)",
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total des devis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
            }).format(totalAmount)}
          </div>
          <p className="text-xs text-muted-foreground">
            {proposals.length} devis au total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Montant moyen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {new Intl.NumberFormat("fr-FR", {
              style: "currency",
              currency: "EUR",
            }).format(averageAmount)}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Taux de conversion
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {conversionRate.toFixed(1)}%
          </div>
          <p className="text-xs text-muted-foreground">
            {acceptedProposals.length} devis acceptés
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            En attente
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {proposals.filter((p) => p.status === "sent").length}
          </div>
          <p className="text-xs text-muted-foreground">
            Devis en cours de négociation
          </p>
        </CardContent>
      </Card>

      <Card className="col-span-full">
        <CardHeader>
          <CardTitle>Évolution mensuelle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top" as const,
                  },
                },
              }}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 