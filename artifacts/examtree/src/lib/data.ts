import { Category, Test, TestAttempt, User } from "@workspace/api-zod";
import { getAuth } from "firebase/auth";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

async function apiRequest<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const auth = getAuth();
  const user = auth.currentUser;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (user) {
    const token = await user.getIdToken();
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      ...headers,
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  return response.json();
}

export interface Exam {
  id: string;
  name: string;
  year: number;
  testsCount: number;
  avgScore: number;
  categoryId: string;
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correct: number;
  section: string;
  explanation: string;
}

export interface TestSection {
  id: string;
  name: string;
  questions: Question[];
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  city: string;
  score: number;
  accuracy: number;
  testsCount: number;
  avatarSeed: string;
  isYou?: boolean;
}

// API functions
export async function getCategories(): Promise<Category[]> {
  return apiRequest<Category[]>("/categories");
}

export async function getTests(): Promise<Test[]> {
  return apiRequest<Test[]>("/tests");
}

export async function getTest(id: string): Promise<Test> {
  return apiRequest<Test>(`/tests/${id}`);
}

export async function getUserAttempts(): Promise<TestAttempt[]> {
  return apiRequest<TestAttempt[]>("/attempts");
}

export async function createAttempt(attempt: Omit<TestAttempt, "id">): Promise<TestAttempt> {
  return apiRequest<TestAttempt>("/attempts", {
    method: "POST",
    body: JSON.stringify(attempt),
  });
}

export async function getCurrentUser(): Promise<User> {
  return apiRequest<User>("/users/me");
}

// Legacy compatibility - these will be removed once frontend is fully migrated
export const categories: Category[] = [];
export const allTests: Test[] = [];
export const sampleQuestions: Question[] = [];
export const leaderboardData: LeaderboardEntry[] = [];
