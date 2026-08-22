import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  ChevronRight,
  Clock3,
  FileText,
  Languages,
  LayoutGrid,
  PlayCircle,
  RotateCcw,
  ShieldCheck,
  Target,
} from "lucide-react";

import { CategoryIcon } from "@/components/CategoryIcon";
import { Button } from "@/components/ui/button";
import { buildExamTreeNodes } from "@/lib/exam-tree";
import { getActiveTestSessions, getAttempts } from "@/lib/storage";
import type { Category, Subcategory, Test } from "@/lib/data";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";

type ExamGroup = {
  id: string;
  name: string;
  description: string;
  icon: string;
  tests: Test[];
  subExams: { id: string; name: string }[];
};

const GROUP_TONES = [
  {
    card: "border-emerald-200 bg-emerald-50/70 hover:border-emerald-300",
    icon: "bg-emerald-100 text-emerald-700",
    accent: "text-emerald-700",
  },
  {
    card: "border-blue-200 bg-blue-50/70 hover:border-blue-300",
    icon: "bg-blue-100 text-blue-700",
    accent: "text-blue-700",
  },
  {
    card: "border-violet-200 bg-violet-50/70 hover:border-violet-300",
    icon: "bg-violet-100 text-violet-700",
    accent: "text-violet-700",
  },
  {
    card: "border-orange-200 bg-orange-50/70 hover:border-orange-300",
    icon: "bg-orange-100 text-orange-700",
    accent: "text-orange-700",
  },
  {
    card: "border-cyan-200 bg-cyan-50/70 hover:border-cyan-300",
    icon: "bg-cyan-100 text-cyan-700",
    accent: "text-cyan-700",
  },
  {
    card: "border-rose-200 bg-rose-50/70 hover:border-rose-300",
    icon: "bg-rose-100 text-rose-700",
    accent: "text-rose-700",
  },
] as const;

function buildExamGroups(
  categories: Category[],
  subcategories: Subcategory[],
  tests: Test[],
): ExamGroup[] {
  return buildExamTreeNodes(categories, subcategories, tests).map((category) => ({
    id: category.id,
    name: category.name,
    description: category.description,
    icon: category.icon || "LayoutGrid",
    tests: category.tests,
    subExams: category.subcategories.map((subExam) => ({ id: subExam.id, name: subExam.name })),
  }));
}

function formatCount(value: number) {
  return new Intl.NumberFormat("en-IN").format(Math.max(0, value));
}

function TestMeta({ test, inverse = false }: { test: Test; inverse?: boolean }) {
  const textClass = inverse ? "text-slate-400" : "text-muted-foreground";
  return (
    <div className={`flex flex-wrap items-center gap-x-4 gap-y-2 text-sm ${textClass}`}>
      <span className="inline-flex items-center gap-1.5">
        <LayoutGrid className="h-4 w-4" aria-hidden="true" />
        {test.totalQuestions} questions
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Clock3 className="h-4 w-4" aria-hidden="true" />
        {test.duration} min
      </span>
      {test.languages && test.languages.length > 0 ? (
        <span className="inline-flex items-center gap-1.5">
          <Languages className="h-4 w-4" aria-hidden="true" />
          {test.languages.length > 1 ? `${test.languages.length} languages` : test.languages[0]}
        </span>
      ) : null}
    </div>
  );
}

