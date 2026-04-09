import { doc, getDoc, setDoc } from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";

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
  role?: "admin" | "student";
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
  sectionStats?: {
    name: string;
    correct: number;
    wrong: number;
    unanswered: number;
    totalQuestions: number;
    accuracy: number; // 0-100 based on correct/(correct+wrong)
  }[];
  sectionTimeSpent?: {
    name: string;
    minutesSpent: number;
  }[];
}

export interface ActiveTestSession {
  testId: string;
  testName: string;
  category: string;
  currentSectionIndex: number;
  currentQuestionIndex: number;
  answers: Record<number, number | null>;
  flags: Record<number, boolean>;
  timeLeft: number;
  sectionTimeLeftByName: Record<string, number>;
  updatedAt: number;
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

const ACTIVE_TEST_SESSIONS_KEY = "active_test_sessions";

export const getActiveTestSessions = (): Record<string, ActiveTestSession> =>
  Storage.get<Record<string, ActiveTestSession>>(ACTIVE_TEST_SESSIONS_KEY) ?? {};

export const getActiveTestSession = (testId: string): ActiveTestSession | null =>
  getActiveTestSessions()[testId] ?? null;

export const saveActiveTestSession = (session: ActiveTestSession) => {
  const sessions = getActiveTestSessions();
  sessions[session.testId] = session;
  Storage.set(ACTIVE_TEST_SESSIONS_KEY, sessions);
};

export const clearActiveTestSession = (testId: string) => {
  const sessions = getActiveTestSessions();
  delete sessions[testId];
  Storage.set(ACTIVE_TEST_SESSIONS_KEY, sessions);
};

// ----- Admin: Categories -----
export interface AdminCategory {
  id: string;
  name: string;
  description: string;
  testsCount: number;
}

export interface AdminSubcategory {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description: string;
}

export interface AdminSectionSetting {
  name: string;
  locked: boolean;
}

export interface AdminSectionTiming {
  name: string;
  minutes: number;
}

export interface AdminTest {
  id: string;
  name: string;
  categoryId: string;
  categoryName: string;
  subcategoryId: string;
  subcategoryName: string;
  duration: number;
  totalQuestions: number;
  difficulty: "Easy" | "Medium" | "Hard";
  showDifficulty: boolean;
  sections: string[];
  sectionSettings: AdminSectionSetting[];
  sectionTimingMode: "none" | "fixed";
  sectionTimings: AdminSectionTiming[];
  attempts: number;
  avgScore: number;
}

export interface AdminQuestion {
  id: string;
  testId: string;
  section: string;
  text: string;
  options: [string, string, string, string];
  correct: number;
  explanation: string;
  createdAt: number;
}

const ADMIN_CATEGORIES_KEY = "admin_categories";
const ADMIN_SUBCATEGORIES_KEY = "admin_subcategories";
const ADMIN_TESTS_KEY = "admin_tests";
const ADMIN_QUESTIONS_KEY = "admin_questions";
const ADMIN_VERSION_KEY = "admin_data_version";
const CURRENT_VERSION = "4"; // bump to force re-seed
const ADMIN_CLOUD_COLLECTION = "admin_data";
const ADMIN_CLOUD_DOC = "main";

let ADMIN_CLOUD_SYNC_PAUSED = false;

export const pauseAdminCloudSync = () => {
  ADMIN_CLOUD_SYNC_PAUSED = true;
};

export const resumeAdminCloudSync = async () => {
  ADMIN_CLOUD_SYNC_PAUSED = false;
  await persistAdminDataToCloud();
};

export const needsReseed = (): boolean =>
  Storage.get<string>(ADMIN_VERSION_KEY) !== CURRENT_VERSION;

export const markSeeded = () => Storage.set(ADMIN_VERSION_KEY, CURRENT_VERSION);

export const getAdminCategories = (): AdminCategory[] =>
  Storage.get<AdminCategory[]>(ADMIN_CATEGORIES_KEY) ?? [];

export const saveAdminCategories = (cats: AdminCategory[]) =>
  Storage.set(ADMIN_CATEGORIES_KEY, cats);

let _idCounter = 0;
const uid = () => `${Date.now()}-${++_idCounter}-${Math.random().toString(36).slice(2, 7)}`;

export const addAdminCategory = (cat: Omit<AdminCategory, "id">) => {
  const cats = getAdminCategories();
  const newCat = { ...cat, id: uid() };
  cats.push(newCat);
  saveAdminCategories(cats);
  void persistAdminDataToCloud();
  return newCat;
};

export const updateAdminCategory = (id: string, updates: Partial<AdminCategory>) => {
  const cats = getAdminCategories().map((c) => (c.id === id ? { ...c, ...updates } : c));
  saveAdminCategories(cats);
  void persistAdminDataToCloud();
};

export const deleteAdminCategory = (id: string) => {
  const subcategoryIds = getAdminSubcategories().filter((s) => s.categoryId === id).map((s) => s.id);
  saveAdminCategories(getAdminCategories().filter((c) => c.id !== id));
  saveAdminSubcategories(getAdminSubcategories().filter((s) => s.categoryId !== id));
  saveAdminTests(getAdminTests().filter((t) => t.categoryId !== id && !subcategoryIds.includes(t.subcategoryId)));
  void persistAdminDataToCloud();
};

export const getAdminTests = (): AdminTest[] =>
  (Storage.get<AdminTest[]>(ADMIN_TESTS_KEY) ?? []).map((t) => ({
    ...t,
    subcategoryId: t.subcategoryId ?? "",
    subcategoryName: t.subcategoryName ?? "",
    showDifficulty: t.showDifficulty ?? true,
    sectionSettings:
      t.sectionSettings ??
      (t.sections ?? []).map((name) => ({ name, locked: false })),
    sectionTimingMode: t.sectionTimingMode ?? "none",
    sectionTimings:
      t.sectionTimings ??
      (t.sections ?? []).map((name) => ({ name, minutes: 0 })),
  }));

export const saveAdminTests = (tests: AdminTest[]) =>
  Storage.set(ADMIN_TESTS_KEY, tests);

export const addAdminTest = (test: Omit<AdminTest, "id" | "attempts" | "avgScore">) => {
  const tests = getAdminTests();
  const newTest = {
    ...test,
    sections: test.sections ?? [],
    sectionSettings: test.sectionSettings ?? (test.sections ?? []).map((name) => ({ name, locked: false })),
    sectionTimingMode: test.sectionTimingMode ?? "none",
    sectionTimings: test.sectionTimings ?? (test.sections ?? []).map((name) => ({ name, minutes: 0 })),
    showDifficulty: test.showDifficulty ?? true,
    subcategoryId: test.subcategoryId ?? "",
    subcategoryName: test.subcategoryName ?? "",
    id: uid(),
    attempts: 0,
    avgScore: 0,
  };
  tests.push(newTest);
  saveAdminTests(tests);
  void persistAdminDataToCloud();
  return newTest;
};

export const updateAdminTest = (id: string, updates: Partial<AdminTest>) => {
  const tests = getAdminTests().map((t) => (t.id === id ? { ...t, ...updates } : t));
  saveAdminTests(tests);
  void persistAdminDataToCloud();
};

export const deleteAdminTest = (id: string) => {
  saveAdminTests(getAdminTests().filter((t) => t.id !== id));
  saveAdminQuestions(getAdminQuestions().filter((q) => q.testId !== id));
  void persistAdminDataToCloud();
};

export const getAdminQuestions = (): AdminQuestion[] =>
  Storage.get<AdminQuestion[]>(ADMIN_QUESTIONS_KEY) ?? [];

export const saveAdminQuestions = (questions: AdminQuestion[]) =>
  Storage.set(ADMIN_QUESTIONS_KEY, questions);

export const addAdminQuestion = (question: Omit<AdminQuestion, "id" | "createdAt">) => {
  const questions = getAdminQuestions();
  const newQuestion: AdminQuestion = { ...question, id: uid(), createdAt: Date.now() };
  questions.push(newQuestion);
  saveAdminQuestions(questions);
  void persistAdminDataToCloud();
  return newQuestion;
};

export const updateAdminQuestion = (id: string, updates: Partial<AdminQuestion>) => {
  const questions = getAdminQuestions().map((q) => (q.id === id ? { ...q, ...updates } : q));
  saveAdminQuestions(questions);
  void persistAdminDataToCloud();
};

export const deleteAdminQuestion = (id: string) => {
  saveAdminQuestions(getAdminQuestions().filter((q) => q.id !== id));
  void persistAdminDataToCloud();
};

type CloudAdminData = {
  version: string;
  categories: AdminCategory[];
  subcategories: AdminSubcategory[];
  tests: AdminTest[];
  questions: AdminQuestion[];
  updatedAt: number;
};

export const getAdminSubcategories = (): AdminSubcategory[] =>
  Storage.get<AdminSubcategory[]>(ADMIN_SUBCATEGORIES_KEY) ?? [];

export const saveAdminSubcategories = (items: AdminSubcategory[]) =>
  Storage.set(ADMIN_SUBCATEGORIES_KEY, items);

export const addAdminSubcategory = (item: Omit<AdminSubcategory, "id">) => {
  const items = getAdminSubcategories();
  const newItem = { ...item, id: uid() };
  items.push(newItem);
  saveAdminSubcategories(items);
  void persistAdminDataToCloud();
  return newItem;
};

export const updateAdminSubcategory = (id: string, updates: Partial<AdminSubcategory>) => {
  const items = getAdminSubcategories().map((s) => (s.id === id ? { ...s, ...updates } : s));
  saveAdminSubcategories(items);
  void persistAdminDataToCloud();
};

export const deleteAdminSubcategory = (id: string) => {
  saveAdminSubcategories(getAdminSubcategories().filter((s) => s.id !== id));
  saveAdminTests(getAdminTests().filter((t) => t.subcategoryId !== id));
  void persistAdminDataToCloud();
};

async function persistAdminDataToCloud() {
  if (ADMIN_CLOUD_SYNC_PAUSED) return;
  try {
    const db = getFirebaseDb();
    await setDoc(doc(db, ADMIN_CLOUD_COLLECTION, ADMIN_CLOUD_DOC), {
      version: CURRENT_VERSION,
      categories: getAdminCategories(),
      subcategories: getAdminSubcategories(),
      tests: getAdminTests(),
      questions: getAdminQuestions(),
      updatedAt: Date.now(),
    } satisfies CloudAdminData);
  } catch {
    // Keep local mode working even if cloud write fails.
  }
}

export async function hydrateAdminDataFromCloud() {
  try {
    const db = getFirebaseDb();
    const snap = await getDoc(doc(db, ADMIN_CLOUD_COLLECTION, ADMIN_CLOUD_DOC));
    if (!snap.exists()) {
      await persistAdminDataToCloud();
      return;
    }

    const data = snap.data() as Partial<CloudAdminData>;
    if (Array.isArray(data.categories)) saveAdminCategories(data.categories);
    if (Array.isArray(data.subcategories)) saveAdminSubcategories(data.subcategories);
    if (Array.isArray(data.tests)) saveAdminTests(data.tests);
    if (Array.isArray(data.questions)) saveAdminQuestions(data.questions);
    if (typeof data.version === "string") Storage.set(ADMIN_VERSION_KEY, data.version);
  } catch {
    // Ignore cloud read errors and continue with local data.
  }
}
