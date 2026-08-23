import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  ChevronRight,
  Clock3,
  Languages,
  LayoutGrid,
  PlayCircle,
  RotateCcw,
  Sparkles,
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
  { icon: "bg-blue-100 text-blue-700", card: "bg-blue-50/70 border-blue-100" },
  { icon: "bg-emerald-100 text-emerald-700", card: "bg-emerald-50/70 border-emerald-100" },
  { icon: "bg-orange-100 text-orange-700", card: "bg-orange-50/70 border-orange-100" },
  { icon: "bg-violet-100 text-violet-700", card: "bg-violet-50/70 border-violet-100" },
  { icon: "bg-rose-100 text-rose-700", card: "bg-rose-50/70 border-rose-100" },
  { icon: "bg-cyan-100 text-cyan-700", card: "bg-cyan-50/70 border-cyan-100" },
] as const;

function buildExamGroups(categories: Category[], subcategories: Subcategory[], tests: Test[]): ExamGroup[] {
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

function TestMeta({ test }: { test: Test }) {
  return (
    <div className="grid grid-cols-3 gap-3 border-y border-border/70 py-3 text-xs text-muted-foreground">
      <span>
        <strong className="block text-sm font-bold text-foreground">{test.totalQuestions}</strong>
        Questions
      </span>
      <span>
        <strong className="block text-sm font-bold text-foreground">{test.duration}</strong>
        Minutes
      </span>
      <span>
        <strong className="block truncate text-sm font-bold text-foreground">
          {test.languages?.length ? test.languages.length : 1}
        </strong>
        {test.languages?.length === 1 ? "Language" : "Languages"}
      </span>
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
  const freeTests = useMemo(() => tests.filter((test) => (test.access ?? "free") === "free"), [tests]);
  const heroTest = selectedGroup?.tests.find((test) => (test.access ?? "free") === "free") ?? freeTests[0] ?? tests[0] ?? null;
  const featuredFreeTests = freeTests.slice(0, 3);
  const catalogQuestionCount = tests.reduce((sum, test) => sum + Math.max(0, test.totalQuestions), 0);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-5 px-4 py-6 sm:px-6 lg:px-8" role="status" aria-label="Loading ExamTree home">
        <div className="skeleton-shimmer h-[360px] rounded-[28px]" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="skeleton-shimmer h-28 rounded-2xl" />
          <div className="skeleton-shimmer h-28 rounded-2xl" />
          <div className="skeleton-shimmer h-28 rounded-2xl" />
        </div>
        <span className="sr-only">Loading published tests and exam pathways…</span>
      </div>
    );
  }

  return (
    <div className="bg-muted/20 py-5 sm:py-7">
      <div className="mx-auto max-w-7xl space-y-5 px-4 sm:px-6 lg:px-8">
        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-blue-700 via-blue-600 to-sky-500 text-white shadow-[0_18px_50px_-28px_rgba(37,99,235,0.65)]">
          <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full border border-white/10 bg-white/5" />
          <div className="pointer-events-none absolute -bottom-28 right-1/3 h-72 w-72 rounded-full bg-indigo-900/20 blur-2xl" />

          <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:p-10">
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-bold backdrop-blur-sm">
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                Built around real published mocks
              </span>

              <h1 className="mt-5 max-w-2xl text-4xl font-black tracking-[-0.04em] sm:text-5xl lg:text-[58px] lg:leading-[1.04]">
                Practice smarter.
                <span className="block">Score with confidence.</span>
              </h1>
              <p className="mt-4 max-w-xl text-base leading-7 text-blue-50 sm:text-lg">
                Pick your exam, start a published mock, and keep every attempt and solution review in one focused preparation workspace.
              </p>

              <div className="mt-7 flex max-w-2xl flex-col gap-3 sm:flex-row">
                <label htmlFor="home-exam-select" className="sr-only">Select your exam</label>
                <select
                  id="home-exam-select"
                  value={selectedGroupId}
                  onChange={(event) => setSelectedGroupId(event.target.value)}
                  className="min-h-[50px] flex-1 rounded-xl border border-white/25 bg-white px-4 text-sm font-semibold text-slate-900 shadow-sm outline-none focus:ring-2 focus:ring-white/70"
                >
                  <option value="">Choose your exam</option>
                  {examGroups.map((group) => (
                    <option key={group.id} value={group.id}>{group.name}</option>
                  ))}
                </select>
                <Button
                  className="min-h-[50px] rounded-xl bg-white px-6 font-bold text-blue-700 hover:bg-blue-50"
                  onClick={() => setLocation(selectedGroup ? `/category/${selectedGroup.id}` : "/tests")}
                >
                  Explore tests
                  <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Button>
              </div>
            </div>

            <div className="rounded-2xl border border-white/20 bg-white/95 p-5 text-slate-950 shadow-2xl shadow-blue-950/20 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.12em] text-blue-600">Free mock ready</p>
                  <h2 className="mt-1 text-lg font-black text-slate-950">Start directly from the live catalog</h2>
                </div>
                <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-xs font-black text-emerald-700">FREE</span>
              </div>

              {heroTest ? (
                <div className="mt-5">
                  <p className="text-xs font-bold uppercase tracking-[0.1em] text-blue-600">{heroTest.category}</p>
                  <h3 className="mt-2 text-xl font-black leading-snug text-slate-950">{heroTest.name}</h3>
                  <div className="mt-4"><TestMeta test={heroTest} /></div>
                  <Button className="mt-5 min-h-11 w-full rounded-xl bg-blue-600 font-bold text-white hover:bg-blue-700" onClick={() => setLocation(`/test/${heroTest.id}`)}>
                    <PlayCircle className="mr-2 h-4 w-4" aria-hidden="true" />
                    Start free test
                  </Button>
                </div>
              ) : (
                <p className="mt-5 rounded-xl bg-slate-50 p-4 text-sm text-slate-600">No published mock is available right now.</p>
              )}
            </div>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3" aria-label="Live ExamTree catalog summary">
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-700"><BookOpen className="h-5 w-5" aria-hidden="true" /></span>
              <div>
                <p className="text-2xl font-black tracking-tight text-foreground">{formatCount(tests.length)}</p>
                <p className="text-sm font-semibold text-muted-foreground">Published tests</p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">Published tests: {formatCount(tests.length)}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-700"><LayoutGrid className="h-5 w-5" aria-hidden="true" /></span>
              <div>
                <p className="text-2xl font-black tracking-tight text-foreground">{formatCount(catalogQuestionCount)}</p>
                <p className="text-sm font-semibold text-muted-foreground">Live questions</p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">Questions in live catalog: {formatCount(catalogQuestionCount)}</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
            <div className="flex items-center gap-4">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><Target className="h-5 w-5" aria-hidden="true" /></span>
              <div>
                <p className="text-2xl font-black tracking-tight text-foreground">{formatCount(examGroups.length)}</p>
                <p className="text-sm font-semibold text-muted-foreground">Exam families</p>
              </div>
            </div>
            <p className="mt-3 text-xs leading-5 text-muted-foreground">Choose a family to narrow the catalog quickly.</p>
          </div>
        </section>

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6" aria-labelledby="popular-exams-heading">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 id="popular-exams-heading" className="text-lg font-black text-foreground">Exam categories</h2>
              <p className="mt-1 text-sm text-muted-foreground">Jump straight into the exam family you are preparing for.</p>
            </div>
            <Button variant="ghost" className="min-h-11 shrink-0 rounded-xl" onClick={() => setLocation("/tests")}>
              View all <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </div>

          <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {examGroups.slice(0, 6).map((group, index) => {
              const tone = GROUP_TONES[index % GROUP_TONES.length];
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setLocation(`/category/${group.id}`)}
                  className={`et-interactive group min-h-[118px] rounded-2xl border p-4 text-left transition hover:-translate-y-0.5 hover:shadow-md ${tone.card}`}
                >
                  <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${tone.icon}`}>
                    <CategoryIcon icon={group.icon} className="h-5 w-5" />
                  </span>
                  <h3 className="mt-3 line-clamp-1 text-sm font-black text-foreground">{group.name}</h3>
                  <p className="mt-1 text-xs text-muted-foreground">{formatCount(group.tests.length)} tests</p>
                </button>
              );
            })}
          </div>
        </section>

        {(latestAttempt || activeSessionEntries.length > 0) ? (
          <section className="rounded-2xl border border-blue-200 bg-blue-50/80 p-5 shadow-sm sm:p-6" aria-labelledby="continue-heading">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white"><RotateCcw className="h-5 w-5" aria-hidden="true" /></span>
                <div>
                  <h2 id="continue-heading" className="text-lg font-black text-slate-950">Continue your preparation</h2>
                  <p className="mt-1 text-sm text-slate-600">Your saved attempt state is ready whenever you are.</p>
                </div>
              </div>
              <div className="flex flex-col gap-2 sm:flex-row">
                {activeSessionEntries[0] ? (
                  <Button variant="outline" className="min-h-11 rounded-xl bg-white" onClick={() => setLocation(`/test/${activeSessionEntries[0]!.testId}`)}>
                    Resume test
                  </Button>
                ) : null}
                {latestAttempt ? (
                  <Button
                    className="min-h-11 rounded-xl bg-blue-600 text-white hover:bg-blue-700"
                    onClick={() => setLocation(`/result?attemptId=${encodeURIComponent(latestAttempt.id)}&testId=${encodeURIComponent(latestAttempt.testId)}&tab=review`)}
                  >
                    <BarChart3 className="mr-2 h-4 w-4" aria-hidden="true" />
                    Review last result
                  </Button>
                ) : null}
              </div>
            </div>
          </section>
        ) : heroTest ? (
          <section className="rounded-2xl border border-blue-200 bg-blue-50/80 p-5 shadow-sm sm:p-6" aria-labelledby="quick-practice-heading">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-blue-600 text-white"><Target className="h-5 w-5" aria-hidden="true" /></span>
                <div>
                  <h2 id="quick-practice-heading" className="text-lg font-black text-slate-950">Quick practice</h2>
                  <p className="mt-1 text-sm text-slate-600">Start with {heroTest.name} and build from there.</p>
                </div>
              </div>
              <Button className="min-h-11 rounded-xl bg-blue-600 px-5 text-white hover:bg-blue-700" onClick={() => setLocation(`/test/${heroTest.id}`)}>
                Start now <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </section>
        ) : null}

        <section className="rounded-2xl border border-border bg-card p-5 shadow-sm sm:p-6" aria-labelledby="free-mocks-heading">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 id="free-mocks-heading" className="text-xl font-black text-foreground">Live & free mocks</h2>
              <p className="mt-1 text-sm text-muted-foreground">Published tests you can enter right now.</p>
            </div>
            <Button variant="outline" className="min-h-11 w-fit rounded-xl" onClick={() => setLocation("/tests")}>Browse Live Tests</Button>
          </div>

          {featuredFreeTests.length > 0 ? (
            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              {featuredFreeTests.map((test) => (
                <article key={test.id} className="flex flex-col rounded-2xl border border-border bg-background p-5 transition hover:border-blue-200 hover:shadow-md">
                  <div className="flex items-start justify-between gap-3">
                    <span className="rounded-lg bg-emerald-100 px-2.5 py-1 text-[11px] font-black text-emerald-700">AVAILABLE</span>
                    <span className="text-xs font-semibold text-muted-foreground">{test.category}</span>
                  </div>
                  <h3 className="mt-4 line-clamp-2 min-h-[48px] text-base font-black leading-snug text-foreground">{test.name}</h3>
                  <div className="mt-4"><TestMeta test={test} /></div>
                  <Button className="mt-5 min-h-11 w-full rounded-xl bg-blue-600 text-white hover:bg-blue-700" onClick={() => setLocation(`/test/${test.id}`)}>
                    Attempt test <ChevronRight className="ml-1 h-4 w-4" aria-hidden="true" />
                  </Button>
                </article>
              ))}
            </div>
          ) : (
            <div className="mt-5 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">No free mock is published right now.</div>
          )}
        </section>
      </div>
    </div>
  );
}
