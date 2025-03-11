"use client"

import { useState, useEffect, use } from "react";
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit, Plus, Trash } from "lucide-react"
import { type Question, fetchQuestions, fetchTryoutById, deleteQuestion } from "@/lib/api"
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

export default function QuestionsPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const tryoutId = params.id

  const [questions, setQuestions] = useState<Question[]>([])
  const [tryoutTitle, setTryoutTitle] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [questionToDelete, setQuestionToDelete] = useState<Question | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [questionsData, tryoutData] = await Promise.all([fetchQuestions(tryoutId), fetchTryoutById(tryoutId)])
        console.log("fetchQuestions", questionsData)
        setQuestions(questionsData)
        setTryoutTitle(tryoutData.title)
      } catch (err) {
        setError("Failed to load questions")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [tryoutId])

  const handleDeleteClick = (question: Question) => {
    setQuestionToDelete(question)
    setDeleteDialogOpen(true)
  
  }

  const handleDeleteConfirm = async () => {
    if (!questionToDelete) return

    setIsDeleting(true)
    try {
      await deleteQuestion(tryoutId, questionToDelete.id)
      setQuestions(questions.filter((q) => q.id !== questionToDelete.id))
      setDeleteDialogOpen(false)
    } catch (err) {
      console.error("Failed to delete question:", err)
    } finally {
      setIsDeleting(false)
      setQuestionToDelete(null)
    }
  }

  const getQuestionTypeLabel = (type: string) => {
    switch (type) {
      case "multiple_choice":
        return "Multiple Choice"
      case "true_false":
        return "True/False"
      case "essay":
        return "Essay"
      default:
        return type
    }
  }

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading questions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container flex min-h-[400px] flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold">Error</h1>
        <p className="mt-2 text-muted-foreground">{error}</p>
        <Button className="mt-4" asChild>
          <Link href={`/tryouts/${tryoutId}`}>Back to Tryout</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container py-10">
      <div className="mb-6 flex items-center gap-3">
        <Link href="/tryouts" className="text-sm font-medium text-muted-foreground hover:text-foreground">
          Tryouts
        </Link>
        <span className="text-muted-foreground">/</span>
        <Link href={`/tryouts/${tryoutId}`} className="text-sm font-medium text-muted-foreground hover:text-foreground">
          {tryoutTitle}
        </Link>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium">Questions</span>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Questions</h1>
          <p className="mt-2 text-muted-foreground">Manage questions for {tryoutTitle}</p>
        </div>
        <Button asChild className="mt-4 sm:mt-0">
          <Link href={`/tryouts/${tryoutId}/questions/create`}>
            <Plus className="mr-1 h-4 w-4" />
            Add Question
          </Link>
        </Button>
      </div>

      {questions.length === 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>No Questions Yet</CardTitle>
            <CardDescription>
              This tryout doesn't have any questions yet. Add some questions to get started.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild>
              <Link href={`/tryouts/${tryoutId}/questions/create`}>
                <Plus className="mr-1 h-4 w-4" />
                Add First Question
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <Card key={question.id}>
              <CardHeader className="pb-2">
                <div className="flex justify-between">
                  <Badge>{getQuestionTypeLabel(question.type)}</Badge>
                  <Badge variant="outline">{question.points} points</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <h3 className="text-lg font-medium">{question.text}</h3>

                  {question.type === "multiple_choice" && question.options && (
                    <div className="mt-2 space-y-1">
                      {question.options.map((option, index) => (
                        <div
                          key={index}
                          className={`p-2 rounded-md ${option.id === question.correctAnswer ? "bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800" : "bg-muted"}`}
                        >
                          {option.text}
                          {option.id === question.correctAnswer && (
                            <span className="ml-2 text-sm text-green-600 dark:text-green-400">(Correct Answer)</span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {question.type === "true_false" && (
                    <div className="mt-2 space-y-1">
                      <div
                        className={`p-2 rounded-md ${question.correctAnswer === true ? "bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800" : "bg-muted"}`}
                      >
                        True
                        {question.correctAnswer === true && (
                          <span className="ml-2 text-sm text-green-600 dark:text-green-400">(Correct Answer)</span>
                        )}
                      </div>
                      <div
                        className={`p-2 rounded-md ${question.correctAnswer === false ? "bg-green-100 dark:bg-green-900/20 border border-green-200 dark:border-green-800" : "bg-muted"}`}
                      >
                        False
                        {question.correctAnswer === false && (
                          <span className="ml-2 text-sm text-green-600 dark:text-green-400">(Correct Answer)</span>
                        )}
                      </div>
                    </div>
                  )}

                  {question.type === "essay" && (
                    <div className="mt-2 p-2 bg-muted rounded-md">
                      <p className="text-sm text-muted-foreground">Essay question - no predefined answer</p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/tryouts/${tryoutId}/questions/${question.id}/edit`}>
                      <Edit className="mr-1 h-4 w-4" />
                      Edit
                    </Link>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-destructive hover:bg-destructive/10"
                    onClick={() => handleDeleteClick(question)}
                  >
                    <Trash className="mr-1 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to delete this question?</AlertDialogTitle>
            <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

