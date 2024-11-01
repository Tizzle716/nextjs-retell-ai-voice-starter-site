"use client"

import { useProposals } from "@/hooks/use-proposals"
import { ProposalsTable } from "./proposals-table"
import { Proposal } from "@/app/types/proposal"

interface ProposalsWrapperProps {
  initialData: Proposal[]
  onEdit: (proposal: Proposal) => void
}

export function ProposalsWrapper({ initialData, onEdit }: ProposalsWrapperProps) {
  const {
    duplicateProposal,
    deleteProposal,
    isDuplicating,
    isDeleting
  } = useProposals()

  return (
    <ProposalsTable
      data={initialData}
      onDuplicate={duplicateProposal}
      onDelete={deleteProposal}
      onEdit={onEdit}
      isLoading={isDuplicating || isDeleting}
    />
  )
}