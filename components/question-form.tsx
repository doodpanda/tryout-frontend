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
import { X, Plus } from "lucide-react"
import { type QuestionFormData, createQuestion, updateQuestion } from "@/lib/api"

interface QuestionFormProps {
  tryoutId: string
  initialData?: QuestionFormData & { id?: string }
  onSuccess?: () => void
}

export default function QuestionForm({ tryoutId, initialData, onSuccess }: QuestionFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [newOption, setNewOption] = useState("")

  const [formData, setFormData] = useState<QuestionFormData>({
    text: initialData?.text || "",
    type: initialData?.type || "multiple_choice",
    options: initialData?.options || [],
    correctAnswer: initialData?.correctAnswer || "",
    points: initialData?.points || 1,
  })

  const handleChange = (field: keyof QuestionFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTypeChange = (type: "multiple_choice" | "true_false" | "essay") => {
    const updatedData: QuestionFormData = {
      ...formData,
      type,
    }

    if (type === "true_false") {
      updatedData.options = []
      updatedData.correctAnswer = false
    } else if (type === "essay") {
      updatedData.options = []
      updatedData.correctAnswer = undefined
    } else if (type === "multiple_choice") {
      if (!Array.isArray(updatedData.options)) {
        updatedData.options = []
      }
      if (typeof updatedData.correctAnswer === "boolean") {
        updatedData.correctAnswer = ""
      }
    }

    setFormData(updatedData)
  }

  const addOption = () => {
    if (newOption.trim() && !formData.options?.includes(newOption.trim())) {
      handleChange("options", [...(formData.options || []), newOption.trim()])
      setNewOption("")
    }
  }

  const removeOption = (option: string) => {
    const updatedOptions = formData.options?.filter((o) => o !== option) || []
    handleChange("options", updatedOptions)

    // If the correct answer was the removed option, reset it
    if (formData.correctAnswer === option) {
      handleChange("correctAnswer", "")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    try {
      // Validate form
      if (!formData.text.trim()) throw new Error("Question text is required")
      if (formData.points <= 0) throw new Error("Points must be greater than 0")

      if (formData.type === "multiple_choice") {
        if (!formData.options || formData.options.length < 2) {
          throw new Error("Multiple choice questions must have at least 2 options")
        }
        if (!formData.correctAnswer) {
          throw new Error("Please select a correct answer")
        }
      }

      if (initialData?.id) {
        await updateQuestion(tryoutId, initialData.id, formData)
      } else {
        await createQuestion(tryoutId, formData)
      }

      if (onSuccess) {
        onSuccess()
      } else {
        router.push(`/tryouts/${tryoutId}/questions`)
        router.refresh()
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-3xl mx-auto">
      <form onSubmit={handleSubmit}>
        <CardHeader>
          <CardTitle>{initialData?.id ? "Edit Question" : "Create New Question"}</CardTitle>
          <CardDescription>
            {initialData?.id
              ? "Update the details of your existing question"
              : "Fill in the details to create a new question"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {error && <div className="bg-destructive/15 text-destructive p-3 rounded-md text-sm">{error}</div>}

          <div className="space-y-2">
            <Label htmlFor="text">Question Text</Label>
            <Textarea
              id="text"
              value={formData.text}
              onChange={(e) => handleChange("text", e.target.value)}
              placeholder="Enter your question"
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Question Type</Label>
            <Select
              value={formData.type}
              onValueChange={(value: "multiple_choice" | "true_false" | "essay") => handleTypeChange(value)}
            >
              <SelectTrigger id="type">
                <SelectValue placeholder="Select question type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="multiple_choice">Multiple Choice</SelectItem>
                <SelectItem value="true_false">True/False</SelectItem>
                <SelectItem value="essay">Essay</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {formData.type === "multiple_choice" && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Options</Label>
                <div className="flex gap-2">
                  <Input value={newOption} onChange={(e) => setNewOption(e.target.value)} placeholder="Add an option" />
                  <Button type="button" onClick={addOption} variant="outline">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-2 mt-2">
                  {formData.options && formData.options.length > 0 ? (
                    formData.options.map((option, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <input
                          type="radio"
                          id={`option-${index}`}
                          name="correctAnswer"
                          checked={formData.correctAnswer === option}
                          onChange={() => handleChange("correctAnswer", option)}
                          className="h-4 w-4"
                        />
                        <Label htmlFor={`option-${index}`} className="flex-1">
                          {option}
                        </Label>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeOption(option)}
                          className="h-8 w-8 p-0"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove option</span>
                        </Button>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground">No options added yet</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {formData.type === "true_false" && (
            <div className="space-y-2">
              <Label>Correct Answer</Label>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="true"
                    name="correctAnswer"
                    checked={formData.correctAnswer === true}
                    onChange={() => handleChange("correctAnswer", true)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="true">True</Label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="radio"
                    id="false"
                    name="correctAnswer"
                    checked={formData.correctAnswer === false}
                    onChange={() => handleChange("correctAnswer", false)}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="false">False</Label>
                </div>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="points">Points</Label>
            <Input
              id="points"
              type="number"
              min="1"
              value={formData.points}
              onChange={(e) => handleChange("points", Number.parseInt(e.target.value) || 1)}
              required
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Saving..." : initialData?.id ? "Update Question" : "Create Question"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

