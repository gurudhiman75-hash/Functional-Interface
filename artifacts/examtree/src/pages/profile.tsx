import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { signOut } from "firebase/auth";
import {
  ArrowRight,
  BarChart3,
  CheckCircle2,
  Clock3,
  Gift,
  LogOut,
  Trophy,
  User,
} from "lucide-react";
import { Link, useLocation } from "wouter";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getAnalytics, getUserAttempts, getUserPackages } from "@/lib/data";
import { getFirebaseAuth } from "@/lib/firebase";
import { getUser } from "@/lib/storage";

function scoreBadgeClass(score: number) {
  if (score >= 75) return "border-emerald-300 bg-emerald-50 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-200";
  if (score >= 50) return "border-amber-300 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/40 dark:text-amber-200";
  return "border-rose-300 bg-rose-50 text-rose-800 dark:border-rose-800 dark:bg-rose-950/40 dark:text-rose-200";
}

export default function ProfilePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const user = getUser();

  const {
    data: analytics,
    isLoading: analyticsLoading,
    error: analyticsError,
  } = useQuery({
    queryKey: ["analytics", user?.id],
    queryFn: () => getAnalytics(user?.id),
    enabled: !!user?.id,
    retry: false,
    staleTime: 60_000,
  });

  const {
    data: packages,
    isLoading: packagesLoading,
    error: packagesError,
  } = useQuery({
    queryKey: ["my-packages", user?.id],
    queryFn: () => getUserPackages(user?.id),
    enabled: !!user?.id,
    retry: false,
    staleTime: 60_000,
  });

  const {
    data: attempts,
    isLoading: attemptsLoading,
    error: attemptsError,
  } = useQuery({
    queryKey: ["my-attempts", user?.id],
    queryFn: () => getUserAttempts(user?.id),
    enabled: !!user?.id,
    retry: false,
    staleTime: 60_000,
  });

  const isLoading = analyticsLoading || packagesLoading || attemptsLoading;
  const error = analyticsError || packagesError || attemptsError;

  const summary = useMemo(() => {
    if (!analytics && !attempts) {
      return {
        totalAttempts: 0,
        averageScore: 0,
        bestScore: 0,
      };
    }

    const totalAttempts = analytics?.totalAttempts ?? attempts?.length ?? 0;
    const averageScore = analytics?.averageScore ?? (
      attempts && attempts.length > 0
        ? Math.round(attempts.reduce((sum, item) => sum + item.score, 0) / attempts.length)
        : 0
    );
    const bestScore = analytics?.highestScore ?? (
      attempts && attempts.length > 0
        ? Math.max(...attempts.map((item) => item.score))
        : 0
    );

    return {
      totalAttempts,
      averageScore,
      bestScore,
    };
  }, [analytics, attempts]);

  const totalPackages = packages?.length ?? 0;

  const handleLogout = async () => {
    const auth = getFirebaseAuth();
    try {
      if (auth) {
        await signOut(auth);
      }
    } catch {
      // Keep logout resilient if Firebase is temporarily unavailable.
    } finally {
      setLocation("/");
      toast({ title: "Logged out", description: "You have been signed out successfully." });
    }
  };

  if (!user) {
    return (
      <div className="mx-auto flex min-h-[60vh] w-full max-w-3xl items-center">
        <section className="w-full overflow-hidden rounded-2xl border border-border bg-card">
          <div className="border-b border-border bg-muted/30 px-6 py-5 sm:px-8">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <User className="h-5 w-5" aria-hidden="true" />
            </span>
          </div>
          <div className="px-6 py-8 sm:px-8 sm:py-10">
            <h1 className="text-2xl font-semibold tracking-tight text-foreground">Not signed in</h1>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">Please sign in to view your profile and progress.</p>
            <Button className="mt-6 min-h-11" onClick={() => setLocation("/login")}>Go to Login</Button>
          </div>
        </section>
      </div>
    );
  }

  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="mx-auto w-full max-w-6xl space-y-8" data-testid="profile-workspace">
      <header className="flex flex-col justify-between gap-5 lg:flex-row lg:items-end">
        <div>
          <p className="text-sm font-medium text-primary">Account & progress</p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">Welcome back, {user.name}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">Review your saved attempts, package history, and account details.</p>
        </div>
        <Button variant="outline" className="min-h-11 shrink-0 border-border bg-card" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" aria-hidden="true" />
          Logout
        </Button>
      </header>

      <section className="grid overflow-hidden border-y border-border bg-card lg:grid-cols-[1.25fr_0.75fr]" data-testid="profile-account-overview">
        <div className="flex items-center gap-4 px-5 py-6 sm:px-7 sm:py-8">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-lg font-semibold text-primary ring-1 ring-primary/15 sm:h-16 sm:w-16 sm:text-xl">
            {initials}
          </div>
          <div className="min-w-0">
            <h2 className="truncate text-xl font-semibold text-foreground sm:text-2xl">{user.name}</h2>
            <p className="mt-1 truncate text-sm text-muted-foreground">{user.email}</p>
          </div>
        </div>

        <dl className="grid border-t border-border sm:grid-cols-2 lg:border-l lg:border-t-0 lg:grid-cols-1">
          <div className="border-b border-border px-5 py-4 sm:border-b-0 sm:border-r lg:border-b lg:border-r-0">
            <dt className="text-xs font-medium text-muted-foreground">Account role</dt>
            <dd className="mt-1 text-base font-semibold capitalize text-foreground">{user.role ?? "Student"}</dd>
          </div>
          <div className="px-5 py-4">
            <dt className="text-xs font-medium text-muted-foreground">Account status</dt>
            <dd className="mt-1 inline-flex items-center gap-2 text-base font-semibold text-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" aria-hidden="true" />
              Signed in
            </dd>
          </div>
        </dl>
      </section>

      <section aria-labelledby="profile-progress-heading">
        <div>
          <h2 id="profile-progress-heading" className="text-2xl font-semibold tracking-tight text-foreground">Progress snapshot</h2>
          <p className="mt-1 text-sm text-muted-foreground">A compact view of the activity currently saved to your account.</p>
        </div>

        {isLoading ? (
          <div className="mt-4 grid border-y border-border bg-card sm:grid-cols-2 lg:grid-cols-4" aria-label="Loading profile progress">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="border-b border-border px-5 py-5 sm:border-r lg:border-b-0 last:border-b-0 last:border-r-0">
                <div className="skeleton-shimmer h-4 w-24 rounded" />
                <div className="skeleton-shimmer mt-3 h-7 w-16 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="mt-4 border-y border-destructive/30 bg-destructive/5 px-5 py-4 text-sm text-destructive">
            Unable to load activity stats. Please refresh.
          </div>
        ) : (
          <dl className="mt-4 grid border-y border-border bg-card sm:grid-cols-2 lg:grid-cols-4" data-testid="profile-progress-metrics">
            <div className="flex items-center gap-3 border-b border-border px-4 py-5 sm:border-r lg:border-b-0">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Clock3 className="h-4 w-4" aria-hidden="true" /></span>
              <div><dt className="text-xs font-medium text-muted-foreground">Total attempts</dt><dd className="mt-0.5 text-xl font-semibold tabular-nums text-foreground">{summary.totalAttempts}</dd></div>
            </div>
            <div className="flex items-center gap-3 border-b border-border px-4 py-5 lg:border-b-0 lg:border-r">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><BarChart3 className="h-4 w-4" aria-hidden="true" /></span>
              <div><dt className="text-xs font-medium text-muted-foreground">Average score</dt><dd className="mt-0.5 text-xl font-semibold tabular-nums text-foreground">{summary.averageScore}%</dd></div>
            </div>
            <div className="flex items-center gap-3 border-b border-border px-4 py-5 sm:border-b-0 sm:border-r">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-300"><Trophy className="h-4 w-4" aria-hidden="true" /></span>
              <div><dt className="text-xs font-medium text-muted-foreground">Best score</dt><dd className="mt-0.5 text-xl font-semibold tabular-nums text-foreground">{summary.bestScore}%</dd></div>
            </div>
            <div className="flex items-center gap-3 px-4 py-5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary"><Gift className="h-4 w-4" aria-hidden="true" /></span>
              <div><dt className="text-xs font-medium text-muted-foreground">Packages purchased</dt><dd className="mt-0.5 text-xl font-semibold tabular-nums text-foreground">{totalPackages}</dd></div>
            </div>
          </dl>
        )}
      </section>

      <section aria-labelledby="profile-latest-activity-heading">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <h2 id="profile-latest-activity-heading" className="text-2xl font-semibold tracking-tight text-foreground">Latest activity</h2>
            <p className="mt-1 text-sm text-muted-foreground">Open a saved attempt directly from its canonical result.</p>
          </div>
          {attempts && attempts.length > 4 ? (
            <Button asChild variant="ghost" className="min-h-11 justify-start px-2 text-primary sm:justify-center">
              <Link href="/dashboard">View all attempts <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
            </Button>
          ) : null}
        </div>

        <div className="mt-4 overflow-hidden border-y border-border bg-card">
          {attemptsLoading ? (
            <div className="space-y-3 px-5 py-7">
              <div className="skeleton-shimmer h-4 rounded-full" />
              <div className="skeleton-shimmer h-4 w-5/6 rounded-full" />
              <div className="skeleton-shimmer h-4 w-3/4 rounded-full" />
            </div>
          ) : !attempts || attempts.length === 0 ? (
            <div className="px-5 py-7">
              <p className="font-medium text-foreground">No attempts found yet</p>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">Start a published test to build your profile stats.</p>
              <Button asChild className="mt-4 min-h-11"><Link href="/tests">Browse Tests</Link></Button>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {attempts.slice(0, 4).map((attempt) => {
                const params = new URLSearchParams({ attemptId: attempt.id, testId: attempt.testId });
                return (
                  <Link
                    key={attempt.id}
                    href={`/result?${params.toString()}`}
                    className="group grid min-h-16 gap-3 px-4 py-4 transition hover:bg-muted/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-inset sm:grid-cols-[1fr_auto] sm:items-center sm:px-5"
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="truncate font-semibold text-foreground">{attempt.testName}</p>
                        <Badge variant="outline" className={scoreBadgeClass(attempt.score)}>{attempt.score}%</Badge>
                      </div>
                      <p className="mt-1 text-xs leading-5 text-muted-foreground">{attempt.category} · {attempt.correct}/{attempt.totalQuestions} correct</p>
                    </div>
                    <span className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground group-hover:text-foreground">
                      {new Date(attempt.createdAt).toLocaleDateString()}
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                    </span>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <section className="flex flex-col justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center" aria-labelledby="account-links-heading">
        <div>
          <h2 id="account-links-heading" className="font-semibold text-foreground">Account shortcuts</h2>
          <p className="mt-1 text-sm text-muted-foreground">Open your saved package area or complete attempt history.</p>
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <Button asChild variant="outline" className="min-h-11 border-border bg-card">
            <Link href="/my-packages"><Gift className="mr-2 h-4 w-4" aria-hidden="true" />My Packages</Link>
          </Button>
          <Button asChild variant="outline" className="min-h-11 border-border bg-card">
            <Link href="/dashboard"><BarChart3 className="mr-2 h-4 w-4" aria-hidden="true" />My Activity</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
