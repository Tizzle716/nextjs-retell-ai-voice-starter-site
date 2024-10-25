import { FileX } from "lucide-react"

export function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <FileX className="h-16 w-16 text-gray-400 mb-4" />
      <h2 className="text-xl font-semibold text-gray-900">No contacts found</h2>
      <p className="text-gray-500 mt-2">Try adjusting your search or filter to find what you&apos;re looking for.</p>
    </div>
  )
}
