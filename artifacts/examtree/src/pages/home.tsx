import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ClipboardList,
  Languages,
  Landmark,
  LineChart,
  Search,
  ShieldCheck,
  Sparkles,
  Target,
} from "lucide-react";
import { getActiveTestSessions, getAttempts } from "@/lib/storage";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";
import { CategoryIcon } from "@/components/CategoryIcon";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Category, Subcategory, Test } from "@/lib/data";
import { buildExamTreeNodes } from "@/lib/exam-tree";

type ExamGroup = {
  id: string;
  name: string;
  description: string;
  icon: string;
  tone: "ssc" | "banking" | "state" | "default";
  tests: Test[];
  subExams: { id: string; name: string }[];
};

function getTone(name: string): ExamGroup["tone"] {
  const normalized = name.toLowerCase();
  if (normalized.includes("ssc")) return "ssc";
  if (normalized.includes("bank") || normalized.includes("ibps") || normalized.includes("sbi")) return "banking";
  if (normalized.includes("punjab") || normalized.includes("state") || normalized.includes("psssb")) return "state";
  return "default";
}

function buildExamGroups(
  categories: Category[],
  subcategories: Subcategory[],
  tests: Test[],
): ExamGroup[] {
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
  if (tone === "banking") return <LineChart className="h-4 w-4" aria-hidden="true" />;
  if (tone === "state") return <Landmark className="h-4 w-4" aria-hidden="true" />;
  if (tone === "ssc") return <ShieldCheck className="h-4 w-4" aria-hidden="true" />;
  return <ClipboardList className="h-4 w-4" aria-hidden="true" />;
}

