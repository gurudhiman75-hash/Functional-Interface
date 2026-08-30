import { lazy, Suspense, useEffect, useState } from "react";
import { Redirect, Route, Router as WouterRouter, Switch, useLocation, useSearch } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { AppErrorBoundary } from "@/components/AppErrorBoundary";
import { PublicLayout } from "@/components/PublicLayout";
import { RouteAuthSessionSync } from "@/components/RouteAuthSessionSync";
import { RouteCatalogBoundary } from "@/components/RouteCatalogBoundary";
import { RouteMathBoundary } from "@/components/RouteMathBoundary";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { getSessionUser } from "@/lib/session-user";

const AppLayout = lazy(() => import("@/components/AppLayout").then((module) => ({ default: module.AppLayout })));
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
const Bookmarks = lazy(() => import("@/pages/bookmarks"));
const Store = lazy(() => import("@/pages/store"));
const StoreProduct = lazy(() => import("@/pages/store-product"));
const MyPurchases = lazy(() => import("@/pages/my-purchases"));
const Resources = lazy(() => import("@/pages/resources"));
const ResourceDetail = lazy(() => import("@/pages/resource-detail"));
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
    const target = resolveAdminDestination(to);
    setDestination(target);
    const currentUrl = new URL(window.location.href);
    const targetUrl = new URL(target);
    if (
      currentUrl.origin === targetUrl.origin &&
      currentUrl.pathname === targetUrl.pathname &&
      currentUrl.search === targetUrl.search
    ) {
      setLoopDetected(true);
      return;
    }
    window.location.assign(target);
  }, [to]);

  if (loopDetected) {
    return (
      <div className="examtree-shell min-h-screen bg-background">
        <div className="mx-auto flex min-h-screen max-w-xl items-center px-4 py-12 sm:px-6">
          <div className="w-full rounded-2xl border bg-card p-6 shadow-sm">
            <p className="text-sm font-semibold text-destructive">Admin application bundle is not being served</p>
            <h1 className="mt-2 text-2xl font-bold">The refresh loop has been stopped.</h1>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              This student application received an admin URL. In local development, run the student and admin applications together. In deployment, build the combined Firebase output before publishing.
            </p>
            <div className="mt-5 rounded-lg border bg-muted/30 p-3 font-mono text-xs text-muted-foreground">
              Local: pnpm run dev:frontend<br />Deploy: pnpm run deploy:web
            </div>
            {destination && (
              <a href={destination} className="mt-5 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground">
                Open admin application
              </a>
            )}
          </div>
        </div>
      </div>
    );
  }

  return <RouteSkeleton />;
}

const queryClient = new QueryClient();

type ProtectedRouteProps = {
  component: React.ComponentType;
  layout?: "app" | "none";
};

function ProtectedRoute({ component: Component, layout = "app" }: ProtectedRouteProps) {
  const user = getSessionUser();
  const [location] = useLocation();
  const search = useSearch();
  const returnLocation = search ? `${location}?${search}` : location;
  if (!user) return <Redirect to={`/login/student?next=${encodeURIComponent(returnLocation)}`} />;

  return (
    <RouteCatalogBoundary>
      {layout === "none" ? <Component /> : <AppLayout><Component /></AppLayout>}
    </RouteCatalogBoundary>
  );
}

function AnalyticsUnavailable() {
  return (
    <UnavailableFeature
      title="Performance analytics is being rebuilt"
      description="Server-backed rankings, percentiles, weak-area analysis, and cross-device progress will appear here after the canonical analytics APIs are complete."
    />
  );
}

function LoginRecoveryShortcut({ location }: { location: string }) {
  if (location !== "/login" && !location.startsWith("/login/student")) return null;
  return (
    <a
      href="/account-recovery"
      className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2 rounded-full border bg-background px-4 py-2 text-sm font-medium text-primary shadow-lg hover:bg-muted"
    >
      Can’t access your account?
    </a>
  );
}

