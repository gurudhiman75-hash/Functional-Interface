import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import {
  ArrowRight,
  BarChart3,
  BookOpenCheck,
  BrainCircuit,
  CheckCircle2,
  ChevronRight,
  Clock3,
  ClipboardList,
  Landmark,
  LineChart,
  Lock,
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
import {
  buildExamTreeNodes,
} from "@/lib/exam-tree";

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
    border: "border-l-orange-500",
    icon: "bg-orange-50 text-orange-700",
    badge: "border-orange-200 bg-orange-50 text-orange-700",
  },
  banking: {
    border: "border-l-indigo-600",
    icon: "bg-indigo-50 text-indigo-700",
    badge: "border-indigo-200 bg-indigo-50 text-indigo-700",
  },
  state: {
    border: "border-l-teal-500",
    icon: "bg-teal-50 text-teal-700",
    badge: "border-teal-200 bg-teal-50 text-teal-700",
  },
  default: {
    border: "border-l-slate-400",
    icon: "bg-slate-100 text-slate-700",
    badge: "border-slate-200 bg-slate-50 text-slate-700",
  },
};

const skillNodes = [
  { label: "Circular Logic", mastery: 76, tone: "bg-teal-500" },
  { label: "Quant Motifs", mastery: 62, tone: "bg-indigo-600" },
  { label: "Syllogism", mastery: 84, tone: "bg-emerald-500" },
  { label: "DI Sets", mastery: 48, tone: "bg-amber-500" },
  { label: "GK Recall", mastery: 71, tone: "bg-cyan-600" },
  { label: "Punjabi QA", mastery: 58, tone: "bg-rose-500" },
];

const testimonials = [
  {
    name: "Amandeep K.",
    exam: "Punjab State Exams",
    text: "The logic playback made seating puzzles feel transparent instead of random.",
  },
  {
    name: "Ritika S.",
    exam: "SSC CGL",
    text: "Mock analysis is sharper than a simple scorecard. I know exactly what to fix.",
  },
  {
    name: "Harsh M.",
    exam: "Banking",
    text: "The speed and accuracy diagnosis helped me stop over-solving easy questions.",
  },
];

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
  return buildExamTreeNodes(
    categories,
    subcategories,
    tests,
  ).map((category) => ({
    id: category.id,
    name: category.name,
    description: category.description,
    icon: category.icon || "Landmark",
    tone: getTone(category.name),
    tests: category.tests,
    subExams: category.subcategories
      .map((subExam) => ({
        id: subExam.id,
        name: subExam.name,
      }))
      .slice(0, 5),
  }));
}

function formatCompactNumber(value: number) {
  if (value >= 1000000) return `${(value / 1000000).toFixed(value % 1000000 === 0 ? 0 : 1)}M+`;
  if (value >= 1000) return `${(value / 1000).toFixed(value % 1000 === 0 ? 0 : 1)}k+`;
  return String(value);
}

