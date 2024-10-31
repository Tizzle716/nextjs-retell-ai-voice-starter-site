import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ImportContactForm } from "./import-contact-form"
import { Contact } from "@/app/types/contact"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

interface ImportContactDialogProps {
  isOpen: boolean
  onClose: () => void
  onImport: (contacts: Partial<Contact>[]) => Promise<void>
}

export function ImportContactDialog({ isOpen, onClose, onImport }: ImportContactDialogProps) {
  const downloadExample = () => {
    const element = document.createElement("a")
    element.href = "/example-contact.csv"
    element.download = "example-contact.csv"
    document.body.appendChild(element)
    element.click()
    document.body.removeChild(element)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Import Contacts</DialogTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={downloadExample}
            className="flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Download Example CSV
          </Button>
        </DialogHeader>
        <ImportContactForm onSubmit={onImport} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  )
}