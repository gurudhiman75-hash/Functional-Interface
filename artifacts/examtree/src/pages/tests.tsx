import { API_BASE_URL } from "@/lib/api";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";
import { ExamNavigator } from "@/components/ExamNavigator";

export default function Tests() {
  const { categories, subcategories, tests, isLoading, error } = useExamCatalog();

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

  return <ExamNavigator categories={categories} subcategories={subcategories} tests={tests} />;
}
