import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
  } from "@/components/ui/dialog"
  import { ClientProfileEditForm } from "./edit-form"
  import type { ClientProfile } from "@/app/types/client-profile"
  
  interface EditProfileDialogProps {
    client: ClientProfile
    isOpen: boolean
    onClose: () => void
    onSubmit: (data: ClientProfile) => Promise<void>
  }
  
  export function EditProfileDialog({
    client,
    isOpen,
    onClose,
    onSubmit
  }: EditProfileDialogProps) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Modifier le profil</DialogTitle>
          </DialogHeader>
          <ClientProfileEditForm 
            client={client}
            onSubmit={async (data) => {
              await onSubmit(data)
              onClose()
            }}
          />
        </DialogContent>
      </Dialog>
    )
  }