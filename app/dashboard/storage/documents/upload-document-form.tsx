"use client"

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2 } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Document } from '@/app/types/document'
import { readFileContent } from '@/utils/pdf'
import { PreviewContent } from './preview-content'
import { useToast } from "@/hooks/use-toast"

interface UploadDocumentFormProps {
  onSubmit: (data: Partial<Document> & { file: File }) => Promise<void>;
  onCancel: () => void;
}

export function UploadDocumentForm({ onSubmit, onCancel }: UploadDocumentFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [extractedContent, setExtractedContent] = useState<string>('')
  const [formData, setFormData] = useState({
    title: '',
    category: '' as Document['category'],
    subcategory: '',
    keywords: '',
  })

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return

    setFile(selectedFile)
    setIsLoading(true)
    setError(null)

    try {
      const content = await readFileContent(selectedFile)
      setExtractedContent(content)
      // Auto-fill title from filename
      setFormData(prev => ({
        ...prev,
        title: selectedFile.name.replace('.pdf', '')
      }))
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Failed to read PDF')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    try {
      event.preventDefault();
      setIsLoading(true);

      if (!file) {
        setError('No file selected');
        return;
      }

      const data = {
        file,
        title: formData.title,
        category: formData.category,
        subcategory: formData.subcategory,
        keywords: formData.keywords.split(',').map(k => k.trim()),
        content: extractedContent,
        file_type: 'PDF' as const
      };

      await onSubmit(data);
      
      toast({
        title: "Document uploadé",
        description: "Le document a été ajouté avec succès",
      });
      
      setFormData({
        title: '',
        category: '' as Document['category'],
        subcategory: '',
        keywords: '',
      });
      setFile(null);
      setExtractedContent('');
      
      router.push('/dashboard/storage/documents');
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed');
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de l'upload",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="file">Document PDF</Label>
        <Input
          id="file"
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          disabled={isLoading}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="title">Titre</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category">Catégorie</Label>
        <Select
          value={formData.category}
          onValueChange={(value: Document['category']) => 
            setFormData({ ...formData, category: value })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Sélectionner une catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Construction">Construction</SelectItem>
            <SelectItem value="Renovation">Rénovation</SelectItem>
            <SelectItem value="Energies">Énergies</SelectItem>
            <SelectItem value="Estate">Immobilier</SelectItem>
            <SelectItem value="Closing">Closing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subcategory">Sous-catégorie</Label>
        <Input
          id="subcategory"
          value={formData.subcategory}
          onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="keywords">Mots-clés (séparés par des virgules)</Label>
        <Input
          id="keywords"
          value={formData.keywords}
          onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
        />
      </div>

      {isLoading && (
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-6 w-6 animate-spin" />
        </div>
      )}

      {extractedContent && <PreviewContent content={extractedContent} />}

      <div className="flex justify-end space-x-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onCancel}
        >
          Annuler
        </Button>
        <Button 
          type="submit" 
          disabled={isLoading || !extractedContent}
        >
          {isLoading ? 'Chargement...' : 'Uploader'}
        </Button>
      </div>
    </form>
  )
}