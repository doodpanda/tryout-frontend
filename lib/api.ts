import { mockTryouts, mockQuestions, mockCategories, mockDifficulties } from "./mock-data"

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
  tryoutId: string
  text: string
  type: "multiple_choice" | "true_false" | "essay"
  options?: { id: string, text: string }[]
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

function getAuthHeaders(token?: string): Record<string, string> {
  return {
    "Content-Type": "application/json"
  };
}

export async function fetchTryouts(filters?: TryoutFilters): Promise<Tryout[]> {
  const url = `http://127.0.0.1:8080/api/v1/tryout/?timestamp=${new Date().getTime()}`
  const options: RequestInit = {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
  }

  if (filters) {
    options.body = JSON.stringify(filters)
  }
  
  console.log(filters)
  const response = await fetch(url, options)
  if (!response.ok) {
    throw new Error("Failed to fetch tryouts")
  }
  const filteredTryouts: Tryout[] = await response.json().then(data => Array.isArray(data.data.tryouts) ? data.data.tryouts : [])
  
  return filteredTryouts
}

export async function fetchTryoutById(id: string): Promise<Tryout> {
  const url = `http://127.0.0.1:8080/api/v1/tryout/${id}`;
  const options: RequestInit = {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: "include",
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error("Failed to fetch tryout");
  }

  const data = await response.json();
  const tryout: Tryout = {
    id: data.data.tryout.id,
    title: data.data.tryout.title,
    description: data.data.tryout.description,
    longDescription: data.data.tryout.long_description || "",
    category: data.data.tryout.category,
    questionCount: data.data.tryout.question_count,
    duration: data.data.tryout.duration,
    createdAt: data.data.tryout.created_at,
    participants: data.data.tryout.participants,
    difficulty: data.data.tryout.difficulty,
    passingScore: data.data.tryout.passing_score,
    topics: data.data.tryout.topics,
    creator: data.data.tryout.creator_id,
    featured: data.data.tryout.featured,
  };

  return tryout;
}

export async function createTryout(data: TryoutFormData): Promise<Tryout> {
    const url = `http://127.0.0.1:8080/api/v1/tryout/new`;
    const { passingScore, ...rest } = data;
    const options: RequestInit = {
      method: "POST",
      headers: getAuthHeaders(),
      credentials: "include",
      body: JSON.stringify({...rest,
        passing_score: passingScore,
      }),
    };

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error("Failed to create tryout");
    }

    const createdTryout: Tryout = await response.json().then(data => ({
      id: data.data.tryout.id,
      title: data.data.tryout.title,
      description: data.data.tryout.description,
      longDescription: data.data.tryout.long_description || "",
      category: data.data.tryout.category,
      questionCount: data.data.tryout.question_count,
      duration: data.data.tryout.duration,
      createdAt: data.data.tryout.created_at,
      participants: data.data.tryout.participants,
      difficulty: data.data.tryout.difficulty,
      passingScore: data.data.tryout.passing_score,
      topics: data.data.tryout.topics,
      creator: data.data.tryout.creator_id,
      featured: data.data.tryout.featured,
    }));

return createdTryout;
}

export async function updateTryout(id: string, data: TryoutFormData): Promise<Tryout> {
  const url = `http://127.0.0.1:8080/api/v1/tryout/${id}`;
  const { passingScore, ...rest } = data;
  const options: RequestInit = {
    method: "PUT",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify({
      ...rest,
      passing_score: passingScore,
    }),
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error("Failed to update tryout");
  }

  const updatedTryout: Tryout = await response.json().then(data => ({
    id: data.data.tryout.id,
    title: data.data.tryout.title,
    description: data.data.tryout.description,
    longDescription: data.data.tryout.long_description || "",
    category: data.data.tryout.category,
    questionCount: data.data.tryout.question_count,
    duration: data.data.tryout.duration,
    createdAt: data.data.tryout.created_at,
    participants: data.data.tryout.participants,
    difficulty: data.data.tryout.difficulty,
    passingScore: data.data.tryout.passing_score,
    topics: data.data.tryout.topics,
    creator: data.data.tryout.creator_id,
    featured: data.data.tryout.featured,
  }));

  return updatedTryout;
}

