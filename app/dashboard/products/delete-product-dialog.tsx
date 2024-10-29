"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { deleteProduct } from "@/app/actions/products"

interface DeleteProductDialogProps {
  productId: string
  isOpen: boolean
  onClose: () => void
}

export function DeleteProductDialog({
  productId,
  isOpen,
  onClose,
}: DeleteProductDialogProps) {
  const { toast } = useToast()

  async function handleDelete() {
    try {
      await deleteProduct(productId)
      toast({
        title: "Produit supprimé",
        description: "Le produit a été supprimé avec succès",
      })
      onClose()
    } catch (error) {
      console.error("Erreur lors de la suppression:", error)
      toast({
        variant: "destructive",
        title: "Erreur",
        description: error instanceof Error 
          ? error.message 
          : "Une erreur est survenue lors de la suppression",
      })
    }
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
          <AlertDialogDescription>
            Cette action est irréversible. Le produit sera définitivement supprimé
            de votre catalogue.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Annuler</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            Supprimer
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 