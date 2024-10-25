import { Input } from "@/components/ui/input"
import { Table } from "@tanstack/react-table"
import { Search, UserPlus, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface ToolbarProps<TData> {
  table: Table<TData>
  onAddContact: () => void
  onImportContact: () => void
}

export function Toolbar<TData>({ table, onAddContact, onImportContact }: ToolbarProps<TData>) {
  return (
    <div className="flex items-center justify-between py-4">
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
        <Input
          placeholder="Rechercher..."
          value={(table.getColumn("globalFilter")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.setGlobalFilter(event.target.value)
          }
          className="pl-9 pr-4 py-2 w-full rounded-full border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div className="flex space-x-2">
        <Button 
          onClick={onAddContact} 
          className={cn(
            "rounded-full bg-[#25D366] hover:bg-[#128C7E] text-white",
            "transition-colors duration-200"
          )}
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add Contact
        </Button>
        <Button 
          onClick={onImportContact} 
          className={cn(
            "rounded-full bg-[#0088cc] hover:bg-[#0077b5] text-white",
            "transition-colors duration-200"
          )}
        >
          <Upload className="mr-2 h-4 w-4" />
          Import Contact
        </Button>
      </div>
    </div>
  )
}
