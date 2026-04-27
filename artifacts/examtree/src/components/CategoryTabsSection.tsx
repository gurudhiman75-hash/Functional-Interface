import { useMemo } from "react";
import { useLocation } from "wouter";
import { ChevronRight, Layers3, Sparkles } from "lucide-react";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type CategoryTabsSectionProps = {
  title?: string;
  subtitle?: string;
  ctaLabel?: string;
  className?: string;
  showTopBadge?: boolean;
  defaultCtaPath?: string;
  searchQuery?: string;
};

export function CategoryTabsSection({
  title = "Browse by category",
  subtitle = "Choose a category first, then jump into the Exam that matches your goal.",
  ctaLabel = "View all exams",
  className = "",
  showTopBadge = true,
  defaultCtaPath = "/exams",
  searchQuery = "",
}: CategoryTabsSectionProps) {
  const [, setLocation] = useLocation();
  const { categories, subcategories, tests } = useExamCatalog();
  const query = searchQuery.trim().toLowerCase();

  const categoryStats = useMemo(() => {
    return categories
      .map((category) => {
        const categorySubcategories = subcategories.filter((item) => item.categoryId === category.id);
        const categoryTests = tests.filter((test) => test.categoryId === category.id);
        const subcategoryTestCounts = new Map<string, number>();
        for (const test of categoryTests) {
          if (!test.subcategoryId) continue;
          subcategoryTestCounts.set(test.subcategoryId, (subcategoryTestCounts.get(test.subcategoryId) ?? 0) + 1);
        }
        return {
          ...category,
          categoryTests,
          categorySubcategories,
          subcategoryTestCounts,
          totalTests: category.testsCount ?? categoryTests.length,
          freeTests: categoryTests.filter((test) => (test.access ?? "free") === "free").length,
        };
      })
      .filter((category) => {
        if (!query) return true;
        const subcategoryMatch = category.categorySubcategories.some((subcat) =>
          `${subcat.name} ${subcat.description}`.toLowerCase().includes(query),
        );
        const testMatch = category.categoryTests.some((test) =>
          `${test.name} ${test.subcategoryName ?? ""}`.toLowerCase().includes(query),
        );
        return (
          category.name.toLowerCase().includes(query) ||
          category.description.toLowerCase().includes(query) ||
          subcategoryMatch ||
          testMatch
        );
      })
      .sort((left, right) => right.totalTests - left.totalTests);
  }, [categories, subcategories, tests, query]);

  if (categoryStats.length === 0) {
    return null;
  }

  return (
    <section className={`mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 ${className}`}>
      <div className="rounded-3xl border border-border/70 bg-card/85 p-5 shadow-sm backdrop-blur-sm sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            {showTopBadge && (
              <Badge variant="secondary" className="mb-3 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-semibold">
                <Sparkles className="mr-1.5 h-3.5 w-3.5 text-amber-500" />
                Start by category
              </Badge>
            )}
            <h2 className="text-2xl font-black tracking-tight text-foreground sm:text-3xl">{title}</h2>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              {subtitle}
            </p>
          </div>

          <Button variant="outline" className="w-fit rounded-xl" onClick={() => setLocation(defaultCtaPath)}>
            {ctaLabel}
            <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        <Tabs defaultValue={categoryStats[0]?.id} className="mt-6 space-y-5">
          <div className="overflow-x-auto pb-1">
            <TabsList className="inline-flex h-auto min-w-full justify-start gap-2 rounded-2xl bg-muted/50 p-2">
              {categoryStats.map((category) => (
                <TabsTrigger
                  key={category.id}
                  value={category.id}
                  className="shrink-0 rounded-xl px-4 py-2.5 text-sm font-semibold data-[state=active]:shadow-sm"
                >
                  {category.name}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {categoryStats.map((category) => {
            const visibleSubcategories = [...category.categorySubcategories].sort((left, right) => {
              const leftCount = category.subcategoryTestCounts.get(left.id) ?? 0;
              const rightCount = category.subcategoryTestCounts.get(right.id) ?? 0;
              if (leftCount !== rightCount) return rightCount - leftCount;
              return left.name.localeCompare(right.name);
            });

            return (
              <TabsContent key={category.id} value={category.id} className="mt-0 space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Layers3 className="h-4 w-4 text-primary" />
                    <p className="text-sm font-semibold text-foreground">
                      All Exams under {category.name}
                    </p>
                  </div>

                  {visibleSubcategories.length === 0 ? (
                    <div className="rounded-2xl border border-dashed border-border/70 bg-muted/20 p-6 text-center">
                      <p className="text-sm font-semibold text-foreground">No subcategories available yet</p>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                        You can still open the category and practice all tests inside it.
                      </p>
                      <Button className="mt-4 rounded-xl" variant="outline" onClick={() => setLocation(`/category/${category.id}`)}>
                        View category
                      </Button>
                    </div>
                  ) : (
                    <div className="grid gap-3 sm:grid-cols-2">
                      {visibleSubcategories.map((subcat) => {
                        const count = category.subcategoryTestCounts.get(subcat.id) ?? 0;
                        return (
                          <button
                            key={subcat.id}
                            type="button"
                            onClick={() => setLocation(`/subcategory/${subcat.id}`)}
                            className="group rounded-2xl border border-border/70 bg-background p-4 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md"
                          >
                            <p className="font-semibold text-foreground group-hover:text-primary">{subcat.name}</p>
                            <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                              {subcat.description}
                            </p>
                            <div className="mt-3 flex items-center justify-between gap-2">
                              <span className="text-xs font-semibold text-primary">
                                {count} test{count === 1 ? "" : "s"}
                              </span>
                              {subcat.languages?.length ? (
                                <span className="text-[11px] text-muted-foreground">
                                  {subcat.languages.join(" / ")}
                                </span>
                              ) : (
                                <span className="text-[11px] text-muted-foreground">Open practice</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </TabsContent>
            );
          })}
        </Tabs>
      </div>
    </section>
  );
}
