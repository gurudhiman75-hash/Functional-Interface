import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowLeft,
  BookOpen,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ClipboardList,
  Compass,
  Lock,
  Search,
  Sparkles,
  TrendingUp,
  Unlock,
  Users,
  Zap,
} from "lucide-react";
import type { Category, Subcategory, Test } from "@/lib/data";
import {
  buildExamTreeNodes,
  type ExamTreeCategoryNode as CategoryNode,
} from "@/lib/exam-tree";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

type ExamTreeState = {
  activeCategory: string | null;
  activeSubCategory: string | null;
};

interface ExamNavigatorProps {
  categories: Category[];
  subcategories: Subcategory[];
  tests: Test[];
}

function getReasoningLevel(test: Test) {
  const difficulty = String(test.difficulty ?? "").toLowerCase();
  if (difficulty.includes("hard")) return 5;
  if (difficulty.includes("medium")) return 3;
  return 2;
}

function getStatus(test: Test) {
  if ((test.access ?? "free") !== "free") {
    return {
      label: "Premium",
      border: "border-l-amber-500",
      chip: "border-amber-200 bg-amber-50 text-amber-700",
      glow: "shadow-[0_0_0_1px_rgba(245,158,11,0.10),0_12px_32px_rgba(245,158,11,0.10)]",
    };
  }
  if ((test.attempts ?? 0) > 500) {
    return {
      label: "Attempted",
      border: "border-l-emerald-500",
      chip: "border-emerald-200 bg-emerald-50 text-emerald-700",
      glow: "shadow-[0_0_0_1px_rgba(16,185,129,0.10),0_12px_32px_rgba(16,185,129,0.10)]",
    };
  }
  return {
    label: "New",
    border: "border-l-blue-500",
    chip: "border-blue-200 bg-blue-50 text-blue-700",
    glow: "shadow-[0_0_0_1px_rgba(59,130,246,0.10),0_12px_32px_rgba(59,130,246,0.10)]",
  };
}

function buildNodes(categories: Category[], subcategories: Subcategory[], tests: Test[]): CategoryNode[] {
  return buildExamTreeNodes(
    categories,
    subcategories,
    tests,
  );
}

function SchematicEmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-dashed border-slate-300 bg-white/70 p-10 text-center shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
      <div className="absolute inset-x-8 top-6 h-px bg-gradient-to-r from-transparent via-teal-400/50 to-transparent" />
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-100 bg-indigo-50 text-indigo-700">
        <Compass className="h-7 w-7" />
      </div>
      <h3 className="mt-5 text-lg font-semibold text-slate-950">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-slate-600">{description}</p>
    </div>
  );
}

