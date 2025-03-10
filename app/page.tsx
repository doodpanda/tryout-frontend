import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function Home() {
  return (
    <div className="container flex flex-col items-center justify-center py-12 text-center md:py-20">
      <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">Welcome to the Tryout System</h1>
      <p className="mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
        Practice with our tryouts to improve your skills and knowledge. Get instant feedback and track your progress.
      </p>
      <div className="mt-10">
        <Button asChild className="px-8 py-6 text-lg">
          <Link href="/tryouts">Explore Tryouts</Link>
        </Button>
      </div>
    </div>
  )
}

