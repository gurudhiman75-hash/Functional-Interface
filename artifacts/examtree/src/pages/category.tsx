import { useMemo } from "react";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, BookOpen, ChevronRight, Clock3, Files, Layers3, Target } from "lucide-react";
import { getRuntimeExamGroups } from "@/lib/test-bank";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";
import { API_BASE_URL } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CATEGORY_STYLES: Record<string, string> = {
  blue: "from-sky-500 via-blue-500 to-indigo-500",
  emerald: "from-emerald-500 via-teal-500 to-cyan-500",
  violet: "from-violet-500 via-fuchsia-500 to-pink-500",
  amber: "from-amber-500 via-orange-500 to-rose-500",
  orange: "from-orange-500 via-amber-500 to-yellow-500",
  rose: "from-rose-500 via-pink-500 to-fuchsia-500",
  indigo: "from-indigo-500 via-blue-500 to-cyan-500",
  red: "from-red-500 via-rose-500 to-orange-500",
};

export default function CategoryPage() {
  const { id } = useParams<{ id: string }>();
  const [, setLocation] = useLocation();
  const { categories, tests, isLoading, error } = useExamCatalog();
  const category = categories.find((item) => item.id === id);
  const exams = useMemo(
    () => (id ? getRuntimeExamGroups(id, categories, tests) : []),
    [id, categories, tests],
  );
  const gradient = CATEGORY_STYLES[category?.color ?? "blue"] ?? CATEGORY_STYLES.blue;

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="text-xl font-semibold text-foreground">Could not load category</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            API expected at <code className="rounded bg-muted px-1 py-0.5 text-xs">{API_BASE_URL}</code>
          </p>
        </main>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="mx-auto max-w-7xl animate-pulse px-4 py-12">
          <div className="h-8 w-40 rounded-lg bg-muted" />
          <div className="mt-8 h-64 rounded-3xl bg-muted" />
        </div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto flex min-h-[70vh] max-w-5xl items-center justify-center px-4 py-10 sm:px-6 lg:px-8">
          <div className="glass-panel max-w-xl rounded-[2rem] border border-border/60 p-10 text-center shadow-lg">
            <Badge variant="secondary" className="mb-4 rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em]">
              Category unavailable
            </Badge>
            <h1 className="text-2xl font-bold text-foreground">Category not found</h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              This category is not available right now.
            </p>
            <Button className="mt-6 rounded-2xl" onClick={() => setLocation("/exams")}>
              Back to Exams
            </Button>
          </div>
        </main>
      </div>
    );
  }

  const totalTests = exams.reduce((sum, exam) => sum + exam.totalTests, 0);
  const totalFullLength = exams.reduce((sum, exam) => sum + exam.fullLengthCount, 0);
  const totalSectional = exams.reduce((sum, exam) => sum + exam.sectionalCount, 0);
  const totalTopicWise = exams.reduce((sum, exam) => sum + exam.topicWiseCount, 0);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden border-b border-border/70 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.14),transparent_30%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.12),transparent_26%)]">
        <div className="absolute inset-0 -z-10 aurora-bg" />
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
          <button
            onClick={() => setLocation("/exams")}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            data-testid="btn-back-exams"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to exams
          </button>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div className="max-w-3xl">
              <Badge variant="secondary" className="mb-4 rounded-full border border-white/20 bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Category Hub
              </Badge>
              <h1 className="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">{category.name}</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground sm:text-lg">
                {category.description}
              </p>

              <div className="mt-8 grid gap-3 sm:grid-cols-4">
                <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-muted-foreground">
                  <span className="block text-lg font-bold text-foreground">{exams.length}</span>
                  exams
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-muted-foreground">
                  <span className="block text-lg font-bold text-foreground">{totalFullLength}</span>
                  full-length
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-muted-foreground">
                  <span className="block text-lg font-bold text-foreground">{totalSectional}</span>
                  sectional
                </div>
                <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-muted-foreground">
                  <span className="block text-lg font-bold text-foreground">{totalTopicWise}</span>
                  topic-wise
                </div>
              </div>
            </div>

            <div className={`glass-panel relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br ${gradient} p-6 text-white shadow-[0_30px_90px_-45px_rgba(0,0,0,0.55)]`}>
              <div className="absolute inset-x-0 top-0 h-28 bg-white/10" />
              <div className="relative">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-white/70">Quick view</p>
                    <h2 className="mt-2 text-2xl font-bold">{category.name} exams</h2>
                  </div>
                  <div className="rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-right">
                    <p className="text-xs text-white/70">Mocks</p>
                    <p className="text-xl font-bold">{totalTests}</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                      <Files className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-semibold">Exam-specific pages</p>
                    <p className="mt-1 text-sm text-white/75">Open the exact exam a student is preparing for.</p>
                  </div>
                  <div className="rounded-2xl border border-white/10 bg-white/10 p-4">
                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white/15">
                      <Layers3 className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-semibold">Three practice modes</p>
                    <p className="mt-1 text-sm text-white/75">Full-length, sectional, and topic-wise tests are separated.</p>
                  </div>
                </div>

                <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/40 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-white/60">Catalog strength</p>
                      <p className="mt-1 text-sm text-white/80">Total exam cards in this category</p>
                    </div>
                    <p className="text-3xl font-bold text-emerald-300">{exams.length}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary/80">Available exams</p>
            <h2 className="mt-2 text-2xl font-bold text-foreground">Choose the exact exam under {category.name}</h2>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock3 className="h-4 w-4 text-primary" />
            Select an exam to view its full-length, sectional, and topic-wise mocks
          </div>
        </div>

        {exams.length === 0 ? (
          <div className="rounded-[1.8rem] border border-dashed border-border/70 bg-card/70 px-6 py-12 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-muted-foreground/60" />
            <h2 className="mt-4 text-xl font-semibold text-foreground">No exams configured yet</h2>
            <p className="mt-2 text-sm text-muted-foreground">Add exams from the admin panel and they will appear here automatically.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {exams.map((exam) => (
              <button
                key={exam.id}
                type="button"
                onClick={() => setLocation(`/subcategory/${exam.id}`)}
                data-testid={`btn-open-exam-${exam.id}`}
                className="group relative flex w-full flex-col overflow-hidden rounded-[1.85rem] border border-border/60 bg-card text-left shadow-sm ring-offset-background transition-all duration-300 hover:-translate-y-1 hover:border-primary/25 hover:shadow-[0_24px_48px_-28px_rgba(59,130,246,0.35)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
              >
                <div
                  className={`pointer-events-none absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b ${CATEGORY_STYLES[category.color ?? "blue"] ?? CATEGORY_STYLES.blue} opacity-90 transition-all group-hover:w-2`}
                  aria-hidden
                />
                <div className="pointer-events-none absolute -right-16 -top-20 h-44 w-44 rounded-full bg-primary/[0.06] blur-2xl transition-opacity group-hover:opacity-100" aria-hidden />
                <div className="relative flex flex-1 flex-col p-6 pl-7">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <Badge
                        variant="secondary"
                        className="rounded-full border border-border/50 bg-muted/50 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-muted-foreground"
                      >
                        {exam.totalTests} tests
                      </Badge>
                      <h3 className="mt-3 text-xl font-bold tracking-tight text-foreground transition-colors group-hover:text-primary">
                        {exam.name}
                      </h3>
                    </div>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/15 to-primary/5 text-primary shadow-inner ring-1 ring-primary/10 transition-transform duration-300 group-hover:scale-105">
                      <Target className="h-5 w-5" />
                    </div>
                  </div>

                  <p className="mt-4 min-h-[4.5rem] text-sm leading-relaxed text-muted-foreground">
                    {exam.description || `${exam.name} exam page with separate full-length, sectional, and topic-wise practice.`}
                  </p>

                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <div className="rounded-2xl border border-border/40 bg-muted/25 px-2 py-3 text-center transition-colors group-hover:bg-muted/40">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Full</p>
                      <p className="mt-1 text-lg font-bold tabular-nums text-foreground">{exam.fullLengthCount}</p>
                    </div>
                    <div className="rounded-2xl border border-border/40 bg-muted/25 px-2 py-3 text-center transition-colors group-hover:bg-muted/40">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Section</p>
                      <p className="mt-1 text-lg font-bold tabular-nums text-foreground">{exam.sectionalCount}</p>
                    </div>
                    <div className="rounded-2xl border border-border/40 bg-muted/25 px-2 py-3 text-center transition-colors group-hover:bg-muted/40">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">Topic</p>
                      <p className="mt-1 text-lg font-bold tabular-nums text-foreground">{exam.topicWiseCount}</p>
                    </div>
                  </div>

                  <div className="mt-6 flex items-center justify-between rounded-2xl border border-dashed border-border/60 bg-muted/15 px-4 py-3 text-sm font-semibold text-primary">
                    <span>Open exam hub</span>
                    <ChevronRight className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
