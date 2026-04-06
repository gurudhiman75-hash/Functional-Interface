export const Storage = {
  set: (k: string, v: unknown) => localStorage.setItem(k, JSON.stringify(v)),
  get: <T = unknown>(k: string): T | null => {
    try {
      return JSON.parse(localStorage.getItem(k) ?? "null") as T;
    } catch {
      return null;
    }
  },
  remove: (k: string) => localStorage.removeItem(k),
  clear: () => localStorage.clear(),
};

export interface User {
  id: string;
  email: string;
  name: string;
}

export interface TestAttempt {
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
}

export const getUser = (): User | null => Storage.get<User>("user");
export const setUser = (user: User) => Storage.set("user", user);
export const clearAuth = () => {
  Storage.remove("user");
  Storage.remove("authToken");
};
export const getAttempts = (): TestAttempt[] => Storage.get<TestAttempt[]>("attempts") ?? [];
export const addAttempt = (attempt: TestAttempt) => {
  const attempts = getAttempts();
  attempts.unshift(attempt);
  Storage.set("attempts", attempts);
};
