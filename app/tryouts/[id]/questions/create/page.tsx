import { fetchTryoutById } from "@/lib/api"
import QuestionForm from "@/components/question-form"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function CreateQuestionPage({ params }: { params: { id: string } }) {
  const tryoutId = params.id
  try {
    const tryout = await fetchTryoutById(tryoutId)

    return (
      <div className="container py-10">
        <div className="mb-6 flex items-center gap-3">
          <Link href="/tryouts" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Tryouts
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link
            href={`/tryouts/${tryoutId}`}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            {tryout.title}
          </Link>
          <span className="text-muted-foreground">/</span>
          <Link
            href={`/tryouts/${tryoutId}/questions`}
            className="text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Questions
          </Link>
          <span className="text-muted-foreground">/</span>
          <span className="text-sm font-medium">Create</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Create New Question</h1>
          <p className="mt-2 text-muted-foreground">Add a new question to {tryout.title}</p>
        </div>

        <QuestionForm tryoutId={tryoutId} />
      </div>
    )
  } catch (error) {
    notFound()
  }
}

