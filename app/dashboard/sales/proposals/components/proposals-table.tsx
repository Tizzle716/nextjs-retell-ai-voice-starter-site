"use client"

import { useState } from "react"
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Proposal } from "@/app/types/proposal"
import { MoreHorizontal, Copy, Trash2, Edit } from "lucide-react"
import { UseMutateFunction } from "@tanstack/react-query"

// Type plus précis pour les mutations
type MutationResponse = {
  id: string;
  status: string;
  // autres propriétés nécessaires
}

export interface ProposalsTableProps {
  data: Proposal[]
  onDuplicate: UseMutateFunction<MutationResponse, Error, Proposal, unknown>
  onDelete: UseMutateFunction<void, Error, Proposal, unknown>
  onEdit: (proposal: Proposal) => void
  isLoading: boolean
}

export function ProposalsTable({
  data,
  onDuplicate,
  onDelete,
  onEdit,
  isLoading
}: ProposalsTableProps) {
  const [rowSelection, setRowSelection] = useState({})

  const columns: ColumnDef<Proposal>[] = [
    {
      accessorKey: "id",
      header: "N° Devis",
      cell: ({ row }) => <span className="font-mono">{row.getValue("id")}</span>,
    },
    {
      accessorKey: "contact.name",
      header: "Client",
    },
    {
      accessorKey: "total",
      header: "Montant TTC",
      cell: ({ row }) => (
        <span className="font-mono">
          {new Intl.NumberFormat("fr-FR", {
            style: "currency",
            currency: "EUR",
          }).format(row.getValue("total"))}
        </span>
      ),
    },
    {
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${
              status === "draft"
                ? "bg-gray-100 text-gray-800"
                : status === "sent"
                ? "bg-blue-100 text-blue-800"
                : status === "accepted"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {status}
          </span>
        )
      },
    },
    {
      accessorKey: "created_at",
      header: "Date de création",
      cell: ({ row }) => (
        <span>
          {new Date(row.getValue("created_at")).toLocaleDateString("fr-FR")}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const proposal = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(proposal)}>
                <Edit className="mr-2 h-4 w-4" />
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDuplicate(proposal)}
                disabled={isLoading}
              >
                <Copy className="mr-2 h-4 w-4" />
                Dupliquer
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(proposal)}
                disabled={isLoading}
                className="text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection,
    },
  })

  return (
    <div>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow
                key={row.id}
                data-state={row.getIsSelected() && "selected"}
              >
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                {isLoading ? "Chargement..." : "Aucun devis trouvé."}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
} 