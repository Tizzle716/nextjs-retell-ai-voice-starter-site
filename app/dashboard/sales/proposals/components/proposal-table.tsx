"use client"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ProposalItem } from "@/app/types/proposal"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { Input } from "@/components/ui/input"

interface ProposalTableProps {
  items: ProposalItem[]
  onUpdateQuantity: (index: number, quantity: number) => void
  onRemoveItem: (index: number) => void
  tax: number
  onUpdateTax: (tax: number) => void
}

export function ProposalTable({
  items,
  onUpdateQuantity,
  onRemoveItem,
  tax,
  onUpdateTax,
}: ProposalTableProps) {
  const subtotal = items.reduce((sum, item) => sum + item.subtotal, 0)
  const taxAmount = (subtotal * tax) / 100
  const total = subtotal + taxAmount

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Produit</TableHead>
            <TableHead className="w-[100px]">Quantité</TableHead>
            <TableHead className="w-[100px]">Prix unitaire</TableHead>
            <TableHead className="w-[100px]">Total</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={index}>
              <TableCell>{item.description}</TableCell>
              <TableCell>
                <Input
                  type="number"
                  min={1}
                  value={item.quantity}
                  onChange={(e) =>
                    onUpdateQuantity(index, parseInt(e.target.value))
                  }
                  className="w-20"
                />
              </TableCell>
              <TableCell>{item.unitPrice} €</TableCell>
              <TableCell>{item.subtotal} €</TableCell>
              <TableCell>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveItem(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex flex-col items-end space-y-2">
        <div className="flex items-center gap-4">
          <span>Sous-total:</span>
          <span>{subtotal} €</span>
        </div>
        <div className="flex items-center gap-4">
          <span>TVA (%):</span>
          <Input
            type="number"
            min={0}
            max={100}
            value={tax}
            onChange={(e) => onUpdateTax(parseFloat(e.target.value))}
            className="w-20"
          />
          <span>{taxAmount} €</span>
        </div>
        <div className="flex items-center gap-4 font-bold">
          <span>Total:</span>
          <span>{total} €</span>
        </div>
      </div>
    </div>
  )
} 