const practiceBenefits = [
  {
    icon: ClipboardList,
    label: "Published catalog",
    copy: "Practice from the test inventory currently available to students.",
  },
  {
    icon: Clock3,
    label: "Attempt continuity",
    copy: "Resume in-progress tests and return to completed attempts.",
  },
  {
    icon: Languages,
    label: "Multilingual delivery",
    copy: "Use approved languages when they are configured for a published test.",
  },
  {
    icon: CheckCircle2,
    label: "Solution review",
    copy: "Reopen evaluated attempts after submission and review the result.",
  },
];

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
  const activeGroup = examGroups.find((group) => group.id === activeGroupId) ?? examGroups[0] ?? null;

  const filteredGroups = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return examGroups;
    return examGroups
      .map((group) => ({
        ...group,
        tests: group.tests.filter(
          (test) =>
            test.name.toLowerCase().includes(normalized) ||
            test.category.toLowerCase().includes(normalized) ||
            (test.subcategoryName ?? "").toLowerCase().includes(normalized),
        ),
      }))
      .filter((group) => group.name.toLowerCase().includes(normalized) || group.tests.length > 0);
  }, [examGroups, query]);

  const visibleGroups = query ? filteredGroups : examGroups;
  const activeGroupTests =
    activeGroup?.tests.filter((test) => (test.access ?? "free") === "free").slice(0, 4) ?? [];
  const catalogQuestionCount = tests.reduce((sum, test) => sum + Math.max(0, test.totalQuestions), 0);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-6" aria-label="Loading exam catalog">
        <div className="skeleton-shimmer h-[520px] rounded-3xl" />
        <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
          <div className="skeleton-shimmer h-96 rounded-3xl" />
          <div className="skeleton-shimmer h-96 rounded-3xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8 pb-4" data-testid="premium-home">
      <section
        className="et-panel-raised relative isolate overflow-hidden rounded-3xl"
        data-testid="home-premium-hero"
      >
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_12%,hsl(var(--primary)/0.16),transparent_34%),radial-gradient(circle_at_88%_2%,hsl(var(--primary)/0.08),transparent_30%)]" />
        <div className="grid gap-8 p-5 sm:p-7 lg:grid-cols-[1.08fr_0.92fr] lg:gap-10 lg:p-10">
          <div className="flex flex-col justify-center">
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.16em] text-primary">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Focused exam practice
            </div>

            <h1 className="mt-5 max-w-3xl text-4xl font-extrabold tracking-[-0.045em] text-foreground sm:text-5xl lg:text-[3.6rem] lg:leading-[1.02]">
              Structured mock tests for serious exam practice.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
              Discover live tests for SSC, banking, and state exams, keep real attempts moving across sessions, and return to evaluated results when you are ready to review.
            </p>

            <div className="relative mt-7 max-w-2xl">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search SSC CGL, IBPS PO, PSSSB, Quantitative Aptitude…"
                aria-label="Search exams and tests"
                className="h-13 min-h-12 rounded-2xl border-border bg-background/90 pl-12 pr-4 text-base shadow-sm focus-visible:ring-primary"
              />
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                className="et-interactive min-h-11 rounded-xl px-5 text-sm font-bold shadow-sm"
                onClick={() => setLocation("/tests")}
              >
                Browse live tests
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
              <Button
                variant="outline"
                className="et-interactive min-h-11 rounded-xl border-border bg-background/80 px-5 text-sm font-bold"
                onClick={() => setLocation("/dashboard")}
              >
                View my activity
              </Button>
            </div>

            <div className="mt-7 grid grid-cols-3 overflow-hidden rounded-2xl border border-border bg-background/70" aria-label="Live catalog totals">
              <div className="px-3 py-4 sm:px-4">
                <p className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">{formatCount(tests.length)}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Published tests</p>
              </div>
              <div className="border-x border-border px-3 py-4 sm:px-4">
                <p className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">{formatCount(catalogQuestionCount)}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Live questions</p>
              </div>
              <div className="px-3 py-4 sm:px-4">
                <p className="text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">{formatCount(examGroups.length)}</p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Exam families</p>
              </div>
            </div>
          </div>

          <div className="et-panel self-stretch rounded-3xl p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4 border-b border-border pb-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Practice workspace</p>
                <h2 className="mt-1 text-xl font-extrabold tracking-tight text-foreground sm:text-2xl">Everything needed for a real attempt</h2>
              </div>
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                <Target className="h-5 w-5" aria-hidden="true" />
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {practiceBenefits.map(({ icon: Icon, label, copy }) => (
                <div key={label} className="rounded-2xl border border-border bg-muted/35 p-4">
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-background text-primary shadow-sm ring-1 ring-border">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <p className="mt-3 text-sm font-bold text-foreground">{label}</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">{copy}</p>
                </div>
              ))}
            </div>

            <button
              type="button"
              onClick={() => setLocation("/tests")}
              className="et-interactive mt-4 flex min-h-11 w-full items-center justify-between rounded-2xl border border-primary/20 bg-primary/10 px-4 py-3 text-left text-sm font-bold text-primary hover:bg-primary/15"
            >
              <span>Open the full test explorer</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_340px]" data-testid="home-exam-discovery">
        <div className="et-panel-raised overflow-hidden rounded-3xl">
          <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Exam pathways</p>
              <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">Find the right practice lane faster</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted-foreground">
                Move from an exam family to its branches and current published tests without losing context.
              </p>
            </div>
            <Button
              variant="outline"
              className="et-interactive min-h-11 shrink-0 rounded-xl"
              onClick={() => setLocation("/tests")}
            >
              See all tests
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </div>

          {examGroups.length > 0 && (
            <div className="flex gap-2 overflow-x-auto border-b border-border bg-muted/20 px-4 py-3 sm:px-6" aria-label="Exam family filters">
              {examGroups.map((group) => {
                const active = activeGroup?.id === group.id;
                return (
                  <button
                    key={group.id}
                    type="button"
                    onClick={() => setActiveGroupId(group.id)}
                    aria-pressed={active}
                    className={`et-interactive flex min-h-11 shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold ${
                      active
                        ? "border-primary bg-primary text-primary-foreground shadow-sm"
                        : "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground"
                    }`}
                  >
                    <ExamTypeIcon tone={group.tone} />
                    {group.name}
                  </button>
                );
              })}
            </div>
          )}

          <div className="grid gap-4 p-4 sm:p-6 md:grid-cols-2">
            {visibleGroups.slice(0, 6).map((group) => (
              <article key={group.id} className="et-panel group rounded-2xl p-4 sm:p-5">
                <div className="flex items-start justify-between gap-4">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <CategoryIcon icon={group.icon} className="h-5 w-5" />
                  </span>
                  <span className="rounded-full border border-border bg-muted/50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-muted-foreground">
                    {formatCount(group.tests.length)} {group.tests.length === 1 ? "test" : "tests"}
                  </span>
                </div>

                <h3 className="mt-4 text-lg font-extrabold tracking-tight text-foreground">{group.name}</h3>
                <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-5 text-muted-foreground">{group.description}</p>

                <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl bg-muted/40 p-3 text-xs">
                  <div>
                    <p className="font-semibold uppercase tracking-[0.1em] text-muted-foreground">Published</p>
                    <p className="mt-1 text-base font-extrabold text-foreground">{formatCount(group.tests.length)}</p>
                  </div>
                  <div>
                    <p className="font-semibold uppercase tracking-[0.1em] text-muted-foreground">Branches</p>
                    <p className="mt-1 text-base font-extrabold text-foreground">{formatCount(group.subExams.length)}</p>
                  </div>
                </div>

                {group.subExams.length > 0 && (
                  <div className="mt-3 space-y-1.5">
                    {group.subExams.slice(0, 2).map((subExam) => (
                      <button
                        key={subExam.id}
                        type="button"
                        onClick={() => setLocation(`/subcategory/${subExam.id}`)}
                        className="et-interactive flex min-h-11 w-full items-center justify-between rounded-xl px-2.5 py-2 text-left text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground"
                      >
                        <span className="truncate">{subExam.name}</span>
                        <ChevronRight className="h-4 w-4 shrink-0" aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => setLocation(`/category/${group.id}`)}
                  className="et-interactive mt-3 flex min-h-11 w-full items-center justify-between rounded-xl border border-primary/15 bg-primary/5 px-3 py-2 text-sm font-bold text-primary hover:bg-primary/10"
                >
                  <span>Open {group.name}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </article>
            ))}

            {visibleGroups.length === 0 && (
              <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center md:col-span-2">
                <Search className="mx-auto h-7 w-7 text-muted-foreground" aria-hidden="true" />
                <p className="mt-3 font-bold text-foreground">No matching exam path found</p>
                <p className="mt-1 text-sm text-muted-foreground">Try another exam name or open the complete test explorer.</p>
              </div>
            )}
          </div>
        </div>

        <aside className="space-y-5" aria-label="Practice continuity">
          <div className="et-panel-raised rounded-3xl p-5" data-testid="home-practice-continuity">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Continue practice</p>
                <h2 className="mt-1 text-xl font-extrabold tracking-tight text-foreground">Your active lane</h2>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <Clock3 className="h-4 w-4" aria-hidden="true" />
              </span>
            </div>

            <div className="mt-4">
              {activeSessionEntries.length === 0 && !latestAttempt ? (
                <div className="rounded-2xl border border-dashed border-border bg-muted/25 p-5 text-center">
                  <Target className="mx-auto h-7 w-7 text-primary" aria-hidden="true" />
                  <p className="mt-3 text-sm font-bold text-foreground">No active test yet</p>
                  <p className="mt-1 text-sm leading-5 text-muted-foreground">Choose an exam path and begin with a published test.</p>
                  <Button className="mt-4 min-h-11 rounded-xl" onClick={() => setLocation("/tests")}>
                    Browse live tests
                  </Button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {activeSessionEntries.map((session) => (
                    <button
                      key={session.testId}
                      type="button"
                      onClick={() => setLocation(`/test/${session.testId}`)}
                      className="et-interactive flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3 text-left hover:border-primary/25 hover:bg-muted/30"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-foreground">{session.testName}</p>
                        <p className="mt-1 text-xs font-medium text-primary">Resume in-progress test</p>
                      </div>
                      <ArrowRight className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    </button>
                  ))}

                  {latestAttempt && (
                    <button
                      type="button"
                      onClick={() =>
                        setLocation(
                          `/result?attemptId=${encodeURIComponent(latestAttempt.id)}&testId=${encodeURIComponent(latestAttempt.testId)}&tab=review`,
                        )
                      }
                      className="et-interactive flex min-h-14 w-full items-center justify-between gap-3 rounded-2xl border border-border bg-card p-3 text-left hover:border-primary/25 hover:bg-muted/30"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-foreground">{latestAttempt.testName}</p>
                        <p className="mt-1 text-xs text-muted-foreground">Last saved score: {latestAttempt.score}%</p>
                      </div>
                      <BarChart3 className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="et-panel rounded-3xl p-5">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-muted-foreground">Student-ready flows</p>
            <h2 className="mt-1 text-lg font-extrabold text-foreground">Practice without demo-only promises</h2>
            <div className="mt-4 space-y-3">
              {[
                "Browse the currently published tests and series.",
                "Resume a saved attempt after returning to the app.",
                "Submit once and reopen the committed result.",
                "Use configured multilingual content when available.",
              ].map((item) => (
                <div key={item} className="flex gap-2.5 text-sm leading-5 text-muted-foreground">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <p>{item}</p>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </section>

      <section className="et-panel-raised overflow-hidden rounded-3xl" data-testid="home-featured-mocks">
        <div className="flex flex-col gap-3 border-b border-border p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-primary">Featured free mocks</p>
            <h2 className="mt-1 text-2xl font-extrabold tracking-tight text-foreground">{activeGroup?.name ?? "Featured"} tests</h2>
            <p className="mt-2 text-sm text-muted-foreground">A quick route into free published tests from the selected exam family.</p>
          </div>
          {activeGroup && (
            <Button
              variant="outline"
              className="et-interactive min-h-11 rounded-xl"
              onClick={() => setLocation(`/category/${activeGroup.id}`)}
            >
              Open category
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          )}
        </div>

        <div className="grid gap-3 p-4 sm:p-6 lg:grid-cols-2">
          {activeGroupTests.map((test) => (
            <button
              key={test.id}
              type="button"
              onClick={() => setLocation(`/test/${test.id}`)}
              className="et-interactive et-panel flex min-h-24 w-full flex-col justify-between gap-4 rounded-2xl p-4 text-left hover:border-primary/30 sm:flex-row sm:items-center"
            >
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.1em] text-primary">Free mock</span>
                  <span className="truncate text-xs text-muted-foreground">{test.category}</span>
                </div>
                <p className="mt-2 truncate text-base font-extrabold text-foreground">{test.name}</p>
                <p className="mt-1 truncate text-xs text-muted-foreground">{test.subcategoryName ?? "General"}</p>
              </div>
              <div className="flex shrink-0 items-center gap-3 text-xs font-semibold text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-2">
                  <ClipboardList className="h-3.5 w-3.5" aria-hidden="true" />
                  {test.totalQuestions} Q
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-lg bg-muted px-2.5 py-2">
                  <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
                  {test.duration} min
                </span>
                <ArrowRight className="h-4 w-4 text-primary" aria-hidden="true" />
              </div>
            </button>
          ))}

          {activeGroupTests.length === 0 && (
            <div className="rounded-2xl border border-dashed border-border bg-muted/20 p-8 text-center lg:col-span-2">
              <BookOpenCheck className="mx-auto h-8 w-8 text-primary" aria-hidden="true" />
              <p className="mt-3 font-bold text-foreground">No free featured test in this category yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Open the category to see its current published inventory.</p>
              {activeGroup && (
                <Button variant="outline" className="mt-4 min-h-11 rounded-xl" onClick={() => setLocation(`/category/${activeGroup.id}`)}>
                  Open category
                </Button>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
