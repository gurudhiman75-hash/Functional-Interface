import type {
  Category,
  Subcategory,
  Test,
} from "@/lib/data";

export type ExamTreeCategoryNode = {
  id: string;
  name: string;
  description: string;
  icon: string;
  tests: Test[];
  subcategories: ExamTreeSubcategoryNode[];
};

export type ExamTreeSubcategoryNode = {
  id: string;
  name: string;
  description: string;
  tests: Test[];
};

export const fallbackCategoryIcons = [
  "Landmark",
  "BadgeCheck",
  "Building2",
  "GraduationCap",
  "BriefcaseBusiness",
  "Monitor",
];

function slugify(value: string, fallback: string) {
  return (
    value
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") ||
    fallback
  );
}

export function makeFallbackCategories(
  tests: Test[],
): Category[] {
  const names = Array.from(
    new Set(
      tests
        .map((test) => test.category)
        .filter(Boolean),
    ),
  );

  return names.map((name, index) => ({
    id: slugify(name, `category-${index}`),
    name,
    description: `${name} test series and practice blueprints.`,
    icon:
      fallbackCategoryIcons[
        index % fallbackCategoryIcons.length
      ],
    color: "indigo",
    testsCount: tests.filter(
      (test) => test.category === name,
    ).length,
  }));
}

export function buildExamTreeNodes(
  categories: Category[],
  subcategories: Subcategory[],
  tests: Test[],
): ExamTreeCategoryNode[] {
  const sourceCategories =
    categories.length > 0
      ? categories
      : makeFallbackCategories(tests);

  return sourceCategories
    .map((category, index) => {
      const categoryTests = tests.filter(
        (test) =>
          test.categoryId === category.id ||
          test.categoryName === category.name ||
          test.category === category.name,
      );
      const explicitSubcategories =
        subcategories.filter(
          (sub) =>
            sub.categoryId === category.id,
        );
      const subcategoryIdsFromTests =
        Array.from(
          new Map(
            categoryTests.map((test) => [
              test.subcategoryId ??
                test.subcategoryName ??
                "general",
              {
                id:
                  test.subcategoryId ??
                  test.subcategoryName ??
                  "general",
                name:
                  test.subcategoryName ??
                  "General",
                description:
                  "Mixed exams and mock tests.",
              },
            ]),
          ).values(),
        );
      const mergedSubcategories =
        explicitSubcategories.length > 0
          ? explicitSubcategories.map((sub) => ({
              id: sub.id,
              name: sub.name,
              description: sub.description,
            }))
          : subcategoryIdsFromTests;

      return {
        id: category.id,
        name: category.name,
        description:
          category.description ||
          `${category.name} focused exam preparation.`,
        icon:
          category.icon ||
          fallbackCategoryIcons[
            index %
              fallbackCategoryIcons.length
          ],
        tests: categoryTests,
        subcategories: mergedSubcategories
          .map((sub) => ({
            ...sub,
            tests: categoryTests.filter(
              (test) =>
                test.subcategoryId ===
                  sub.id ||
                test.subcategoryName ===
                  sub.name ||
                (sub.id === "general" &&
                  !test.subcategoryId),
            ),
          }))
          .filter(
            (sub) => sub.tests.length > 0,
          ),
      };
    })
    .filter(
      (category) =>
        category.tests.length > 0,
    );
}

