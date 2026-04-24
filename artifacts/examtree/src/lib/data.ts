import { apiRequest } from "@/lib/api";
import type { TestAttempt } from "@/lib/storage";

// Define types locally for now
export type Category = {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  testsCount: number;
  exams?: Exam[];
};

export type TestSection = {
  id: string;
  name: string;
  questions: Question[];
};

export type Test = {
  id: string;
  name: string;
  category: string;
  categoryName?: string;
  categoryId: string;
  subcategoryId?: string;
  subcategoryName?: string;
  access?: "free" | "paid";
  /** Checkout amount in cents when access is paid */
  priceCents?: number | null;
  kind?: "full-length" | "sectional" | "topic-wise";
  duration: number;
  totalQuestions: number;
  attempts: number;
  avgScore: number;
  difficulty: "Easy" | "Medium" | "Hard";
  sectionTimingMode?: "none" | "fixed";
  sectionTimings?: { name: string; minutes: number }[];
  sectionSettings?: { name: string; locked: boolean }[];
  sections: TestSection[];
  /** Languages available for this test, e.g. ["en"], ["en","hi"], ["en","pa"] */
  languages?: string[];
  /** Marks awarded per correct answer (defaults to 1 when absent) */
  marksPerQuestion?: number;
  /** Marks deducted per wrong answer, non-negative (defaults to 0 when absent) */
  negativeMarks?: number;
  /** Marks for unattempted questions (defaults to 0 when absent) */
  unattemptedMarks?: number;
};

export type PurchasedTest = {
  id: string;
  name: string;
  category: string;
  categoryId: string;
  subcategoryId?: string;
  subcategoryName?: string;
  access: "free" | "paid";
  priceCents: number | null;
  kind: "full-length" | "sectional" | "topic-wise";
  duration: number;
  totalQuestions: number;
  attempts: number;
  avgScore: number;
  difficulty: "Easy" | "Medium" | "Hard";
  purchasedAt: string;
  source: "razorpay" | "mock" | "admin";
  razorpayOrderId: string | null;
  razorpayPaymentId: string | null;
};

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
  // Bilingual translation fields
  textHi?: string | null;
  optionsHi?: string[] | null;
  explanationHi?: string | null;
  textPa?: string | null;
  optionsPa?: string[] | null;
  explanationPa?: string | null;
  /** Optional image URL displayed above the question */
  imageUrl?: string | null;
  questionType?: "text" | "image" | "di";
  diSetId?: number | null;
  /** Denormalized DI set data (from snapshot join) */
  diSetTitle?: string | null;
  diSetImageUrl?: string | null;
  diSetDescription?: string | null;
}

export type Bundle = {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  price: number;
  originalPrice?: number;
  testsCount: number;
  features: string[];
  isPopular: boolean;
  order: number;
  createdAt: string;
};

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

export interface Subcategory {
  id: string;
  categoryId: string;
  categoryName: string;
  name: string;
  description: string;
  icon?: string;
  /** Languages available for exams in this subcategory */
  languages?: string[];
}

// API functions
export async function getCategories(): Promise<Category[]> {
  console.log("getCategories called");
  return apiRequest<Category[]>("/categories");
}

export async function getSubcategories(): Promise<Subcategory[]> {
  return apiRequest<Subcategory[]>("/subcategories");
}

export async function getTests(): Promise<Test[]> {
  console.log("getTests called");
  return apiRequest<Test[]>("/tests");
}

export async function getCategoryFreeTestIds(category: string): Promise<{ id: string; name: string }[]> {
  return apiRequest<{ id: string; name: string }[]>(`/tests/category-free-ids?category=${encodeURIComponent(category)}`);
}

export async function getTest(id: string): Promise<Test> {
  return apiRequest<Test>(`/tests/${id}`);
}

export async function fetchMyEntitlements(): Promise<{ testIds: string[] }> {
  return apiRequest<{ testIds: string[] }>("/users/me/entitlements");
}

