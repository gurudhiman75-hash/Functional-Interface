import { useMemo } from "react";
import { useLocation } from "wouter";
import { Clock3, ClipboardList } from "lucide-react";
import { PublicPage, usePageMeta } from "@/components/PublicPage";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";

export default function MockTestsHub() {
  const [, setLocation] = useLocation();
  const { tests } = useExamCatalog();
  usePageMeta("Mock Tests", "Discover free, featured, latest, subject-wise, and multilingual mock tests on ExamTree.");

  const featured = useMemo(() => tests.slice(0, 9), [tests]);

  return (
    <PublicPage
      eyebrow="Mock test hub"
      title="Find free, featured, latest, and subject-wise mocks."
      description="Browse exam-ready mocks with difficulty, language, PYQ/generated labels, and timing metadata."
    >
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
    </PublicPage>
  );
}

