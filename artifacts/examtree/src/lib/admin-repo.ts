import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { getFirebaseDb } from "@/lib/firebase";
import {
  addAdminCategory as addLocalCategory,
  addAdminQuestion as addLocalQuestion,
  addAdminSubcategory as addLocalSubcategory,
  addAdminTest as addLocalTest,
  deleteAdminCategory as deleteLocalCategory,
  deleteAdminQuestion as deleteLocalQuestion,
  deleteAdminSubcategory as deleteLocalSubcategory,
  deleteAdminTest as deleteLocalTest,
  getAdminCategories as getLocalCategories,
  getAdminQuestions as getLocalQuestions,
  getAdminSubcategories as getLocalSubcategories,
  getAdminTests as getLocalTests,
  saveAdminCategories,
  saveAdminQuestions,
  saveAdminSubcategories,
  saveAdminTests,
  updateAdminCategory as updateLocalCategory,
  updateAdminQuestion as updateLocalQuestion,
  updateAdminSubcategory as updateLocalSubcategory,
  updateAdminTest as updateLocalTest,
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

const COL_CATEGORIES = "admin_categories";
const COL_SUBCATEGORIES = "admin_subcategories";
const COL_TESTS = "admin_tests";
const COL_QUESTIONS = "admin_questions";

async function listCollection<T>(name: string): Promise<T[]> {
  const db = getFirebaseDb();
  const snap = await getDocs(collection(db, name));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }) as T);
}

async function setCollectionDoc<T extends { id: string }>(name: string, item: T): Promise<void> {
  const db = getFirebaseDb();
  await setDoc(doc(db, name, item.id), item);
}

async function removeCollectionDoc(name: string, id: string): Promise<void> {
  const db = getFirebaseDb();
  await deleteDoc(doc(db, name, id));
}

function syncLocal(snapshot: AdminSnapshot) {
  saveAdminCategories(snapshot.categories);
  saveAdminSubcategories(snapshot.subcategories);
  saveAdminTests(snapshot.tests);
  saveAdminQuestions(snapshot.questions);
}

export async function loadAdminSnapshot(): Promise<AdminSnapshot> {
  try {
    const [categories, subcategories, tests, questions] = await Promise.all([
      listCollection<AdminCategory>(COL_CATEGORIES),
      listCollection<AdminSubcategory>(COL_SUBCATEGORIES),
      listCollection<AdminTest>(COL_TESTS),
      listCollection<AdminQuestion>(COL_QUESTIONS),
    ]);
    const snapshot = { categories, subcategories, tests, questions };
    syncLocal(snapshot);
    return snapshot;
  } catch {
    return {
      categories: getLocalCategories(),
      subcategories: getLocalSubcategories(),
      tests: getLocalTests(),
      questions: getLocalQuestions(),
    };
  }
}

export async function addCategory(cat: Omit<AdminCategory, "id">): Promise<AdminCategory> {
  const created = addLocalCategory(cat);
  try {
    await setCollectionDoc(COL_CATEGORIES, created);
  } catch {
    // Local fallback already persisted.
  }
  return created;
}

export async function updateCategory(id: string, updates: Partial<AdminCategory>): Promise<void> {
  updateLocalCategory(id, updates);
  try {
    const latest = getLocalCategories().find((c) => c.id === id);
    if (latest) await setCollectionDoc(COL_CATEGORIES, latest);
  } catch {
    // Local fallback already persisted.
  }
}

export async function deleteCategory(id: string): Promise<void> {
  const subcategoryIds = getLocalSubcategories()
    .filter((s) => s.categoryId === id)
    .map((s) => s.id);
  const testIds = getLocalTests()
    .filter((t) => t.categoryId === id || subcategoryIds.includes(t.subcategoryId))
    .map((t) => t.id);
  const questionIds = getLocalQuestions()
    .filter((q) => testIds.includes(q.testId))
    .map((q) => q.id);

  deleteLocalCategory(id);
  try {
    await Promise.all([
      removeCollectionDoc(COL_CATEGORIES, id),
      ...subcategoryIds.map((subId) => removeCollectionDoc(COL_SUBCATEGORIES, subId)),
      ...testIds.map((testId) => removeCollectionDoc(COL_TESTS, testId)),
      ...questionIds.map((qId) => removeCollectionDoc(COL_QUESTIONS, qId)),
    ]);
  } catch {
    // Local fallback already persisted.
  }
}

export async function addSubcategory(item: Omit<AdminSubcategory, "id">): Promise<AdminSubcategory> {
  const created = addLocalSubcategory(item);
  try {
    await setCollectionDoc(COL_SUBCATEGORIES, created);
  } catch {}
  return created;
}

export async function updateSubcategory(id: string, updates: Partial<AdminSubcategory>): Promise<void> {
  updateLocalSubcategory(id, updates);
  try {
    const latest = getLocalSubcategories().find((s) => s.id === id);
    if (latest) await setCollectionDoc(COL_SUBCATEGORIES, latest);
  } catch {}
}

export async function deleteSubcategory(id: string): Promise<void> {
  const testIds = getLocalTests().filter((t) => t.subcategoryId === id).map((t) => t.id);
  const questionIds = getLocalQuestions().filter((q) => testIds.includes(q.testId)).map((q) => q.id);
  deleteLocalSubcategory(id);
  try {
    await Promise.all([
      removeCollectionDoc(COL_SUBCATEGORIES, id),
      ...testIds.map((testId) => removeCollectionDoc(COL_TESTS, testId)),
      ...questionIds.map((qId) => removeCollectionDoc(COL_QUESTIONS, qId)),
    ]);
  } catch {}
}

export async function addTest(test: Omit<AdminTest, "id" | "attempts" | "avgScore">): Promise<AdminTest> {
  const created = addLocalTest(test);
  try {
    await setCollectionDoc(COL_TESTS, created);
  } catch {}
  return created;
}

export async function updateTest(id: string, updates: Partial<AdminTest>): Promise<void> {
  updateLocalTest(id, updates);
  try {
    const latest = getLocalTests().find((t) => t.id === id);
    if (latest) await setCollectionDoc(COL_TESTS, latest);
  } catch {}
}

export async function deleteTest(id: string): Promise<void> {
  const questionIds = getLocalQuestions().filter((q) => q.testId === id).map((q) => q.id);
  deleteLocalTest(id);
  try {
    await Promise.all([
      removeCollectionDoc(COL_TESTS, id),
      ...questionIds.map((qId) => removeCollectionDoc(COL_QUESTIONS, qId)),
    ]);
  } catch {}
}

export async function addQuestion(question: Omit<AdminQuestion, "id" | "createdAt">): Promise<AdminQuestion> {
  const created = addLocalQuestion(question);
  try {
    await setCollectionDoc(COL_QUESTIONS, created);
  } catch {}
  return created;
}

export async function updateQuestion(id: string, updates: Partial<AdminQuestion>): Promise<void> {
  updateLocalQuestion(id, updates);
  try {
    const latest = getLocalQuestions().find((q) => q.id === id);
    if (latest) await setCollectionDoc(COL_QUESTIONS, latest);
  } catch {}
}

export async function deleteQuestion(id: string): Promise<void> {
  deleteLocalQuestion(id);
  try {
    await removeCollectionDoc(COL_QUESTIONS, id);
  } catch {}
}
