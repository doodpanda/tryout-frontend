"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
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
import { deleteTryout } from "@/lib/api"

interface DeleteTryoutDialogProps {
  tryoutId: string
  tryoutTitle: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function DeleteTryoutDialog({ tryoutId, tryoutTitle, open, onOpenChange }: DeleteTryoutDialogProps) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setIsDeleting(true)
    setError(null)

    try {
      await deleteTryout(tryoutId)
      onOpenChange(false)
      router.push("/tryouts")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete tryout")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to delete this tryout?</AlertDialogTitle>
          <AlertDialogDescription>
            You are about to delete <span className="font-medium">{tryoutTitle}</span>. This action cannot be undone and
            all associated questions will be permanently removed.
            {error && <div className="mt-2 text-destructive text-sm">{error}</div>}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={isDeleting}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

