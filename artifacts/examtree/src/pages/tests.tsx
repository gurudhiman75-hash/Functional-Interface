import { API_BASE_URL } from "@/lib/api";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";
import { useQuery } from "@tanstack/react-query";
import { getPublishedTests } from "@/lib/published-tests";
import { Button } from "@/components/ui/button";
import { useLocation } from "wouter";
import { ExamNavigator } from "@/components/ExamNavigator";

export default function Tests() {
  const { categories, subcategories, tests, isLoading, error } = useExamCatalog();
  const [, setLocation] = useLocation();
  const publishedTestsQuery = useQuery({ queryKey: ["published-tests"], queryFn: getPublishedTests, staleTime: 30_000 });

  if (error) {
    return (
      <div className="mx-auto max-w-lg rounded-2xl border border-rose-200 bg-white p-8 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
        <h1 className="text-xl font-semibold text-slate-950">Could not load tests and exams</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          API expected at <code className="rounded bg-slate-100 px-1 py-0.5 text-xs">{API_BASE_URL}</code>
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="skeleton-shimmer h-36 rounded-2xl" />
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          <div className="skeleton-shimmer h-64 rounded-2xl" />
          <div className="skeleton-shimmer h-64 rounded-2xl" />
          <div className="skeleton-shimmer h-64 rounded-2xl" />
        </div>
        <div className="skeleton-shimmer h-96 rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {publishedTestsQuery.data?.tests.length ? (
        <section className="mx-auto max-w-7xl rounded-2xl border border-primary/20 bg-primary/5 p-5 shadow-sm">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">New platform</p>
          <h2 className="mt-1 text-2xl font-semibold">Live mock tests</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {publishedTestsQuery.data.tests.map((test) => (
              <article key={test.id} className="rounded-xl border bg-card p-4">
                <p className="text-xs font-medium text-muted-foreground">{test.examName}</p>
                <h3 className="mt-1 font-semibold">{test.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{test.questionCount} questions · {Math.max(1, Math.ceil(test.durationSeconds / 60))} minutes</p>
                <Button className="mt-4" size="sm" onClick={() => setLocation(`/test/${test.id}`)}>Start test</Button>
              </article>
            ))}
          </div>
        </section>
      ) : null}
      <ExamNavigator categories={categories} subcategories={subcategories} tests={tests} />
    </div>
  );
}
