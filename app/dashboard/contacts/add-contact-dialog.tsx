import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { AddContactForm } from "./add-contact-form"
import { Contact } from "@/app/types/contact"

interface AddContactDialogProps {
  isOpen: boolean
  onClose: () => void
  onAddContact: (data: Partial<Contact>) => Promise<void>
}

export function AddContactDialog({ isOpen, onClose, onAddContact }: AddContactDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Add New Contact</DialogTitle>
        </DialogHeader>
        <AddContactForm onSubmit={onAddContact} onCancel={onClose} />
      </DialogContent>
    </Dialog>
  )
}