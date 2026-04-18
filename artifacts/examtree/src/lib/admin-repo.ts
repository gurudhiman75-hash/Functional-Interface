import { hydrateAdminDataFromCloud, syncAdminDataToCloudOrThrow, deleteTestFromCloud,
  deleteCategoryFromCloud, deleteSubcategoryFromCloud } from "@/lib/storage";
import {
  getAdminCategories,
  getAdminQuestions,
  getAdminSubcategories,
  getAdminTests,
  saveAdminCategories,
  saveAdminQuestions,
  saveAdminSubcategories,
  saveAdminTests,
  type AdminCategory,
  type AdminQuestion,
  type AdminSubcategory,
  type AdminTest,
} from "@/lib/storage";

type AdminSnapshot = {
  categories: AdminCategory[];
  subcategories: AdminSubcategory[];
  tests: AdminTest[];
  questions: AdminQuestion[];
};

function getSnapshot(): AdminSnapshot {
  return {
    categories: getAdminCategories(),
    subcategories: getAdminSubcategories(),
    tests: getAdminTests(),
    questions: getAdminQuestions(),
  };
}

function setSnapshot(snapshot: AdminSnapshot) {
  saveAdminCategories(snapshot.categories);
  saveAdminSubcategories(snapshot.subcategories);
  saveAdminTests(snapshot.tests);
  saveAdminQuestions(snapshot.questions);
}

/** Full snapshot PUT is slow; coalesce writes and run in the background so the UI stays responsive. */
const SYNC_DEBOUNCE_MS = 200;

let debounceTimer: ReturnType<typeof setTimeout> | null = null;
let syncRunning = false;
let syncQueued = false;

function dispatchSyncFailed(detail: string) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent("admin-cloud-sync-failed", { detail }));
}

async function runAdminCloudSync(): Promise<void> {
  if (syncRunning) {
    syncQueued = true;
    return;
  }
  syncRunning = true;
  syncQueued = false;
  try {
    await syncAdminDataToCloudOrThrow();
  } catch (error) {
    try {
      await hydrateAdminDataFromCloud();
    } catch {
      /* keep local cache if GET also fails */
    }
    const message = error instanceof Error ? error.message : "Could not save admin data to the server.";
    dispatchSyncFailed(message);
  } finally {
    syncRunning = false;
    if (syncQueued) {
      syncQueued = false;
      void runAdminCloudSync();
    }
  }
}

function scheduleAdminCloudSync() {
  if (debounceTimer) clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    debounceTimer = null;
    void runAdminCloudSync();
  }, SYNC_DEBOUNCE_MS);
}

function withPersistedUpdate(mutator: (snapshot: AdminSnapshot) => AdminSnapshot) {
  const base = getSnapshot();
  const next = mutator({
    categories: [...base.categories],
    subcategories: [...base.subcategories],
    tests: [...base.tests],
    questions: [...base.questions],
  });

  setSnapshot(next);
  scheduleAdminCloudSync();
}

/** Read the current admin snapshot from local storage (no network). */
export function getAdminSnapshot(): AdminSnapshot {
  return getSnapshot();
}

export async function addCategory(cat: Omit<AdminCategory, "id">): Promise<AdminCategory> {
  let created!: AdminCategory;
  await withPersistedUpdate((snapshot) => {
    created = {
      ...cat,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    };
    snapshot.categories.push(created);
    return snapshot;
  });
  return created;
}

export async function updateCategory(id: string, updates: Partial<AdminCategory>): Promise<void> {
  await withPersistedUpdate((snapshot) => {
    snapshot.categories = snapshot.categories.map((category) =>
      category.id === id ? { ...category, ...updates } : category,
    );
    return snapshot;
  });
}

