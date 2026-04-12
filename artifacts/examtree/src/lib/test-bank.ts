import { allTests, categories, type Category, type Test } from "@/lib/data";
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

export function getRuntimeTests(): Test[] {
  const adminTests = getAdminTests();
  if (adminTests.length === 0) return allTests;

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
    const sections = sectionNames.map((sectionName) => {
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
    }).filter((section) => section.questions.length > 0);

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

export function getRuntimeCategories(): Category[] {
  const adminCategories = getAdminCategories();
  if (adminCategories.length === 0) return categories;

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

function countByKind(tests: Test[], kind: TestKind) {
  return tests.filter((test) => (test.kind ?? "full-length") === kind).length;
}

function buildSyntheticExam(category: Category, tests: Test[]): RuntimeExamGroup {
  return {
    id: `general-${category.id}`,
    categoryId: category.id,
    categoryName: category.name,
    name: `${category.name} General`,
    description: `All available ${category.name} mocks in one place.`,
    totalTests: tests.length,
    fullLengthCount: countByKind(tests, "full-length"),
    sectionalCount: countByKind(tests, "sectional"),
    topicWiseCount: countByKind(tests, "topic-wise"),
  };
}

export function getRuntimeExamGroups(categoryId: string): RuntimeExamGroup[] {
  const category = getRuntimeCategories().find((item) => item.id === categoryId);
  const tests = getRuntimeTests().filter((test) => test.categoryId === categoryId);
  if (!category) return [];

  const adminSubcategories = getAdminSubcategories().filter((item) => item.categoryId === categoryId);
  const groups = adminSubcategories.map((subcategory) => {
    const examTests = tests.filter((test) => test.subcategoryId === subcategory.id);
    return {
      ...subcategory,
      totalTests: examTests.length,
      fullLengthCount: countByKind(examTests, "full-length"),
      sectionalCount: countByKind(examTests, "sectional"),
      topicWiseCount: countByKind(examTests, "topic-wise"),
    };
  });

  const testsWithoutExam = tests.filter((test) => !test.subcategoryId);
  if (groups.length === 0 && tests.length > 0) {
    return [buildSyntheticExam(category, tests)];
  }

  if (testsWithoutExam.length > 0) {
    groups.push(buildSyntheticExam(category, testsWithoutExam));
  }

  return groups.sort((left, right) => right.totalTests - left.totalTests || left.name.localeCompare(right.name));
}

export function getRuntimeExamGroup(examId: string): RuntimeExamGroup | null {
  const categories = getRuntimeCategories();
  for (const category of categories) {
    const group = getRuntimeExamGroups(category.id).find((item) => item.id === examId);
    if (group) return group;
  }
  return null;
}
