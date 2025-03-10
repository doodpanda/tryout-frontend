export interface Question {
  id: string
  text: string
  type: "multiple-choice" | "true-false"
  options?: string[]
  correctAnswer: string | boolean
  explanation: string
}

export const questions: Question[] = [
  {
    id: "q1",
    text: "What is the capital of France?",
    type: "multiple-choice",
    options: ["London", "Berlin", "Paris", "Madrid"],
    correctAnswer: "Paris",
    explanation: "Paris is the capital and most populous city of France.",
  },
  {
    id: "q2",
    text: "The Great Wall of China is visible from space with the naked eye.",
    type: "true-false",
    correctAnswer: false,
    explanation:
      "Contrary to popular belief, the Great Wall of China cannot be seen from space with the naked eye. It requires at least optical aid like binoculars or a telescope.",
  },
  {
    id: "q3",
    text: "Which planet has the most moons?",
    type: "multiple-choice",
    options: ["Earth", "Mars", "Jupiter", "Saturn"],
    correctAnswer: "Saturn",
    explanation: "Saturn has 83 confirmed moons, the most of any planet in our solar system.",
  },
  {
    id: "q4",
    text: "Water boils at 100 degrees Celsius at sea level.",
    type: "true-false",
    correctAnswer: true,
    explanation:
      "At standard atmospheric pressure (sea level), water boils at 100 degrees Celsius (212 degrees Fahrenheit).",
  },
  {
    id: "q5",
    text: "Which of these is not a programming language?",
    type: "multiple-choice",
    options: ["Python", "Java", "Banana", "Ruby"],
    correctAnswer: "Banana",
    explanation:
      "Banana is a fruit, not a programming language. Python, Java, and Ruby are all popular programming languages.",
  },
]

