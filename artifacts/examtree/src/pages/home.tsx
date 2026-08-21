import { useMemo, useState, type ReactNode } from "react";
import { useLocation } from "wouter";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  ClipboardList,
  Languages,
  Landmark,
  LineChart,
  Search,
  ShieldCheck,
  Target,
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
  tone: "ssc" | "banking" | "state" | "default";
  tests: Test[];
  subExams: { id: string; name: string }[];
};

const toneClasses = {
  ssc: {
    icon: "bg-orange-50 text-orange-700 ring-orange-100",
    dot: "bg-orange-500",
  },
  banking: {
    icon: "bg-indigo-50 text-indigo-700 ring-indigo-100",
    dot: "bg-indigo-600",
  },
  state: {
    icon: "bg-teal-50 text-teal-700 ring-teal-100",
    dot: "bg-teal-500",
  },
  default: {
    icon: "bg-slate-100 text-slate-700 ring-slate-200",
    dot: "bg-slate-400",
  },
};

function getTone(name: string): ExamGroup["tone"] {
  const normalized = name.toLowerCase();
  if (normalized.includes("ssc")) return "ssc";
  if (normalized.includes("bank") || normalized.includes("ibps") || normalized.includes("sbi")) return "banking";
  if (normalized.includes("punjab") || normalized.includes("state") || normalized.includes("psssb")) return "state";
  return "default";
}

function buildExamGroups(categories: Category[], subcategories: Subcategory[], tests: Test[]): ExamGroup[] {
  return buildExamTreeNodes(categories, subcategories, tests).map((category) => ({
    id: category.id,
    name: category.name,
    description: category.description,
    icon: category.icon || "Landmark",
    tone: getTone(category.name),
    tests: category.tests,
    subExams: category.subcategories.map((subExam) => ({ id: subExam.id, name: subExam.name })),
  }));
}

function formatCount(value: number) {
  return new Intl.NumberFormat("en-IN").format(Math.max(0, value));
}

function ExamTypeIcon({ tone }: { tone: ExamGroup["tone"] }) {
  if (tone === "banking") return <LineChart className="h-5 w-5" aria-hidden="true" />;
  if (tone === "state") return <Landmark className="h-5 w-5" aria-hidden="true" />;
  if (tone === "ssc") return <ShieldCheck className="h-5 w-5" aria-hidden="true" />;
  return <ClipboardList className="h-5 w-5" aria-hidden="true" />;
}

function SectionHeading({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">{title}</h2>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600 sm:text-base">{description}</p> : null}
      </div>
      {action}
    </div>
  );
}

function ExamFamilyTile({ group, onOpen }: { group: ExamGroup; onOpen: () => void }) {
  const tone = toneClasses[group.tone];
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex min-h-[152px] w-full flex-col justify-between rounded-xl border border-slate-200 bg-white p-4 text-left transition duration-200 hover:border-slate-300 hover:shadow-[0_10px_26px_rgba(15,23,42,0.06)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
    >
      <div className="flex items-start justify-between gap-4">
        <span className={`flex h-10 w-10 items-center justify-center rounded-xl ring-1 ${tone.icon}`}>
          <CategoryIcon icon={group.icon} className="h-5 w-5" />
        </span>
        <ArrowRight className="h-4 w-4 text-slate-300 transition duration-200 group-hover:translate-x-0.5 group-hover:text-indigo-700" aria-hidden="true" />
      </div>
      <div className="mt-5">
        <div className="flex items-center gap-2">
          <span className={`h-1.5 w-1.5 rounded-full ${tone.dot}`} aria-hidden="true" />
          <h3 className="font-semibold text-slate-950">{group.name}</h3>
        </div>
        <p className="mt-1 line-clamp-1 text-xs text-slate-500">
          {formatCount(group.tests.length)} {group.tests.length === 1 ? "published test" : "published tests"}
          {group.subExams.length > 0 ? ` · ${formatCount(group.subExams.length)} exam branches` : ""}
        </p>
      </div>
    </button>
  );
}

