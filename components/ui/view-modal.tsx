import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ViewModalProps<T> {
  isOpen: boolean
  onClose: () => void
  item: T | null
  renderContent: (item: T | null) => React.ReactNode
}

export function ViewModal<T>({ isOpen, onClose, item, renderContent }: ViewModalProps<T>) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{item ? 'Edit Item' : 'Add New Item'}</DialogTitle>
        </DialogHeader>
        {renderContent(item)}
      </DialogContent>
    </Dialog>
  )
}
