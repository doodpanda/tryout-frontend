import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import TryoutFilter from "@/components/tryout-filter"
import { fetchTryouts, fetchCategories, fetchDifficulties, type TryoutFilters } from "@/lib/api"
import TryoutCard from "@/components/tryout-card"
import { useEffect, useState } from "react"

interface TryoutsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function TryoutsPage(props: TryoutsPageProps) {
  const searchParams = await props.searchParams;
  const filters: TryoutFilters = {
    category: typeof searchParams.category === "string" ? searchParams.category : undefined,
    difficulty: typeof searchParams.difficulty === "string" ? searchParams.difficulty : undefined,
    search: typeof searchParams.search === "string" ? searchParams.search : undefined,
  }

  // Fetch data
  const [tryouts, categories, difficulties] = await Promise.all([
    fetchTryouts(filters),
    fetchCategories(),
    fetchDifficulties(),
  ]);

  return (
    <div className="container py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Available Tryouts</h1>
          <p className="mt-2 text-muted-foreground">
            Browse our collection of tryout tests to practice and assess your knowledge.
          </p>
        </div>
        <Button asChild className="mt-4 sm:mt-0 transition-transform hover:scale-105">
          <Link href="/tryouts/create">
            <Plus className="mr-1 h-4 w-4" />
            Create Tryout
          </Link>
        </Button>
      </div>

      <TryoutFilter categories={categories} difficulties={difficulties} />

      <div id="main-content" className="scroll-mt-20">
        {tryouts.length === 0 ? (
          <div className="text-center py-12 slide-in-up">
            <h3 className="text-lg font-medium">No tryouts found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your filters or create a new tryout.</p>
            <Button asChild className="mt-4 transition-transform hover:scale-105">
              <Link href="/tryouts/create">
                <Plus className="mr-1 h-4 w-4" />
                Create Tryout
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tryouts.map((tryout, index) => (
              <TryoutCard key={tryout.id} tryout={tryout} index={index} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

