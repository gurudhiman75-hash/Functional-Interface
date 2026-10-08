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
const ExamCollectionPage = lazy(() => import("@/pages/exam-collection"));
const Home = lazy(() => import("@/pages/home"));
const Login = lazy(() => import("@/pages/login"));
const AccountRecovery = lazy(() => import("@/pages/account-recovery"));
const AccountDeletion = lazy(() => import("@/pages/account-deletion"));
const Dashboard = lazy(() => import("@/pages/dashboard"));
const PerformanceOverview = lazy(() => import("@/pages/performance-overview"));
const Tests = lazy(() => import("@/pages/tests"));
const TestSeries = lazy(() => import("@/pages/test-series"));
const PublishedTest = lazy(() => import("@/pages/published-test"));
const Category = lazy(() => import("@/pages/category"));
const Subcategory = lazy(() => import("@/pages/subcategory"));
const Test = lazy(() => import("@/pages/test"));
const Result = lazy(() => import("@/pages/canonical-result"));
const Preparation = lazy(() => import("@/pages/preparation"));
const Profile = lazy(() => import("@/pages/profile"));
const Bookmarks = lazy(() => import("@/pages/bookmarks"));
const Store = lazy(() => import("@/pages/store"));
const PurchasedPackage = lazy(() => import("@/pages/purchased-package"));
const OrderStatus = lazy(() => import("@/pages/order-status"));
const StoreProduct = lazy(() => import("@/pages/store-product"));
const MyPurchases = lazy(() => import("@/pages/my-purchases"));
const Resources = lazy(() => import("@/pages/resources"));
const ResourceDetail = lazy(() => import("@/pages/resource-detail"));
const About = lazy(() => import("@/pages/about"));
const Contact = lazy(() => import("@/pages/contact"));
const PrivacyPolicy = lazy(() => import("@/pages/privacy-policy"));
const TermsAndConditions = lazy(() => import("@/pages/terms-and-conditions"));
const RefundPolicy = lazy(() => import("@/pages/refund-policy"));
const Disclaimer = lazy(() => import("@/pages/disclaimer"));
const BillingHelp = lazy(() => import("@/pages/billing-help"));
const GrievanceRedressal = lazy(() => import("@/pages/grievance-redressal"));
const Accessibility = lazy(() => import("@/pages/accessibility"));
const FAQ = lazy(() => import("@/pages/faq"));
const ExamsCovered = lazy(() => import("@/pages/exams-covered"));
const MockTestsHub = lazy(() => import("@/pages/mock-tests"));
const PYQHub = lazy(() => import("@/pages/pyqs"));
const Blog = lazy(() => import("@/pages/blog"));
const ReportQuestion = lazy(() => import("@/pages/report-question"));
const SeoLanding = lazy(() => import("@/pages/seo-landing"));
const ConfiguredExamHub = lazy(() => import("@/pages/exam-acquisition").then((module) => ({ default: module.ConfiguredExamHub })));
const ConfiguredExamDetails = lazy(() => import("@/pages/exam-acquisition").then((module) => ({ default: module.ConfiguredExamDetails })));
const ConfiguredExamPreparation = lazy(() => import("@/pages/exam-acquisition").then((module) => ({ default: module.ConfiguredExamPreparation })));
const ConfiguredExamSyllabus = lazy(() => import("@/pages/exam-acquisition").then((module) => ({ default: module.ConfiguredExamSyllabus })));
const ConfiguredExamQuestions = lazy(() => import("@/pages/exam-acquisition").then((module) => ({ default: module.ConfiguredExamQuestions })));
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
          <Route path="/login" component={() => <Login />} />
          <Route path="/login/student" component={() => <Login />} />
          <Route path="/login/admin" component={() => <Login />} />
          <Route path="/preparation" component={() => <Preparation />} />
          <Route path="/account-recovery" component={() => <AccountRecovery />} />
          <Route path="/account-deletion" component={() => renderPublicRoute(AccountDeletion)} />

          <Route path="/collections/:slug" component={() => renderCatalogPublicRoute(ExamCollectionPage)} />
          <Route path="/collections" component={() => renderCatalogPublicRoute(ExamCollectionPage)} />
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

          <Route path="/checkout/:id" component={() => <ProtectedRoute component={StoreProduct} layout="none" />} />
          <Route path="/orders/:id" component={() => <ProtectedRoute component={OrderStatus} />} />
          <Route path="/store/product/:id" component={() => renderPublicRoute(StoreProduct)} />
          <Route path="/store" component={() => renderPublicRoute(Store)} />
          <Route path="/packages/success/:id" component={() => <Redirect to="/my-packages" />} />
          <Route path="/packages/:id" component={() => renderPublicRoute(StoreProduct)} />
          <Route path="/packages" component={() => renderPublicRoute(Store)} />

          <Route path="/dashboard" component={() => <ProtectedRoute component={Dashboard} />} />
          <Route path="/my-packages/:id" component={() => <ProtectedRoute component={PurchasedPackage} />} />
          <Route path="/my-packages" component={() => <ProtectedRoute component={MyPurchases} />} />
          <Route path="/purchases" component={() => <ProtectedRoute component={MyPurchases} />} />
          <Route path="/bookmarks" component={() => <ProtectedRoute component={Bookmarks} />} />
          <Route path="/test-series/:id" component={() => <ProtectedRoute component={TestSeries} />} />
          <Route path="/test/:id" component={() => <ProtectedRoute component={Test} layout="none" />} />
          <Route path="/result" component={() => <ProtectedRoute component={Result} />} />
          <Route path="/performance" component={() => <ProtectedRoute component={PerformanceOverview} />} />
          <Route path="/profile" component={() => <ProtectedRoute component={Profile} />} />
          <Route path="/report-question" component={() => renderAppRoute(ReportQuestion)} />

          <Route path="/about" component={() => renderPublicRoute(About)} />
          <Route path="/contact" component={() => renderPublicRoute(Contact)} />
          <Route path="/privacy" component={() => renderPublicRoute(PrivacyPolicy)} />
          <Route path="/privacy-policy" component={() => renderPublicRoute(PrivacyPolicy)} />
          <Route path="/terms-and-conditions" component={() => renderPublicRoute(TermsAndConditions)} />
          <Route path="/refund-policy" component={() => renderPublicRoute(RefundPolicy)} />
          <Route path="/cancellation-policy" component={() => renderPublicRoute(RefundPolicy)} />
          <Route path="/cancellation-refund-policy" component={() => renderPublicRoute(RefundPolicy)} />
          <Route path="/disclaimer" component={() => renderPublicRoute(Disclaimer)} />
          <Route path="/billing-help" component={() => renderPublicRoute(BillingHelp)} />
          <Route path="/grievance-redressal" component={() => renderPublicRoute(GrievanceRedressal)} />
          <Route path="/accessibility" component={() => renderPublicRoute(Accessibility)} />
          <Route path="/faq" component={() => renderPublicRoute(FAQ)} />
          <Route path="/exams-covered" component={() => renderPublicRoute(ExamsCovered)} />
          <Route path="/mock-tests" component={() => renderCatalogPublicRoute(MockTestsHub)} />
          <Route path="/pyqs" component={() => renderPublicRoute(PYQHub)} />
          <Route path="/blog" component={() => renderPublicRoute(Blog)} />
          <Route path="/ssc-cgl" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="ssc-cgl" />)} />
          <Route path="/ssc-cgl-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="ssc-cgl" />)} />
          <Route path="/ssc-cgl-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="ssc-cgl" />)} />
          <Route path="/ssc-cgl/questions/:topicSlug" component={() => renderPublicRoute(() => <ConfiguredExamQuestions examSlug="ssc-cgl" />)} />
          <Route path="/ssc-chsl" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="ssc-chsl" />)} />
          <Route path="/ssc-chsl-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="ssc-chsl" />)} />
          <Route path="/ssc-chsl-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="ssc-chsl" />)} />
          <Route path="/ssc-chsl/questions/:topicSlug" component={() => renderPublicRoute(() => <ConfiguredExamQuestions examSlug="ssc-chsl" />)} />
          <Route path="/ssc-mts" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="ssc-mts" />)} />
          <Route path="/ssc-mts-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="ssc-mts" />)} />
          <Route path="/ssc-mts-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="ssc-mts" />)} />
          <Route path="/ssc-mts/questions/:topicSlug" component={() => renderPublicRoute(() => <ConfiguredExamQuestions examSlug="ssc-mts" />)} />
          <Route path="/ssc-cpo" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="ssc-cpo" />)} />
          <Route path="/ssc-cpo-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="ssc-cpo" />)} />
          <Route path="/ssc-cpo-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="ssc-cpo" />)} />
          <Route path="/ssc-cpo/questions/:topicSlug" component={() => renderPublicRoute(() => <ConfiguredExamQuestions examSlug="ssc-cpo" />)} />
          <Route path="/ssc-stenographer" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="ssc-stenographer" />)} />
          <Route path="/ssc-stenographer-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="ssc-stenographer" />)} />
          <Route path="/ssc-stenographer-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="ssc-stenographer" />)} />
          <Route path="/ssc-stenographer/questions/:topicSlug" component={() => renderPublicRoute(() => <ConfiguredExamQuestions examSlug="ssc-stenographer" />)} />
          <Route path="/ssc-gd" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="ssc-gd" />)} />
          <Route path="/ssc-gd-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="ssc-gd" />)} />
          <Route path="/ssc-gd-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="ssc-gd" />)} />
          <Route path="/ssc-gd/questions/:topicSlug" component={() => renderPublicRoute(() => <ConfiguredExamQuestions examSlug="ssc-gd" />)} />
          <Route path="/ibps-po" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="ibps-po" />)} />
          <Route path="/ibps-po-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="ibps-po" />)} />
          <Route path="/ibps-po-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="ibps-po" />)} />
          <Route path="/ibps-po/questions/:topicSlug" component={() => renderPublicRoute(() => <ConfiguredExamQuestions examSlug="ibps-po" />)} />
          <Route path="/ibps-clerk" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="ibps-clerk" />)} />
          <Route path="/ibps-clerk-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="ibps-clerk" />)} />
          <Route path="/ibps-clerk-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="ibps-clerk" />)} />
          <Route path="/ibps-clerk/questions/:topicSlug" component={() => renderPublicRoute(() => <ConfiguredExamQuestions examSlug="ibps-clerk" />)} />
          <Route path="/ibps-rrb-po" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="ibps-rrb-po" />)} />
          <Route path="/ibps-rrb-po-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="ibps-rrb-po" />)} />
          <Route path="/ibps-rrb-po-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="ibps-rrb-po" />)} />
          <Route path="/ibps-rrb-po/questions/:topicSlug" component={() => renderPublicRoute(() => <ConfiguredExamQuestions examSlug="ibps-rrb-po" />)} />
          <Route path="/ibps-rrb-office-assistant" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="ibps-rrb-office-assistant" />)} />
          <Route path="/ibps-rrb-office-assistant-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="ibps-rrb-office-assistant" />)} />
          <Route path="/ibps-rrb-office-assistant-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="ibps-rrb-office-assistant" />)} />
          <Route path="/ibps-rrb-office-assistant/questions/:topicSlug" component={() => renderPublicRoute(() => <ConfiguredExamQuestions examSlug="ibps-rrb-office-assistant" />)} />
          <Route path="/ssc-selection-post" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="ssc-selection-post" />)} />
          <Route path="/ssc-selection-post-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="ssc-selection-post" />)} />
          <Route path="/ssc-selection-post-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="ssc-selection-post" />)} />
          <Route path="/ssc-selection-post/questions/:topicSlug" component={() => renderPublicRoute(() => <ConfiguredExamQuestions examSlug="ssc-selection-post" />)} />
          <Route path="/ssc-je" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="ssc-je" />)} />
          <Route path="/ssc-je-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="ssc-je" />)} />
          <Route path="/ssc-je-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="ssc-je" />)} />
          <Route path="/ssc-je/questions/:topicSlug" component={() => renderPublicRoute(() => <ConfiguredExamQuestions examSlug="ssc-je" />)} />
          <Route path="/sbi-po" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="sbi-po" />)} />
          <Route path="/sbi-po-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="sbi-po" />)} />
          <Route path="/sbi-po-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="sbi-po" />)} />
          <Route path="/sbi-po/questions/:topicSlug" component={() => renderPublicRoute(() => <ConfiguredExamQuestions examSlug="sbi-po" />)} />
          <Route path="/sbi-clerk" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="sbi-clerk" />)} />
          <Route path="/sbi-clerk-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="sbi-clerk" />)} />
          <Route path="/sbi-clerk-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="sbi-clerk" />)} />
          <Route path="/sbi-clerk/questions/:topicSlug" component={() => renderPublicRoute(() => <ConfiguredExamQuestions examSlug="sbi-clerk" />)} />
          <Route path="/rbi-assistant" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="rbi-assistant" />)} />
          <Route path="/rbi-assistant-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="rbi-assistant" />)} />
          <Route path="/rbi-assistant-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="rbi-assistant" />)} />
          <Route path="/rbi-assistant/questions/:topicSlug" component={() => renderPublicRoute(() => <ConfiguredExamQuestions examSlug="rbi-assistant" />)} />
          <Route path="/rbi-grade-b" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="rbi-grade-b" />)} />
          <Route path="/rbi-grade-b-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="rbi-grade-b" />)} />
          <Route path="/rbi-grade-b-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="rbi-grade-b" />)} />
          <Route path="/rbi-grade-b/questions/:topicSlug" component={() => renderPublicRoute(() => <ConfiguredExamQuestions examSlug="rbi-grade-b" />)} />
          <Route path="/nabard-grade-a" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="nabard-grade-a" />)} />
          <Route path="/nabard-grade-a-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="nabard-grade-a" />)} />
          <Route path="/nabard-grade-a-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="nabard-grade-a" />)} />
          <Route path="/nabard-grade-a/questions/:topicSlug" component={() => renderPublicRoute(() => <ConfiguredExamQuestions examSlug="nabard-grade-a" />)} />
          <Route path="/sebi-grade-a" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="sebi-grade-a" />)} />
          <Route path="/sebi-grade-a-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="sebi-grade-a" />)} />
          <Route path="/sebi-grade-a-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="sebi-grade-a" />)} />
          <Route path="/sebi-grade-a/questions/:topicSlug" component={() => renderPublicRoute(() => <ConfiguredExamQuestions examSlug="sebi-grade-a" />)} />
          <Route path="/punjab-police-constable" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="punjab-police-constable" />)} />
          <Route path="/punjab-police-constable-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="punjab-police-constable" />)} />
          <Route path="/punjab-police-constable-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="punjab-police-constable" />)} />
          <Route path="/punjab-police-constable/questions/:topicSlug" component={() => renderPublicRoute(() => <ConfiguredExamQuestions examSlug="punjab-police-constable" />)} />
          <Route path="/punjab-police-si" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="punjab-police-si" />)} />
          <Route path="/punjab-police-si-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="punjab-police-si" />)} />
          <Route path="/punjab-police-si-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="punjab-police-si" />)} />
          <Route path="/punjab-police-si/questions/:topicSlug" component={() => renderPublicRoute(() => <ConfiguredExamQuestions examSlug="punjab-police-si" />)} />
          <Route path="/psssb-clerk" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="psssb-clerk" />)} />
          <Route path="/psssb-clerk-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="psssb-clerk" />)} />
          <Route path="/psssb-clerk-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="psssb-clerk" />)} />
          <Route path="/psssb-clerk/questions/:topicSlug" component={() => renderPublicRoute(() => <ConfiguredExamQuestions examSlug="psssb-clerk" />)} />
          <Route path="/punjab-patwari" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="punjab-patwari" />)} />
          <Route path="/punjab-patwari-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="punjab-patwari" />)} />
          <Route path="/punjab-patwari-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="punjab-patwari" />)} />
          <Route path="/punjab-patwari/questions/:topicSlug" component={() => renderPublicRoute(() => <ConfiguredExamQuestions examSlug="punjab-patwari" />)} />
          <Route path="/psssb-excise-taxation-inspector" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="psssb-excise-taxation-inspector" />)} />
          <Route path="/psssb-excise-taxation-inspector-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="psssb-excise-taxation-inspector" />)} />
          <Route path="/psssb-excise-taxation-inspector-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="psssb-excise-taxation-inspector" />)} />
          <Route path="/psssb-excise-taxation-inspector/questions/:topicSlug" component={() => renderPublicRoute(() => <ConfiguredExamQuestions examSlug="psssb-excise-taxation-inspector" />)} />
          <Route path="/punjab-naib-tehsildar" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="punjab-naib-tehsildar" />)} />
          <Route path="/punjab-naib-tehsildar-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="punjab-naib-tehsildar" />)} />
          <Route path="/punjab-naib-tehsildar-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="punjab-naib-tehsildar" />)} />
          <Route path="/punjab-naib-tehsildar/questions/:topicSlug" component={() => renderPublicRoute(() => <ConfiguredExamQuestions examSlug="punjab-naib-tehsildar" />)} />
          <Route path="/punjab-pcs" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="punjab-pcs" />)} />
          <Route path="/punjab-pcs-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="punjab-pcs" />)} />
          <Route path="/punjab-pcs-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="punjab-pcs" />)} />
          <Route path="/punjab-pcs/questions/:topicSlug" component={() => renderPublicRoute(() => <ConfiguredExamQuestions examSlug="punjab-pcs" />)} />
          <Route path="/psssb-senior-assistant" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="psssb-senior-assistant" />)} />
          <Route path="/psssb-senior-assistant-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="psssb-senior-assistant" />)} />
          <Route path="/psssb-senior-assistant-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="psssb-senior-assistant" />)} />
          <Route path="/psssb-senior-assistant/questions/:topicSlug" component={() => renderPublicRoute(() => <ConfiguredExamQuestions examSlug="psssb-senior-assistant" />)} />
          <Route path="/psssb-vdo" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="psssb-vdo" />)} />
          <Route path="/psssb-vdo-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="psssb-vdo" />)} />
          <Route path="/psssb-vdo-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="psssb-vdo" />)} />
          <Route path="/psssb-vdo/questions/:topicSlug" component={() => renderPublicRoute(() => <ConfiguredExamQuestions examSlug="psssb-vdo" />)} />
          <Route path="/punjab-jail-warder" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="punjab-jail-warder" />)} />
          <Route path="/punjab-jail-warder-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="punjab-jail-warder" />)} />
          <Route path="/punjab-jail-warder-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="punjab-jail-warder" />)} />
          <Route path="/punjab-jail-warder/questions/:topicSlug" component={() => renderPublicRoute(() => <ConfiguredExamQuestions examSlug="punjab-jail-warder" />)} />
          <Route path="/punjab-police-intelligence-assistant" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="punjab-police-intelligence-assistant" />)} />
          <Route path="/punjab-police-intelligence-assistant-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="punjab-police-intelligence-assistant" />)} />
          <Route path="/punjab-police-intelligence-assistant-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="punjab-police-intelligence-assistant" />)} />
          <Route path="/punjab-police-intelligence-assistant/questions/:topicSlug" component={() => renderPublicRoute(() => <ConfiguredExamQuestions examSlug="punjab-police-intelligence-assistant" />)} />
          <Route path="/pspcl-alm" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="pspcl-alm" />)} />
          <Route path="/pspcl-alm-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="pspcl-alm" />)} />
          <Route path="/pspcl-alm-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="pspcl-alm" />)} />
          <Route path="/pspcl-alm/questions/:topicSlug" component={() => renderPublicRoute(() => <ConfiguredExamQuestions examSlug="pspcl-alm" />)} />
          <Route path="/pspcl-revenue-accountant" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="pspcl-revenue-accountant" />)} />
          <Route path="/pspcl-revenue-accountant-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="pspcl-revenue-accountant" />)} />
          <Route path="/pspcl-revenue-accountant-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="pspcl-revenue-accountant" />)} />
          <Route path="/pspcl-revenue-accountant/questions/:topicSlug" component={() => renderPublicRoute(() => <ConfiguredExamQuestions examSlug="pspcl-revenue-accountant" />)} />
          <Route path="/rrb-ntpc" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="rrb-ntpc" />)} />
          <Route path="/rrb-ntpc-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="rrb-ntpc" />)} />
          <Route path="/rrb-ntpc-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="rrb-ntpc" />)} />
          <Route path="/rrb-group-d" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="rrb-group-d" />)} />
          <Route path="/rrb-group-d-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="rrb-group-d" />)} />
          <Route path="/rrb-group-d-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="rrb-group-d" />)} />
          <Route path="/rrb-alp" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="rrb-alp" />)} />
          <Route path="/rrb-alp-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="rrb-alp" />)} />
          <Route path="/rrb-alp-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="rrb-alp" />)} />
          <Route path="/rrb-technician" component={() => renderCatalogPublicRoute(() => <ConfiguredExamHub examSlug="rrb-technician" />)} />
          <Route path="/rrb-technician-preparation" component={() => renderPublicRoute(() => <ConfiguredExamPreparation examSlug="rrb-technician" />)} />
          <Route path="/rrb-technician-syllabus" component={() => renderPublicRoute(() => <ConfiguredExamSyllabus examSlug="rrb-technician" />)} />
          <Route path="/:examSlug/details" component={() => renderCatalogPublicRoute(ConfiguredExamDetails)} />
          <Route path="/ssc-cgl-pyqs" component={() => renderPublicRoute(SeoLanding)} />
          <Route path="/punjab-police-mock-tests" component={() => renderPublicRoute(SeoLanding)} />

          <Route path="/admin" component={() => <AdminRedirect />} />
          <Route path="/admin/generator" component={() => <AdminRedirect to="/admin/content/questions/generate" />} />
          <Route component={() => renderPublicRoute(NotFound)} />
        </Switch>
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