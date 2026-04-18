import { apiRequest } from "@/lib/api";

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
  id?: string;      // server-assigned UUID; absent for locally-stored attempts
  userId?: string;
  testId: string;
  testName: string;
  category: string;
  score: number;
  correct: number;
  wrong: number;
  unanswered: number;
  totalQuestions: number;
  timeSpent: number;
  createdAt: string;
  attemptType: "REAL" | "PRACTICE";
  isFirstAttempt?: boolean; // Only first real attempt counts for leaderboard
  originalAttemptId?: string; // For practice mode, reference to original real attempt
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
  questionReview?: {
    questionId: number;
    section: string;
    text: string;
    options: string[];
    textHi?: string;
    textPa?: string;
    optionsHi?: string[];
    optionsPa?: string[];
    explanationHi?: string;
    explanationPa?: string;
    selected: number | null;
    correct: number;
    flagged: boolean;
    explanation: string;
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
  attemptType: "REAL" | "PRACTICE";
  lockedSections: number[]; // Indices of sections that are permanently locked
  originalAttemptId?: string; // For practice mode
  sectionCompletionTimes?: Record<string, number>; // Time spent per section in real attempt
  visitedQuestionIds?: number[]; // Track which questions have been opened
}

export const getUser = (): User | null => Storage.get<User>("user");
export const setUser = (user: User) => Storage.set("user", user);
export const clearAuth = () => {
  Storage.remove("user");
  Storage.remove("authToken");
};
export const getAttempts = (): TestAttempt[] => Storage.get<TestAttempt[]>("attempts") ?? [];

// ----- Daily Streak -----

export interface StreakData {
  currentStreak: number;
  longestStreak: number;
  /** ISO date string "YYYY-MM-DD" of the last day a REAL test was completed (local timezone) */
  lastAttemptDate: string | null;
  /** Whether the streak was just incremented (used for celebration trigger) */
  justIncremented: boolean;
}

const STREAK_KEY = "streak_data";

/** Returns today's date as "YYYY-MM-DD" in the user's local timezone (timezone-safe). */
function localDateString(date = new Date()): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

export const getStreak = (): StreakData =>
  Storage.get<StreakData>(STREAK_KEY) ?? {
    currentStreak: 0,
    longestStreak: 0,
    lastAttemptDate: null,
    justIncremented: false,
  };

/**
 * Called after a REAL test attempt is saved.
 * Recalculates currentStreak / longestStreak based on today's local date.
 * Returns the updated StreakData.
 */
export function updateStreak(): StreakData {
  const today = localDateString();
  const data = getStreak();

  // Already counted today — just clear any stale celebration flag and return
  if (data.lastAttemptDate === today) {
    const updated: StreakData = { ...data, justIncremented: false };
    Storage.set(STREAK_KEY, updated);
    return updated;
  }

  let newCurrent: number;
  let justIncremented = false;

  if (data.lastAttemptDate === null) {
    // First ever attempt
    newCurrent = 1;
    justIncremented = true;
  } else {
    // Check if yesterday
    const yesterday = localDateString(new Date(Date.now() - 86_400_000));
    if (data.lastAttemptDate === yesterday) {
      newCurrent = data.currentStreak + 1;
      justIncremented = true;
    } else {
      // Gap of 2+ days → reset
      newCurrent = 1;
      justIncremented = true; // new streak starting
    }
  }

  const updated: StreakData = {
    currentStreak: newCurrent,
    longestStreak: Math.max(data.longestStreak, newCurrent),
    lastAttemptDate: today,
    justIncremented,
  };
  Storage.set(STREAK_KEY, updated);
  return updated;
}

/** Clears the justIncremented flag once the celebration has been shown. */
export function acknowledgeStreakCelebration(): void {
  const data = getStreak();
  if (data.justIncremented) {
    Storage.set(STREAK_KEY, { ...data, justIncremented: false });
  }
}

export const addAttempt = (attempt: TestAttempt) => {
  const attempts = getAttempts();
  attempts.unshift(attempt);
  Storage.set("attempts", attempts);
  // Update daily streak for REAL attempts only
  if (attempt.attemptType === "REAL") {
    updateStreak();
  }
};

// ----- Percentile history (per-test leaderboard percentile tracking) -----

const PERCENTILE_HISTORY_KEY = "percentile_history";

