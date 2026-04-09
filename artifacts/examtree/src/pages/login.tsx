import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import {
  BookOpen,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ShieldCheck,
  GraduationCap,
  Sparkles,
  KeyRound,
  UserPlus,
} from "lucide-react";
import { getFirebaseAuth } from "@/lib/firebase";
import { completeGoogleRedirectSignIn, signInWithGoogle, upsertUserProfile } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";

function getAuthErrorMessage(error: unknown): string {
  const code =
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    typeof (error as { code?: unknown }).code === "string"
      ? (error as { code: string }).code
      : "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
      return "Invalid email or password.";
    case "auth/user-not-found":
      return "No account found with this email.";
    case "auth/email-already-in-use":
      return "This email is already registered. Try logging in.";
    case "auth/weak-password":
      return "Password is too weak. Use at least 6 characters.";
    case "auth/popup-closed-by-user":
      return "Google login was cancelled.";
    case "auth/popup-blocked":
      return "Popup was blocked by browser.";
    case "auth/unauthorized-domain":
      return "This domain is not authorized in Firebase Authentication settings.";
    case "auth/operation-not-allowed":
      return "Google provider is disabled in Firebase Authentication.";
    default:
      return error instanceof Error ? error.message : "Authentication failed.";
  }
}

type AuthMode = "student" | "admin";

