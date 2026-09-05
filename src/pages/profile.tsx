import { useMemo } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { signOut } from "firebase/auth";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Clock3,
  CreditCard,
  Flame,
  KeyRound,
  Languages,
  LogOut,
  Mail,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  Trophy,
  User,
  UserRound,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getAnalytics, getUserAttempts } from "@/lib/data";
import { getFirebaseAuth } from "@/lib/firebase";
import { clearAuth, getStreak, getUser } from "@/lib/storage";

function formatDate(value?: string | Date | null) {
  if (!value) return "No activity yet";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "No activity yet";
  return date.toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function ProfilePage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const user = getUser();
  const streak = getStreak();

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

  // Preserve the canonical order returned by the student attempts endpoint.
  // Result links must never be re-ranked client-side because the attempt ID is authoritative.
  const orderedAttempts = useMemo(() => [...(attempts ?? [])], [attempts]);

  const summary = useMemo(() => {
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

    return { totalAttempts, averageScore, bestScore };
  }, [analytics, attempts]);

  const focusCategories = useMemo(() => {
    const counts = new Map<string, number>();
    for (const attempt of attempts ?? []) {
      const category = attempt.category?.trim();
      if (!category) continue;
      counts.set(category, (counts.get(category) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);
  }, [attempts]);

  const firebaseUser = getFirebaseAuth()?.currentUser ?? null;
  const providerLabel = firebaseUser?.providerData?.some((provider) => provider.providerId === "google.com")
    ? "Google"
    : firebaseUser?.providerData?.some((provider) => provider.providerId === "password")
      ? "Email & password"
      : getFirebaseAuth()
        ? "ExamTree account"
        : "Development session";

  const initials = user?.name
    .split(" ")
    .map((part) => part.trim()[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();

  const handleLogout = async () => {
    const auth = getFirebaseAuth();
    try {
      if (auth) await signOut(auth);
    } catch {
      // Navigation remains available if provider cleanup fails.
    } finally {
      clearAuth();
      setLocation("/");
      toast({ title: "Logged out", description: "You have been signed out successfully." });
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background px-4 py-10 sm:px-6">
        <div className="mx-auto max-w-2xl rounded-[28px] border border-border bg-card p-7 text-center shadow-[0_18px_55px_rgba(44,42,76,0.07)] sm:p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f1eeff] text-[#6657e8] dark:bg-violet-950/50 dark:text-violet-300">
            <User className="h-6 w-6" />
          </div>
          <p className="mt-5 text-xs font-black uppercase tracking-[0.18em] text-[#6657e8] dark:text-violet-300">My account</p>
          <h1 className="mt-2 text-2xl font-black tracking-[-0.03em] text-foreground">Not signed in</h1>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            Sign in to view your account details, saved attempts and preparation summary.
          </p>
          <Button className="mt-6 rounded-xl bg-[#6657e8] px-6 font-bold text-white hover:bg-[#594bd9]" onClick={() => setLocation("/login/student")}>
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  const latestAttempt = orderedAttempts[0];
  const isLoading = analyticsLoading || attemptsLoading;
  const error = analyticsError || attemptsError;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <section className="overflow-hidden rounded-[30px] border border-[#e3dff5] bg-[linear-gradient(135deg,#ffffff_0%,#f4f1ff_58%,#faf9ff_100%)] shadow-[0_20px_60px_rgba(45,42,86,0.06)] dark:border-border dark:bg-none dark:bg-card">
          <div className="grid gap-6 p-6 sm:p-8 lg:grid-cols-[1fr_auto] lg:items-center">
            <div className="flex min-w-0 items-start gap-4 sm:items-center sm:gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-[#6657e8] text-xl font-black text-white shadow-[0_10px_26px_rgba(102,87,232,0.2)] sm:h-20 sm:w-20 sm:text-2xl">
                {initials || "ET"}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ded9fa] bg-white/80 px-2.5 py-1 text-[10px] font-black uppercase tracking-[0.14em] text-[#6657e8] dark:border-violet-800/70 dark:bg-violet-950/30 dark:text-violet-300">
                    <Sparkles className="h-3 w-3" />
                    My account
                  </span>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-1 text-[10px] font-bold text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300">
                    <CheckCircle2 className="h-3 w-3" />
                    Account status: Signed in
                  </span>
                </div>
                <h1 className="mt-3 truncate text-2xl font-black tracking-[-0.04em] text-foreground sm:text-3xl">Welcome back, {user.name}</h1>
                <p className="mt-1 truncate text-sm text-muted-foreground">{user.email}</p>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-muted-foreground">
                  Review your saved attempts, package history, and account details.
                </p>
              </div>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row lg:flex-col xl:flex-row">
              <Link href="/exams" className="et-interactive inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#6657e8] px-4 text-sm font-bold text-white shadow-[0_8px_22px_rgba(102,87,232,0.16)] hover:bg-[#594bd9]">
                <BookOpen className="h-4 w-4" />
                Browse tests
              </Link>
              <Button variant="outline" className="rounded-xl" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Log out
              </Button>
            </div>
          </div>
        </section>

        <section className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4" aria-label="Preparation summary">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-32 animate-pulse rounded-2xl border border-border bg-card" />
            ))
          ) : error ? (
            <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-5 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-300 sm:col-span-2 xl:col-span-4">
              We could not load your preparation summary right now. Your account details are still available below.
            </div>
          ) : (
            <>
              <div className="rounded-2xl border border-border bg-card p-4 shadow-[0_8px_28px_rgba(47,43,83,0.035)]">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f1eeff] text-[#6657e8] dark:bg-violet-950/50 dark:text-violet-300"><Clock3 className="h-4.5 w-4.5" /></span>
                  <span className="text-[10px] font-black uppercase tracking-[0.13em] text-muted-foreground">Attempts</span>
                </div>
                <p className="mt-4 text-3xl font-black tracking-[-0.04em] text-foreground">{summary.totalAttempts}</p>
                <p className="mt-1 text-xs text-muted-foreground">Submitted test attempts</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 shadow-[0_8px_28px_rgba(47,43,83,0.035)]">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300"><BarChart3 className="h-4.5 w-4.5" /></span>
                  <span className="text-[10px] font-black uppercase tracking-[0.13em] text-muted-foreground">Average</span>
                </div>
                <p className="mt-4 text-3xl font-black tracking-[-0.04em] text-foreground">{summary.averageScore}%</p>
                <p className="mt-1 text-xs text-muted-foreground">Across saved attempts</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 shadow-[0_8px_28px_rgba(47,43,83,0.035)]">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"><Trophy className="h-4.5 w-4.5" /></span>
                  <span className="text-[10px] font-black uppercase tracking-[0.13em] text-muted-foreground">Best</span>
                </div>
                <p className="mt-4 text-3xl font-black tracking-[-0.04em] text-foreground">{summary.bestScore}%</p>
                <p className="mt-1 text-xs text-muted-foreground">Highest saved score</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-4 shadow-[0_8px_28px_rgba(47,43,83,0.035)]">
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-300"><Flame className="h-4.5 w-4.5" /></span>
                  <span className="text-[10px] font-black uppercase tracking-[0.13em] text-muted-foreground">Streak</span>
                </div>
                <p className="mt-4 text-3xl font-black tracking-[-0.04em] text-foreground">{streak.currentStreak}</p>
                <p className="mt-1 text-xs text-muted-foreground">Current real-test streak</p>
              </div>
            </>
          )}
        </section>

        <div className="mt-5 grid gap-5 xl:grid-cols-[minmax(0,1.12fr)_minmax(340px,0.88fr)]">
          <div className="space-y-5">
            <section className="rounded-[26px] border border-border bg-card p-5 shadow-[0_12px_38px_rgba(47,43,83,0.04)] sm:p-6">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6657e8] dark:text-violet-300">Preparation profile</p>
                  <h2 className="mt-1 text-xl font-black tracking-[-0.025em] text-foreground">What your recent attempts show</h2>
                </div>
                <Link href="/dashboard" className="et-interactive inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-bold text-[#6657e8] hover:bg-[#f5f2ff] dark:text-violet-300 dark:hover:bg-violet-950/30">
                  My activity <ArrowRight className="h-4 w-4" />
                </Link>
              </div>

              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-border bg-muted/30 p-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <Target className="h-4 w-4 text-[#6657e8] dark:text-violet-300" />
                    Preparation focus
                  </div>
                  {focusCategories.length > 0 ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {focusCategories.map(([category, count]) => (
                        <Badge key={category} variant="outline" className="rounded-full bg-background px-3 py-1 text-xs font-semibold text-foreground">
                          {category} · {count} {count === 1 ? "attempt" : "attempts"}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="mt-3 text-sm leading-6 text-muted-foreground">Complete a test and your most-practised exam areas will appear here.</p>
                  )}
                </div>

                <div className="rounded-2xl border border-border bg-muted/30 p-4">
                  <div className="flex items-center gap-2 text-sm font-bold text-foreground">
                    <Languages className="h-4 w-4 text-[#6657e8] dark:text-violet-300" />
                    Test language
                  </div>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    Language availability follows each published test, so you can use the supported language options where they are provided.
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-[#e4dff8] bg-[#f7f5ff] p-4 dark:border-violet-900/60 dark:bg-violet-950/20">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-xs font-bold text-[#6657e8] dark:text-violet-300">Latest saved activity</p>
                    <p className="mt-1 text-sm font-bold text-foreground">{latestAttempt?.testName ?? "No submitted attempt yet"}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {latestAttempt ? `${latestAttempt.score}% · ${formatDate(latestAttempt.createdAt)}` : "Start a published test to begin building your preparation history."}
                    </p>
                  </div>
                  <Link href="/exams" className="et-interactive inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-[#dcd6f8] bg-background px-3 text-xs font-bold text-[#6657e8] hover:bg-[#fbfaff] dark:border-violet-900/60 dark:text-violet-300 dark:hover:bg-violet-950/30">
                    Find a test <BookOpen className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </section>

            <section className="rounded-[26px] border border-border bg-card p-5 shadow-[0_12px_38px_rgba(47,43,83,0.04)] sm:p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6657e8] dark:text-violet-300">Recent results</p>
                  <h2 className="mt-1 text-xl font-black tracking-[-0.025em] text-foreground">Latest attempts</h2>
                </div>
                {orderedAttempts.length > 0 && <span className="text-xs text-muted-foreground">Showing up to 4</span>}
              </div>

              {attemptsLoading ? (
                <div className="mt-5 space-y-3">
                  {Array.from({ length: 3 }).map((_, index) => <div key={index} className="h-20 animate-pulse rounded-2xl bg-muted" />)}
                </div>
              ) : orderedAttempts.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-border bg-muted/30 p-6 text-center">
                  <BookOpen className="mx-auto h-6 w-6 text-[#6657e8] dark:text-violet-300" />
                  <p className="mt-3 text-sm font-bold text-foreground">No attempts yet</p>
                  <p className="mt-1 text-xs leading-5 text-muted-foreground">Your submitted tests will appear here with direct links to their saved results.</p>
                </div>
              ) : (
                <div className="mt-5 space-y-2.5">
                  {orderedAttempts.slice(0, 4).map((attempt) => {
                    const params = new URLSearchParams({ attemptId: attempt.id, testId: attempt.testId });
                    return (
                      <Link key={attempt.id} href={`/result?${params.toString()}`}>
                        <div className="group flex flex-col gap-3 rounded-2xl border border-border bg-background p-4 transition hover:border-[#d9d3f6] hover:bg-[#fcfbff] dark:hover:border-violet-900 dark:hover:bg-violet-950/20 sm:flex-row sm:items-center sm:justify-between">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-foreground">{attempt.testName}</p>
                            <p className="mt-1 text-xs text-muted-foreground">{attempt.category} · {formatDate(attempt.createdAt)}</p>
                          </div>
                          <div className="flex shrink-0 items-center gap-3">
                            <div className="text-right">
                              <p className="text-sm font-black text-foreground">{attempt.score}%</p>
                              <p className="text-[10px] text-muted-foreground">{attempt.correct}/{attempt.totalQuestions} correct</p>
                            </div>
                            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#f3f0ff] text-[#6657e8] transition group-hover:translate-x-0.5 dark:bg-violet-950/40 dark:text-violet-300"><ArrowRight className="h-4 w-4" /></span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {orderedAttempts.length > 4 && (
                <Link href="/dashboard" className="et-interactive mt-4 inline-flex min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-bold text-[#6657e8] hover:bg-[#f5f2ff] dark:text-violet-300 dark:hover:bg-violet-950/30">
                  View all attempts <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </section>
          </div>

          <div className="space-y-5">
            <section className="rounded-[26px] border border-border bg-card p-5 shadow-[0_12px_38px_rgba(47,43,83,0.04)] sm:p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6657e8] dark:text-violet-300">Personal details</p>
              <h2 className="mt-1 text-xl font-black tracking-[-0.025em] text-foreground">Account identity</h2>

              <div className="mt-5 space-y-3">
                <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/30 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background text-[#6657e8] dark:text-violet-300"><UserRound className="h-4.5 w-4.5" /></span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.13em] text-muted-foreground">Name</p>
                    <p className="mt-1 truncate text-sm font-bold text-foreground">{user.name}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/30 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background text-[#6657e8] dark:text-violet-300"><Mail className="h-4.5 w-4.5" /></span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-[0.13em] text-muted-foreground">Email</p>
                    <p className="mt-1 break-all text-sm font-bold text-foreground">{user.email}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 rounded-2xl border border-border bg-muted/30 p-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background text-[#6657e8] dark:text-violet-300"><ShieldCheck className="h-4.5 w-4.5" /></span>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.13em] text-muted-foreground">Sign-in method</p>
                    <p className="mt-1 text-sm font-bold text-foreground">{providerLabel}</p>
                    <p className="mt-1 text-xs text-muted-foreground">Role: {user.role ?? "student"}</p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs leading-5 text-muted-foreground">
                Profile editing is not exposed until the canonical account-update flow is available. This page only displays saved account identity.
              </p>
            </section>

            <section className="rounded-[26px] border border-border bg-card p-5 shadow-[0_12px_38px_rgba(47,43,83,0.04)] sm:p-6">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#6657e8] dark:text-violet-300">Security & recovery</p>
              <h2 className="mt-1 text-xl font-black tracking-[-0.025em] text-foreground">Manage account access</h2>

              <div className="mt-4 space-y-2">
                <Link href="/account-recovery" className="et-interactive flex min-h-14 items-center gap-3 rounded-2xl border border-border px-4 transition hover:border-[#dad4f6] hover:bg-[#faf9ff] dark:hover:border-violet-900 dark:hover:bg-violet-950/20">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f1eeff] text-[#6657e8] dark:bg-violet-950/40 dark:text-violet-300"><KeyRound className="h-4.5 w-4.5" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-foreground">Password & account recovery</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">Reset access or recover an unavailable account.</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>

                <Link href="/account-deletion" className="et-interactive flex min-h-14 items-center gap-3 rounded-2xl border border-border px-4 transition hover:border-rose-200 hover:bg-rose-50/40 dark:hover:border-rose-900 dark:hover:bg-rose-950/20">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/40 dark:text-rose-300"><Trash2 className="h-4.5 w-4.5" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-bold text-foreground">Delete account</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">Open the account-deletion flow and review its consequences.</span>
                  </span>
                  <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                </Link>
              </div>
            </section>

            <section className="rounded-[26px] border border-border bg-card p-5 shadow-[0_12px_38px_rgba(47,43,83,0.04)] sm:p-6">
              <div className="flex items-start gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#f1eeff] text-[#6657e8] dark:bg-violet-950/40 dark:text-violet-300"><CreditCard className="h-4.5 w-4.5" /></span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-sm font-black text-foreground">Purchases & access</h2>
                    <Badge variant="outline" className="rounded-full border-[#ddd7fb] bg-[#f8f6ff] text-[10px] font-bold text-[#6657e8] dark:border-violet-900/60 dark:bg-violet-950/30 dark:text-violet-300">Canonical history</Badge>
                  </div>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    Review your server-recorded orders, processed refunds, and the package access currently attached to this account.
                  </p>
                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <Link href="/my-packages" className="et-interactive inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-[#6657e8] px-4 text-xs font-bold text-white shadow-sm hover:bg-[#594bd9]">
                      My purchases <ArrowRight className="h-4 w-4" />
                    </Link>
                    <Link href="/store" className="et-interactive inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background px-4 text-xs font-bold text-foreground hover:bg-muted">
                      Browse Store <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