export async function createRazorpayOrder(body: {
  testId: string;
  successPath?: string;
}): Promise<{
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  testName: string;
}> {
  return apiRequest("/billing/razorpay/create-order", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function verifyRazorpayPayment(body: {
  testId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<{ ok: boolean }> {
  return apiRequest("/billing/razorpay/verify", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function checkPurchase(testId: string): Promise<{
  purchased: boolean;
  testId: string;
  access: "free" | "paid";
  priceCents: number | null;
}> {
  return apiRequest(`/billing/check-purchase?testId=${encodeURIComponent(testId)}`, {
    method: "GET",
  });
}

export async function getMyTests(): Promise<{ purchasedTests: PurchasedTest[] }> {
  return apiRequest("/tests/my-tests", {
    method: "GET",
  });
}

export async function mockUnlockTest(testId: string): Promise<{ ok: boolean }> {
  return apiRequest<{ ok: boolean }>("/billing/mock-unlock", {
    method: "POST",
    body: JSON.stringify({ testId }),
  });
}

export async function getUserAttempts(userId?: string): Promise<TestAttempt[]> {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
  return apiRequest<TestAttempt[]>(`/attempts${query}`);
}

export interface LeaderboardRow {
  rank: number;
  userId: string;
  userName: string;
  score: number;
  testName: string;
  category: string;
  createdAt: string;
}

export interface LeaderboardResponse {
  leaderboard: LeaderboardRow[];
  currentUserRank?: number;
  /** Total number of users ranked for this test (used for accurate percentile calculation). */
  totalParticipants?: number;
}

export async function getLeaderboard(testId: string): Promise<LeaderboardResponse> {
  return apiRequest<LeaderboardResponse>(`/leaderboard?testId=${encodeURIComponent(testId)}`);
}

export interface DailyChallenge {
  testId: string;
  testName: string;
  date: string; // "YYYY-MM-DD"
  totalParticipants: number;
}

export async function getDailyChallenge(): Promise<DailyChallenge> {
  return apiRequest<DailyChallenge>("/daily-challenge");
}

export interface SubmitAttemptPayload {
  testId: string;
  testName: string;
  category: string;
  attemptType: "REAL" | "PRACTICE";
  timeSpent: number;
  responses: { questionId: number; selectedOption: number | null; timeTaken: number }[];
  flags?: Record<number, boolean>;
  sectionTimeSpent?: { name: string; minutesSpent: number }[];
  originalAttemptId?: string;
}

export async function submitAttempt(payload: SubmitAttemptPayload): Promise<TestAttempt> {
  return apiRequest<TestAttempt>("/attempts", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function createAttempt(attempt: Omit<TestAttempt, "id">): Promise<TestAttempt> {
  return apiRequest<TestAttempt>("/attempts", {
    method: "POST",
    body: JSON.stringify(attempt),
  });
}

export async function postResponses(
  attemptId: string,
  responses: { questionId: number; selectedOption: number | null; timeTaken: number }[],
): Promise<void> {
  await apiRequest<unknown>("/responses", {
    method: "POST",
    body: JSON.stringify({ attemptId, responses }),
  });
}


export async function getAttemptById(attemptId: string): Promise<TestAttempt> {
  return apiRequest<TestAttempt>(`/attempts/${encodeURIComponent(attemptId)}`);
}

export interface ResponseRow {
  id: number;
  attemptId: string;
  questionId: number;
  selectedOption: number | null;
  timeTaken: number;
  createdAt: string;
}

export async function getResponsesByAttemptId(attemptId: string): Promise<ResponseRow[]> {
  return apiRequest<ResponseRow[]>(`/responses?attemptId=${encodeURIComponent(attemptId)}`);
}

export async function getBundles(): Promise<Bundle[]> {
  console.log("getBundles called");
  return apiRequest<Bundle[]>("/bundles");
}

export async function getBundle(id: string): Promise<Bundle> {
  return apiRequest<Bundle>(`/bundles/${id}`);
}

export async function getBundlesByCategory(categoryId: string): Promise<Bundle[]> {
  return apiRequest<Bundle[]>(`/bundles/category/${categoryId}`);
}

export async function createBundle(body: {
  name: string;
  description: string;
  price: number;
  packageIds: string[];
}): Promise<{ id: string }> {
  return apiRequest<{ id: string }>("/bundles", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// Analytics types and functions
export interface AnalyticsResponse {
  averageScore: number;
  highestScore: number;
  totalAttempts: number;
  recentAttempts: {
    testName: string;
    score: number;
    createdAt: string;
  }[];
}

export interface TestAttempt {
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
  createdAt: string;
  /** "REAL" | "PRACTICE" — null/absent means legacy row, treated as REAL */
  attemptType?: "REAL" | "PRACTICE" | null;
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

export async function getAnalytics(userId?: string): Promise<AnalyticsResponse> {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
  return apiRequest<AnalyticsResponse>(`/analytics${query}`);
}

export interface WeakAreaSection {
  section: string;
  accuracy: number;
  avgTimeSecs: number;
  totalQuestions: number;
  trend?: "improving" | "declining" | "stable";
  trendLabel?: string;
}

export interface WeakAreaTopic {
  topic: string;
  section: string;
  accuracy: number;
  totalQuestions: number;
}

export interface WeakAreasResponse {
  weakestSections: WeakAreaSection[];
  strongestSections: WeakAreaSection[];
  weakestTopics: WeakAreaTopic[];
  strongestTopics: WeakAreaTopic[];
  recommendations: string[];
}

export async function getWeakAreaAnalysis(attemptId?: string): Promise<WeakAreasResponse> {
  const qs = attemptId ? `?attemptId=${encodeURIComponent(attemptId)}` : "";
  return apiRequest<WeakAreasResponse>(`/analytics/weak-areas${qs}`);
}

// Package types and functions
export interface PackageTest {
  testId: string;
  testName: string;
  isFree: number;
  access: "free" | "paid";
}

export interface Package {
  id: string;
  name: string;
  description: string;
  originalPriceCents: number;
  discountPercent: number;
  finalPriceCents: number;
  testCount: number;
  features?: string[];
  isPopular: number;
  order: number;
  createdAt: string;
  tests?: PackageTest[];
}

export interface UserPackage extends Package {
  purchasedAt: string;
}

export async function getPackages(): Promise<Package[]> {
  return apiRequest<Package[]>("/packages");
}

export async function getPackage(id: string): Promise<Package> {
  return apiRequest<Package>(`/packages/${id}`);
}

export async function getPackagesByExam(examId: string): Promise<{ id: string; name: string; finalPriceCents: number; originalPriceCents: number | null; discountPercent: number; testIds: string[] }[]> {
  return apiRequest(`/packages/by-exam/${encodeURIComponent(examId)}`);
}

export async function getPackagesByTest(testId: string): Promise<Pick<Package, "id" | "name" | "description" | "finalPriceCents" | "originalPriceCents" | "discountPercent" | "isPopular">[]> {
  return apiRequest(`/packages/by-test/${encodeURIComponent(testId)}`);
}

export interface MasterSection { id: string; name: string; }
export interface MasterTopic { id: string; name: string; }

export async function getSections(): Promise<MasterSection[]> {
  return apiRequest("/sections");
}

export async function createSection(name: string): Promise<MasterSection> {
  return apiRequest("/sections", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function deleteSection(sectionId: string): Promise<void> {
  return apiRequest(`/sections/${encodeURIComponent(sectionId)}`, { method: "DELETE" });
}

export async function getAllTopics(): Promise<MasterTopic[]> {
  return apiRequest("/topics");
}

export async function createTopic(name: string): Promise<MasterTopic> {
  return apiRequest("/topics", {
    method: "POST",
    body: JSON.stringify({ name }),
  });
}

export async function renameTopic(topicId: string, name: string): Promise<MasterTopic> {
  return apiRequest(`/topics/${encodeURIComponent(topicId)}`, {
    method: "PATCH",
    body: JSON.stringify({ name }),
  });
}

export async function deleteTopic(topicId: string): Promise<void> {
  return apiRequest(`/topics/${encodeURIComponent(topicId)}`, {
    method: "DELETE",
  });
}

export async function getPackagesByCategory(categoryName: string): Promise<Pick<Package, "id" | "name" | "description" | "finalPriceCents" | "originalPriceCents" | "discountPercent" | "isPopular">[]> {
  return apiRequest(`/packages/by-category/${encodeURIComponent(categoryName)}`);
}

export async function createPackageOrder(packageId: string): Promise<{
  orderId: string;
  amount: number;
  currency: string;
  keyId: string;
  packageName: string;
  packageId: string;
}> {
  return apiRequest("/packages/create-order", {
    method: "POST",
    body: JSON.stringify({ packageId }),
  });
}

export async function verifyPackagePayment(body: {
  packageId: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<{ ok: boolean; message: string }> {
  return apiRequest("/packages/verify", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function getUserPackages(userId?: string): Promise<UserPackage[]> {
  const query = userId ? `?userId=${encodeURIComponent(userId)}` : "";
  return apiRequest<UserPackage[]>(`/packages/user/my-packages${query}`);
}

export async function createPackage(body: {
  name: string;
  description: string;
  originalPriceCents: number;
  discountPercent: number;
  finalPriceCents: number;
  testIds: string[];
  features: string[];
  isPopular: number;
  order: number;
}): Promise<Package> {
  return apiRequest<Package>("/packages", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// ── Question Bank API ──────────────────────────────────────────────────────────

export type QuestionDifficulty = "Easy" | "Medium" | "Hard";

export interface BankQuestion {
  id: number;
  testId: string;
  text: string | null;
  options: [string, string, string, string];
  correct: number;
  section: string;
  sectionId: string | null;
  topic: string;
  topicId: string | null;
  globalTopicId: string;
  difficulty: QuestionDifficulty | null;
  explanation: string | null;
  textHi?: string | null;
  optionsHi?: [string, string, string, string] | null;
  explanationHi?: string | null;
  textPa?: string | null;
  optionsPa?: [string, string, string, string] | null;
  explanationPa?: string | null;
  /** Firebase Storage URL for question image */
  imageUrl?: string | null;
  questionType?: "text" | "image" | "di";
  diSetId?: number | null;
  createdAt: string;
  usageCount: number;
  lastUsedAt: string | null;
}

export interface BankQuestionUsage {
  testId: string;
  testName: string;
  testCategory: string;
  testDifficulty: QuestionDifficulty;
  addedAt: string;
}

export interface QuestionBankPage {
  items: BankQuestion[];
  total: number;
  page: number;
  pageSize: number;
}

export interface SmartSelectResult {
  questions: BankQuestion[];
  requestedCount: number;
  returnedCount: number;
}

export async function getQuestionBank(params: {
  page?: number;
  pageSize?: number;
  search?: string;
  section?: string;
  topic?: string;
  difficulty?: QuestionDifficulty;
  diSetId?: number;
}): Promise<QuestionBankPage> {
  const qs = new URLSearchParams();
  if (params.page) qs.set("page", String(params.page));
  if (params.pageSize) qs.set("pageSize", String(params.pageSize));
  if (params.search) qs.set("search", params.search);
  if (params.section) qs.set("section", params.section);
  if (params.topic) qs.set("topic", params.topic);
  if (params.difficulty) qs.set("difficulty", params.difficulty);
  if (params.diSetId !== undefined) qs.set("diSetId", String(params.diSetId));
  return apiRequest(`/question-bank?${qs.toString()}`);
}

export async function getBankQuestion(id: number): Promise<BankQuestion & { usageCount: number; lastUsedAt: string | null }> {
  return apiRequest(`/question-bank/${id}`);
}

export async function getBankQuestionTests(id: number): Promise<BankQuestionUsage[]> {
  return apiRequest(`/question-bank/${id}/tests`);
}

export async function createBankQuestion(body: {
  testId?: string;
  text?: string;
  options: [string, string, string, string];
  correct: number;
  section: string;
  sectionId?: string;
  topic?: string;
  topicId?: string;
  globalTopicId: string;
  explanation?: string;
  difficulty?: QuestionDifficulty;
  textHi?: string;
  optionsHi?: [string, string, string, string];
  explanationHi?: string;
  textPa?: string;
  optionsPa?: [string, string, string, string];
  explanationPa?: string;
}): Promise<BankQuestion> {
  return apiRequest("/question-bank", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateBankQuestion(
  id: number,
  body: Partial<Omit<BankQuestion, "id" | "createdAt" | "usageCount" | "lastUsedAt">>,
): Promise<BankQuestion> {
  return apiRequest(`/question-bank/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteBankQuestion(id: number): Promise<void> {
  return apiRequest(`/question-bank/${id}`, { method: "DELETE" });
}

export async function addQuestionsToTest(
  testId: string,
  questionIds: number[],
): Promise<{ added: number[]; alreadyPresent: number[]; total: number }> {
  return apiRequest("/question-bank/add-to-test", {
    method: "POST",
    body: JSON.stringify({ testId, questionIds }),
  });
}

export async function removeQuestionFromTest(testId: string, questionId: number): Promise<void> {
  return apiRequest("/question-bank/remove-from-test", {
    method: "DELETE",
    body: JSON.stringify({ testId, questionId }),
  });
}

export async function smartSelectQuestions(params: {
  testId?: string;
  count?: number;
  section?: string;
  topic?: string;
}): Promise<SmartSelectResult> {
  const qs = new URLSearchParams();
  if (params.testId) qs.set("testId", params.testId);
  if (params.count) qs.set("count", String(params.count));
  if (params.section) qs.set("section", params.section);
  if (params.topic) qs.set("topic", params.topic);
  return apiRequest(`/question-bank/smart-select?${qs.toString()}`);
}

export interface BankCsvImportResult {
  inserted: number;
  skipped: number;
  errors: { row: number; reason: string }[];
  detectedLanguages: string[];
}

/**
 * Import questions from a CSV file into the question bank.
 * section / topic can be provided as batch-level overrides (used when per-row
 * columns are absent).
 */
export async function importBankQuestionsFromCsv(
  file: File,
  opts: { section?: string; topic?: string } = {},
): Promise<BankCsvImportResult> {
  const { getFirebaseAuth } = await import("@/lib/firebase");
  const auth = getFirebaseAuth();
  const token = auth?.currentUser ? await auth.currentUser.getIdToken() : "";

  const formData = new FormData();
  formData.append("file", file);
  if (opts.section) formData.append("section", opts.section);
  if (opts.topic) formData.append("topic", opts.topic);

  const base = (import.meta as any).env?.VITE_API_BASE_URL ?? "/api";
  const resp = await fetch(`${base}/question-bank/import-csv`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  });
  if (!resp.ok) {
    const err = await resp.json().catch(() => ({ error: "Import failed" })) as { error?: string };
    throw new Error(err.error ?? `Import failed (${resp.status})`);
  }
  return resp.json();
}

// Legacy compatibility - these will be removed once frontend is fully migrated
export const categories: Category[] = [];
export const allTests: Test[] = [];
export const sampleQuestions: Question[] = [];
export const leaderboardData: LeaderboardEntry[] = [];

// ── DI Sets API ────────────────────────────────────────────────────────────────

export interface DiSet {
  id: number;
  title: string;
  imageUrl: string | null;
  description: string | null;
  createdAt: string;
}

export async function getDiSets(): Promise<DiSet[]> {
  return apiRequest("/di-sets");
}

export async function getDiSet(id: number): Promise<DiSet> {
  return apiRequest(`/di-sets/${id}`);
}

export async function createDiSet(body: {
  title: string;
  imageUrl?: string | null;
  description?: string | null;
}): Promise<DiSet> {
  return apiRequest("/di-sets", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateDiSet(
  id: number,
  body: Partial<Omit<DiSet, "id" | "createdAt">>,
): Promise<DiSet> {
  return apiRequest(`/di-sets/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteDiSet(id: number): Promise<void> {
  return apiRequest(`/di-sets/${id}`, { method: "DELETE" });
}

// ── Firebase Storage upload helper ────────────────────────────────────────────

/**
 * Upload a file via the API server proxy (POST /api/upload).
 * This avoids Firebase Storage CORS restrictions when the app is served from a non-Firebase domain.
 */
export async function uploadImageToStorage(
  file: File,
  folder: "question-images" | "di-set-images" = "question-images",
): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const { getFirebaseAuth } = await import("@/lib/firebase");
  const auth = getFirebaseAuth();
  const token = auth?.currentUser ? await auth.currentUser.getIdToken() : "";

  const headers: Record<string, string> = {};
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const base = import.meta.env.VITE_API_BASE_URL ?? "/api";
  const response = await fetch(`${base}/upload`, {
    method: "POST",
    headers,
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Upload failed" }));
    throw new Error(err?.error ?? "Upload failed");
  }

  const { url } = await response.json();
  return url;
}
