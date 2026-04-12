import type { Category, Test } from "@/lib/data";
import {
  getAdminCategories,
  getAdminQuestions,
  getAdminSubcategories,
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

/** Merge API catalog with optional admin-authored content (admin wins when present). */
export function mergeRuntimeTestsFromApi(apiTests: Test[]): Test[] {
  if (getAdminTests().length > 0) {
    return buildTestsFromAdmin();
  }
  return apiTests.map(normalizeApiTest);
}

export function mergeRuntimeCategoriesFromApi(apiCategories: Category[]): Category[] {
  const adminCategories = getAdminCategories();
  if (adminCategories.length === 0) {
    return apiCategories.map((cat) => ({
      ...cat,
      exams: [
        {
          id: `${cat.id}-all`,
          name: `${cat.name} Tests`,
          year: new Date().getFullYear(),
          testsCount: cat.testsCount,
          avgScore: 0,
          categoryId: cat.id,
        },
      ],
    }));
  }

  return adminCategories.map((cat) => ({
    id: cat.id,
    name: cat.name,
    description: cat.description,
    icon: "BookOpen",
    color: "blue",
    testsCount: cat.testsCount,
    exams: [
      {
        id: `${cat.id}-all`,
        name: `${cat.name} Tests`,
        year: new Date().getFullYear(),
        testsCount: cat.testsCount,
        avgScore: 0,
        categoryId: cat.id,
      },
    ],
  }));
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
): RuntimeExamGroup[] {
  const category = categories.find((item) => item.id === categoryId);
  const categoryTests = tests.filter((test) => test.categoryId === categoryId);
  if (!category) return [];

  const adminSubcategories = getAdminSubcategories().filter((item) => item.categoryId === categoryId);
  const groups = adminSubcategories.map((subcategory) => {
    const examTests = categoryTests.filter((test) => test.subcategoryId === subcategory.id);
    return {
      ...subcategory,
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
): RuntimeExamGroup | null {
  for (const category of categories) {
    const group = getRuntimeExamGroups(category.id, categories, tests).find((item) => item.id === examId);
    if (group) return group;
  }
  return null;
}

export function testHasInlineQuestions(test: Test | undefined): boolean {
  return Boolean(test?.sections?.some((s) => (s.questions?.length ?? 0) > 0));
}
