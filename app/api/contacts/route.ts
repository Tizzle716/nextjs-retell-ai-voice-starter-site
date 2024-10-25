import { NextResponse } from "next/server"
import { Contact } from "@/app/types/contact"
import { z } from "zod"

const data: Contact[] = [
  {
    id: "001",
    name: "Marie Dupont",
    email: "marie.dupont@mail.com",
    phone: "0654321098",
    dateJoined: "2023-12-15",
    status: "Lead",
    score: 75,
    type: "Potential",
    notifications: {
      lastInteraction: {
        type: "Appel Sortant",
        date: "2024-03-10",
        duration: 300,
        score: 80
      },
      history: [
        {
          type: "Appel Sortant",
          date: "2024-03-10",
          duration: 300,
          score: 80
        },
        {
          type: "Email Entrant",
          date: "2024-03-05",
          score: 60
        }
      ]
    },
    provider: {
      site: "www.example.com",
      funnel: "SEO",
      call: "Direct",
      vip: false
    },
    comments: "Intéressé par nos services premium"
  },
  {
    id: "002",
    name: "Jean Martin",
    email: "jean.martin@mail.com",
    phone: "0612345678",
    dateJoined: "2024-01-05",
    status: "Prospect",
    score: 85,
    type: "B2B",
    notifications: {
      lastInteraction: {
        type: "Appel Entrant",
        date: "2024-03-12",
        duration: 450,
        score: 90
      },
      history: [
        {
          type: "Appel Entrant",
          date: "2024-03-12",
          duration: 450,
          score: 90
        },
        {
          type: "Email Entrant",
          date: "2024-03-08",
          score: 70
        }
      ]
    },
    provider: {
      site: "www.businesspartner.com",
      funnel: "Referral",
      call: "Scheduled",
      vip: true
    },
    comments: "Demande de devis pour projet d'entreprise"
  },
  {
    id: "003",
    name: "Sophie Lefebvre",
    email: "sophie.lefebvre@mail.com",
    phone: "0698765432",
    dateJoined: "2024-02-20",
    status: "Client",
    score: 95,
    type: "Recurring",
    notifications: {
      lastInteraction: {
        type: "Email Entrant",
        date: "2024-03-15",
        score: 85
      },
      history: [
        {
          type: "Email Entrant",
          date: "2024-03-15",
          score: 85
        },
        {
          type: "Appel Sortant",
          date: "2024-03-01",
          duration: 600,
          score: 95
        }
      ]
    },
    provider: {
      site: "www.loyalcustomer.com",
      funnel: "Retention",
      call: "Follow-up",
      vip: true
    },
    comments: "Fidèle cliente, intéressée par nos nouveaux produits"
  },
  {
    id: "004",
    name: "Pierre Dubois",
    email: "pierre.dubois@mail.com",
    phone: "0634567890",
    dateJoined: "2024-03-01",
    status: "Lead",
    score: 60,
    type: "New",
    notifications: {
      lastInteraction: {
        type: "Appel Sortant",
        date: "2024-03-18",
        duration: 180,
        score: 65
      },
      history: [
        {
          type: "Appel Sortant",
          date: "2024-03-18",
          duration: 180,
          score: 65
        }
      ]
    },
    provider: {
      site: "www.newprospect.com",
      funnel: "Cold Call",
      call: "Direct",
      vip: false
    },
    comments: "A demandé plus d'informations sur nos services de base"
  },
  {
    id: "005",
    name: "Isabelle Moreau",
    email: "isabelle.moreau@mail.com",
    phone: "0645678901",
    dateJoined: "2023-11-10",
    status: "Prospect",
    score: 80,
    type: "Potential",
    notifications: {
      lastInteraction: {
        type: "Email Entrant",
        date: "2024-03-20",
        score: 75
      },
      history: [
        {
          type: "Email Entrant",
          date: "2024-03-20",
          score: 75
        },
        {
          type: "Appel Sortant",
          date: "2024-02-15",
          duration: 420,
          score: 85
        }
      ]
    },
    provider: {
      site: "www.growingbusiness.com",
      funnel: "Content Marketing",
      call: "Scheduled",
      vip: false
    },
    comments: "Intéressée par une démonstration de notre plateforme"
  },
  {
    id: "006",
    name: "Lucas Bernard",
    email: "lucas.bernard@mail.com",
    phone: "0656789012",
    dateJoined: "2024-01-25",
    status: "Client",
    score: 90,
    type: "B2B",
    notifications: {
      lastInteraction: {
        type: "Appel Entrant",
        date: "2024-03-22",
        duration: 540,
        score: 95
      },
      history: [
        {
          type: "Appel Entrant",
          date: "2024-03-22",
          duration: 540,
          score: 95
        },
        {
          type: "Email Entrant",
          date: "2024-03-10",
          score: 80
        }
      ]
    },
    provider: {
      site: "www.techpartner.com",
      funnel: "Partnership",
      call: "Follow-up",
      vip: true
    },
    comments: "Partenaire stratégique, discussion sur projet d'expansion"
  }
]

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const page = parseInt(searchParams.get("page") || "1")
  const limit = parseInt(searchParams.get("limit") || "10")
  const search = searchParams.get("search") || ""

  const filteredData = data.filter((contact) =>
    contact.name.toLowerCase().includes(search.toLowerCase()) ||
    contact.email.toLowerCase().includes(search.toLowerCase()) ||
    contact.phone.includes(search)
  )

  const paginatedData = filteredData.slice((page - 1) * limit, page * limit)

  return NextResponse.json({
    data: paginatedData,
    total: filteredData.length,
    page,
    limit,
  })
}

