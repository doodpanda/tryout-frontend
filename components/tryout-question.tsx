"use client"

import { useState } from "react"
import { questions } from "@/lib/questions"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CheckCircle, XCircle, ArrowRight, RotateCcw } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export default function TryoutQuestion() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | boolean | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [questionsAnswered, setQuestionsAnswered] = useState(0)

  const currentQuestion = questions[currentQuestionIndex]

  const handleAnswerSelect = (answer: string | boolean) => {
    if (isAnswered) return
    setSelectedAnswer(answer)
  }

  const checkAnswer = () => {
    if (selectedAnswer === null) return

    const correct = selectedAnswer === currentQuestion.correctAnswer
    setIsCorrect(correct)
    setIsAnswered(true)

    if (correct) {
      setScore((prev) => prev + 1)
    }

    setQuestionsAnswered((prev) => prev + 1)
  }

  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      resetQuestion()
    } else {
      // All questions answered
      resetQuiz()
    }
  }

  const resetQuestion = () => {
    setSelectedAnswer(null)
    setIsAnswered(false)
  }

  const resetQuiz = () => {
    setCurrentQuestionIndex(0)
    resetQuestion()
    setScore(0)
    setQuestionsAnswered(0)
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-4 flex justify-between items-center">
        <div className="text-sm font-medium text-muted-foreground">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
        <div className="text-sm font-medium">
          Score: {score}/{questionsAnswered}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQuestion.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="p-6 mb-6 shadow-lg">
            <h2 className="text-xl font-semibold mb-6">{currentQuestion.text}</h2>

            <div className="space-y-3 mb-6">
              {currentQuestion.type === "multiple-choice" &&
                currentQuestion.options?.map((option, index) => (
                  <div
                    key={index}
                    className={`answer-option p-3 border rounded-md cursor-pointer transition-all ${
                      selectedAnswer === option ? "border-primary bg-primary/5" : "hover:bg-accent"
                    } ${isAnswered && option === currentQuestion.correctAnswer ? "correct" : ""} ${
                      isAnswered && selectedAnswer === option && option !== currentQuestion.correctAnswer
                        ? "incorrect"
                        : ""
                    }`}
                    onClick={() => handleAnswerSelect(option)}
                  >
                    <div className="flex items-center justify-between">
                      <span>{option}</span>
                      {isAnswered && option === currentQuestion.correctAnswer && (
                        <CheckCircle className="h-5 w-5 text-success" />
                      )}
                      {isAnswered && selectedAnswer === option && option !== currentQuestion.correctAnswer && (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                  </div>
                ))}

              {currentQuestion.type === "true-false" && (
                <div className="flex gap-4">
                  <div
                    className={`answer-option flex-1 p-3 border rounded-md cursor-pointer text-center transition-all ${
                      selectedAnswer === true ? "border-primary bg-primary/5" : "hover:bg-accent"
                    } ${isAnswered && currentQuestion.correctAnswer === true ? "correct" : ""} ${
                      isAnswered && selectedAnswer === true && currentQuestion.correctAnswer !== true ? "incorrect" : ""
                    }`}
                    onClick={() => handleAnswerSelect(true)}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>True</span>
                      {isAnswered && currentQuestion.correctAnswer === true && (
                        <CheckCircle className="h-5 w-5 text-success" />
                      )}
                      {isAnswered && selectedAnswer === true && currentQuestion.correctAnswer !== true && (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                  </div>
                  <div
                    className={`answer-option flex-1 p-3 border rounded-md cursor-pointer text-center transition-all ${
                      selectedAnswer === false ? "border-primary bg-primary/5" : "hover:bg-accent"
                    } ${isAnswered && currentQuestion.correctAnswer === false ? "correct" : ""} ${
                      isAnswered && selectedAnswer === false && currentQuestion.correctAnswer !== false
                        ? "incorrect"
                        : ""
                    }`}
                    onClick={() => handleAnswerSelect(false)}
                  >
                    <div className="flex items-center justify-center gap-2">
                      <span>False</span>
                      {isAnswered && currentQuestion.correctAnswer === false && (
                        <CheckCircle className="h-5 w-5 text-success" />
                      )}
                      {isAnswered && selectedAnswer === false && currentQuestion.correctAnswer !== false && (
                        <XCircle className="h-5 w-5 text-destructive" />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {!isAnswered ? (
              <Button onClick={checkAnswer} disabled={selectedAnswer === null} className="w-full">
                Check Answer
              </Button>
            ) : (
              <div className="space-y-4">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`p-4 rounded-md ${isCorrect ? "bg-success/20" : "bg-destructive/20"}`}
                >
                  <div className="flex items-start gap-3">
                    {isCorrect ? (
                      <CheckCircle className="h-6 w-6 text-success shrink-0 mt-0.5" />
                    ) : (
                      <XCircle className="h-6 w-6 text-destructive shrink-0 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium mb-1">{isCorrect ? "Correct!" : "Incorrect!"}</p>
                      <p className="text-sm">{currentQuestion.explanation}</p>
                    </div>
                  </div>
                </motion.div>

                <Button onClick={nextQuestion} className="w-full">
                  {currentQuestionIndex < questions.length - 1 ? (
                    <>
                      Next Question <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Restart Quiz <RotateCcw className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            )}
          </Card>
        </motion.div>
      </AnimatePresence>

      {questionsAnswered > 0 && questionsAnswered === questions.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 bg-primary/10 rounded-lg text-center"
        >
          <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-lg mb-4">
            Your score: {score} out of {questions.length} ({Math.round((score / questions.length) * 100)}%)
          </p>
          <Button onClick={resetQuiz}>
            Try Again <RotateCcw className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      )}
    </div>
  )
}