export function ExamNavigator({ categories, subcategories, tests }: ExamNavigatorProps) {
  const [, setLocation] = useLocation();
  const [query, setQuery] = useState("");
  const [treeState, setTreeState] = useState<ExamTreeState>({
    activeCategory: null,
    activeSubCategory: null,
  });
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);

  const nodes = useMemo(() => buildNodes(categories, subcategories, tests), [categories, subcategories, tests]);
  const activeCategory = nodes.find((node) => node.id === treeState.activeCategory) ?? null;
  const activeSubcategory =
    activeCategory?.subcategories.find((node) => node.id === treeState.activeSubCategory) ?? null;

  const normalizedQuery = query.trim().toLowerCase();
  const searchedTests = useMemo(() => {
    if (!normalizedQuery) return tests;
    return tests.filter((test) => {
      return (
        test.name.toLowerCase().includes(normalizedQuery) ||
        test.category.toLowerCase().includes(normalizedQuery) ||
        (test.categoryName ?? "").toLowerCase().includes(normalizedQuery) ||
        (test.subcategoryName ?? "").toLowerCase().includes(normalizedQuery)
      );
    });
  }, [normalizedQuery, tests]);

  const displayedNodes = normalizedQuery
    ? buildNodes(categories, subcategories, searchedTests)
    : nodes;

  const selectedTests = activeSubcategory?.tests ?? [];
  const totalQuestions = selectedTests.reduce((sum, test) => sum + (test.totalQuestions ?? 0), 0);
  const pyqCount = selectedTests.filter((test) => test.name.toLowerCase().includes("pyq")).length;
  const avgScore =
    selectedTests.length > 0
      ? Math.round(selectedTests.reduce((sum, test) => sum + (test.avgScore ?? 0), 0) / selectedTests.length)
      : 0;

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white/70 p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(13,148,136,0.16),transparent_34%),radial-gradient(circle_at_top_left,rgba(79,70,229,0.14),transparent_32%)]" />
        <div className="relative flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border border-indigo-100 bg-indigo-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-800">
              <Sparkles className="h-3.5 w-3.5" />
              Tests & Exams
            </div>
            <h1 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 md:text-4xl">
              Drill into the exact exam path.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-slate-600">
              Navigate Category, Subcategory, and Exam as a structured schematic. Start broad, narrow the lane, then open the exam blueprint.
            </p>
          </div>
          <div className="relative w-full lg:w-[420px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for an exam or topic..."
              className="h-11 rounded-xl border-slate-200 bg-white/90 pl-10 shadow-sm focus-visible:ring-indigo-500"
            />
          </div>
        </div>
      </section>

      <div className="flex flex-wrap items-center gap-2 text-sm">
        <button
          type="button"
          onClick={() => setTreeState({ activeCategory: null, activeSubCategory: null })}
          className={`rounded-md px-3 py-1.5 font-medium transition ${
            !treeState.activeCategory ? "bg-indigo-950 text-white" : "bg-white text-slate-600 hover:text-slate-950"
          }`}
        >
          Categories
        </button>
        {activeCategory && (
          <>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <button
              type="button"
              onClick={() => setTreeState({ activeCategory: activeCategory.id, activeSubCategory: null })}
              className={`rounded-md px-3 py-1.5 font-medium transition ${
                !treeState.activeSubCategory ? "bg-indigo-950 text-white" : "bg-white text-slate-600 hover:text-slate-950"
              }`}
            >
              {activeCategory.name}
            </button>
          </>
        )}
        {activeSubcategory && (
          <>
            <ChevronRight className="h-4 w-4 text-slate-400" />
            <span className="rounded-md bg-teal-600 px-3 py-1.5 font-medium text-white">
              {activeSubcategory.name}
            </span>
          </>
        )}
      </div>

      {!treeState.activeCategory && (
        <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {displayedNodes.map((category) => (
            <button
              key={category.id}
              type="button"
              onClick={() => setTreeState({ activeCategory: category.id, activeSubCategory: null })}
              className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-indigo-300 hover:shadow-[0_20px_46px_rgb(30,27,75,0.12)] focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-950 text-white shadow-[0_12px_30px_rgba(30,27,75,0.18)]">
                  <CategoryIcon icon={category.icon} className="h-6 w-6" />
                </div>
                <span className="rounded-md border border-amber-200 bg-amber-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-amber-700">
                  {category.tests.length > 0 ? "Active" : "New"}
                </span>
              </div>
              <h2 className="mt-5 text-xl font-semibold text-slate-950">{category.name}</h2>
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{category.description}</p>
              <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-2">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Exams</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">{category.subcategories.length}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Tests</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">{category.tests.length}</p>
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">PYQs</p>
                  <p className="mt-1 text-sm font-semibold text-teal-700">
                    {category.tests.filter((test) => test.name.toLowerCase().includes("pyq")).length}
                  </p>
                </div>
              </div>
              <div className="mt-5 flex items-center justify-between text-sm font-semibold text-indigo-800">
                <span>Open category</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          ))}
          {displayedNodes.length === 0 && (
            <div className="md:col-span-2 xl:col-span-3">
              <SchematicEmptyState
                title="No exam path matched"
                description="Try a broader search term or clear the search box to view all active exam categories."
              />
            </div>
          )}
        </section>
      )}

      {activeCategory && !activeSubcategory && (
        <section className="grid gap-5 lg:grid-cols-[280px_1fr]">
          <aside className="rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
            <p className="px-2 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Categories</p>
            <div className="space-y-1">
              {nodes.map((category) => (
                <button
                  key={category.id}
                  type="button"
                  onClick={() => setTreeState({ activeCategory: category.id, activeSubCategory: null })}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm transition-all duration-300 ${
                    category.id === activeCategory.id
                      ? "bg-indigo-950 text-white shadow-[0_8px_24px_rgba(30,27,75,0.18)]"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-950"
                  }`}
                >
                  <span className="truncate">{category.name}</span>
                  <span className="text-xs tabular-nums">{category.subcategories.length}</span>
                </button>
              ))}
            </div>
          </aside>

          <div className="space-y-5">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <button
                type="button"
                onClick={() => setTreeState({ activeCategory: null, activeSubCategory: null })}
                className="mb-4 inline-flex items-center gap-2 rounded-md text-sm font-medium text-slate-500 transition hover:text-slate-950"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to categories
              </button>
              <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold text-slate-950">{activeCategory.name}</h2>
                  <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">{activeCategory.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-2 text-right">
                  <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Subcategories</p>
                    <p className="mt-1 text-xl font-semibold text-slate-950">{activeCategory.subcategories.length}</p>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-400">Tests</p>
                    <p className="mt-1 text-xl font-semibold text-teal-700">{activeCategory.tests.length}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {activeCategory.subcategories.map((subcategory) => (
                <button
                  key={subcategory.id}
                  type="button"
                  onClick={() => setTreeState({ activeCategory: activeCategory.id, activeSubCategory: subcategory.id })}
                  className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-[0_8px_30px_rgb(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-teal-300 hover:shadow-[0_20px_46px_rgb(13,148,136,0.12)] focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-600">
                      {subcategory.tests.length} tests
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-950">{subcategory.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">
                    {subcategory.description || "Focused mocks, sectional tests, and exam-specific practice."}
                  </p>
                  <div className="mt-5 flex items-center justify-between text-sm font-semibold text-teal-700">
                    <span>View exam cards</span>
                    <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </button>
              ))}
              {activeCategory.subcategories.length === 0 && (
                <div className="md:col-span-2 xl:col-span-3">
                  <SchematicEmptyState
                    title="No subcategories yet"
                    description="This category has tests, but no public exam grouping has been configured yet."
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {activeCategory && activeSubcategory && (
        <section className="grid gap-5 lg:grid-cols-[320px_1fr]">
          <aside className="sticky top-20 h-fit rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)] backdrop-blur-md">
            <button
              type="button"
              onClick={() => setTreeState({ activeCategory: activeCategory.id, activeSubCategory: null })}
              className="mb-4 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-slate-950"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to {activeCategory.name}
            </button>
            <h2 className="text-xl font-semibold text-slate-950">{activeSubcategory.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-slate-600">
              {activeSubcategory.description || "Exam blueprints, PYQs, and practice variants grouped by intent."}
            </p>
            <div className="mt-5 grid gap-3">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <ClipboardList className="h-4 w-4" />
                  <p className="text-xs font-semibold uppercase tracking-[0.16em]">No. of Tests</p>
                </div>
                <p className="mt-2 text-2xl font-semibold text-slate-950">{selectedTests.length}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <Zap className="h-4 w-4" />
                  <p className="text-xs font-semibold uppercase tracking-[0.16em]">Questions</p>
                </div>
                <p className="mt-2 text-2xl font-semibold text-teal-700">{totalQuestions}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <CalendarDays className="h-4 w-4" />
                  <p className="text-xs font-semibold uppercase tracking-[0.16em]">PYQs Available</p>
                </div>
                <p className="mt-2 text-2xl font-semibold text-amber-600">{pyqCount}</p>
              </div>
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                <div className="flex items-center gap-2 text-slate-500">
                  <TrendingUp className="h-4 w-4" />
                  <p className="text-xs font-semibold uppercase tracking-[0.16em]">Attempt History</p>
                </div>
                <p className="mt-2 text-sm font-semibold text-slate-950">
                  {avgScore > 0 ? `${avgScore}% average score` : "No local attempt yet"}
                </p>
              </div>
            </div>
          </aside>

          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Level 3: Exam Cards</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-950">{activeSubcategory.name} tests</h2>
                </div>
                <div className="rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-600">
                  Status glow: Green attempted, Blue new, Amber premium
                </div>
              </div>
            </div>

            <div className="grid gap-4 xl:grid-cols-2">
              {selectedTests.map((test) => {
                const status = getStatus(test);
                const isPaid = (test.access ?? "free") !== "free";
                return (
                  <article
                    key={test.id}
                    className={`rounded-2xl border border-slate-200 border-l-4 bg-white p-5 transition-all duration-300 hover:-translate-y-1 hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 ${status.border} ${status.glow}`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`rounded-md border px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ${status.chip}`}>
                            {status.label}
                          </span>
                          <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                            {test.kind ?? "full-length"}
                          </span>
                        </div>
                        <h3 className="mt-3 text-lg font-semibold text-slate-950">{test.name}</h3>
                        <p className="mt-1 text-sm text-slate-500">{test.category} / {test.subcategoryName ?? activeSubcategory.name}</p>
                      </div>
                      <span className={`flex h-9 w-9 items-center justify-center rounded-xl ${isPaid ? "bg-amber-50 text-amber-700" : "bg-teal-50 text-teal-700"}`}>
                        {isPaid ? <Lock className="h-4 w-4" /> : <Unlock className="h-4 w-4" />}
                      </span>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-2">
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Questions</p>
                        <p className="mt-1 text-sm font-semibold text-slate-950">{test.totalQuestions}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Time</p>
                        <p className="mt-1 text-sm font-semibold text-slate-950">{test.duration}m</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-slate-400">Attempts</p>
                        <p className="mt-1 text-sm font-semibold text-slate-950">{(test.attempts ?? 0).toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="mt-5 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-1">
                        {Array.from({ length: 5 }).map((_, index) => (
                          <span
                            key={index}
                            className={`h-1.5 w-7 rounded-sm ${index < getReasoningLevel(test) ? "bg-indigo-600" : "bg-slate-200"}`}
                          />
                        ))}
                      </div>
                      <Button
                        type="button"
                        onClick={() => setSelectedTest(test)}
                        className="rounded-md bg-teal-600 text-white hover:bg-teal-700"
                      >
                        View Blueprint
                      </Button>
                    </div>
                  </article>
                );
              })}
              {selectedTests.length === 0 && (
                <div className="xl:col-span-2">
                  <SchematicEmptyState
                    title="No exams in this path"
                    description="This subcategory exists, but no tests have been attached to it yet."
                  />
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      <Sheet open={Boolean(selectedTest)} onOpenChange={(open) => !open && setSelectedTest(null)}>
        <SheetContent side="right" className="w-full border-l border-slate-200 bg-slate-50 sm:max-w-md">
          {selectedTest && (
            <>
              <SheetHeader>
                <SheetTitle className="text-slate-950">Exam Blueprint</SheetTitle>
                <SheetDescription>{selectedTest.category} / {selectedTest.subcategoryName ?? "General"}</SheetDescription>
              </SheetHeader>
              <div className="mt-6 space-y-4">
                <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.04)]">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">Exam Name</p>
                  <h2 className="mt-2 text-xl font-semibold text-slate-950">{selectedTest.name}</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Review timing, access, and level before starting the test.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs text-slate-500">Questions</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-950">{selectedTest.totalQuestions}</p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 bg-white p-4">
                    <p className="text-xs text-slate-500">Time</p>
                    <p className="mt-1 text-2xl font-semibold text-slate-950">{selectedTest.duration}m</p>
                  </div>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-white p-4">
                  <p className="text-xs text-slate-500">Reasoning Level</p>
                  <div className="mt-3 flex gap-1">
                    {Array.from({ length: 5 }).map((_, index) => (
                      <span
                        key={index}
                        className={`h-2 flex-1 rounded-sm ${index < getReasoningLevel(selectedTest) ? "bg-indigo-600" : "bg-slate-200"}`}
                      />
                    ))}
                  </div>
                </div>
                <Button
                  className="h-11 w-full rounded-md bg-teal-600 text-white hover:bg-teal-700"
                  onClick={() => setLocation(`/test/${selectedTest.id}`)}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Start Test
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
