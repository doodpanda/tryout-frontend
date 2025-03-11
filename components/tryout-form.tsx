"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { type TryoutFormData, createTryout, updateTryout } from "@/lib/api";
import TryoutFormClient from "./tryout-form-client";

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
  redirectPath?: string
}

export async function createTryoutAction(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const duration = parseInt(formData.get("duration") as string);
  const difficulty = formData.get("difficulty") as string;
  const passingScore = parseInt(formData.get("passingScore") as string);
  const topicsJson = formData.get("topics") as string;
  const topics = JSON.parse(topicsJson);
  const featured = formData.get("featured") === "true";
  const redirectPath = formData.get("redirectPath") as string;

  // Validate form
  if (!title.trim()) throw new Error("Title is required");
  if (!description.trim()) throw new Error("Description is required");
  if (!category) throw new Error("Category is required");
  if (!difficulty) throw new Error("Difficulty is required");
  if (duration <= 0) throw new Error("Duration must be greater than 0");
  if (passingScore < 0 || passingScore > 100)
    throw new Error("Passing score must be between 0 and 100");

  const tryoutData: TryoutFormData = {
    title,
    description,
    category,
    duration,
    difficulty,
    passingScore,
    topics,
    featured,
  };

  try {
    await createTryout(tryoutData);
    revalidatePath("/tryouts");
    redirect(redirectPath || "/tryouts");
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to create tryout");
  }
}

export async function updateTryoutAction(formData: FormData) {
  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const category = formData.get("category") as string;
  const duration = parseInt(formData.get("duration") as string);
  const difficulty = formData.get("difficulty") as string;
  const passingScore = parseInt(formData.get("passingScore") as string);
  const topicsJson = formData.get("topics") as string;
  const topics = JSON.parse(topicsJson);
  const featured = formData.get("featured") === "true";
  const redirectPath = formData.get("redirectPath") as string;

  // Validate form
  if (!title.trim()) throw new Error("Title is required");
  if (!description.trim()) throw new Error("Description is required");
  if (!category) throw new Error("Category is required");
  if (!difficulty) throw new Error("Difficulty is required");
  if (duration <= 0) throw new Error("Duration must be greater than 0");
  if (passingScore < 0 || passingScore > 100)
    throw new Error("Passing score must be between 0 and 100");

  const tryoutData: TryoutFormData = {
    title,
    description,
    category,
    duration,
    difficulty,
    passingScore,
    topics,
    featured,
  };

  try {
    await updateTryout(id, tryoutData);
    revalidatePath("/tryouts");
    redirect(redirectPath || "/tryouts");
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Failed to update tryout");
  }
}

export default async function TryoutForm({ initialData, categories, difficulties, redirectPath = "/tryouts" }: TryoutFormProps) {
  return (
    <TryoutFormClient 
      initialData={initialData}
      categories={categories}
      difficulties={difficulties}
      createAction={createTryoutAction}
      updateAction={updateTryoutAction}
      redirectPath={redirectPath}
    />
  );
}
