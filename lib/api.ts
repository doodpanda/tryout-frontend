import { mockCategories, mockDifficulties } from "./mock-data"
import { parseCookies } from "nookies"

// Types
export interface Tryout {
  id: string
  title: string
  description: string
  longDescription?: string
  category: string
  questionCount: number
  duration: number
  createdAt: string
  participants: number
  difficulty: string
  passingScore: number
  topics: string[]
  creator: string
  featured: boolean
}

export interface Question {
  id: string
  tryoutid: string
  text: string
  type: "multiple_choice" | "true_false" | "essay"
  options?: string[]
  correctAnswer?: string | boolean
  points: number
}

export interface TryoutFormData {
  title: string
  description: string
  category: string
  duration: number
  difficulty: string
  passingScore: number
  topics: string[]
  featured?: boolean
}

export interface QuestionFormData {
  text: string
  type: "multiple_choice" | "true_false" | "essay"
  options?: string[]
  correctAnswer?: string | boolean
  points: number
}

export interface TryoutFilters {
  category?: string
  difficulty?: string
  search?: string
}

// Helper function to simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// Add a base URL for the real API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1"
// Add a helper function to get auth token from cookies
function getAuthToken() {
  const cookies = parseCookies()
  return cookies
}

// Add a fetch wrapper that includes the auth token
async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAuthToken()
  console.log(token)
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `${token}` } : {}),
    ...options.headers,
  }

  return fetch(url, {
    ...options,
    headers,
  })
}

// API functions with mock data
export async function fetchTryouts(filters?: TryoutFilters): Promise<Tryout[]> {
  // Build query parameters for filters
  const url = `${API_BASE_URL}/api/v1/tryout/?timestamp=${new Date().getTime()}`

  const response = await fetchWithAuth(`${API_BASE_URL}/tryout`, {
    method: "POST",
    body: JSON.stringify(filters),
  })

  if (!response.ok) {
    throw new Error("Failed to fetch tryouts")
  }
  const filteredTryouts: Tryout[] = await response
    .json()
    .then((data) => (Array.isArray(data.data.tryouts) ? data.data.tryouts : []))

  return filteredTryouts
}
export async function fetchTryoutById(id: string): Promise<Tryout> {
  const response = await fetchWithAuth(`${API_BASE_URL}/tryout/${id}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch tryout: ${response.statusText}`)
  }

  return response.json()
}

export async function createTryout(data: TryoutFormData): Promise<Tryout> {
  const response = await fetchWithAuth(`${API_BASE_URL}/tryout/new`, {
    method: "POST",
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Failed to create tryout: ${response.statusText}`)
  }

  return response.json()
}

export async function updateTryout(id: string, data: TryoutFormData): Promise<Tryout> {
  const response = await fetchWithAuth(`${API_BASE_URL}/tryout/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Failed to update tryout: ${response.statusText}`)
  }

  return response.json()
}

export async function deleteTryout(id: string): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE_URL}/tryout/${id}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error(`Failed to delete tryout: ${response.statusText}`)
  }
}

// Questions API with mock data
export async function fetchQuestions(tryoutid: string): Promise<Question[]> {
  const response = await fetchWithAuth(`${API_BASE_URL}/tryout/${tryoutid}/questions`)

  if (!response.ok) {
    throw new Error(`Failed to fetch questions: ${response.statusText}`)
  }

  return response.json()
}

export async function fetchQuestionById(tryoutid: string, questionid: string): Promise<Question> {
  const response = await fetchWithAuth(`${API_BASE_URL}/tryout/${tryoutid}/questions/${questionid}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch question: ${response.statusText}`)
  }

  return response.json()
}

export async function createQuestion(tryoutid: string, data: QuestionFormData): Promise<Question> {
  const response = await fetchWithAuth(`${API_BASE_URL}/tryout/${tryoutid}/questions`, {
    method: "POST",
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Failed to create question: ${response.statusText}`)
  }

  return response.json()
}

export async function updateQuestion(tryoutid: string, questionid: string, data: QuestionFormData): Promise<Question> {
  const response = await fetchWithAuth(`${API_BASE_URL}/tryout/${tryoutid}/questions/${questionid}`, {
    method: "PUT",
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    throw new Error(`Failed to update question: ${response.statusText}`)
  }

  return response.json()
}

export async function deleteQuestion(tryoutid: string, questionid: string): Promise<void> {
  const response = await fetchWithAuth(`${API_BASE_URL}/tryout/${tryoutid}/questions/${questionid}`, {
    method: "DELETE",
  })

  if (!response.ok) {
    throw new Error(`Failed to delete question: ${response.statusText}`)
  }
}

export async function fetchCategories(): Promise<string[]> {
  return mockCategories
}

export async function fetchDifficulties(): Promise<string[]> {
  return mockDifficulties
}


export async function loginUser(email: string, password: string): Promise<void> {
  const url = `${API_BASE_URL}/login`;
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Ensures cookies are sent and stored
    body: JSON.stringify({ email, password }),
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error("Failed to log in");
  }
}

export async function registerUser(data: { email: string; password: string; first_name: string; last_name: string }): Promise<{ success: boolean; error?: string }> {
  const url = `${API_BASE_URL}/register`;
  const options: RequestInit = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(data),
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    const errorData = await response.json();
    return { success: false, error: errorData.message || "Registration failed" };
  }

  return { success: true };
}