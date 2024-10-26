import { NextResponse } from "next/server"
import { Proposal } from "@/app/types/sales"

const proposals: Proposal[] = [
  {
    id: "1",
    title: "Website Redesign",
    client: "TechCorp",
    date: "2023-05-15",
    status: "sent",
    score: 85,
    createdAt: "2023-05-10T09:00:00Z",
    updatedAt: "2023-05-15T14:30:00Z"
  },
  {
    id: "2",
    title: "Mobile App Development",
    client: "StartupX",
    date: "2023-06-01",
    status: "accepted",
    score: 92,
    createdAt: "2023-05-20T11:00:00Z",
    updatedAt: "2023-06-01T16:45:00Z"
  },
  {
    id: "3",
    title: "Cloud Migration Strategy",
    client: "EnterpriseY",
    date: "2023-05-28",
    status: "draft",
    score: 78,
    createdAt: "2023-05-25T10:30:00Z",
    updatedAt: "2023-05-28T09:15:00Z"
  },
]

export async function GET() {
  return NextResponse.json(proposals)
}

export async function POST(request: Request) {
  const proposal: Proposal = await request.json()
  proposal.id = (proposals.length + 1).toString()
  proposal.createdAt = new Date().toISOString()
  proposal.updatedAt = new Date().toISOString()
  proposals.push(proposal)
  return NextResponse.json(proposal, { status: 201 })
}