function FreeMockRow({ test, onOpen }: { test: Test; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group grid w-full gap-3 border-b border-slate-100 px-0 py-5 text-left transition last:border-b-0 sm:grid-cols-[1fr_auto] sm:items-center"
    >
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <h3 className="font-semibold text-slate-950">{test.name}</h3>
          <span className="rounded-md bg-emerald-50 px-2 py-1 text-[11px] font-semibold text-emerald-700">Free</span>
        </div>
        <p className="mt-1 text-xs text-slate-500">{test.categoryName ?? test.category} · {test.subcategoryName ?? "General"}</p>
        <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-slate-600">
          <span className="inline-flex items-center gap-1.5"><ClipboardList className="h-3.5 w-3.5" aria-hidden="true" />{test.totalQuestions} questions</span>
          <span className="inline-flex items-center gap-1.5"><Clock3 className="h-3.5 w-3.5" aria-hidden="true" />{test.duration} min</span>
          <span>{test.difficulty}</span>
          <span>{(test.languages ?? ["en"]).map((language) => language.toUpperCase()).join(" · ")}</span>
        </div>
      </div>
      <span className="inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-indigo-800">
        Start test
        <ArrowRight className="h-4 w-4 transition duration-200 group-hover:translate-x-0.5" aria-hidden="true" />
      </span>
    </button>
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
  const examGroups = useMemo(() => buildExamGroups(categories, subcategories, tests), [categories, subcategories, tests]);
  const activeGroup = examGroups.find((group) => group.id === activeGroupId) ?? examGroups[0] ?? null;
  const heroTest = tests.find((test) => (test.access ?? "free") === "free") ?? tests[0] ?? null;

  const filteredGroups = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return examGroups;
    return examGroups.filter((group) =>
      [group.name, group.description, ...group.subExams.map((subExam) => subExam.name)]
        .join(" ")
        .toLowerCase()
        .includes(normalized),
    );
  }, [examGroups, query]);

  const featuredGroups = (query ? filteredGroups : examGroups).slice(0, 8);
  const activeGroupTests = activeGroup?.tests.filter((test) => (test.access ?? "free") === "free").slice(0, 4) ?? [];
  const catalogQuestionCount = tests.reduce((sum, test) => sum + Math.max(0, test.totalQuestions), 0);
  const hasStudentHistory = Boolean(latestAttempt || activeSessionEntries.length > 0);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center">
          <div className="space-y-4">
            <div className="skeleton-shimmer h-7 w-40 rounded-lg" />
            <div className="skeleton-shimmer h-16 rounded-xl" />
            <div className="skeleton-shimmer h-12 max-w-2xl rounded-xl" />
          </div>
          <div className="skeleton-shimmer h-[360px] rounded-2xl" />
        </div>
        <div className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => <div key={index} className="skeleton-shimmer h-40 rounded-xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden bg-slate-50">
      <section className="border-b border-slate-200/80 bg-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[1.02fr_0.98fr] lg:items-center lg:px-8 lg:py-20">
          <div>
            <div className="inline-flex items-center gap-2 rounded-lg bg-indigo-50 px-3 py-1.5 text-sm font-semibold text-indigo-800">
              <span className="h-2 w-2 rounded-full bg-teal-500" aria-hidden="true" />
              Exam-first mock test preparation
            </div>
            <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-[3.6rem]">
              Prepare with tests that feel like the exam.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
              Find the right exam, attempt published mocks, continue saved sessions, and review solutions from one focused preparation workspace.
            </p>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button className="h-11 rounded-lg bg-indigo-700 px-5 text-white hover:bg-indigo-800" onClick={() => setLocation("/mock-tests")}>
                Explore mock tests
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
              <Button variant="outline" className="h-11 rounded-lg border-slate-300 bg-white px-5 text-slate-800" onClick={() => setLocation("/exams")}>
                Browse exams
              </Button>
            </div>

            <dl className="mt-9 grid max-w-xl grid-cols-3 gap-5 border-t border-slate-200 pt-5">
              <div>
                <dt className="text-xs font-medium text-slate-500">Published tests</dt>
                <dd className="mt-1 text-xl font-semibold tabular-nums text-slate-950">{formatCount(tests.length)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Questions</dt>
                <dd className="mt-1 text-xl font-semibold tabular-nums text-slate-950">{formatCount(catalogQuestionCount)}</dd>
              </div>
              <div>
                <dt className="text-xs font-medium text-slate-500">Exam families</dt>
                <dd className="mt-1 text-xl font-semibold tabular-nums text-slate-950">{formatCount(examGroups.length)}</dd>
              </div>
            </dl>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:mx-0 lg:ml-auto">
            <div className="absolute -left-8 top-12 h-40 w-40 rounded-full bg-teal-100/70 blur-3xl" aria-hidden="true" />
            <div className="absolute -right-8 bottom-8 h-44 w-44 rounded-full bg-indigo-100/80 blur-3xl" aria-hidden="true" />
            <div className="relative overflow-hidden rounded-2xl bg-[#1e1b4b] p-5 shadow-[0_20px_50px_rgba(30,27,75,0.16)] sm:p-6">
              <div className="flex items-center justify-between gap-4 text-indigo-100">
                <div>
                  <p className="text-xs font-medium">Live catalog preview</p>
                  <p className="mt-1 text-lg font-semibold text-white">A real Examtree mock</p>
                </div>
                <span className="rounded-md bg-white/10 px-2.5 py-1 text-xs font-semibold">Published</span>
              </div>

              <div className="mt-5 rounded-xl bg-white p-5 text-slate-950">
                {heroTest ? (
                  <>
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs font-medium text-slate-500">{heroTest.categoryName ?? heroTest.category} · {heroTest.subcategoryName ?? "General"}</p>
                        <h2 className="mt-2 text-xl font-semibold tracking-tight">{heroTest.name}</h2>
                      </div>
                      <span className="rounded-md bg-emerald-50 px-2 py-1 text-xs font-semibold text-emerald-700">
                        {(heroTest.access ?? "free") === "free" ? "Free" : "Premium"}
                      </span>
                    </div>
                    <div className="mt-5 grid grid-cols-3 divide-x divide-slate-200 border-y border-slate-200 py-4 text-center">
                      <div className="px-2"><p className="text-lg font-semibold">{heroTest.totalQuestions}</p><p className="mt-1 text-[11px] text-slate-500">Questions</p></div>
                      <div className="px-2"><p className="text-lg font-semibold">{heroTest.duration}</p><p className="mt-1 text-[11px] text-slate-500">Minutes</p></div>
                      <div className="px-2"><p className="text-lg font-semibold">{heroTest.difficulty}</p><p className="mt-1 text-[11px] text-slate-500">Level</p></div>
                    </div>
                    <div className="mt-4 flex items-center justify-between gap-4">
                      <div className="inline-flex items-center gap-2 text-xs font-medium text-slate-600">
                        <Languages className="h-4 w-4 text-teal-700" aria-hidden="true" />
                        {(heroTest.languages ?? ["en"]).map((language) => language.toUpperCase()).join(" · ")}
                      </div>
                      <button type="button" onClick={() => setLocation(`/test/${heroTest.id}`)} className="inline-flex min-h-10 items-center gap-2 rounded-lg bg-indigo-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-800">
                        Open test <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="py-8 text-center">
                    <BookOpenCheck className="mx-auto h-8 w-8 text-teal-700" aria-hidden="true" />
                    <p className="mt-3 font-semibold">Published tests will appear here.</p>
                    <p className="mt-1 text-sm text-slate-500">The preview uses the live student catalog.</p>
                  </div>
                )}
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-indigo-100">
                <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-teal-300" aria-hidden="true" />Saved attempt recovery</div>
                <div className="flex items-center gap-2"><BarChart3 className="h-4 w-4 text-teal-300" aria-hidden="true" />Solution review</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <SectionHeading
          title="What are you preparing for?"
          description="Start with the exam family, then narrow into the published mocks and test series that matter to you."
          action={<Button variant="ghost" className="justify-start px-0 text-indigo-800 hover:bg-transparent hover:text-indigo-950" onClick={() => setLocation("/exams")}>View all exams <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Button>}
        />

        <div className="relative mt-6 max-w-2xl">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search SSC, banking, Punjab exams..."
            className="h-12 rounded-xl border-slate-300 bg-white pl-11 shadow-none focus-visible:ring-indigo-500"
          />
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {featuredGroups.map((group) => (
            <ExamFamilyTile key={group.id} group={group} onOpen={() => setLocation(`/category/${group.id}`)} />
          ))}
        </div>

        {featuredGroups.length === 0 ? (
          <div className="mt-6 rounded-xl border border-dashed border-slate-300 bg-white px-5 py-10 text-center">
            <p className="font-semibold text-slate-950">No exam families match that search.</p>
            <button type="button" className="mt-2 text-sm font-semibold text-indigo-800" onClick={() => setQuery("")}>Clear search</button>
          </div>
        ) : null}
      </section>

      {hasStudentHistory ? (
        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
            <SectionHeading title="Continue where you left off" description="Your recent attempt and active sessions stay close to the top of the experience." />
            <div className="mt-6 grid gap-4 lg:grid-cols-3">
              {latestAttempt ? (
                <button
                  type="button"
                  onClick={() => setLocation(`/result?attemptId=${encodeURIComponent(latestAttempt.id)}&testId=${encodeURIComponent(latestAttempt.testId)}&tab=review`)}
                  className="group rounded-xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-indigo-300 hover:bg-white"
                >
                  <div className="flex items-center justify-between gap-3"><span className="text-sm font-semibold text-indigo-800">Recent result</span><BarChart3 className="h-4 w-4 text-indigo-700" aria-hidden="true" /></div>
                  <p className="mt-4 font-semibold text-slate-950">{latestAttempt.testName}</p>
                  <p className="mt-1 text-sm text-slate-500">Last score: {latestAttempt.score}%</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-800">Review result <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" /></span>
                </button>
              ) : null}
              {activeSessionEntries.map((session) => (
                <button key={session.testId} type="button" onClick={() => setLocation(`/test/${session.testId}`)} className="group rounded-xl border border-slate-200 bg-slate-50 p-5 text-left transition hover:border-teal-300 hover:bg-white">
                  <div className="flex items-center justify-between gap-3"><span className="text-sm font-semibold text-teal-700">In progress</span><Clock3 className="h-4 w-4 text-teal-700" aria-hidden="true" /></div>
                  <p className="mt-4 font-semibold text-slate-950">{session.testName}</p>
                  <p className="mt-1 text-sm text-slate-500">Resume your saved attempt.</p>
                  <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-800">Resume test <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" aria-hidden="true" /></span>
                </button>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
        <SectionHeading
          title="Start with a free mock"
          description="Choose an exam family and jump into a published free test without wading through promotional cards."
          action={activeGroup ? <Button variant="ghost" className="justify-start px-0 text-indigo-800 hover:bg-transparent" onClick={() => setLocation(`/category/${activeGroup.id}`)}>Open {activeGroup.name} <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Button> : undefined}
        />

        {examGroups.length > 1 ? (
          <div className="mt-5 flex gap-2 overflow-x-auto pb-2" aria-label="Choose exam family">
            {examGroups.slice(0, 8).map((group) => {
              const active = activeGroup?.id === group.id;
              return (
                <button key={group.id} type="button" onClick={() => setActiveGroupId(group.id)} className={`inline-flex min-h-10 shrink-0 items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold transition ${active ? "border-indigo-700 bg-indigo-700 text-white" : "border-slate-200 bg-white text-slate-700 hover:border-slate-300"}`}>
                  <ExamTypeIcon tone={group.tone} />
                  {group.name}
                </button>
              );
            })}
          </div>
        ) : null}

        <div className="mt-5 border-y border-slate-200 bg-white px-4 sm:px-5">
          {activeGroupTests.map((test) => <FreeMockRow key={test.id} test={test} onOpen={() => setLocation(`/test/${test.id}`)} />)}
          {activeGroupTests.length === 0 ? (
            <div className="py-10 text-center">
              <BookOpenCheck className="mx-auto h-8 w-8 text-teal-700" aria-hidden="true" />
              <p className="mt-3 font-semibold text-slate-950">No free mock is published in this exam family yet.</p>
              <p className="mt-1 text-sm text-slate-500">Open the category to see the rest of its published inventory.</p>
            </div>
          ) : null}
        </div>
      </section>

      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 sm:py-16 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold text-teal-700">Built for the whole attempt cycle</p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">A test is only useful if the experience stays focused after you click Start.</h2>
              <p className="mt-4 max-w-xl text-base leading-7 text-slate-600">Examtree keeps the core preparation journey visible: find a published test, attempt it, recover an interrupted session, submit, and review the evaluated result.</p>
            </div>
            <div className="grid gap-0 border-y border-slate-200 sm:grid-cols-2 sm:rounded-xl sm:border">
              {[
                { icon: ClipboardList, title: "Published catalog", copy: "Browse the live exam and test inventory available to students." },
                { icon: Clock3, title: "Saved attempts", copy: "Resume an in-progress test after refresh without losing the attempt." },
                { icon: Languages, title: "Multilingual delivery", copy: "Use approved languages when they are configured for a published test." },
                { icon: Target, title: "Solution review", copy: "Reopen evaluated attempts and review the saved result." },
              ].map((item, index) => (
                <div key={item.title} className={`p-5 ${index < 2 ? "border-b border-slate-200" : ""} ${index % 2 === 0 ? "sm:border-r sm:border-slate-200" : ""}`}>
                  <item.icon className="h-5 w-5 text-indigo-700" aria-hidden="true" />
                  <h3 className="mt-4 font-semibold text-slate-950">{item.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-600">{item.copy}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
