import { useMemo } from "react";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, BookOpen, LayoutGrid, Package } from "lucide-react";

import { CategoryIcon } from "@/components/CategoryIcon";
import { ExamSeriesCard, type ExamSeriesMetrics } from "@/components/ExamSeriesCard";
import { Button } from "@/components/ui/button";
import { getAttempts } from "@/lib/storage";
import { getRuntimeExamGroups } from "@/lib/test-bank";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { categories, subcategories, tests, isLoading, error } = useExamCatalog();
  const category = categories.find((item) => item.id === id);
  const exams = useMemo(
    () => (id ? getRuntimeExamGroups(id, categories, tests, subcategories) : []),
    [id, categories, tests, subcategories],
  );

  const attempts = useMemo(() => getAttempts(), []);
  const attemptedTestIds = useMemo(() => new Set(attempts.map((attempt) => attempt.testId)), [attempts]);

  const examMetaMap = useMemo(() => {
    const map = new Map<string, ExamSeriesMetrics>();
    for (const exam of exams) {
      const examTests = exam.id.startsWith("general-")
        ? tests.filter((test) => test.categoryId === exam.categoryId && !test.subcategoryId)
        : tests.filter((test) => test.subcategoryId === exam.id);
      const withDuration = examTests.filter((test) => test.duration);
      const withQuestions = examTests.filter((test) => test.totalQuestions);
      map.set(exam.id, {
        freeCount: examTests.filter((test) => (test.access ?? "free") === "free").length,
        premiumCount: examTests.filter((test) => (test.access ?? "free") !== "free").length,
        avgDuration: withDuration.length > 0
          ? Math.round(withDuration.reduce((sum, test) => sum + test.duration, 0) / withDuration.length)
          : null,
        avgQuestions: withQuestions.length > 0
          ? Math.round(withQuestions.reduce((sum, test) => sum + test.totalQuestions, 0) / withQuestions.length)
          : null,
        attemptedCount: examTests.filter((test) => attemptedTestIds.has(test.id)).length,
        totalCount: examTests.length,
      });
    }
    return map;
  }, [exams, tests, attemptedTestIds]);

  if (error) {
    return (
      <main className="mx-auto max-w-lg px-4 py-24 text-center">
        <h1 className="text-xl font-semibold text-slate-950">Could not load category</h1>
        <p className="mt-2 text-sm text-slate-600">
          The exam catalog is temporarily unavailable. Please try again.
        </p>
        <Button className="mt-5" variant="outline" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </main>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl animate-pulse px-4 py-12 sm:px-6 lg:px-8">
        <div className="h-5 w-32 rounded bg-slate-200" />
        <div className="mt-10 h-12 w-72 rounded-lg bg-slate-200" />
        <div className="mt-4 h-5 max-w-xl rounded bg-slate-200" />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((item) => <div key={item} className="h-72 rounded-xl bg-slate-200" />)}
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-4 py-10">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-slate-950">Category not found</h1>
          <p className="mt-3 text-sm text-slate-600">This category is not available right now.</p>
          <Button className="mt-6" onClick={() => setLocation("/exams")}>Back to exams</Button>
        </div>
      </main>
    );
  }

  const totalTests = exams.reduce((sum, exam) => sum + exam.totalTests, 0);

  return (
    <div className="bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 pb-16 pt-7 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={() => setLocation("/exams")}
          className="inline-flex min-h-10 items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
          data-testid="btn-back-exams"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          All exams
        </button>

        <section className="mt-8 border-b border-slate-200 pb-9">
          <div className="flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-indigo-100 bg-indigo-50 text-indigo-700" aria-hidden="true">
                  <CategoryIcon icon={category.icon || "Landmark"} className="h-6 w-6" />
                </span>
                <div>
                  <p className="text-sm font-medium text-indigo-700">Exam category</p>
                  <h1 className="mt-1 text-4xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-5xl">
                    {category.name}
                  </h1>
                </div>
              </div>

              <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600">
                {category.description || `Practice tests for ${category.name}, including full-length, sectional and topic-wise series.`}
              </p>

              <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-slate-600">
                <span className="inline-flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  <strong className="font-semibold text-slate-900">{exams.length}</strong> exam series
                </span>
                <span className="inline-flex items-center gap-2">
                  <LayoutGrid className="h-4 w-4 text-slate-400" aria-hidden="true" />
                  <strong className="font-semibold text-slate-900">{totalTests}</strong> published tests
                </span>
              </div>
            </div>

            <Button
              variant="outline"
              className="h-11 self-start border-slate-300 bg-white px-4 text-slate-700 lg:self-auto"
              onClick={() => setLocation("/packages")}
            >
              <Package className="mr-2 h-4 w-4" aria-hidden="true" />
              Browse packages
            </Button>
          </div>
        </section>

        <section className="pt-9" aria-labelledby="category-series-heading">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="category-series-heading" className="text-2xl font-semibold tracking-[-0.02em] text-slate-950">
                Choose your exam
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Compare the available series by test mix, typical duration, access and your own progress.
              </p>
            </div>
            {exams.length > 0 && (
              <p className="text-sm tabular-nums text-slate-500">{exams.length} series available</p>
            )}
          </div>

          {exams.length === 0 ? (
            <div className="mt-6 border-y border-dashed border-slate-300 py-14 text-center">
              <BookOpen className="mx-auto h-8 w-8 text-slate-300" aria-hidden="true" />
              <p className="mt-3 text-sm font-medium text-slate-700">No exam series available yet</p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {exams.map((exam) => (
                <ExamSeriesCard
                  key={exam.id}
                  series={exam}
                  icon={exam.icon ?? category.icon}
                  metrics={examMetaMap.get(exam.id) ?? {
                    freeCount: 0,
                    premiumCount: 0,
                    avgDuration: null,
                    avgQuestions: null,
                    attemptedCount: 0,
                    totalCount: exam.totalTests,
                  }}
                  onOpen={() => setLocation(`/subcategory/${exam.id}`)}
                  dataTestId={`btn-open-exam-${exam.id}`}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
