import { useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { BookOpen, ChevronRight, Files, Layers3, Search, Target } from "lucide-react";
import { getRuntimeExamGroups } from "@/lib/test-bank";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";
import { API_BASE_URL } from "@/lib/api";
import { Navbar } from "@/components/Navbar";
import { Input } from "@/components/ui/input";
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

export default function Tests() {
  const [, setLocation] = useLocation();
  const [search, setSearch] = useState("");
  const queryClient = useQueryClient();
  const { categories, tests, isLoading, error } = useExamCatalog();

  const handleRefresh = async () => {
    await queryClient.invalidateQueries(["exam-catalog"]);
  };

  const categoryCards = useMemo(() => (
    categories.map((category) => {
      const exams = getRuntimeExamGroups(category.id, categories, tests);
      return {
        ...category,
        totalExams: exams.length,
        totalFullLength: exams.reduce((sum, exam) => sum + exam.fullLengthCount, 0),
        totalSectional: exams.reduce((sum, exam) => sum + exam.sectionalCount, 0),
        totalTopicWise: exams.reduce((sum, exam) => sum + exam.topicWiseCount, 0),
      };
    })
  ), [categories, tests]);

  const filteredCategories = categoryCards.filter((category) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return category.name.toLowerCase().includes(query) || category.description.toLowerCase().includes(query);
  });

  const totalExams = categoryCards.reduce((sum, category) => sum + category.totalExams, 0);
  const totalTests = categoryCards.reduce((sum, category) => sum + category.testsCount, 0);

  if (error) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="mx-auto max-w-lg px-4 py-24 text-center">
          <h1 className="text-xl font-semibold text-foreground">Could not load exams</h1>
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
          <div className="h-10 w-1/2 rounded-xl bg-muted" />
          <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <div className="h-48 rounded-3xl bg-muted" />
            <div className="h-48 rounded-3xl bg-muted" />
            <div className="h-48 rounded-3xl bg-muted" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative overflow-hidden border-b border-border/70 bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.12),transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(16,185,129,0.10),transparent_28%)]">
        <div className="absolute inset-0 aurora-bg -z-10" />
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <Badge variant="secondary" className="rounded-full px-4 py-1.5 text-xs uppercase tracking-[0.18em]">
            Exam Catalog
          </Badge>
          <div className="mt-5 grid gap-8 lg:grid-cols-[1fr_340px] lg:items-end">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-5xl">
                Choose your category and enter the right exam track
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-muted-foreground sm:text-lg">
                Start from a category like SSC, Banking, Railways, or State Exams. From there, students can move into a specific exam and then browse full-length, sectional, and topic-wise practice separately.
              </p>
            </div>

            <div className="glass-panel rounded-[1.8rem] border border-white/10 p-5 shadow-lg">
              <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                <div className="rounded-2xl bg-muted/35 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Categories</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{categories.length}</p>
                </div>
                <div className="rounded-2xl bg-muted/35 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Exams</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{totalExams}</p>
                </div>
                <div className="rounded-2xl bg-muted/35 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">Mocks</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{totalTests}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="relative mt-8 max-w-xl">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search categories like SSC, Banking, NEET..."
              className="h-12 rounded-2xl border-white/60 bg-card/90 pl-11"
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button className="rounded-2xl" onClick={handleRefresh}>
              Refresh catalog
            </Button>
          </div>
        </div>
      </section>

      <main className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {filteredCategories.length === 0 ? (
          <div className="rounded-[1.8rem] border border-dashed border-border/70 bg-card/70 px-6 py-12 text-center">
            <BookOpen className="mx-auto h-10 w-10 text-muted-foreground/60" />
            <h2 className="mt-4 text-xl font-semibold text-foreground">No category matched your search</h2>
            <p className="mt-2 text-sm text-muted-foreground">Try a broader keyword or clear the search to see all exam categories.</p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredCategories.map((category) => {
              const gradient = CATEGORY_STYLES[category.color] ?? CATEGORY_STYLES.blue;
              return (
                <article
                  key={category.id}
                  className="group overflow-hidden rounded-[1.9rem] border border-border/70 bg-card shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl"
                >
                  <div className={`h-2 w-full bg-gradient-to-r ${gradient}`} />
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <Badge variant="secondary" className="rounded-full px-2.5 py-1 text-[11px] uppercase tracking-[0.16em]">
                          {category.totalExams} exams
                        </Badge>
                        <h2 className="mt-3 text-2xl font-bold text-foreground">{category.name}</h2>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <BookOpen className="h-5 w-5" />
                      </div>
                    </div>

                    <p className="mt-4 min-h-[72px] text-sm leading-6 text-muted-foreground">
                      {category.description}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
                      <div className="rounded-2xl bg-muted/35 px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Full Length</p>
                        <p className="mt-1 text-lg font-bold text-foreground">{category.totalFullLength}</p>
                      </div>
                      <div className="rounded-2xl bg-muted/35 px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Sectional</p>
                        <p className="mt-1 text-lg font-bold text-foreground">{category.totalSectional}</p>
                      </div>
                      <div className="rounded-2xl bg-muted/35 px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Topic Wise</p>
                        <p className="mt-1 text-lg font-bold text-foreground">{category.totalTopicWise}</p>
                      </div>
                      <div className="rounded-2xl bg-muted/35 px-4 py-3">
                        <p className="text-xs uppercase tracking-[0.16em] text-muted-foreground">Total Tests</p>
                        <p className="mt-1 text-lg font-bold text-foreground">{category.testsCount}</p>
                      </div>
                    </div>

                    <div className="mt-6 flex items-center justify-between">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <Layers3 className="h-4 w-4" />
                        Choose category, then exam, then type
                      </div>
                      <Button
                        className="rounded-2xl"
                        onClick={() => setLocation(`/category/${category.id}`)}
                        data-testid={`btn-open-category-${category.id}`}
                      >
                        Explore
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        <section className="mt-10 grid gap-4 rounded-[2rem] border border-border/70 bg-muted/25 p-6 md:grid-cols-3">
          <div className="rounded-2xl bg-card p-5 shadow-sm">
            <BookOpen className="mb-3 h-5 w-5 text-primary" />
            <h3 className="font-semibold text-foreground">Category-first journey</h3>
            <p className="mt-1 text-sm text-muted-foreground">Students now start with the main category instead of a flat mock list.</p>
          </div>
          <div className="rounded-2xl bg-card p-5 shadow-sm">
            <Files className="mb-3 h-5 w-5 text-emerald-600" />
            <h3 className="font-semibold text-foreground">Exam-specific grouping</h3>
            <p className="mt-1 text-sm text-muted-foreground">Each category opens into individual exams like SSC CGL Tier 1, CHSL, or MTS.</p>
          </div>
          <div className="rounded-2xl bg-card p-5 shadow-sm">
            <Target className="mb-3 h-5 w-5 text-amber-600" />
            <h3 className="font-semibold text-foreground">Type-based practice</h3>
            <p className="mt-1 text-sm text-muted-foreground">Full-length, sectional, and topic-wise mocks are separated the way students expect.</p>
          </div>
        </section>
      </main>
    </div>
  );
}
