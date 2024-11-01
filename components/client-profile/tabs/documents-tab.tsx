import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Download, File } from "lucide-react"
import { useClientDocuments } from "@/hooks/use-client-documents"
import { formatters } from "@/app/types/client-profile"
import type { ClientDocument } from "@/app/types/client-profile"
import { useState } from 'react'

export function ClientDocumentsTab({ clientId }: { clientId: string }) {
  const { documents, isLoading, error, uploadDocument } = useClientDocuments(clientId)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0])
    }
  }

  const handleUploadClick = async () => {
    if (!selectedFile) return

    try {
      await uploadDocument(selectedFile)
      setSelectedFile(null)
    } catch (error) {
      console.error('Upload failed:', error)
    }
  }

  if (isLoading) return <div>Chargement...</div>
  if (error) return <div>Erreur: {error.message}</div>

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Documents partagés</CardTitle>
        <div className="flex gap-4">
          <input
            type="file"
            onChange={handleFileSelect}
            className="hidden"
            id="file-upload"
          />
          <label htmlFor="file-upload">
            <Button className="cursor-pointer">Select File</Button>
          </label>
          <Button
            onClick={handleUploadClick}
            disabled={!selectedFile}
          >
            Upload
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nom</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Created at</TableHead>
              <TableHead>Dernière modification</TableHead>
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
                <TableCell>{formatters.formatDate(doc.uploadedAt)}</TableCell>
                <TableCell>{doc.metadata?.lastModified && formatters.formatDate(doc.metadata.lastModified)}</TableCell>
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