export default function Login() {
  const [location, setLocation] = useLocation();
  const mode: AuthMode = location.startsWith("/login/admin") ? "admin" : "student";
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const isAdminMode = mode === "admin";

  useEffect(() => {
    if (isAdminMode) {
      setTab("login");
    }
  }, [isAdminMode]);

  useEffect(() => {
    const auth = getFirebaseAuth();
    void completeGoogleRedirectSignIn()
      .then((user) => {
        if (!user) return;
        if (isAdminMode && user.role !== "admin") {
          toast({
            title: "Admin access only",
            description: "That Google account is not an admin account.",
            variant: "destructive",
          });
          setLocation("/dashboard");
          return;
        }
        toast({
          title: "Welcome!",
          description: `Signed in as ${user.name}`,
        });
      })
      .catch((err) => {
        toast({
          title: "Google sign-in failed",
          description: getAuthErrorMessage(err),
          variant: "destructive",
        });
      });

    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) return;
      try {
        const appUser = await upsertUserProfile(firebaseUser);
        setLocation(appUser.role === "admin" ? "/admin" : "/dashboard");
      } catch {
        setLocation(isAdminMode ? "/admin" : "/dashboard");
      }
    });

    return () => unsub();
  }, [isAdminMode, setLocation, toast]);

  const routeAfterAuth = (role?: string) => {
    setLocation(role === "admin" ? "/admin" : "/dashboard");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (tab === "signup" && !name.trim()) {
      toast({ title: "Name required", description: "Please enter your full name", variant: "destructive" });
      return;
    }
    if (isAdminMode && email.trim().toLowerCase() !== "admin@examtree.com") {
      toast({
        title: "Admin email required",
        description: "Use the configured admin email to access the admin console.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const auth = getFirebaseAuth();

      if (tab === "signup") {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (cred.user) {
          const displayName = name.trim();
          await updateProfile(cred.user, { displayName });
          const appUser = await upsertUserProfile(cred.user);
          toast({ title: "Account created!", description: `Logged in as ${displayName}` });
          routeAfterAuth(appUser.role);
          return;
        }
      } else {
        const cred = await signInWithEmailAndPassword(auth, email, password);
        const appUser = await upsertUserProfile(cred.user);
        if (isAdminMode && appUser.role !== "admin") {
          toast({
            title: "Access denied",
            description: "This account does not have admin permissions.",
            variant: "destructive",
          });
          return;
        }
        toast({
          title: appUser.role === "admin" ? "Admin access granted" : "Welcome back!",
          description: `Logged in as ${appUser.name}`,
        });
        routeAfterAuth(appUser.role);
        return;
      }
    } catch (err) {
      toast({ title: "Login failed", description: getAuthErrorMessage(err), variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      if (isAdminMode && user.role !== "admin") {
        toast({
          title: "Admin access only",
          description: "That Google account is not an admin account.",
          variant: "destructive",
        });
        return;
      }
      toast({
        title: tab === "signup" ? "Account created!" : "Welcome back!",
        description: `Signed in as ${user.name}`,
      });
      routeAfterAuth(user.role);
    } catch (err) {
      toast({
        title: "Google sign-in failed",
        description: getAuthErrorMessage(err),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email.trim()) {
      toast({
        title: "Enter your email first",
        description: "Type your account email, then click Forgot password.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const auth = getFirebaseAuth();
      await sendPasswordResetEmail(auth, email.trim());
      toast({
        title: "Reset email sent",
        description: "Check your inbox for password reset instructions.",
      });
    } catch (err) {
      toast({
        title: "Could not send reset email",
        description: getAuthErrorMessage(err),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      <div className="absolute inset-0 aurora-bg" />
      <div className="relative mx-auto grid min-h-screen max-w-6xl items-center gap-10 px-4 py-8 sm:px-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-8">
        <section className="glass-panel rounded-[2rem] border border-white/60 p-8 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.55)] lg:p-10">
          <div className="mb-8 flex items-start justify-between gap-4">
            <div>
              <p className={`text-xs font-semibold uppercase tracking-[0.3em] ${isAdminMode ? "text-amber-700" : "text-primary/80"}`}>
                {isAdminMode ? "Admin Console" : "Student Portal"}
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-foreground">
                {isAdminMode ? "Secure admin access" : "Practice smarter every day"}
              </h1>
              <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
                {isAdminMode
                  ? "Use the admin credentials to manage tests, sections, and question banks from a dedicated workspace."
                  : "Sign in to continue mock tests, review recent attempts, and keep your preparation streak moving."}
              </p>
            </div>
            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-[1.5rem] ${isAdminMode ? "bg-amber-100 text-amber-700" : "bg-primary/10 text-primary"}`}>
              {isAdminMode ? <ShieldCheck className="w-7 h-7" /> : <GraduationCap className="w-7 h-7" />}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {(isAdminMode
              ? [
                  { icon: <KeyRound className="w-4 h-4" />, title: "Dedicated entry", desc: "Separate login path for admin users." },
                  { icon: <ShieldCheck className="w-4 h-4" />, title: "Role guard", desc: "Non-admin accounts stay out of the console." },
                  { icon: <Sparkles className="w-4 h-4" />, title: "Faster ops", desc: "Jump straight into test management." },
                ]
              : [
                  { icon: <GraduationCap className="w-4 h-4" />, title: "Exam-ready", desc: "Mock tests with a clearer interface." },
                  { icon: <BookOpen className="w-4 h-4" />, title: "Progress view", desc: "Dashboard and attempts in one flow." },
                  { icon: <UserPlus className="w-4 h-4" />, title: "Easy onboarding", desc: "Sign up or continue with Google." },
                ]).map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/60 bg-white/70 p-4 shadow-sm">
                <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${isAdminMode ? "bg-amber-100 text-amber-700" : "bg-primary/10 text-primary"}`}>
                  {item.icon}
                </div>
                <p className="text-sm font-semibold text-foreground">{item.title}</p>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 rounded-[1.75rem] border border-white/60 bg-slate-950 p-6 text-white shadow-lg">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/55">
              {isAdminMode ? "Admin readiness" : "Student momentum"}
            </p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {(isAdminMode
                ? [
                    { title: "Manage tests", value: "Create and organize categories, sections, and timing rules." },
                    { title: "Question ops", value: "Upload, review, and maintain the question bank faster." },
                  ]
                : [
                    { title: "Mock practice", value: "Start tests quickly and keep navigation focused." },
                    { title: "Review flow", value: "Track answers, flags, and timing with less friction." },
                  ]).map((item) => (
                <div key={item.title} className="rounded-2xl bg-white/8 p-4">
                  <p className="text-sm font-semibold text-white">{item.title}</p>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="glass-panel rounded-[2rem] border border-white/60 p-8 shadow-[0_30px_90px_-45px_rgba(15,23,42,0.55)]">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${isAdminMode ? "bg-amber-100 text-amber-700" : "bg-primary/10 text-primary"}`}>
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">{isAdminMode ? "Admin Sign In" : "Student Access"}</h2>
                <p className="text-sm text-muted-foreground">{isAdminMode ? "Restricted role-based login" : "Login or create a new account"}</p>
              </div>
            </div>
            {!isAdminMode ? null : <div className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Restricted</div>}
          </div>

          {!isAdminMode && (
            <div className="mb-6 flex rounded-2xl border border-white/70 bg-white/70 p-1.5">
              <button
                onClick={() => setTab("login")}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${tab === "login" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
                data-testid="tab-login"
              >
                Login
              </button>
              <button
                onClick={() => setTab("signup")}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold transition-all ${tab === "signup" ? "bg-card text-foreground shadow-sm" : "text-muted-foreground"}`}
                data-testid="tab-signup"
              >
                Sign Up
              </button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isAdminMode && tab === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required={tab === "signup"}
                  data-testid="input-name"
                />
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder={isAdminMode ? "admin@examtree.com" : "you@example.com"}
                  className="pl-10"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="input-email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  placeholder={isAdminMode ? "Enter admin password" : "Enter password"}
                  className="pl-10 pr-10"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  data-testid="btn-toggle-password"
                >
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {tab === "login" && (
              <div className="flex justify-end -mt-1">
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-xs text-primary hover:underline disabled:opacity-50"
                  disabled={loading}
                  data-testid="btn-forgot-password"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <Button type="submit" className="w-full rounded-2xl py-6 text-sm shadow-[0_20px_40px_-24px_hsl(var(--primary)/0.8)]" disabled={loading} data-testid="btn-submit">
              {loading ? "Please wait..." : isAdminMode ? "Enter Admin Console" : tab === "login" ? "Login to Account" : "Create Account"}
            </Button>
            {!isAdminMode && (
              <Button
                type="button"
                variant="outline"
                className="w-full rounded-2xl py-6 bg-white/75"
                onClick={handleGoogleLogin}
                disabled={loading}
                data-testid="btn-google-login"
              >
                {tab === "signup" ? "Sign Up with Google" : "Continue with Google"}
              </Button>
            )}
          </form>

          {isAdminMode ? (
            <div className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Restricted Access</p>
              <p className="mt-2 text-sm text-amber-900">
                Admin access is granted only to accounts already marked as administrators in the backend profile store.
              </p>
            </div>
          ) : (
            <div className="mt-6 rounded-2xl border border-primary/10 bg-primary/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary/80">Student benefits</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl bg-white/70 p-4">
                  <p className="text-sm font-semibold text-foreground">Start faster</p>
                  <p className="mt-1 text-xs text-muted-foreground">Google sign-in or email signup keeps onboarding simple.</p>
                </div>
                <div className="rounded-2xl bg-white/70 p-4">
                  <p className="text-sm font-semibold text-foreground">Stay focused</p>
                  <p className="mt-1 text-xs text-muted-foreground">Cleaner navigation across tests, dashboard, and results.</p>
                </div>
              </div>
            </div>
          )}

          <button
            onClick={() => setLocation("/")}
            className="mx-auto mt-6 flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
            data-testid="btn-back"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>
        </section>
      </div>
    </div>
  );
}
