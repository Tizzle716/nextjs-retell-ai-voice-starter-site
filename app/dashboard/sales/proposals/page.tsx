import { Suspense } from "react"
import { createServerClient } from '@supabase/ssr'
import { cookies } from "next/headers"
import { ProposalsWrapper } from "./components/proposals-wrapper"
import { StatisticsDashboard } from "./components/statistics-dashboard"
import { Button } from "@/components/ui/button"
import { Plus, Loader2 } from "lucide-react"
import Link from "next/link"

export default async function ProposalsPage() {
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookies().get(name)?.value
        },
      },
    }
  )
  
  const { data: proposals } = await supabase
    .from("client_proposals")
    .select(`
      *,
      contact:contacts(*)
    `)
    .order("created_at", { ascending: false })

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Devis</h1>
        <Link href="/dashboard/sales/proposals/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nouveau devis
          </Button>
        </Link>
      </div>

      <Suspense
        fallback={
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        }
      >
        <StatisticsDashboard proposals={proposals || []} />
      </Suspense>

      <Suspense
        fallback={
          <div className="flex items-center justify-center h-32">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        }
      >
        <ProposalsWrapper 
          initialData={proposals || []}
          onEdit={(proposal) => `/dashboard/sales/proposals/${proposal.id}/edit`}
        />
      </Suspense>
    </div>
  )
} 