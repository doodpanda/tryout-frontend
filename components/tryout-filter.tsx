"use client"

import { useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Search, X } from "lucide-react"
import type { TryoutFilters } from "@/lib/api"

interface TryoutFilterProps {
  categories: string[]
  difficulties: string[]
}

export default function TryoutFilter({ categories, difficulties }: TryoutFilterProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [filters, setFilters] = useState<TryoutFilters>({
    category: searchParams.get("category") || undefined,
    difficulty: searchParams.get("difficulty") || undefined,
    search: searchParams.get("search") || undefined,
  })

  const handleFilterChange = (key: keyof TryoutFilters, value: string | undefined) => {
    setFilters((prev) => ({ ...prev, [key]: value }))
  }

  const applyFilters = () => {
    const params = new URLSearchParams()
    if (filters.category) params.set("category", filters.category)
    if (filters.difficulty) params.set("difficulty", filters.difficulty)
    if (filters.search) params.set("search", filters.search)

    router.push(`/tryouts?${params.toString()}`)
  }

  const resetFilters = () => {
    setFilters({ category: undefined, difficulty: undefined, search: undefined })
    router.push("/tryouts")
  }

  const hasActiveFilters = !!filters.category || !!filters.difficulty || !!filters.search

  return (
    <div className="bg-muted/40 p-4 rounded-lg mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              id="search"
              placeholder="Search tryouts..."
              className="pl-8"
              value={filters.search || ""}
              onChange={(e) => handleFilterChange("search", e.target.value || undefined)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">Category</Label>
          <Select
            value={filters.category || ""}
            onValueChange={(value) => handleFilterChange("category", value || undefined)}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="difficulty">Difficulty</Label>
          <Select
            value={filters.difficulty || ""}
            onValueChange={(value) => handleFilterChange("difficulty", value || undefined)}
          >
            <SelectTrigger id="difficulty">
              <SelectValue placeholder="All difficulties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All difficulties</SelectItem>
              {difficulties.map((difficulty) => (
                <SelectItem key={difficulty} value={difficulty}>
                  {difficulty}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex justify-end gap-2 mt-4">
        {hasActiveFilters && (
          <Button variant="outline" onClick={resetFilters} size="sm">
            <X className="mr-1 h-4 w-4" />
            Clear
          </Button>
        )}
        <Button onClick={applyFilters} size="sm">
          <Search className="mr-1 h-4 w-4" />
          Apply Filters
        </Button>
      </div>
    </div>
  )
}

