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
  BookOpen,
  User,
  LogOut,
  BarChart3,
  Trophy,
  Gift,
  Clock3,
  CheckCircle2,
} from "lucide-react";

export default function ProfilePage() {
  const [location, setLocation] = useLocation();
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
      <div className="min-h-screen bg-background p-4">
        <div className="mx-auto max-w-4xl rounded-2xl border border-border bg-card p-10 text-center shadow-sm">
          <User className="mx-auto mb-4 h-12 w-12 text-primary" />
          <h1 className="text-2xl font-semibold text-foreground">Not signed in</h1>
          <p className="mt-2 text-sm text-muted-foreground">Please sign in to view your profile and progress.</p>
          <div className="mt-6">
            <Button onClick={() => setLocation("/login")}>Go to Login</Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-6xl mx-auto p-4 md:p-6">
        <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.24em] text-muted-foreground">My Profile</p>
            <h1 className="mt-2 text-4xl font-bold text-foreground">Welcome back, {user.name}</h1>
            <p className="mt-2 text-sm text-muted-foreground">Review your progress, package history, and account details.</p>
          </div>
          <Button variant="outline" className="w-full max-w-sm justify-center lg:w-auto" onClick={handleLogout}>
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary text-2xl font-semibold">
                    {user.name
                      .split(" ")
                      .map((part) => part[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </div>
                  <div>
                    <CardTitle className="text-2xl">{user.name}</CardTitle>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">Account role</p>
                  <p className="mt-2 text-lg font-semibold text-foreground">{user.role ?? "Student"}</p>
                </div>
                <div className="rounded-2xl border border-border bg-muted/50 p-4">
                  <p className="text-sm text-muted-foreground">Member since</p>
                  <p className="mt-2 text-lg font-semibold text-foreground">{new Date().toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity Stats</CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="space-y-3">
                    <div className="h-4 rounded-full bg-muted" />
                    <div className="h-4 rounded-full bg-muted w-5/6" />
                    <div className="h-4 rounded-full bg-muted w-3/4" />
                  </div>
                ) : error ? (
                  <p className="text-sm text-destructive">Unable to load activity stats. Please refresh.</p>
                ) : (
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-2xl border border-border bg-card p-4">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Clock3 className="w-5 h-5" />
                        <span className="text-sm">Total attempts</span>
                      </div>
                      <p className="mt-4 text-3xl font-semibold text-foreground">{summary.totalAttempts}</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-4">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <BarChart3 className="w-5 h-5" />
                        <span className="text-sm">Average score</span>
                      </div>
                      <p className="mt-4 text-3xl font-semibold text-foreground">{summary.averageScore}%</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-4">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Trophy className="w-5 h-5" />
                        <span className="text-sm">Best score</span>
                      </div>
                      <p className="mt-4 text-3xl font-semibold text-foreground">{summary.bestScore}%</p>
                    </div>
                    <div className="rounded-2xl border border-border bg-card p-4">
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <Gift className="w-5 h-5" />
                        <span className="text-sm">Packages purchased</span>
                      </div>
                      <p className="mt-4 text-3xl font-semibold text-foreground">{totalPackages}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Latest activity</CardTitle>
              </CardHeader>
              <CardContent>
                {attemptsLoading ? (
                  <div className="space-y-3">
                    <div className="h-4 rounded-full bg-muted" />
                    <div className="h-4 rounded-full bg-muted w-5/6" />
                    <div className="h-4 rounded-full bg-muted w-3/4" />
                  </div>
                ) : !attempts || attempts.length === 0 ? (
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <p>No attempts found yet. Start a test to build your profile stats.</p>
                    <Link href="/tests">
                      <Button className="w-full justify-center">Browse Tests</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {attempts.slice(0, 4).map((attempt) => (
                      <div key={`${attempt.testId}-${attempt.createdAt}`} className="rounded-2xl border border-border bg-card p-4">
                        <div className="flex items-center justify-between gap-3">
                          <div>
                            <p className="font-semibold text-foreground">{attempt.testName}</p>
                            <p className="text-xs text-muted-foreground">{attempt.category}</p>
                          </div>
                          <Badge className="bg-primary/10 text-primary">{attempt.score}%</Badge>
                        </div>
                        <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                          <span>{attempt.correct}/{attempt.totalQuestions} correct</span>
                          <span>{new Date(attempt.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                    {attempts.length > 4 ? (
                      <div className="text-right">
                        <Link href="/result?testId=">
                          <Button variant="outline" className="rounded-full px-4 py-2">
                            View all attempts
                          </Button>
                        </Link>
                      </div>
                    ) : null}
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account quick links</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Link href="/my-packages">
                  <Button className="w-full justify-start rounded-xl bg-blue-600 hover:bg-blue-700">
                    <Gift className="w-4 h-4 mr-2" />
                    My Packages
                  </Button>
                </Link>
                <Link href="/performance">
                  <Button variant="outline" className="w-full justify-start rounded-xl">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Performance
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
