import { useEffect, useState } from "react";
import { useLocation, useSearch } from "wouter";
import {
  BookOpen,
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  Apple,
  Chrome,
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

export default function Login() {
  const [location, setLocation] = useLocation();
  const search = useSearch();
  const nextPath = new URLSearchParams(search).get("next");
  const [tab, setTab] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [capsLockActive, setCapsLockActive] = useState(false);
  const { toast } = useToast();
  const isAdminMode = false;

  const passwordStrength = Math.min(
    100,
    [password.length >= 8, /[A-Z]/.test(password), /\d/.test(password), /[^A-Za-z0-9]/.test(password)].filter(Boolean)
      .length * 25,
  );

  useEffect(() => {
    if (isAdminMode) {
      setTab("login");
    }
  }, [isAdminMode]);

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
  }, [isAdminMode, setLocation, toast]);

  const routeAfterAuth = (role?: string) => {
    if (nextPath) {
      setLocation(decodeURIComponent(nextPath));
    } else {
      setLocation(role === "admin" ? "/admin" : "/dashboard");
    }
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
          role: "student",
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
      toast({ title: "Login failed", description: getAuthErrorMessage(err), variant: "destructive" });
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

  return (
    <div className="relative min-h-screen overflow-hidden bg-zinc-50 dark:bg-slate-950">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(79,70,229,0.14),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(15,23,42,0.10),transparent_25%),linear-gradient(180deg,rgba(255,255,255,0.8),rgba(250,250,250,1))] dark:bg-[radial-gradient(circle_at_20%_10%,rgba(99,102,241,0.18),transparent_28%),radial-gradient(circle_at_80%_0%,rgba(16,185,129,0.10),transparent_25%),linear-gradient(180deg,#020617,#020617)]" />
      <div className="relative mx-auto flex min-h-screen max-w-md items-center px-4 py-10">
        <section className="w-full rounded-md border border-zinc-200 bg-white p-7 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md border border-indigo-500/25 bg-indigo-600 text-white">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-semibold tracking-tight text-foreground">Welcome to examtree</h1>
                <p className="text-sm text-muted-foreground">Continue your exam workspace</p>
              </div>
            </div>
          </div>

          {!isAdminMode && (
            <div className="mb-6 flex rounded-md border border-zinc-200 bg-zinc-50 p-1 dark:border-slate-800 dark:bg-slate-950">
              <button
                onClick={() => setTab("login")}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition ${tab === "login" ? "bg-white text-foreground shadow-sm dark:bg-slate-900" : "text-muted-foreground"}`}
                data-testid="tab-login"
              >
                Login
              </button>
              <button
                onClick={() => setTab("signup")}
                className={`flex-1 rounded-md px-4 py-2 text-sm font-semibold transition ${tab === "signup" ? "bg-white text-foreground shadow-sm dark:bg-slate-900" : "text-muted-foreground"}`}
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
                  placeholder={isAdminMode ? "Enter your admin email" : "you@example.com"}
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
                  onKeyUp={(e) => setCapsLockActive(e.getModifierState("CapsLock"))}
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
                <div className="absolute inset-x-0 bottom-0 h-0.5 overflow-hidden rounded-b-md bg-zinc-200 dark:bg-slate-800">
                  <div
                    className={`h-full transition-all duration-300 ${
                      capsLockActive ? "bg-rose-500" : passwordStrength >= 75 ? "bg-emerald-500" : "bg-indigo-600"
                    }`}
                    style={{ width: `${password ? passwordStrength : 0}%` }}
                  />
                </div>
              </div>
              {capsLockActive && <p className="text-xs font-medium text-rose-500">Caps lock is active.</p>}
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

            <Button type="submit" className="w-full rounded-md bg-indigo-600 py-5 text-sm font-semibold text-white hover:bg-indigo-700" disabled={loading} data-testid="btn-submit">
              {loading ? "Please wait..." : isAdminMode ? "Enter Admin Console" : tab === "login" ? "Login to Account" : "Create Account"}
            </Button>
            {!isAdminMode && (
              <div className="grid grid-cols-2 gap-3">
                <Button
                  type="button"
                  variant="outline"
                  className="rounded-md py-5"
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  data-testid="btn-google-login"
                >
                  <Chrome className="mr-2 h-4 w-4" />
                  Google
                </Button>
                <Button type="button" variant="outline" className="rounded-md py-5" disabled>
                  <Apple className="mr-2 h-4 w-4" />
                  Apple
                </Button>
              </div>
            )}
          </form>

          {isAdminMode ? (
            <div className="mt-6 rounded-md border border-amber-200 bg-amber-50 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-amber-700">Restricted Access</p>
              <p className="mt-2 text-sm text-amber-900">
                Admin access is granted only to accounts already marked as administrators in the backend profile store.
              </p>
            </div>
          ) : (
            <div className="mt-6 rounded-md border border-indigo-500/15 bg-indigo-500/5 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-indigo-600">Workspace access</p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                <div className="rounded-md bg-white p-3 dark:bg-slate-950">
                  <p className="text-sm font-semibold text-foreground">Concept Mastery</p>
                  <p className="mt-1 text-xs text-muted-foreground">Resume your latest logic pattern quickly.</p>
                </div>
                <div className="rounded-md bg-white p-3 dark:bg-slate-950">
                  <p className="text-sm font-semibold text-foreground">Practice History</p>
                  <p className="mt-1 text-xs text-muted-foreground">Keep attempts and results connected.</p>
                </div>
              </div>
            </div>
          )}

          {!getFirebaseAuth() && (
            <div className="mt-6 rounded-md border border-dashed border-border bg-muted/40 p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                Development mode
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{FIREBASE_UNAVAILABLE_MESSAGE}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Any email and password will create a local session on this device.
              </p>
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