export default function Home() {
  const [, setLocation] = useLocation();
  const attempts = getAttempts();
  const activeSessions = getActiveTestSessions();
  const { tests, categories, subcategories, isLoading } = useExamCatalog();
  const [selectedGroupId, setSelectedGroupId] = useState("");

  const latestAttempt = attempts[0] ?? null;
  const activeSessionEntries = Object.values(activeSessions).slice(0, 2);
  const examGroups = useMemo(
    () => buildExamGroups(categories, subcategories, tests),
    [categories, subcategories, tests],
  );

  const selectedGroup = examGroups.find((group) => group.id === selectedGroupId) ?? examGroups[0] ?? null;
  const freeTests = useMemo(
    () => tests.filter((test) => (test.access ?? "free") === "free"),
    [tests],
  );
  const heroTest = selectedGroup?.tests.find((test) => (test.access ?? "free") === "free") ?? freeTests[0] ?? tests[0] ?? null;
  const featuredFreeTests = freeTests.slice(0, 4);
  const catalogQuestionCount = tests.reduce((sum, test) => sum + Math.max(0, test.totalQuestions), 0);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8" role="status" aria-label="Loading ExamTree home">
        <div className="skeleton-shimmer h-[560px] rounded-[2rem]" />
        <div className="grid gap-5 md:grid-cols-3">
          <div className="skeleton-shimmer h-40 rounded-2xl" />
          <div className="skeleton-shimmer h-40 rounded-2xl" />
          <div className="skeleton-shimmer h-40 rounded-2xl" />
        </div>
        <span className="sr-only">Loading published tests and exam pathways…</span>
      </div>
    );
  }

  return (
    <div className="bg-background">
      <section className="relative overflow-hidden bg-[#090f2e] text-white">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 top-12 h-80 w-80 rounded-full bg-indigo-600/20 blur-3xl" />
          <div className="absolute right-0 top-8 h-96 w-96 rounded-full bg-violet-600/20 blur-3xl" />
          <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
        </div>

        <div className="relative mx-auto grid min-h-[590px] max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:px-8 lg:py-16">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-emerald-300/20 bg-emerald-300/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Focused mock-test practice
            </p>

            <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-[-0.045em] text-white sm:text-5xl lg:text-[64px] lg:leading-[1.02]">
              Practice smarter.
              <span className="block text-emerald-400">Score with confidence.</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-300 sm:text-lg">
              Choose your exam, take live published mock tests, save every attempt, and review solutions from one focused workspace.
            </p>

            <div className="mt-8 flex max-w-2xl flex-col gap-3 sm:flex-row">
              <label htmlFor="home-exam-select" className="sr-only">Select your exam</label>
              <select
                id="home-exam-select"
                value={selectedGroupId}
                onChange={(event) => setSelectedGroupId(event.target.value)}
                className="h-13 min-h-[52px] flex-1 rounded-xl border border-white/15 bg-white px-4 text-base font-semibold text-slate-900 shadow-xl outline-none ring-offset-2 focus:ring-2 focus:ring-emerald-400"
              >
                <option value="">Select your exam</option>
                {examGroups.map((group) => (
                  <option key={group.id} value={group.id}>{group.name}</option>
                ))}
              </select>
              <Button
                className="h-13 min-h-[52px] rounded-xl bg-emerald-500 px-6 text-base font-bold text-slate-950 shadow-lg shadow-emerald-900/20 hover:bg-emerald-400"
                onClick={() => setLocation(selectedGroup ? `/category/${selectedGroup.id}` : "/tests")}
              >
                Find tests
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </div>

            <div className="mt-8 grid max-w-2xl grid-cols-2 gap-x-5 gap-y-4 sm:grid-cols-4">
              <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                <Target className="h-5 w-5 shrink-0 text-emerald-400" aria-hidden="true" />
                Exam-based mocks
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                <FileText className="h-5 w-5 shrink-0 text-emerald-400" aria-hidden="true" />
                Saved solutions
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                <RotateCcw className="h-5 w-5 shrink-0 text-emerald-400" aria-hidden="true" />
                Resume attempts
              </div>
              <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
                <Languages className="h-5 w-5 shrink-0 text-emerald-400" aria-hidden="true" />
                Multilingual when live
              </div>
            </div>

            <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-2 border-t border-white/10 pt-6 text-sm text-slate-400">
              <span><strong className="font-bold text-white">Published tests: {formatCount(tests.length)}</strong></span>
              <span><strong className="font-bold text-white">Questions in live catalog: {formatCount(catalogQuestionCount)}</strong></span>
            </div>
          </div>

          <div className="lg:pl-4">
            <div className="rounded-2xl border border-white/10 bg-white/[0.07] p-4 shadow-2xl shadow-black/20 backdrop-blur-md sm:p-5">
              <div className="flex items-center justify-between gap-4 px-1 pb-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-300">Free mock ready</p>
                  <h2 className="mt-1 text-lg font-bold text-white">Start with a live published test</h2>
                </div>
                <span className="rounded-lg bg-emerald-500 px-2.5 py-1 text-xs font-black text-slate-950">FREE</span>
              </div>

              {heroTest ? (
                <div className="rounded-xl bg-white p-5 text-slate-950 shadow-xl sm:p-6">
                  <span className="inline-flex rounded-lg bg-indigo-100 px-2.5 py-1 text-xs font-black uppercase tracking-[0.08em] text-indigo-700">
                    {heroTest.category}
                  </span>
                  <h3 className="mt-4 text-2xl font-black tracking-tight text-slate-950">{heroTest.name}</h3>
                  <div className="mt-4">
                    <TestMeta test={heroTest} />
                  </div>

                  <Button
                    className="mt-6 h-12 w-full rounded-xl bg-emerald-500 text-base font-black text-slate-950 hover:bg-emerald-400"
                    onClick={() => setLocation(`/test/${heroTest.id}`)}
                  >
                    Start free test
                    <PlayCircle className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Button>

                  <div className="mt-6 border-t border-slate-100 pt-5">
                    <p className="text-sm font-black text-slate-900">What you get</p>
                    <div className="mt-3 space-y-2.5 text-sm text-slate-600">
                      <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />Questions from the current published test version</p>
                      <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />Saved attempt after submission</p>
                      <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" aria-hidden="true" />Solution review from the committed result</p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-xl bg-white p-7 text-sm text-slate-600">
                  No published mock is available right now. Browse the live catalog for current exam pathways.
                </div>
              )}

              <div className="mt-3 rounded-xl border border-white/10 bg-white/[0.05] px-4 py-3 text-sm text-slate-300">
                Already practicing? <button type="button" className="font-bold text-emerald-300 hover:text-emerald-200" onClick={() => setLocation("/dashboard")}>Open your activity</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {(latestAttempt || activeSessionEntries.length > 0) && (
        <section className="border-b border-border bg-muted/30">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-primary">Continue where you left off</p>
              <h2 className="mt-1 text-xl font-black tracking-tight text-foreground">Your saved practice is ready.</h2>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              {activeSessionEntries[0] ? (
                <Button variant="outline" className="min-h-11 rounded-xl bg-background" onClick={() => setLocation(`/test/${activeSessionEntries[0]!.testId}`)}>
                  <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                  Resume test
                </Button>
              ) : null}
              {latestAttempt ? (
                <Button
                  variant="outline"
                  className="min-h-11 rounded-xl bg-background"
                  onClick={() => setLocation(`/result?attemptId=${encodeURIComponent(latestAttempt.id)}&testId=${encodeURIComponent(latestAttempt.testId)}&tab=review`)}
                >
                  <BarChart3 className="mr-2 h-4 w-4" aria-hidden="true" />
                  Review last result
                </Button>
              ) : null}
            </div>
          </div>
        </section>
      )}

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8" aria-labelledby="journey-heading">
        <div className="text-center">
          <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">A simple practice loop</p>
          <h2 id="journey-heading" className="mt-2 text-3xl font-black tracking-tight text-foreground sm:text-4xl">Choose. Practice. Review.</h2>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">Three steps designed to keep the student focused on actual exam practice.</p>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          <div className="relative rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-700"><BookOpenCheck className="h-6 w-6" aria-hidden="true" /></span>
            <p className="mt-5 text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">Step 1</p>
            <h3 className="mt-1 text-lg font-black text-foreground">Choose your exam</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Open the exam family and pick from the tests that are actually published.</p>
          </div>
          <div className="relative rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-violet-100 text-violet-700"><Target className="h-6 w-6" aria-hidden="true" /></span>
            <p className="mt-5 text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">Step 2</p>
            <h3 className="mt-1 text-lg font-black text-foreground">Practice seriously</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Take the mock in the runner, with its configured timing and question structure.</p>
          </div>
          <div className="relative rounded-2xl border border-border bg-card p-6 text-center shadow-sm">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-orange-100 text-orange-700"><BarChart3 className="h-6 w-6" aria-hidden="true" /></span>
            <p className="mt-5 text-xs font-black uppercase tracking-[0.12em] text-muted-foreground">Step 3</p>
            <h3 className="mt-1 text-lg font-black text-foreground">Review the result</h3>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Reopen the committed attempt, inspect answers, and use the solution review to improve.</p>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-muted/25">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8" aria-labelledby="exam-families-heading">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.16em] text-primary">Exam families</p>
              <h2 id="exam-families-heading" className="mt-2 text-3xl font-black tracking-tight text-foreground sm:text-4xl">Find your exam faster.</h2>
            </div>
            <Button variant="ghost" className="min-h-11 w-fit rounded-xl" onClick={() => setLocation("/tests")}>
              View all exams <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </div>

          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {examGroups.slice(0, 6).map((group, index) => {
              const tone = GROUP_TONES[index % GROUP_TONES.length];
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setLocation(`/category/${group.id}`)}
                  className={`et-interactive group min-h-[168px] rounded-2xl border p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-md ${tone.card}`}
                >
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${tone.icon}`}>
                    <CategoryIcon icon={group.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 line-clamp-2 text-base font-black leading-tight text-foreground">{group.name}</h3>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">{formatCount(group.tests.length)} tests · {formatCount(group.subExams.length)} exam branches</p>
                  <span className={`mt-4 inline-flex items-center text-xs font-black ${tone.accent}`}>Explore <ChevronRight className="ml-1 h-3.5 w-3.5 transition group-hover:translate-x-0.5" aria-hidden="true" /></span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8" aria-labelledby="free-mocks-heading">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.16em] text-emerald-700">Free mocks</p>
            <h2 id="free-mocks-heading" className="mt-2 text-3xl font-black tracking-tight text-foreground sm:text-4xl">Start practicing now.</h2>
          </div>
          <Button variant="outline" className="min-h-11 w-fit rounded-xl" onClick={() => setLocation("/tests")}>Browse Live Tests</Button>
        </div>

        {featuredFreeTests.length > 0 ? (
          <div className="mt-7 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {featuredFreeTests.map((test) => (
              <article key={test.id} className="flex flex-col rounded-2xl border border-border bg-card p-5 shadow-sm transition hover:border-primary/30 hover:shadow-md">
                <span className="w-fit rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-black text-emerald-700">FREE</span>
                <p className="mt-4 text-xs font-bold uppercase tracking-[0.1em] text-primary">{test.category}</p>
                <h3 className="mt-2 line-clamp-2 text-lg font-black leading-snug text-foreground">{test.name}</h3>
                <div className="mt-4"><TestMeta test={test} /></div>
                <Button className="mt-6 min-h-11 w-full rounded-xl" onClick={() => setLocation(`/test/${test.id}`)}>
                  Start test <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-7 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No free mock is published right now.</div>
        )}
      </section>
    </div>
  );
}
