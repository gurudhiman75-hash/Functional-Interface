import { useEffect, useState } from "react";
import { useLocation, useSearch } from "wouter";
import {
  ArrowLeft,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Chrome,
  Eye,
  EyeOff,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  Target,
  UserRound,
} from "lucide-react";
import { getFirebaseAuth } from "@/lib/firebase";
import {
  completeGoogleRedirectSignIn,
  createDevelopmentSession,
  signInWithGoogle,
  upsertUserProfile,
} from "@/lib/auth";
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

const FIREBASE_UNAVAILABLE_MESSAGE =
  "Firebase auth is turned off, so this screen uses a local development login instead.";

const studentBenefits = [
  {
    icon: Target,
    title: "Continue your preparation",
    description: "Return to saved tests and your current test-series progress after signing in.",
  },
  {
    icon: BarChart3,
    title: "Keep attempts connected",
    description: "Your submitted attempts, results and review history stay together in your workspace.",
  },
  {
    icon: BookOpen,
    title: "Review what you attempted",
    description: "Open saved results and explanations from your preparation dashboard.",
  },
];

export default function Login() {
  const [location, setLocation] = useLocation();
  const search = useSearch();
  const searchParams = new URLSearchParams(search);
  const nextPath = searchParams.get("next")?.trim() ?? null;
  const safeNextPath = nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : null;
  const requestedMode = searchParams.get("mode");
  const initialEmail = searchParams.get("email")?.trim() ?? "";
  const [tab, setTab] = useState<"login" | "signup">(requestedMode === "signup" ? "signup" : "login");
  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const { toast } = useToast();
  const isAdminMode = location.startsWith("/login/admin");
  const firebaseAvailable = Boolean(getFirebaseAuth());

  const passwordStrength = Math.min(
    100,
    [password.length >= 8, /[A-Z]/.test(password), /\d/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean)
      .length * 25,
  );

  useEffect(() => {
    if (isAdminMode) {
      setTab("login");
      return;
    }
    setTab(requestedMode === "signup" ? "signup" : "login");
  }, [isAdminMode, requestedMode]);

  useEffect(() => {
    if (initialEmail) setEmail(initialEmail);
  }, [initialEmail]);

  useEffect(() => {
    const auth = getFirebaseAuth();
    if (!auth) {
      return;
    }

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
        routeAfterAuth(appUser.role);
      } catch {
        routeAfterAuth();
      }
    });

    return () => unsub();
  }, [isAdminMode, safeNextPath, setLocation, toast]);

  const routeAfterAuth = (role?: string) => {
    if (isAdminMode && role && role !== "admin") {
      toast({
        title: "Admin access only",
        description: "This account is not authorized for the ExamTree admin console.",
        variant: "destructive",
      });
      setLocation("/dashboard");
      return;
    }

    const destination = safeNextPath
      ?? (role === "admin" ? "/admin/" : "/dashboard");

    if (destination === "/admin" || destination.startsWith("/admin/")) {
      window.location.assign(destination === "/admin" ? "/admin/" : destination);
      return;
    }
    setLocation(destination);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    if (tab === "signup" && !name.trim()) {
      toast({ title: "Name required", description: "Please enter your full name", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const auth = getFirebaseAuth();
      if (!auth) {
        const devUser = createDevelopmentSession({
          email,
          name: tab === "signup" ? name : undefined,
          role: isAdminMode ? "admin" : "student",
        });
        toast({
          title: tab === "signup" ? "Development account created" : "Development login successful",
          description: `Signed in locally as ${devUser.name}.`,
        });
        routeAfterAuth(devUser.role);
        return;
      }

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
        toast({
          title: appUser.role === "admin" ? "Admin access granted" : "Welcome back!",
          description: `Logged in as ${appUser.name}`,
        });
        routeAfterAuth(appUser.role);
        return;
      }
    } catch (err) {
      toast({
        title: tab === "signup" ? "Sign up failed" : "Login failed",
        description: getAuthErrorMessage(err),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      if (!getFirebaseAuth()) {
        const devUser = createDevelopmentSession({
          email: email.trim() || (isAdminMode ? "admin@local.dev" : "student@local.dev"),
          name: name.trim() || undefined,
          role: isAdminMode ? "admin" : "student",
        });
        toast({
          title: "Development login successful",
          description: `Signed in locally as ${devUser.name}.`,
        });
        routeAfterAuth(devUser.role);
        return;
      }

      const user = await signInWithGoogle();
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
      if (!auth) {
        toast({
          title: "Password reset unavailable",
          description: "Development login does not send reset emails.",
        });
        return;
      }
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

  const authTitle = isAdminMode
    ? "Admin sign in"
    : tab === "login"
      ? "Welcome to examtree"
      : "Create your ExamTree account";
  const authDescription = isAdminMode
    ? "Use an administrator account already authorized by the ExamTree backend."
    : tab === "login"
      ? "Sign in to continue your preparation workspace."
      : "Create a student account to keep your preparation connected.";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f7f8fc] text-slate-950">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_4%,rgba(108,92,241,0.12),transparent_28rem),radial-gradient(circle_at_88%_10%,rgba(139,124,246,0.09),transparent_25rem)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-white/80 to-transparent" />

      <main className="relative mx-auto grid min-h-screen w-full max-w-7xl items-center gap-6 px-4 py-8 sm:px-6 lg:grid-cols-[minmax(0,0.92fr)_minmax(430px,0.72fr)] lg:gap-10 lg:px-8 lg:py-10">
        <section className="hidden min-h-[640px] overflow-hidden rounded-[32px] border border-[#e3dff5] bg-[linear-gradient(145deg,#ffffff_0%,#f6f3ff_54%,#fbfaff_100%)] p-8 shadow-[0_24px_70px_rgba(45,42,86,0.07)] lg:flex lg:flex-col lg:justify-between xl:p-10" aria-label="ExamTree student workspace benefits">
          <div>
            <button
              type="button"
              onClick={() => setLocation("/")}
              className="et-interactive inline-flex min-h-11 items-center gap-3 rounded-xl pr-3 text-left"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#6657e8] text-lg font-black text-white shadow-[0_8px_24px_rgba(102,87,232,0.22)]">E</span>
              <span className="text-lg font-black tracking-[-0.03em] text-slate-950">EXAM<span className="text-[#6657e8]">TREE</span></span>
            </button>

            <div className="mt-14 max-w-xl">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#ded9fa] bg-white/85 px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.16em] text-[#6657e8]">
                <Sparkles className="h-3.5 w-3.5" />
                Your preparation workspace
              </div>
              <h2 className="mt-5 text-4xl font-black tracking-[-0.045em] text-slate-950 xl:text-[44px] xl:leading-[1.06]">
                Pick up your preparation exactly where you left it.
              </h2>
              <p className="mt-5 max-w-lg text-[15px] leading-7 text-slate-600">
                Sign in to reach your dashboard, saved attempts, test-series progress and submitted result reviews from one place.
              </p>
            </div>

            <div className="mt-9 grid gap-3">
              {studentBenefits.map(({ icon: Icon, title, description }) => (
                <div key={title} className="flex gap-4 rounded-2xl border border-white/90 bg-white/75 p-4 shadow-[0_8px_28px_rgba(47,43,83,0.035)] backdrop-blur-sm">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#f1eeff] text-[#6657e8]"><Icon className="h-5 w-5" /></span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-950">{title}</h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">{description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 flex items-center gap-3 rounded-2xl border border-[#e0dcf5] bg-white/70 px-4 py-3 text-xs leading-5 text-slate-500">
            <ShieldCheck className="h-5 w-5 shrink-0 text-[#6657e8]" />
            Authentication is handled through the configured ExamTree sign-in provider. Your password is not stored by this page.
          </div>
        </section>

        <section className="mx-auto w-full max-w-[520px] rounded-[28px] border border-[#e5e2f4] bg-white p-5 shadow-[0_20px_65px_rgba(42,42,74,0.07)] sm:p-7 lg:p-8" data-testid="auth-card">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setLocation("/")}
              className="et-interactive inline-flex min-h-11 items-center gap-2 rounded-xl px-1 text-sm font-semibold text-slate-600 transition hover:text-slate-950 lg:hidden"
              data-testid="btn-back"
            >
              <ArrowLeft className="h-4 w-4" />
              Home
            </button>
            <div className="ml-auto inline-flex min-h-11 items-center gap-2 rounded-full border border-[#e5e2f4] bg-[#faf9ff] px-3 text-xs font-bold text-slate-600">
              <ShieldCheck className="h-4 w-4 text-[#6657e8]" />
              {isAdminMode ? "Restricted access" : "Secure sign in"}
            </div>
          </div>

          <div className="mt-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#6657e8] text-white shadow-[0_9px_26px_rgba(102,87,232,0.2)]">
              {isAdminMode ? <ShieldCheck className="h-6 w-6" /> : tab === "signup" ? <UserRound className="h-6 w-6" /> : <BookOpen className="h-6 w-6" />}
            </div>
            <h1 className="mt-5 text-2xl font-black tracking-[-0.035em] text-slate-950 sm:text-[30px]">{authTitle}</h1>
            <p className="mt-2 text-sm leading-6 text-slate-500">{authDescription}</p>
            {safeNextPath && !isAdminMode && (
              <div className="mt-4 flex items-start gap-2 rounded-xl border border-[#e3defa] bg-[#f7f5ff] px-3 py-2.5 text-xs leading-5 text-slate-600">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-[#6657e8]" />
                After signing in, ExamTree will return you to the page you were opening.
              </div>
            )}
          </div>

          {!isAdminMode && (
            <div className="mt-6 grid grid-cols-2 gap-1 rounded-xl border border-[#e4e1ef] bg-[#f7f8fc] p-1">
              <button
                type="button"
                onClick={() => setTab("login")}
                className={`min-h-11 rounded-lg px-4 text-sm font-bold transition ${tab === "login" ? "bg-white text-slate-950 shadow-[0_3px_12px_rgba(31,35,56,0.07)]" : "text-slate-500 hover:text-slate-900"}`}
                data-testid="tab-login"
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => setTab("signup")}
                className={`min-h-11 rounded-lg px-4 text-sm font-bold transition ${tab === "signup" ? "bg-white text-slate-950 shadow-[0_3px_12px_rgba(31,35,56,0.07)]" : "text-slate-500 hover:text-slate-900"}`}
                data-testid="tab-signup"
              >
                Sign up
              </button>
            </div>
          )}

          {!isAdminMode && (
            <>
              <Button
                type="button"
                variant="outline"
                className="mt-5 h-12 w-full rounded-xl border-[#ddd9ec] bg-white text-sm font-bold text-slate-800 shadow-none hover:bg-[#faf9ff]"
                onClick={handleGoogleLogin}
                disabled={loading}
                data-testid="btn-google-login"
              >
                <Chrome className="mr-2 h-4 w-4" />
                Continue with Google
              </Button>

              <div className="my-5 flex items-center gap-3" aria-hidden="true">
                <span className="h-px flex-1 bg-[#eceaf2]" />
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">or use email</span>
                <span className="h-px flex-1 bg-[#eceaf2]" />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className={isAdminMode ? "mt-6 space-y-4" : "space-y-4"}>
            {!isAdminMode && tab === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-bold text-slate-700">Full name</Label>
                <div className="relative">
                  <UserRound className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="name"
                    type="text"
                    autoComplete="name"
                    placeholder="Enter your full name"
                    className="h-12 rounded-xl border-[#dedbe8] bg-white pl-10 text-sm focus-visible:ring-[#6657e8]"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required={tab === "signup"}
                    data-testid="input-name"
                  />
                </div>
              </div>
            )}

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs font-bold text-slate-700">Email address</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder={isAdminMode ? "Enter your admin email" : "you@example.com"}
                  className="h-12 rounded-xl border-[#dedbe8] bg-white pl-10 text-sm focus-visible:ring-[#6657e8]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="input-email"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor="password" className="text-xs font-bold text-slate-700">Password</Label>
                {tab === "login" && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="min-h-11 rounded-lg px-2 text-xs font-bold text-[#6657e8] transition hover:bg-[#f5f2ff] hover:text-[#5547d3] disabled:opacity-50"
                    disabled={loading}
                    data-testid="btn-forgot-password"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  autoComplete={tab === "signup" ? "new-password" : "current-password"}
                  placeholder={isAdminMode ? "Enter admin password" : tab === "signup" ? "Create a password" : "Enter your password"}
                  className="h-12 rounded-xl border-[#dedbe8] bg-white pl-10 pr-12 text-sm focus-visible:ring-[#6657e8]"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyUp={(e) => setCapsLockActive(e.getModifierState("CapsLock"))}
                  required
                  data-testid="input-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPass((value) => !value)}
                  className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-[#f5f2ff] hover:text-slate-700"
                  aria-label={showPass ? "Hide password" : "Show password"}
                  data-testid="btn-toggle-password"
                >
                  {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>

              {!isAdminMode && tab === "signup" && password.length > 0 && (
                <div className="pt-1">
                  <div className="flex items-center justify-between text-[10px] font-bold text-slate-400">
                    <span>Password strength</span>
                    <span>{passwordStrength >= 75 ? "Strong" : passwordStrength >= 50 ? "Good" : "Keep going"}</span>
                  </div>
                  <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full transition-all duration-300 ${passwordStrength >= 75 ? "bg-emerald-500" : passwordStrength >= 50 ? "bg-[#6657e8]" : "bg-amber-400"}`}
                      style={{ width: `${passwordStrength}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-[11px] leading-4 text-slate-400">Use 8+ characters with a mix of letters, numbers and symbols.</p>
                </div>
              )}
              {capsLockActive && <p className="text-xs font-semibold text-rose-600">Caps lock is active.</p>}
            </div>

            <Button
              type="submit"
              className="h-12 w-full rounded-xl bg-[#6657e8] text-sm font-bold text-white shadow-[0_9px_24px_rgba(102,87,232,0.18)] hover:bg-[#594bd9]"
              disabled={loading}
              data-testid="btn-submit"
            >
              {loading ? "Please wait..." : isAdminMode ? "Enter Admin Console" : tab === "login" ? "Log in to ExamTree" : "Create account"}
            </Button>
          </form>

          {isAdminMode ? (
            <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-3">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
                <div>
                  <p className="text-xs font-black uppercase tracking-[0.15em] text-amber-700">Restricted access</p>
                  <p className="mt-1.5 text-xs leading-5 text-amber-900">
                    Admin access is granted only to accounts already marked as administrators in the backend profile store.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              {tab === "signup" ? (
                <p className="mt-5 text-center text-[11px] leading-5 text-slate-400">
                  By creating an account, you agree to ExamTree&apos;s <a href="/terms-and-conditions" className="font-semibold text-slate-600 underline-offset-2 hover:underline">Terms &amp; Conditions</a> and <a href="/privacy" className="font-semibold text-slate-600 underline-offset-2 hover:underline">Privacy Policy</a>.
                </p>
              ) : (
                <p className="mt-5 text-center text-xs text-slate-500">
                  New to ExamTree? <button type="button" onClick={() => setTab("signup")} className="min-h-11 rounded-lg px-2 font-bold text-[#6657e8] hover:bg-[#f5f2ff]">Create an account</button>
                </p>
              )}
            </>
          )}

          {!firebaseAvailable && (
            <div className="mt-5 rounded-2xl border border-dashed border-[#dcd8e8] bg-[#fafafe] p-4">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-slate-500">Development mode</p>
              <p className="mt-2 text-xs leading-5 text-slate-500">{FIREBASE_UNAVAILABLE_MESSAGE}</p>
              <p className="mt-1 text-[11px] leading-5 text-slate-400">Any email and password will create a local session on this device.</p>
            </div>
          )}

          <button
            type="button"
            onClick={() => setLocation("/")}
            className="mx-auto mt-5 hidden min-h-11 items-center gap-2 rounded-xl px-3 text-sm font-semibold text-slate-500 transition hover:bg-[#f7f5ff] hover:text-slate-900 lg:flex"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
        </section>
      </main>
    </div>
  );
}
