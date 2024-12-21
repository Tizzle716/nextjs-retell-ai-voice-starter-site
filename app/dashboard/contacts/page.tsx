"use client"

export const dynamic = 'force-dynamic'

import { ContactsClient } from "./contacts-client"

export default function ContactsPage() {
  return (
    <div className="container mx-auto py-6">
      <ContactsClient />
    </div>
  )
}
