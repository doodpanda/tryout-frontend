"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Calendar, Clock, Edit, FileText, Share2, Star, Trash, Users } from "lucide-react"
import DeleteTryoutDialog from "@/components/delete-tryout-dialog"
import { type Tryout, fetchTryoutById } from "@/lib/api"
import Link from "next/link"

export default function TryoutDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const tryoutId = params.id

  const [tryout, setTryout] = useState<Tryout | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  useEffect(() => {
    const loadTryout = async () => {
      try {
        const data = await fetchTryoutById(tryoutId)
        setTryout(data)
      } catch (err) {
        setError("Failed to load tryout details")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadTryout()
  }, [tryoutId])

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="h-8 w-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-muted-foreground">Loading tryout details...</p>
        </div>
      </div>
    )
  }

  if (error || !tryout) {
    return (
      <div className="container flex min-h-[400px] flex-col items-center justify-center py-12">
        <h1 className="text-2xl font-bold">Tryout not found</h1>
        <p className="mt-2 text-muted-foreground">{error || "The tryout you are looking for does not exist."}</p>
        <Button className="mt-4" asChild>
          <Link href="/tryouts">Back to Tryouts</Link>
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
        <span className="text-sm font-medium">{tryout.title}</span>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-8">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant="outline">{tryout.category}</Badge>
                {tryout.featured && (
                  <Badge className="bg-yellow-500">
                    <Star className="mr-1 h-3 w-3" /> Featured
                  </Badge>
                )}
              </div>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/tryouts/${tryout.id}/edit`}>
                    <Edit className="mr-1 h-4 w-4" />
                    Edit
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-destructive hover:bg-destructive/10"
                  onClick={() => setDeleteDialogOpen(true)}
                >
                  <Trash className="mr-1 h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>

            <h1 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">{tryout.title}</h1>

            <div className="mt-4 flex flex-wrap gap-6 text-sm">
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Created: {tryout.createdAt}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{tryout.duration} minutes</span>
              </div>
              <div className="flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span>{tryout.questionCount} questions</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4 text-muted-foreground" />
                <span>{tryout.participants} participants</span>
              </div>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Description</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{tryout.description}</p>

              <Separator className="my-6" />

              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <h3 className="mb-2 font-medium">Topics Covered</h3>
                  <div className="flex flex-wrap gap-2">
                    {tryout.topics.map((topic) => (
                      <Badge key={topic} variant="secondary">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="mb-2 font-medium">Created By</h3>
                  <p className="text-sm text-muted-foreground">{tryout.creator}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold">Questions</h2>
              <Button asChild>
                <Link href={`/tryouts/${tryout.id}/questions/create`}>Add Question</Link>
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Manage Questions</CardTitle>
                <CardDescription>Create, edit, and manage questions for this tryout.</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full">
                  <Link href={`/tryouts/${tryout.id}/questions`}>View All Questions</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        <div>
          <Card className="sticky top-6">
            <CardHeader>
              <CardTitle>Tryout Information</CardTitle>
              <CardDescription>Key details about this tryout</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-muted-foreground">Difficulty</span>
                  <p className="font-medium">{tryout.difficulty}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Passing Score</span>
                  <p className="font-medium">{tryout.passingScore}%</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration</span>
                  <p className="font-medium">{tryout.duration} minutes</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Questions</span>
                  <p className="font-medium">{tryout.questionCount}</p>
                </div>
              </div>

              <Separator />

              <div className="space-y-3">
                <Button className="w-full" size="lg" asChild>
                  <Link href={`/tryouts/${tryout.id}/take`}>Start Tryout</Link>
                </Button>
                <Button variant="outline" className="w-full" size="lg">
                  <Share2 className="mr-2 h-4 w-4" /> Share
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <DeleteTryoutDialog
        tryoutId={tryout.id}
        tryoutTitle={tryout.title}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
      />
    </div>
  )
}

