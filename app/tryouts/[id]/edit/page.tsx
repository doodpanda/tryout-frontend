import { fetchTryoutById, fetchCategories, fetchDifficulties } from "@/lib/api"
import TryoutForm from "@/components/tryout-form"
import { notFound } from "next/navigation"
import Link from "next/link"

export default async function EditTryoutPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const tryoutId = params.id

  try {
    const [tryout, categories, difficulties] = await Promise.all([
      fetchTryoutById(tryoutId),
      fetchCategories(),
      fetchDifficulties(),
    ])

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
          <span className="text-sm font-medium">Edit</span>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Edit Tryout</h1>
          <p className="mt-2 text-muted-foreground">Update the details of your tryout</p>
        </div>

        <TryoutForm
          initialData={{
            id: tryout.id,
            title: tryout.title,
            description: tryout.description,
            category: tryout.category,
            duration: tryout.duration,
            difficulty: tryout.difficulty,
            passingScore: tryout.passingScore,
            topics: tryout.topics,
            featured: tryout.featured,
          }}
          categories={categories}
          difficulties={difficulties}
        />
      </div>
    )
  } catch (error) {
    notFound()
  }
}

