import { useMemo } from "react";
import { useLocation, useParams } from "wouter";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  Clock3,
  Hash,
  LayoutGrid,
  Lock,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";

import { CategoryIcon, isImageIcon } from "@/components/CategoryIcon";
import { Button } from "@/components/ui/button";
import { getAttempts } from "@/lib/storage";
import { getRuntimeExamGroups } from "@/lib/test-bank";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";

const CARD_TONES = [
  { icon: "bg-[#f0efff] text-[#6657e8]", accent: "bg-[#6657e8]" },
  { icon: "bg-[#eaf8f2] text-[#23956c]", accent: "bg-[#23956c]" },
  { icon: "bg-[#fff3e8] text-[#d78331]", accent: "bg-[#d78331]" },
  { icon: "bg-[#fff0f4] text-[#cf5d7b]", accent: "bg-[#cf5d7b]" },
  { icon: "bg-[#eaf7fb] text-[#3b91ad]", accent: "bg-[#3b91ad]" },
  { icon: "bg-[#f5edfb] text-[#9563bd]", accent: "bg-[#9563bd]" },
] as const;

const CATEGORY_TONES: Record<string, { icon: string; eyebrow: string }> = {
  blue: { icon: "bg-[#eef3ff] text-[#5f63df]", eyebrow: "text-[#6657e8]" },
  emerald: { icon: "bg-[#eaf8f2] text-[#238a68]", eyebrow: "text-[#238a68]" },
  violet: { icon: "bg-[#f4edff] text-[#8259c8]", eyebrow: "text-[#7455c6]" },
  amber: { icon: "bg-[#fff5e6] text-[#c98228]", eyebrow: "text-[#b87524]" },
  orange: { icon: "bg-[#fff2e9] text-[#cf7330]", eyebrow: "text-[#c46b2c]" },
  rose: { icon: "bg-[#fff0f4] text-[#c75b78]", eyebrow: "text-[#bc526f]" },
  indigo: { icon: "bg-[#efefff] text-[#6159cf]", eyebrow: "text-[#6159cf]" },
  red: { icon: "bg-[#fff0f0] text-[#c95454]", eyebrow: "text-[#b94c4c]" },
};

