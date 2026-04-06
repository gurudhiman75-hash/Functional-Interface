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

// ----- Admin: Categories -----
export interface AdminCategory {
  id: string;
  name: string;
  description: string;
  testsCount: number;
}

export interface AdminTest {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  duration: number;
  totalQuestions: number;
  difficulty: "Easy" | "Medium" | "Hard";
  attempts: number;
  avgScore: number;
}

const ADMIN_CATEGORIES_KEY = "admin_categories";
const ADMIN_TESTS_KEY = "admin_tests";

export const getAdminCategories = (): AdminCategory[] =>
  Storage.get<AdminCategory[]>(ADMIN_CATEGORIES_KEY) ?? [];

export const saveAdminCategories = (cats: AdminCategory[]) =>
  Storage.set(ADMIN_CATEGORIES_KEY, cats);

export const addAdminCategory = (cat: Omit<AdminCategory, "id">) => {
  const cats = getAdminCategories();
  const newCat = { ...cat, id: Date.now().toString() };
  cats.push(newCat);
  saveAdminCategories(cats);
  return newCat;
};

export const updateAdminCategory = (id: string, updates: Partial<AdminCategory>) => {
  const cats = getAdminCategories().map((c) => (c.id === id ? { ...c, ...updates } : c));
  saveAdminCategories(cats);
};

export const deleteAdminCategory = (id: string) => {
  saveAdminCategories(getAdminCategories().filter((c) => c.id !== id));
  saveAdminTests(getAdminTests().filter((t) => t.categoryId !== id));
};

export const getAdminTests = (): AdminTest[] =>
  Storage.get<AdminTest[]>(ADMIN_TESTS_KEY) ?? [];

export const saveAdminTests = (tests: AdminTest[]) =>
  Storage.set(ADMIN_TESTS_KEY, tests);

export const addAdminTest = (test: Omit<AdminTest, "id" | "attempts" | "avgScore">) => {
  const tests = getAdminTests();
  const newTest = { ...test, id: Date.now().toString(), attempts: 0, avgScore: 0 };
  tests.push(newTest);
  saveAdminTests(tests);
  return newTest;
};

export const updateAdminTest = (id: string, updates: Partial<AdminTest>) => {
  const tests = getAdminTests().map((t) => (t.id === id ? { ...t, ...updates } : t));
  saveAdminTests(tests);
};

export const deleteAdminTest = (id: string) => {
  saveAdminTests(getAdminTests().filter((t) => t.id !== id));
};
