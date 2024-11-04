"use client"

import { useRouter } from 'next/navigation'
import { useProposals } from "@/hooks/use-proposals"
import { ProposalsTable } from "./proposals-table"
import { Proposal } from "@/app/types/proposal"

interface ProposalsWrapperProps {
  initialData: Proposal[]
}

export function ProposalsWrapper({ initialData }: ProposalsWrapperProps) {
  const router = useRouter()
  const {
    duplicateProposal,
    deleteProposal,
    isDuplicating,
    isDeleting
  } = useProposals()

  const handleEdit = (proposal: Proposal) => {
    router.push(`/dashboard/sales/proposals/${proposal.id}/edit`)
  }

  return (
    <ProposalsTable
      data={initialData}
      onDuplicate={duplicateProposal}
      onDelete={deleteProposal}
      onEdit={handleEdit}
      isLoading={isDuplicating || isDeleting}
    />
  )
}