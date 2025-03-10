import Link from "next/link"
import { Button } from "@/components/ui/button"
import { LucideBook } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"

export default function Navbar() {
  return (
    <header className="border-b bg-background sticky top-0 z-50 transition-colors duration-300">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <LucideBook className="h-6 w-6 text-primary" />
          <Link href="/" className="text-xl font-bold">
            Tryout System
          </Link>
        </div>
        <nav className="flex items-center gap-4">
          <Link href="/tryouts" className="font-medium hover:text-primary transition-colors duration-200">
            Tryouts
          </Link>
          <ThemeToggle />
          <div className="hidden sm:flex sm:items-center sm:gap-3">
            <Button variant="outline">Login</Button>
            <Button>Sign Up</Button>
          </div>
        </nav>
      </div>
    </header>
  )
}

