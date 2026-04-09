import { allTests, categories, type Category, type Test } from "@/lib/data";
import { getAdminCategories, getAdminQuestions, getAdminTests } from "@/lib/storage";

const toSectionId = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";

const normalizeSectionName = (value: string) => value.trim().toLowerCase();

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
      categoryId: test.categoryId,
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
