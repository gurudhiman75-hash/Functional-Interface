import { lazy, Suspense, useEffect, useState } from "react";
import { Redirect, Route, Router as WouterRouter, Switch, useLocation } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MathJaxContext } from "better-react-mathjax";

import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { AppLayout } from "@/components/AppLayout";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { syncAuthSession } from "@/lib/auth";
import { getUser } from "@/lib/storage";
import { ExamCatalogProvider } from "@/providers/ExamCatalogProvider";

const MATH_JAX_CONFIG = {
  loader: { load: ["input/tex", "output/chtml", "[tex]/ams", "[tex]/boldsymbol"] },
  tex: {
    inlineMath: [["$", "$"], ["\\(", "\\)"]],
    displayMath: [["$$", "$$"], ["\\[", "\\]"]],
    processEscapes: true,
    packages: { "[+]": ["ams", "boldsymbol"] },
  },
  options: { ignoreHtmlClass: "tex2jax_ignore", processHtmlClass: "math-only" },
};

const Home = lazy(() => import("@/pages/home"));
const Login = lazy(() => import("@/pages/login"));
const AccountRecovery = lazy(() => import("@/pages/account-recovery"));
const AccountDeletion = lazy(() => import("@/pages/account-deletion"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const Tests = lazy(() => import("@/pages/tests"));
const TestSeries = lazy(() => import("@/pages/test-series"));
const PublishedTest = lazy(() => import("@/pages/published-test"));
const Category = lazy(() => import("@/pages/category"));
const Subcategory = lazy(() => import("@/pages/subcategory"));
const Test = lazy(() => import("@/pages/test"));
const Result = lazy(() => import("@/pages/canonical-result"));
const Profile = lazy(() => import("@/pages/profile"));
const About = lazy(() => import("@/pages/about"));
const Contact = lazy(() => import("@/pages/contact"));
const PrivacyPolicy = lazy(() => import("@/pages/privacy-policy"));
const TermsAndConditions = lazy(() => import("@/pages/terms-and-conditions"));
const RefundPolicy = lazy(() => import("@/pages/refund-policy"));
const FAQ = lazy(() => import("@/pages/faq"));
const ExamsCovered = lazy(() => import("@/pages/exams-covered"));
const MockTestsHub = lazy(() => import("@/pages/mock-tests"));
const PYQHub = lazy(() => import("@/pages/pyqs"));
const Blog = lazy(() => import("@/pages/blog"));
const ReportQuestion = lazy(() => import("@/pages/report-question"));
const SeoLanding = lazy(() => import("@/pages/seo-landing"));
const UnavailableFeature = lazy(() => import("@/pages/unavailable-feature"));
const NotFound = lazy(() => import("@/pages/not-found"));

const DEFAULT_LOCAL_ADMIN_ORIGIN = "http://localhost:5174";
function resolveAdminDestination(pathname: string): string {
  if (import.meta.env.DEV) {
    const configuredOrigin = String(import.meta.env.VITE_ADMIN_APP_URL ?? "").trim();
    const localOrigin = configuredOrigin || DEFAULT_LOCAL_ADMIN_ORIGIN;
    return new URL(pathname, localOrigin.endsWith("/") ? localOrigin : `${localOrigin}/`).toString();
  }
  return new URL(pathname, window.location.origin).toString();
}
function AdminRedirect({ to = "/admin/" }: { to?: string }) {
  const [loopDetected, setLoopDetected] = useState(false);
  const [destination, setDestination] = useState("");
  useEffect(() => {
    const target = resolveAdminDestination(to); setDestination(target);
    const currentUrl = new URL(window.location.href); const targetUrl = new URL(target);
    if (currentUrl.origin === targetUrl.origin && currentUrl.pathname === targetUrl.pathname && currentUrl.search === targetUrl.search) { setLoopDetected(true); return; }
    window.location.assign(target);
  }, [to]);
  if (loopDetected) return <div className="examtree-shell min-h-screen bg-background"><div className="mx-auto flex min-h-screen max-w-xl items-center px-4 py-12 sm:px-6"><div className="w-full rounded-2xl border bg-card p-6 shadow-sm"><p className="text-sm font-semibold text-destructive">Admin application bundle is not being served</p><h1 className="mt-2 text-2xl font-bold">The refresh loop has been stopped.</h1><p className="mt-3 text-sm leading-6 text-muted-foreground">This student application received an admin URL. In local development, run the student and admin applications together. In deployment, build the combined Firebase output before publishing.</p><div className="mt-5 rounded-lg border bg-muted/30 p-3 font-mono text-xs text-muted-foreground">Local: pnpm run dev:frontend<br />Deploy: pnpm run deploy:web</div>{destination && <a href={destination} className="mt-5 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">Open admin application</a>}</div></div></div>;
  return <RouteSkeleton />;
}

const queryClient = new QueryClient();
function ProtectedRoute({ component: Component }: { component: React.ComponentType }) { const user = getUser(); const [location] = useLocation(); if (!user) return <Redirect to={`/login/student?next=${encodeURIComponent(location)}`} />; return <Component />; }
function AnalyticsUnavailable() { return <UnavailableFeature title="Performance analytics is being rebuilt" description="Server-backed rankings, percentiles, weak-area analysis, and cross-device progress will appear here after the canonical analytics APIs are complete." />; }
function CommerceUnavailable() { return <UnavailableFeature title="Packages and payments are not live yet" description="Canonical packages, Razorpay verification, orders, coupons, and entitlements are still being implemented. Live tests remain available through the Tests section." />; }
function LoginRecoveryShortcut({ location }: { location: string }) { if (location !== '/login' && !location.startsWith('/login/student')) return null; return <a href="/account-recovery" className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full border bg-background px-4 py-2 text-sm font-medium text-primary shadow-lg hover:bg-muted">Can’t access your account?</a>; }

function Router() {
  const [location] = useLocation();
  const renderRoute = (Component: React.ComponentType) => <AppLayout><Component /></AppLayout>;
  return <Suspense fallback={<RouteSkeleton />}><div key={location} className="animate-fadeInUp"><Switch>
    <Route path="/" component={() => renderRoute(Home)} />
    <Route path="/login" component={() => renderRoute(Login)} />
    <Route path="/login/student" component={() => renderRoute(Login)} />
    <Route path="/login/admin" component={() => renderRoute(Login)} />
    <Route path="/account-recovery" component={() => renderRoute(AccountRecovery)} />
    <Route path="/account-deletion" component={() => renderRoute(AccountDeletion)} />
    <Route path="/dashboard" component={() => renderRoute(Dashboard)} />
    <Route path="/exams" component={() => renderRoute(Tests)} />
    <Route path="/tests" component={() => renderRoute(Tests)} />
    <Route path="/test-series/:id" component={() => <ProtectedRoute component={TestSeries} />} />
    <Route path="/published-tests/:id" component={() => renderRoute(PublishedTest)} />
    <Route path="/category/:id" component={() => renderRoute(Category)} />
    <Route path="/subcategory/:id" component={() => renderRoute(Subcategory)} />
    <Route path="/test/:id" component={() => <ProtectedRoute component={Test} />} />
    <Route path="/result" component={() => renderRoute(Result)} />
    <Route path="/performance" component={() => renderRoute(AnalyticsUnavailable)} />
    <Route path="/packages/success/:id" component={() => renderRoute(CommerceUnavailable)} />
    <Route path="/packages/:id" component={() => renderRoute(CommerceUnavailable)} />
    <Route path="/packages" component={() => renderRoute(CommerceUnavailable)} />
    <Route path="/my-packages" component={() => renderRoute(CommerceUnavailable)} />
    <Route path="/profile" component={() => renderRoute(Profile)} />
    <Route path="/about" component={() => renderRoute(About)} />
    <Route path="/contact" component={() => renderRoute(Contact)} />
    <Route path="/privacy" component={() => renderRoute(PrivacyPolicy)} />
    <Route path="/privacy-policy" component={() => renderRoute(PrivacyPolicy)} />
    <Route path="/terms-and-conditions" component={() => renderRoute(TermsAndConditions)} />
    <Route path="/refund-policy" component={() => renderRoute(RefundPolicy)} />
    <Route path="/faq" component={() => renderRoute(FAQ)} />
    <Route path="/exams-covered" component={() => renderRoute(ExamsCovered)} />
    <Route path="/mock-tests" component={() => renderRoute(MockTestsHub)} />
    <Route path="/pyqs" component={() => renderRoute(PYQHub)} />
    <Route path="/blog" component={() => renderRoute(Blog)} />
    <Route path="/report-question" component={() => renderRoute(ReportQuestion)} />
    <Route path="/ssc-cgl-pyqs" component={() => renderRoute(SeoLanding)} />
    <Route path="/punjab-police-mock-tests" component={() => renderRoute(SeoLanding)} />
    <Route path="/ibps-clerk-syllabus" component={() => renderRoute(SeoLanding)} />
    <Route path="/admin" component={() => <AdminRedirect />} />
    <Route path="/admin/generator" component={() => <AdminRedirect to="/admin/content/questions/generate" />} />
    <Route component={() => renderRoute(NotFound)} />
  </Switch><LoginRecoveryShortcut location={location} /></div></Suspense>;
}
function RouteSkeleton() { return <div className="examtree-shell min-h-screen bg-background"><div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8"><div className="space-y-5"><div className="skeleton-shimmer h-12 w-48 rounded-md" /><div className="grid gap-4 md:grid-cols-3"><div className="skeleton-shimmer h-40 rounded-md" /><div className="skeleton-shimmer h-40 rounded-md" /><div className="skeleton-shimmer h-40 rounded-md" /></div><div className="skeleton-shimmer h-72 rounded-md" /></div></div></div>; }
function App() { useEffect(() => { let unsubscribe = () => {}; try { unsubscribe = syncAuthSession(); } catch (error) { console.warn("Auth sync failed, continuing without auth:", error); } return () => unsubscribe(); }, []); return <AppErrorBoundary><MathJaxContext version={3} config={MATH_JAX_CONFIG}><QueryClientProvider client={queryClient}><ExamCatalogProvider><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}><Router /></WouterRouter><Toaster /></TooltipProvider></ExamCatalogProvider></QueryClientProvider></MathJaxContext></AppErrorBoundary>; }
export default App;