export async function deleteTryout(id: string): Promise<void> {
  const url = `http://127.0.0.1:8080/api/v1/tryout/${id}`;
  const options: RequestInit = {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error("Failed to delete question");
  }
}

export async function fetchQuestions(tryoutId: string): Promise<Question[]> {
  const url = `http://127.0.0.1:8080/api/v1/tryout/${tryoutId}/questions?timestamp=${new Date().getTime()}`;
  const options: RequestInit = {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: "include",
  };
  console.log("fetchQuestions", url, options);

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error("Failed to fetch questions");
  }

  const questions: Question[] = await response.json().then(data => Array.isArray(data.data.questions) ? data.data.questions.map((q: any) => ({
    id: q.id,
    tryoutId: q.tryout_id,
    text: q.text,
    type: q.type,
    options: q.options,
    correctAnswer: q.correct_answer,
    points: q.points,
  })) : []);
  console.log("fetchQuestions", questions);
  return questions;
}

export async function fetchQuestionById(tryoutId: string, questionId: string): Promise<Question> {
  const url = `http://127.0.0.1:8080/api/v1/tryout/${tryoutId}/questions/${questionId}`;
  const options: RequestInit = {
    method: "GET",
    headers: getAuthHeaders(),
    credentials: "include",
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error("Failed to fetch question");
  }

  const data = await response.json();
  const question: Question = {
    id: data.data.question.id,
    tryoutId: data.data.question.tryout_id,
    text: data.data.question.text,
    type: data.data.question.type,
    options: data.data.question.options,
    correctAnswer: data.data.question.correct_answer,
    points: data.data.question.points,
  };

  return question;
}

export async function createQuestion(tryoutId: string, data: QuestionFormData): Promise<Question> {
  const url = `http://127.0.0.1:8080/api/v1/tryout/${tryoutId}/questions`;
  const options: RequestInit = {
    method: "POST",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify(data),
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error("Failed to create question");
  }

  const newQuestion: Question = await response.json().then(data => ({
    id: data.data.question.id,
    tryoutId: data.data.question.tryout_id,
    text: data.data.question.text,
    type: data.data.question.type,
    options: data.data.question.options,
    correctAnswer: data.data.question.correct_answer,
    points: data.data.question.points,
  }));

  return newQuestion
}

export async function updateQuestion(tryoutId: string, questionId: string, data: QuestionFormData): Promise<Question> {
  const url = `http://127.0.0.1:8080/api/v1/tryout/${tryoutId}/questions/${questionId}`;
  const options: RequestInit = {
    method: "PUT",
    headers: getAuthHeaders(),
    credentials: "include",
    body: JSON.stringify(data),
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error("Failed to update question");
  }

  const updatedQuestion: Question = await response.json().then(data => ({
    id: data.data.question.id,
    tryoutId: data.data.question.tryout_id,
    text: data.data.question.text,
    type: data.data.question.type,
    options: data.data.question.options,
    correctAnswer: data.data.question.correct_answer,
    points: data.data.question.points,
  }));

  return updatedQuestion;
}

export async function deleteQuestion(tryoutId: string, questionId: string): Promise<void> {
  const url = `http://127.0.0.1:8080/api/v1/tryout/${tryoutId}/questions/${questionId}`;
  const options: RequestInit = {
    method: "DELETE",
    headers: getAuthHeaders(),
    credentials: "include",
  };

  const response = await fetch(url, options);
  if (!response.ok) {
    throw new Error("Failed to delete question");
  }
}

export async function loginUser(email: string, password: string): Promise<void> {
  const url = "http://localhost:8080/api/v1/login";
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
  const url = "http://localhost:8080/api/v1/register";
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

export async function fetchCategories(): Promise<string[]> {
  return mockCategories
}

export async function fetchDifficulties(): Promise<string[]> {
  return mockDifficulties
}