const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().min(10),
  status: z.enum(["Lead", "Prospect", "Client"]),
  score: z.number().int().min(0).max(100),
  type: z.string(),
  provider: z.object({
    site: z.string().url(),
    funnel: z.string(),
    call: z.string(),
    vip: z.boolean(),
  }),
  comments: z.string(),
})

export async function POST(request: Request) {
  const body = await request.json()
  
  try {
    const newContact = contactSchema.parse(body)
    const fullContact: Contact = {
      ...newContact,
      id: (data.length + 1).toString(), // Generate a new ID
      dateJoined: new Date().toISOString(),
      notifications: {
        lastInteraction: {
          type: "Email Entrant",
          date: new Date().toISOString(),
          score: 50
        },
        history: []
      }
    }
    
    data.push(fullContact)
    return NextResponse.json({ message: "Contact added successfully", contact: fullContact })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 })
    }
    return NextResponse.json({ error: "Invalid contact data" }, { status: 400 })
  }
}

export async function PUT(request: Request) {
  const body = await request.json()
  // Implement logic to handle importing multiple contacts
  const importedContacts = parseImportedContacts(body)
  
  // Add imported contacts to the data array
  data.push(...importedContacts)
  
  return NextResponse.json({ message: "Contacts imported successfully", count: importedContacts.length })
}

interface ImportedContactData {
  contacts: Partial<Contact>[]
}

function parseImportedContacts(body: ImportedContactData): Contact[] {
  return body.contacts.map((contact, index) => ({
    id: (data.length + index + 1).toString(),
    name: contact.name || "Imported Contact",
    email: contact.email || `imported${index + 1}@example.com`,
    phone: contact.phone || "0000000000",
    dateJoined: new Date().toISOString(),
    status: contact.status || "Lead",
    score: contact.score || 50,
    type: contact.type || "Imported",
    notifications: {
      lastInteraction: {
        type: "Email Entrant",
        date: new Date().toISOString(),
        score: 50
      },
      history: []
    },
    provider: {
      site: contact.provider?.site || "www.imported.com",
      funnel: contact.provider?.funnel || "Import",
      call: contact.provider?.call || "None",
      vip: contact.provider?.vip || false
    },
    comments: contact.comments || "Imported contact"
  }))
}
