import { useMemo } from "react";
import { useLocation } from "wouter";
import { Clock3, ClipboardList } from "lucide-react";
import { PublicPage, usePageMeta } from "@/components/PublicPage";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";

export default function MockTestsHub() {
  const [, setLocation] = useLocation();
  const { tests, isLoading } = useExamCatalog();
  usePageMeta("Mock Tests", "Discover free, featured, latest, subject-wise, and multilingual mock tests on ExamTree.");

  const featured = useMemo(() => tests.slice(0, 9), [tests]);

  return (
    <PublicPage
      eyebrow="Mock test hub"
      title="Find free, featured, latest, and subject-wise mocks."
      description="Browse exam-ready mocks with difficulty, language, PYQ/generated labels, and timing metadata."
    >
      {isLoading ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3" aria-label="Loading mock tests">
          <div className="skeleton-shimmer h-44 rounded-2xl" />
          <div className="skeleton-shimmer h-44 rounded-2xl" />
          <div className="skeleton-shimmer h-44 rounded-2xl" />
        </div>
      ) : featured.length === 0 ? (
        <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center" data-testid="mock-tests-empty">
          <ClipboardList className="mx-auto h-9 w-9 text-slate-400" aria-hidden="true" />
          <h2 className="mt-3 text-lg font-semibold text-slate-950">No mock tests are published yet</h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-600">
            The catalog loaded successfully, but there are no mock tests to show right now. Check the full exam explorer for newly published tests.
          </p>
          <button
            type="button"
            onClick={() => setLocation("/tests")}
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-md bg-[#1e1b4b] px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-950"
          >
            Open exam explorer
          </button>
        </section>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((test) => (
            <button
              key={test.id}
              type="button"
              onClick={() => setLocation(`/test/${test.id}`)}
              className="rounded-2xl border border-slate-200 border-l-4 border-l-teal-500 bg-white p-5 text-left shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition hover:-translate-y-1 hover:border-teal-300"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="font-semibold text-slate-950">{test.name}</h3>
                  <p className="mt-1 text-xs text-slate-500">{test.category} / {test.subcategoryName ?? "General"}</p>
                </div>
                <span className="rounded-md border border-indigo-200 bg-indigo-50 px-2 py-1 text-[11px] font-semibold text-indigo-700">
                  {(test.access ?? "free") === "free" ? "Free" : "Premium"}
                </span>
              </div>
              <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1">
                  <ClipboardList className="h-3.5 w-3.5" />
                  {test.totalQuestions} Q
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-1">
                  <Clock3 className="h-3.5 w-3.5" />
                  {test.duration} min
                </span>
                <span className="rounded-md bg-teal-50 px-2 py-1 text-teal-700">{test.difficulty}</span>
                {(test.languages ?? ["en"]).map((lang) => (
                  <span key={lang} className="rounded-md bg-amber-50 px-2 py-1 text-amber-700">{lang.toUpperCase()}</span>
                ))}
              </div>
            </button>
          ))}
        </div>
      )}
    </PublicPage>
  );
}
