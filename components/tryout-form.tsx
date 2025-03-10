"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"
import { type TryoutFormData, createTryout, updateTryout } from "@/lib/api"

interface TryoutFormProps {
  initialData?: {
    id?: string
    title: string
    description: string
    category: string
    duration: number
    difficulty: string
    passingScore: number
    topics: string[]
    featured?: boolean
  }
  categories: string[]
  difficulties: string[]
  onSuccess?: () => void
}

export default function TryoutForm({ initialData, categories, difficulties, onSuccess }: TryoutFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newTopic, setNewTopic] = useState("")

  const [formData, setFormData] = useState<TryoutFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || "",
    duration: initialData?.duration || 60,
    difficulty: initialData?.difficulty || "",
    passingScore: initialData?.passingScore || 70,
    topics: initialData?.topics || [],
    featured: initialData?.featured || false,
  })

  const handleChange = (field: keyof TryoutFormData, value: string | number | boolean | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const addTopic = () => {
    if (newTopic.trim() && !formData.topics.includes(newTopic.trim())) {
      handleChange("topics", [...formData.topics, newTopic.trim()])
      setNewTopic("")
    }
  }

  const removeTopic = (topic: string) => {
    handleChange(
      "topics",
      formData.topics.filter((t) => t !== topic),
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Validate form
      if (!formData.title.trim()) throw new Error("Title is required")
      if (!formData.description.trim()) throw new Error("Description is required")
      if (!formData.category) throw new Error("Category is required")
      if (!formData.difficulty) throw new Error("Difficulty is required")
      if (formData.duration <= 0) throw new Error("Duration must be greater than 0")
      if (formData.passingScore < 0 || formData.passingScore > 100)
        throw new Error("Passing score must be between 0 and 100")

      if (initialData?.id) {
        await updateTryout(initialData.id, formData)
      } else {
        await createTryout(formData)
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/tryouts")
        router.refresh()
      }
    } catch (err) {
      router.push("/tryouts")
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{initialData?.id ? "Edit Tryout" : "Create New Tryout"}</CardTitle>
          <CardDescription>
            {initialData?.id
              ? "Update the details of your existing tryout"
              : "Fill in the details to create a new tryout"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">{error}</div>}

          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleChange("title", e.target.value)}
              placeholder="Enter tryout title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Describe what this tryout is about"
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleChange("category", value)}>
                <SelectTrigger id="category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
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
              <Select value={formData.difficulty} onValueChange={(value) => handleChange("difficulty", value)}>
                <SelectTrigger id="difficulty">
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  {difficulties.map((difficulty) => (
                    <SelectItem key={difficulty} value={difficulty}>
                      {difficulty}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="duration">Duration (minutes)</Label>
              <Input
                id="duration"
                type="number"
                min="1"
                value={formData.duration}
                onChange={(e) => handleChange("duration", Number.parseInt(e.target.value) || 0)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="passingScore">Passing Score (%)</Label>
              <Input
                id="passingScore"
                type="number"
                min="0"
                max="100"
                value={formData.passingScore}
                onChange={(e) => handleChange("passingScore", Number.parseInt(e.target.value) || 0)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="topics">Topics</Label>
            <div className="flex gap-2">
              <Input
                id="topics"
                value={newTopic}
                onChange={(e) => setNewTopic(e.target.value)}
                placeholder="Add a topic"
              />
              <Button type="button" onClick={addTopic} variant="outline">
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {formData.topics.map((topic) => (
                <Badge key={topic} variant="secondary" className="flex items-center gap-1">
                  {topic}
                  <button
                    type="button"
                    onClick={() => removeTopic(topic)}
                    className="ml-1 rounded-full hover:bg-muted p-0.5"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {topic}</span>
                  </button>
                </Badge>
              ))}
              {formData.topics.length === 0 && (
                <span className="text-sm text-muted-foreground">No topics added yet</span>
              )}
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="featured"
              checked={formData.featured}
              onChange={(e) => handleChange("featured", e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
            />
            <Label htmlFor="featured" className="text-sm font-medium">
              Feature this tryout (will be highlighted on the platform)
            </Label>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialData?.id ? "Update Tryout" : "Create Tryout"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

