import { useMemo, useState } from "react";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, BookOpen, ChevronRight, Clock3, Hash, LayoutGrid, Lock, Package, RotateCcw, ShieldCheck } from "lucide-react";
import { getRuntimeExamGroups } from "@/lib/test-bank";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";
import { getAttempts } from "@/lib/storage";
import { API_BASE_URL } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { CategoryIcon } from "@/components/CategoryIcon";

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
      <div className="min-h-screen bg-background">
        <main className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="text-xl font-semibold text-foreground">Could not load category</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            API expected at <code className="rounded bg-muted px-1 py-0.5 text-xs">{API_BASE_URL}</code>
          </p>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-4xl animate-pulse px-4 py-12">
          <div className="h-8 w-40 rounded-lg bg-muted" />
          <div className="mt-6 h-20 rounded-xl bg-muted" />
          <div className="mt-4 space-y-3">
            {[1,2,3].map(i => <div key={i} className="h-16 rounded-xl bg-muted" />)}
          </div>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <main className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-4 py-10">
          <div className="rounded-xl border border-border/60 bg-card p-10 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-foreground">Category not found</h1>
            <p className="mt-3 text-sm text-muted-foreground">This category is not available right now.</p>
            <Button className="mt-6 rounded-lg" onClick={() => setLocation("/exams")}>Back to Exams</Button>
          </div>
        </main>
      </div>
    );
  }

  const totalTests = exams.reduce((sum, exam) => sum + exam.totalTests, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">

      {/* Top nav */}
      <div className="border-b border-border/50 bg-background/80 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6">
          <button
            onClick={() => setLocation("/exams")}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted/50 hover:text-foreground"
            data-testid="btn-back-exams"
          >
            <ArrowLeft className="h-4 w-4" />
            All exams
          </button>
        </div>
      </div>

      {/* Category header — subtle hero banner */}
      <div className="mx-auto max-w-5xl px-4 pt-6 pb-2 sm:px-6">
        <div className="rounded-2xl overflow-hidden border border-sky-100 bg-gradient-to-br from-sky-50 via-slate-50 to-indigo-50 px-5 py-6 shadow-sm">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="inline-flex items-center rounded-full px-3 py-1 mb-3" style={{ backgroundImage: gradient }}>
                <span className="text-[11px] font-bold uppercase tracking-widest text-white/90">Category</span>
              </div>
              <h1 className="text-[38px] font-black tracking-tight text-foreground leading-tight sm:text-[48px]">
                {category.name}
              </h1>
              <p className="mt-2 text-[17px] leading-[1.7] text-slate-500 max-w-xl">
                {category.description || `Practice tests for ${category.name} — full-length, sectional, and topic-wise.`}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 border border-slate-200 px-3.5 py-1.5 text-[15px] font-semibold text-slate-700">
                  <BookOpen className="h-3.5 w-3.5 text-primary/70" />{exams.length} exams
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 border border-slate-200 px-3.5 py-1.5 text-[15px] font-semibold text-slate-700">
                  <LayoutGrid className="h-3.5 w-3.5 text-primary/70" />{totalTests} total tests
                </span>
              </div>
            </div>
            <Button
              variant="outline"
              className="shrink-0 rounded-xl border-violet-300 text-violet-700 hover:bg-violet-50 font-semibold hidden sm:flex text-[14px] px-4 h-auto py-2"
              onClick={() => setLocation("/packages")}
            >
              <Package className="mr-1.5 h-4 w-4" />Buy Bundle
            </Button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6">

        {/* Mobile bundle CTA */}
        <Button
          variant="outline"
          className="mb-6 w-full rounded-xl border-violet-300 text-violet-700 hover:bg-violet-50 font-semibold sm:hidden text-[14px]"
          onClick={() => setLocation("/packages")}
        >
          <Package className="mr-1.5 h-4 w-4" />Buy a Bundle & Save
        </Button>

        {/* Exam grid */}
        {exams.length === 0 ? (
          <div className="rounded-xl border border-dashed border-border/60 px-6 py-14 text-center">
            <BookOpen className="mx-auto h-9 w-9 text-muted-foreground/40" />
            <p className="mt-3 text-[15px] text-muted-foreground">No exams available yet</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {exams.map((exam) => {
              const meta = examMetaMap.get(exam.id);
              return (
                <div
                  key={exam.id}
                  className="group relative flex flex-col rounded-2xl border border-slate-100 bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition-all duration-200 hover:shadow-[0_8px_24px_rgba(0,0,0,0.10)] hover:-translate-y-1 cursor-pointer overflow-hidden"
                  onClick={() => setLocation(`/subcategory/${exam.id}`)}
                  data-testid={`btn-open-exam-${exam.id}`}
                >
                  {/* Gradient top strip */}
                  <div className="h-1.5 w-full" style={{ backgroundImage: gradient }} />

                  {/* Card body */}
                  <div className="flex flex-col gap-3.5 p-5">
                    {/* Icon + title */}
                    <div className="flex items-start gap-3">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-white shadow-sm" style={{ backgroundImage: gradient }}>
                        <CategoryIcon icon={exam.icon} className="h-5 w-5" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[20px] font-bold text-slate-800 leading-snug">{exam.name}</p>
                        <span className="mt-1 inline-flex items-center rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-semibold text-blue-600">Latest Pattern</span>
                      </div>
                    </div>

                    {/* Meta row 1: test counts */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-slate-500">
                      <span className="flex items-center gap-1 font-semibold text-slate-700"><LayoutGrid className="h-3.5 w-3.5 text-primary/60" />{exam.totalTests} tests</span>
                      {exam.fullLengthCount > 0 && <span>{exam.fullLengthCount} full-length</span>}
                      {exam.sectionalCount > 0 && <span>{exam.sectionalCount} sectional</span>}
                      {exam.topicWiseCount > 0 && <span>{exam.topicWiseCount} topic-wise</span>}
                    </div>

                    {/* Meta row 2: avg duration + questions */}
                    {(meta?.avgDuration || meta?.avgQuestions) && (
                      <div className="flex items-center gap-3 text-[14px] text-slate-400">
                        {meta.avgDuration && <span className="flex items-center gap-1"><Clock3 className="h-3.5 w-3.5 text-sky-400" />~{meta.avgDuration} min</span>}
                        {meta.avgQuestions && <span className="flex items-center gap-1"><Hash className="h-3.5 w-3.5 text-slate-400" />~{meta.avgQuestions} Qs</span>}
                      </div>
                    )}

                    {/* Progress bar */}
                    {meta && meta.totalCount > 0 && meta.attemptedCount > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <span className="flex items-center gap-1 text-[12px] text-slate-400"><RotateCcw className="h-3 w-3 text-sky-400" />Progress</span>
                          <span className="text-[13px] font-bold text-sky-600">{meta.attemptedCount}/{meta.totalCount}</span>
                        </div>
                        <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                          <div
                            className="h-full rounded-full bg-gradient-to-r from-sky-500 to-indigo-500"
                            style={{ width: `${Math.round((meta.attemptedCount / meta.totalCount) * 100)}%` }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Access badges */}
                    <div className="flex flex-wrap items-center gap-2">
                      {meta && meta.freeCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[12px] font-medium text-emerald-700">
                          <ShieldCheck className="h-3 w-3" />{meta.freeCount} free
                        </span>
                      )}
                      {meta && meta.paidCount > 0 && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-[12px] font-medium text-amber-700">
                          <Lock className="h-3 w-3" />{meta.paidCount} locked
                        </span>
                      )}
                    </div>
                  </div>

                  {/* CTA footer */}
                  <div className="mt-auto border-t border-slate-100 bg-slate-50 px-5 py-3.5">
                    <Button
                      className="w-full rounded-xl text-[15px] font-semibold shadow-none h-10"
                      onClick={(e) => { e.stopPropagation(); setLocation(`/subcategory/${exam.id}`); }}
                    >
                      View Tests<ChevronRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}