function Router() {
  const [location] = useLocation();
  const renderPublicRoute = (Component: React.ComponentType) => <PublicLayout><Component /></PublicLayout>;
  const renderCatalogPublicRoute = (Component: React.ComponentType) => (
    <RouteCatalogBoundary><PublicLayout><Component /></PublicLayout></RouteCatalogBoundary>
  );
  const renderAppRoute = (Component: React.ComponentType) => (
    <RouteCatalogBoundary><AppLayout><Component /></AppLayout></RouteCatalogBoundary>
  );

  return (
    <Suspense fallback={<RouteSkeleton />}>
      <div key={location} className="animate-fadeInUp">
        <Switch>
          <Route path="/" component={() => renderCatalogPublicRoute(Home)} />
          <Route path="/login" component={() => renderPublicRoute(Login)} />
          <Route path="/login/student" component={() => renderPublicRoute(Login)} />
          <Route path="/login/admin" component={() => renderPublicRoute(Login)} />
          <Route path="/account-recovery" component={() => renderPublicRoute(AccountRecovery)} />
          <Route path="/account-deletion" component={() => renderPublicRoute(AccountDeletion)} />

          <Route path="/exams" component={() => renderCatalogPublicRoute(Tests)} />
          <Route path="/tests" component={() => renderCatalogPublicRoute(Tests)} />
          <Route path="/published-tests/:id" component={() => renderPublicRoute(PublishedTest)} />
          <Route path="/category/:id" component={() => renderCatalogPublicRoute(Category)} />
          <Route path="/subcategory/:id" component={() => renderCatalogPublicRoute(Subcategory)} />

          <Route path="/resources/item/:id" component={() => renderPublicRoute(ResourceDetail)} />
          <Route path="/resources/current-affairs" component={() => renderPublicRoute(Resources)} />
          <Route path="/resources/notes" component={() => renderPublicRoute(Resources)} />
          <Route path="/resources/papers" component={() => renderPublicRoute(Resources)} />
          <Route path="/resources/quizzes" component={() => renderPublicRoute(Resources)} />
          <Route path="/resources/vocabulary" component={() => renderPublicRoute(Resources)} />
          <Route path="/resources/updates" component={() => renderPublicRoute(Resources)} />
          <Route path="/resources" component={() => renderPublicRoute(Resources)} />
          <Route path="/current-affairs" component={() => renderPublicRoute(Resources)} />

          <Route path="/store/product/:id" component={() => renderPublicRoute(StoreProduct)} />
          <Route path="/store" component={() => renderPublicRoute(Store)} />
          <Route path="/packages/success/:id" component={() => renderPublicRoute(StoreProduct)} />
          <Route path="/packages/:id" component={() => renderPublicRoute(StoreProduct)} />
          <Route path="/packages" component={() => renderPublicRoute(Store)} />

          <Route path="/dashboard" component={() => renderAppRoute(Dashboard)} />
          <Route path="/my-packages" component={() => <ProtectedRoute component={MyPurchases} />} />
          <Route path="/purchases" component={() => <ProtectedRoute component={MyPurchases} />} />
          <Route path="/bookmarks" component={() => <ProtectedRoute component={Bookmarks} />} />
          <Route path="/test-series/:id" component={() => <ProtectedRoute component={TestSeries} />} />
          <Route path="/test/:id" component={() => <ProtectedRoute component={Test} layout="none" />} />
          <Route path="/result" component={() => <ProtectedRoute component={Result} />} />
          <Route path="/performance" component={() => renderAppRoute(AnalyticsUnavailable)} />
          <Route path="/profile" component={() => renderAppRoute(Profile)} />
          <Route path="/report-question" component={() => renderAppRoute(ReportQuestion)} />

          <Route path="/about" component={() => renderPublicRoute(About)} />
          <Route path="/contact" component={() => renderPublicRoute(Contact)} />
          <Route path="/privacy" component={() => renderPublicRoute(PrivacyPolicy)} />
          <Route path="/privacy-policy" component={() => renderPublicRoute(PrivacyPolicy)} />
          <Route path="/terms-and-conditions" component={() => renderPublicRoute(TermsAndConditions)} />
          <Route path="/refund-policy" component={() => renderPublicRoute(RefundPolicy)} />
          <Route path="/faq" component={() => renderPublicRoute(FAQ)} />
          <Route path="/exams-covered" component={() => renderPublicRoute(ExamsCovered)} />
          <Route path="/mock-tests" component={() => renderCatalogPublicRoute(MockTestsHub)} />
          <Route path="/pyqs" component={() => renderPublicRoute(PYQHub)} />
          <Route path="/blog" component={() => renderPublicRoute(Blog)} />
          <Route path="/ssc-cgl-pyqs" component={() => renderPublicRoute(SeoLanding)} />
          <Route path="/punjab-police-mock-tests" component={() => renderPublicRoute(SeoLanding)} />
          <Route path="/ibps-clerk-syllabus" component={() => renderPublicRoute(SeoLanding)} />

          <Route path="/admin" component={() => <AdminRedirect />} />
          <Route path="/admin/generator" component={() => <AdminRedirect to="/admin/content/questions/generate" />} />
          <Route component={() => renderPublicRoute(NotFound)} />
        </Switch>
        <LoginRecoveryShortcut location={location} />
      </div>
    </Suspense>
  );
}

function RouteSkeleton() {
  return (
    <div className="examtree-shell min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="space-y-5">
          <div className="skeleton-shimmer h-12 w-48 rounded-md" />
          <div className="grid gap-4 md:grid-cols-3">
            <div className="skeleton-shimmer h-40 rounded-md" />
            <div className="skeleton-shimmer h-40 rounded-md" />
            <div className="skeleton-shimmer h-40 rounded-md" />
          </div>
          <div className="skeleton-shimmer h-72 rounded-md" />
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <AppErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <RouteAuthSessionSync />
            <RouteMathBoundary>
              <Router />
            </RouteMathBoundary>
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </AppErrorBoundary>
  );
}

export default App;