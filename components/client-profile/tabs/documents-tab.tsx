import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, Download, File } from "lucide-react"
import { useClientDocuments } from "@/hooks/use-client-documents"
import { formatters } from "@/app/types/client-profile"
import type { ClientDocument } from "@/app/types/client-profile"

export function ClientDocumentsTab({ clientId }: { clientId: string }) {
  const { documents, uploadDocument } = useClientDocuments(clientId)

  const handleUpload = async () => {
    try {
      const input = document.createElement('input')
      input.type = 'file'
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0]
        if (file) {
          await uploadDocument(file)
        }
      }
      input.click()
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Documents partagés</CardTitle>
        <Button onClick={handleUpload}>
          <Upload className="h-4 w-4 mr-2" />
          Ajouter un document
        </Button>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Taille</TableHead>
              <TableHead>Date ajout</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents?.map((doc: ClientDocument) => (
              <TableRow key={doc.id}>
                <TableCell className="flex items-center">
                  <File className="h-4 w-4 mr-2" />
                  {doc.name}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{doc.type}</Badge>
                </TableCell>
                <TableCell>
                  {doc.size && formatters.formatFileSize(doc.size)}
                </TableCell>
                <TableCell>{formatters.formatDate(doc.uploadedAt)}</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {(!documents || documents.length === 0) && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  Aucun document partagé
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
} 