import { useState } from "react"
import { Search, Upload, UserPlus } from "lucide-react"
import { Contact } from "@/app/types/contact"
import { Filters } from "@/app/types/filters"
import { Table } from "@tanstack/react-table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AddContactDialog } from "./add-contact-dialog"
import { ImportContactDialog } from "./import-contact-dialog"

interface ToolbarProps {
  table: Table<Contact>
  onAddContact: (data: Partial<Contact>) => Promise<void>
  onImportContact: (contacts: Partial<Contact>[]) => Promise<void>
  filters: Filters
  onFiltersChange: (filters: Filters) => void
}

export function Toolbar({
  onAddContact,
  onImportContact,
  filters,
  onFiltersChange,
}: Omit<ToolbarProps, 'table'>) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false)

  return (
    <div className="w-full">
      <div className="flex items-center justify-between py-4">
        <div className="flex gap-4 items-center">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <Input
              placeholder="Search"
              value={filters.search}
              onChange={(e) => onFiltersChange({ ...filters, search: e.target.value })}
              className="pl-9 pr-4 py-2 w-full rounded-full"
            />
          </div>
        </div>
        <div className="flex space-x-2">
          <Button 
            onClick={() => setIsAddDialogOpen(true)} 
            className="rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white"
          >
            <UserPlus className="mr-2 h-4 w-4" />
            Add Contact
          </Button>
          
          <Button 
            onClick={() => setIsImportDialogOpen(true)}
            variant="outline"
            className="rounded-full"
          >
            <Upload className="mr-2 h-4 w-4" />
            Import CSV
          </Button>
        </div>
      </div>

      <AddContactDialog
        isOpen={isAddDialogOpen}
        onClose={() => setIsAddDialogOpen(false)}
        onAddContact={onAddContact}
      />

      <ImportContactDialog
        isOpen={isImportDialogOpen}
        onClose={() => setIsImportDialogOpen(false)}
        onImport={onImportContact}
      />
    </div>
  )
}
