import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  ChevronRight,
  Clock3,
  LayoutGrid,
  PlayCircle,
  RotateCcw,
  Search,
  Sparkles,
} from "lucide-react";

import { CategoryIcon } from "@/components/CategoryIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

function TestMeta({ test }: { test: Test }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-slate-500">
      <span className="inline-flex items-center gap-1.5">
        <LayoutGrid className="h-4 w-4" aria-hidden="true" />
        {test.totalQuestions} questions
      </span>
      <span className="inline-flex items-center gap-1.5">
        <Clock3 className="h-4 w-4" aria-hidden="true" />
        {test.duration} min
      </span>
    </div>
  );
}

export default function Home() {
  const [, setLocation] = useLocation();
  const attempts = getAttempts();
  const activeSessions = getActiveTestSessions();
  const { tests, categories, subcategories, isLoading } = useExamCatalog();
  const [query, setQuery] = useState("");
  const [activeGroupId, setActiveGroupId] = useState<string | null>(null);

  const latestAttempt = attempts[0] ?? null;
  const activeSessionEntries = Object.values(activeSessions).slice(0, 2);
  const examGroups = useMemo(
    () => buildExamGroups(categories, subcategories, tests),
    [categories, subcategories, tests],
  );

  const filteredGroups = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return examGroups;
    return examGroups.filter((group) => {
      if (group.name.toLowerCase().includes(normalized)) return true;
      if (group.subExams.some((subExam) => subExam.name.toLowerCase().includes(normalized))) return true;
      return group.tests.some((test) =>
        test.name.toLowerCase().includes(normalized) ||
        test.category.toLowerCase().includes(normalized) ||
        (test.subcategoryName ?? "").toLowerCase().includes(normalized),
      );
    });
  }, [examGroups, query]);

  const activeGroup = examGroups.find((group) => group.id === activeGroupId) ?? examGroups[0] ?? null;
  const freeTests = useMemo(
    () => tests.filter((test) => (test.access ?? "free") === "free"),
    [tests],
  );
  const heroTest = freeTests[0] ?? tests[0] ?? null;
  const activeGroupFreeTests = activeGroup?.tests.filter((test) => (test.access ?? "free") === "free").slice(0, 4) ?? [];
  const catalogQuestionCount = tests.reduce((sum, test) => sum + Math.max(0, test.totalQuestions), 0);

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8" role="status" aria-label="Loading ExamTree home">
        <div className="skeleton-shimmer h-[520px] rounded-[2rem]" />
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
    <div className="mx-auto w-full max-w-7xl px-4 pb-14 pt-6 sm:px-6 lg:px-8 lg:pt-10">
      <section className="relative overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-[0_24px_70px_-50px_rgba(15,23,42,0.45)]">
        <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-indigo-600 via-violet-500 to-teal-500" />
        <div className="grid min-h-[560px] lg:grid-cols-[1.08fr_0.92fr]">
          <div className="flex flex-col justify-center px-6 py-12 sm:px-10 lg:px-14 lg:py-16">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-indigo-700">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Serious practice. No clutter.
            </div>

            <h1 className="mt-6 max-w-3xl text-4xl font-black tracking-[-0.04em] text-slate-950 sm:text-5xl lg:text-[64px] lg:leading-[1.02]">
              Practice the exam you actually want to crack.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Find your exam, take a real mock, and review every saved attempt from one focused workspace.
            </p>

            <div className="mt-8 max-w-2xl">
              <label htmlFor="home-exam-search" className="sr-only">Search exams and mock tests</label>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                <Input
                  id="home-exam-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search SSC CGL, Banking, Punjab exams…"
                  className="h-14 rounded-2xl border-slate-300 bg-white pl-12 pr-4 text-base shadow-sm focus-visible:ring-indigo-500"
                />
              </div>

              {query.trim() && (
                <div className="mt-2 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
                  {filteredGroups.slice(0, 5).map((group) => (
                    <button
                      key={group.id}
                      type="button"
                      onClick={() => setLocation(`/category/${group.id}`)}
                      className="et-interactive flex min-h-12 w-full items-center justify-between border-b border-slate-100 px-4 py-3 text-left last:border-b-0 hover:bg-slate-50"
                    >
                      <span>
                        <span className="block font-semibold text-slate-900">{group.name}</span>
                        <span className="mt-0.5 block text-xs text-slate-500">{group.tests.length} published tests</span>
                      </span>
                      <ChevronRight className="h-4 w-4 text-slate-400" aria-hidden="true" />
                    </button>
                  ))}
                  {filteredGroups.length === 0 && (
                    <div className="px-4 py-4 text-sm text-slate-500">No matching exam family in the live catalog.</div>
                  )}
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Button className="h-12 rounded-xl bg-indigo-700 px-6 text-base font-bold text-white hover:bg-indigo-800" onClick={() => setLocation("/tests")}>
                Browse Live Tests
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
              <span className="text-sm text-slate-500">Start with any published free mock.</span>
            </div>

            {examGroups.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2">
                {examGroups.slice(0, 5).map((group) => (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => setLocation(`/category/${group.id}`)}
                    className="et-interactive min-h-11 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-800"
                  >
                    {group.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="relative flex items-center bg-slate-950 px-6 py-10 text-white sm:px-10 lg:px-12">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_20%,rgba(99,102,241,0.32),transparent_28%),radial-gradient(circle_at_20%_85%,rgba(20,184,166,0.20),transparent_30%)]" />
            <div className="relative w-full">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-indigo-200">Free mock ready</p>
              {heroTest ? (
                <div className="mt-4 rounded-[1.75rem] border border-white/15 bg-white/[0.08] p-6 shadow-2xl backdrop-blur-sm sm:p-7">
                  <div className="flex items-start justify-between gap-4">
                    <span className="rounded-full border border-emerald-300/30 bg-emerald-400/15 px-3 py-1 text-xs font-bold text-emerald-200">FREE</span>
                    <span className="text-xs font-medium text-slate-400">Published test</span>
                  </div>
                  <p className="mt-5 text-sm font-semibold text-indigo-200">{heroTest.category}</p>
                  <h2 className="mt-2 text-2xl font-bold tracking-tight text-white sm:text-3xl">{heroTest.name}</h2>
                  <div className="mt-5 text-slate-300">
                    <TestMeta test={heroTest} />
                  </div>

                  <div className="my-6 h-px bg-white/10" />
                  <div className="space-y-3 text-sm text-slate-300">
                    <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" aria-hidden="true" />Real published questions</p>
                    <p className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-300" aria-hidden="true" />Saved attempt and result review</p>
                  </div>

                  <Button className="mt-7 h-12 w-full rounded-xl bg-white text-base font-bold text-slate-950 hover:bg-slate-100" onClick={() => setLocation(`/test/${heroTest.id}`)}>
                    Start free mock
                    <PlayCircle className="ml-2 h-5 w-5" aria-hidden="true" />
                  </Button>
                </div>
              ) : (
                <div className="mt-4 rounded-[1.75rem] border border-white/15 bg-white/[0.08] p-7 text-slate-300">
                  No published mock is available right now. Browse the catalog for current exam pathways.
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {(latestAttempt || activeSessionEntries.length > 0) && (
        <section className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 sm:px-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-500">Continue where you left off</p>
              <h2 className="mt-1 text-xl font-bold text-slate-950">Your practice is ready to resume.</h2>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row">
              {activeSessionEntries[0] && (
                <Button variant="outline" className="h-11 rounded-xl border-slate-300 bg-white" onClick={() => setLocation(`/test/${activeSessionEntries[0]!.testId}`)}>
                  <RotateCcw className="mr-2 h-4 w-4" aria-hidden="true" />
                  Resume {activeSessionEntries[0]!.testName}
                </Button>
              )}
              {latestAttempt && (
                <Button variant="outline" className="h-11 rounded-xl border-slate-300 bg-white" onClick={() => setLocation(`/result?attemptId=${encodeURIComponent(latestAttempt.id)}&testId=${encodeURIComponent(latestAttempt.testId)}&tab=review`)}>
                  <BarChart3 className="mr-2 h-4 w-4" aria-hidden="true" />
                  Review last result
                </Button>
              )}
            </div>
          </div>
        </section>
      )}

      <section className="mt-14" aria-labelledby="exam-families-heading">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-700">Choose your exam</p>
            <h2 id="exam-families-heading" className="mt-2 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">One clear path into every exam family.</h2>
          </div>
          <Button variant="ghost" className="h-11 w-fit rounded-xl text-indigo-700" onClick={() => setLocation("/tests")}>
            View all exams <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {(query ? filteredGroups : examGroups).slice(0, 6).map((group) => {
            const active = activeGroup?.id === group.id;
            return (
              <button
                key={group.id}
                type="button"
                onMouseEnter={() => setActiveGroupId(group.id)}
                onFocus={() => setActiveGroupId(group.id)}
                onClick={() => setLocation(`/category/${group.id}`)}
                className={`et-interactive group min-h-[150px] rounded-2xl border p-5 text-left shadow-sm transition ${active ? "border-indigo-300 bg-indigo-50/70" : "border-slate-200 bg-white hover:border-indigo-200 hover:shadow-md"}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white">
                    <CategoryIcon icon={group.icon} className="h-5 w-5" />
                  </span>
                  <ChevronRight className="h-5 w-5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-500" aria-hidden="true" />
                </div>
                <h3 className="mt-4 text-lg font-bold text-slate-950">{group.name}</h3>
                <p className="mt-1 text-sm text-slate-500">{formatCount(group.tests.length)} tests · {formatCount(group.subExams.length)} exam paths</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="mt-14 rounded-[2rem] bg-slate-950 px-5 py-7 text-white sm:px-7 sm:py-8 lg:px-9" aria-labelledby="free-mocks-heading">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-200">Start without paying</p>
            <h2 id="free-mocks-heading" className="mt-2 text-3xl font-black tracking-tight">Free mocks for {activeGroup?.name ?? "your exam"}.</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {examGroups.slice(0, 4).map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => setActiveGroupId(group.id)}
                className={`et-interactive min-h-10 rounded-full border px-3 py-2 text-sm font-semibold ${activeGroup?.id === group.id ? "border-white bg-white text-slate-950" : "border-white/15 bg-white/[0.05] text-slate-300 hover:bg-white/[0.1]"}`}
              >
                {group.name}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {activeGroupFreeTests.map((test) => (
            <button
              key={test.id}
              type="button"
              onClick={() => setLocation(`/test/${test.id}`)}
              className="et-interactive group rounded-2xl border border-white/10 bg-white/[0.06] p-5 text-left hover:bg-white/[0.1]"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.14em] text-emerald-300">Free mock</p>
                  <h3 className="mt-2 text-lg font-bold text-white">{test.name}</h3>
                </div>
                <PlayCircle className="h-5 w-5 shrink-0 text-indigo-300 transition group-hover:scale-110" aria-hidden="true" />
              </div>
              <div className="mt-4 text-slate-300"><TestMeta test={test} /></div>
            </button>
          ))}
          {activeGroupFreeTests.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/15 p-7 text-sm text-slate-300 lg:col-span-2">
              No free mock is published in this exam family yet. Open the category to see its current catalog.
            </div>
          )}
        </div>
      </section>

      <section className="mt-10 grid gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-sm sm:grid-cols-3 sm:p-6" aria-label="Live catalog summary">
        <div>
          <p className="font-bold text-slate-950">Published tests: {formatCount(tests.length)}</p>
          <p className="mt-1 text-slate-500">Only tests currently available in the student catalog.</p>
        </div>
        <div>
          <p className="font-bold text-slate-950">Questions in live catalog: {formatCount(catalogQuestionCount)}</p>
          <p className="mt-1 text-slate-500">Calculated from the published test inventory.</p>
        </div>
        <div>
          <p className="font-bold text-slate-950">{formatCount(freeTests.length)} free mocks</p>
          <p className="mt-1 text-slate-500">Start practicing before choosing anything paid.</p>
        </div>
      </section>
    </div>
  );
}
