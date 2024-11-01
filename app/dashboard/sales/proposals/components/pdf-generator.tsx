"use client"

import { usePDF } from "@react-pdf/renderer"
import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer"
import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { Proposal, ProposalItem } from "@/app/types/proposal"

// Types
interface CompanyInfo {
  name: string
  address: string
  city: string
  siret: string
  tva: string
}

interface ProposalPDFProps {
  proposal: Proposal
  companyInfo: CompanyInfo
}

// Styles
const styles = StyleSheet.create({
  page: {
    fontFamily: 'Roboto',
    padding: 30,
    fontSize: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  logo: {
    width: 150,
  },
  companyInfo: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  tableContainer: {
    width: '100%',
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#bfbfbf',
    marginVertical: 20,
    display: 'flex',
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#bfbfbf',
  },
  tableHeader: {
    backgroundColor: '#f0f0f0',
    fontWeight: 'bold',
  },
  tableCell: {
    flex: 1,
    padding: 8,
    textAlign: 'left',
  },
  totals: {
    marginTop: 30,
    alignItems: 'flex-end',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 30,
    right: 30,
    textAlign: 'center',
    fontSize: 10,
    color: '#666',
  },
})

const ProposalDocument = ({ proposal, companyInfo }: ProposalPDFProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>DEVIS N° {proposal.id}</Text>
          <Text>Date: {new Date(proposal.createdAt).toLocaleDateString('fr-FR')}</Text>
          <Text>Échéance: {new Date(proposal.deadline).toLocaleDateString('fr-FR')}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={{ fontWeight: 'bold' }}>Émetteur</Text>
        <Text>{companyInfo.name}</Text>
        <Text>{companyInfo.address}</Text>
        <Text>{companyInfo.city}</Text>
        <Text>SIRET: {companyInfo.siret}</Text>
        <Text>TVA: {companyInfo.tva}</Text>
      </View>

      <View style={styles.section}>
        <Text style={{ fontWeight: 'bold' }}>Client</Text>
        <Text>{proposal.contact.name}</Text>
        <Text>{proposal.contact.email}</Text>
      </View>

      <View style={styles.tableContainer}>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <Text style={styles.tableCell}>Description</Text>
          <Text style={styles.tableCell}>Quantité</Text>
          <Text style={styles.tableCell}>Prix unitaire</Text>
          <Text style={styles.tableCell}>Total HT</Text>
        </View>

        {proposal.items.map((item: ProposalItem, index: number) => (
          <View key={index} style={styles.tableRow}>
            <Text style={styles.tableCell}>{item.description}</Text>
            <Text style={styles.tableCell}>{item.quantity}</Text>
            <Text style={styles.tableCell}>{item.unitPrice.toFixed(2)} €</Text>
            <Text style={styles.tableCell}>{item.subtotal.toFixed(2)} €</Text>
          </View>
        ))}
      </View>

      <View style={styles.totals}>
        <Text>Sous-total HT: {proposal.subtotal.toFixed(2)} €</Text>
        <Text>TVA ({proposal.tax}%): {(proposal.subtotal * proposal.tax / 100).toFixed(2)} €</Text>
        <Text style={{ fontWeight: 'bold', fontSize: 14 }}>
          Total TTC: {proposal.total.toFixed(2)} €
        </Text>
      </View>

      <View style={styles.footer}>
        <Text>
          {companyInfo.name} - SIRET: {companyInfo.siret} - TVA: {companyInfo.tva}
        </Text>
      </View>
    </Page>
  </Document>
)

export function ProposalPDFGenerator({ proposal, companyInfo }: ProposalPDFProps) {
  const [instance, updateInstance] = usePDF({ document: <ProposalDocument proposal={proposal} companyInfo={companyInfo} /> })

  if (instance.loading) {
    return (
      <Button disabled>
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Génération du PDF...
      </Button>
    )
  }

  if (instance.error) {
    return (
      <Button 
        variant="destructive" 
        onClick={() => updateInstance(<ProposalDocument proposal={proposal} companyInfo={companyInfo} />)}
      >
        Erreur - Réessayer
      </Button>
    )
  }

  return (
    <Button onClick={() => instance.url && window.open(instance.url)}>
      <Download className="mr-2 h-4 w-4" />
      Télécharger le PDF
    </Button>
  )
} 