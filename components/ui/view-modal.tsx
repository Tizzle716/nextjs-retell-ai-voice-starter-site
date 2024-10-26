import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"

interface ViewModalProps<T extends Record<string, unknown>> {
  isOpen: boolean
  onClose: () => void
  item: T
}

export function ViewModal<T extends Record<string, unknown>>({ isOpen, onClose, item }: ViewModalProps<T>) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Item Details</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {Object.entries(item).map(([key, value]) => (
            <div key={key} className="mb-2">
              <span className="font-semibold">{key}: </span>
              <span>{String(value)}</span>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
