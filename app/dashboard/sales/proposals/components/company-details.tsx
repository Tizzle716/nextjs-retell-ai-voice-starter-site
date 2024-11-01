"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"

export function CompanyDetails() {
  // Ces informations devraient venir de votre configuration
  const companyInfo = {
    name: "Votre Entreprise",
    logo: "/logo.png",
    address: "123 Rue de l'entreprise",
    city: "75000 Paris",
    phone: "+33 1 23 45 67 89",
    email: "contact@entreprise.com",
    siret: "123 456 789 00000",
    tva: "FR 12 345678900",
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{companyInfo.name}</span>
          <Image
            src={companyInfo.logo}
            alt="Logo"
            width={100}
            height={50}
            className="object-contain"
          />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <p>{companyInfo.address}</p>
        <p>{companyInfo.city}</p>
        <p>{companyInfo.phone}</p>
        <p>{companyInfo.email}</p>
        <div className="pt-4 border-t">
          <p>SIRET: {companyInfo.siret}</p>
          <p>N° TVA: {companyInfo.tva}</p>
        </div>
      </CardContent>
    </Card>
  )
} 