function ExamTypeIcon({ tone }: { tone: ExamGroup["tone"] }) {
  if (tone === "banking") return <LineChart className="h-5 w-5" />;
  if (tone === "state") return <Landmark className="h-5 w-5" />;
  if (tone === "ssc") return <ShieldCheck className="h-5 w-5" />;
  return <ClipboardList className="h-5 w-5" />;
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
    () =>
      buildExamGroups(
        categories,
        subcategories,
        tests,
      ),
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

  const activeGroupTests = activeGroup?.tests.slice(0, 4) ?? [];
  const generatedQuestionCount = Math.max(1000000, tests.reduce((sum, test) => sum + test.totalQuestions, 0) * 160);
  const activeUserCount = Math.max(12840, tests.reduce((sum, test) => sum + (test.attempts ?? 0), 0));

  if (isLoading) {
    return (
      <div className="mx-auto max-w-7xl space-y-5">
        <div className="skeleton-shimmer h-10 rounded-2xl" />
        <div className="skeleton-shimmer h-[420px] rounded-2xl" />
        <div className="grid gap-5 md:grid-cols-3">
          <div className="skeleton-shimmer h-56 rounded-2xl" />
          <div className="skeleton-shimmer h-56 rounded-2xl" />
          <div className="skeleton-shimmer h-56 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-[#1e1b4b] text-white shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <div className="grid gap-0 text-xs font-semibold uppercase tracking-[0.18em] text-indigo-100 md:grid-cols-3">
          <div className="border-b border-white/10 px-5 py-3 md:border-b-0 md:border-r">
            Questions Generated: {formatCompactNumber(generatedQuestionCount)}
          </div>
          <div className="border-b border-white/10 px-5 py-3 md:border-b-0 md:border-r">
            Current Active Users: {formatCompactNumber(activeUserCount)}
          </div>
          <div className="px-5 py-3">Target Exams: SSC CGL, IBPS/SBI, Punjab State</div>
        </div>
      </section>

      <section className="relative overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_12%_20%,rgba(13,148,136,0.20),transparent_32%),radial-gradient(circle_at_88%_12%,rgba(79,70,229,0.20),transparent_34%),linear-gradient(135deg,#ffffff_0%,#f8fafc_54%,#eef2ff_100%)]" />
        <div className="relative grid gap-8 p-6 lg:grid-cols-[1.08fr_0.92fr] lg:p-8">
          <div className="flex flex-col justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-md border border-teal-200 bg-white/80 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.16em] text-teal-700 backdrop-blur-xl">
                <Sparkles className="h-3.5 w-3.5" />
                Logic-first exam engine
              </div>
              <h1 className="mt-5 max-w-4xl text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                India's Most Advanced Logic-Based Mock Test Series.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-slate-700">
                Target: SSC CGL, Banking (IBPS/SBI), and Punjab State Exams with structured mocks, quant patterns, PYQs, multilingual review, and deep logic analysis.
              </p>
              <div className="relative mt-7 max-w-2xl">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search SSC CGL, IBPS PO, PSSSB, Quantitative Aptitude ..."
                  className="h-12 rounded-2xl border-slate-200 bg-white/80 pl-11 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-xl"
                />
              </div>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button className="h-11 rounded-md bg-[#1e1b4b] px-5 text-white hover:bg-indigo-950" onClick={() => setLocation("/tests")}>
                Unlock Mock Exam
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button variant="outline" className="h-11 rounded-md border-slate-300 bg-white/80 px-5" onClick={() => setLocation("/dashboard")}>
                let's practice
              </Button>
              <Button variant="outline" className="h-11 rounded-md border-slate-300 bg-white/80 px-5" onClick={() => setLocation("/performance")}>
                View Detailed Analysis
              </Button>
            </div>
          </div>

          <div className="grid gap-5">
            <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-xl">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Mastery Roadmap</p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-950">Your skill tree</h2>
                </div>
                <BrainCircuit className="h-6 w-6 text-indigo-700" />
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {skillNodes.map((node) => (
                  <div
                    key={node.label}
                    className="group relative flex min-h-28 flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-slate-50 p-3 transition-all duration-300 hover:-translate-y-1 hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2"
                    style={{ clipPath: "polygon(10% 0%, 90% 0%, 100% 50%, 90% 100%, 10% 100%, 0% 50%)" }}
                  >
                    <div className={`absolute inset-x-0 bottom-0 ${node.tone}`} style={{ height: `${node.mastery}%`, opacity: 0.14 }} />
                    <p className="relative text-xs font-semibold text-slate-950">{node.label}</p>
                    <p className="relative text-lg font-semibold text-slate-950">{node.mastery}%</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white/80 p-5 shadow-[0_8px_30px_rgb(0,0,0,0.08)] backdrop-blur-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-700">Daily Logic Challenge</p>
                  <h2 className="mt-1 text-xl font-semibold text-slate-950"> The Seating arrangement sprint</h2>
                  <p className="mt-2 text-sm leading-relaxed text-slate-600">
                    Solve one high-yield arrangement puzzle before the timer resets.
                  </p>
                </div>
                <div className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-right">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-amber-700">Resets In</p>
                  <p className="mt-1 text-sm font-semibold text-slate-950">08:42:10</p>
                </div>
              </div>
              <Button className="mt-4 h-10 w-full rounded-md bg-teal-600 text-white hover:bg-teal-700" onClick={() => setLocation("/dashboard")}>
                Attempt Challenge
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_0.75fr]">
        <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
          <div className="rounded-t-2xl bg-[#1e1b4b] px-5 py-4 text-white">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-100">Exam pathways</p>
            <h2 className="mt-1 text-2xl font-semibold">Find the right mock series faster</h2>
          </div>

          <div className="sticky top-14 z-10 flex gap-2 overflow-x-auto border-b border-slate-200 bg-white/80 px-4 py-3 backdrop-blur-xl">
            {examGroups.map((group) => {
              const tone = toneClasses[group.tone];
              const active = activeGroup?.id === group.id;
              return (
                <button
                  key={group.id}
                  type="button"
                  onClick={() => setActiveGroupId(group.id)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl border px-3 py-2 text-sm font-semibold transition-all duration-300 hover:-translate-y-0.5 ${
                    active
                      ? "border-indigo-500 bg-indigo-950 text-white ring-2 ring-indigo-500 ring-offset-2"
                      : `bg-white text-slate-700 ${tone.badge}`
                  }`}
                >
                  <ExamTypeIcon tone={group.tone} />
                  {group.name}
                </button>
              );
            })}
          </div>

          <div className="grid gap-4 p-5 md:grid-cols-2">
            {(query ? filteredGroups : examGroups).slice(0, 6).map((group) => {
              const tone = toneClasses[group.tone];
              const aspirants = Math.max(1200, group.tests.reduce((sum, test) => sum + (test.attempts ?? 0), 0));
              return (
                <article
                  key={group.id}
                  role="button"
                  tabIndex={0}
                  onClick={() => setLocation(`/category/${group.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      setLocation(`/category/${group.id}`);
                    }
                  }}
                  className={`rounded-2xl border border-slate-200 border-l-4 bg-white p-4 shadow-[0_8px_30px_rgb(0,0,0,0.08)] transition-all duration-300 hover:-translate-y-1 hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2 ${tone.border}`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tone.icon}`}>
                      <CategoryIcon icon={group.icon} className="h-5 w-5" />
                    </div>
                    <span className={`rounded-md border px-2 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] ${tone.badge}`}>
                      2024 patterns updated
                    </span>
                  </div>
                  <h3 className="mt-4 text-lg font-semibold text-slate-950">{group.name}</h3>
                  <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-600">{group.description}</p>
                  <div className="mt-4 grid grid-cols-2 gap-2 rounded-2xl border border-slate-100 bg-slate-50 p-2 text-xs">
                    <div>
                      <p className="font-semibold uppercase tracking-[0.12em] text-slate-400">Live</p>
                      <p className="mt-1 font-semibold text-slate-950">{formatCompactNumber(aspirants)} aspirants</p>
                    </div>
                    <div>
                      <p className="font-semibold uppercase tracking-[0.12em] text-slate-400">PYQs</p>
                      <p className="mt-1 font-semibold text-teal-700">50+ added</p>
                    </div>
                  </div>
                  <div className="mt-4 space-y-2">
                    {group.subExams.slice(0, 3).map((subExam) => (
                      <button
                        key={subExam.id}
                        type="button"
                        onClick={(event) => {
                          event.stopPropagation();
                          setLocation(`/subcategory/${subExam.id}`);
                        }}
                        className="flex w-full items-center justify-between rounded-xl border border-slate-100 bg-white px-3 py-2 text-left text-sm transition hover:border-teal-300 hover:bg-teal-50/60"
                      >
                        <span className="truncate font-medium text-slate-700">{subExam.name}</span>
                        <ChevronRight className="h-4 w-4 text-slate-400" />
                      </button>
                    ))}
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm font-semibold text-indigo-800">
                    <span>Open category</span>
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </article>
              );
            })}
          </div>
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <div className="rounded-t-2xl bg-[#1e1b4b] px-5 py-4 text-white">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-100">Resume practice</p>
              <h2 className="mt-1 text-xl font-semibold">Your active lane</h2>
            </div>
            <div className="p-5">
              {activeSessionEntries.length === 0 && !latestAttempt ? (
                <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
                  <Target className="mx-auto h-8 w-8 text-teal-700" />
                  <p className="mt-3 text-sm font-semibold text-slate-950">No active mock yet</p>
                  <p className="mt-1 text-sm text-slate-600">Choose an exam path and unlock your first mock exam.</p>
                  <Button className="mt-4 rounded-md bg-teal-600 text-white hover:bg-teal-700" onClick={() => setLocation("/tests")}>
                    Unlock Mock Exam
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {latestAttempt && (
                    <button
                      type="button"
                      onClick={() => setLocation(`/result?testId=${latestAttempt.testId}&tab=review`)}
                      className="flex w-full items-center justify-between rounded-2xl border border-slate-200 border-l-4 border-l-indigo-600 bg-white p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2"
                    >
                      <div>
                        <p className="font-semibold text-slate-950">{latestAttempt.testName}</p>
                        <p className="mt-1 text-xs text-slate-500">Last score: {latestAttempt.score}%</p>
                      </div>
                      <BarChart3 className="h-4 w-4 text-indigo-700" />
                    </button>
                  )}
                  {activeSessionEntries.map((session) => (
                    <button
                      key={session.testId}
                      type="button"
                      onClick={() => setLocation(`/test/${session.testId}`)}
                      className="flex w-full items-center justify-between rounded-2xl border border-slate-200 border-l-4 border-l-teal-500 bg-white p-4 text-left transition-all duration-300 hover:-translate-y-0.5 hover:ring-2 hover:ring-indigo-500 hover:ring-offset-2"
                    >
                      <div>
                        <p className="font-semibold text-slate-950">{session.testName}</p>
                        <p className="mt-1 text-xs text-slate-500">In progress</p>
                      </div>
                      <Clock3 className="h-4 w-4 text-teal-700" />
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Social proof</p>
            <h2 className="mt-1 text-xl font-semibold text-slate-950">Aspirant feedback</h2>
            <div className="mt-4 space-y-3">
              {testimonials.map((item) => (
                <div key={item.name} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-200 text-xs font-semibold text-slate-700 grayscale">
                      {item.name.slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-950">{item.name}</p>
                      <p className="text-xs text-slate-500">{item.exam}</p>
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-slate-600">"{item.text}"</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white shadow-[0_8px_30px_rgb(0,0,0,0.12)]">
        <div className="rounded-t-2xl bg-[#1e1b4b] px-5 py-4 text-white">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-100">Priority mock exams</p>
          <h2 className="mt-1 text-2xl font-semibold">{activeGroup?.name ?? "Featured"} exam cards</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {activeGroupTests.map((test) => {
            const isPaid = (test.access ?? "free") !== "free";
            const tone = toneClasses[activeGroup?.tone ?? "default"];
            return (
              <button
                key={test.id}
                type="button"
                onClick={() => setLocation(`/test/${test.id}`)}
                className={`grid w-full gap-3 border-l-4 px-5 py-4 text-left transition-all duration-300 hover:bg-slate-50 md:grid-cols-[1fr_130px_130px_150px] ${tone.border}`}
              >
                <div>
                  <p className="font-semibold text-slate-950">{test.name}</p>
                  <p className="mt-1 text-xs text-slate-500">{test.category} / {test.subcategoryName ?? "General"}</p>
                </div>
                <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                  <ClipboardList className="h-3.5 w-3.5" />
                  {test.totalQuestions} Q
                </span>
                <span className="inline-flex items-center gap-1.5 text-sm text-slate-600">
                  <Clock3 className="h-3.5 w-3.5" />
                  {test.duration} min
                </span>
                <span className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs font-semibold ${isPaid ? "border-amber-200 bg-amber-50 text-amber-700" : "border-teal-200 bg-teal-50 text-teal-700"}`}>
                  {isPaid ? <Lock className="h-3.5 w-3.5" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                  {isPaid ? "Unlock Mock Exam" : "Free Mock Exam"}
                </span>
              </button>
            );
          })}
          {activeGroupTests.length === 0 && (
            <div className="p-8 text-center text-sm text-slate-600">
              <BookOpenCheck className="mx-auto h-8 w-8 text-teal-700" />
              <p className="mt-3 font-semibold text-slate-950">No priority mock selected</p>
              <p className="mt-1">Select a category above to view its exam cards.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
