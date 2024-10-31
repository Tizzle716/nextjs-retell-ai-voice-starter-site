// edit-contact-dialog.tsx
import { type Contact } from "@/app/types/contact"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { AddContactForm } from "./add-contact-form"

export function EditContactDialog({ 
  contact,
  isOpen,
  onClose,
  onEdit
}: {
  contact: Contact | null
  isOpen: boolean
  onClose: () => void
  onEdit: (data: Partial<Contact>) => Promise<void>
}) {
  // Transform contact data to match form structure
  const initialData = contact ? {
    ...contact,
    provider: {
      site: contact.provider?.site || "",
      funnel: contact.provider?.funnel || "",
      call: contact.provider?.call || "",
      vip: contact.provider?.vip || false,
    },
    tags: contact.tags || [],
    score: contact.score || 0,
  } : null

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modifier le contact</DialogTitle>
        </DialogHeader>
        <AddContactForm 
          initialData={initialData}
          onSubmit={onEdit}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  )
}