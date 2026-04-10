export type HealthCheckResponse = {
  status: "ok";
};

export const HealthCheckResponse = {
  parse(value: unknown): HealthCheckResponse {
    if (
      typeof value === "object" &&
      value !== null &&
      "status" in value &&
      value.status === "ok"
    ) {
      return { status: "ok" };
    }

    throw new Error("Invalid health check response");
  },
};

export type User = {
  id: string;
  email: string;
  name: string;
  role: "admin" | "student";
  createdAt: number;
  updatedAt: number;
};

export const User = {
  parse(value: unknown): User {
    if (
      typeof value === "object" &&
      value !== null &&
      "id" in value &&
      typeof value.id === "string" &&
      "email" in value &&
      typeof value.email === "string" &&
      "name" in value &&
      typeof value.name === "string" &&
      "role" in value &&
      (value.role === "admin" || value.role === "student") &&
      "createdAt" in value &&
      typeof value.createdAt === "number" &&
      "updatedAt" in value &&
      typeof value.updatedAt === "number"
    ) {
      return value as User;
    }
    throw new Error("Invalid user");
  },
};

export type Category = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  testsCount: number;
};

export const Category = {
  parse(value: unknown): Category {
    if (
      typeof value === "object" &&
      value !== null &&
      "id" in value &&
      typeof value.id === "string" &&
      "name" in value &&
      typeof value.name === "string" &&
      "description" in value &&
      typeof value.description === "string" &&
      "icon" in value &&
      typeof value.icon === "string" &&
      "color" in value &&
      typeof value.color === "string" &&
      "testsCount" in value &&
      typeof value.testsCount === "number"
    ) {
      return value as Category;
    }
    throw new Error("Invalid category");
  },
};

export type Test = {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  duration: number;
  totalQuestions: number;
  attempts: number;
  avgScore: number;
  difficulty: "Easy" | "Medium" | "Hard";
  sectionTimingMode?: "none" | "fixed";
  sectionTimings?: { name: string; minutes: number }[];
  sectionSettings?: { name: string; locked: boolean }[];
  sections: TestSection[];
};

export const Test = {
  parse(value: unknown): Test {
    // Simplified validation
    if (typeof value === "object" && value !== null && "id" in value) {
      return value as Test;
    }
    throw new Error("Invalid test");
  },
};

export type TestSection = {
  id: string;
  name: string;
  questions: Question[];
};

export type Question = {
  id: number;
  text: string;
  options: string[];
  correct: number;
  section: string;
  explanation: string;
};

export type TestAttempt = {
  id: string;
  userId: string;
  testId: string;
  testName: string;
  category: string;
  score: number;
  correct: number;
  wrong: number;
  unanswered: number;
  totalQuestions: number;
  timeSpent: number;
  date: string;
  sectionStats?: {
    name: string;
    correct: number;
    wrong: number;
    unanswered: number;
    totalQuestions: number;
    accuracy: number;
  }[];
  sectionTimeSpent?: {
    name: string;
    minutesSpent: number;
  }[];
};

export const TestAttempt = {
  parse(value: unknown): TestAttempt {
    // Simplified
    if (typeof value === "object" && value !== null && "id" in value) {
      return value as TestAttempt;
    }
    throw new Error("Invalid attempt");
  },
};
