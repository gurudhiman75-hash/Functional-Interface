import type { Category, Subcategory, Test } from "@/lib/data";
import {
  getAdminCategories,
  getAdminQuestions,
  getAdminTests,
  type AdminSubcategory,
  type TestKind,
} from "@/lib/storage";

const toSectionId = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";

const normalizeSectionName = (value: string) => value.trim().toLowerCase();

export type RuntimeExamGroup = AdminSubcategory & {
  icon?: string;
  totalTests: number;
  fullLengthCount: number;
  sectionalCount: number;
  topicWiseCount: number;
};

function buildTestsFromAdmin(): Test[] {
  const adminTests = getAdminTests();
  const allAdminQuestions = getAdminQuestions();

  return adminTests.map((test) => {
    const questions = allAdminQuestions
      .filter((q) => q.testId === test.id)
      .sort((a, b) => a.createdAt - b.createdAt);

    const configuredSections =
      test.sectionSettings && test.sectionSettings.length > 0
        ? test.sectionSettings
        : (test.sections ?? []).map((name) => ({ name, locked: false }));
    const configuredSectionNames = configuredSections.map((s) => s.name).filter(Boolean);
    const fallbackSectionNames = [...new Set(questions.map((q) => q.section).filter(Boolean))];
    const sectionNames = configuredSectionNames.length > 0 ? configuredSectionNames : fallbackSectionNames;

    let questionNumber = 1;
    const sections = sectionNames
      .map((sectionName) => {
        const sectionQuestions = questions
          .filter((q) => normalizeSectionName(q.section) === normalizeSectionName(sectionName))
          .map((q) => ({
            id: questionNumber++,
            text: q.text,
            options: q.options,
            correct: q.correct,
            section: q.section,
            explanation: q.explanation,
          }));

        return {
          id: `${toSectionId(sectionName)}-${test.id}`,
          name: sectionName,
          questions: sectionQuestions,
        };
      })
      .filter((section) => section.questions.length > 0);

    const totalQuestions = sections.reduce((sum, s) => sum + s.questions.length, 0);

    return {
      id: test.id,
      name: test.name,
      category: test.categoryName,
      categoryName: test.categoryName,
      categoryId: test.categoryId,
      subcategoryId: test.subcategoryId ?? "",
      subcategoryName: test.subcategoryName ?? "",
      access: test.access ?? "free",
      kind: test.kind ?? "full-length",
      duration: test.duration,
      totalQuestions: totalQuestions || test.totalQuestions,
      attempts: test.attempts,
      avgScore: test.avgScore,
      difficulty: test.difficulty,
      sectionTimingMode: test.sectionTimingMode ?? "none",
      sectionTimings: sectionNames.map((name) => {
        const existing = (test.sectionTimings ?? []).find(
          (item) => normalizeSectionName(item.name) === normalizeSectionName(name),
        );
        return { name, minutes: existing?.minutes ?? 0 };
      }),
      sectionSettings: configuredSections,
      sections,
    };
  });
}

function normalizeApiTest(t: Test): Test {
  return {
    ...t,
    categoryName: t.categoryName ?? t.category,
    subcategoryId: t.subcategoryId ?? "",
    subcategoryName: t.subcategoryName ?? "",
    access: t.access ?? "free",
    kind: t.kind ?? "full-length",
    priceCents: t.priceCents ?? null,
    sections: Array.isArray(t.sections) ? t.sections : [],
  };
}

/** Always return tests from the backend API — never use localStorage. */
export function mergeRuntimeTestsFromApi(apiTests: Test[]): Test[] {
  return apiTests.map(normalizeApiTest);
}

/** Always return categories from the backend API — never use localStorage. */
export function mergeRuntimeCategoriesFromApi(apiCategories: Category[]): Category[] {
  return apiCategories;
}

function countByKind(testList: Test[], kind: TestKind) {
  return testList.filter((test) => (test.kind ?? "full-length") === kind).length;
}

function buildSyntheticExam(category: Category, categoryTests: Test[]): RuntimeExamGroup {
  return {
    id: `general-${category.id}`,
    categoryId: category.id,
    categoryName: category.name,
    name: `${category.name} General`,
    description: `All available ${category.name} mocks in one place.`,
    icon: category.icon,
    totalTests: categoryTests.length,
    fullLengthCount: countByKind(categoryTests, "full-length"),
    sectionalCount: countByKind(categoryTests, "sectional"),
    topicWiseCount: countByKind(categoryTests, "topic-wise"),
  };
}

export function getRuntimeExamGroups(
  categoryId: string,
  categories: Category[],
  tests: Test[],
  subcategories: Subcategory[] = [],
): RuntimeExamGroup[] {
  const category = categories.find((item) => item.id === categoryId);
  const categoryTests = tests.filter((test) => test.categoryId === categoryId);
  if (!category) return [];

  // Use backend subcategories for this category as the source of truth.
  // This ensures subcategories show even when they have no tests yet.
  const backendSubs = subcategories.filter((s) => s.categoryId === categoryId);

  let subcategorySource: { id: string; name: string; description: string }[];

  if (backendSubs.length > 0) {
    subcategorySource = backendSubs;
  } else {
    // Fall back to subcategories inferred from API tests
    const map = new Map<string, { id: string; name: string; description: string }>();
    for (const test of categoryTests) {
      if (test.subcategoryId && !map.has(test.subcategoryId)) {
        map.set(test.subcategoryId, { id: test.subcategoryId, name: test.subcategoryName || test.subcategoryId, description: "" });
      }
    }
    subcategorySource = Array.from(map.values());
  }

  const groups: RuntimeExamGroup[] = subcategorySource.map((sub) => {
    const examTests = categoryTests.filter((test) => test.subcategoryId === sub.id);
    return {
      id: sub.id,
      categoryId,
      categoryName: category.name,
      name: sub.name,
      description: sub.description ?? "",
      icon: sub.icon ?? category.icon,
      totalTests: examTests.length,
      fullLengthCount: countByKind(examTests, "full-length"),
      sectionalCount: countByKind(examTests, "sectional"),
      topicWiseCount: countByKind(examTests, "topic-wise"),
    };
  });

  const testsWithoutExam = categoryTests.filter((test) => !test.subcategoryId);
  if (groups.length === 0 && categoryTests.length > 0) {
    return [buildSyntheticExam(category, categoryTests)];
  }

  if (testsWithoutExam.length > 0) {
    groups.push(buildSyntheticExam(category, testsWithoutExam));
  }

  return groups.sort((left, right) => right.totalTests - left.totalTests || left.name.localeCompare(right.name));
}

export function getRuntimeExamGroup(
  examId: string,
  categories: Category[],
  tests: Test[],
  subcategories: Subcategory[] = [],
): RuntimeExamGroup | null {
  for (const category of categories) {
    const group = getRuntimeExamGroups(category.id, categories, tests, subcategories).find((item) => item.id === examId);
    if (group) return group;
  }
  return null;
}

export function testHasInlineQuestions(test: Test | undefined): boolean {
  return Boolean(test?.sections?.some((s) => (s.questions?.length ?? 0) > 0));
}