/**
 * Returns the stored percentile map: { [testId]: topPercent }
 * topPercent is a 1-100 number where lower = better (e.g. 5 means "top 5%").
 */
export const getPercentileHistory = (): Record<string, number> =>
  Storage.get<Record<string, number>>(PERCENTILE_HISTORY_KEY) ?? {};

/** Stores/updates the percentile for a given test. */
export const recordPercentile = (testId: string, topPercent: number): void => {
  const history = getPercentileHistory();
  history[testId] = topPercent;
  Storage.set(PERCENTILE_HISTORY_KEY, history);
};

// ----- Daily challenge completion tracking -----

const DAILY_CHALLENGE_KEY = "daily_challenge_status";

export interface DailyChallengeStatus {
  /** "YYYY-MM-DD" local date of the last completed daily challenge */
  completedDate: string | null;
  /** The testId that was completed */
  completedTestId: string | null;
}

export const getDailyChallengeStatus = (): DailyChallengeStatus =>
  Storage.get<DailyChallengeStatus>(DAILY_CHALLENGE_KEY) ?? {
    completedDate: null,
    completedTestId: null,
  };

/** Call after a REAL attempt on the daily challenge test. */
export const recordDailyChallengeCompleted = (testId: string): void => {
  const today = new Date().toISOString().slice(0, 10);
  Storage.set(DAILY_CHALLENGE_KEY, { completedDate: today, completedTestId: testId });
};

/** Returns true if today's challenge has already been completed. */
export const isDailyChallengeCompletedToday = (challengeTestId: string): boolean => {
  const today = new Date().toISOString().slice(0, 10);
  const status = getDailyChallengeStatus();
  return status.completedDate === today && status.completedTestId === challengeTestId;
};

// ----- Attempt + Response tracking -----

export interface AttemptRecord {
  id: string;           // uuid-style: `${userId}-${testId}-${Date.now()}`
  userId: string;
  testId: string;
  mode: "REAL" | "PRACTICE";
  attemptNumber: number; // 1-based count of this user+test+mode combo
  startTime: number;    // epoch ms
  endTime: number | null;
}

export interface QuestionResponse {
  attemptId: string;
  questionId: number;
  selectedOption: number | null;
  timeTaken: number;    // seconds spent on this question before selecting
}

const ATTEMPT_RECORDS_KEY = "attempt_records";
const QUESTION_RESPONSES_KEY = "question_responses";

export const getAttemptRecords = (): AttemptRecord[] =>
  Storage.get<AttemptRecord[]>(ATTEMPT_RECORDS_KEY) ?? [];

export const saveAttemptRecord = (record: AttemptRecord): void => {
  const records = getAttemptRecords();
  const idx = records.findIndex((r) => r.id === record.id);
  if (idx >= 0) records[idx] = record;
  else records.unshift(record);
  Storage.set(ATTEMPT_RECORDS_KEY, records);
};

export const getAttemptResponses = (attemptId: string): QuestionResponse[] =>
  (Storage.get<QuestionResponse[]>(QUESTION_RESPONSES_KEY) ?? []).filter(
    (r) => r.attemptId === attemptId,
  );

export const saveQuestionResponse = (response: QuestionResponse): void => {
  const all = Storage.get<QuestionResponse[]>(QUESTION_RESPONSES_KEY) ?? [];
  const idx = all.findIndex(
    (r) => r.attemptId === response.attemptId && r.questionId === response.questionId,
  );
  if (idx >= 0) all[idx] = response;
  else all.push(response);
  Storage.set(QUESTION_RESPONSES_KEY, all);
};

/** How many times this user has attempted this test in the given mode. */
export const countPriorAttempts = (
  userId: string,
  testId: string,
  mode: "REAL" | "PRACTICE",
): number =>
  getAttemptRecords().filter(
    (r) => r.userId === userId && r.testId === testId && r.mode === mode,
  ).length;

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

export const clearStudentLocalData = () => {
  Storage.remove("attempts");
  Storage.remove(ACTIVE_TEST_SESSIONS_KEY);
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
  /** Languages available for exams in this subcategory */
  languages?: string[];
}

