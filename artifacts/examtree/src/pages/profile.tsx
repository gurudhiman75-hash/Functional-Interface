import { useMemo } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { getUser } from "@/lib/storage";
import { getFirebaseAuth } from "@/lib/firebase";
import { signOut } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { getAnalytics, getUserAttempts, getUserPackages } from "@/lib/data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  User,
  LogOut,
  BarChart3,
  Trophy,
  Gift,
  Clock3,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

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
      // ignore
    } finally {
      setLocation("/");
      toast({ title: "Logged out", description: "You have been signed out successfully." });
    }
  };

  if (!user) {
    return (
      <div className="et-panel-raised mx-auto w-full max-w-2xl rounded-3xl p-8 text-center sm:p-10">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary"><User className="h-7 w-7" /></span>
        <h1 className="mt-5 text-2xl font-bold tracking-tight text-foreground">Not signed in</h1>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">Please sign in to view your profile and progress.</p>
        <Button className="mt-6 min-h-11 rounded-xl px-5" onClick={() => setLocation("/login")}>Go to Login</Button>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-6">
      <section className="et-panel-raised overflow-hidden rounded-3xl border border-border/80">
        <div className="bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex min-w-0 items-center gap-4 sm:gap-5">
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-primary text-xl font-bold text-primary-foreground shadow-sm sm:h-20 sm:w-20 sm:text-2xl">
                {user.name
                  .split(" ")
                  .map((part) => part[0])
                  .slice(0, 2)
                  .join("")
                  .toUpperCase()}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">My profile</p>
                <h1 className="mt-1 truncate text-3xl font-bold tracking-tight text-foreground sm:text-4xl">{user.name}</h1>
                <p className="mt-1 truncate text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
            <Button variant="outline" className="min-h-11 w-full rounded-xl px-5 lg:w-auto" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
        <div className="grid gap-px border-t border-border/70 bg-border/70 sm:grid-cols-2">
          <div className="bg-card p-5">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Account role</p>
            <p className="mt-2 text-lg font-semibold text-foreground">{user.role ?? "Student"}</p>
          </div>
          <div className="bg-card p-5">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-muted-foreground">Account status</p>
            <p className="mt-2 inline-flex items-center gap-2 text-lg font-semibold text-foreground">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" /> Signed in
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <Card className="et-panel-raised rounded-3xl border-border/80">
            <CardHeader className="pb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Performance snapshot</p>
              <CardTitle className="text-2xl" role="heading" aria-level={2}>Activity stats</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="grid gap-4 sm:grid-cols-2" role="status" aria-label="Loading profile activity stats">
                  {[0, 1, 2, 3].map((item) => <div key={item} className="skeleton-shimmer h-28 rounded-2xl" />)}
                  <span className="sr-only">Loading profile activity stats…</span>
                </div>
              ) : error ? (
                <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-700" role="status">Unable to load activity stats. Please refresh.</div>
              ) : (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="rounded-2xl border border-border/80 bg-muted/25 p-5">
                    <div className="flex items-center gap-3 text-muted-foreground"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary"><Clock3 className="h-5 w-5" /></span><span className="text-sm">Total attempts</span></div>
                    <p className="mt-4 text-3xl font-bold tabular-nums tracking-tight text-foreground">{summary.totalAttempts}</p>
                  </div>
                  <div className="rounded-2xl border border-border/80 bg-muted/25 p-5">
                    <div className="flex items-center gap-3 text-muted-foreground"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-700"><BarChart3 className="h-5 w-5" /></span><span className="text-sm">Average score</span></div>
                    <p className="mt-4 text-3xl font-bold tabular-nums tracking-tight text-foreground">{summary.averageScore}%</p>
                  </div>
                  <div className="rounded-2xl border border-border/80 bg-muted/25 p-5">
                    <div className="flex items-center gap-3 text-muted-foreground"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700"><Trophy className="h-5 w-5" /></span><span className="text-sm">Best score</span></div>
                    <p className="mt-4 text-3xl font-bold tabular-nums tracking-tight text-foreground">{summary.bestScore}%</p>
                  </div>
                  <div className="rounded-2xl border border-border/80 bg-muted/25 p-5">
                    <div className="flex items-center gap-3 text-muted-foreground"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-700"><Gift className="h-5 w-5" /></span><span className="text-sm">Packages purchased</span></div>
                    <p className="mt-4 text-3xl font-bold tabular-nums tracking-tight text-foreground">{totalPackages}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="et-panel-raised rounded-3xl border-border/80">
            <CardHeader className="pb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Saved results</p>
              <CardTitle className="text-2xl" role="heading" aria-level={2}>Latest activity</CardTitle>
            </CardHeader>
            <CardContent>
              {attemptsLoading ? (
                <div className="space-y-3" role="status" aria-label="Loading latest activity">
                  {[0, 1, 2].map((item) => <div key={item} className="skeleton-shimmer h-24 rounded-2xl" />)}
                  <span className="sr-only">Loading latest activity…</span>
                </div>
              ) : !attempts || attempts.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-border/80 p-6 text-center text-sm text-muted-foreground">
                  <p>No attempts found yet. Start a test to build your profile stats.</p>
                  <Link href="/tests"><Button className="mt-4 min-h-11 w-full rounded-xl justify-center">Browse Tests</Button></Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {attempts.slice(0, 4).map((attempt) => {
                    const params = new URLSearchParams({ attemptId: attempt.id, testId: attempt.testId });
                    return (
                      <Link key={attempt.id} href={`/result?${params.toString()}`}>
                        <div className="group rounded-2xl border border-border/80 bg-card p-4 transition-[border-color,box-shadow,transform] hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md">
                          <div className="flex items-center justify-between gap-3">
                            <div className="min-w-0"><p className="truncate font-semibold text-foreground">{attempt.testName}</p><p className="mt-0.5 truncate text-xs text-muted-foreground">{attempt.category}</p></div>
                            <Badge className="shrink-0 rounded-lg bg-primary/10 text-primary">{attempt.score}%</Badge>
                          </div>
                          <div className="mt-3 flex items-center justify-between gap-3 text-xs text-muted-foreground">
                            <span>{attempt.correct}/{attempt.totalQuestions} correct</span>
                            <span className="inline-flex items-center gap-1">{new Date(attempt.createdAt).toLocaleDateString()}<ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                  {attempts.length > 4 ? (
                    <div className="pt-1 text-right">
                      <Link href="/dashboard"><Button variant="outline" className="min-h-11 rounded-xl px-4">View all attempts</Button></Link>
                    </div>
                  ) : null}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="et-panel rounded-3xl border-border/80">
            <CardHeader className="pb-4">
              <CardTitle role="heading" aria-level={2}>Account quick links</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href="/my-packages"><Button variant="outline" className="min-h-11 w-full justify-start rounded-xl"><Gift className="mr-2 h-4 w-4" />My Packages</Button></Link>
              <Link href="/dashboard"><Button variant="outline" className="min-h-11 w-full justify-start rounded-xl"><BarChart3 className="mr-2 h-4 w-4" />My Activity</Button></Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
