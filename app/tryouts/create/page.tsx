import { fetchCategories, fetchDifficulties } from "@/lib/api"
import TryoutForm from "@/components/tryout-form"

export default async function CreateTryoutPage() {
  const [categories, difficulties] = await Promise.all([fetchCategories(), fetchDifficulties()])

  return (
    <div className="container py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Create New Tryout</h1>
        <p className="mt-2 text-muted-foreground">Create a new tryout to test knowledge and skills.</p>
      </div>

      <TryoutForm categories={categories} difficulties={difficulties} />
    </div>
  )
}