export type TestAccess = "free" | "paid";
export type TestKind = "full-length" | "sectional" | "topic-wise";

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
  access: TestAccess;
  kind: TestKind;
  duration: number;
  totalQuestions: number;
  difficulty: "Easy" | "Medium" | "Hard";
  showDifficulty: boolean;
  sections: string[];
  sectionIds?: string[];
  topicId?: string;
  topicName?: string;
  sectionSettings: AdminSectionSetting[];
  sectionTimingMode: "none" | "fixed";
  sectionTimings: AdminSectionTiming[];
  attempts: number;
  avgScore: number;
  /** Languages available for this test, e.g. ["en"], ["en","pa"]. Overrides subcategory languages for upload validation. */
  languages?: string[];
}

export interface AdminQuestion {
  id: string;
  testId: string;
  section: string;
  topic?: string;
  text: string;
  options: [string, string, string, string];
  correct: number;
  explanation: string;
  // Bilingual translation fields (optional)
  textHi?: string;
  optionsHi?: [string, string, string, string];
  explanationHi?: string;
  textPa?: string;
  optionsPa?: [string, string, string, string];
  explanationPa?: string;
  createdAt: number;
}

const ADMIN_CATEGORIES_KEY = "admin_categories";
const ADMIN_SUBCATEGORIES_KEY = "admin_subcategories";
const ADMIN_TESTS_KEY = "admin_tests";
const ADMIN_QUESTIONS_KEY = "admin_questions";
const ADMIN_VERSION_KEY = "admin_data_version";
const CURRENT_VERSION = "5"; // bump to force re-seed
const ADMIN_CLOUD_COLLECTION = "admin_data";
const ADMIN_CLOUD_DOC = "main";

let ADMIN_CLOUD_SYNC_PAUSED = false;

export const pauseAdminCloudSync = () => {
  ADMIN_CLOUD_SYNC_PAUSED = true;
};

export const resumeAdminCloudSync = async () => {
  ADMIN_CLOUD_SYNC_PAUSED = false;
  await syncAdminDataToCloudOrThrow();
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
    access: t.access ?? "free",
    kind: t.kind ?? "full-length",
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
    access: test.access ?? "free",
    kind: test.kind ?? "full-length",
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

function buildAdminSnapshot() {
  return {
    version: CURRENT_VERSION,
    categories: getAdminCategories(),
    subcategories: getAdminSubcategories(),
    tests: getAdminTests(),
    questions: getAdminQuestions(),
    updatedAt: Date.now(),
  };
}

export async function syncAdminDataToCloudOrThrow() {
  await apiRequest("/admin-data", {
    method: "PUT",
    body: JSON.stringify(buildAdminSnapshot()),
  });
}

/**
 * Delete a single test (and its questions) on the server without triggering
 * a full snapshot PUT — avoids create/update validation firing on delete.
 */
export async function deleteTestFromCloud(id: string): Promise<void> {
  await apiRequest(`/admin-data/tests/${id}`, { method: "DELETE" });
}

/**
 * Delete a single category (and all its subcategories, tests, questions) on
 * the server without triggering a full snapshot PUT.
 */
export async function deleteCategoryFromCloud(id: string): Promise<void> {
  await apiRequest(`/admin-data/categories/${id}`, { method: "DELETE" });
}

/**
 * Delete a single subcategory (and all its tests, questions) on the server
 * without triggering a full snapshot PUT.
 */
export async function deleteSubcategoryFromCloud(id: string): Promise<void> {
  await apiRequest(`/admin-data/subcategories/${id}`, { method: "DELETE" });
}

async function persistAdminDataToCloud() {
  if (ADMIN_CLOUD_SYNC_PAUSED) return;
  try {
    await syncAdminDataToCloudOrThrow();
  } catch {
    // Keep local mode working even if cloud write fails.
  }
}

export async function hydrateAdminDataFromCloud(): Promise<boolean> {
  try {
    const snapshot = await apiRequest<{
      categories: AdminCategory[];
      subcategories: AdminSubcategory[];
      tests: AdminTest[];
      questions: AdminQuestion[];
    }>("/admin-data");
    saveAdminCategories(snapshot.categories);
    saveAdminSubcategories(snapshot.subcategories);
    saveAdminTests(snapshot.tests);
    saveAdminQuestions(snapshot.questions);
    return true;
  } catch (error) {
    console.warn("Admin data hydration failed, using local cache:", error);
    return false;
  }
}
