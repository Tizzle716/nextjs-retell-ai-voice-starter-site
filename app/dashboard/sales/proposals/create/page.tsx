import { Metadata } from "next"
import { ProposalForm } from "../components/proposal-form"

export const metadata: Metadata = {
  title: "Créer un Devis",
  description: "Créer un nouveau devis pour un client",
}

export default function CreateProposalPage() {
  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Créer un Devis</h1>
      </div>
      <ProposalForm />
    </div>
  )
} 