import { useEffect, useRef, useState } from "react";
import "@/styles/login-notebook.css";
import { useLocation, useSearch } from "wouter";
import {
  CheckCircle2,
  Eye,
  EyeOff,
  ShieldCheck,
} from "lucide-react";
import { getPreparationPreferences } from "@/lib/preparation";
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
import { usePageMeta } from "@/components/PublicPage";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
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
  const loginRoot = useRef<HTMLDivElement>(null);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  useEffect(() => {
    const viewport = window.visualViewport;
    let baseline = Math.max(window.innerHeight, viewport?.height ?? 0);
    let frame = 0;
    const update = () => {
      const height = viewport?.height ?? window.innerHeight;
      const active = document.activeElement;
      const inputFocused = active instanceof HTMLInputElement && Boolean(loginRoot.current?.contains(active));
      if (!inputFocused) baseline = Math.max(baseline, height);
      const open = inputFocused && baseline - height > 120;
      setKeyboardOpen(open);
      cancelAnimationFrame(frame);
      if (open) frame = requestAnimationFrame(() => active?.scrollIntoView({ block: "center", behavior: "auto" }));
    };
    viewport?.addEventListener("resize", update);
    window.addEventListener("resize", update);
    document.addEventListener("focusin", update);
    document.addEventListener("focusout", update);
    return () => {
      cancelAnimationFrame(frame);
      viewport?.removeEventListener("resize", update);
      window.removeEventListener("resize", update);
      document.removeEventListener("focusin", update);
      document.removeEventListener("focusout", update);
    };
  }, []);
  const isAdminMode = location.startsWith("/login/admin");
  const firebaseAvailable = Boolean(getFirebaseAuth());
  // This standalone route bypasses PublicLayout, so apply private-page SEO here.
  usePageMeta("ExamTree Account", "Sign in securely to your ExamTree learner account.", {
    robots: "noindex,follow",
    canonicalPath: isAdminMode ? "/login/admin" : "/login/student",
  });

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
        // Stay on login when canonical account provisioning fails.
      }
    });

    return () => unsub();
  }, [isAdminMode, safeNextPath, setLocation, toast]);

  const routeAfterAuth = async (role?: string) => {
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
    if (role === "student" && getFirebaseAuth()) {
      try {
        const preferences = await getPreparationPreferences();
        if (!preferences.onboardingCompleted) {
          setLocation(`/preparation?next=${encodeURIComponent(destination)}`);
          return;
        }
      } catch {
        setLocation(`/preparation?next=${encodeURIComponent(destination)}`);
        return;
      }
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

  const handleForgotPassword = () => {
    const params = new URLSearchParams();
    if (email.trim()) params.set("email", email.trim());
    if (safeNextPath) params.set("next", safeNextPath);
    setLocation("/account-recovery" + (params.size ? "?" + params.toString() : ""));
  };

  const authTitle = isAdminMode
    ? "Admin sign in"
    : tab === "login"
      ? "Log in"
      : "Create an account";
  const authDescription = isAdminMode
    ? "Use an administrator account already authorized by the ExamTree backend."
    : tab === "login"
      ? "Welcome back to Examtree"
      : "Start your preparation with Examtree";

  return (
    <div ref={loginRoot} className={`notebook-login centered-login ${tab === "signup" ? "auth-signup" : ""} ${keyboardOpen ? "auth-keyboard-open" : ""}`}>
      <header className="notebook-topbar">
        <a href="/" className="notebook-brand">Examtree</a>
        <button type="button" onClick={() => setLocation("/")} data-testid="btn-back">Back to home</button>
      </header>
      <main className="notebook-stage" id="main-content">
        <div className="notebook-book">
        <section className="notebook-form" data-testid="auth-card">
          <div className="auth-intro">
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
            <>
              <Button
                type="button"
                variant="outline"
                className="mt-5 h-12 w-full rounded-xl border-[#ddd9ec] bg-white text-sm font-bold text-slate-800 shadow-none hover:bg-[#faf9ff]"
                onClick={handleGoogleLogin}
                disabled={loading}
                data-testid="btn-google-login"
              >
                <svg className="mr-2 h-5 w-5" viewBox="0 0 48 48" aria-hidden="true"><path fill="#4285F4" d="M43.6 24.5c0-1.4-.1-2.8-.4-4.1H24v7.8h11a9.4 9.4 0 0 1-4.1 6.2v5h6.6c3.9-3.6 6.1-8.8 6.1-14.9Z"/><path fill="#34A853" d="M24 44c5.5 0 10.1-1.8 13.5-4.9l-6.6-5c-1.8 1.2-4.1 2-6.9 2-5.3 0-9.8-3.6-11.4-8.4H5.8v5.2A20 20 0 0 0 24 44Z"/><path fill="#FBBC05" d="M12.6 27.7a12 12 0 0 1 0-7.4v-5.2H5.8a20 20 0 0 0 0 17.8Z"/><path fill="#EA4335" d="M24 11.9c3 0 5.6 1 7.7 3l5.8-5.8A19.2 19.2 0 0 0 24 4 20 20 0 0 0 5.8 15.1l6.8 5.2c1.6-4.8 6.1-8.4 11.4-8.4Z"/></svg>
                Continue with Google
              </Button>

              <div className="my-5 flex items-center gap-3" aria-hidden="true">
                <span className="h-px flex-1 bg-[#eceaf2]" />
                <span className="text-[10px] font-black uppercase tracking-[0.14em] text-slate-400">or</span>
                <span className="h-px flex-1 bg-[#eceaf2]" />
              </div>
            </>
          )}

          <form onSubmit={handleSubmit} className={isAdminMode ? "mt-6 space-y-4" : "space-y-4"}>
            {!isAdminMode && tab === "signup" && (
              <div className="space-y-1.5">
                <Label htmlFor="name" className="text-xs font-bold text-slate-700">Full name</Label>
                <div className="relative">
                  <Input
                    id="name"
                    type="text"
                    autoComplete="name"
                    enterKeyHint="next"
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); document.getElementById("email")?.focus(); } }}
                    placeholder="Enter your full name"
                    className="h-12 rounded-xl border-[#dedbe8] bg-white px-3 text-sm focus-visible:ring-[#6657e8]"
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
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  enterKeyHint="next"
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); document.getElementById("password")?.focus(); } }}
                  placeholder={isAdminMode ? "Enter your admin email" : "Enter your email"}
                  className="h-12 rounded-xl border-[#dedbe8] bg-white px-3 text-sm focus-visible:ring-[#6657e8]"
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

              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPass ? "text" : "password"}
                  autoComplete={tab === "signup" ? "new-password" : "current-password"}
                  enterKeyHint="done"
                  minLength={tab === "signup" ? 6 : undefined}
                  placeholder={isAdminMode ? "Enter admin password" : tab === "signup" ? "Create a password" : "Enter your password"}
                  className="h-12 rounded-xl border-[#dedbe8] bg-white px-3 pr-12 text-sm focus-visible:ring-[#6657e8]"
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

              <div className="auth-forgot-row">                {tab === "login" && (
                  <button
                    type="button"
                    onClick={handleForgotPassword}
                    className="auth-forgot min-h-11 rounded-lg px-2 text-xs font-bold text-[#6657e8] transition hover:bg-[#f5f2ff] hover:text-[#5547d3] disabled:opacity-50"
                    disabled={loading}
                    data-testid="btn-forgot-password"
                  >
                    Forgot password?
                  </button>
                )}</div>

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
              {loading ? "Please wait..." : isAdminMode ? "Enter Admin Console" : tab === "login" ? "Log in" : "Create account"}
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
                  Already have an account? <button type="button" data-testid="tab-login" onClick={() => setTab("login")} className="auth-inline-login">Log in</button>
                </p>
              ) : (
                <p className="mt-5 text-center text-xs text-slate-500">
                  Don’t have an account? <button type="button" data-testid="tab-signup" onClick={() => setTab("signup")} className="min-h-11 rounded-lg px-2 font-bold text-[#6657e8] hover:bg-[#f5f2ff]">Sign up</button>
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

        </section>
        </div>
        <p className="auth-legal"><a href="/terms-and-conditions">Terms</a><span aria-hidden="true"> · </span><a href="/privacy-policy">Privacy</a></p>
      </main>
    </div>
  );
}
