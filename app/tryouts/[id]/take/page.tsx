"use client"

import { Badge } from "@/components/ui/badge"
import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, ArrowLeft, ArrowRight, CheckCircle, Clock, Flag, XCircle } from "lucide-react"
import { type Question, type Tryout, fetchQuestions, fetchTryoutById } from "@/lib/api"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"

export default function TakeTryoutPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const router = useRouter()
  const tryoutId = params.id

  const [tryout, setTryout] = useState<Tryout | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string | boolean>>({})
  const [feedback, setFeedback] = useState<Record<string, boolean | null>>({})
  const [flagged, setFlagged] = useState<Record<string, boolean>>({})
  const [timeLeft, setTimeLeft] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [score, setScore] = useState(0)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [questionsData, tryoutData] = await Promise.all([fetchQuestions(tryoutId), fetchTryoutById(tryoutId)])

        setQuestions(questionsData)
        setTryout(tryoutData)
        setTimeLeft(tryoutData.duration * 60) // Convert minutes to seconds
      } catch (err) {
        setError("Failed to load tryout")
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    loadData()
  }, [tryoutId])

  // Timer effect
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0 || isCompleted) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 0) {
          clearInterval(timer)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, isCompleted])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    return `${hours > 0 ? `${hours}:` : ""}${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  // Remove the immediate feedback during the test
  // Replace the handleAnswer function with this version that doesn't provide feedback
  const handleAnswer = (questionId: string, answer: string | boolean) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }))
    // Remove the immediate feedback code
  }

  const toggleFlag = (questionId: string) => {
    setFlagged((prev) => ({ ...prev, [questionId]: !prev[questionId] }))
  }

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index)
    }
  }

  // Modify the handleSubmit function to calculate feedback only after submission
  const handleSubmit = () => {
    setIsSubmitting(true)

    // Calculate final score
    let totalScore = 0
    let maxScore = 0
    const newFeedback: Record<string, boolean | null> = {}
    console.log(questions)
    console.log(answers)
    questions.forEach((question) => {
      maxScore += question.points || 1
      // Only calculate feedback for multiple choice and true/false questions
      if (
        (question.type === "multiple_choice" || question.type === "true_false") &&
        question.correctAnswer !== undefined &&
        answers[question.id] !== undefined
      ) {
        const isCorrect = answers[question.id] === question.correctAnswer
        newFeedback[question.id] = isCorrect

        if (isCorrect) {
          totalScore += question.points || 1
        }
      } else if (question.type === "essay") {
        // For essay questions, we can't automatically grade
        newFeedback[question.id] = null
      }
    })

    setFeedback(newFeedback)
    setScore(totalScore)
    setIsCompleted(true)
    setIsSubmitting(false)
  }

  if (isLoading) {
    return (
      <div className="container py-10">
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <div className="h-16 w-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-6 text-lg text-muted-foreground">Loading tryout...</p>
        </div>
      </div>
    )
  }

  if (error || !tryout || questions.length === 0) {
    return (
      <div className="container flex min-h-[400px] flex-col items-center justify-center py-12">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold">Error</h1>
        <p className="mt-2 text-muted-foreground">{error || "This tryout has no questions or doesn't exist."}</p>
        <Button className="mt-6" asChild>
          <Link href="/tryouts">Back to Tryouts</Link>
        </Button>
      </div>
    )
  }

  if (isCompleted) {
    const totalPoints = questions.reduce((total, q) => total + (q.points || 1), 0)
    const percentage = Math.round((score / totalPoints) * 100)
    const passed = percentage >= (tryout.passingScore || 70)

    return (
      <div className="container py-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto"
        >
          <Card className="p-8 text-center">
            <div className="mb-6">
              {passed ? (
                <CheckCircle className="h-20 w-20 mx-auto text-success mb-4" />
              ) : (
                <XCircle className="h-20 w-20 mx-auto text-destructive mb-4" />
              )}
              <h1 className="text-3xl font-bold mb-2">{passed ? "Congratulations!" : "Try Again"}</h1>
              <p className="text-lg text-muted-foreground">
                {passed
                  ? "You've successfully completed the tryout."
                  : "You didn't reach the passing score, but don't worry! You can try again."}
              </p>
            </div>

            <div className="bg-muted p-6 rounded-lg mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Score</p>
                  <p className="text-2xl font-bold">
                    {score}/{totalPoints}
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Percentage</p>
                  <p className="text-2xl font-bold">{percentage}%</p>
                </div>
                <div className="text-left">
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className={`text-xl font-bold ${passed ? "text-success" : "text-destructive"}`}>
                    {passed ? "PASSED" : "FAILED"}
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Passing score: {tryout.passingScore}%</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                variant="outline"
                size="lg"
                onClick={() => {
                  setIsCompleted(false)
                  setCurrentQuestionIndex(0)
                  setFeedback({})
                  setAnswers({})
                  setFlagged({})
                  setTimeLeft(tryout.duration * 60)
                }}
                className="transition-transform hover:scale-105"
              >
                Try Again
              </Button>
              <Button size="lg" asChild className="transition-transform hover:scale-105">
                <Link href={`/tryouts/${tryoutId}`}>Back to Tryout Details</Link>
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div className="container py-6 md:py-10">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Question navigation sidebar */}
        <div className="w-full md:w-64 lg:w-72">
          <div className="sticky top-24 space-y-4">
            <Card className="overflow-hidden transition-shadow hover:shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{tryout.title}</CardTitle>
                <div
                  className={`flex items-center gap-2 text-sm ${timeLeft && timeLeft < 60 ? "text-destructive animate-pulse font-bold" : "text-muted-foreground"}`}
                >
                  <Clock className="h-4 w-4" />
                  <span>{timeLeft !== null && timeLeft > 0 ? formatTime(timeLeft) : "Time's up!"}</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground mb-4">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </div>
                <div className="grid grid-cols-4 sm:grid-cols-5 gap-2">
                  {questions.map((q, index) => {
                    let buttonVariant: "link" | "ghost" | "outline" | "default" | "destructive" | "secondary" | null | undefined = "ghost"
                    if (currentQuestionIndex === index) {
                      buttonVariant = "default"
                    } else if (answers[q.id]) {
                      buttonVariant = "outline"
                    }

                    return (
                      <Button
                        key={q.id}
                        variant={buttonVariant}
                        className={`h-10 w-10 p-0 transition-all 
        ${flagged[q.id] ? "border-2 border-yellow-500" : ""}
        hover:scale-110
      `}
                        onClick={() => goToQuestion(index)}
                        aria-label={`Go to question ${index + 1}`}
                      >
                        {index + 1}
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
              <CardFooter className="flex-col items-stretch gap-2">
                <Button
                  variant="outline"
                  className={`w-full transition-colors ${flagged[currentQuestion.id] ? "bg-yellow-500/10" : ""}`}
                  onClick={() => toggleFlag(currentQuestion.id)}
                >
                  <Flag
                    className={`mr-1 h-4 w-4 ${flagged[currentQuestion.id] ? "fill-yellow-500 text-yellow-500" : ""}`}
                  />
                  {flagged[currentQuestion.id] ? "Flagged" : "Flag for Review"}
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>

        {/* Question content */}
        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden transition-shadow hover:shadow-lg">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Question {currentQuestionIndex + 1}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={
                          currentQuestion.type === "multiple_choice"
                            ? "outline"
                            : currentQuestion.type === "true_false"
                              ? "secondary"
                              : "default"
                        }
                      >
                        {currentQuestion.type === "multiple_choice"
                          ? "Multiple Choice"
                          : currentQuestion.type === "true_false"
                            ? "True/False"
                            : "Essay"}
                      </Badge>
                      <Badge variant="outline">
                        {currentQuestion.points} point{currentQuestion.points !== 1 ? "s" : ""}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-lg mb-4">{currentQuestion.text}</p>

                  {currentQuestion.type === "multiple_choice" && currentQuestion.options && (
                    <div className="space-y-3">
                      {currentQuestion.options.map((option, index) => {
                        const isSelected = answers[currentQuestion.id] === option.id

                        return (
                          <div
                            key={index}
                            className={`flex items-center space-x-2 p-3 rounded-md border transition-all
            ${isSelected ? "border-primary bg-muted/50" : "border-input"}
            hover:border-primary hover:bg-muted/50 cursor-pointer
          `}
                            onClick={() => handleAnswer(currentQuestion.id, option.id)}
                          >
                            <input
                              type="radio"
                              id={`option-${index}`}
                              name={`question-${currentQuestion.id}`}
                              value={option.id}
                              checked={answers[currentQuestion.id] === option.id}
                              onChange={() => handleAnswer(currentQuestion.id, option.id)}
                              className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                            />
                            <label htmlFor={`option-${index}`} className="flex-grow text-sm font-medium cursor-pointer">
                              {option.text}
                            </label>
                          </div>
                        )
                      })}
                    </div>
                  )}

                  {currentQuestion.type === "true_false" && (
                    <div className="flex flex-col sm:flex-row gap-4">
                      <div
                        className={`flex-1 p-4 rounded-md border transition-all cursor-pointer
        ${answers[currentQuestion.id] === true ? "border-primary bg-muted/50" : "border-input"}
        hover:border-primary hover:bg-muted/50
      `}
                        onClick={() => handleAnswer(currentQuestion.id, true)}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <input
                            type="radio"
                            id="true"
                            name={`question-${currentQuestion.id}`}
                            checked={answers[currentQuestion.id] === true}
                            onChange={() => handleAnswer(currentQuestion.id, true)}
                            className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                          />
                          <label htmlFor="true" className="font-medium cursor-pointer">
                            True
                          </label>
                        </div>
                      </div>
                      <div
                        className={`flex-1 p-4 rounded-md border transition-all cursor-pointer
        ${answers[currentQuestion.id] === false ? "border-primary bg-muted/50" : "border-input"}
        hover:border-primary hover:bg-muted/50
      `}
                        onClick={() => handleAnswer(currentQuestion.id, false)}
                      >
                        <div className="flex items-center justify-center gap-2">
                          <input
                            type="radio"
                            id="false"
                            name={`question-${currentQuestion.id}`}
                            checked={answers[currentQuestion.id] === false}
                            onChange={() => handleAnswer(currentQuestion.id, false)}
                            className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                          />
                          <label htmlFor="false" className="font-medium cursor-pointer">
                            False
                          </label>
                        </div>
                      </div>
                    </div>
                  )}

                  {currentQuestion.type === "essay" && (
                    <Textarea
                      placeholder="Type your answer here..."
                      value={(answers[currentQuestion.id] as string) || ""}
                      onChange={(e) => handleAnswer(currentQuestion.id, e.target.value)}
                      rows={6}
                      className="w-full resize-y min-h-[150px] focus:border-primary transition-all"
                    />
                  )}
                </CardContent>
                <CardFooter className="flex justify-between border-t p-4">
                  <Button
                    variant="outline"
                    onClick={goToPreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    className="transition-transform hover:translate-x-[-5px]"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Previous
                  </Button>
                  <Button
                    onClick={goToNextQuestion}
                    disabled={currentQuestionIndex === questions.length - 1}
                    className="transition-transform hover:translate-x-[5px]"
                  >
                    Next
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </AnimatePresence>

          <motion.div
            className="mt-6 flex justify-end"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Button
              onClick={handleSubmit}
              size="lg"
              disabled={isSubmitting}
              className="transition-all hover:scale-105 shadow-md hover:shadow-lg"
            >
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Submitting...
                </>
              ) : (
                "Submit Tryout"
              )}
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

