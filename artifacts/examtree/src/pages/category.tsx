import { useMemo } from "react";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, BookOpen, ChevronRight, Clock3, Hash, LayoutGrid, Lock, Package, RotateCcw, ShieldCheck } from "lucide-react";
import { getRuntimeExamGroups } from "@/lib/test-bank";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";
import { getAttempts } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { CategoryIcon, isImageIcon } from "@/components/CategoryIcon";

const CATEGORY_STYLES: Record<string, string> = {
  blue: "linear-gradient(to right, #0ea5e9, #3b82f6, #6366f1)",
  emerald: "linear-gradient(to right, #10b981, #14b8a6, #06b6d4)",
  violet: "linear-gradient(to right, #8b5cf6, #d946ef, #ec4899)",
  amber: "linear-gradient(to right, #f59e0b, #f97316, #f43f5e)",
  orange: "linear-gradient(to right, #f97316, #f59e0b, #eab308)",
  rose: "linear-gradient(to right, #f43f5e, #ec4899, #d946ef)",
  indigo: "linear-gradient(to right, #6366f1, #3b82f6, #06b6d4)",
  red: "linear-gradient(to right, #ef4444, #f43f5e, #f97316)",
};

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
  const attemptedTestIds = useMemo(() => new Set(attempts.map((a) => a.testId)), [attempts]);

  const examMetaMap = useMemo(() => {
    const map = new Map<string, {
      freeCount: number; paidCount: number;
      avgDuration: number | null; avgQuestions: number | null;
      attemptedCount: number; totalCount: number;
    }>();
    for (const exam of exams) {
      const examTests = exam.id.startsWith("general-")
        ? tests.filter((t) => t.categoryId === exam.categoryId && !t.subcategoryId)
        : tests.filter((t) => t.subcategoryId === exam.id);
      const withDuration = examTests.filter((t) => t.duration);
      const withQuestions = examTests.filter((t) => t.totalQuestions);
      map.set(exam.id, {
        freeCount: examTests.filter((t) => (t.access ?? "free") === "free").length,
        paidCount: examTests.filter((t) => (t.access ?? "free") !== "free").length,
        avgDuration: withDuration.length > 0 ? Math.round(withDuration.reduce((s, t) => s + t.duration, 0) / withDuration.length) : null,
        avgQuestions: withQuestions.length > 0 ? Math.round(withQuestions.reduce((s, t) => s + t.totalQuestions, 0) / withQuestions.length) : null,
        attemptedCount: examTests.filter((t) => attemptedTestIds.has(t.id)).length,
        totalCount: examTests.length,
      });
    }
    return map;
  }, [exams, tests, attemptedTestIds]);

  const gradient = CATEGORY_STYLES[category?.color ?? "blue"] ?? CATEGORY_STYLES.blue;

  if (error) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-lg items-center px-4 py-12 text-center sm:px-6">
        <div className="et-panel-raised w-full rounded-3xl p-8">
          <h1 className="text-xl font-semibold text-foreground">Could not load category</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">The exam catalog is temporarily unavailable. Please try again.</p>
          <Button className="mt-5 min-h-11 rounded-xl" variant="outline" onClick={() => window.location.reload()}>Retry</Button>
        </div>
      </main>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-5 px-4 py-8 sm:px-6" role="status" aria-label="Loading exam category">
        <div className="skeleton-shimmer h-12 w-40 rounded-xl" />
        <div className="skeleton-shimmer h-56 rounded-3xl" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((item) => <div key={item} className="skeleton-shimmer h-72 rounded-2xl" />)}
        </div>
        <span className="sr-only">Loading exam category…</span>
      </div>
    );
  }

  if (!category) {
    return (
      <main className="mx-auto flex min-h-[60vh] w-full max-w-5xl items-center justify-center px-4 py-10 sm:px-6">
        <div className="et-panel-raised w-full max-w-xl rounded-3xl p-10 text-center">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Category not found</h1>
          <p className="mt-3 text-sm text-muted-foreground">This category is not available right now.</p>
          <Button className="mt-6 min-h-11 rounded-xl" onClick={() => setLocation("/exams")}>Back to Exams</Button>
        </div>
      </main>
    );
  }

  const totalTests = exams.reduce((sum, exam) => sum + exam.totalTests, 0);

  return (
    <div className="w-full bg-gradient-to-br from-background via-muted/15 to-background">
      <div className="border-b border-border/60 bg-background/85 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6">
          <button
            onClick={() => setLocation("/exams")}
            className="et-interactive inline-flex min-h-11 items-center gap-1.5 rounded-xl px-3 text-sm font-medium text-muted-foreground hover:bg-muted/50 hover:text-foreground"
            data-testid="btn-back-exams"
          >
            <ArrowLeft className="h-4 w-4" />
            All exams
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 pb-2 pt-6 sm:px-6">
        <section className="et-panel-raised relative overflow-hidden rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/[0.08] via-background to-background px-5 py-6 sm:px-7 sm:py-8">
          <div className="absolute inset-x-0 top-0 h-1.5" style={{ backgroundImage: gradient }} aria-hidden="true" />
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="mb-3 inline-flex items-center rounded-full px-3 py-1" style={{ backgroundImage: gradient }}>
                <span className="text-[11px] font-bold uppercase tracking-widest text-white/90">Category</span>
              </div>
              <h1 className="text-4xl font-black leading-tight tracking-tight text-foreground sm:text-5xl">{category.name}</h1>
              <p className="mt-3 max-w-2xl text-base leading-7 text-muted-foreground sm:text-[17px]">
                {category.description || `Practice tests for ${category.name} — full-length, sectional, and topic-wise.`}
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/85 px-3.5 py-1.5 text-sm font-semibold text-foreground">
                  <BookOpen className="h-3.5 w-3.5 text-primary" />{exams.length} exams
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/85 px-3.5 py-1.5 text-sm font-semibold text-foreground">
                  <LayoutGrid className="h-3.5 w-3.5 text-primary" />{totalTests} total tests
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="hidden min-h-11 shrink-0 rounded-xl px-4 font-semibold sm:flex"
              onClick={() => setLocation("/packages")}
            >
              <Package className="mr-1.5 h-4 w-4" />Browse Packages
            </Button>
          </div>
        </section>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        <Button variant="outline" className="mb-6 min-h-11 w-full rounded-xl font-semibold sm:hidden" onClick={() => setLocation("/packages")}>
          <Package className="mr-1.5 h-4 w-4" />Browse Packages
        </Button>

        {exams.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border/80 bg-card/50 px-6 py-14 text-center">
            <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground"><BookOpen className="h-6 w-6" /></span>
            <p className="mt-4 text-sm font-medium text-muted-foreground">No exams available yet</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => {
              const meta = examMetaMap.get(exam.id);
              const examIcon = exam.icon ?? category.icon;
              return (
                <article
                  key={exam.id}
                  className="group relative flex cursor-pointer flex-col overflow-hidden rounded-2xl border border-border/80 bg-card/95 shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-1 hover:border-primary/25 hover:shadow-lg"
                  onClick={() => setLocation(`/subcategory/${exam.id}`)}
                  data-testid={`btn-open-exam-${exam.id}`}
                >
                  <div className="h-1.5 w-full" style={{ backgroundImage: gradient }} aria-hidden="true" />

                  <div className="flex flex-col gap-3.5 p-5">
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl shadow-sm ${isImageIcon(examIcon) ? "border border-border/80 bg-background text-foreground" : "text-white"}`}
                        style={isImageIcon(examIcon) ? undefined : { backgroundImage: gradient }}
                      >
                        <CategoryIcon icon={examIcon} className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1"><h2 className="text-xl font-bold leading-snug tracking-tight text-foreground">{exam.name}</h2></div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1 font-semibold text-foreground"><LayoutGrid className="h-3.5 w-3.5 text-primary" />{exam.totalTests} tests</span>
                      {exam.fullLengthCount > 0 && <span>{exam.fullLengthCount} full-length</span>}
                      {exam.sectionalCount > 0 && <span>{exam.sectionalCount} sectional</span>}
                      {exam.topicWiseCount > 0 && <span>{exam.topicWiseCount} topic-wise</span>}
                    </div>

                    {(meta?.avgDuration || meta?.avgQuestions) && (
                      <div className="flex items-center gap-3 text-sm text-muted-foreground">
                        {meta.avgDuration && <span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5 text-primary" />~{meta.avgDuration} min</span>}
                        {meta.avgQuestions && <span className="flex items-center gap-1"><Hash className="h-3.5 w-3.5" />~{meta.avgQuestions} Qs</span>}
                      </div>
                    )}

                    {meta && meta.totalCount > 0 && meta.attemptedCount > 0 && (
                      <div className="rounded-xl bg-muted/30 p-3">
                        <div className="mb-1.5 flex items-center justify-between">
                          <span className="flex items-center gap-1 text-xs text-muted-foreground"><RotateCcw className="h-3 w-3 text-primary" />Progress</span>
                          <span className="text-xs font-bold tabular-nums text-primary">{meta.attemptedCount}/{meta.totalCount}</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${Math.round((meta.attemptedCount / meta.totalCount) * 100)}%` }} />
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center gap-2">
                      {meta && meta.freeCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700"><ShieldCheck className="h-3 w-3" />{meta.freeCount} free</span>
                      )}
                      {meta && meta.paidCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-medium text-amber-700"><Lock className="h-3 w-3" />{meta.paidCount} locked</span>
                      )}
                    </div>
                  </div>

                  <div className="mt-auto border-t border-border/70 bg-muted/20 px-5 py-4">
                    <Button className="min-h-11 w-full rounded-xl font-semibold shadow-none" onClick={(event) => { event.stopPropagation(); setLocation(`/subcategory/${exam.id}`); }}>
                      View Tests<ChevronRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
