import { fetchQuestionById, fetchTryoutById } from "@/lib/api"
import QuestionForm from "@/components/question-form"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function EditQuestionPage({
  params,
}: {
  params: { id: string; questionId: string }
}) {
  const tryoutId = params.id
  const questionId = params.questionId

  try {
    const [tryout, question] = await Promise.all([fetchTryoutById(tryoutId), fetchQuestionById(tryoutId, questionId)])

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
          <span className="text-sm font-medium">Edit</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Edit Question</h1>
          <p className="mt-2 text-muted-foreground">Update question for {tryout.title}</p>
        </div>

        <QuestionForm tryoutId={tryoutId} initialData={{ ...question, id: questionId, options: question.options?.map(option => option.text) }} />
      </div>
    )
  } catch (error) {
    notFound()
  }
}

