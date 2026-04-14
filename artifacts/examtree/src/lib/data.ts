import { apiRequest } from "@/lib/api";

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

// API functions
export async function getCategories(): Promise<Category[]> {
  console.log("getCategories called");
  return apiRequest<Category[]>("/categories");
}

export async function getTests(): Promise<Test[]> {
  console.log("getTests called");
  return apiRequest<Test[]>("/tests");
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

export async function getUserAttempts(): Promise<TestAttempt[]> {
  return apiRequest<TestAttempt[]>("/attempts");
}

export async function createAttempt(attempt: Omit<TestAttempt, "id">): Promise<TestAttempt> {
  return apiRequest<TestAttempt>("/attempts", {
    method: "POST",
    body: JSON.stringify(attempt),
  });
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

// Legacy compatibility - these will be removed once frontend is fully migrated
export const categories: Category[] = [];
export const allTests: Test[] = [];
export const sampleQuestions: Question[] = [];
export const leaderboardData: LeaderboardEntry[] = [];
