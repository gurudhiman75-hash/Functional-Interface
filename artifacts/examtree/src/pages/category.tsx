import { useMemo } from "react";
import { useLocation, useParams } from "wouter";
import { ArrowLeft, BookOpen, ChevronRight, Clock3, Files, Layers3, Target } from "lucide-react";
import { getRuntimeCategories, getRuntimeExamGroups } from "@/lib/test-bank";
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
  const categories = useMemo(() => getRuntimeCategories(), []);
  const category = categories.find((item) => item.id === id);
  const exams = useMemo(() => (id ? getRuntimeExamGroups(id) : []), [id]);
  const gradient = CATEGORY_STYLES[category?.color ?? "blue"] ?? CATEGORY_STYLES.blue;

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
              <article
                key={exam.id}
                className="rounded-[1.8rem] border border-border/70 bg-card p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <Badge variant="secondary" className="rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.16em]">
                      {exam.totalTests} tests
                    </Badge>
                    <h3 className="mt-3 text-xl font-bold text-foreground">{exam.name}</h3>
                  </div>
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                    <Target className="h-5 w-5" />
                  </div>
                </div>

                <p className="mt-4 min-h-[72px] text-sm leading-6 text-muted-foreground">
                  {exam.description || `${exam.name} exam page with separate full-length, sectional, and topic-wise practice.`}
                </p>

                <div className="mt-5 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-2xl bg-muted/35 px-3 py-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Full</p>
                    <p className="mt-1 text-lg font-bold text-foreground">{exam.fullLengthCount}</p>
                  </div>
                  <div className="rounded-2xl bg-muted/35 px-3 py-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Sectional</p>
                    <p className="mt-1 text-lg font-bold text-foreground">{exam.sectionalCount}</p>
                  </div>
                  <div className="rounded-2xl bg-muted/35 px-3 py-3">
                    <p className="text-[11px] uppercase tracking-[0.14em] text-muted-foreground">Topic</p>
                    <p className="mt-1 text-lg font-bold text-foreground">{exam.topicWiseCount}</p>
                  </div>
                </div>

                <Button
                  className="mt-6 w-full rounded-2xl"
                  onClick={() => setLocation(`/subcategory/${exam.id}`)}
                  data-testid={`btn-open-exam-${exam.id}`}
                >
                  Open Exam
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