function formatCount(value: number) {
  return new Intl.NumberFormat("en-IN").format(Math.max(0, Number(value) || 0));
}

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
    const map = new Map<string, {
      freeCount: number;
      paidCount: number;
      avgDuration: number | null;
      avgQuestions: number | null;
      attemptedCount: number;
      totalCount: number;
    }>();

    for (const exam of exams) {
      const examTests = exam.id.startsWith("general-")
        ? tests.filter((test) => test.categoryId === exam.categoryId && !test.subcategoryId)
        : tests.filter((test) => test.subcategoryId === exam.id);
      const withDuration = examTests.filter((test) => test.duration);
      const withQuestions = examTests.filter((test) => test.totalQuestions);

      map.set(exam.id, {
        freeCount: examTests.filter((test) => (test.access ?? "free") === "free").length,
        paidCount: examTests.filter((test) => (test.access ?? "free") !== "free").length,
        avgDuration: withDuration.length
          ? Math.round(withDuration.reduce((sum, test) => sum + test.duration, 0) / withDuration.length)
          : null,
        avgQuestions: withQuestions.length
          ? Math.round(withQuestions.reduce((sum, test) => sum + test.totalQuestions, 0) / withQuestions.length)
          : null,
        attemptedCount: examTests.filter((test) => attemptedTestIds.has(test.id)).length,
        totalCount: examTests.length,
      });
    }

    return map;
  }, [attemptedTestIds, exams, tests]);

  if (error) {
    return (
      <div className="min-h-screen bg-[#f7f8fc]">
        <main className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="text-xl font-semibold text-slate-950">Could not load category</h1>
          <p className="mt-2 text-sm text-slate-500">The exam catalog is temporarily unavailable. Please try again.</p>
          <Button className="mt-5 min-h-11" variant="outline" onClick={() => window.location.reload()}>Retry</Button>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#f7f8fc]">
        <div className="mx-auto max-w-6xl animate-pulse px-4 py-8 sm:px-6 lg:px-8" role="status" aria-label="Loading category">
          <div className="h-5 w-32 rounded bg-slate-200" />
          <div className="mt-6 h-56 rounded-2xl bg-slate-200" />
          <div className="mt-12 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {Array.from({ length: 6 }, (_, index) => <div key={index} className="h-56 rounded-2xl bg-slate-200" />)}
          </div>
          <span className="sr-only">Loading exams and test counts…</span>
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-[#f7f8fc]">
        <main className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-4 py-10">
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
            <h1 className="text-2xl font-bold text-slate-950">Category not found</h1>
            <p className="mt-3 text-sm text-slate-500">This category is not available right now.</p>
            <Button className="mt-6 min-h-11 rounded-xl" onClick={() => setLocation("/exams")}>Back to Exams</Button>
          </div>
        </main>
      </div>
    );
  }

  const totalTests = exams.reduce((sum, exam) => sum + exam.totalTests, 0);
  const totalFreeTests = exams.reduce((sum, exam) => sum + (examMetaMap.get(exam.id)?.freeCount ?? 0), 0);
  const fullLengthTests = exams.reduce((sum, exam) => sum + exam.fullLengthCount, 0);
  const sectionalTests = exams.reduce((sum, exam) => sum + exam.sectionalCount, 0);
  const topicWiseTests = exams.reduce((sum, exam) => sum + exam.topicWiseCount, 0);
  const attemptedTests = exams.reduce((sum, exam) => sum + (examMetaMap.get(exam.id)?.attemptedCount ?? 0), 0);
  const featuredExam = exams.find((exam) => exam.totalTests > 0) ?? exams[0] ?? null;
  const categoryTone = CATEGORY_TONES[category.color ?? "blue"] ?? CATEGORY_TONES.blue;

  return (
    <div className="sites-page-shell category-page min-h-screen overflow-x-hidden bg-[#f7f8fc] text-slate-950">
      <div className="mx-auto w-full max-w-6xl px-4 pb-16 pt-5 sm:px-6 sm:pt-7 lg:px-8">
        <button
          type="button"
          onClick={() => setLocation("/exams")}
          className="inline-flex min-h-11 items-center gap-2 rounded-lg px-2 text-xs font-semibold text-slate-500 transition hover:bg-white hover:text-slate-900"
          data-testid="btn-back-exams"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          All exams
        </button>

        <section className="mt-2 overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(26,32,44,0.04)]" aria-labelledby="category-heading">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex items-start gap-4 sm:gap-5">
                <div className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl ${categoryTone.icon}`}>
                  <CategoryIcon icon={category.icon} className="h-7 w-7" />
                </div>
                <div className="min-w-0">
                  <p className={`text-[10px] font-black uppercase tracking-[0.18em] ${categoryTone.eyebrow}`}>Exam category</p>
                  <h1 id="category-heading" className="mt-2 text-3xl font-semibold tracking-[-0.045em] text-slate-950 sm:text-4xl">
                    {category.name}
                  </h1>
                  <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-500 sm:text-[15px]">
                    {category.description || `Practice ${category.name} with full-length mocks, sectional tests and topic-wise drills.`}
                  </p>
                </div>
              </div>

              <div className="mt-7 grid grid-cols-3 gap-3 sm:max-w-xl">
                <div className="rounded-xl bg-[#fafaff] px-3 py-3 ring-1 ring-slate-100">
                  <div className="text-xl font-semibold tracking-tight text-slate-950">{formatCount(exams.length)}</div>
                  <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">Exams</div>
                </div>
                <div className="rounded-xl bg-[#fafaff] px-3 py-3 ring-1 ring-slate-100">
                  <div className="text-xl font-semibold tracking-tight text-slate-950">{formatCount(totalTests)}</div>
                  <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">Tests</div>
                </div>
                <div className="rounded-xl bg-[#fafaff] px-3 py-3 ring-1 ring-slate-100">
                  <div className="text-xl font-semibold tracking-tight text-[#2d9b73]">{formatCount(totalFreeTests)}</div>
                  <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">Free</div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setLocation("/packages")}
                className="mt-5 inline-flex min-h-11 items-center gap-1.5 rounded-lg px-2 text-xs font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-[#6657e8] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c5cf1]"
              >
                Browse Packages
                <ChevronRight className="h-3.5 w-3.5" aria-hidden="true" />
              </button>
            </div>

            <div className="border-t border-slate-100 bg-[#17182c] p-6 text-white lg:border-l lg:border-t-0 lg:p-8">
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#8f84ff]">Category snapshot</p>
              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
                  <span className="flex items-center gap-2 text-xs text-white/60"><LayoutGrid className="h-4 w-4 text-[#8f84ff]" />Full-length</span>
                  <span className="text-lg font-semibold">{formatCount(fullLengthTests)}</span>
                </div>
                <div className="flex items-center justify-between gap-4 border-b border-white/[0.08] pb-4">
                  <span className="flex items-center gap-2 text-xs text-white/60"><Target className="h-4 w-4 text-[#8f84ff]" />Sectional</span>
                  <span className="text-lg font-semibold">{formatCount(sectionalTests)}</span>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <span className="flex items-center gap-2 text-xs text-white/60"><BookOpen className="h-4 w-4 text-[#8f84ff]" />Topic-wise</span>
                  <span className="text-lg font-semibold">{formatCount(topicWiseTests)}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-14" aria-labelledby="choose-exam-heading">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#6c5cf1]">Choose your exam</p>
              <h2 id="choose-exam-heading" className="mt-2 text-2xl font-semibold tracking-[-0.035em] text-slate-950 sm:text-[28px]">{category.name} exams</h2>
              <p className="mt-2 text-sm text-slate-500">Open an exam to see its full-length, sectional and topic-wise tests.</p>
            </div>
            {attemptedTests > 0 ? (
              <div className="inline-flex items-center gap-2 self-start rounded-full bg-white px-3 py-2 text-[11px] font-semibold text-slate-500 ring-1 ring-slate-200 sm:self-auto">
                <RotateCcw className="h-3.5 w-3.5 text-[#6c5cf1]" />
                {formatCount(attemptedTests)} attempted
              </div>
            ) : null}
          </div>

          {exams.length === 0 ? (
            <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <BookOpen className="mx-auto h-9 w-9 text-slate-300" />
              <p className="mt-3 text-sm font-medium text-slate-500">No exams are available in this category yet.</p>
            </div>
          ) : (
            <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {exams.map((exam, index) => {
                const meta = examMetaMap.get(exam.id);
                const examIcon = exam.icon ?? category.icon;
                const tone = CARD_TONES[index % CARD_TONES.length];
                const progress = meta && meta.totalCount > 0
                  ? Math.round((meta.attemptedCount / meta.totalCount) * 100)
                  : 0;

                return (
                  <button
                    key={exam.id}
                    type="button"
                    onClick={() => setLocation(`/subcategory/${exam.id}`)}
                    className="group flex min-h-[236px] w-full flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white text-left shadow-[0_5px_20px_rgba(26,32,44,0.035)] transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-[0_12px_28px_rgba(26,32,44,0.07)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6c5cf1] focus-visible:ring-offset-2"
                    data-testid={`btn-open-exam-${exam.id}`}
                  >
                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <div className="flex items-start gap-3.5">
                        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${isImageIcon(examIcon) ? "border border-slate-200 bg-white text-slate-700" : tone.icon}`}>
                          <CategoryIcon icon={examIcon} className="h-5 w-5" />
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block text-[17px] font-semibold leading-6 tracking-[-0.02em] text-slate-900">{exam.name}</span>
                          <span className="mt-1.5 block line-clamp-2 text-xs leading-5 text-slate-500">
                            {exam.description || `${exam.totalTests} published tests available for practice.`}
                          </span>
                        </span>
                        <ChevronRight className="mt-1 h-4 w-4 shrink-0 text-slate-300 transition-transform group-hover:translate-x-0.5 group-hover:text-[#6c5cf1]" aria-hidden="true" />
                      </div>

                      <div className="mt-5 flex flex-wrap gap-x-3 gap-y-2 text-[11px] font-medium text-slate-500">
                        <span className="inline-flex items-center gap-1.5"><LayoutGrid className="h-3.5 w-3.5 text-slate-400" />{formatCount(exam.totalTests)} tests</span>
                        {meta?.avgDuration ? <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5 text-slate-400" />~{meta.avgDuration} min</span> : null}
                        {meta?.avgQuestions ? <span className="inline-flex items-center gap-1.5"><Hash className="h-3.5 w-3.5 text-slate-400" />~{meta.avgQuestions} Qs</span> : null}
                      </div>

                      <div className="mt-4 flex flex-wrap items-center gap-2">
                        {meta && meta.freeCount > 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#edf9f4] px-2.5 py-1 text-[10px] font-bold text-[#238a68]">
                            <ShieldCheck className="h-3 w-3" />{meta.freeCount} free
                          </span>
                        ) : null}
                        {meta && meta.paidCount > 0 ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-[#fff5e8] px-2.5 py-1 text-[10px] font-bold text-[#aa6f29]">
                            <Lock className="h-3 w-3" />{meta.paidCount} locked
                          </span>
                        ) : null}
                      </div>

                      {meta && meta.attemptedCount > 0 ? (
                        <div className="mt-auto pt-5">
                          <div className="mb-1.5 flex items-center justify-between text-[10px] font-semibold text-slate-400">
                            <span>Progress</span>
                            <span className="text-[#6657e8]">{meta.attemptedCount}/{meta.totalCount}</span>
                          </div>
                          <div className="h-1.5 overflow-hidden rounded-full bg-slate-100">
                            <span className={`block h-full rounded-full ${tone.accent}`} style={{ width: `${progress}%` }} />
                          </div>
                        </div>
                      ) : null}
                    </div>

                    <span className="flex min-h-12 items-center justify-between border-t border-slate-100 px-5 text-xs font-semibold text-slate-600 transition group-hover:bg-[#fafaff] group-hover:text-[#6657e8] sm:px-6">
                      View tests
                      <ArrowRight className="h-4 w-4" aria-hidden="true" />
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </section>

        <section className="mt-14 overflow-hidden rounded-2xl bg-[#17182c] text-white" aria-labelledby="practice-modes-heading">
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_minmax(320px,0.75fr)] lg:items-center lg:p-10">
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.18em] text-[#8f84ff]">Practice your way</p>
              <h2 id="practice-modes-heading" className="mt-3 max-w-xl text-2xl font-medium leading-tight tracking-[-0.04em] sm:text-3xl">One category. Every practice mode in one place.</h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-white/55">Move from exam-like mocks to focused revision without leaving the {category.name} catalogue.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {[
                  { label: "Full-length", value: fullLengthTests, icon: LayoutGrid },
                  { label: "Sectional", value: sectionalTests, icon: Target },
                  { label: "Topic-wise", value: topicWiseTests, icon: BookOpen },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-white/[0.08] bg-white/[0.04] px-4 py-4">
                    <item.icon className="h-4 w-4 text-[#8f84ff]" />
                    <div className="mt-3 text-xl font-semibold">{formatCount(item.value)}</div>
                    <div className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.08em] text-white/35">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-5 text-slate-950 shadow-xl sm:p-6">
              <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.12em] text-slate-400"><Sparkles className="h-4 w-4 text-[#6657e8]" />Built for focused practice</div>
              <div className="mt-5 space-y-4">
                <div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2d9b73]" /><div><div className="text-sm font-semibold">See free tests before locked tests</div><div className="mt-1 text-xs leading-5 text-slate-500">Each exam card shows the live free-test count from the catalogue.</div></div></div>
                <div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2d9b73]" /><div><div className="text-sm font-semibold">Keep your progress visible</div><div className="mt-1 text-xs leading-5 text-slate-500">Attempted tests are reflected on the exam cards when progress exists.</div></div></div>
                <div className="flex items-start gap-3"><CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#2d9b73]" /><div><div className="text-sm font-semibold">Choose by real test inventory</div><div className="mt-1 text-xs leading-5 text-slate-500">Counts come from the published ExamTree catalogue, not marketing placeholders.</div></div></div>
              </div>
            </div>
          </div>
        </section>

        {featuredExam ? (
          <section className="mt-14 overflow-hidden rounded-2xl bg-gradient-to-r from-[#6657f5] to-[#7b70f6] text-white" aria-label="Start practising">
            <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1fr)_260px] lg:items-center lg:p-10">
              <div>
                <p className="text-[9px] font-black uppercase tracking-[0.16em] text-white/65">Your next test starts here</p>
                <h2 className="mt-3 max-w-2xl text-2xl font-medium leading-tight tracking-[-0.04em] sm:text-3xl">Ready to start practising {category.name}?</h2>
                <p className="mt-2 max-w-xl text-sm text-white/70">Open {featuredExam.name} and choose the test format that fits your preparation today.</p>
                <button
                  type="button"
                  onClick={() => setLocation(`/subcategory/${featuredExam.id}`)}
                  className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-lg bg-white px-4 py-2 text-xs font-bold text-[#5e50df] shadow-sm transition hover:bg-white/95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
                >
                  Open {featuredExam.name}
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
              <div className="rounded-2xl border border-white/15 bg-white/[0.08] p-5 backdrop-blur-sm">
                <div className="text-[9px] font-semibold uppercase tracking-[0.1em] text-white/45">Available now</div>
                <div className="mt-2 text-3xl font-semibold tracking-tight">{formatCount(totalTests)}</div>
                <div className="mt-1 text-sm text-white/70">published tests</div>
                {totalFreeTests > 0 ? <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-2.5 py-1 text-[10px] font-semibold text-white/80"><ShieldCheck className="h-3 w-3" />{formatCount(totalFreeTests)} free to start</div> : null}
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </div>
  );
}