export async function deleteCategory(id: string): Promise<void> {
  // Update local cache without scheduling a full snapshot PUT
  const subcategoryIds = getAdminSubcategories()
    .filter((s) => s.categoryId === id)
    .map((s) => s.id);
  const testIds = getAdminTests()
    .filter((t) => t.categoryId === id || subcategoryIds.includes(t.subcategoryId))
    .map((t) => t.id);
  saveAdminCategories(getAdminCategories().filter((c) => c.id !== id));
  saveAdminSubcategories(getAdminSubcategories().filter((s) => s.categoryId !== id));
  saveAdminTests(getAdminTests().filter((t) => t.categoryId !== id && !subcategoryIds.includes(t.subcategoryId)));
  saveAdminQuestions(getAdminQuestions().filter((q) => !testIds.includes(q.testId)));
  // Call dedicated DELETE endpoint — no create/update validation triggered
  await deleteCategoryFromCloud(id);
}

export async function addSubcategory(item: Omit<AdminSubcategory, "id">): Promise<AdminSubcategory> {
  let created!: AdminSubcategory;
  await withPersistedUpdate((snapshot) => {
    created = {
      ...item,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
    };
    snapshot.subcategories.push(created);
    return snapshot;
  });
  return created;
}

export async function updateSubcategory(
  id: string,
  updates: Partial<AdminSubcategory>,
): Promise<void> {
  await withPersistedUpdate((snapshot) => {
    snapshot.subcategories = snapshot.subcategories.map((subcategory) =>
      subcategory.id === id ? { ...subcategory, ...updates } : subcategory,
    );
    return snapshot;
  });
}

export async function deleteSubcategory(id: string): Promise<void> {
  // Update local cache without scheduling a full snapshot PUT
  const testIds = getAdminTests().filter((t) => t.subcategoryId === id).map((t) => t.id);
  saveAdminSubcategories(getAdminSubcategories().filter((s) => s.id !== id));
  saveAdminTests(getAdminTests().filter((t) => t.subcategoryId !== id));
  saveAdminQuestions(getAdminQuestions().filter((q) => !testIds.includes(q.testId)));
  // Call dedicated DELETE endpoint — no create/update validation triggered
  await deleteSubcategoryFromCloud(id);
}

export async function addTest(
  test: Omit<AdminTest, "id" | "attempts" | "avgScore">,
): Promise<AdminTest> {
  let created!: AdminTest;
  await withPersistedUpdate((snapshot) => {
    created = {
      ...test,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      attempts: 0,
      avgScore: 0,
    };
    snapshot.tests.push(created);
    return snapshot;
  });
  return created;
}

export async function updateTest(id: string, updates: Partial<AdminTest>): Promise<void> {
  await withPersistedUpdate((snapshot) => {
    snapshot.tests = snapshot.tests.map((test) => (test.id === id ? { ...test, ...updates } : test));
    return snapshot;
  });
}

export async function deleteTest(id: string): Promise<void> {
  // Update local cache synchronously — no full snapshot PUT, no create/update validation
  saveAdminTests(getAdminTests().filter((test) => test.id !== id));
  saveAdminQuestions(getAdminQuestions().filter((question) => question.testId !== id));
  // Call dedicated DELETE endpoint — only validates testId exists
  await deleteTestFromCloud(id);
}

export async function addQuestion(
  question: Omit<AdminQuestion, "id" | "createdAt">,
): Promise<AdminQuestion> {
  let created!: AdminQuestion;
  await withPersistedUpdate((snapshot) => {
    created = {
      ...question,
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
    };
    snapshot.questions.push(created);
    return snapshot;
  });
  return created;
}

/** One cloud sync for many questions (avoids N full snapshot PUTs). */
export async function bulkAddQuestions(items: Omit<AdminQuestion, "id" | "createdAt">[]): Promise<void> {
  if (items.length === 0) return;
  await withPersistedUpdate((snapshot) => {
    for (const item of items) {
      snapshot.questions.push({
        ...item,
        id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        createdAt: Date.now(),
      });
    }
    return snapshot;
  });
}

export async function updateQuestion(id: string, updates: Partial<AdminQuestion>): Promise<void> {
  await withPersistedUpdate((snapshot) => {
    snapshot.questions = snapshot.questions.map((question) =>
      question.id === id ? { ...question, ...updates } : question,
    );
    return snapshot;
  });
}

export async function deleteQuestion(id: string): Promise<void> {
  await withPersistedUpdate((snapshot) => {
    snapshot.questions = snapshot.questions.filter((question) => question.id !== id);
    return snapshot;
  });
}
