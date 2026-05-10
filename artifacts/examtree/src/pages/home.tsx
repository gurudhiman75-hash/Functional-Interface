import { useMemo, useState } from "react";
import { useLocation } from "wouter";
import { ArrowRight, ClipboardList, Clock3, Search, Star, Target } from "lucide-react";
import { getActiveTestSessions, getAttempts, getUser } from "@/lib/storage";
import { useExamCatalog } from "@/providers/ExamCatalogProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const testimonials = [
  {
    name: "Amandeep K.",
    exam: "Punjab State Exams",
    text: "The review flow helped me see exactly where I was losing accuracy in reasoning.",
  },
  {
    name: "Ritika S.",
    exam: "SSC CGL",
    text: "Clean interface, fast test access, and no distractions while reviewing mistakes.",
  },
  {
    name: "Harsh M.",
    exam: "Banking",
    text: "The analytics page made my speed issues obvious within a week.",
  },
];

export default function Home() {
  const [, setLocation] = useLocation();
  const user = getUser();
  const attempts = getAttempts();
  const activeSessions = getActiveTestSessions();
  const { tests, categories, isLoading } = useExamCatalog();
  const [query, setQuery] = useState("");

  const latestAttempt = attempts[0] ?? null;
  const activeSessionEntries = Object.values(activeSessions).slice(0, 3);

  const featuredTests = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return tests
      .filter((test) => {
        if (!normalized) return true;
        return (
          test.name.toLowerCase().includes(normalized) ||
          test.category.toLowerCase().includes(normalized) ||
          (test.subcategoryName ?? "").toLowerCase().includes(normalized)
        );
      })
      .slice(0, 6);
  }, [query, tests]);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl space-y-5 px-4 py-10">
        <div className="skeleton-shimmer h-48 rounded-md" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="skeleton-shimmer h-40 rounded-md" />
          <div className="skeleton-shimmer h-40 rounded-md" />
          <div className="skeleton-shimmer h-40 rounded-md" />
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <section className="data-card p-8">
        <p className="professional-badge mb-4">Professional Testing Platform</p>
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
              Practice, diagnose, and improve with high-density exam tools.
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-muted-foreground">
              Search exams, resume active tests, and track logic performance across SSC, Banking, Punjab, and management preparation.
            </p>
            <div className="relative mt-6 max-w-xl">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search for an exam or topic..."
                className="h-11 rounded-md pl-9"
              />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: "Categories", value: categories.length },
              { label: "Tests", value: tests.length },
              { label: "Attempts", value: attempts.length },
            ].map((item) => (
              <div key={item.label} className="rounded-md border border-border bg-muted/30 p-3">
                <p className="text-2xl font-semibold tabular-nums">{item.value}</p>
                <p className="mt-1 text-xs text-muted-foreground">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1fr_0.8fr]">
        <div className="data-card p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Active Tests</p>
              <h2 className="mt-1 text-xl font-semibold">Resume</h2>
            </div>
            <Target className="h-5 w-5 text-indigo-600" />
          </div>

          {activeSessionEntries.length === 0 && !latestAttempt ? (
            <div className="rounded-md border border-dashed border-border p-8 text-center">
              <p className="text-sm font-medium">No active test yet</p>
              <p className="mt-1 text-sm text-muted-foreground">Start from Tests & Exams to create your first session.</p>
              <Button className="mt-4 rounded-md bg-indigo-600 hover:bg-indigo-700" onClick={() => setLocation("/tests")}>
                Browse Tests
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {latestAttempt && (
                <button
                  type="button"
                  onClick={() => setLocation(`/result?testId=${latestAttempt.testId}&tab=review`)}
                  className="flex w-full items-center justify-between rounded-md border border-border p-3 text-left transition hover:border-indigo-500/35 hover:bg-indigo-50/40"
                >
                  <div>
                    <p className="font-medium">{latestAttempt.testName}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Last score: {latestAttempt.score}%</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </button>
              )}
              {activeSessionEntries.map((session) => (
                <button
                  key={session.testId}
                  type="button"
                  onClick={() => setLocation(`/test/${session.testId}`)}
                  className="flex w-full items-center justify-between rounded-md border border-border p-3 text-left transition hover:border-indigo-500/35 hover:bg-indigo-50/40"
                >
                  <div>
                    <p className="font-medium">{session.testName}</p>
                    <p className="mt-1 text-xs text-muted-foreground">In progress</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground" />
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="data-card p-5">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Social Proof</p>
          <h2 className="mt-1 text-xl font-semibold">Testimonials</h2>
          <div className="mt-4 space-y-3">
            {testimonials.map((item) => (
              <div key={item.name} className="rounded-md border border-border p-3">
                <div className="mb-2 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-zinc-200 grayscale dark:bg-slate-700" />
                  <div>
                    <p className="text-sm font-semibold">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.exam}</p>
                  </div>
                </div>
                <p className="text-sm leading-6 text-muted-foreground">"{item.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="data-card overflow-hidden">
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Featured Tests</p>
            <h2 className="mt-1 text-xl font-semibold">Exam hub</h2>
          </div>
          <Button variant="outline" className="rounded-md" onClick={() => setLocation("/tests")}>
            View all
          </Button>
        </div>
        <div className="divide-y divide-border">
          {featuredTests.map((test) => (
            <button
              key={test.id}
              type="button"
              onClick={() => setLocation(`/test/${test.id}`)}
              className="grid w-full gap-3 px-5 py-4 text-left transition hover:bg-indigo-50/35 md:grid-cols-[1fr_120px_120px_110px]"
            >
              <div>
                <p className="font-medium">{test.name}</p>
                <p className="mt-1 text-xs text-muted-foreground">{test.category} / {test.subcategoryName ?? "General"}</p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <ClipboardList className="h-3.5 w-3.5" />
                {test.totalQuestions} Q
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <Clock3 className="h-3.5 w-3.5" />
                {test.duration} min
              </span>
              <span className="inline-flex items-center gap-1.5 text-sm font-medium text-indigo-600">
                <Star className="h-3.5 w-3.5" />
                {test.difficulty}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
}
